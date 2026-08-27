function initNarrativeFeed() {
    // Vision only. In Live the resolver renders the not-built state into
    // this container; fetching and injecting the mock Narrative Feed template first
    // just does work that is immediately overwritten.
    if (window.SyntheaData && window.SyntheaData.isLive()) return;

    const container = document.getElementById('narrative-feed-container');
    if (!container) return;
    
    fetch('features/narrative-feed/narrative-feed.html')
        .then(response => response.text())
        .then(html => {
            container.innerHTML = html;
            if (window.NarrativeFeed) {
                window.NarrativeFeed.init(container);
            }
        })
        .catch(error => {
            console.error('Failed to load Narrative Feed:', error);
            container.innerHTML = '<div class="error">Failed to load feed</div>';
        });
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initNarrativeFeed();
});