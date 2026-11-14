
import os
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL")

MONGODB_URI = os.getenv("MONGODB_URI")
DATABASE_NAME = os.getenv("DATABASE_NAME", "reviewradar")

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24

COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is missing")

if not GROQ_MODEL:
    raise ValueError("GROQ_MODEL is missing")

if not MONGODB_URI:
    raise ValueError("MONGODB_URI is missing")

if not JWT_SECRET_KEY:
    raise ValueError("JWT_SECRET_KEY is missing")
