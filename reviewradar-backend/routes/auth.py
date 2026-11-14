
from fastapi import APIRouter, HTTPException, Response, Depends
from pydantic import BaseModel, Field
from pymongo.errors import DuplicateKeyError

from database import users_collection
from utils.security import (
    hash_password,
    verify_password,
    create_access_token
)
from dependencies.auth import get_current_user
from config import ACCESS_TOKEN_EXPIRE_MINUTES, COOKIE_SECURE

router = APIRouter(prefix="/auth", tags=["Authentication"])


class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: str = Field(min_length=5, max_length=254)
    password: str = Field(min_length=8, max_length=128)


class LoginRequest(BaseModel):
    email: str
    password: str


def set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/"
    )


@router.post("/signup")
def signup(data: SignupRequest, response: Response):

    name = data.name.strip()
    email = data.email.strip().lower()

    if len(name) < 2:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid name."
        )

    if "@" not in email or "." not in email.split("@")[-1]:
        raise HTTPException(
            status_code=400,
            detail="Please enter a valid email address."
        )

    if users_collection.find_one({"email": email}):
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    user = {
        "name": name,
        "email": email,
        "password": hash_password(data.password)
    }

    try:
        inserted = users_collection.insert_one(user)
    except DuplicateKeyError:
        raise HTTPException(
            status_code=409,
            detail="An account with this email already exists."
        )

    user_id = str(inserted.inserted_id)
    token = create_access_token(user_id)

    set_auth_cookie(response, token)

    return {
        "message": "Account created successfully!",
        "user": {
            "id": user_id,
            "name": name,
            "email": email
        }
    }


@router.post("/login")
def login(data: LoginRequest, response: Response):

    email = data.email.strip().lower()

    user = users_collection.find_one({"email": email})

    if not user or not verify_password(
        data.password,
        user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password."
        )

    token = create_access_token(str(user["_id"]))

    set_auth_cookie(response, token)

    return {
        "message": "Login successful!",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }


@router.get("/me")
def get_me(user: dict = Depends(get_current_user)):
    return {"user": user}


@router.post("/logout")
def logout(response: Response):

    response.delete_cookie(
        key="access_token",
        httponly=True,
        secure=COOKIE_SECURE,
        samesite="lax",
        path="/"
    )

    return {"message": "Logged out successfully."}
