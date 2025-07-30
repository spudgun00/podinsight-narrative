// Debug script to verify Narrative Pulse data updates
(function() {
    'use strict';
    
    // Check every 500ms until everything is loaded
    const checkInterval = setInterval(() => {
        if (window.NarrativePulse && window.NarrativePulse.container && window.unifiedData) {
            console.log('🔍 Narrative Pulse Debug Check:');
            
            // Check if unified data is available
            console.log('✓ Unified data loaded:', !!window.unifiedData);
            console.log('✓ Narrative Pulse initialized:', !!window.NarrativePulse.container);
            
            // Check insight cards
            const insightCards = document.querySelectorAll('.insight-card .insight-text');
            console.log(`✓ Found ${insightCards.length} insight cards`);
            
            insightCards.forEach((card, index) => {
                console.log(`  Card ${index + 1}: "${card.textContent.trim()}"`);
            });
            
            // Check if we still see hardcoded values
            const hasHardcodedText = Array.from(insightCards).some(card => 
                card.textContent.includes('Strong Consensus:')
            );
            
            if (hasHardcodedText) {
                console.warn('⚠️  Still showing hardcoded values! Forcing update...');
                
                // Force update the insight cards
                if (window.NarrativePulse.updateInsightCards) {
                    window.NarrativePulse.updateInsightCards();
                    console.log('✓ Forced insight cards update');
                }
            } else {
                console.log('✅ Insight cards showing dynamic data!');
            }
            
            // Clear interval once checked
            clearInterval(checkInterval);
        }
    }, 500);
    
    // Clear after 10 seconds to prevent infinite loop
    setTimeout(() => clearInterval(checkInterval), 10000);
})();