"""
Authentication Schemas
"""

from pydantic import BaseModel, EmailStr, Field, field_validator
import re


class LoginRequest(BaseModel):
    """Login request schema"""
    identifier: str = Field(..., description="Email or phone number")
    password: str = Field(..., min_length=6)


class RegisterRequest(BaseModel):
    """Registration request schema"""
    name: str = Field(..., min_length=2, max_length=255)
    email: EmailStr
    phone: str = Field(..., pattern=r'^\+?[1-9]\d{9,14}$')
    password: str = Field(..., min_length=8)
    vehicle_type: str = Field(..., pattern=r'^(bike|scooter|car|van)$')
    
    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        if not re.search(r'[A-Z]', v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'[0-9]', v):
            raise ValueError('Password must contain at least one digit')
        return v


class TokenResponse(BaseModel):
    """Token response schema"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 1800  # 30 minutes


class RefreshTokenRequest(BaseModel):
    """Refresh token request"""
    refresh_token: str
