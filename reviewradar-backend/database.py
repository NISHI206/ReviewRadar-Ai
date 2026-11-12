from pymongo import MongoClient
from config import MONGODB_URI, DATABASE_NAME

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)

db = client[DATABASE_NAME]

reviews_collection = db["reviews"]


def check_database():
    client.admin.command("ping")
    print("MongoDB connected successfully!")