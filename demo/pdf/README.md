# VCPulse Weekly Intelligence Brief - PDF Generation

This directory contains the HTML template and scripts to generate PDF versions of the VCPulse Weekly Intelligence Brief.

## Files

- `1.html` - The styled HTML template for the weekly brief
- `weekly-brief.html` - Alternative version of the weekly brief
- `generate-pdf.js` - Node.js script using Puppeteer
- `generate-pdf.py` - Python script using WeasyPrint
- `generate-pdf.sh` - Shell script that tries both methods
- `package.json` - Node.js dependencies

## Quick Start

The easiest way to generate a PDF is to run:

```bash
./generate-pdf.sh
```

This script will automatically try available methods and guide you through the process.

## Method 1: Python with WeasyPrint (Recommended)

### Installation
```bash
pip install weasyprint
```

### Generate PDF
```bash
python3 generate-pdf.py
```

This will create:
- `vcpulse-weekly-brief.pdf` (A4 size)
- `vcpulse-weekly-brief-letter.pdf` (US Letter size)

## Method 2: Node.js with Puppeteer

### Installation
```bash
npm install
```

### Generate PDF
```bash
npm run generate
# or
node generate-pdf.js
```

This will create:
- `vcpulse-weekly-brief.pdf` (A4 size)
- `vcpulse-weekly-brief-letter.pdf` (US Letter size)

## Method 3: Manual Browser Print

1. Open `1.html` in your web browser (Chrome recommended)
2. Press `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux)
3. Configure print settings:
   - Destination: Save as PDF
   - Layout: Portrait
   - Paper size: A4 or Letter
   - Margins: None
   - Options: ✓ Background graphics
4. Click "Save" and name it `vcpulse-weekly-brief.pdf`

## Troubleshooting

### WeasyPrint Installation Issues

On macOS:
```bash
brew install python3 cairo pango gdk-pixbuf libffi
pip install weasyprint
```

On Ubuntu/Debian:
```bash
sudo apt-get install python3-pip python3-cffi python3-brotli libpango-1.0-0 libharfbuzz0b libpangoft2-1.0-0
pip install weasyprint
```

### Puppeteer Installation Issues

If Puppeteer fails to download Chromium:
```bash
npm install puppeteer --unsafe-perm=true --allow-root
```

## Features

The generated PDF includes:
- Professional VCPulse branding with microphone logo
- Executive summary with key insights
- Metrics dashboard (Velocity, Mentions, Consensus, Alerts)
- Topic momentum tracking with visual progress bars
- Consensus forming section
- Contrarian signals and emerging blindspots
- Recommended actions (This Week / Monitor)
- Footer with synthesis information

## Customization

To modify the content:
1. Edit `1.html` with your weekly data
2. Regenerate the PDF using any method above

The HTML uses modern CSS with:
- Gradient effects
- Custom fonts (Inter)
- Print-optimized styles
- Professional color scheme
- Animated elements (visible in browser, static in PDF)