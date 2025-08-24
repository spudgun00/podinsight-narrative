// Unified Data Adapter for Narrative Pulse
// Maps unified data structure to the format expected by narrative-pulse.js

(function() {
    'use strict';
    
    // Wait for unified data to be available
    function initializeAdapter() {
        if (!window.unifiedData || !window.unifiedData.narrativePulse) {
            console.log('Waiting for unified data...');
            setTimeout(initializeAdapter, 100);
            return;
        }
        
        console.log('Unified data found, creating narrative pulse data adapter');
        console.log('Available unified topics:', Object.keys(window.unifiedData.narrativePulse.topics));
        
        const unifiedPulse = window.unifiedData.narrativePulse;
        const topics = unifiedPulse.topics;
        
        // Create the narrative pulse data structure from unified data
        window.narrativePulseData = {
            sevenDayData: {
                timeRange: {
                    start: 'Jul 19, 2025',
                    end: 'Jul 25, 2025',
                    dataPoints: 7,
                    interval: 'daily',
                    labels: unifiedPulse.config.timeRanges['7 days'].dateLabels
                },
                topics: {}
            },
            thirtyDayData: {
                timeRange: {
                    start: 'Jun 26, 2025',
                    end: 'Jul 25, 2025',
                    dataPoints: 4,
                    interval: 'weekly',
                    labels: unifiedPulse.config.timeRanges['30 days'].dateLabels
                },
                topics: {}
            },
            ninetyDayData: {
                timeRange: {
                    start: 'Apr 27, 2025',
                    end: 'Jul 25, 2025',
                    dataPoints: 13,
                    interval: 'weekly',
                    labels: unifiedPulse.config.timeRanges['90 days'].dateLabels
                },
                topics: {}
            }
        };
        
        // Process each topic from unified data
        Object.entries(topics).forEach(([topicName, topicData]) => {
            // 7-day data
            if (topicData.chartData['7d']) {
                const sevenDayData = topicData.chartData['7d'];
                const volumeData = sevenDayData.volume.dataPoints;
                const consensusData = sevenDayData.consensus.levels;
                
                // Convert consensus levels to percentages (0-100)
                const consensusPercentages = consensusData.map(level => Math.round(level * 100));
                
                window.narrativePulseData.sevenDayData.topics[topicName] = {
                    color: topicData.color,
                    displayMomentum: topicData.momentum,
                    actualMomentum: topicData.weeklyChange,
                    dataPoints: volumeData,
                    consensus: consensusPercentages,
                    startValue: volumeData[0],
                    endValue: volumeData[volumeData.length - 1],
                    weekTotal: sevenDayData.volume.total,
                    dailyAverage: sevenDayData.momentum.dailyAverage,
                    peakDay: sevenDayData.momentum.peakDay,
                    consensusLevel: topicData.consensusLevel.split(' ')[0], // Extract first word
                    yPositions: calculateYPositions(topicName, topicData.momentum),
                    quotes: sevenDayData.quotes || {},
                    episodes: topicData.episodes,
                    mentions: topicData.mentions
                };
            }
            
            // 30-day data
            if (topicData.chartData['30d']) {
                const thirtyDayData = topicData.chartData['30d'];
                const volumeData = thirtyDayData.volume.dataPoints;
                const consensusData = thirtyDayData.consensus.levels;
                
                // Convert consensus levels to percentages
                const consensusPercentages = consensusData.map(level => Math.round(level * 100));
                
                // Get quotes from 7-day data if available
                const sevenDayQuotes = topicData.chartData['7d'] ? (topicData.chartData['7d'].quotes || {}) : {};
                
                window.narrativePulseData.thirtyDayData.topics[topicName] = {
                    color: topicData.color,
                    displayMomentum: topicData.momentum,
                    actualMomentum: topicData.weeklyChange,
                    dataPoints: volumeData,
                    consensus: consensusPercentages,
                    startValue: volumeData[0],
                    endValue: volumeData[volumeData.length - 1],
                    weeklyGrowth: thirtyDayData.momentum.weeklyGrowth,
                    consensusProgression: thirtyDayData.consensus.progression,
                    yPositions: calculateYPositions(topicName, topicData.momentum),
                    weeklyNarrative: thirtyDayData.weeklyNarrative || {},
                    // Include quotes from 7-day data for consistent tooltip display
                    quotes: sevenDayQuotes
                };
            }
            
            // 90-day data
            if (topicData.chartData['90d']) {
                const ninetyDayData = topicData.chartData['90d'];
                const volumeData = ninetyDayData.volume.dataPoints;
                
                // Generate consensus data based on progression
                const consensusMap = {
                    'Very Low': 10,
                    'Low': 25,
                    'Mixed': 45,
                    'Building': 65,
                    'Strong': 85,
                    'Peak': 95
                };
                
                const consensusPercentages = ninetyDayData.consensus.progression.map(level => 
                    consensusMap[level] || 50
                );
                
                // Get quotes from 7-day data if available
                const sevenDayQuotes = topicData.chartData['7d'] ? (topicData.chartData['7d'].quotes || {}) : {};
                
                window.narrativePulseData.ninetyDayData.topics[topicName] = {
                    color: topicData.color,
                    displayMomentum: topicData.momentum,
                    actualMomentum: topicData.weeklyChange,
                    dataPoints: volumeData,
                    consensus: consensusPercentages,
                    startValue: volumeData[0],
                    endValue: volumeData[volumeData.length - 1],
                    quarterlyGrowth: ninetyDayData.momentum.quarterlyGrowth,
                    consensusProgression: ninetyDayData.consensus.progression,
                    yPositions: calculateYPositions(topicName, topicData.momentum),
                    narrative: ninetyDayData.narrative,
                    keyInflectionPoint: ninetyDayData.keyInflectionPoint,
                    // Include quotes from 7-day data for consistent tooltip display
                    quotes: sevenDayQuotes
                };
            }
        });
        
        // Calculate Y positions dynamically based on data range
        function calculateYPositions(topicName, momentum) {
            // Y positions will be calculated dynamically by the chart component
            // based on the actual data values and selected topics
            // This is just a placeholder that gets overridden
            return { start: 100, end: 100 };
        }
        
        console.log('Narrative pulse data adapter initialized with topics:', Object.keys(window.narrativePulseData.sevenDayData.topics));
        console.log('Sample topic data:', window.narrativePulseData.sevenDayData.topics['Enterprise Agents']);
        
        // Override NarrativePulse to use dynamic topics
        if (window.NarrativePulse) {
            // Extract topic names from unified data
            const newTopics = Object.keys(window.narrativePulseData.sevenDayData.topics);
            console.log('Setting up NarrativePulse with new topics:', newTopics);
            
            // Directly update the topic arrays
            window.NarrativePulse.availableTopics = [...newTopics];
            window.NarrativePulse.selectedTopics = [...newTopics].slice(0, 7); // Respect maxTopics limit
            
            // Store original getTopicColor if not already stored
            if (!window.NarrativePulse._originalGetTopicColor) {
                window.NarrativePulse._originalGetTopicColor = window.NarrativePulse.getTopicColor;
            }
            
            // Override getTopicColor to use unified data colors
            window.NarrativePulse.getTopicColor = function(topic) {
                // Try to get color from current data first
                const currentData = this.getCurrentData();
                if (currentData && currentData.topics && currentData.topics[topic]) {
                    const topicData = currentData.topics[topic];
                    if (topicData.color) {
                        return topicData.color;
                    }
                }
                
                // Fallback to unified data colors
                if (window.narrativePulseData && 
                    window.narrativePulseData.sevenDayData && 
                    window.narrativePulseData.sevenDayData.topics[topic]) {
                    return window.narrativePulseData.sevenDayData.topics[topic].color;
                }
                
                // Final fallback
                return '#6b7280';
            };
            
            // If already initialized, force update
            if (window.NarrativePulse.container) {
                console.log('Forcing NarrativePulse update with new topics');
                // Update topics immediately
                const topics = Object.keys(window.narrativePulseData.sevenDayData.topics);
                window.NarrativePulse.availableTopics = [...topics];
                window.NarrativePulse.selectedTopics = [...topics].slice(0, 7); // Respect maxTopics limit
                
                // Override updateInsightCards to use dynamic data
                const originalUpdateInsightCards = window.NarrativePulse.updateInsightCards;
                window.NarrativePulse.updateInsightCards = function() {
                    const insightCards = this.container.querySelectorAll('.insight-card .insight-text');
                    if (insightCards.length < 3) return;
                    
                    // Use the insight text from the screenshot requirements
                    const insights = [
                        {
                            highlight: 'Weekly Momentum',
                            text: 'DePIN accelerating +28.8% this week, leading narrative shift'
                        },
                        {
                            highlight: 'Velocity Spike',
                            text: 'Vertical SaaS mentions up 55.6% as specialization gains traction'
                        },
                        {
                            highlight: 'Daily Pattern',
                            text: 'Developer tools discussion peaks mid-week, 46.9% weekly growth'
                        }
                    ];
                    
                    // For 30 days and 90 days, use data from unified structure
                    if (this.currentTimeRange === '30 days') {
                        const topMomentum = window.unifiedData.weeklyBrief.topicMomentum[0];
                        insights[0] = {
                            highlight: 'Monthly Leader',
                            text: `${topMomentum.topic} ${topMomentum.change} momentum - ${topMomentum.context}`
                        };
                        insights[1] = {
                            highlight: 'Consensus Forming',
                            text: window.unifiedData.weeklyBrief.consensusForming[0].title
                        };
                        insights[2] = {
                            highlight: 'Market Signal',
                            text: window.unifiedData.intelligenceBrief.summary.expanded.consensus[1].title
                        };
                    } else if (this.currentTimeRange === '90 days') {
                        insights[0] = {
                            highlight: 'Quarterly Trend',
                            text: 'AI infrastructure commanding 70% of funding, up from 25% in Q1'
                        };
                        insights[1] = {
                            highlight: 'Sustained Growth',
                            text: 'Enterprise agents show +964% growth from pilots to production'
                        };
                        insights[2] = {
                            highlight: 'Market Rotation',
                            text: 'Traditional SaaS declining -57% as AI-native solutions dominate'
                        };
                    }
                    
                    // Update the insight cards
                    insights.forEach((insight, index) => {
                        if (insightCards[index]) {
                            insightCards[index].innerHTML = `
                                <span class="insight-highlight">${insight.highlight}:</span> ${insight.text}
                            `;
                        }
                    });
                };
                
                // Override updateLegend to show top topics from unified data
                const originalUpdateLegend = window.NarrativePulse.updateLegend;
                window.NarrativePulse.updateLegend = function() {
                    const legend = this.container.querySelector('.pulse-legend');
                    if (!legend) return;
                    
                    const currentData = this.getCurrentData();
                    legend.innerHTML = '';
                    
                    // Get top 5 topics by momentum
                    const topTopics = Object.entries(currentData.topics)
                        .sort((a, b) => {
                            const aVal = parseInt(a[1].displayMomentum) || 0;
                            const bVal = parseInt(b[1].displayMomentum) || 0;
                            return bVal - aVal;
                        })
                        .slice(0, 5);
                    
                    topTopics.forEach(([topic, data]) => {
                        const item = document.createElement('div');
                        item.className = 'legend-item';
                        item.setAttribute('data-topic', topic);
                        item.innerHTML = `
                            <span class="legend-dot" style="background: ${data.color};"></span>
                            <span class="legend-label">${topic}</span>
                            <span class="legend-value" style="color: ${data.color};">${data.displayMomentum}</span>
                        `;
                        legend.appendChild(item);
                    });
                    
                    // Update selected topics to match
                    this.selectedTopics = topTopics.map(([topic]) => topic);
                };
                
                // Update the legend
                if (window.NarrativePulse.updateLegend) {
                    window.NarrativePulse.updateLegend();
                }
                
                // Update insight cards immediately and with a delay
                if (window.NarrativePulse.updateInsightCards) {
                    window.NarrativePulse.updateInsightCards();
                    // Also update after a short delay to catch any async rendering
                    setTimeout(() => {
                        window.NarrativePulse.updateInsightCards();
                    }, 250);
                }
                
                // Redraw current view
                const viewText = window.NarrativePulse.container.querySelector('#viewText');
                if (viewText) {
                    if (viewText.textContent === 'Momentum' && window.NarrativePulse.createMomentumView) {
                        window.NarrativePulse.createMomentumView();
                    } else if (viewText.textContent === 'Volume' && window.NarrativePulse.createVolumeView) {
                        window.NarrativePulse.createVolumeView();
                    } else if (viewText.textContent === 'Consensus' && window.NarrativePulse.createConsensusView) {
                        window.NarrativePulse.createConsensusView();
                    }
                }
            }
        }
    }
    
    // Start initialization
    initializeAdapter();
})();