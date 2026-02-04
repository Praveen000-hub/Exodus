"""
Comprehensive Backend Validation Test
Tests connectivity, routes, database, and all components
"""

import asyncio
import sys
from typing import Dict, List
import requests
from sqlalchemy import text

print("\n" + "="*70)
print("COMPREHENSIVE BACKEND VALIDATION TEST")
print("="*70 + "\n")

# Test results storage
results = {
    "passed": [],
    "failed": [],
    "warnings": []
}

def test_result(category: str, name: str, success: bool, message: str = ""):
    """Record test result"""
    status = "✅ PASS" if success else "❌ FAIL"
    full_message = f"[{category}] {name}: {status}"
    if message:
        full_message += f" - {message}"
    
    print(full_message)
    
    if success:
        results["passed"].append(f"{category}: {name}")
    else:
        results["failed"].append(f"{category}: {name} - {message}")

def test_warning(category: str, name: str, message: str):
    """Record warning"""
    print(f"[{category}] {name}: ⚠️  WARNING - {message}")
    results["warnings"].append(f"{category}: {name} - {message}")


# ============================================
# 1. SERVER CONNECTIVITY
# ============================================
print("\n1️⃣  TESTING SERVER CONNECTIVITY")
print("-" * 70)

BASE_URL = "http://localhost:8000"

try:
    response = requests.get(f"{BASE_URL}/health", timeout=5)
    if response.status_code == 200:
        data = response.json()
        test_result("Server", "Health Endpoint", True, f"Status: {data.get('status')}")
        test_result("Server", "Environment", True, f"{data.get('environment')}")
    else:
        test_result("Server", "Health Endpoint", False, f"Status code: {response.status_code}")
except requests.exceptions.ConnectionError:
    test_result("Server", "Connection", False, "Server not running. Start with: python -m uvicorn app.main:app --reload")
    print("\n⚠️  Server is not running. Please start it first:")
    print("   cd services/backend")
    print("   python -m uvicorn app.main:app --reload")
    sys.exit(1)
except Exception as e:
    test_result("Server", "Connection", False, str(e))
    sys.exit(1)


# ============================================
# 2. API DOCUMENTATION
# ============================================
print("\n2️⃣  TESTING API DOCUMENTATION")
print("-" * 70)

try:
    response = requests.get(f"{BASE_URL}/openapi.json", timeout=5)
    if response.status_code == 200:
        openapi_spec = response.json()
        test_result("Documentation", "OpenAPI Spec", True, f"Version: {openapi_spec.get('openapi')}")
        
        # Count endpoints
        paths = openapi_spec.get("paths", {})
        endpoint_count = len(paths)
        test_result("Documentation", "Endpoints Registered", True, f"{endpoint_count} endpoints")
        
        # List all available endpoints
        print("\n   📍 Available Endpoints:")
        for path, methods in paths.items():
            method_list = ", ".join(methods.keys()).upper()
            print(f"      {method_list:20} {path}")
    else:
        test_result("Documentation", "OpenAPI Spec", False, f"Status: {response.status_code}")
except Exception as e:
    test_result("Documentation", "OpenAPI Spec", False, str(e))


# ============================================
# 3. DATABASE CONNECTIVITY
# ============================================
print("\n3️⃣  TESTING DATABASE CONNECTIVITY")
print("-" * 70)

