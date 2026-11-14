
from pymongo import MongoClient
from config import MONGODB_URI, DATABASE_NAME

client = MongoClient(
    MONGODB_URI,
    serverSelectionTimeoutMS=5000
)

db = client[DATABASE_NAME]

reviews_collection = db["reviews"]
users_collection = db["users"]


def check_database():
    client.admin.command("ping")

    # Enforce one account per email address
    users_collection.create_index("email", unique=True)

    print("MongoDB connected successfully!")
