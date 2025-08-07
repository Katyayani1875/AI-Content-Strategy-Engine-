# backend/app/core/config.py

from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_TITLE: str = "AI Content Strategy Engine"
    APP_VERSION: str = "0.1.0"
    GEMINI_API_KEY: str # <-- CHANGE THIS

    class Config:
        env_file = ".env"

settings = Settings()