"""
Production server entry point.
Uses Waitress — a production-quality WSGI server for Windows.

Usage:
    python serve.py
"""

import os
from waitress import serve
from app import create_app

app = create_app()

HOST   = os.getenv('HOST', '0.0.0.0')
PORT   = int(os.getenv('PORT', 5000))
THREADS = int(os.getenv('THREADS', 4))

if __name__ == '__main__':
    print(f"🚀  Production server starting on http://{HOST}:{PORT}")
    print(f"    Threads : {THREADS}")
    print(f"    Press Ctrl+C to stop.\n")
    serve(
        app,
        host=HOST,
        port=PORT,
        threads=THREADS,
        channel_timeout=60,
        cleanup_interval=30,
    )
