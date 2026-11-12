from pydantic import BaseModel, Field
from typing import Literal


class AnalyzeRequest(BaseModel):
    review: str = Field(min_length=5, max_length=5000)
    business_name: str | None = None


class Aspect(BaseModel):
    aspect: str
    sentiment: Literal["Positive", "Negative", "Neutral"]
    reason: str


class ReviewResult(BaseModel):
    sentiment: Literal["Positive", "Negative"]
    confidence: float
    summary: str
    aspects: list[Aspect]
    key_issues: list[str]
    positive_points: list[str]
    recommendations: list[str]