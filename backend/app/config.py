from pydantic_settings import BaseSettings
from typing import Optional, List
import os


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://username:password@localhost:5432/rtgs_automation"
    
    # JWT
    secret_key: str = "your-secret-key-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # API Configuration
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    debug: bool = True
    
    # CORS - using simple list (add your production domains here)
    cors_origins: List[str] = [
        "http://localhost:3000", 
        "http://localhost:3001", 
        "http://localhost:5173",
        "https://*.render.com",  # Allow all Render subdomains
        "*"  # Allow all origins for now (restrict this in production)
    ]
    
    # App
    app_name: str = "RTGS Automation App"
    
    # File Configuration
    upload_dir: str = "./uploads"
    template_dir: str = "./templates"
    
    # Security Configuration
    allowed_hosts: List[str] = ["localhost", "127.0.0.1"]
    
    class Config:
        env_file = ".env"
        extra = "ignore"


# Create settings instance
settings = Settings()

# Override port with PORT environment variable if it exists (for Render)
if os.getenv('PORT'):
    try:
        settings.api_port = int(os.getenv('PORT'))
    except (ValueError, TypeError):
        settings.api_port = 8000
