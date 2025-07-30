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
            const briefContent = container.querySelector('.brief-content');
            if (briefContent && window.IntelligenceBrief) {
                window.IntelligenceBrief.init(briefContent);
                
                // Check if unified data is loaded, if not wait for it
                if (!window.unifiedData) {
                    // Poll for unified data to be loaded
                    const checkDataInterval = setInterval(() => {
                        if (window.unifiedData) {
                            clearInterval(checkDataInterval);
                            // Update consensus monitor with default 7 days view
                            window.IntelligenceBrief.updateConsensusMonitor('7 days');
                            // Update velocity tracking
                            window.IntelligenceBrief.updateVelocityTracking();
                        }
                    }, 100);
                    
                    // Stop checking after 5 seconds to prevent infinite loop
                    setTimeout(() => clearInterval(checkDataInterval), 5000);
                }
            }
        } catch (error) {
            console.error('Failed to load Intelligence Brief component:', error);
        }
    }
});