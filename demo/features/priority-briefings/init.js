function initPriorityBriefings() {
    const container = document.getElementById('priority-briefings-container');
    if (!container) return;
    
    fetch('features/priority-briefings/priority-briefings.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            
            // Check if we should use JavaScript mode (for rollback)
            const mode = container.dataset.showMoreMode || 'css';
            
            if (mode === 'js' && window.PriorityBriefingsJS) {
                // Use the JavaScript implementation (backup file)
                window.PriorityBriefingsJS.init(container);
            } else if (window.PriorityBriefings) {
                // Use the minimal JS (mainly for keyboard support)
                window.PriorityBriefings.init(container);
            }
            // CSS mode requires no initialization - it just works!
        })
        .catch(error => {
            console.error('Failed to load Priority Briefings:', error);
            container.innerHTML = '<div class="error">Failed to load briefings</div>';
        });
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initPriorityBriefings();
});