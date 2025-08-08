// Generate Dynamic Insights from Unified Data
// Uses chart-based insights that analyze visual patterns

(function() {
    'use strict';
    
    // Function to get chart insights from unified data
    function getChartInsights() {
        if (!window.unifiedData || !window.unifiedData.narrativePulse || !window.unifiedData.narrativePulse.chartInsights) {
            console.log('Waiting for unified data with chart insights...');
            return null;
        }
        
        // Return the pre-calculated chart insights
        return window.unifiedData.narrativePulse.chartInsights;
    }
    
    // Update function that uses chart insights
    function updateInsightCards() {
        const chartInsights = getChartInsights();
        if (!chartInsights) return;
        
        const insightCards = document.querySelectorAll('.insight-card .insight-text');
        if (insightCards.length < 3) return;
        
        // Get current time range from NarrativePulse
        let currentTimeRange = '7 days';
        if (window.NarrativePulse && window.NarrativePulse.currentTimeRange) {
            currentTimeRange = window.NarrativePulse.currentTimeRange;
        }
        
        const currentInsights = chartInsights[currentTimeRange] || chartInsights['7 days'];
        
        // Update each card with chart insights
        currentInsights.forEach((insight, index) => {
            if (insightCards[index]) {
                insightCards[index].innerHTML = `
                    <span class="insight-highlight">${insight.type}:</span> ${insight.description}
                `;
            }
        });
        
        console.log('Updated insights with chart patterns:', currentInsights);
    }
    
    // Initialize when ready
    const initialize = () => {
        if (!window.unifiedData || !window.NarrativePulse) {
            setTimeout(initialize, 100);
            return;
        }
        
        // Override the updateInsightCards method
        window.NarrativePulse.updateInsightCards = updateInsightCards;
        
        // Update immediately if component is already initialized
        if (window.NarrativePulse.container) {
            updateInsightCards();
        }
        
        // Listen for time range changes
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-button')) {
                setTimeout(updateInsightCards, 100);
            }
        });
        
        // Use MutationObserver as backup
        const observer = new MutationObserver((mutations) => {
            const insightCards = document.querySelectorAll('.insight-card .insight-text');
            if (insightCards.length > 0) {
                const firstCard = insightCards[0].textContent;
                if (firstCard.includes('Strong Consensus:') || firstCard.includes('AI infrastructure investment')) {
                    updateInsightCards();
                }
            }
        });
        
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // Clean up after 30 seconds
        setTimeout(() => observer.disconnect(), 30000);
    };
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();