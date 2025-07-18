# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Cyber-Agent Platform",
    description="AI-powered penetration testing platform",
    version="1.0.0",
    openapi_url="/api/v1/openapi.json"
)

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React default
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8080",  # Alternative ports
        "http://127.0.0.1:8080",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "AI Cyber-Agent Platform API", "version": "1.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/test-cors")
async def test_cors():
    return {"message": "CORS is working!", "status": "success"}

# Basic auth endpoints for testing
@app.post("/api/v1/auth/login")
async def login():
    return {"message": "Login endpoint reached", "access_token": "fake-token", "token_type": "bearer"}

@app.post("/api/v1/auth/signup")
async def signup():
    return {"message": "Signup endpoint reached"}