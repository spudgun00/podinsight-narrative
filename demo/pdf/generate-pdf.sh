#!/bin/bash

# VCPulse PDF Generator Script

echo "VCPulse Weekly Intelligence Brief - PDF Generator"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "1.html" ]; then
    echo "Error: 1.html not found in current directory"
    echo "Please run this script from the demo/pdf directory"
    exit 1
fi

# Option 1: Try Python/weasyprint first (usually easier to install)
if command -v python3 &> /dev/null; then
    echo "Checking for Python weasyprint..."
    if python3 -c "import weasyprint" &> /dev/null; then
        echo "Using Python weasyprint to generate PDF..."
        python3 generate-pdf.py
        exit 0
    else
        echo "weasyprint not installed. To use Python method:"
        echo "  pip install weasyprint"
        echo ""
    fi
fi

# Option 2: Try Node.js/puppeteer
if command -v node &> /dev/null; then
    echo "Checking for Node.js puppeteer..."
    if [ -d "node_modules/puppeteer" ]; then
        echo "Using Node.js puppeteer to generate PDF..."
        node generate-pdf.js
        exit 0
    else
        echo "puppeteer not installed. To use Node.js method:"
        echo "  npm install"
        echo "  npm run generate"
        echo ""
    fi
fi

# Option 3: Use browser print dialog
echo "Automated PDF generation not available."
echo ""
echo "To generate PDF manually:"
echo "1. Open 1.html in your web browser"
echo "2. Press Cmd+P (Mac) or Ctrl+P (Windows/Linux)"
echo "3. Select 'Save as PDF'"
echo "4. Make sure 'Background graphics' is enabled"
echo "5. Set margins to 'None' or 'Minimum'"
echo "6. Save as 'vcpulse-weekly-brief.pdf'"

# Make the script executable
chmod +x generate-pdf.sh 2>/dev/null

exit 1