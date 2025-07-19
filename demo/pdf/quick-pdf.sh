#!/bin/bash

# VCPulse Quick PDF Generator
# Converts weekly-brief.html to PDF with perfect styling

echo "╔════════════════════════════════════════╗"
echo "║     VCPulse Weekly Brief PDF Gen       ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js 18+ is recommended (you have $(node -v))"
fi

# Check if weekly-brief.html exists
if [ ! -f "weekly-brief.html" ]; then
    echo "❌ weekly-brief.html not found in current directory"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules/puppeteer" ]; then
    echo "📦 Installing Puppeteer (this may take a moment)..."
    npm install --no-audit --no-fund
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install dependencies"
        exit 1
    fi
fi

# Run the PDF conversion
echo ""
echo "🚀 Converting weekly-brief.html to PDF..."
echo "─────────────────────────────────────────"

# Try Chrome method first (more reliable)
if [ -f "./chrome-pdf.sh" ]; then
    ./chrome-pdf.sh
    exit $?
fi

# Fallback to Node.js method
node convert-to-pdf.js

# Check if PDFs were created
if [ -f "vcpulse-weekly-brief.pdf" ]; then
    echo ""
    echo "✅ Success! PDFs created:"
    echo "   • vcpulse-weekly-brief.pdf (A4)"
    echo "   • vcpulse-weekly-brief-letter.pdf (US Letter)"
    echo "   • vcpulse-weekly-brief-hq.pdf (High Quality)"
    
    # Open the PDF if on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo ""
        echo "📄 Opening PDF preview..."
        open vcpulse-weekly-brief.pdf
    fi
else
    echo "❌ PDF generation failed"
    exit 1
fi