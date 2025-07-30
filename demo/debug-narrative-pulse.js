// Debug script for Narrative Pulse
console.log('=== NARRATIVE PULSE DEBUG ===');

// Check data at different stages
setTimeout(() => {
    console.log('1. Checking unified data:');
    if (window.unifiedData && window.unifiedData.narrativePulse) {
        const topics = Object.keys(window.unifiedData.narrativePulse.topics);
        console.log('   - Topics in unified data:', topics);
    } else {
        console.log('   - ERROR: No unified data found');
    }
    
    console.log('\n2. Checking narrativePulseData:');
    if (window.narrativePulseData) {
        const topics = Object.keys(window.narrativePulseData.sevenDayData.topics);
        console.log('   - Topics in narrativePulseData:', topics);
        console.log('   - Sample data for first topic:', topics[0], window.narrativePulseData.sevenDayData.topics[topics[0]]);
    } else {
        console.log('   - ERROR: No narrativePulseData found');
    }
    
    console.log('\n3. Checking NarrativePulse object:');
    if (window.NarrativePulse) {
        console.log('   - Available topics:', window.NarrativePulse.availableTopics);
        console.log('   - Selected topics:', window.NarrativePulse.selectedTopics);
        console.log('   - TimeRangeData populated?', Object.keys(window.NarrativePulse.timeRangeData['7 days'].topics).length > 0);
        if (window.NarrativePulse.timeRangeData['7 days'].topics) {
            const topics = Object.keys(window.NarrativePulse.timeRangeData['7 days'].topics);
            console.log('   - Topics in timeRangeData:', topics);
        }
    } else {
        console.log('   - ERROR: NarrativePulse not found');
    }
    
    console.log('\n4. Checking DOM:');
    const container = document.getElementById('narrative-pulse-container');
    if (container) {
        const hasChart = container.querySelector('.chart-container') !== null;
        console.log('   - Container found:', true);
        console.log('   - Chart initialized:', hasChart);
        
        // Check if paths are rendered
        const paths = container.querySelectorAll('.topic-line');
        console.log('   - Topic lines rendered:', paths.length);
        if (paths.length > 0) {
            paths.forEach(path => {
                console.log('     -', path.getAttribute('data-topic'));
            });
        }
    }
    
    console.log('=== END DEBUG ===');
}, 2000);