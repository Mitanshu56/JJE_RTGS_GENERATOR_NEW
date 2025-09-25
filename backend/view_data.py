#!/usr/bin/env python3
"""
Script to view data in PostgreSQL database
"""

from app.database import engine
from sqlalchemy import text
import pandas as pd

def view_table_data(table_name):
    """View data from a specific table"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text(f"SELECT * FROM {table_name} LIMIT 10;"))
            rows = result.fetchall()
            columns = result.keys()
            
            print(f"\n📋 Table: {table_name}")
            print("=" * 50)
            
            if rows:
                # Create a simple table display
                col_widths = [max(len(str(col)), 15) for col in columns]
                
                # Header
                header = " | ".join(f"{col:<{width}}" for col, width in zip(columns, col_widths))
                print(header)
                print("-" * len(header))
                
                # Rows
                for row in rows:
                    row_str = " | ".join(f"{str(val):<{width}}"[:width] for val, width in zip(row, col_widths))
                    print(row_str)
                
                print(f"\nTotal rows shown: {len(rows)} (showing first 10)")
            else:
                print("❌ No data found in this table")
                
    except Exception as e:
        print(f"❌ Error viewing table {table_name}: {e}")

def get_table_counts():
    """Get row counts for all tables"""
    tables = ['users', 'remitters', 'beneficiaries', 'transactions']
    
    print("📊 Table Row Counts:")
    print("=" * 30)
    
    try:
        with engine.connect() as conn:
            for table in tables:
                result = conn.execute(text(f"SELECT COUNT(*) FROM {table};"))
                count = result.scalar()
                print(f"{table:<15}: {count} rows")
    except Exception as e:
        print(f"❌ Error getting counts: {e}")

def test_database_connection():
    """Test if database connection works"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT current_database(), current_user, version();"))
            db_info = result.fetchone()
            
            print("🔗 Database Connection Test:")
            print("=" * 40)
            print(f"Database: {db_info[0]}")
            print(f"User: {db_info[1]}")
            print(f"PostgreSQL Version: {db_info[2].split(',')[0]}")
            print("✅ Connection successful!")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

def main():
    """Main function to check database"""
    print("🔍 RTGS Database Viewer")
    print("=" * 50)
    
    # Test connection
    if not test_database_connection():
        return
    
    print("\n")
    
    # Get table counts
    get_table_counts()
    
    # View data from each table
    tables = ['users', 'remitters', 'beneficiaries', 'transactions']
    
    for table in tables:
        view_table_data(table)

if __name__ == "__main__":
    main()