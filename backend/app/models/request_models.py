from pydantic import BaseModel
from typing import List

class StrategyRequestBody(BaseModel):
    user_id: str
    topic: str
    target_audience: str
    focus: List[str]
    competitors: List[str]
    platforms: List[str]
    exclude_topics: List[str] = []