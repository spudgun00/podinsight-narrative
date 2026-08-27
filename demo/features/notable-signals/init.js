function initNotableSignals() {
    // Vision only, and default-deny. The container now belongs to
    // notable-signals-live.js, and the mock template reuses .signals-grid, so a
    // guard that fails open does not leave a stale placeholder - it paints
    // "67 narrative shifts, up 24 from last week" and four-dot confidence
    // meters over the real cards. Absent resolver means we cannot tell which
    // mode this is, so we do not render. Instance eight.
    if (!window.SyntheaData || !window.SyntheaData.isVision()) return;

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