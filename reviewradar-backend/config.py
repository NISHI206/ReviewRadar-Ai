import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL")

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "reviewradar")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing")

if not GROQ_MODEL:
    raise ValueError("GROQ_MODEL is missing")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is missing")