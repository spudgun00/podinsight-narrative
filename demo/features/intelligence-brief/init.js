// Initialize Intelligence Brief component
document.addEventListener('DOMContentLoaded', async function() {
    const container = document.getElementById('intelligence-brief-container');
    
    if (container) {
        try {
            // Fetch the template
            const response = await fetch('features/intelligence-brief/intelligence-brief.html');
            const html = await response.text();
            
            // Insert the HTML
            container.innerHTML = html;
            
            // Initialize the component
            const sidebar = container.querySelector('.synthesis-sidebar');
            if (sidebar && window.IntelligenceBrief) {
                window.IntelligenceBrief.init(sidebar);
            }
        } catch (error) {
            console.error('Failed to load Intelligence Brief component:', error);
        }
    }
});