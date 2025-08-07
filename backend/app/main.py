# backend/app/main.py (Corrected Version)

import logging  # <--- THIS IS THE FIX
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core import config

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the FastAPI app
app = FastAPI(
    title="Content Strategy Engine API",
    version="1.0.0"
)

# CORS Middleware to allow the frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.FRONTEND_URL],  # Allow specific origin from .env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router
app.include_router(api_router, prefix="/api/v1")

@app.get("/health", tags=["Health Check"])
def health_check():
    """
    A simple endpoint to check if the API is running.
    """
    logger.info("Health check endpoint was called successfully.")
    return {"status": "ok"}