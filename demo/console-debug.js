// COPY AND PASTE THIS INTO THE BROWSER CONSOLE AT http://localhost:8000/demo.html

console.clear();
console.log('🔍 DEBUGGING PRIORITY BRIEFINGS FILTER');
console.log('=====================================\n');

// Check current filter value
const filterSelect = document.getElementById('podcast-filter');
console.log('Current filter:', filterSelect?.value);

// Get all episode cards
const cards = document.querySelectorAll('.episode-card');
console.log('Total cards:', cards.length);

// Show each card's podcast name
console.log('\n📋 Episode cards:');
cards.forEach((card, i) => {
    const nameEl = card.querySelector('.podcast-name');
    const name = nameEl ? nameEl.textContent : 'NO NAME';
    const isFiltered = card.classList.contains('filtered-out');
    const style = window.getComputedStyle(card);
    
    console.log(`Card ${i}: "${name}"`);
    console.log(`  - Has filtered-out class: ${isFiltered}`);
    console.log(`  - Display: ${style.display}`);
    console.log(`  - Visibility: ${style.visibility}`);
});

// Test changing to 20VC
console.log('\n🧪 Testing 20VC filter...');
filterSelect.value = '20VC with Harry Stebbings';
filterSelect.dispatchEvent(new Event('change'));

// Wait and check results
setTimeout(() => {
    console.log('\n📊 Results after filter change:');
    
    const grid = document.querySelector('.briefings-list.episode-grid');
    console.log('Grid classes:', grid?.className);
    
    let visibleCount = 0;
    cards.forEach((card, i) => {
        const nameEl = card.querySelector('.podcast-name');
        const name = nameEl ? nameEl.textContent.trim() : 'NO NAME';
        const isFiltered = card.classList.contains('filtered-out');
        const style = window.getComputedStyle(card);
        const isVisible = style.display !== 'none';
        
        if (isVisible) visibleCount++;
        
        if (name === '20VC with Harry Stebbings') {
            console.log(`\n✅ Found 20VC card (Card ${i}):`);
            console.log(`  - Has filtered-out class: ${isFiltered}`);
            console.log(`  - Display: ${style.display}`);
            console.log(`  - Visibility: ${style.visibility}`);
            console.log(`  - Is visible: ${isVisible}`);
        }
    });
    
    console.log(`\nTotal visible cards: ${visibleCount}`);
    console.log('Expected: 1 (just 20VC)');
    
    if (visibleCount !== 1) {
        console.error('❌ Filter is not working correctly!');
    } else {
        console.log('✅ Filter is working!');
    }
}, 1000);