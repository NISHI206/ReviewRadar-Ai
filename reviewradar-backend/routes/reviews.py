from fastapi import APIRouter, HTTPException, Query
from database import reviews_collection

router = APIRouter()


@router.get("/reviews")
def get_reviews(limit: int = Query(default=50, ge=1, le=100)):

    try:
        cursor = (
            reviews_collection
            .find()
            .sort("created_at", -1)
            .limit(limit)
        )

        results = []

        for item in cursor:
            item["id"] = str(item.pop("_id"))
            item.pop("created_at", None)
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