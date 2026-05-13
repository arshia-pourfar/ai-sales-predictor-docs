import { cn } from '@/lib/utils';

export function Callout({ type = 'info', children, className }: { type?: 'info' | 'warning'; children: React.ReactNode; className?: string }) {
    return (
        <div className={cn(
            "border rounded-xl p-4 my-4 text-sm",
            type === 'info' ? "border-blue-800 bg-blue-900/20 text-blue-300" : "border-yellow-800 bg-yellow-900/20 text-yellow-300",
            className
        )}>
            {children}
        </div>
    );
}