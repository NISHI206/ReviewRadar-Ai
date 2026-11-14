
from fastapi import APIRouter, HTTPException, Query, Depends

from database import reviews_collection
from dependencies.auth import get_current_user

router = APIRouter()


@router.get("/reviews")
def get_reviews(
    limit: int = Query(default=50, ge=1, le=100),
    user: dict = Depends(get_current_user)
):
    try:
        cursor = (
            reviews_collection
            .find({"user_id": user["id"]})
            .sort("created_at", -1)
            .limit(limit)
        )

        results = []

        for item in cursor:
            item["id"] = str(item.pop("_id"))
            item.pop("created_at", None)
            item.pop("user_id", None)
            results.append(item)

        return {
            "total": len(results),
            "reviews": results
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Could not retrieve reviews: {str(e)}"
        )
