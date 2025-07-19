#!/bin/bash

# Simple Chrome PDF generator for VCPulse Weekly Brief

echo "🖨️  VCPulse PDF Generator (using Chrome)"
echo "────────────────────────────────────"

# Check if weekly-brief.html exists
if [ ! -f "weekly-brief.html" ]; then
    echo "❌ weekly-brief.html not found!"
    exit 1
fi

# Get absolute path
HTML_PATH="$(pwd)/weekly-brief.html"
PDF_PATH="$(pwd)/vcpulse-weekly-brief.pdf"

# Find Chrome/Chromium executable
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    CHROME_PATHS=(
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
        "/Applications/Chromium.app/Contents/MacOS/Chromium"
        "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
    )
else
    # Linux
    CHROME_PATHS=(
        "/usr/bin/google-chrome"
        "/usr/bin/chromium-browser"
        "/usr/bin/chromium"
        "/usr/bin/brave-browser"
    )
fi

# Find first available Chrome
CHROME_BIN=""
for chrome in "${CHROME_PATHS[@]}"; do
    if [ -x "$chrome" ]; then
        CHROME_BIN="$chrome"
        echo "✅ Found Chrome at: $chrome"
        break
    fi
done

if [ -z "$CHROME_BIN" ]; then
    echo "❌ Chrome/Chromium not found!"
    echo "Please install Google Chrome or Chromium"
    exit 1
fi

# Generate PDF using headless Chrome
echo "📄 Generating PDF..."

"$CHROME_BIN" \
    --headless \
    --disable-gpu \
    --no-sandbox \
    --print-to-pdf="$PDF_PATH" \
    --print-to-pdf-no-header \
    --run-all-compositor-stages-before-draw \
    --virtual-time-budget=10000 \
    "file://$HTML_PATH"

if [ -f "$PDF_PATH" ]; then
    echo "✅ PDF generated successfully!"
    echo "📄 Output: $PDF_PATH"
    
    # Get file size
    SIZE=$(ls -lh "$PDF_PATH" | awk '{print $5}')
    echo "📊 File size: $SIZE"
    
    # Open on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "👁️  Opening PDF preview..."
        open "$PDF_PATH"
    fi
else
    echo "❌ PDF generation failed"
    exit 1
fi