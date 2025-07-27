#!/usr/bin/env python3
"""
Launch both VC and Crypto versions on different ports
"""
import subprocess
import sys
import time
import webbrowser
from threading import Thread

def run_server(port, version):
    """Run a server on the specified port"""
    print(f"Starting {version} server on port {port}...")
    try:
        subprocess.run([sys.executable, "-m", "http.server", str(port)], check=True)
    except KeyboardInterrupt:
        print(f"\n{version} server stopped.")

def main():
    print("Starting both Synthea.ai demos...\n")
    print("VC Version: http://localhost:8000/demo.html")
    print("Crypto Version: http://localhost:9000/demo.html")
    print("\nPress Ctrl+C to stop both servers\n")
    
    # Start servers in separate threads
    vc_thread = Thread(target=run_server, args=(8000, "VC"))
    crypto_thread = Thread(target=run_server, args=(9000, "Crypto"))
    
    vc_thread.daemon = True
    crypto_thread.daemon = True
    
    vc_thread.start()
    crypto_thread.start()
    
    # Give servers a moment to start
    time.sleep(1)
    
    # Optionally open browsers
    try:
        response = input("\nOpen both demos in browser? (y/n): ")
        if response.lower() == 'y':
            webbrowser.open("http://localhost:8000/demo.html")
            time.sleep(0.5)
            webbrowser.open("http://localhost:9000/demo.html")
    except:
        pass
    
    # Keep the script running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\nShutting down both servers...")
        sys.exit(0)

if __name__ == "__main__":
    main()