"""
Generate Test Assignments
Creates sample data for testing the fairness algorithm
"""
import sys
import asyncio
from pathlib import Path
from datetime import date, datetime, timedelta
import random

# Add app to path
sys.path.append(str(Path(__file__).parent.parent))

from app.db.session import async_session_maker
from app.db.models.driver import Driver, VehicleType
from app.db.models.package import Package, Priority, PackageStatus
from app.db.models.assignment import Assignment
from app.core.security import hash_password


async def create_test_drivers():
    """Create test drivers"""
    async with async_session_maker() as session:
        drivers = [
            Driver(
                user_id=1000 + i,
                name=f"Driver {i+1}",
                email=f"driver{i+1}@test.com",
                phone=f"+1234567{i:04d}",
                password_hash=hash_password("password123"),
                vehicle_type=random.choice(list(VehicleType)),
                vehicle_number=f"ABC{i:04d}",
                experience_days=random.randint(30, 365),
                total_deliveries=random.randint(10, 200),
                successful_deliveries=random.randint(8, 180),
                avg_rating=round(random.uniform(3.5, 5.0), 2),
                current_latitude=40.7128 + random.uniform(-0.1, 0.1),
                current_longitude=-74.0060 + random.uniform(-0.1, 0.1),
            )
            for i in range(20)
        ]
        
        session.add_all(drivers)
        await session.commit()
        print(f" Created {len(drivers)} test drivers")
        return drivers


async def create_test_packages():
    """Create test packages"""
    async with async_session_maker() as session:
        packages = []
        
        for i in range(50):
            # Random pickup and dropoff locations in NYC area
            pickup_lat = 40.7128 + random.uniform(-0.15, 0.15)
            pickup_lon = -74.0060 + random.uniform(-0.15, 0.15)
            dropoff_lat = 40.7128 + random.uniform(-0.15, 0.15)
            dropoff_lon = -74.0060 + random.uniform(-0.15, 0.15)
            
            # Calculate rough distance
            distance = abs(pickup_lat - dropoff_lat) + abs(pickup_lon - dropoff_lon)
            distance_km = distance * 111  # Rough conversion
            
            package = Package(
                tracking_number=f"TEST{i:06d}",
                weight_kg=round(random.uniform(0.5, 25.0), 2),
                priority=random.choice(list(Priority)),
                pickup_latitude=pickup_lat,
                pickup_longitude=pickup_lon,
                pickup_address=f"{random.randint(1, 999)} Test St, New York, NY",
                dropoff_latitude=dropoff_lat,
                dropoff_longitude=dropoff_lon,
                dropoff_address=f"{random.randint(1, 999)} Main St, New York, NY",
                distance_km=round(distance_km, 2),
                estimated_time_minutes=round(distance_km * 3, 2),
                requires_cold_chain=random.choice([True, False]),
                is_fragile=random.choice([True, False]),
                customer_name=f"Customer {i+1}",
                customer_phone=f"+1987654{i:04d}",
                status=PackageStatus.PENDING,
            )
            packages.append(package)
        
        session.add_all(packages)
        await session.commit()
        print(f" Created {len(packages)} test packages")
        return packages


async def create_test_assignments(drivers, packages):
    """Create test assignments"""
    async with async_session_maker() as session:
        assignments = []
        today = date.today()
        
        # Assign 30 packages to drivers
        for i, package in enumerate(packages[:30]):
            driver = drivers[i % len(drivers)]
            
            assignment = Assignment(
                driver_id=driver.id,
                package_id=package.id,
                assignment_date=today,
                predicted_difficulty=round(random.uniform(0.2, 0.9), 3),
                assigned_at=datetime.now(),
                is_accepted=random.choice([True, False]),
            )
            assignments.append(assignment)
        
        session.add_all(assignments)
        await session.commit()
        print(f" Created {len(assignments)} test assignments")


async def main():
    """Generate all test data"""
    print(" Generating test data for FairAI system...")
    
    try:
        drivers = await create_test_drivers()
        packages = await create_test_packages()
        await create_test_assignments(drivers, packages)
        
        print("\n Test data generation complete!")
        print(f"   - Drivers: 20")
        print(f"   - Packages: 50")
        print(f"   - Assignments: 30")
        
    except Exception as e:
        print(f"\n Error generating test data: {e}")
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
