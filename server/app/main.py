from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import behavior, predict, recommend
from app.core.auth import require_auth

app = FastAPI(title="AI Sales Engine", version="1.0.0")
auth_dependency = [Depends(require_auth)]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes (protected — API key or JWT required)
app.include_router(
    behavior.router,
    prefix="/api/v1/behavior",
    tags=["Behavior"],
    dependencies=auth_dependency,
)
app.include_router(
    predict.router,
    prefix="/api/v1/sales",
    tags=["Sales"],
    dependencies=auth_dependency,
)
app.include_router(
    recommend.router,
    prefix="/api/v1/recommendations",
    tags=["Recommendations"],
    dependencies=auth_dependency,
)

@app.get("/")
async def root():
    return {"message": "AI Sales Engine Running", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}