// Data Adapter for Backward Compatibility
// Maps unified data structure to legacy window objects
// This ensures existing components continue to work without modification

// Wait for unified data to load
if (window.unifiedData) {
    initializeAdapter();
} else {
    window.addEventListener('load', initializeAdapter);
}

function initializeAdapter() {
    if (!window.unifiedData) {
        console.error('Unified data not loaded. Cannot initialize adapter.');
        return;
    }

    console.log('Initializing data adapter for backward compatibility...');

    // ============================================
    // LEGACY WINDOW.TOPICS
    // ============================================
    // Map the unified topic structure to the legacy format
    window.topics = {};
    const topics = window.unifiedData.narrativePulse.topics;
    
    // Map new topics to legacy format for backward compatibility
    // Note: These are the new July 2025 topics
    const legacyTopics = ['Enterprise Agents', 'Defense Tech', 'AI Infrastructure', 'Exit Strategies', 'Vertical AI', 'Traditional SaaS', 'Climate Tech'];
    
    legacyTopics.forEach(topicName => {
        if (topics[topicName]) {
            window.topics[topicName] = {
                color: topics[topicName].color,
                momentum: topics[topicName].momentum,
                mentions: topics[topicName].mentions,
                episodes: topics[topicName].episodes
            };
        }
    });

    // ============================================
    // LEGACY WINDOW.FEEDDATA
    // ============================================
    window.feedData = window.unifiedData.narrativeFeed.items;

    // ============================================
    // LEGACY WINDOW.SIGNALCOUNTS
    // ============================================
    window.signalCounts = window.unifiedData.notableSignals.counts;

    // ============================================
    // LEGACY WINDOW.PRIORITYBRIEFINGS
    // ============================================
    // Legacy format only had first 3 briefings
    window.priorityBriefings = window.unifiedData.priorityBriefings.items.slice(0, 3);

    // ============================================
    // LEGACY WINDOW.SIDEBARMETRICS
    // ============================================
    window.sidebarMetrics = {
        brief: {
            hoursAnalyzed: window.unifiedData.intelligenceBrief.summary.hoursAnalyzed,
            lastUpdated: window.unifiedData.intelligenceBrief.summary.lastUpdated,
            collapsed: window.unifiedData.intelligenceBrief.summary.collapsed,
            expanded: window.unifiedData.intelligenceBrief.summary.expanded
        },
        velocityTracking: window.unifiedData.intelligenceBrief.metrics.velocityTracking.slice(0, 5), // Legacy had only 5
        influenceMetrics: window.unifiedData.intelligenceBrief.metrics.influenceMetrics.slice(0, 5), // Legacy had only 5
        consensusMonitor: window.unifiedData.intelligenceBrief.metrics.consensusMonitor.slice(0, 4), // Legacy had only 4
        topicCorrelations: window.unifiedData.intelligenceBrief.metrics.topicCorrelations.slice(0, 4) // Legacy had only 4
    };

    // ============================================
    // LEGACY WINDOW.SIGNALPANELDATA
    // ============================================
    window.signalPanelData = window.unifiedData.notableSignals.panelData;

    // ============================================
    // LEGACY WINDOW.CHARTVIEWDATA
    // ============================================
    // Extract consensus data for the legacy heatmap view
    window.chartViewData = {
        consensusLevels: [],
        consensusLabels: []
    };

    // Build consensus levels array for legacy chart
    const topicNames = Object.keys(window.topics);
    topicNames.forEach(topicName => {
        const topic = topics[topicName];
        if (topic && topic.chartData && topic.chartData['30d'] && topic.chartData['30d'].consensus) {
            window.chartViewData.consensusLevels.push(topic.chartData['30d'].consensus.levels || [0.5, 0.5, 0.5, 0.5]);
        }
    });

    // Build consensus labels (simplified for legacy format)
    window.chartViewData.consensusLabels = [
        ['Building', 'Moderate', 'Strong', 'Strong'],
        ['Moderate', 'Moderate', 'Strong', 'Strong'],
        ['Weak', 'Moderate', 'Strong', 'Peak'],
        ['Weak', 'Weak', 'Weak', 'Weak']
    ];

    // ============================================
    // LEGACY WINDOW.TICKERDATA
    // ============================================
    window.tickerData = {
        items: window.unifiedData.ui.header.ticker.slice(0, 3) // Legacy had only 3 items
    };

    // ============================================
    // ADDITIONAL MAPPINGS
    // ============================================
    
    // Map demo data structure (if components use window.demoData)
    window.demoData = {
        topics: window.topics,
        feedData: window.feedData,
        signalCounts: window.signalCounts,
        priorityBriefings: window.priorityBriefings,
        sidebarMetrics: window.sidebarMetrics,
        signalPanelData: window.signalPanelData,
        chartViewData: window.chartViewData,
        tickerData: window.tickerData
    };

    // Map portfolio data
    window.portfolioData = window.unifiedData.portfolio;

    // Map search suggestions (if used)
    window.searchSuggestions = window.unifiedData.ui.header.search.suggestions;
    window.trendingTopics = window.unifiedData.ui.header.search.trendingTopics;
    window.searchFilters = window.unifiedData.ui.header.search.quickFilters;

    // Map podcast filters
    window.podcastOptions = window.unifiedData.ui.podcastFilters;

    // ============================================
    // HELPER FUNCTIONS FOR DYNAMIC ACCESS
    // ============================================
    
    // Function to get all topics (not just legacy 4)
    window.getAllTopics = function() {
        return window.unifiedData.narrativePulse.topics;
    };

    // Function to get all briefings (not just legacy 3)
    window.getAllBriefings = function() {
        return window.unifiedData.priorityBriefings.items;
    };

    // Function to get weekly brief data
    window.getWeeklyBriefData = function() {
        return window.unifiedData.weeklyBrief;
    };

    // Function to get metadata
    window.getMetadata = function() {
        return window.unifiedData.meta;
    };

    console.log('Data adapter initialized successfully');
    console.log('Legacy window objects created:', {
        topics: Object.keys(window.topics).length + ' topics',
        feedData: window.feedData.length + ' items',
        priorityBriefings: window.priorityBriefings.length + ' briefings',
        signalCounts: Object.keys(window.signalCounts).length + ' signals'
    });

    // Dispatch event to notify components that data is ready
    window.dispatchEvent(new CustomEvent('dataAdapterReady', {
        detail: {
            unifiedData: window.unifiedData,
            legacyData: {
                topics: window.topics,
                feedData: window.feedData,
                signalCounts: window.signalCounts,
                priorityBriefings: window.priorityBriefings,
                sidebarMetrics: window.sidebarMetrics
            }
        }
    }));
}

// Utility function to safely access nested properties
function safeGet(obj, path, defaultValue = null) {
    return path.split('.').reduce((current, key) => 
        current && current[key] !== undefined ? current[key] : defaultValue, obj);
}