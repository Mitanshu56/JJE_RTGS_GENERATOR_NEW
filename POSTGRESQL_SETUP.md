# PostgreSQL Migration Guide

## Overview
This project has been migrated from SQLite to PostgreSQL. Follow this guide to set up and run the application with PostgreSQL.

## Prerequisites

### 1. Install PostgreSQL
- **Windows**: Download from [PostgreSQL Official Site](https://www.postgresql.org/download/windows/)
- **macOS**: `brew install postgresql`
- **Ubuntu/Debian**: `sudo apt-get install postgresql postgresql-contrib`

### 2. Start PostgreSQL Service
- **Windows**: PostgreSQL should start automatically after installation
- **macOS**: `brew services start postgresql`
- **Linux**: `sudo systemctl start postgresql`

## Database Setup

### 1. Create Database User
Connect to PostgreSQL as superuser and create a dedicated user:

```sql
-- Connect to PostgreSQL (as postgres user)
psql -U postgres

-- Create user and database
CREATE USER rtgs_user WITH PASSWORD 'rtgs_password';
CREATE DATABASE rtgs_automation OWNER rtgs_user;
GRANT ALL PRIVILEGES ON DATABASE rtgs_automation TO rtgs_user;

-- Exit PostgreSQL
\q
```

### 2. Update Environment Configuration
The `.env` file has been updated with PostgreSQL connection string:

```
DATABASE_URL=postgresql://rtgs_user:rtgs_password@localhost:5432/rtgs_automation
```

**Important**: Update the credentials in `.env` with your actual PostgreSQL username and password.

### 3. Install Python Dependencies
The project already includes `psycopg2-binary` in requirements.txt for PostgreSQL support:

```bash
pip install -r requirements.txt
```

### 4. Initialize Database
Run the initialization script to create the database and tables:

```bash
cd backend
python init_postgres.py
```

## Configuration Changes Made

### 1. Database Configuration (`app/config.py`)
- Changed default database URL from SQLite to PostgreSQL
- Updated to use PostgreSQL connection string format

### 2. Database Connection (`app/database.py`)
- Removed SQLite-specific `check_same_thread` parameter
- Added PostgreSQL connection pool settings:
  - `pool_size=10`: Number of connections to maintain in pool
  - `max_overflow=20`: Additional connections beyond pool size
  - `pool_pre_ping=True`: Validate connections before use

### 3. Environment File (`.env`)
- Updated DATABASE_URL to use PostgreSQL format
- Added example credentials (change these!)

## Running the Application

1. **Ensure PostgreSQL is running**
2. **Update database credentials** in `.env` file
3. **Initialize database** (if not done already):
   ```bash
   python init_postgres.py
   ```
4. **Start the application**:
   ```bash
   python run_server.py
   ```

## Connection String Format

```
postgresql://username:password@host:port/database_name
```

Example:
```
postgresql://rtgs_user:rtgs_password@localhost:5432/rtgs_automation
```

## Troubleshooting

### Common Issues

1. **Connection refused**
   - Ensure PostgreSQL service is running
   - Check if port 5432 is available
   - Verify host and port in connection string

2. **Authentication failed**
   - Verify username and password in `.env`
   - Ensure user has proper permissions on database

3. **Database does not exist**
   - Run the `init_postgres.py` script
   - Or manually create database using psql

4. **Import errors**
   - Ensure `psycopg2-binary` is installed: `pip install psycopg2-binary`

### Useful PostgreSQL Commands

```sql
-- List databases
\l

-- Connect to database
\c rtgs_automation

-- List tables
\dt

-- Show table structure
\d table_name

-- Check active connections
SELECT * FROM pg_stat_activity WHERE datname = 'rtgs_automation';
```

## Benefits of PostgreSQL over SQLite

1. **Concurrent access**: Better handling of multiple simultaneous connections
2. **Advanced features**: Full-text search, JSON support, advanced indexing
3. **Scalability**: Better performance with large datasets
4. **Data integrity**: More robust constraint enforcement
5. **Security**: Advanced authentication and authorization features
6. **Production ready**: Suitable for production deployments

## Data Migration (if needed)

If you have existing SQLite data that needs to be migrated:

1. Export data from SQLite
2. Convert to PostgreSQL format
3. Import into new PostgreSQL database

Consider using tools like `pgloader` for automated migration from SQLite to PostgreSQL.