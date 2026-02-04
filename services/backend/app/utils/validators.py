"""
Custom Validators
Input validation utilities
"""

import re
from typing import Optional


def validate_phone_number(phone: str) -> bool:
    """
    Validate phone number format
    
    Args:
        phone: Phone number string
    
    Returns:
        bool: True if valid
    """
    pattern = r'^\+?[1-9]\d{9,14}$'
    return bool(re.match(pattern, phone))


def validate_email(email: str) -> bool:
    """
    Validate email format
    
    Args:
        email: Email string
    
    Returns:
        bool: True if valid
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))


def validate_vehicle_number(vehicle_number: str) -> bool:
    """
    Validate Indian vehicle number format
    
    Args:
        vehicle_number: Vehicle registration number
    
    Returns:
        bool: True if valid
    """
    # Format: XX-00-XX-0000 or XX00XX0000
    pattern = r'^[A-Z]{2}[-\s]?\d{2}[-\s]?[A-Z]{1,2}[-\s]?\d{4}$'
    return bool(re.match(pattern, vehicle_number.upper()))
