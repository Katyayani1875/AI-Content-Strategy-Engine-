from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Any, Dict

class TrendJob(BaseModel):
    job_id: UUID = Field(...)
    status: str = Field(...)
    request_payload: Dict[str, Any] = Field(...)
    results: Dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)