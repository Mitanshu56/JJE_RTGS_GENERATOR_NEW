#!/usr/bin/env python3
"""
Script to check what tables exist in the PostgreSQL database
"""

from app.database import engine
from sqlalchemy import text

def check_tables():
    """Check what tables exist in the database"""
    try:
        with engine.connect() as conn:
            # Get all tables in public schema
            result = conn.execute(text("""
                SELECT tablename 
                FROM pg_tables 
                WHERE schemaname = 'public' 
                ORDER BY tablename;
            """))
            
            tables = result.fetchall()
            
            if tables:
                print("✅ Tables found in database:")
                for table in tables:
                    print(f"   📋 {table[0]}")
                    
                    # Get column info for each table
                    columns_result = conn.execute(text(f"""
                        SELECT column_name, data_type 
                        FROM information_schema.columns 
                        WHERE table_name = '{table[0]}' 
                        ORDER BY ordinal_position;
                    """))
                    
                    columns = columns_result.fetchall()
                    for col in columns:
                        print(f"      - {col[0]} ({col[1]})")
                    print()
            else:
                print("❌ No tables found in the database")
                
    except Exception as e:
        print(f"❌ Error checking tables: {e}")

if __name__ == "__main__":
    check_tables()