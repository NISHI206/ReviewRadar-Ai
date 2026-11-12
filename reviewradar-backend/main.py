from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import check_database

from routes import analyze, reviews, dashboard

app = FastAPI(
    title="ReviewRadar AI",
    description="AI-powered Customer Review Intelligence Platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Register routes
app.include_router(analyze.router, tags=["Analysis"])
app.include_router(reviews.router, tags=["Reviews"])
app.include_router(dashboard.router, tags=["Dashboard"])


@app.on_event("startup")
def startup_event():
    check_database()


@app.get("/")
def home():
    return {
        "message": "Welcome to ReviewRadar AI Backend!",
        "status": "Running"
    }


@app.get("/health")
def health():
    return {"status": "healthy"}