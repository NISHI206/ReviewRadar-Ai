
from bson import ObjectId
from fastapi import Request, HTTPException, status
from jose import jwt, JWTError

from config import JWT_SECRET_KEY, JWT_ALGORITHM
from database import users_collection


def get_current_user(request: Request):

    token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please log in to continue."
        )

    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id or not ObjectId.is_valid(user_id):
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token."
            )

    except JWTError:
        raise HTTPException(
            status_code=401,
            detail="Your session is invalid or expired. Please log in again."
        )

    user = users_collection.find_one({
        "_id": ObjectId(user_id)
    })

    if not user:
        raise HTTPException(
            status_code=401,
            detail="User account not found."
        )

    return {
        "id": str(user["_id"]),
        "name": user["name"],
        "email": user["email"]
    }
