"""
Security Utilities
JWT token handling, password hashing, authentication
"""

from datetime import datetime, timedelta
from typing import Optional, Dict
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import settings
from app.utils.helpers import setup_logger

logger = setup_logger(__name__)

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# ============================================
# PASSWORD HASHING
# ============================================

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    
    Args:
        password: Plain text password
    
    Returns:
        str: Hashed password
    """
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Hashed password from database
    
    Returns:
        bool: True if password matches
    """
    return pwd_context.verify(plain_password, hashed_password)


# ============================================
# JWT TOKEN CREATION
# ============================================

def create_access_token(
    data: Dict,
    expires_delta: Optional[timedelta] = None
) -> str:
    """
    Create JWT access token
    
    Args:
        data: Data to encode in token (typically {"sub": user_id})
        expires_delta: Token expiration time (default from settings)
    
    Returns:
        str: Encoded JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return encoded_jwt


def create_refresh_token(data: Dict) -> str:
    """
    Create JWT refresh token (longer expiration)
    
    Args:
        data: Data to encode in token
    
    Returns:
        str: Encoded JWT refresh token
    """
    to_encode = data.copy()
    
    expire = datetime.utcnow() + timedelta(
        days=settings.REFRESH_TOKEN_EXPIRE_DAYS
    )
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh"
    })
    
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
    
    return encoded_jwt


# ============================================
# JWT TOKEN DECODING
# ============================================

def decode_access_token(token: str) -> Dict:
    """
    Decode and validate JWT access token
    
    Args:
        token: JWT token string
    
    Returns:
        Dict: Decoded token payload
    
    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        # Verify token type
        if payload.get("type") != "access":
            raise JWTError("Invalid token type")
        
        return payload
    
    except JWTError as e:
        logger.warning(f"JWT decode error: {str(e)}")
        raise


def decode_refresh_token(token: str) -> Dict:
    """
    Decode and validate JWT refresh token
    
    Args:
        token: JWT refresh token string
    
    Returns:
        Dict: Decoded token payload
    
    Raises:
        JWTError: If token is invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        # Verify token type
        if payload.get("type") != "refresh":
            raise JWTError("Invalid token type")
        
        return payload
    
    except JWTError as e:
        logger.warning(f"JWT refresh token decode error: {str(e)}")
        raise


# ============================================
# TOKEN VALIDATION
# ============================================

def is_token_expired(token: str) -> bool:
    """
    Check if token is expired
    
    Args:
        token: JWT token string
    
    Returns:
        bool: True if token is expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_exp": False}  # Don't raise on expiration
        )
        
        exp = payload.get("exp")
        if exp is None:
            return True
        
        return datetime.fromtimestamp(exp) < datetime.utcnow()
    
    except JWTError:
        return True
