# backend/app/db/database.py (Corrected and Simplified Version)

from motor.motor_asyncio import AsyncIOMotorClient
from app.core import config

# --- THIS IS THE FIX ---
# The modern and correct way to configure UUID handling is directly in the client constructor.
# We tell it to use the 'standard' representation, which is a language-independent binary format.
client = AsyncIOMotorClient(config.MONGO_URI, uuidRepresentation='standard')
# --- END OF FIX ---

# Get the database instance from the configured client
database = client[config.DB_NAME]

def get_db():
    return database