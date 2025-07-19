# VCPulse Weekly Brief - PDF Conversion Guide

## Quick Start (Recommended)

Run this single command to generate all PDF versions:

```bash
./quick-pdf.sh
```

This will:
1. Check dependencies
2. Install Puppeteer if needed
3. Generate 3 PDF versions
4. Open the PDF preview (on macOS)

## Manual Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Generate PDFs

```bash
npm run pdf
# or
node convert-to-pdf.js
```

## Output Files

The script generates 3 versions:

1. **`vcpulse-weekly-brief.pdf`** - Standard A4 with margins
2. **`vcpulse-weekly-brief-letter.pdf`** - US Letter format
3. **`vcpulse-weekly-brief-hq.pdf`** - High-quality full-bleed A4

## Features Preserved

✅ **All Visual Elements**
- Gradient backgrounds and animations (static in PDF)
- Custom Inter font from Google Fonts
- Watermark effect ("CONFIDENTIAL")
- All color schemes and shadows

✅ **Layout Integrity**
- Proper page breaks (no split cards)
- Consistent margins
- Print-optimized rendering

✅ **Content Sections**
- Executive Summary with highlighted keywords
- Metrics dashboard with gradient effects
- Topic momentum with progress bars
- Consensus items with hover effects (static)
- Alert boxes with gradient backgrounds
- Dark-themed action items section

## Troubleshooting

### Puppeteer Installation Issues

If npm install fails:

```bash
# macOS
brew install chromium

# Linux
sudo apt-get install chromium-browser

# Then install with specific flags
npm install puppeteer --unsafe-perm=true
```

### Font Issues

The Inter font is loaded from Google Fonts. Ensure internet connection during PDF generation.

### Memory Issues

For large documents:

```bash
NODE_OPTIONS="--max-old-space-size=4096" node convert-to-pdf.js
```

## Customization

Edit `convert-to-pdf.js` to adjust:

- **Margins**: Modify the `margin` object in `pdfOptions`
- **Quality**: Increase `deviceScaleFactor` for higher quality
- **Format**: Change `format` to 'A3', 'Tabloid', etc.
- **Timeout**: Increase timeout values for slower systems

## Advanced Options

### Generate Specific Version Only

```javascript
// In convert-to-pdf.js, comment out unwanted versions
// await page.pdf(pdfOptions); // A4
// await page.pdf({...}); // Letter
await page.pdf({...}); // HQ only
```

### Add Headers/Footers

```javascript
displayHeaderFooter: true,
headerTemplate: '<div style="font-size: 10px;">VCPulse Confidential</div>',
footerTemplate: '<div style="font-size: 10px;">Page <span class="pageNumber"></span></div>'
```

## System Requirements

- Node.js 18+ (recommended)
- 2GB RAM minimum
- ~500MB disk space (for Chromium)

## Performance

Typical generation times:
- First run: 30-60s (includes Chromium download)
- Subsequent runs: 5-10s

File sizes:
- Standard PDF: ~1-2 MB
- HQ PDF: ~2-3 MB