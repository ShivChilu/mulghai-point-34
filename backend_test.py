#!/usr/bin/env python3
"""
Backend API Testing Suite for Butcher Shop Application
Tests all backend endpoints and functionality
"""

import requests
import json
import sys
import os
from datetime import datetime
import uuid

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BACKEND_URL = get_backend_url()
if not BACKEND_URL:
    print("❌ Could not find REACT_APP_BACKEND_URL in frontend/.env")
    sys.exit(1)

API_BASE_URL = f"{BACKEND_URL}/api"

print(f"🔗 Testing Backend API at: {API_BASE_URL}")
print("=" * 60)

def test_api_root():
    """Test GET /api/ endpoint"""
    print("\n🧪 Testing GET /api/ endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/", timeout=10)
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("message") == "Hello World":
                print("   ✅ GET /api/ - PASSED")
                return True
            else:
                print(f"   ❌ GET /api/ - FAILED: Expected message 'Hello World', got {data}")
                return False
        else:
            print(f"   ❌ GET /api/ - FAILED: Expected status 200, got {response.status_code}")
            return False
    except Exception as e:
        print(f"   ❌ GET /api/ - ERROR: {e}")
        return False

def test_post_status():
    """Test POST /api/status endpoint"""
    print("\n🧪 Testing POST /api/status endpoint...")
    try:
        # Use realistic butcher shop client name
        test_data = {
            "client_name": "Fresh Meat Market"
        }
        
        response = requests.post(
            f"{API_BASE_URL}/status", 
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Response: {response.text}")
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["id", "client_name", "timestamp"]
            
            if all(field in data for field in required_fields):
                if data["client_name"] == test_data["client_name"]:
                    print("   ✅ POST /api/status - PASSED")
                    return True, data["id"]
                else:
                    print(f"   ❌ POST /api/status - FAILED: Client name mismatch")
                    return False, None
            else:
                missing_fields = [field for field in required_fields if field not in data]
                print(f"   ❌ POST /api/status - FAILED: Missing fields {missing_fields}")
                return False, None
        else:
            print(f"   ❌ POST /api/status - FAILED: Expected status 200, got {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"   ❌ POST /api/status - ERROR: {e}")
        return False, None

def test_get_status():
    """Test GET /api/status endpoint"""
    print("\n🧪 Testing GET /api/status endpoint...")
    try:
        response = requests.get(f"{API_BASE_URL}/status", timeout=10)
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Response: Found {len(data)} status check(s)")
            
            if isinstance(data, list):
                if len(data) > 0:
                    # Check structure of first item
                    first_item = data[0]
                    required_fields = ["id", "client_name", "timestamp"]
                    if all(field in first_item for field in required_fields):
                        print("   ✅ GET /api/status - PASSED")
                        return True
                    else:
                        missing_fields = [field for field in required_fields if field not in first_item]
                        print(f"   ❌ GET /api/status - FAILED: Missing fields in response {missing_fields}")
                        return False
                else:
                    print("   ✅ GET /api/status - PASSED (empty list)")
                    return True
            else:
                print(f"   ❌ GET /api/status - FAILED: Expected list, got {type(data)}")
                return False
        else:
            print(f"   ❌ GET /api/status - FAILED: Expected status 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"   ❌ GET /api/status - ERROR: {e}")
        return False

def test_cors_headers():
    """Test CORS configuration"""
    print("\n🧪 Testing CORS configuration...")
    try:
        # Test preflight request
        response = requests.options(
            f"{API_BASE_URL}/status",
            headers={
                "Origin": "https://example.com",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type"
            },
            timeout=10
        )
        
        print(f"   Preflight Status Code: {response.status_code}")
        
        # Check CORS headers in a regular request
        response = requests.get(f"{API_BASE_URL}/", timeout=10)
        cors_headers = {
            key: value for key, value in response.headers.items() 
            if key.lower().startswith('access-control')
        }
        
        print(f"   CORS Headers: {cors_headers}")
        
        if 'access-control-allow-origin' in [h.lower() for h in response.headers.keys()]:
            print("   ✅ CORS - PASSED")
            return True
        else:
            print("   ❌ CORS - FAILED: No CORS headers found")
            return False
            
    except Exception as e:
        print(f"   ❌ CORS - ERROR: {e}")
        return False

def test_mongodb_connection():
    """Test MongoDB connection by creating and retrieving data"""
    print("\n🧪 Testing MongoDB connection...")
    try:
        # Create a status check
        test_data = {
            "client_name": "Premium Butcher Shop"
        }
        
        post_response = requests.post(
            f"{API_BASE_URL}/status", 
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if post_response.status_code != 200:
            print(f"   ❌ MongoDB - FAILED: Could not create test data")
            return False
        
        created_id = post_response.json().get("id")
        
        # Retrieve all status checks
        get_response = requests.get(f"{API_BASE_URL}/status", timeout=10)
        
        if get_response.status_code != 200:
            print(f"   ❌ MongoDB - FAILED: Could not retrieve data")
            return False
        
        status_checks = get_response.json()
        
        # Check if our created item exists
        found_item = None
        for item in status_checks:
            if item.get("id") == created_id:
                found_item = item
                break
        
        if found_item and found_item["client_name"] == test_data["client_name"]:
            print("   ✅ MongoDB Connection - PASSED")
            return True
        else:
            print("   ❌ MongoDB - FAILED: Created data not found in retrieval")
            return False
            
    except Exception as e:
        print(f"   ❌ MongoDB - ERROR: {e}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print("🚀 Starting Backend API Tests")
    print(f"📍 Backend URL: {BACKEND_URL}")
    print(f"📍 API Base URL: {API_BASE_URL}")
    
    test_results = []
    
    # Test basic endpoints
    test_results.append(("GET /api/", test_api_root()))
    test_results.append(("POST /api/status", test_post_status()[0]))
    test_results.append(("GET /api/status", test_get_status()))
    
    # Test CORS
    test_results.append(("CORS Configuration", test_cors_headers()))
    
    # Test MongoDB integration
    test_results.append(("MongoDB Connection", test_mongodb_connection()))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for test_name, result in test_results:
        status = "✅ PASSED" if result else "❌ FAILED"
        print(f"{test_name:<25} {status}")
        if result:
            passed += 1
        else:
            failed += 1
    
    print(f"\nTotal Tests: {len(test_results)}")
    print(f"Passed: {passed}")
    print(f"Failed: {failed}")
    
    if failed == 0:
        print("\n🎉 All backend tests PASSED!")
        return True
    else:
        print(f"\n⚠️  {failed} backend test(s) FAILED!")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)