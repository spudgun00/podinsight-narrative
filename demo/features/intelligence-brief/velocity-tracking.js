// Dynamic Velocity Tracking Update Script
(function() {
    let retryCount = 0;
    const maxRetries = 20;
    
    function updateVelocityTracking() {
        // Wait for narrative pulse data to be available
        if (typeof window.narrativePulseData === 'undefined') {
            if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(updateVelocityTracking, 200);
            }
            return;
        }
        
        // Get the 7-day data
        const sevenDayData = window.narrativePulseData.sevenDayData;
        if (!sevenDayData || !sevenDayData.topics) {
            console.log('No sevenDayData found');
            return;
        }
        
        // Find the velocity tracking container
        const velocitySection = Array.from(document.querySelectorAll('.section-title'))
            .find(el => el.textContent === 'VELOCITY TRACKING')
            ?.parentElement;
            
        if (!velocitySection) {
            if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(updateVelocityTracking, 200);
            }
            return;
        }
        
        // Clear existing momentum items (but preserve title and subtitle)
        const existingItems = velocitySection.querySelectorAll('.momentum-item');
        existingItems.forEach(item => item.remove());
        
        // Create momentum items for all topics
        const topics = Object.keys(sevenDayData.topics).sort((a, b) => {
            // Sort by momentum percentage (descending)
            const momentumA = parseFloat(sevenDayData.topics[a].displayMomentum.replace('%', '').replace('+', ''));
            const momentumB = parseFloat(sevenDayData.topics[b].displayMomentum.replace('%', '').replace('+', ''));
            return momentumB - momentumA;
        });
        
        topics.forEach(topic => {
            const topicData = sevenDayData.topics[topic];
            const momentum = topicData.displayMomentum;
            const isNegative = momentum.startsWith('-');
            
            const item = document.createElement('div');
            item.className = 'momentum-item';
            item.innerHTML = `
                <span class="momentum-theme">${topic}</span>
                <span class="momentum-change ${isNegative ? 'negative' : 'positive'}">${momentum} w/w</span>
            `;
            
            velocitySection.appendChild(item);
        });
        
        console.log('Velocity tracking updated with dynamic data:', topics.length, 'topics');
    }
    
    // Wait for both DOM and Intelligence Brief to be loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(updateVelocityTracking, 1000); // Give time for Intelligence Brief to load
        });
    } else {
        setTimeout(updateVelocityTracking, 1000); // Give time for Intelligence Brief to load
    }
    
    // Also listen for Intelligence Brief initialization
    window.addEventListener('intelligenceBriefLoaded', updateVelocityTracking);
})();