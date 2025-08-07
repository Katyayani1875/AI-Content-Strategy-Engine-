# backend/app/workers/tasks.py (Resilient Version)

import asyncio
from datetime import datetime
from uuid import UUID
from .celery_app import celery_app
from app.db.database import get_db
from app.workers.collectors.google_trends import fetch_google_trends
from app.workers.collectors.reddit import fetch_reddit_trends
import logging

# Get a logger instance
logger = logging.getLogger(__name__)

# This helper function is correct and stays the same.
def run_async(func):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    return loop.run_until_complete(func)

@celery_app.task
def discover_trends_task(job_id: str, topic: str):
    async def _async_task():
        db = get_db()
        job_collection = db["trend_jobs"]

        await job_collection.update_one(
            {"job_id": UUID(job_id)},
            {"$set": {"status": "PROCESSING", "updated_at": datetime.utcnow()}}
        )

        # --- THIS IS THE FIX ---
        # We run the potentially hanging network calls in try/except blocks.

        google_results = None
        try:
            logger.info(f"[{job_id}] Fetching Google Trends for topic: {topic}")
            google_results = fetch_google_trends(topic)
            logger.info(f"[{job_id}] Successfully fetched Google Trends.")
        except Exception as e:
            logger.error(f"[{job_id}] Failed to fetch Google Trends: {e}")

        reddit_results = None
        try:
            logger.info(f"[{job_id}] Fetching Reddit for topic: {topic}")
            reddit_results = fetch_reddit_trends(topic)
            logger.info(f"[{job_id}] Successfully fetched Reddit.")
        except Exception as e:
            # This will catch any error, including a timeout if it hangs.
            logger.error(f"[{job_id}] Failed to fetch Reddit: {e}")

        # --- END OF FIX ---

        # Build the final results dictionary safely, handling None values.
        final_results = {}
        if google_results:
            final_results["google_trends"] = google_results.dict()
        if reddit_results:
            final_results["reddit"] = reddit_results.dict()

        await job_collection.update_one(
            {"job_id": UUID(job_id)},
            {"$set": {
                "status": "COMPLETED",
                "results": final_results,
                "updated_at": datetime.utcnow()
            }}
        )
        return {"status": "COMPLETED", "job_id": job_id}

    return run_async(_async_task())