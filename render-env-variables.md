# Render Environment Variables Configuration

Set these environment variables in your Render Web Service settings:

## Required Environment Variables:

### Database Configuration
```
DATABASE_URL=postgresql://your_postgres_user:your_postgres_password@your_postgres_host:5432/your_database_name
```
*Replace with your actual PostgreSQL connection string from Render*

### JWT Configuration  
```
SECRET_KEY=jmHuWR7bbsY6l4qQ2KlonbOPm9mAv28-20ygTjXlfQA
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### API Configuration
```
API_HOST=0.0.0.0
DEBUG=false
```
*Note: Don't set API_PORT - Render will automatically set PORT environment variable*

### App Configuration
```
APP_NAME=RTGS Automation App
```

### File Configuration
```
UPLOAD_DIR=./uploads
TEMPLATE_DIR=./templates
```

## Important Notes:

1. **PORT**: Do NOT set this manually - Render automatically sets the PORT environment variable
2. **DATABASE_URL**: Use the PostgreSQL connection string from your Render PostgreSQL service
3. **DEBUG**: Set to `false` for production
4. **CORS**: The app is configured to allow Render domains
5. **email-validator**: Added to requirements.txt for EmailStr field validation in user schemas

## Recent Fixes:
- ✅ Fixed PORT environment variable handling with Pydantic field validation
- ✅ Added email-validator==2.2.0 for EmailStr fields in user schemas
- ✅ Updated requirements.txt with all necessary dependencies

## Deployment Command:
```
python backend/start_server.py
```

The application will now correctly handle the PORT environment variable that Render provides automatically.