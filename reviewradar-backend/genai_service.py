import json
from groq import Groq
from config import GROQ_API_KEY, GROQ_MODEL

client = Groq(api_key=GROQ_API_KEY)


def generate_review_insights(review: str, sentiment: str):

    prompt = f"""
    You are an expert customer feedback analyst.

    Analyze the following customer review.

    Review: {review}

    ML predicted overall sentiment: {sentiment}

    Return ONLY valid JSON in this exact structure:

    {{
        "summary": "Short summary of the review",
        "aspects": [
            {{
                "aspect": "Food Quality",
                "sentiment": "Positive",
                "reason": "Reason based on the review"
            }}
        ],
        "key_issues": ["Customer complaints"],
        "positive_points": ["Things customers liked"],
        "recommendations": ["Actionable business suggestions"]
    }}

    Rules:
    - Use only information supported by the review.
    - Do not invent customer experiences.
    - Aspect sentiment must be Positive, Negative or Neutral.
    - If an aspect is not mentioned, do not invent it.
    - Return empty arrays if no items are found.
    - Keep the summary concise.
    """

    response = client.chat.completions.create(
        model=GROQ_MODEL,
        messages=[
            {
                "role": "system",
                "content": "You analyze customer reviews and return structured JSON."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2,
        response_format={"type": "json_object"}
    )

    result = json.loads(response.choices[0].message.content)

    required_keys = [
        "summary",
        "aspects",
        "key_issues",
        "positive_points",
        "recommendations"
    ]

    for key in required_keys:
        if key not in result:
            raise ValueError(f"Missing GenAI field: {key}")

    return result