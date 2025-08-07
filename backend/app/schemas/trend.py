# backend/app/schemas/trend.py (Corrected Version)

from pydantic import BaseModel, Field
from uuid import UUID
from typing import List, Optional, Any, Dict

# This class is for the initial request from the frontend
class TrendDiscoveryRequest(BaseModel):
    topic: str
    target_audience_description: Optional[str] = None
    platforms: Optional[List[str]] = ["google", "reddit", "twitter", "youtube"]

# This class is for the immediate response after starting a job
class JobStatusResponse(BaseModel):
    job_id: UUID
    status: str
    message: Optional[str] = None

# These are the schemas for the final, structured results
class GoogleTrendPoint(BaseModel):
    date: str
    value: int

class GoogleTrendRisingQuery(BaseModel):
    query: str
    value: int

class GoogleTrendData(BaseModel):
    interest_over_time: List[GoogleTrendPoint]
    rising_queries: List[GoogleTrendRisingQuery]

class RedditPost(BaseModel):
    title: str
    url: str
    subreddit: str
    upvotes: int

class RedditData(BaseModel):
    top_threads: List[RedditPost]

class TrendResults(BaseModel):
    google_trends: Optional[GoogleTrendData] = None
    reddit: Optional[RedditData] = None
    twitter: Optional[Any] = None
    youtube: Optional[Any] = None

# This is the final, full response model for the /results/{job_id} endpoint
class TrendResultResponse(BaseModel):
    job_id: UUID
    status: str
    results: Optional[TrendResults] = None