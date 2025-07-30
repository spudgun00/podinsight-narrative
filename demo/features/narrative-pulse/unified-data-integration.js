// Unified Data Integration for Narrative Pulse
// This file integrates the unified-data.js structure with the Narrative Pulse component

(function() {
    'use strict';
    
    // Wait for DOM and unified data to be ready
    const initialize = () => {
        if (!window.unifiedData || !window.NarrativePulse) {
            setTimeout(initialize, 100);
            return;
        }
        
        // Transform unified data to narrative pulse format
        const transformUnifiedData = () => {
            const unifiedTopics = window.unifiedData.narrativePulse.topics;
            const timeRangeData = {};
            
            // Process each time range
            ['7 days', '30 days', '90 days'].forEach(timeRange => {
                const rangeKey = timeRange.replace(' ', '');
                const config = window.unifiedData.narrativePulse.config.timeRanges[timeRange];
                
                // Build topics object for this time range
                const topics = {};
                
                Object.keys(unifiedTopics).forEach(topicName => {
                    const topicData = unifiedTopics[topicName];
                    const chartData = topicData.chartData;
                    
                    // Get data for specific time range
                    let rangeData;
                    if (timeRange === '7 days') rangeData = chartData['7d'];
                    else if (timeRange === '30 days') rangeData = chartData['30d'];
                    else if (timeRange === '90 days') rangeData = chartData['90d'];
                    
                    if (rangeData) {
                        topics[topicName] = {
                            color: topicData.color,
                            displayMomentum: topicData.momentum,
                            dataPoints: rangeData.momentum.dataPoints,
                            volume: rangeData.volume.dataPoints,
                            consensus: rangeData.consensus.levels || rangeData.consensus.progression,
                            description: topicData.description,
                            mentions: topicData.mentions,
                            episodes: topicData.episodes,
                            consensusLevel: topicData.consensusLevel,
                            quotes: rangeData.quotes || {},
                            narrative: rangeData.narrative || rangeData.weeklyNarrative || {}
                        };
                    }
                });
                
                timeRangeData[timeRange] = {
                    topics: topics,
                    insights: getInsightsForTimeRange(timeRange),
                    dateLabels: config.dateLabels
                };
            });
            
            return timeRangeData;
        };
        
        // Get dynamic insights based on unified data
        const getInsightsForTimeRange = (timeRange) => {
            const weeklyBrief = window.unifiedData.weeklyBrief;
            const intelligenceBrief = window.unifiedData.intelligenceBrief;
            
            // Map time ranges to appropriate insights
            if (timeRange === '7 days') {
                return [
                    {
                        type: 'consensus',
                        highlight: 'Weekly Momentum',
                        text: 'DePIN accelerating +28.8% this week, leading narrative shift'
                    },
                    {
                        type: 'velocity',
                        highlight: 'Velocity Spike',
                        text: 'Vertical SaaS mentions up 55.6% as specialization gains traction'
                    },
                    {
                        type: 'emerging',
                        highlight: 'Daily Pattern',
                        text: 'Developer tools discussion peaks mid-week, 46.9% weekly growth'
                    }
                ];
            } else if (timeRange === '30 days') {
                return [
                    {
                        type: 'consensus',
                        highlight: 'Monthly Trend',
                        text: intelligenceBrief.summary.expanded.consensus[0].title
                    },
                    {
                        type: 'velocity',
                        highlight: 'Momentum Leader',
                        text: `${weeklyBrief.topicMomentum[0].topic} ${weeklyBrief.topicMomentum[0].change} - ${weeklyBrief.topicMomentum[0].context}`
                    },
                    {
                        type: 'emerging',
                        highlight: 'Market Shift',
                        text: weeklyBrief.consensusForming[0].title
                    }
                ];
            } else {
                return [
                    {
                        type: 'consensus',
                        highlight: 'Quarterly View',
                        text: 'AI infrastructure dominates with 70% of funding across 46 episodes'
                    },
                    {
                        type: 'velocity',
                        highlight: 'Sustained Growth',
                        text: 'Enterprise agents +964% quarterly growth from pilots to production'
                    },
                    {
                        type: 'emerging',
                        highlight: 'Long-term Shift',
                        text: 'Traditional SaaS declining -57% as AI-native solutions dominate'
                    }
                ];
            }
        };
        
        // Override NarrativePulse init to use unified data
        const originalInit = window.NarrativePulse.init;
        window.NarrativePulse.init = function(container) {
            // Set up the transformed data
            this.timeRangeData = transformUnifiedData();
            
            // Update insight cards method to use dynamic data
            const originalUpdateInsightCards = this.updateInsightCards;
            this.updateInsightCards = function() {
                const insights = this.container.querySelectorAll('.insight-card');
                const currentData = this.timeRangeData[this.currentTimeRange];
                
                if (insights.length >= 3 && currentData && currentData.insights) {
                    currentData.insights.forEach((insight, index) => {
                        if (insights[index]) {
                            const textElement = insights[index].querySelector('.insight-text');
                            if (textElement) {
                                textElement.innerHTML = `
                                    <span class="insight-highlight">${insight.highlight}:</span> ${insight.text}
                                `;
                            }
                        }
                    });
                }
            };
            
            // Update legend to use actual topics from unified data
            const originalUpdateLegend = this.updateLegend;
            this.updateLegend = function() {
                const legend = this.container.querySelector('.pulse-legend');
                if (!legend) return;
                
                const currentData = this.getCurrentData();
                legend.innerHTML = '';
                
                // Get top topics by momentum for current time range
                const topics = Object.entries(currentData.topics)
                    .sort((a, b) => {
                        const momentumA = parseInt(a[1].displayMomentum) || 0;
                        const momentumB = parseInt(b[1].displayMomentum) || 0;
                        return momentumB - momentumA;
                    })
                    .slice(0, 5); // Show top 5
                
                topics.forEach(([topic, data]) => {
                    const item = document.createElement('div');
                    item.className = 'legend-item';
                    item.innerHTML = `
                        <span class="legend-dot" style="background: ${data.color};"></span>
                        <span class="legend-label">${topic}</span>
                        <span class="legend-value" style="color: ${data.color};">${data.displayMomentum}</span>
                    `;
                    legend.appendChild(item);
                });
                
                // Update selected topics to match
                this.selectedTopics = topics.map(([topic]) => topic);
            };
            
            // Call original init
            originalInit.call(this, container);
            
            // Update insights immediately after init
            this.updateInsightCards();
            this.updateLegend();
        };
    };
    
    // Start initialization
    initialize();
})();