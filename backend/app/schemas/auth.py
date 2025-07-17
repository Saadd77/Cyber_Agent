from pydantic import BaseModel, EmailStr

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
