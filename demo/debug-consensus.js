// Debug script to check Consensus Monitor implementation
console.log('=== Consensus Monitor Debug ===');

// Check if data is available
if (window.unifiedData) {
    console.log('✓ unifiedData is available');
    
    if (window.unifiedData.intelligenceBrief && 
        window.unifiedData.intelligenceBrief.metrics && 
        window.unifiedData.intelligenceBrief.metrics.consensusMonitor) {
        
        console.log('✓ consensusMonitor data found:');
        console.table(window.unifiedData.intelligenceBrief.metrics.consensusMonitor);
    } else {
        console.error('✗ consensusMonitor data not found');
    }
} else {
    console.error('✗ unifiedData not available');
}

// Check if IntelligenceBrief component is available
if (window.IntelligenceBrief) {
    console.log('✓ IntelligenceBrief component loaded');
} else {
    console.error('✗ IntelligenceBrief component not loaded');
}

// Check DOM elements
document.addEventListener('DOMContentLoaded', function() {
    const container = document.querySelector('.consensus-monitor-container');
    if (container) {
        console.log('✓ Consensus monitor container found');
        
        // Wait for component to render
        setTimeout(() => {
            const items = container.querySelectorAll('.consensus-item');
            console.log(`✓ Found ${items.length} consensus items`);
            
            if (items.length > 0) {
                console.log('✓ Progress bars rendered successfully');
                
                // Check first item details
                const firstItem = items[0];
                const label = firstItem.querySelector('.consensus-label');
                const bar = firstItem.querySelector('.consensus-bar');
                const percentage = firstItem.querySelector('.consensus-percentage');
                const trend = firstItem.querySelector('.consensus-trend');
                
                console.log('First item details:');
                console.log('- Label:', label ? label.textContent : 'Not found');
                console.log('- Bar width:', bar ? bar.style.width : 'Not found');
                console.log('- Percentage:', percentage ? percentage.textContent : 'Not found');
                console.log('- Trend:', trend ? trend.textContent.trim() : 'Not found');
            }
        }, 1000);
    } else {
        console.error('✗ Consensus monitor container not found');
    }
});