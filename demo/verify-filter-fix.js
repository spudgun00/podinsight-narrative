// Quick verification script for Priority Briefings filter fix
// Run this in the browser console on demo.html

console.log('=== Priority Briefings Filter Verification ===');

// Get the filter dropdown
const filterSelect = document.getElementById('podcast-filter');
if (!filterSelect) {
    console.error('❌ Filter dropdown not found!');
} else {
    console.log('✓ Filter dropdown found');
    
    // Test each filter option
    const testResults = [];
    const options = Array.from(filterSelect.options);
    
    console.log(`\nTesting ${options.length} filter options...`);
    
    options.forEach((option, index) => {
        // Skip if we're already on this option
        if (filterSelect.value === option.value) return;
        
        // Select the option
        filterSelect.value = option.value;
        filterSelect.dispatchEvent(new Event('change'));
        
        // Wait a moment for the filter to apply
        setTimeout(() => {
            const visibleCards = document.querySelectorAll('.episode-card:not(.filtered-out)');
            const actuallyVisible = Array.from(visibleCards).filter(card => {
                return window.getComputedStyle(card).display !== 'none';
            });
            
            console.log(`\n${option.text} (value: "${option.value}")`);
            console.log(`  Visible cards: ${actuallyVisible.length}`);
            
            if (actuallyVisible.length === 0 && option.value !== 'curated' && option.value !== 'all') {
                console.error(`  ❌ FAIL: No cards shown for ${option.text}`);
            } else {
                console.log(`  ✓ PASS: Cards shown`);
                
                // Show which podcasts are visible
                actuallyVisible.forEach(card => {
                    const podcastName = card.querySelector('.podcast-name')?.textContent.trim();
                    console.log(`    - ${podcastName}`);
                });
            }
        }, 300 * (index + 1));
    });
    
    console.log('\n=== End of verification ===');
    console.log('Note: If individual podcast filters show 0 cards, the fix needs to be applied.');
}

// Also test the normalize function if it exists
if (typeof normalizeStringForComparison !== 'undefined') {
    console.log('\n=== Testing normalizeStringForComparison ===');
    const tests = [
        ['20VC', '20VC'],
        ['20VC with Harry Stebbings', '20VC with Harry Stebbings'],
        [' Acquired ', 'Acquired'],
        ['The  Tim  Ferriss  Show', 'The Tim Ferriss Show']
    ];
    
    tests.forEach(([input, expected]) => {
        const result = normalizeStringForComparison(input);
        const expectedNorm = expected.toLowerCase().trim();
        console.log(`"${input}" → "${result}" ${result === expectedNorm ? '✓' : '❌'}`);
    });
}