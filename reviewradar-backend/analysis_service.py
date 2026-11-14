
from datetime import datetime, timezone

from ml_service import predict_sentiment
from genai_service import generate_review_insights
from database import reviews_collection


def analyze_review(
    review: str,
    user_id: str,
    business_name: str | None = None
):

    # Step 1: ML prediction
    ml_result = predict_sentiment(review)

    sentiment = ml_result["sentiment"]
    confidence = ml_result["confidence"]

    # Step 2: GenAI analysis
    ai_result = generate_review_insights(review, sentiment)

    # Step 3: Combine results
    final_result = {
        "review": review,
        "business_name": business_name,
        "sentiment": sentiment,
        "confidence": confidence,
        "summary": ai_result["summary"],
        "aspects": ai_result["aspects"],
        "key_issues": ai_result["key_issues"],
        "positive_points": ai_result["positive_points"],
        "recommendations": ai_result["recommendations"]
    }

    # Step 4: Save with authenticated user's ID
    document = {
        **final_result,
        "user_id": user_id,
        "created_at": datetime.now(timezone.utc)
    }

    inserted = reviews_collection.insert_one(document)

    # Step 5: Return result
    final_result["id"] = str(inserted.inserted_id)

    return final_result
