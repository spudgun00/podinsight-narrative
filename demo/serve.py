#!/usr/bin/env python3
import http.server
import socketserver
import os

PORT = int(os.environ.get('PORT', 8000))

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for better compatibility
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        # The document must revalidate on every load. Assets carry ?v= and can
        # be cached hard; demo.html cannot carry one, so a stale copy of it
        # quietly serves the previous build of all 45 assets by their old ?v=.
        # That is not hypothetical: it made a before/after screenshot pair on
        # 30 Aug render the same build twice. Mirrors the header vercel.json
        # sets in production, so local and deployed behave the same.
        if self.path.rstrip('/').endswith('demo.html') or self.path in ('/', ''):
            self.send_header('Cache-Control', 'no-cache, must-revalidate')
        super().end_headers()

os.chdir(os.path.dirname(os.path.abspath(__file__)))

with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
    print(f"Server running at http://localhost:{PORT}/")
    print(f"Open http://localhost:{PORT}/demo.html in your browser")
    print("Press Ctrl+C to stop")
    httpd.serve_forever()