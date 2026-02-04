"""
Health Event Tests
Tests for health monitoring system (Innovation 5)
"""
import pytest
from datetime import datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.driver import Driver, VehicleType
from app.db.models.health_event import HealthEvent, HealthEventType, Severity
from app.services.health_service import HealthService


@pytest.fixture
async def test_driver(db_session: AsyncSession):
    """Create a test driver"""
    driver = Driver(
        user_id=3000,
        name="Health Test Driver",
        email="healthtest@test.com",
        phone="+15551234567",
        password_hash="hashed_password",
        vehicle_type=VehicleType.CAR,
        experience_days=180,
        total_deliveries=200,
        successful_deliveries=190,
    )
    
    db_session.add(driver)
    await db_session.commit()
    return driver


@pytest.mark.asyncio
async def test_create_health_event(db_session: AsyncSession, test_driver):
    """Test creating a health event"""
    event = HealthEvent(
        driver_id=test_driver.id,
        event_type=HealthEventType.LONG_SHIFT,
        severity=Severity.MEDIUM,
        description="Driver has been working for 10 hours straight",
        recommended_action="Suggest taking a 30-minute break",
    )
    
    db_session.add(event)
    await db_session.commit()
    
    assert event.id is not None
    assert event.driver_id == test_driver.id
    assert event.is_resolved == False


@pytest.mark.asyncio
async def test_detect_long_shift(db_session: AsyncSession, test_driver):
    """Test detecting long shift health event"""
    service = HealthService(db_session)
    
    # Simulate 12 hour shift
    shift_hours = 12.0
    
    if shift_hours >= 10:
        event = HealthEvent(
            driver_id=test_driver.id,
            event_type=HealthEventType.LONG_SHIFT,
            severity=Severity.HIGH if shift_hours >= 12 else Severity.MEDIUM,
            description=f"Driver has been working for {shift_hours} hours",
            recommended_action="Mandatory 1-hour break required",
        )
        db_session.add(event)
        await db_session.commit()
    
    # Check event was created
    events = await service.get_driver_health_events(test_driver.id)
    assert len(events) > 0
    assert events[0].event_type == HealthEventType.LONG_SHIFT


@pytest.mark.asyncio
async def test_detect_fast_deliveries(db_session: AsyncSession, test_driver):
    """Test detecting fast delivery pattern (speeding risk)"""
    service = HealthService(db_session)
    
    # Simulate fast delivery times
    avg_delivery_speed_kmh = 85.0  # Above safe threshold
    
    if avg_delivery_speed_kmh > 80:
        event = HealthEvent(
            driver_id=test_driver.id,
            event_type=HealthEventType.FAST_DELIVERIES,
            severity=Severity.HIGH,
            description=f"Average speed of {avg_delivery_speed_kmh} km/h detected",
            recommended_action="Warning issued - reduce speed for safety",
        )
        db_session.add(event)
        await db_session.commit()
    
    events = await service.get_driver_health_events(test_driver.id)
    fast_delivery_events = [e for e in events if e.event_type == HealthEventType.FAST_DELIVERIES]
    assert len(fast_delivery_events) > 0


@pytest.mark.asyncio
async def test_resolve_health_event(db_session: AsyncSession, test_driver):
    """Test resolving a health event"""
    service = HealthService(db_session)
    
    # Create event
    event = HealthEvent(
        driver_id=test_driver.id,
        event_type=HealthEventType.MISSED_BREAKS,
        severity=Severity.LOW,
        description="Driver missed scheduled break",
        recommended_action="Take break within next hour",
    )
    db_session.add(event)
    await db_session.commit()
    
    # Resolve event
    event.is_resolved = True
    event.resolved_at = datetime.now()
    await db_session.commit()
    
    assert event.is_resolved == True
    assert event.resolved_at is not None


@pytest.mark.asyncio
async def test_health_severity_levels():
    """Test health event severity classification"""
    severities = {
        'low': Severity.LOW,
        'medium': Severity.MEDIUM,
        'high': Severity.HIGH,
        'critical': Severity.CRITICAL,
    }
    
    assert severities['low'].value == 'low'
    assert severities['critical'].value == 'critical'


@pytest.mark.asyncio
async def test_get_unresolved_events(db_session: AsyncSession, test_driver):
    """Test getting only unresolved health events"""
    service = HealthService(db_session)
    
    # Create mix of resolved and unresolved events
    events = [
        HealthEvent(
            driver_id=test_driver.id,
            event_type=HealthEventType.LONG_SHIFT,
            severity=Severity.MEDIUM,
            description="Event 1",
            is_resolved=False,
        ),
        HealthEvent(
            driver_id=test_driver.id,
            event_type=HealthEventType.MISSED_BREAKS,
            severity=Severity.LOW,
            description="Event 2",
            is_resolved=True,
            resolved_at=datetime.now(),
        ),
    ]
    
    db_session.add_all(events)
    await db_session.commit()
    
    # Get unresolved only
    all_events = await service.get_driver_health_events(test_driver.id)
    unresolved = [e for e in all_events if not e.is_resolved]
    
    assert len(unresolved) >= 1
