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
    // Vision only. In Live the panel is rendered by briefings-live.js from
    // pre-generated briefs. Without this guard the mock cards still render
    // into #briefings-grid - "3h ago", "Score: 97", "CONSENSUS FORMING" - the
    // same way the mock drilldown kept appending its markup after its
    // placeholder retired.
    if (window.SyntheaData && window.SyntheaData.isLive()) return;
    initPriorityBriefings();
});