import os
from dotenv import load_dotenv

load_dotenv()

# Redis/Frontend URLs remain
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# New Config Vars
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "content_strategy_engine"

# Reddit API Credentials
REDDIT_CLIENT_ID = os.getenv("REDDIT_CLIENT_ID")
REDDIT_CLIENT_SECRET = os.getenv("REDDIT_CLIENT_SECRET")
REDDIT_USER_AGENT = os.getenv("REDDIT_USER_AGENT")

if not MONGO_URI:
    raise ValueError("MONGO_URI environment variable not set.")