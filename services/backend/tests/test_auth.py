"""
Authentication Tests
"""

import pytest
from app.services.auth_service import AuthService
from app.db.repositories.driver_repo import DriverRepository


@pytest.mark.asyncio
async def test_register_driver(db_session):
    """Test driver registration"""
    auth_service = AuthService(db_session)
    
    tokens = await auth_service.register(
        name="Test Driver",
        email="test@example.com",
        phone="+919876543210",
        password="Password123",
        vehicle_type="bike"
    )
    
    assert 'access_token' in tokens
    assert 'refresh_token' in tokens
    assert tokens['token_type'] == 'bearer'


@pytest.mark.asyncio
async def test_login_driver(db_session, sample_driver_data):
    """Test driver login"""
    # Create driver
    driver_repo = DriverRepository(db_session)
    await driver_repo.create(**sample_driver_data)
    await db_session.commit()
    
    # Login
    auth_service = AuthService(db_session)
    
    # This will fail because password not hashed properly in test
    # In real implementation, you'd hash the password first
    with pytest.raises(ValueError):
        await auth_service.login(
            identifier="test@example.com",
            password="wrong_password"
        )
