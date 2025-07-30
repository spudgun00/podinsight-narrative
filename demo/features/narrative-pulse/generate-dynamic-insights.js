// Generate Dynamic Insights from Unified Data
// This properly generates insights based on actual topic data

(function() {
    'use strict';
    
    // Function to generate insights based on actual data
    function generateInsightsFromData() {
        if (!window.unifiedData || !window.unifiedData.narrativePulse) {
            console.log('Waiting for unified data...');
            return null;
        }
        
        const topics = window.unifiedData.narrativePulse.topics;
        
        // Get topics sorted by momentum
        const topicList = Object.entries(topics).map(([name, data]) => ({
            name,
            momentum: parseInt(data.momentum.replace('%', '')),
            weeklyChange: data.weeklyChange,
            mentions: data.mentions,
            consensusLevel: data.consensusLevel,
            color: data.color,
            chartData: data.chartData
        })).sort((a, b) => b.momentum - a.momentum);
        
        // Generate insights for each time range
        const insights = {
            '7 days': [],
            '30 days': [],
            '90 days': []
        };
        
        // 7-day insights - focus on weekly momentum and patterns
        if (topicList.length >= 3) {
            // Top momentum topic
            const topMomentum = topicList[0];
            insights['7 days'].push({
                highlight: 'Weekly Momentum',
                text: `${topMomentum.name} accelerating ${topMomentum.weeklyChange} this week, leading narrative shift`
            });
            
            // Look for velocity spike (highest single-day change)
            let maxDailySpike = { topic: '', spike: 0, day: '' };
            topicList.forEach(topic => {
                if (topic.chartData && topic.chartData['7d']) {
                    const dataPoints = topic.chartData['7d'].volume.dataPoints;
                    for (let i = 1; i < dataPoints.length; i++) {
                        const spike = ((dataPoints[i] - dataPoints[i-1]) / dataPoints[i-1]) * 100;
                        if (spike > maxDailySpike.spike) {
                            maxDailySpike = {
                                topic: topic.name,
                                spike: Math.round(spike),
                                day: i
                            };
                        }
                    }
                }
            });
            
            if (maxDailySpike.topic) {
                insights['7 days'].push({
                    highlight: 'Velocity Spike',
                    text: `${maxDailySpike.topic} mentions up ${maxDailySpike.spike}% as ${topicList.find(t => t.name === maxDailySpike.topic).consensusLevel.toLowerCase()}`
                });
            } else {
                // Fallback to second highest momentum
                insights['7 days'].push({
                    highlight: 'Velocity Spike',
                    text: `${topicList[1].name} mentions up ${topicList[1].weeklyChange} as momentum builds`
                });
            }
            
            // Daily pattern or emerging topic
            const emergingTopic = topicList.find(t => t.mentions < 100 && t.momentum > 20) || topicList[2];
            insights['7 days'].push({
                highlight: 'Daily Pattern',
                text: `${emergingTopic.name} gaining traction with ${emergingTopic.weeklyChange} weekly growth`
            });
        }
        
        // 30-day insights - focus on monthly trends
        if (topicList.length >= 3 && window.unifiedData.weeklyBrief) {
            const weeklyBrief = window.unifiedData.weeklyBrief;
            
            // Monthly leader from weekly brief data
            if (weeklyBrief.topicMomentum && weeklyBrief.topicMomentum[0]) {
                insights['30 days'].push({
                    highlight: 'Monthly Leader',
                    text: `${weeklyBrief.topicMomentum[0].topic} ${weeklyBrief.topicMomentum[0].change} momentum - ${weeklyBrief.topicMomentum[0].context}`
                });
            } else {
                insights['30 days'].push({
                    highlight: 'Monthly Leader',
                    text: `${topicList[0].name} maintaining ${topicList[0].weeklyChange} momentum across ${topicList[0].mentions} mentions`
                });
            }
            
            // Consensus forming
            if (weeklyBrief.consensusForming && weeklyBrief.consensusForming[0]) {
                insights['30 days'].push({
                    highlight: 'Consensus Forming',
                    text: weeklyBrief.consensusForming[0].title
                });
            } else {
                const strongConsensus = topicList.find(t => t.consensusLevel.includes('Strong')) || topicList[0];
                insights['30 days'].push({
                    highlight: 'Consensus Forming',
                    text: `${strongConsensus.name} reaching ${strongConsensus.consensusLevel} across ${strongConsensus.mentions} mentions`
                });
            }
            
            // Market signal
            insights['30 days'].push({
                highlight: 'Market Signal',
                text: `${topicList[1].name} shows ${topicList[1].weeklyChange} growth as market dynamics shift`
            });
        }
        
        // 90-day insights - focus on quarterly trends
        if (topicList.length >= 3) {
            // Find topic with highest quarterly growth
            let maxQuarterlyGrowth = { topic: '', growth: 0 };
            topicList.forEach(topic => {
                if (topic.chartData && topic.chartData['90d'] && topic.chartData['90d'].momentum.quarterlyGrowth) {
                    const growth = parseInt(topic.chartData['90d'].momentum.quarterlyGrowth.replace('%', '').replace('+', ''));
                    if (growth > maxQuarterlyGrowth.growth) {
                        maxQuarterlyGrowth = { topic: topic.name, growth };
                    }
                }
            });
            
            if (maxQuarterlyGrowth.topic) {
                insights['90 days'].push({
                    highlight: 'Quarterly Trend',
                    text: `${maxQuarterlyGrowth.topic} shows +${maxQuarterlyGrowth.growth}% quarterly growth, reshaping investment thesis`
                });
            } else {
                insights['90 days'].push({
                    highlight: 'Quarterly Trend',
                    text: `${topicList[0].name} commanding majority of discussions across ${topicList[0].episodes} episodes`
                });
            }
            
            // Sustained growth
            const sustainedGrowth = topicList.find(t => t.momentum > 40) || topicList[0];
            insights['90 days'].push({
                highlight: 'Sustained Growth',
                text: `${sustainedGrowth.name} shows ${sustainedGrowth.weeklyChange} growth with ${sustainedGrowth.mentions} total mentions`
            });
            
            // Market rotation - look for declining topics
            const decliningTopic = topicList.find(t => t.momentum < 0);
            if (decliningTopic) {
                insights['90 days'].push({
                    highlight: 'Market Rotation',
                    text: `${decliningTopic.name} declining ${decliningTopic.weeklyChange} as market priorities shift`
                });
            } else {
                insights['90 days'].push({
                    highlight: 'Market Rotation',
                    text: `Traditional categories losing ground as ${topicList[0].name} dominates narrative`
                });
            }
        }
        
        return insights;
    }
    
    // Update function that uses generated insights
    function updateInsightCards() {
        const insights = generateInsightsFromData();
        if (!insights) return;
        
        const insightCards = document.querySelectorAll('.insight-card .insight-text');
        if (insightCards.length < 3) return;
        
        // Get current time range from NarrativePulse
        let currentTimeRange = '7 days';
        if (window.NarrativePulse && window.NarrativePulse.currentTimeRange) {
            currentTimeRange = window.NarrativePulse.currentTimeRange;
        }
        
        const currentInsights = insights[currentTimeRange] || insights['7 days'];
        
        // Update each card
        currentInsights.forEach((insight, index) => {
            if (insightCards[index]) {
                insightCards[index].innerHTML = `
                    <span class="insight-highlight">${insight.highlight}:</span> ${insight.text}
                `;
            }
        });
        
        console.log('Updated insights with dynamic data:', currentInsights);
    }
    
    // Initialize when ready
    const initialize = () => {
        if (!window.unifiedData || !window.NarrativePulse) {
            setTimeout(initialize, 100);
            return;
        }
        
        // Override the updateInsightCards method
        window.NarrativePulse.updateInsightCards = updateInsightCards;
        
        // Update immediately if component is already initialized
        if (window.NarrativePulse.container) {
            updateInsightCards();
        }
        
        // Listen for time range changes
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('time-button')) {
                setTimeout(updateInsightCards, 100);
            }
        });
        
        // Use MutationObserver as backup
        const observer = new MutationObserver((mutations) => {
            const insightCards = document.querySelectorAll('.insight-card .insight-text');
            if (insightCards.length > 0) {
                const firstCard = insightCards[0].textContent;
                if (firstCard.includes('Strong Consensus:') || firstCard.includes('AI infrastructure investment')) {
                    updateInsightCards();
                }
            }
        });
        
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
        
        // Clean up after 30 seconds
        setTimeout(() => observer.disconnect(), 30000);
    };
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();