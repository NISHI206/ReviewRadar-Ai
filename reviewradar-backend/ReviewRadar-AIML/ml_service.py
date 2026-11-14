
import re
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR / "sentiment_model.joblib"

model = joblib.load(MODEL_PATH)


def clean_text(text):
    text = text.lower()

    text = re.sub(
        r"http\S+|www\S+",
        " ",
        text
    )

    text = re.sub(
        r"[^a-z\s]",
        " ",
        text
    )

    text = re.sub(
        r"\s+",
        " ",
        text
    ).strip()

    return text


def predict_sentiment(review):

    if not isinstance(review, str) or not review.strip():
        raise ValueError("Review cannot be empty")

    cleaned = clean_text(review)

    prediction = int(model.predict([cleaned])[0])

    probabilities = model.predict_proba([cleaned])[0]

    confidence = float(max(probabilities)) * 100

    return {
        "sentiment": (
            "Positive" if prediction == 1
            else "Negative"
        ),
        "confidence": round(confidence, 2)
    }
