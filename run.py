#!/usr/bin/env python3
"""
Run.py - Start both Backend API and Frontend simultaneously
"""
import subprocess
import sys
import os
import time
import signal
from pathlib import Path

# Color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

# Get project root directory
PROJECT_ROOT = Path(__file__).parent.absolute()
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "Frontend" / "material-kit-react-main"

# Process tracking
processes = []

def print_header(message):
    """Print colored header message."""
    print(f"\n{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{message:^60}{Colors.ENDC}")
    print(f"{Colors.HEADER}{Colors.BOLD}{'='*60}{Colors.ENDC}\n")

def print_success(message):
    """Print success message."""
    print(f"{Colors.OKGREEN}✅ {message}{Colors.ENDC}")

def print_error(message):
    """Print error message."""
    print(f"{Colors.FAIL}❌ {message}{Colors.ENDC}")

def print_info(message):
    """Print info message."""
    print(f"{Colors.OKCYAN}ℹ️  {message}{Colors.ENDC}")

def print_warning(message):
    """Print warning message."""
    print(f"{Colors.WARNING}⚠️  {message}{Colors.ENDC}")

def check_port(port):
    """Check if a port is in use."""
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

def kill_port(port):
    """Kill process using a specific port."""
    try:
        if sys.platform == 'darwin' or sys.platform == 'linux':
            # macOS/Linux
            subprocess.run(f"lsof -ti:{port} | xargs kill -9 2>/dev/null || true", 
                         shell=True, check=False)
        elif sys.platform == 'win32':
            # Windows
            subprocess.run(f"FOR /F \"tokens=5\" %P IN ('netstat -a -n -o ^| findstr :{port}') DO TaskKill.exe /F /PID %P",
                         shell=True, check=False)
        time.sleep(1)
    except Exception as e:
        print_warning(f"Could not kill process on port {port}: {e}")

def check_dependencies():
    """Check if required dependencies exist."""
    print_header("Checking Dependencies")
    
    # Check Python venv
    venv_path = BACKEND_DIR / ".venv"
    if not venv_path.exists():
        print_error(f"Backend virtual environment not found at {venv_path}")
        print_info("Run: cd backend && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt")
        return False
    print_success("Backend virtual environment found")
    
    # Check Node modules
    node_modules = FRONTEND_DIR / "node_modules"
    if not node_modules.exists():
        print_error(f"Frontend node_modules not found at {node_modules}")
        print_info("Run: cd Frontend/material-kit-react-main && npm install")
        return False
    print_success("Frontend node_modules found")
    
    return True

