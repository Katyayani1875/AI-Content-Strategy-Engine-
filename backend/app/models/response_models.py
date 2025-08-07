from pydantic import BaseModel
from typing import List, Optional

class Trend(BaseModel):
    trend: str
    platform: str
    volume: str

class KeyInsights(BaseModel):
    identified_trends: List[Trend]
    best_time_to_post: dict
    top_performing_formats: List[str]
    hook_styles: List[str]

class CompetitorSnapshot(BaseModel):
    name: str
    key_themes: List[str]
    posting_frequency: str

class PostSuggestion(BaseModel):
    platform: str
    title_suggestion: str
    format: str
    hook: str
    cta: str # Call to Action

class CalendarDay(BaseModel):
    day: int
    theme_of_day: str
    post_suggestions: List[PostSuggestion]

class StrategyResponse(BaseModel):
    strategy_id: str
    createdAt: str
    request_summary: dict
    key_insights: KeyInsights
    competitor_snapshot: List[CompetitorSnapshot]
    content_calendar: List[CalendarDay]