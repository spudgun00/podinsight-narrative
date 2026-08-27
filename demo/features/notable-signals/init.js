function initNotableSignals() {
    // Vision only. In Live the resolver renders the not-built state into
    // this container; fetching and injecting the mock Notable Signals template first
    // just does work that is immediately overwritten.
    if (window.SyntheaData && window.SyntheaData.isLive()) return;

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