def start_backend():
    """Start the FastAPI backend server."""
    print_header("Starting Backend API")
    
    # Check if port 8000 is in use
    if check_port(8000):
        print_warning("Port 8000 is already in use. Attempting to free it...")
        kill_port(8000)
        time.sleep(2)
    
    # Determine Python executable path
    if sys.platform == 'win32':
        python_exec = BACKEND_DIR / ".venv" / "Scripts" / "python.exe"
    else:
        python_exec = BACKEND_DIR / ".venv" / "bin" / "python"
    
    # Start backend
    try:
        cmd = [
            str(python_exec),
            "-m",
            "uvicorn",
            "backend.main:app",
            "--reload",
            "--port",
            "8000",
            "--host",
            "127.0.0.1"
        ]
        
        print_info(f"Starting backend at http://127.0.0.1:8000")
        print_info(f"Command: {' '.join(cmd)}")
        
        process = subprocess.Popen(
            cmd,
            cwd=PROJECT_ROOT,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        
        processes.append(process)
        
        # Wait for backend to start (check for "Application startup complete")
        print_info("Waiting for backend to initialize...")
        timeout = 30
        start_time = time.time()
        backend_ready = False
        
        while time.time() - start_time < timeout:
            if check_port(8000):
                backend_ready = True
                break
            time.sleep(0.5)
        
        if backend_ready:
            print_success("Backend API started successfully!")
            print_info("API Docs: http://127.0.0.1:8000/docs")
            print_info("Health Check: http://127.0.0.1:8000/health")
            return True
        else:
            print_error("Backend failed to start within timeout")
            return False
            
    except Exception as e:
        print_error(f"Failed to start backend: {e}")
        return False

def start_frontend():
    """Start the Next.js frontend server."""
    print_header("Starting Frontend")
    
    # Check if port 3000 is in use
    if check_port(3000):
        print_warning("Port 3000 is already in use. Attempting to free it...")
        kill_port(3000)
        time.sleep(2)
    
    try:
        # Determine npm command
        npm_cmd = "npm.cmd" if sys.platform == 'win32' else "npm"
        
        cmd = [npm_cmd, "run", "dev"]
        
        print_info(f"Starting frontend at http://localhost:3000")
        print_info(f"Command: {' '.join(cmd)}")
        
        process = subprocess.Popen(
            cmd,
            cwd=FRONTEND_DIR,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            universal_newlines=True,
            bufsize=1
        )
        
        processes.append(process)
        
        # Wait for frontend to start
        print_info("Waiting for frontend to initialize...")
        timeout = 60
        start_time = time.time()
        frontend_ready = False
        
        while time.time() - start_time < timeout:
            if check_port(3000):
                frontend_ready = True
                break
            time.sleep(0.5)
        
        if frontend_ready:
            print_success("Frontend started successfully!")
            print_info("Dashboard: http://localhost:3000")
            return True
        else:
            print_error("Frontend failed to start within timeout")
            return False
            
    except Exception as e:
        print_error(f"Failed to start frontend: {e}")
        return False

def cleanup(signum=None, frame=None):
    """Cleanup function to kill all processes."""
    print_header("Shutting Down Servers")
    
    for process in processes:
        try:
            print_info(f"Stopping process {process.pid}...")
            process.terminate()
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            print_warning(f"Force killing process {process.pid}...")
            process.kill()
        except Exception as e:
            print_warning(f"Error stopping process: {e}")
    
    # Extra cleanup for ports
    print_info("Cleaning up ports...")
    kill_port(8000)
    kill_port(3000)
    
    print_success("All servers stopped!")
    sys.exit(0)

def monitor_processes():
    """Monitor running processes and show their output."""
    print_header("Servers Running")
    print_success("Backend API: http://127.0.0.1:8000")
    print_success("Frontend: http://localhost:3000")
    print_success("API Docs: http://127.0.0.1:8000/docs")
    print_info("Press Ctrl+C to stop all servers")
    print()
    
    try:
        while True:
            for i, process in enumerate(processes):
                # Check if process is still running
                if process.poll() is not None:
                    print_error(f"Process {i} (PID {process.pid}) has stopped unexpectedly!")
                    cleanup()
                    return
            
            time.sleep(1)
            
    except KeyboardInterrupt:
        print()
        print_info("Received interrupt signal...")
        cleanup()

def main():
    """Main function to orchestrate startup."""
    # Setup signal handlers
    signal.signal(signal.SIGINT, cleanup)
    signal.signal(signal.SIGTERM, cleanup)
    
    print_header("TradeSphere Bloomberg Terminal - Startup")
    print_info(f"Project Root: {PROJECT_ROOT}")
    
    # Check dependencies
    if not check_dependencies():
        print_error("Dependency check failed. Please install missing dependencies.")
        sys.exit(1)
    
    # Start backend
    if not start_backend():
        print_error("Failed to start backend. Exiting.")
        cleanup()
        sys.exit(1)
    
    # Give backend a moment to fully initialize
    time.sleep(3)
    
    # Start frontend
    if not start_frontend():
        print_error("Failed to start frontend. Stopping backend.")
        cleanup()
        sys.exit(1)
    
    # Give frontend a moment to fully initialize
    time.sleep(3)
    
    # Monitor processes
    monitor_processes()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print_error(f"Unexpected error: {e}")
        cleanup()
        sys.exit(1)
