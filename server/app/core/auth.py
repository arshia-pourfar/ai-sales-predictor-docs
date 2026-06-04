import os
from typing import Any

import httpx
import jwt
from fastapi import Header, HTTPException, status

JWT_SECRET = os.getenv("JWT_SECRET", "dev-secret-change-in-production")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def _extract_token(
    authorization: str | None,
    x_api_key: str | None,
) -> str | None:
    if x_api_key:
        return x_api_key.strip()
    if authorization and authorization.lower().startswith("bearer "):
        return authorization[7:].strip()
    return None


async def _validate_api_key(key: str) -> dict[str, Any]:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{FRONTEND_URL}/api/auth/validate-key",
            json={"key": key},
            timeout=5.0,
        )
    if response.status_code != 200:
        detail = "Invalid API key"
        try:
            detail = response.json().get("error", detail)
        except Exception:
            pass
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=detail)
    return response.json()


def _validate_jwt(token: str) -> dict[str, Any]:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return {
            "valid": True,
            "type": "jwt",
            "userId": payload.get("userId"),
            "role": payload.get("role"),
        }
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )


async def require_auth(
    authorization: str | None = Header(None),
    x_api_key: str | None = Header(None, alias="X-API-Key"),
) -> dict[str, Any]:
    token = _extract_token(authorization, x_api_key)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Use Authorization: Bearer <API_KEY or JWT> or X-API-Key header.",
        )

    if token.startswith("ai_sales_"):
        return await _validate_api_key(token)

    return _validate_jwt(token)
