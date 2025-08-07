from fastapi import APIRouter
from app.api.v1.endpoints import trends

api_router = APIRouter()
api_router.include_router(trends.router, prefix="/trends", tags=["trends"])