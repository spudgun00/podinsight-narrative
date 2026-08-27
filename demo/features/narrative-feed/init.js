function initNarrativeFeed() {
    // Vision only, and default-deny: the container now belongs to
    // narrative-feed-live.js, and the mock template it would inject reuses the
    // same .feed-container class, so a guard that fails open does not leave a
    // stale placeholder - it wipes the live list. Absent resolver means we
    // cannot tell which mode this is, so we do not render.
    if (!window.SyntheaData || !window.SyntheaData.isVision()) return;

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