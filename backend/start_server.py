import sys
import os

# Add the backend directory to Python path
backend_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, backend_dir)

try:
    import uvicorn
    from app.main import app
    from app.config import settings
    
    # Use PORT environment variable if available (for Render), otherwise use settings
    port = int(os.getenv('PORT', settings.api_port))
    
    print(f"Starting RTGS Automation Backend Server on port {port}...")
    uvicorn.run(app, host=settings.api_host, port=port, reload=settings.debug)
except ImportError as e:
    print(f"Import error: {e}")
    print("Please check if all dependencies are installed")
except Exception as e:
    print(f"Error starting server: {e}")