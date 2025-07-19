#!/usr/bin/env python3
"""
Generate PDF from VCPulse Weekly Intelligence Brief HTML
Requires: pip install weasyprint
"""

import os
import sys
from pathlib import Path

try:
    from weasyprint import HTML, CSS
except ImportError:
    print("Error: weasyprint not installed.")
    print("Please install it with: pip install weasyprint")
    sys.exit(1)

def generate_pdf():
    """Generate PDF from HTML file"""
    # Get the directory of this script
    script_dir = Path(__file__).parent
    
    # Input and output paths
    html_file = script_dir / "1.html"
    pdf_file = script_dir / "vcpulse-weekly-brief.pdf"
    
    if not html_file.exists():
        print(f"Error: HTML file not found: {html_file}")
        sys.exit(1)
    
    print("Starting PDF generation...")
    
    try:
        # Generate PDF
        HTML(filename=str(html_file)).write_pdf(
            str(pdf_file),
            stylesheets=[CSS(string='''
                @page {
                    size: A4;
                    margin: 0;
                }
                body {
                    margin: 0;
                }
            ''')]
        )
        
        print(f"PDF generated successfully: {pdf_file}")
        
        # Also generate US Letter version
        pdf_file_letter = script_dir / "vcpulse-weekly-brief-letter.pdf"
        HTML(filename=str(html_file)).write_pdf(
            str(pdf_file_letter),
            stylesheets=[CSS(string='''
                @page {
                    size: Letter;
                    margin: 0;
                }
                body {
                    margin: 0;
                }
            ''')]
        )
        
        print(f"PDF generated successfully: {pdf_file_letter} (US Letter)")
        
    except Exception as e:
        print(f"Error generating PDF: {e}")
        sys.exit(1)

if __name__ == "__main__":
    generate_pdf()