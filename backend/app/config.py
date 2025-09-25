from pydantic_settings import BaseSettings
from pydantic import field_validator
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
    
    @field_validator('api_port', mode='before')
    @classmethod
    def validate_port(cls, v):
        # If it's already an integer, return it
        if isinstance(v, int):
            return v
        
        # Handle string values
        if isinstance(v, str):
            # If it's a reference to an environment variable like $PORT
            if v.startswith('$'):
                env_var_name = v[1:]  # Remove the $ prefix
                actual_value = os.getenv(env_var_name)
                if actual_value:
                    try:
                        return int(actual_value)
                    except (ValueError, TypeError):
                        pass
                # If we can't get the env var, try to get PORT directly
                port_value = os.getenv('PORT')
                if port_value:
                    try:
                        return int(port_value)
                    except (ValueError, TypeError):
                        pass
                return 8000  # Default fallback
            
            # Try to parse the string directly as an integer
            try:
                return int(v)
            except (ValueError, TypeError):
                return 8000  # Default fallback
        
        # For any other type, return default
        return 8000
    
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
