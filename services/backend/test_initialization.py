"""
Backend Initialization Test
Tests if all modules can be imported and initialized correctly
"""

import sys
import os

# Add app to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("\n" + "="*60)
print("🧪 BACKEND INITIALIZATION TEST")
print("="*60 + "\n")

errors = []
warnings = []

# Test 1: Import main modules
print("1. Testing core module imports...")
try:
    from app.config import settings
    print("   ✅ Config loaded")
except Exception as e:
    errors.append(f"Config import failed: {e}")
    print(f"   ❌ Config failed: {e}")

try:
    from app.db.base import Base, BaseModel
    print("   ✅ Database base models")
except Exception as e:
    errors.append(f"DB base import failed: {e}")
    print(f"   ❌ DB base failed: {e}")

try:
    from app.db.session import engine, async_session_maker
    print("   ✅ Database session")
except Exception as e:
    errors.append(f"DB session import failed: {e}")
    print(f"   ❌ DB session failed: {e}")

# Test 2: Import all models
print("\n2. Testing database models...")
models_to_test = [
    ("Driver", "app.db.models.driver"),
    ("Assignment", "app.db.models.assignment"),
    ("Package", "app.db.models.package"),
    ("Delivery", "app.db.models.delivery"),
    ("HealthEvent", "app.db.models.health_event"),
    ("Swap", "app.db.models.swap"),
    ("Admin", "app.db.models.admin"),
    ("GPSLog", "app.db.models.gps_log"),
    ("InsurancePayout", "app.db.models.insurance_payout"),
]

for model_name, module_path in models_to_test:
    try:
        module = __import__(module_path, fromlist=[model_name])
        getattr(module, model_name)
        print(f"   ✅ {model_name}")
    except Exception as e:
        errors.append(f"{model_name} import failed: {e}")
        print(f"   ❌ {model_name}: {e}")

# Test 3: Import repositories
print("\n3. Testing repositories...")
repos_to_test = [
    ("BaseRepository", "app.db.repositories.base_repo"),
    ("DriverRepository", "app.db.repositories.driver_repo"),
    ("AssignmentRepository", "app.db.repositories.assignment_repo"),
    ("HealthRepository", "app.db.repositories.health_repo"),
    ("SwapRepository", "app.db.repositories.swap_repo"),
    ("AnalyticsRepository", "app.db.repositories.analytics_repo"),
    ("AdminRepository", "app.db.repositories.admin_repo"),
]

for repo_name, module_path in repos_to_test:
    try:
        module = __import__(module_path, fromlist=[repo_name])
        getattr(module, repo_name)
        print(f"   ✅ {repo_name}")
    except Exception as e:
        errors.append(f"{repo_name} import failed: {e}")
        print(f"   ❌ {repo_name}: {e}")

# Test 4: Import ML services
print("\n4. Testing ML services...")
ml_services = [
    ("ModelLoader", "app.ml.model_loader"),
    ("XGBoostService", "app.ml.model_loader"),
    ("LSTMService", "app.ml.lstm_predictor"),
    ("HealthPredictionService", "app.ml.health_predictor"),
    ("SHAPService", "app.ml.shap_explainer"),
]

for service_name, module_path in ml_services:
    try:
        module = __import__(module_path, fromlist=[service_name])
        getattr(module, service_name)
        print(f"   ✅ {service_name}")
    except Exception as e:
        errors.append(f"{service_name} import failed: {e}")
        print(f"   ❌ {service_name}: {e}")

# Test 5: Import API routes
print("\n5. Testing API routes...")
api_routes = [
    ("auth", "app.api.v1.auth"),
    ("drivers", "app.api.v1.drivers"),
    ("assignments", "app.api.v1.assignments"),
    ("health", "app.api.v1.health"),
    ("forecast", "app.api.v1.forecast"),
    ("swaps", "app.api.v1.swaps"),
    ("analytics", "app.api.v1.analytics"),
    ("websocket", "app.api.v1.websocket"),
]

for route_name, module_path in api_routes:
    try:
        module = __import__(module_path, fromlist=["router"])
        print(f"   ✅ {route_name} routes")
    except Exception as e:
        errors.append(f"{route_name} routes import failed: {e}")
        print(f"   ❌ {route_name}: {e}")

