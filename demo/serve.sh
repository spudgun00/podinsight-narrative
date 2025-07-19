#!/bin/bash
# Simple server script for the demo
echo "Starting server for PodInsight demo..."
echo "Open http://localhost:8000/demo.html in your browser"
echo "Press Ctrl+C to stop"
python3 -m http.server 8000