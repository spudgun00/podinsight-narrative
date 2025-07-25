// Update functions for Narrative Pulse to use new comprehensive data
// This file contains the updated methods that should replace existing ones in narrative-pulse.js

// Add this at the beginning of NarrativePulse object after line 3
const NarrativePulseUpdates = {
    // Initialize with new data source
    initWithNewData: function() {
        // Check if new data is available
        if (window.narrativePulseData) {
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
        }
    },

    // Updated showRichTooltip function with dynamic calculations
    showRichTooltip: function(dateIndex, mouseEvent) {
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
            const parts = dateLabel.split(' ');
            formattedDate = `${parts[0]}, Aug ${parts[1]}, 2025`;
        } else if (this.currentTimeRange === '30 days') {
            // For 30-day view, dates are like "Week 1"
            formattedDate = dateLabel;
        } else {
            // For 90-day view, dates are like "Jun 3"
            const [month, day] = dateLabel.split(' ');
            formattedDate = `${month} ${day}, 2025`;
        }
        
        // Build topic data with calculations
        const topicStats = [];
        
        this.selectedTopics.forEach(topic => {
            const topicData = currentData.topics[topic];
            if (topicData && topicData.dataPoints[dateIndex] !== undefined) {
                const mentions = topicData.dataPoints[dateIndex];
                
                // Calculate week-over-week change dynamically
                let weekOverWeek = 0;
                if (dateIndex > 0) {
                    const previousMentions = topicData.dataPoints[dateIndex - 1];
                    if (previousMentions > 0) {
                        weekOverWeek = Math.round(((mentions - previousMentions) / previousMentions) * 100);
                    }
                }
                
                // Get quote if available (for 7-day view)
                let quote = '';
                if (this.currentTimeRange === '7 days' && topicData.quotes) {
                    quote = topicData.quotes[dateLabel] || '';
                } else if (this.currentTimeRange === '30 days' && topicData.weeklyNarrative) {
                    quote = topicData.weeklyNarrative[dateLabel] || '';
                } else if (this.currentTimeRange === '90 days' && topicData.quotes) {
                    quote = topicData.quotes[dateLabel] || '';
                }
                
                topicStats.push({
                    topic: topic,
                    mentions: mentions,
                    color: topicData.color,
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
                html += `<div class="topic-quote">"${stat.quote}"</div>`;
            }
            
            html += `</div>`;
        });
        
        // Add momentum summary for 7-day view
        if (this.currentTimeRange === '7 days' && currentData.topics[topicStats[0]?.topic]) {
            const topTopic = currentData.topics[topicStats[0].topic];
            html += `
                <div class="tooltip-divider"></div>
                <div class="tooltip-summary">
                    Peak day: ${topTopic.peakDay || 'N/A'}<br>
                    Daily avg: ${topTopic.dailyAverage ? topTopic.dailyAverage.toFixed(1) : 'N/A'} mentions
                </div>
            `;
        }
        
        html += '</div>';
        tooltip.innerHTML = html;
        tooltip.classList.add('visible');
        this.updateTooltipPosition(mouseEvent);
    },

    // Update volume view tooltip to use new data
    initVolumeInteractionsWithNewData: function() {
        const chartContent = this.container.querySelector('#chartContent');
        const tooltip = this.container.querySelector('#chartTooltip');
        const segments = this.container.querySelectorAll('.volume-bar-segment');
        
        let currentHoveredDate = null;
        
        segments.forEach(segment => {
            const handleSegmentMouseEnter = (e) => {
                const date = segment.dataset.date;
                const dateIndex = this.dateLabels.indexOf(date);
                const currentData = this.getCurrentData();
                
                // Show dots animation
                if (currentHoveredDate) {
                    this.container.querySelectorAll(`.volume-bar-segment[data-date="${currentHoveredDate}"] .volume-hover-dot`)
                        .forEach(dot => dot.style.opacity = '0');
                }
                
                this.container.querySelectorAll(`.volume-bar-segment[data-date="${date}"] .volume-hover-dot`)
                    .forEach(dot => dot.style.opacity = '1');
                
                currentHoveredDate = date;
                
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
                    if (topicData && topicData.dataPoints[dateIndex] !== undefined) {
                        const mentions = topicData.dataPoints[dateIndex];
                        total += mentions;
                        if (mentions > 0) {
                            breakdown.push({
                                topic: topic,
                                mentions: mentions,
                                color: topicData.color,
                                percent: 0 // Will calculate after total
                            });
                        }
                    }
                });
                
                // Calculate percentages
                breakdown.forEach(item => {
                    item.percent = Math.round((item.mentions / total) * 100);
                });
                
                // Sort by mentions
                breakdown.sort((a, b) => b.mentions - a.mentions);
                
                // Format date
                let formattedDate = '';
                if (this.currentTimeRange === '7 days') {
                    const parts = date.split(' ');
                    formattedDate = `${parts[0]}, Aug ${parts[1]}, 2025`;
                } else if (this.currentTimeRange === '30 days') {
                    formattedDate = date;
                } else {
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
            if (currentHoveredDate) {
                this.container.querySelectorAll('.volume-hover-dot')
                    .forEach(dot => dot.style.opacity = '0');
                currentHoveredDate = null;
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
    },

    // Update consensus view tooltip to use new data
    initConsensusInteractionsWithNewData: function() {
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
                let formattedDate = '';
                
                if (this.currentTimeRange === '7 days') {
                    const parts = date.split(' ');
                    formattedDate = `${parts[0]}, Aug ${parts[1]}, 2025`;
                } else if (this.currentTimeRange === '30 days') {
                    formattedDate = date;
                } else {
                    const [month, day] = date.split(' ');
                    formattedDate = `${month} ${day}, 2025`;
                }
                
                // Get mentions for this date
                const mentions = topicData.dataPoints[dateIndex] || 0;
                
                // Calculate consensus based on available data
                let consensusPercent = 85; // Default
                let positiveSources = Math.round(mentions * 0.85);
                
                // For 30-day view, use consensusBreakdown if available
                if (this.currentTimeRange === '30 days' && topicData.consensusBreakdown && topicData.consensusBreakdown[dateIndex]) {
                    const breakdown = topicData.consensusBreakdown[dateIndex];
                    const total = breakdown.positive + breakdown.neutral + breakdown.negative;
                    consensusPercent = Math.round((breakdown.positive / total) * 100);
                    positiveSources = breakdown.positive;
                }
                
                // Build tooltip
                let html = `
                    <div class="consensus-heatmap-tooltip">
                        <div class="tooltip-title">${topic} - ${formattedDate}</div>
                        <div class="tooltip-consensus">Consensus: ${consensusPercent}% positive</div>
                        <div class="tooltip-mentions">Based on ${mentions} mentions</div>
                        <div class="tooltip-sources">${positiveSources} sources agree</div>
                    </div>
                `;
                
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
    }
};

// Export for use
window.NarrativePulseUpdates = NarrativePulseUpdates;