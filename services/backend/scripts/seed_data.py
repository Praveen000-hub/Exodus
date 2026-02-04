"""
Seed Database with Test Data
Run: python scripts/seed_data.py
"""

import asyncio
from datetime import date, datetime
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession

from app.db.base import Base
from app.db.models.driver import Driver, VehicleType
from app.db.models.package import Package, PackageStatus
from app.config import settings
from app.core.security import hash_password


async def seed_database():
    """Seed database with test data"""
    print("🌱 Seeding database...")
    
    # Create engine
    engine = create_async_engine(settings.async_database_url, echo=True)
    
    # Create tables
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    # Create session
    async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    
    async with async_session() as session:
        # Create drivers
        drivers_data = [
            {
                'user_id': 1001,
                'name': 'Rajesh Kumar',
                'email': 'rajesh@example.com',
                'phone': '+919876543210',
                'password_hash': hash_password('Password123'),
                'vehicle_type': VehicleType.BIKE,
                'vehicle_number': 'TN01AB1234',
                'experience_days': 365,
                'total_deliveries': 1000,
                'successful_deliveries': 950,
                'success_rate': 0.95
            },
            {
                'user_id': 1002,
                'name': 'Priya Sharma',
                'email': 'priya@example.com',
                'phone': '+919876543211',
                'password_hash': hash_password('Password123'),
                'vehicle_type': VehicleType.SCOOTER,
                'vehicle_number': 'TN01CD5678',
                'experience_days': 180,
                'total_deliveries': 500,
                'successful_deliveries': 475,
                'success_rate': 0.95
            },
            {
                'user_id': 1003,
                'name': 'Amit Patel',
                'email': 'amit@example.com',
                'phone': '+919876543212',
                'password_hash': hash_password('Password123'),
                'vehicle_type': VehicleType.CAR,
                'vehicle_number': 'TN01EF9012',
                'experience_days': 730,
                'total_deliveries': 2000,
                'successful_deliveries': 1900,
                'success_rate': 0.95
            }
        ]
        
        for driver_data in drivers_data:
            driver = Driver(**driver_data)
            session.add(driver)
        
        await session.commit()
        print(f"✅ Created {len(drivers_data)} drivers")
        
        # Create packages
        packages_data = []
        for i in range(1, 21):
            packages_data.append({
                'tracking_number': f'PKG{1000+i}',
                'status': PackageStatus.PENDING,
                'weight_kg': 2.5 + (i % 5),
                'is_fragile': i % 3 == 0,
                'delivery_address': f'{i} Main Street, Chennai',
                'delivery_latitude': 13.0827 + (i * 0.01),
                'delivery_longitude': 80.2707 + (i * 0.01),
                'floor_number': i % 10,
                'customer_name': f'Customer {i}',
                'customer_phone': f'+9198765432{10+i}',
                'distance_from_hub_km': 5.0 + (i % 15)
            })
        
        for package_data in packages_data:
            package = Package(**package_data)
            session.add(package)
        
        await session.commit()
        print(f"✅ Created {len(packages_data)} packages")
    
    await engine.dispose()
    print("✅ Database seeding completed!")


if __name__ == "__main__":
    asyncio.run(seed_database())
