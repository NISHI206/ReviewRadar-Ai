import joblib
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "models" / "sentiment_model.joblib"

model = joblib.load(MODEL_PATH)


def predict_sentiment(review: str):

    probabilities = model.predict_proba([review])[0]

    predicted_index = probabilities.argmax()

    predicted_label = model.classes_[predicted_index]

    confidence = float(probabilities[predicted_index]) * 100

    sentiment = str(predicted_label).capitalize()

    return {
        "sentiment": sentiment,
        "confidence": round(confidence, 2)
    }