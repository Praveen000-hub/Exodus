"""
Swap Tests
Tests for P2P swap marketplace (Innovation 6)
"""
import pytest
from datetime import date, datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.driver import Driver, VehicleType
from app.db.models.package import Package, Priority, PackageStatus
from app.db.models.assignment import Assignment
from app.db.models.swap import Swap, SwapStatus
from app.services.swap_service import SwapService


@pytest.fixture
async def test_swap_scenario(db_session: AsyncSession):
    """Create complete swap test scenario"""
    # Create two drivers
    driver1 = Driver(
        user_id=4001,
        name="Swap Driver 1",
        email="swapdriver1@test.com",
        phone="+15550001111",
        password_hash="hashed_password",
        vehicle_type=VehicleType.BIKE,
        experience_days=100,
    )
    
    driver2 = Driver(
        user_id=4002,
        name="Swap Driver 2",
        email="swapdriver2@test.com",
        phone="+15550002222",
        password_hash="hashed_password",
        vehicle_type=VehicleType.CAR,
        experience_days=150,
    )
    
    db_session.add_all([driver1, driver2])
    await db_session.commit()
    
    # Create two packages
    package1 = Package(
        tracking_number="SWAP-PKG-001",
        weight_kg=3.0,
        priority=Priority.HIGH,
        pickup_latitude=40.7128,
        pickup_longitude=-74.0060,
        pickup_address="Location A",
        dropoff_latitude=40.7589,
        dropoff_longitude=-73.9851,
        dropoff_address="Location B",
        distance_km=5.0,
        estimated_time_minutes=25.0,
        customer_name="Customer A",
        customer_phone="+15553331111",
        status=PackageStatus.ASSIGNED,
    )
    
    package2 = Package(
        tracking_number="SWAP-PKG-002",
        weight_kg=15.0,
        priority=Priority.MEDIUM,
        pickup_latitude=40.7489,
        pickup_longitude=-73.9680,
        pickup_address="Location C",
        dropoff_latitude=40.7306,
        dropoff_longitude=-73.9352,
        dropoff_address="Location D",
        distance_km=8.0,
        estimated_time_minutes=40.0,
        customer_name="Customer B",
        customer_phone="+15553332222",
        status=PackageStatus.ASSIGNED,
    )
    
    db_session.add_all([package1, package2])
    await db_session.commit()
    
    # Create assignments
    assignment1 = Assignment(
        driver_id=driver1.id,
        package_id=package1.id,
        assignment_date=date.today(),
        predicted_difficulty=0.7,
        assigned_at=datetime.now(),
        is_accepted=True,
    )
    
    assignment2 = Assignment(
        driver_id=driver2.id,
        package_id=package2.id,
        assignment_date=date.today(),
        predicted_difficulty=0.4,
        assigned_at=datetime.now(),
        is_accepted=True,
    )
    
    db_session.add_all([assignment1, assignment2])
    await db_session.commit()
    
    return {
        'driver1': driver1,
        'driver2': driver2,
        'package1': package1,
        'package2': package2,
        'assignment1': assignment1,
        'assignment2': assignment2,
    }


@pytest.mark.asyncio
async def test_create_swap_request(db_session: AsyncSession, test_swap_scenario):
    """Test creating a swap request"""
    scenario = test_swap_scenario
    
    swap = Swap(
        requester_driver_id=scenario['driver1'].id,
        target_driver_id=scenario['driver2'].id,
        requester_assignment_id=scenario['assignment1'].id,
        target_assignment_id=scenario['assignment2'].id,
        requester_reason="Heavy package difficult for bike, prefer lighter delivery",
        status=SwapStatus.PENDING,
    )
    
    db_session.add(swap)
    await db_session.commit()
    
    assert swap.id is not None
    assert swap.status == SwapStatus.PENDING
    assert swap.requester_reason is not None


@pytest.mark.asyncio
async def test_accept_swap_request(db_session: AsyncSession, test_swap_scenario):
    """Test accepting a swap request"""
    service = SwapService(db_session)
    scenario = test_swap_scenario
    
    # Create swap
    swap = Swap(
        requester_driver_id=scenario['driver1'].id,
        target_driver_id=scenario['driver2'].id,
        requester_assignment_id=scenario['assignment1'].id,
        target_assignment_id=scenario['assignment2'].id,
        requester_reason="Need to swap due to vehicle issue",
        status=SwapStatus.PENDING,
    )
    
    db_session.add(swap)
    await db_session.commit()
    
    # Accept swap
    swap.status = SwapStatus.ACCEPTED
    swap.responded_at = datetime.now()
    
    # Swap the assignments
    scenario['assignment1'].driver_id = scenario['driver2'].id
    scenario['assignment2'].driver_id = scenario['driver1'].id
    
    await db_session.commit()
    
    assert swap.status == SwapStatus.ACCEPTED
    assert swap.responded_at is not None


@pytest.mark.asyncio
async def test_reject_swap_request(db_session: AsyncSession, test_swap_scenario):
    """Test rejecting a swap request"""
    scenario = test_swap_scenario
    
    swap = Swap(
        requester_driver_id=scenario['driver1'].id,
        target_driver_id=scenario['driver2'].id,
        requester_assignment_id=scenario['assignment1'].id,
        target_assignment_id=scenario['assignment2'].id,
        requester_reason="Want to swap",
        status=SwapStatus.PENDING,
    )
    
    db_session.add(swap)
    await db_session.commit()
    
    # Reject
    swap.status = SwapStatus.REJECTED
    swap.responded_at = datetime.now()
    await db_session.commit()
    
    assert swap.status == SwapStatus.REJECTED
    assert swap.responded_at is not None


@pytest.mark.asyncio
async def test_cancel_swap_request(db_session: AsyncSession, test_swap_scenario):
    """Test cancelling a swap request by requester"""
    scenario = test_swap_scenario
    
    swap = Swap(
        requester_driver_id=scenario['driver1'].id,
        target_driver_id=scenario['driver2'].id,
        requester_assignment_id=scenario['assignment1'].id,
        target_assignment_id=scenario['assignment2'].id,
        requester_reason="Changed my mind",
        status=SwapStatus.PENDING,
    )
    
    db_session.add(swap)
    await db_session.commit()
    
    # Cancel by requester
    swap.status = SwapStatus.CANCELLED
    await db_session.commit()
    
    assert swap.status == SwapStatus.CANCELLED


@pytest.mark.asyncio
async def test_swap_marketplace_listing(db_session: AsyncSession, test_swap_scenario):
    """Test listing available swaps in marketplace"""
    service = SwapService(db_session)
    scenario = test_swap_scenario
    
    # Create multiple swap requests
    swaps = [
        Swap(
            requester_driver_id=scenario['driver1'].id,
            target_driver_id=scenario['driver2'].id,
            requester_assignment_id=scenario['assignment1'].id,
            target_assignment_id=scenario['assignment2'].id,
            requester_reason=f"Swap reason {i}",
            status=SwapStatus.PENDING,
        )
        for i in range(3)
    ]
    
    db_session.add_all(swaps)
    await db_session.commit()
    
    # Get pending swaps for driver2
    pending_swaps = await service.get_driver_swap_requests(
        driver_id=scenario['driver2'].id,
        status=SwapStatus.PENDING
    )
    
    assert len(pending_swaps) >= 3
    assert all(s.status == SwapStatus.PENDING for s in pending_swaps)
