import { prisma } from './prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production';

// ===== Password =====
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

// ===== JWT =====
export function generateToken(userId: string, role: string): string {
    return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): any {
    return jwt.verify(token, JWT_SECRET);
}

// ===== API Key =====
export function generateApiKey(): string {
    return `ai_sales_${crypto.randomBytes(16).toString('hex')}`;
}

// ===== User Registration =====
export async function registerUser(
    email: string,
    username: string,
    password: string,
    fullName?: string
) {
    // Check existing
    const existing = await prisma.user.findFirst({
        where: {
            OR: [{ email }, { username }],
        },
    });

    if (existing) {
        throw new Error('Email or username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user + API key
    const user = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
            fullName,
            apiKeys: {
                create: {
                    key: generateApiKey(),
                    name: 'Default',
                    rateLimit: 100,
                    dailyLimit: 1000,
                },
            },
        },
        include: {
            apiKeys: true,
        },
    });

    return {
        id: user.id,
        email: user.email,
        username: user.username,
        apiKey: user.apiKeys[0].key,
        role: user.role,
    };
}

// ===== Validate API Key =====
export async function validateApiKey(apiKey: string) {
    const keyRecord = await prisma.apiKey.findUnique({
        where: { key: apiKey },
        include: {
            user: {
                select: {
                    id: true,
                    role: true,
                    isActive: true,
                    isVerified: true,
                }
            }
        },
    });

    if (!keyRecord) {
        throw new Error('Invalid API key');
    }

    if (!keyRecord.isActive) {
        throw new Error('API key has been deactivated');
    }

    if (!keyRecord.user.isActive) {
        throw new Error('Account is suspended');
    }

    if (keyRecord.expiresAt && keyRecord.expiresAt < new Date()) {
        await prisma.apiKey.update({
            where: { id: keyRecord.id },
            data: { isActive: false },
        });
        throw new Error('API key expired. Generate a new one.');
    }

    // آپدیت آخرین استفاده
    await prisma.apiKey.update({
        where: { id: keyRecord.id },
        data: { lastUsedAt: new Date() },
    });

    // لاگینگ (غیرهمزمان - بلاک نمیکنه)
    console.log(`[API] ${new Date().toISOString()} - User:${keyRecord.user.id} Role:${keyRecord.user.role}`);

    return {
        userId: keyRecord.user.id,
        role: keyRecord.user.role,
        keyId: keyRecord.id,
        rateLimit: keyRecord.rateLimit,
        dailyLimit: keyRecord.dailyLimit,
    };
}

// چک دسترسی به endpoint خاص
export function checkPermission(userRole: string, requiredRoles: string[]): boolean {
    return requiredRoles.includes(userRole);
}
