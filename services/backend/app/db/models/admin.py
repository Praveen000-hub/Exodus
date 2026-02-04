"""
Admin Model
System administrators
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime

from app.db.base import BaseModel


class Admin(BaseModel):
    """
    Admin user model
    """
    __tablename__ = "admins"
    
    # Admin details
    user_id = Column(Integer, unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    
    # Role and permissions
    role = Column(String(50), default="admin", nullable=False)
    can_approve_payouts = Column(Boolean, default=False)
    can_manage_drivers = Column(Boolean, default=True)
    can_view_analytics = Column(Boolean, default=True)
    
    # Status
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    
    def __repr__(self):
        return f"<Admin(id={self.id}, email='{self.email}', role='{self.role}')>"
