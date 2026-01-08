#!/usr/bin/env python3
"""
MongoDB Connection Diagnostic and Fix Script
This script helps diagnose and fix MongoDB connection issues.
"""

import os
import asyncio
import sys
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

async def test_mongodb_connection():
    """Test MongoDB connection with different configurations"""
    
    # Get MongoDB URI from environment
    mongodb_uri = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
    db_name = os.getenv("MONGODB_DB_NAME", "pixelcraft")
    
    print(f"🔍 Testing MongoDB connection...")
    print(f"📡 URI: {mongodb_uri}")
    print(f"🗄️  Database: {db_name}")
    print("-" * 50)
    
    # Test 1: Basic connection
    print("1️⃣ Testing basic connection...")
    try:
        client = AsyncIOMotorClient(mongodb_uri, serverSelectionTimeoutMS=5000)
        await client.admin.command('ping')
        print("✅ Basic connection successful!")
        client.close()
    except Exception as e:
        print(f"❌ Basic connection failed: {e}")
    
    # Test 2: Connection with longer timeout
    print("\n2️⃣ Testing connection with longer timeout...")
    try:
        client = AsyncIOMotorClient(
            mongodb_uri,
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000
        )
        await client.admin.command('ping')
        print("✅ Long timeout connection successful!")
        client.close()
    except Exception as e:
        print(f"❌ Long timeout connection failed: {e}")
    
    # Test 3: Connection with connection pool
    print("\n3️⃣ Testing connection with connection pool...")
    try:
        client = AsyncIOMotorClient(
            mongodb_uri,
            serverSelectionTimeoutMS=10000,
            connectTimeoutMS=10000,
            socketTimeoutMS=10000,
            maxPoolSize=10,
            minPoolSize=1
        )
        await client.admin.command('ping')
        print("✅ Connection pool successful!")
        client.close()
    except Exception as e:
        print(f"❌ Connection pool failed: {e}")
    
    # Test 4: Database access
    print("\n4️⃣ Testing database access...")
    try:
        client = AsyncIOMotorClient(mongodb_uri)
        db = client[db_name]
        await db.command('ping')
        print("✅ Database access successful!")
        client.close()
    except Exception as e:
        print(f"❌ Database access failed: {e}")

def check_environment():
    """Check environment variables and system configuration"""
    print("🔧 Environment Check:")
    print("-" * 30)
    
    # Check environment variables
    mongodb_uri = os.getenv("MONGODB_URI")
    db_name = os.getenv("MONGODB_DB_NAME")
    
    print(f"MONGODB_URI: {'✅ Set' if mongodb_uri else '❌ Not set'}")
    print(f"MONGODB_DB_NAME: {'✅ Set' if db_name else '❌ Not set'}")
    
    # Check if running in Docker
    if os.path.exists('/.dockerenv'):
        print("🐳 Running in Docker container")
    else:
        print("💻 Running on host system")
    
    # Check network connectivity
    print("\n🌐 Network Check:")
    import socket
    try:
        # Try to connect to MongoDB port
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex(('localhost', 27017))
        if result == 0:
            print("✅ MongoDB port 27017 is accessible")
        else:
            print("❌ MongoDB port 27017 is not accessible")
        sock.close()
    except Exception as e:
        print(f"❌ Network check failed: {e}")

def provide_solutions():
    """Provide solutions for common MongoDB issues"""
    print("\n🛠️  Common Solutions:")
    print("-" * 30)
    
    print("1. If using Docker:")
    print("   - Ensure MongoDB container is running: docker-compose up -d mongodb")
    print("   - Check container logs: docker-compose logs mongodb")
    print("   - Verify network connectivity between containers")
    
    print("\n2. If using local MongoDB:")
    print("   - Start MongoDB service: sudo systemctl start mongod")
    print("   - Check MongoDB status: sudo systemctl status mongod")
    print("   - Verify MongoDB is listening on port 27017")
    
    print("\n3. If using MongoDB Atlas:")
    print("   - Check IP whitelist in Atlas dashboard")
    print("   - Verify connection string format")
    print("   - Ensure network connectivity to Atlas")
    
    print("\n4. General fixes:")
    print("   - Increase timeout values in main.py")
    print("   - Check firewall settings")
    print("   - Verify MongoDB authentication credentials")

async def main():
    """Main function"""
    print("🚀 MongoDB Connection Diagnostic Tool")
    print("=" * 50)
    
    # Check environment
    check_environment()
    
    # Test connections
    await test_mongodb_connection()
    
    # Provide solutions
    provide_solutions()
    
    print("\n✅ Diagnostic complete!")

if __name__ == "__main__":
    asyncio.run(main())
