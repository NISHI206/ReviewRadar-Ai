
from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from dependencies.auth import get_current_user

import pandas as pd
from io import BytesIO

from schemas import AnalyzeRequest
from analysis_service import analyze_review

router = APIRouter()


@router.post("/analyze")
def analyze_single_review(
    data: AnalyzeRequest,
    user: dict = Depends(get_current_user)
):
    try:
        result = analyze_review(
            data.review,
            user_id=user["id"],
            business_name=data.business_name
        )

        return result

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Review analysis failed: {str(e)}"
        )


@router.post("/analyze-csv")
async def analyze_csv(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a CSV file."
        )

    try:
        contents = await file.read()
        df = pd.read_csv(BytesIO(contents))

        if "review" not in df.columns:
            raise HTTPException(
                status_code=400,
                detail="CSV must contain a 'review' column."
            )

        if len(df) > 50:
            raise HTTPException(
                status_code=400,
                detail="Maximum 50 reviews per upload."
            )

        results = []

        for review in df["review"].dropna():

            review = str(review).strip()

            if len(review) < 5:
                continue

            result = analyze_review(
                review,
                user_id=user["id"]
            )

            results.append(result)

        return {
            "total_processed": len(results),
            "results": results
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"CSV analysis failed: {str(e)}"
        )