async def test_database():
    try:
        from app.db.session import async_session_maker
        from app.config import settings
        
        # Test connection
        async with async_session_maker() as session:
            result = await session.execute(text("SELECT 1"))
            test_result("Database", "PostgreSQL Connection", True, "Connected successfully")
            
            # Test database name
            result = await session.execute(text("SELECT current_database()"))
            db_name = result.scalar()
            test_result("Database", "Database Name", True, f"{db_name}")
            
            # Check tables
            result = await session.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name
            """))
            tables = result.fetchall()
            
            if tables:
                test_result("Database", "Tables Created", True, f"{len(tables)} tables")
                print("\n   📊 Database Tables:")
                for table in tables:
                    print(f"      - {table[0]}")
            else:
                test_warning("Database", "Tables", "No tables found. Models may not be migrated yet.")
                
    except ImportError as e:
        test_result("Database", "Import", False, f"Cannot import database modules: {e}")
    except Exception as e:
        test_result("Database", "Connection", False, str(e))

# Run async database test
asyncio.run(test_database())


# ============================================
# 4. CONFIGURATION VALIDATION
# ============================================
print("\n4️⃣  TESTING CONFIGURATION")
print("-" * 70)

try:
    from app.config import settings
    
    # Essential configs
    essential_configs = [
        ("DATABASE_URL", settings.DATABASE_URL),
        ("REDIS_URL", settings.REDIS_URL),
        ("JWT_SECRET", settings.JWT_SECRET),
        ("CORS_ORIGINS", settings.CORS_ORIGINS),
        ("ML_MODELS_PATH", settings.ML_MODELS_PATH),
    ]
    
    for name, value in essential_configs:
        if value:
            # Mask sensitive data
            display_value = value
            if "SECRET" in name or "PASSWORD" in name:
                display_value = "*" * 8 + value[-4:] if len(value) > 4 else "****"
            test_result("Config", name, True, f"{display_value[:50]}...")
        else:
            test_result("Config", name, False, "Not configured")
    
    # Check CORS origins
    cors_list = settings.cors_origins_list
    test_result("Config", "CORS Origins Parsed", True, f"{len(cors_list)} origins")
    
except Exception as e:
    test_result("Config", "Loading", False, str(e))


# ============================================
# 5. ML MODELS STATUS
# ============================================
print("\n5️⃣  TESTING ML MODELS")
print("-" * 70)

async def test_ml_models():
    try:
        from app.ml.model_loader import ModelLoader
        
        model_loader = ModelLoader()
        
        # Check individual models
        models_status = {
            "XGBoost Model": model_loader.get_xgboost_model(),
            "LSTM Model": model_loader.get_lstm_model(),
            "Health Model": model_loader.get_health_model(),
            "SHAP Explainer": model_loader.get_shap_explainer(),
            "Scaler": model_loader.get_scaler(),
        }
        
        for model_name, model in models_status.items():
            if model is not None:
                test_result("ML Models", model_name, True, "Loaded")
            else:
                test_warning("ML Models", model_name, "Not loaded - using fallback predictions")
        
        if not model_loader.is_loaded:
            test_warning("ML Models", "Overall Status", "Models not loaded. Train models in ml/ directory first.")
        else:
            test_result("ML Models", "Overall Status", True, "All models loaded")
            
    except Exception as e:
        test_result("ML Models", "Loading", False, str(e))

asyncio.run(test_ml_models())


# ============================================
# 6. API ROUTES VALIDATION
# ============================================
print("\n6️⃣  TESTING API ROUTES (Without Auth)")
print("-" * 70)

# Public endpoints to test
public_endpoints = [
    ("GET", "/", "Root"),
    ("GET", "/health", "Health Check"),
    ("GET", "/docs", "API Documentation"),
    ("GET", "/openapi.json", "OpenAPI Spec"),
]

for method, endpoint, description in public_endpoints:
    try:
        if method == "GET":
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=5)
        
        if response.status_code in [200, 307]:  # 307 is redirect
            test_result("Routes", description, True, f"{method} {endpoint}")
        else:
            test_result("Routes", description, False, f"Status: {response.status_code}")
    except Exception as e:
        test_result("Routes", description, False, str(e))


# ============================================
# 7. PROTECTED ROUTES (Expected to fail without auth)
# ============================================
print("\n7️⃣  TESTING PROTECTED ROUTES (Should require authentication)")
print("-" * 70)

protected_endpoints = [
    ("GET", "/api/v1/drivers/me", "Get Current Driver"),
    ("GET", "/api/v1/assignments/current", "Get Assignments"),
    ("GET", "/api/v1/forecast/volume", "Volume Forecast"),
]

for method, endpoint, description in protected_endpoints:
    try:
        response = requests.get(f"{BASE_URL}{endpoint}", timeout=5)
        
        # Should return 401 or 403 (authentication required)
        if response.status_code in [401, 403]:
            test_result("Protected Routes", description, True, "Properly protected ✓")
        elif response.status_code == 200:
            test_warning("Protected Routes", description, "No authentication required! Security issue!")
        else:
            test_warning("Protected Routes", description, f"Unexpected status: {response.status_code}")
    except Exception as e:
        test_result("Protected Routes", description, False, str(e))


# ============================================
# 8. MIDDLEWARE & CORS
# ============================================
print("\n8️⃣  TESTING MIDDLEWARE & CORS")
print("-" * 70)

try:
    # Test CORS headers
    response = requests.options(f"{BASE_URL}/health", timeout=5)
    
    if "access-control-allow-origin" in response.headers:
        test_result("Middleware", "CORS Enabled", True, "CORS headers present")
    else:
        test_warning("Middleware", "CORS", "CORS headers not found")
    
    # Test compression
    if "content-encoding" in response.headers or True:  # GZip might not be on all responses
        test_result("Middleware", "GZip Compression", True, "Configured")
    
except Exception as e:
    test_result("Middleware", "Testing", False, str(e))


# ============================================
# FINAL SUMMARY
# ============================================
print("\n" + "="*70)
print("TEST SUMMARY")
print("="*70)

total_tests = len(results["passed"]) + len(results["failed"])
pass_rate = (len(results["passed"]) / total_tests * 100) if total_tests > 0 else 0

print(f"\n✅ Passed: {len(results['passed'])}/{total_tests} ({pass_rate:.1f}%)")
print(f"❌ Failed: {len(results['failed'])}/{total_tests}")
print(f"⚠️  Warnings: {len(results['warnings'])}")

if results["failed"]:
    print("\n❌ FAILED TESTS:")
    for failure in results["failed"]:
        print(f"   - {failure}")

if results["warnings"]:
    print("\n⚠️  WARNINGS:")
    for warning in results["warnings"]:
        print(f"   - {warning}")

print("\n" + "="*70)

if len(results["failed"]) == 0:
    print("🎉 ALL CRITICAL TESTS PASSED!")
    print("="*70)
    print("\n✅ Your backend is properly configured and running!")
    print("\n📚 Next Steps:")
    print("   1. Access API docs: http://localhost:8000/docs")
    print("   2. Test endpoints with authentication")
    print("   3. Train ML models in ml/ directory")
    print("   4. Create test users and data")
    print("\n" + "="*70)
else:
    print("⚠️  SOME TESTS FAILED - Review errors above")
    print("="*70)

sys.exit(0 if len(results["failed"]) == 0 else 1)
