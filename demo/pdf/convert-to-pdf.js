const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function convertToPDF() {
    console.log('🚀 Starting VCPulse Weekly Brief PDF conversion...');
    
    try {
        // Launch headless browser with optimized settings
        const browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--font-render-hinting=none', // Better font rendering
                '--disable-gpu',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials'
            ],
            timeout: 60000, // Increase timeout to 60 seconds
            protocolTimeout: 60000
        });
        
        const page = await browser.newPage();
        
        // Set viewport to ensure consistent rendering
        await page.setViewport({
            width: 1200,
            height: 1600,
            deviceScaleFactor: 2 // Higher quality rendering
        });
        
        // Read the HTML file
        const htmlPath = path.join(__dirname, 'weekly-brief.html');
        if (!fs.existsSync(htmlPath)) {
            throw new Error(`HTML file not found: ${htmlPath}`);
        }
        
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        // Set content with proper base URL for resources
        await page.setContent(htmlContent, {
            waitUntil: ['networkidle0', 'domcontentloaded'],
            timeout: 30000
        });
        
        // Wait for fonts to fully load
        await page.evaluateHandle('document.fonts.ready');
        
        // Additional wait for any animations to complete
        await page.waitForTimeout(2000);
        
        // Inject print-specific CSS to handle animations and ensure quality
        await page.addStyleTag({
            content: `
                @media print {
                    /* Disable animations for PDF */
                    *, *::before, *::after {
                        animation-duration: 0s !important;
                        animation-delay: 0s !important;
                        transition-duration: 0s !important;
                        transition-delay: 0s !important;
                    }
                    
                    /* Ensure backgrounds are printed */
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                        background: white !important;
                    }
                    
                    /* Fix gradient rendering */
                    .container::before {
                        background: linear-gradient(90deg, #16a34a 0%, #22c55e 50%, #16a34a 100%) !important;
                        animation: none !important;
                    }
                    
                    /* Ensure all cards have proper backgrounds */
                    .card, .metric-card, .consensus-item, .alert-box, .action-box {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    
                    /* Fix page breaks */
                    .card, .consensus-item, .alert-grid, .action-box {
                        break-inside: avoid;
                        page-break-inside: avoid;
                    }
                    
                    /* Ensure watermark is visible */
                    .container::after {
                        color: rgba(0, 0, 0, 0.03) !important;
                    }
                }
            `
        });
        
        // PDF generation options for best quality
        const pdfOptions = {
            path: path.join(__dirname, 'vcpulse-weekly-brief.pdf'),
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: false,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            },
            displayHeaderFooter: false,
            scale: 1
        };
        
        // Generate A4 PDF
        console.log('📄 Generating A4 PDF...');
        await page.pdf(pdfOptions);
        console.log('✅ A4 PDF generated: vcpulse-weekly-brief.pdf');
        
        // Generate US Letter version
        console.log('📄 Generating US Letter PDF...');
        await page.pdf({
            ...pdfOptions,
            path: path.join(__dirname, 'vcpulse-weekly-brief-letter.pdf'),
            format: 'Letter'
        });
        console.log('✅ US Letter PDF generated: vcpulse-weekly-brief-letter.pdf');
        
        // Generate high-quality version with no margins
        console.log('📄 Generating high-quality full-bleed PDF...');
        await page.pdf({
            ...pdfOptions,
            path: path.join(__dirname, 'vcpulse-weekly-brief-hq.pdf'),
            format: 'A4',
            margin: {
                top: '0mm',
                right: '0mm',
                bottom: '0mm',
                left: '0mm'
            }
        });
        console.log('✅ High-quality PDF generated: vcpulse-weekly-brief-hq.pdf');
        
        // Get file sizes
        const a4Size = (fs.statSync(path.join(__dirname, 'vcpulse-weekly-brief.pdf')).size / 1024 / 1024).toFixed(2);
        const letterSize = (fs.statSync(path.join(__dirname, 'vcpulse-weekly-brief-letter.pdf')).size / 1024 / 1024).toFixed(2);
        const hqSize = (fs.statSync(path.join(__dirname, 'vcpulse-weekly-brief-hq.pdf')).size / 1024 / 1024).toFixed(2);
        
        console.log('\n📊 PDF Generation Summary:');
        console.log('─────────────────────────────────────');
        console.log(`📄 A4 PDF: ${a4Size} MB`);
        console.log(`📄 Letter PDF: ${letterSize} MB`);
        console.log(`📄 HQ PDF: ${hqSize} MB`);
        console.log('─────────────────────────────────────');
        console.log('✨ All PDFs generated successfully!');
        
        await browser.close();
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

// Self-executing async function
(async () => {
    try {
        await convertToPDF();
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
})();