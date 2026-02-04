"""
Simple Backend Initialization Test
Tests if backend can initialize without dependencies
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("\n" + "="*60)
print("BACKEND INITIALIZATION TEST")
print("="*60 + "\n")

errors = []
success = []

# Test imports
tests = [
    ("FastAPI", "fastapi", "FastAPI"),
    ("SQLAlchemy", "sqlalchemy", None),
    ("Pydantic", "pydantic", None),
    ("Config", "app.config", "settings"),
    ("Database Base", "app.db.base", "Base"),
    ("Driver Model", "app.db.models.driver", "Driver"),
    ("BaseRepository", "app.db.repositories.base_repo", "BaseRepository"),
    ("DriverRepository", "app.db.repositories.driver_repo", "DriverRepository"),
    ("Security Utils", "app.core.security", None),
    ("Auth Service", "app.services.auth_service", "AuthService"),
    ("API Routes", "app.api.v1.auth", "router"),
]

print("Running import tests...\n")
for name, module_path, attr in tests:
    try:
        module = __import__(module_path, fromlist=[attr] if attr else [])
        if attr:
            getattr(module, attr)
        success.append(name)
        print(f"  OK   {name}")
    except Exception as e:
        errors.append(f"{name}: {str(e)}")
        print(f"  FAIL {name}: {str(e)[:50]}")

# Summary
print("\n" + "="*60)
print("SUMMARY")
print("="*60)
print(f"\nPassed: {len(success)}/{len(tests)}")
print(f"Failed: {len(errors)}/{len(tests)}")

if errors:
    print("\nFailed tests:")
    for error in errors:
        print(f"  - {error}")
    print("\nNote: Install missing dependencies with:")
    print("  python -m pip install -r requirements.txt")
else:
    print("\nSUCCESS! Backend structure is correct!")
    print("Next steps:")
    print("  1. Create .env file with DATABASE_URL, REDIS_URL, JWT_SECRET")
    print("  2. Run: python -m uvicorn app.main:app --reload")

print("\n" + "="*60 + "\n")
sys.exit(0 if not errors else 1)
