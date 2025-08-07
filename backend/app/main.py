from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router

app = FastAPI(
    title=settings.APP_TITLE,
    version=settings.APP_VERSION,
    openapi_url="/api/v1/openapi.json"
)

# CORS (Cross-Origin Resource Sharing) Middleware
# This is crucial for allowing the frontend (on a different port) to communicate with the backend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the main API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": f"Welcome to the {settings.APP_TITLE}"}