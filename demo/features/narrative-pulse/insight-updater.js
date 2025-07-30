// Insight Card Updater - Ensures dynamic data is shown
(function() {
    'use strict';
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Create observer to watch for insight cards being added to DOM
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check if insight cards were added
                    const insightCards = document.querySelectorAll('.insight-card .insight-text');
                    if (insightCards.length > 0) {
                        // Check if they contain hardcoded text
                        const hasHardcoded = Array.from(insightCards).some(card => 
                            card.textContent.includes('Strong Consensus:') ||
                            card.textContent.includes('AI infrastructure investment thesis')
                        );
                        
                        if (hasHardcoded && window.NarrativePulse && window.NarrativePulse.updateInsightCards) {
                            console.log('Detected hardcoded insight cards, updating with dynamic data...');
                            setTimeout(() => {
                                window.NarrativePulse.updateInsightCards();
                            }, 50);
                        }
                    }
                }
            });
        });
        
        // Start observing the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Stop observing after 30 seconds to prevent memory leaks
        setTimeout(() => {
            observer.disconnect();
        }, 30000);
    });
})();