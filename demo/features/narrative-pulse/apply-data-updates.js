// Script to apply the new data source updates to NarrativePulse
// Run this after loading narrative-pulse-data.js and before initializing NarrativePulse

(function() {
    // Wait for both NarrativePulse and narrativePulseData to be available
    function applyUpdates() {
        if (typeof NarrativePulse === 'undefined' || typeof window.narrativePulseData === 'undefined') {
            setTimeout(applyUpdates, 100);
            return;
        }

        // Helper function to calculate momentum percentage
        function calculateMomentum(dataPoints) {
            if (!dataPoints || dataPoints.length < 2) return '0%';
            
            const firstValue = dataPoints[0];
            const lastValue = dataPoints[dataPoints.length - 1];
            
            if (firstValue === 0) {
                // If starting from 0, show absolute increase
                return lastValue > 0 ? `+${lastValue}` : '0%';
            }
            
            const percentChange = ((lastValue - firstValue) / firstValue) * 100;
            const formatted = percentChange >= 0 ? `+${percentChange.toFixed(0)}%` : `${percentChange.toFixed(0)}%`;
            
            return formatted;
        }

        // Override the init method to use new data
        const originalInit = NarrativePulse.init;
        NarrativePulse.init = function(containerId) {
            // Initialize with new data source
            if (window.narrativePulseData) {
                // Set available and selected topics from unified data
                const topics = Object.keys(window.narrativePulseData.sevenDayData.topics);
                this.availableTopics = [...topics];
                this.selectedTopics = [...topics].slice(0, 7); // Max 7 topics
                
                console.log('Setting topics from unified data:', this.selectedTopics);
                
                // Map the new data structure to timeRangeData
                this.timeRangeData = {
                    '7 days': window.narrativePulseData.sevenDayData,
                    '30 days': window.narrativePulseData.thirtyDayData,
                    '90 days': window.narrativePulseData.ninetyDayData
                };
                
                // Update time range configs to match new data
                this.timeRangeConfigs = {
                    '7 days': {
                        dateLabels: window.narrativePulseData.sevenDayData.timeRange.labels,
                        dataPoints: window.narrativePulseData.sevenDayData.timeRange.dataPoints,
                        interval: window.narrativePulseData.sevenDayData.timeRange.interval
                    },
                    '30 days': {
                        dateLabels: window.narrativePulseData.thirtyDayData.timeRange.labels,
                        dataPoints: window.narrativePulseData.thirtyDayData.timeRange.dataPoints,
                        interval: window.narrativePulseData.thirtyDayData.timeRange.interval
                    },
                    '90 days': {
                        dateLabels: window.narrativePulseData.ninetyDayData.timeRange.labels,
                        dataPoints: window.narrativePulseData.ninetyDayData.timeRange.dataPoints,
                        interval: window.narrativePulseData.ninetyDayData.timeRange.interval
                    }
                };
                
                // Calculate dynamic momentum for all topics in all time ranges
                Object.keys(this.timeRangeData).forEach(timeRange => {
                    const data = this.timeRangeData[timeRange];
                    if (data && data.topics) {
                        Object.keys(data.topics).forEach(topic => {
                            const topicData = data.topics[topic];
                            if (topicData && topicData.dataPoints) {
                                // Calculate momentum based on first and last values in the visible period
                                const calculatedMomentum = calculateMomentum(topicData.dataPoints);
                                topicData.displayMomentum = calculatedMomentum;
                                topicData.actualMomentum = calculatedMomentum;
                                
                                // Log for verification
                                console.log(`${timeRange} - ${topic}: ${topicData.dataPoints[0]} → ${topicData.dataPoints[topicData.dataPoints.length - 1]} = ${calculatedMomentum}`);
                            }
                        });
                    }
                });
            }
            
            // Call original init
            return originalInit.call(this, containerId);
        };

        // Override showRichTooltip to use dynamic calculations
        NarrativePulse.showRichTooltip = function(dateIndex, mouseEvent) {
            const tooltip = this.container.querySelector('#chartTooltip');
            const currentData = this.getCurrentData();
            const dateLabel = this.dateLabels[dateIndex];
            
            // Clear hide timer
            if (this.hideTooltipTimer) {
                clearTimeout(this.hideTooltipTimer);
                this.hideTooltipTimer = null;
            }
            
            // Reset tooltip and add view-specific class
            tooltip.className = 'chart-tooltip chart-tooltip-momentum';
            tooltip.style.display = 'block';
            tooltip.style.opacity = '1';
            
            // Format date based on time range
            let formattedDate = '';
            if (this.currentTimeRange === '7 days') {
                // For 7-day view, dates are like "Fri 23"
                formattedDate = dateLabel;
                // Add the full date if it's a day label
                if (dateLabel.includes(' ')) {
                    const parts = dateLabel.split(' ');
                    formattedDate = `${parts[0]}, Aug ${parts[1]}, 2025`;
                }
            } else if (this.currentTimeRange === '30 days') {
                // For 30-day view, dates are like "Aug 1-7"
                formattedDate = dateLabel;
            } else {
                // For 90-day view, dates are like "Jun 3"
                formattedDate = dateLabel;
                if (dateLabel.includes(' ')) {
                    const [month, day] = dateLabel.split(' ');
                    formattedDate = `${month} ${day}, 2025`;
                }
            }
            
            // Build topic data with calculations
            const topicStats = [];
            
            this.selectedTopics.forEach(topic => {
                const topicData = currentData.topics[topic];
                if (topicData && topicData.dataPoints && topicData.dataPoints[dateIndex] !== undefined) {
                    const mentions = topicData.dataPoints[dateIndex];
                    
                    // Calculate week-over-week change dynamically
                    let weekOverWeek = 0;
                    if (dateIndex > 0 && topicData.dataPoints[dateIndex - 1] > 0) {
                        const previousMentions = topicData.dataPoints[dateIndex - 1];
                        weekOverWeek = Math.round(((mentions - previousMentions) / previousMentions) * 100);
                    }
                    
                    // Get quote if available
                    let quote = '';
                    if (this.currentTimeRange === '7 days' && topicData.quotes && topicData.quotes[dateLabel]) {
                        quote = topicData.quotes[dateLabel];
                    } else if (this.currentTimeRange === '30 days' && topicData.weeklyNarrative && topicData.weeklyNarrative[dateLabel]) {
                        quote = topicData.weeklyNarrative[dateLabel];
                    } else if (this.currentTimeRange === '90 days' && topicData.quotes && topicData.quotes[dateLabel]) {
                        quote = topicData.quotes[dateLabel];
                    }
                    
                    topicStats.push({
                        topic: topic,
                        mentions: mentions,
                        color: topicData.color || this.getTopicColor(topic),
                        weekOverWeek: weekOverWeek,
                        quote: quote,
                        consensusLevel: topicData.consensusLevel || 'Moderate'
                    });
                }
            });
            
            // Sort by mentions (highest first)
            topicStats.sort((a, b) => b.mentions - a.mentions);
            
            // Build tooltip HTML
            let html = `
                <div class="rich-tooltip-content">
                    <div class="tooltip-date">${formattedDate}</div>
                    <div class="tooltip-divider"></div>
            `;
            
            // Add time range specific context
            if (this.currentTimeRange === '30 days') {
                const weekTotal = topicStats.reduce((sum, stat) => sum + stat.mentions, 0);
                html += `<div class="tooltip-week-total">Total mentions: ${weekTotal}</div>`;
            }
            
            topicStats.forEach(stat => {
                const changeText = stat.weekOverWeek !== 0 ? 
                    (stat.weekOverWeek > 0 ? `+${stat.weekOverWeek}%` : `${stat.weekOverWeek}%`) + ' vs prev' : '';
                const isFaded = stat.mentions < 5;
                
                html += `
                    <div class="topic-section ${isFaded ? 'faded-topic' : ''}">
                        <div class="topic-header">
                            <span class="topic-dot" style="background-color: ${stat.color}"></span>
                            <span class="topic-name">${stat.topic}</span>
                        </div>
                        <div class="topic-stats">
                            ${stat.mentions} mentions${changeText ? ' • ' + changeText : ''}
                        </div>
                `;
                
                if (stat.quote) {
                    html += `<div class="topic-quote" style="font-size: 11px; color: #6b7280; margin-top: 4px; font-style: italic;">"${stat.quote}"</div>`;
                }
                
                html += `</div>`;
            });
            
            // Add momentum summary for 7-day view
            if (this.currentTimeRange === '7 days' && topicStats.length > 0 && currentData.topics[topicStats[0].topic]) {
                const topTopic = currentData.topics[topicStats[0].topic];
                if (topTopic.peakDay || topTopic.dailyAverage) {
                    html += `
                        <div class="tooltip-divider"></div>
                        <div class="tooltip-summary" style="font-size: 12px; color: #6b7280;">
                    `;
                    if (topTopic.peakDay) {
                        html += `Peak day: ${topTopic.peakDay}<br>`;
                    }
                    if (topTopic.dailyAverage) {
                        html += `Daily avg: ${topTopic.dailyAverage.toFixed(1)} mentions`;
                    }
                    html += `</div>`;
                }
            }
            
            html += '</div>';
            tooltip.innerHTML = html;
            tooltip.classList.add('visible');
            this.updateTooltipPosition(mouseEvent);
        };

        // Override volume view interactions to use dynamic calculations
        const originalInitVolumeInteractions = NarrativePulse.initVolumeInteractions;
        NarrativePulse.initVolumeInteractions = function() {
            const chartContent = this.container.querySelector('#chartContent');
            const tooltip = this.container.querySelector('#chartTooltip');
            const segments = this.container.querySelectorAll('.volume-bar-segment');
            
            this.currentHoveredDate = null;
            
            segments.forEach(segment => {
                const handleSegmentMouseEnter = (e) => {
                    const date = segment.dataset.date;
                    const dateIndex = this.dateLabels.indexOf(date);
                    const currentData = this.getCurrentData();
                    
                    // Show dots animation
                    if (this.currentHoveredDate) {
                        this.container.querySelectorAll(`.volume-bar-segment[data-date="${this.currentHoveredDate}"] .volume-hover-dot`)
                            .forEach(dot => dot.style.opacity = '0');
                    }
                    
                    this.container.querySelectorAll(`.volume-bar-segment[data-date="${date}"] .volume-hover-dot`)
                        .forEach(dot => dot.style.opacity = '1');
                    
                    this.currentHoveredDate = date;
                    
                    // Clear hide timer
                    if (this.hideTooltipTimer) {
                        clearTimeout(this.hideTooltipTimer);
                        this.hideTooltipTimer = null;
                    }
                    
                    // Calculate totals from actual data
                    let total = 0;
                    const breakdown = [];
                    
                    this.selectedTopics.forEach(topic => {
                        const topicData = currentData.topics[topic];
                        if (topicData && topicData.dataPoints && topicData.dataPoints[dateIndex] !== undefined) {
                            const mentions = topicData.dataPoints[dateIndex];
                            total += mentions;
                            if (mentions > 0) {
                                breakdown.push({
                                    topic: topic,
                                    mentions: mentions,
                                    color: topicData.color || this.getTopicColor(topic),
                                    percent: 0 // Will calculate after total
                                });
                            }
                        }
                    });
                    
                    // Calculate percentages
                    if (total > 0) {
                        breakdown.forEach(item => {
                            item.percent = Math.round((item.mentions / total) * 100);
                        });
                    }
                    
                    // Sort by mentions
                    breakdown.sort((a, b) => b.mentions - a.mentions);
                    
                    // Format date
                    let formattedDate = date;
                    if (this.currentTimeRange === '7 days' && date.includes(' ')) {
                        const parts = date.split(' ');
                        formattedDate = `${parts[0]}, Aug ${parts[1]}, 2025`;
                    } else if (this.currentTimeRange === '90 days' && date.includes(' ')) {
                        const [month, day] = date.split(' ');
                        formattedDate = `${month} ${day}, 2025`;
                    }
                    
                    // Build tooltip content
                    let html = `
                        <div class="volume-tooltip-content">
                            <div class="tooltip-header">
                                <div class="tooltip-date">${formattedDate}</div>
                                <div class="tooltip-total">Total: ${total} mentions</div>
                            </div>
                            <div class="tooltip-divider"></div>
                            <div class="tooltip-breakdown">
                                <div class="breakdown-label">Breakdown by topic:</div>
                    `;
                    
                    breakdown.forEach(item => {
                        html += `
                            <div class="breakdown-item">
                                <span class="breakdown-dot" style="background-color: ${item.color}"></span>
                                <span class="breakdown-topic">${item.topic}</span>
                                <span class="breakdown-value">${item.mentions} (${item.percent}%)</span>
                            </div>
                        `;
                    });
                    
                    // Add quote for 7-day view if available
                    if (this.currentTimeRange === '7 days' && breakdown.length > 0) {
                        const topTopic = currentData.topics[breakdown[0].topic];
                        if (topTopic && topTopic.quotes && topTopic.quotes[date]) {
                            html += `
                                </div>
                                <div class="tooltip-divider"></div>
                                <div class="tooltip-quote">
                                    <div class="quote-label">Top story:</div>
                                    <div class="quote-text">"${topTopic.quotes[date]}"</div>
                            `;
                        }
                    }
                    
                    html += '</div></div>';
                    
                    // Show tooltip
                    tooltip.className = 'chart-tooltip chart-tooltip-volume';
                    tooltip.style.display = 'block';
                    tooltip.style.opacity = '1';
                    tooltip.innerHTML = html;
                    tooltip.classList.add('visible');
                    this.updateTooltipPosition(e);
                };
                
                this.addEventListener(segment, 'mouseenter', handleSegmentMouseEnter, 'volume');
            });
            
            // Handle mouse leave
            const handleChartMouseLeave = () => {
                if (this.currentHoveredDate) {
                    this.container.querySelectorAll('.volume-hover-dot')
                        .forEach(dot => dot.style.opacity = '0');
                    this.currentHoveredDate = null;
                }
                this.hideTooltipWithDelay();
            };
            
            const handleChartMouseMove = (e) => {
                if (tooltip.classList.contains('visible')) {
                    this.updateTooltipPosition(e);
                }
            };
            
            this.addEventListener(chartContent, 'mouseleave', handleChartMouseLeave, 'volume');
            this.addEventListener(chartContent, 'mousemove', handleChartMouseMove, 'volume');
            
            const chartWrapper = this.container.querySelector('.chart-wrapper');
            if (chartWrapper) {
                this.addEventListener(chartWrapper, 'mouseleave', handleChartMouseLeave, 'volume');
            }
        };

        // Override consensus view interactions for new data
        const originalInitConsensusInteractions = NarrativePulse.initConsensusInteractions;
        NarrativePulse.initConsensusInteractions = function() {
            const chartContent = this.container.querySelector('#chartContent');
            const tooltip = this.container.querySelector('#chartTooltip');
            const cellGroups = this.container.querySelectorAll('.consensus-cell-group');
            
            cellGroups.forEach(cellGroup => {
                const handleCellMouseEnter = (e) => {
                    const topic = cellGroup.dataset.topic;
                    const dateIndex = parseInt(cellGroup.dataset.index);
                    const currentData = this.getCurrentData();
                    const topicData = currentData.topics[topic];
                    
                    if (!topicData) return;
                    
                    const date = this.dateLabels[dateIndex];
                    let formattedDate = date;
                    
                    if (this.currentTimeRange === '7 days' && date.includes(' ')) {
                        const parts = date.split(' ');
                        formattedDate = `${parts[0]}, Aug ${parts[1]}, 2025`;
                    } else if (this.currentTimeRange === '90 days' && date.includes(' ')) {
                        const [month, day] = date.split(' ');
                        formattedDate = `${month} ${day}, 2025`;
                    }
                    
                    // Get mentions and consensus data
                    const mentions = topicData.dataPoints[dateIndex] || 0;
                    let consensusPercent = parseInt(cellGroup.dataset.percent) || 85;
                    let positiveSources = Math.round(mentions * (consensusPercent / 100));
                    let neutralSources = 0;
                    let negativeSources = 0;
                    
                    // For 30-day view, use detailed breakdown if available
                    if (this.currentTimeRange === '30 days' && topicData.consensusBreakdown && topicData.consensusBreakdown[dateIndex]) {
                        const breakdown = topicData.consensusBreakdown[dateIndex];
                        positiveSources = breakdown.positive;
                        neutralSources = breakdown.neutral;
                        negativeSources = breakdown.negative;
                    }
                    
                    // Build tooltip
                    let html = `
                        <div class="consensus-heatmap-tooltip">
                            <div class="tooltip-title">${topic} - ${formattedDate}</div>
                            <div class="tooltip-consensus">Consensus: ${consensusPercent}% positive</div>
                            <div class="tooltip-mentions">Based on ${mentions} mentions</div>
                    `;
                    
                    if (this.currentTimeRange === '30 days' && neutralSources > 0) {
                        html += `
                            <div class="tooltip-breakdown">
                                <span style="color: #4a7c59">Positive: ${positiveSources}</span> • 
                                <span style="color: #f4a261">Neutral: ${neutralSources}</span> • 
                                <span style="color: #c77d7d">Negative: ${negativeSources}</span>
                            </div>
                        `;
                    } else {
                        html += `<div class="tooltip-sources">${positiveSources} sources agree</div>`;
                    }
                    
                    // Add narrative for 30-day view
                    if (this.currentTimeRange === '30 days' && topicData.weeklyNarrative && topicData.weeklyNarrative[date]) {
                        html += `<div class="tooltip-narrative" style="margin-top: 8px; font-size: 11px; color: #6b7280; font-style: italic;">"${topicData.weeklyNarrative[date]}"</div>`;
                    }
                    
                    html += '</div>';
                    
                    // Show tooltip
                    tooltip.className = 'chart-tooltip chart-tooltip-consensus';
                    tooltip.style.display = 'block';
                    tooltip.style.opacity = '1';
                    tooltip.innerHTML = html;
                    tooltip.classList.add('visible');
                    this.updateTooltipPosition(e);
                };
                
                const handleCellMouseLeave = () => {
                    this.hideTooltipWithDelay();
                };
                
                const handleCellMouseMove = (e) => {
                    if (tooltip.classList.contains('visible')) {
                        this.updateTooltipPosition(e);
                    }
                };
                
                this.addEventListener(cellGroup, 'mouseenter', handleCellMouseEnter, 'consensus');
                this.addEventListener(cellGroup, 'mouseleave', handleCellMouseLeave, 'consensus');
                this.addEventListener(cellGroup, 'mousemove', handleCellMouseMove, 'consensus');
            });
        };

        console.log('NarrativePulse data updates applied successfully');
    }

    // Start the update process
    applyUpdates();
})();