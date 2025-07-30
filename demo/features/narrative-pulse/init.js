// Narrative Pulse Component Initialization
// Loads the HTML template and initializes the component

function initNarrativePulse() {
    const container = document.getElementById('narrative-pulse-container');
    if (!container) {
        console.error('Narrative Pulse container not found');
        return;
    }
    
    // Load HTML template
    fetch('features/narrative-pulse/narrative-pulse.html')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(html => {
            container.classList.remove('loading'); // Remove loading state
            container.innerHTML = html;
            
            // Initialize the component after DOM is ready
            if (window.NarrativePulse) {
                window.NarrativePulse.init(container);
                console.log('Narrative Pulse component initialized successfully');
                
                // Force update insight cards with dynamic data after initialization
                setTimeout(() => {
                    if (window.NarrativePulse.updateInsightCards) {
                        window.NarrativePulse.updateInsightCards();
                        console.log('Updated insight cards with dynamic data');
                    }
                }, 100);
            } else {
                console.error('NarrativePulse object not found');
            }
        })
        .catch(error => {
            console.error('Failed to load Narrative Pulse component:', error);
            container.innerHTML = '<div class="error-message" style="padding: 20px; text-align: center; color: var(--dusty-rose);">Error: Could not load Narrative Pulse feature.</div>';
        });
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initNarrativePulse();
});