# Test 6: Import services
print("\n6. Testing business services...")
services = [
    ("AuthService", "app.services.auth_service"),
    ("DriverService", "app.services.driver_service"),
    ("AssignmentService", "app.services.assignment_service"),
    ("HealthService", "app.services.health_service"),
    ("ForecastService", "app.services.forecast_service"),
    ("SwapService", "app.services.swap_service"),
    ("AnalyticsService", "app.services.analytics_service"),
]

for service_name, module_path in services:
    try:
        module = __import__(module_path, fromlist=[service_name])
        getattr(module, service_name)
        print(f"   ✅ {service_name}")
    except Exception as e:
        errors.append(f"{service_name} import failed: {e}")
        print(f"   ❌ {service_name}: {e}")

# Test 7: Import core utilities
print("\n7. Testing core utilities...")
core_modules = [
    ("security", "app.core.security"),
    ("fairness", "app.core.fairness"),
    ("notifications", "app.core.notifications"),
    ("insurance", "app.core.insurance"),
    ("swap_matching", "app.core.swap_matching"),
]

for module_name, module_path in core_modules:
    try:
        __import__(module_path)
        print(f"   ✅ {module_name}")
    except Exception as e:
        errors.append(f"{module_name} import failed: {e}")
        print(f"   ❌ {module_name}: {e}")

# Test 8: Import workers
print("\n8. Testing background workers...")
workers = [
    ("scheduler", "app.workers.scheduler"),
    ("assignment_generator", "app.workers.assignment_generator"),
    ("forecast_updater", "app.workers.forecast_updater"),
    ("health_monitor", "app.workers.health_monitor"),
    ("learning_worker", "app.workers.learning_worker"),
    ("cleanup_worker", "app.workers.cleanup_worker"),
]

for worker_name, module_path in workers:
    try:
        __import__(module_path)
        print(f"   ✅ {worker_name}")
    except Exception as e:
        errors.append(f"{worker_name} import failed: {e}")
        print(f"   ❌ {worker_name}: {e}")

# Test 9: Try to import FastAPI app
print("\n9. Testing FastAPI application...")
try:
    from app.main import app
    print("   ✅ FastAPI app created")
except Exception as e:
    errors.append(f"FastAPI app import failed: {e}")
    print(f"   ❌ FastAPI app failed: {e}")

# Test 10: Check environment variables
print("\n10. Checking environment configuration...")
required_env_vars = [
    "DATABASE_URL",
    "REDIS_URL",
    "JWT_SECRET",
]

missing_env = []
for var in required_env_vars:
    try:
        value = getattr(settings, var, None)
        if value and str(value).strip() and not str(value).startswith("Field"):
            print(f"   ✅ {var} configured")
        else:
            missing_env.append(var)
            warnings.append(f"{var} not set or using default")
            print(f"   ⚠️  {var} not configured (will use default)")
    except Exception as e:
        missing_env.append(var)
        warnings.append(f"{var} check failed: {e}")
        print(f"   ⚠️  {var}: {e}")

# Summary
print("\n" + "="*60)
print("📊 TEST SUMMARY")
print("="*60)

if len(errors) == 0:
    print("\n✅ ALL TESTS PASSED!")
    print("   Backend is correctly initialized and ready to run.")
else:
    print(f"\n❌ FOUND {len(errors)} ERROR(S):")
    for i, error in enumerate(errors, 1):
        print(f"   {i}. {error}")

if len(warnings) > 0:
    print(f"\n⚠️  {len(warnings)} WARNING(S):")
    for i, warning in enumerate(warnings, 1):
        print(f"   {i}. {warning}")
    print("\n   Note: Warnings won't prevent startup but may cause runtime errors.")

if len(errors) == 0 and len(missing_env) == 0:
    print("\n🚀 Backend is production-ready!")
elif len(errors) == 0:
    print("\n⚠️  Backend will start but needs environment variables for full functionality.")
    print("   Create a .env file with: DATABASE_URL, REDIS_URL, JWT_SECRET")

print("\n" + "="*60 + "\n")

sys.exit(0 if len(errors) == 0 else 1)
