// Data Transformer for Narrative Pulse
// Maps unified data to the format expected by the existing Narrative Pulse component

window.NarrativePulseDataTransformer = {
    // Transform unified data to narrative pulse format
    transform: function() {
        if (!window.unifiedData || !window.unifiedData.narrativePulse) {
            console.error('Unified data not available for Narrative Pulse');
            return;
        }
        
        const unifiedTopics = window.unifiedData.narrativePulse.topics;
        const topicNames = Object.keys(unifiedTopics);
        
        // Update the NarrativePulse component's topic lists
        if (window.NarrativePulse) {
            window.NarrativePulse.availableTopics = topicNames;
            window.NarrativePulse.selectedTopics = topicNames.slice(0, 7); // Max 7 topics
            
            // Update date labels for July 2025
            window.NarrativePulse.dateLabels = ['Jul 19', 'Jul 20', 'Jul 21', 'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25'];
            window.NarrativePulse.timeRangeConfigs['7 days'].dateLabels = ['Jul 19', 'Jul 20', 'Jul 21', 'Jul 22', 'Jul 23', 'Jul 24', 'Jul 25'];
            window.NarrativePulse.timeRangeConfigs['30 days'].dateLabels = ['Jun 26-Jul 2', 'Jul 3-9', 'Jul 10-16', 'Jul 17-23'];
            window.NarrativePulse.timeRangeConfigs['90 days'].dateLabels = ['Apr 27', 'May 4', 'May 11', 'May 18', 'May 25', 'Jun 1', 'Jun 8', 'Jun 15', 'Jun 22', 'Jun 29', 'Jul 6', 'Jul 13', 'Jul 20'];
            
            // Transform topic data
            const transformedData = {};
            
            topicNames.forEach(topicName => {
                const topic = unifiedTopics[topicName];
                
                // Create mock data structure that matches the component's expectations
                transformedData[topicName] = {
                    color: topic.color,
                    momentum: topic.momentum,
                    weeklyChange: topic.weeklyChange,
                    mentions: topic.mentions,
                    episodes: topic.episodes,
                    
                    // Transform chart data for different views
                    data: topic.chartData && topic.chartData['7d'] ? topic.chartData['7d'].momentum.dataPoints : 
                          [Math.floor(Math.random() * 30) + 20, Math.floor(Math.random() * 30) + 25, 
                           Math.floor(Math.random() * 30) + 30, Math.floor(Math.random() * 30) + 35,
                           Math.floor(Math.random() * 30) + 40, Math.floor(Math.random() * 30) + 45,
                           Math.floor(Math.random() * 30) + 50],
                    
                    // Volume data
                    volumeData: topic.chartData && topic.chartData['7d'] ? topic.chartData['7d'].volume.dataPoints :
                               [30, 35, 40, 45, 50, 55, 60],
                    
                    // 30-day data
                    thirtyDayData: topic.chartData && topic.chartData['30d'] ? 
                                  [topic.chartData['30d'].momentum.weeklyAverages[0] || 40,
                                   topic.chartData['30d'].momentum.weeklyAverages[1] || 45,
                                   topic.chartData['30d'].momentum.weeklyAverages[2] || 50,
                                   topic.chartData['30d'].momentum.weeklyAverages[3] || 55] :
                                  [40, 45, 50, 55],
                    
                    thirtyDayVolumeData: [35, 40, 45, 50],
                    
                    // 90-day data (generate reasonable mock data)
                    ninetyDayData: Array(13).fill(0).map((_, i) => 30 + i * 3),
                    ninetyDayVolumeData: Array(13).fill(0).map((_, i) => 25 + i * 2.5)
                };
            });
            
            // Override the component's data getter methods
            window.NarrativePulse.getTopicData = function(topicName) {
                return transformedData[topicName] || null;
            };
            
            // Transform consensus data
            const consensusData = {};
            topicNames.forEach(topicName => {
                consensusData[topicName] = {};
                const dates = window.NarrativePulse.dateLabels;
                
                dates.forEach((date, index) => {
                    const consensusLevel = unifiedTopics[topicName].chartData?.['7d']?.consensus?.levels?.[index] || 0.5;
                    const level = consensusLevel > 0.8 ? 'Strong' : consensusLevel > 0.6 ? 'Building' : consensusLevel > 0.4 ? 'Moderate' : 'Weak';
                    
                    consensusData[topicName][date] = {
                        positive: Math.floor(consensusLevel * 100),
                        neutral: Math.floor((1 - consensusLevel) * 30),
                        negative: Math.floor((1 - consensusLevel) * 70),
                        total: 100,
                        percent: Math.floor(consensusLevel * 100),
                        level: level,
                        advocates: ['Partner A', 'Partner B'],
                        skeptics: ['Partner C']
                    };
                });
            });
            
            window.NarrativePulse.consensusData = consensusData;
            
            console.log('Narrative Pulse data transformed successfully');
        }
    },
    
    // Initialize transformer when DOM is ready
    init: function() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.transform());
        } else {
            this.transform();
        }
        
        // Also listen for data adapter ready event
        window.addEventListener('dataAdapterReady', () => this.transform());
    }
};

// Auto-initialize
window.NarrativePulseDataTransformer.init();