function initPriorityBriefings() {
    const container = document.getElementById('priority-briefings-container');
    if (!container) return;
    
    // Use dynamic implementation that reads from unified data
    if (window.PriorityBriefings) {
        window.PriorityBriefings.init(container);
    } else {
        console.error('Priority Briefings component not loaded');
        container.innerHTML = '<div class="error">Failed to load briefings</div>';
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initPriorityBriefings();
});