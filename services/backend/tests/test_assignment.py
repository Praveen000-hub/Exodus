"""
Assignment Tests
Tests for fairness algorithm and assignment logic (Innovation 1)
"""
import pytest
from datetime import date, datetime
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.driver import Driver, VehicleType
from app.db.models.package import Package, Priority, PackageStatus
from app.db.models.assignment import Assignment
from app.services.assignment_service import AssignmentService
from app.core.fairness import FairnessOptimizer


@pytest.fixture
async def test_drivers(db_session: AsyncSession):
    """Create test drivers"""
    drivers = [
        Driver(
            user_id=2000 + i,
            name=f"Test Driver {i}",
            email=f"testdriver{i}@test.com",
            phone=f"+1555000{i:04d}",
            password_hash="hashed_password",
            vehicle_type=VehicleType.BIKE,
            experience_days=100,
            total_deliveries=50,
            successful_deliveries=45,
        )
        for i in range(5)
    ]
    
    db_session.add_all(drivers)
    await db_session.commit()
    return drivers


@pytest.fixture
async def test_packages(db_session: AsyncSession):
    """Create test packages"""
    packages = [
        Package(
            tracking_number=f"TEST-PKG-{i:06d}",
            weight_kg=5.0 + i,
            priority=Priority.MEDIUM,
            pickup_latitude=40.7128,
            pickup_longitude=-74.0060,
            pickup_address="NYC Pickup",
            dropoff_latitude=40.7589,
            dropoff_longitude=-73.9851,
            dropoff_address="NYC Dropoff",
            distance_km=5.0 + i,
            estimated_time_minutes=30.0,
            customer_name=f"Customer {i}",
            customer_phone=f"+1555111{i:04d}",
            status=PackageStatus.PENDING,
        )
        for i in range(10)
    ]
    
    db_session.add_all(packages)
    await db_session.commit()
    return packages


@pytest.mark.asyncio
async def test_create_assignment(db_session: AsyncSession, test_drivers, test_packages):
    """Test creating an assignment"""
    service = AssignmentService(db_session)
    driver = test_drivers[0]
    package = test_packages[0]
    
    assignment = Assignment(
        driver_id=driver.id,
        package_id=package.id,
        assignment_date=date.today(),
        predicted_difficulty=0.5,
        assigned_at=datetime.now(),
    )
    
    db_session.add(assignment)
    await db_session.commit()
    
    retrieved = await service.get_assignment(assignment.id)
    assert retrieved is not None
    assert retrieved.driver_id == driver.id
    assert retrieved.package_id == package.id


@pytest.mark.asyncio
async def test_fairness_optimization(test_drivers, test_packages):
    """Test fairness algorithm (Innovation 1)"""
    optimizer = FairnessOptimizer()
    
    # Create driver features
    driver_features = {
        driver.id: {
            'experience_days': driver.experience_days,
            'total_deliveries': driver.total_deliveries,
            'avg_rating': 4.5,
            'current_workload': 0.5,
        }
        for driver in test_drivers
    }
    
    # Create package features
    package_features = {
        package.id: {
            'distance_km': package.distance_km,
            'weight_kg': package.weight_kg,
            'priority': 2,
            'is_fragile': False,
        }
        for package in test_packages[:5]
    }
    
    # Run optimization
    assignments = optimizer.optimize_assignments(
        drivers=list(driver_features.keys()),
        packages=list(package_features.keys()),
        difficulty_matrix={
            (d_id, p_id): 0.6
            for d_id in driver_features.keys()
            for p_id in package_features.keys()
        }
    )
    
    assert len(assignments) > 0
    assert all(isinstance(a, tuple) for a in assignments)


@pytest.mark.asyncio
async def test_get_driver_assignments(db_session: AsyncSession, test_drivers, test_packages):
    """Test retrieving driver assignments"""
    service = AssignmentService(db_session)
    driver = test_drivers[0]
    today = date.today()
    
    # Create multiple assignments
    for package in test_packages[:3]:
        assignment = Assignment(
            driver_id=driver.id,
            package_id=package.id,
            assignment_date=today,
            predicted_difficulty=0.5,
            assigned_at=datetime.now(),
        )
        db_session.add(assignment)
    
    await db_session.commit()
    
    # Retrieve assignments
    assignments = await service.get_driver_assignments(driver.id, today)
    assert len(assignments) == 3
    assert all(a.driver_id == driver.id for a in assignments)


@pytest.mark.asyncio
async def test_difficulty_variance(test_drivers):
    """Test difficulty variance minimization"""
    optimizer = FairnessOptimizer()
    
    # Test that variance is minimized
    difficulties = [0.3, 0.5, 0.7, 0.4, 0.6]
    variance = optimizer.calculate_variance(difficulties)
    
    assert variance >= 0
    assert variance < 1.0  # Should be reasonable
