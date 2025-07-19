function initNotableSignals() {
    const container = document.getElementById('notable-signals-container');
    if (!container) return;
    
    fetch('features/notable-signals/notable-signals.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            if (window.NotableSignals) {
                window.NotableSignals.init(container);
            }
        })
        .catch(error => {
            console.error('Failed to load Notable Signals:', error);
            container.innerHTML = '<div class="error">Failed to load signals</div>';
        });
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initNotableSignals();
});