
from fastapi import APIRouter, HTTPException, Depends
from collections import defaultdict

from database import reviews_collection
from dependencies.auth import get_current_user

router = APIRouter()


@router.get("/dashboard/stats")
def dashboard_stats(user: dict = Depends(get_current_user)):

    try:
        # Fetch only reviews belonging to the logged-in user
        reviews = list(reviews_collection.find(
            {"user_id": user["id"]},
            {
                "sentiment": 1,
                "aspects": 1,
                "_id": 0
            }
        ))

        total = len(reviews)

        # Support both old numeric labels and new text labels
        positive = sum(
            1 for r in reviews
            if str(r.get("sentiment", "")).strip().lower()
            in ("1", "positive")
        )

        negative = sum(
            1 for r in reviews
            if str(r.get("sentiment", "")).strip().lower()
            in ("0", "negative")
        )

        positive_percentage = (
            round((positive / total) * 100, 2) if total else 0
        )

        negative_percentage = (
            round((negative / total) * 100, 2) if total else 0
        )

        # Aspect analysis
        aspect_counts = defaultdict(
            lambda: {
                "positive": 0,
                "negative": 0,
                "neutral": 0
            }
        )

        for review in reviews:
            for aspect in review.get("aspects", []):

                name = aspect.get("aspect", "Other")
                sentiment = str(
                    aspect.get("sentiment", "")
                ).strip().lower()

                if sentiment in ("positive", "negative", "neutral"):
                    aspect_counts[name][sentiment] += 1

        top_aspects = [
            {
                "aspect": name,
                **counts
            }
            for name, counts in aspect_counts.items()
        ]

        top_aspects.sort(
            key=lambda item: sum(
                item[k] for k in ["positive", "negative", "neutral"]
            ),
            reverse=True
        )

        return {
            "total_reviews": total,
            "positive_count": positive,
            "negative_count": negative,
            "positive_percentage": positive_percentage,
            "negative_percentage": negative_percentage,
            "top_aspects": top_aspects[:10]
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not generate dashboard statistics: {str(e)}"
        )


@router.get("/insights")
def get_insights(user: dict = Depends(get_current_user)):

    try:
        # Fetch only this user's reviews
        reviews = list(reviews_collection.find(
            {"user_id": user["id"]},
            {
                "key_issues": 1,
                "positive_points": 1,
                "_id": 0
            }
        ))

        issue_counts = defaultdict(int)
        positive_counts = defaultdict(int)

        for review in reviews:
            for issue in review.get("key_issues", []):
                issue_counts[issue] += 1

            for point in review.get("positive_points", []):
                positive_counts[point] += 1

        return {
            "recurring_issues": sorted(
                [
                    {"issue": key, "count": value}
                    for key, value in issue_counts.items()
                ],
                key=lambda x: x["count"],
                reverse=True
            )[:5],

            "popular_positive_points": sorted(
                [
                    {"point": key, "count": value}
                    for key, value in positive_counts.items()
                ],
                key=lambda x: x["count"],
                reverse=True
            )[:5]
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not generate insights: {str(e)}"
        )
