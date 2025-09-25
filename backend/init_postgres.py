#!/usr/bin/env python3
"""
PostgreSQL Database Initialization Script for RTGS Automation App
This script helps set up the PostgreSQL database and tables.
"""

import os
import sys
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError, ProgrammingError
from app.database import Base, create_tables
from app.config import settings

def create_database():
    """Create the database if it doesn't exist"""
    # Parse database URL to get connection info
    db_url = settings.database_url
    
    # Extract database name from URL
    db_name = db_url.split('/')[-1]
    
    # Create connection URL without database name for initial connection
    admin_url = db_url.replace(f'/{db_name}', '/postgres')
    
    try:
        # Connect to PostgreSQL server (postgres database)
        admin_engine = create_engine(admin_url)
        
        with admin_engine.connect() as conn:
            # Check if database exists
            result = conn.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :db_name"),
                {"db_name": db_name}
            )
            
            if not result.fetchone():
                # Database doesn't exist, create it
                conn.execute(text("COMMIT"))  # End any existing transaction
                conn.execute(text(f"CREATE DATABASE {db_name}"))
                print(f"✅ Database '{db_name}' created successfully!")
            else:
                print(f"✅ Database '{db_name}' already exists.")
                
    except OperationalError as e:
        print(f"❌ Error connecting to PostgreSQL: {e}")
        print("Make sure PostgreSQL is running and connection details are correct.")
        return False
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False
    
    return True

def initialize_tables():
    """Initialize database tables"""
    try:
        print("🔄 Creating database tables...")
        create_tables()
        print("✅ Database tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False

def test_connection():
    """Test database connection"""
    try:
        engine = create_engine(settings.database_url)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"✅ PostgreSQL connection successful!")
            print(f"📊 PostgreSQL version: {version.split(',')[0]}")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def main():
    """Main initialization function"""
    print("🚀 RTGS Automation App - PostgreSQL Database Initialization")
    print("=" * 60)
    
    print(f"🔗 Database URL: {settings.database_url}")
    print()
    
    # Step 1: Create database
    print("Step 1: Creating database...")
    if not create_database():
        sys.exit(1)
    
    print()
    
    # Step 2: Test connection
    print("Step 2: Testing connection...")
    if not test_connection():
        sys.exit(1)
    
    print()
    
    # Step 3: Initialize tables
    print("Step 3: Initializing tables...")
    if not initialize_tables():
        sys.exit(1)
    
    print()
    print("🎉 Database initialization completed successfully!")
    print()
    print("Next steps:")
    print("1. Make sure PostgreSQL is running")
    print("2. Update the DATABASE_URL in .env with your actual credentials")
    print("3. Run 'python init_postgres.py' if you need to reinitialize")
    print("4. Start your application with 'python run_server.py'")

if __name__ == "__main__":
    main()