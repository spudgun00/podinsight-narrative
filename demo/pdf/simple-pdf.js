const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

async function generatePDF() {
    let browser;
    
    try {
        console.log('📋 Checking for weekly-brief.html...');
        const htmlPath = path.join(__dirname, 'weekly-brief.html');
        
        if (!fs.existsSync(htmlPath)) {
            throw new Error('weekly-brief.html not found!');
        }
        
        console.log('✅ HTML file found');
        console.log('🚀 Launching browser...');
        
        // Simple browser launch with minimal options
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        console.log('✅ Browser launched');
        
        const page = await browser.newPage();
        
        // Navigate to file using file:// protocol
        const fileUrl = `file://${htmlPath}`;
        console.log('📄 Loading HTML from:', fileUrl);
        
        await page.goto(fileUrl, {
            waitUntil: 'networkidle2',
            timeout: 30000
        });
        
        console.log('✅ Page loaded');
        
        // Wait a bit for fonts to load
        await page.waitForTimeout(2000);
        
        // Generate PDF
        console.log('🖨️  Generating PDF...');
        
        await page.pdf({
            path: 'vcpulse-weekly-brief.pdf',
            format: 'A4',
            printBackground: true,
            margin: {
                top: '10mm',
                right: '10mm',
                bottom: '10mm',
                left: '10mm'
            }
        });
        
        console.log('✅ PDF generated successfully!');
        console.log('📄 Output: vcpulse-weekly-brief.pdf');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Run it
generatePDF();