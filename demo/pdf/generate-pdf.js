const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    console.log('Starting PDF generation...');
    
    try {
        // Launch headless browser
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        
        // Read the HTML file
        const htmlPath = path.join(__dirname, '1.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Set the content
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0'
        });
        
        // Wait for fonts to load
        await page.evaluateHandle('document.fonts.ready');
        
        // Generate PDF with print-friendly settings
        await page.pdf({
            path: path.join(__dirname, 'vcpulse-weekly-brief.pdf'),
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            },
            displayHeaderFooter: false,
            preferCSSPageSize: true
        });
        
        console.log('PDF generated successfully: vcpulse-weekly-brief.pdf');
        
        // Also generate a US Letter version
        await page.pdf({
            path: path.join(__dirname, 'vcpulse-weekly-brief-letter.pdf'),
            format: 'Letter',
            printBackground: true,
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            },
            displayHeaderFooter: false,
            preferCSSPageSize: true
        });
        
        console.log('PDF generated successfully: vcpulse-weekly-brief-letter.pdf (US Letter)');
        
        await browser.close();
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        process.exit(1);
    }
}

// Run the PDF generation
generatePDF();