# File: backend/app/api/v1/api.py

from fastapi import APIRouter
from app.api.v1.endpoints import strategy

api_router = APIRouter()

# Include the strategy router with a prefix and tags
api_router.include_router(strategy.router, prefix="/strategy", tags=["Strategy"])