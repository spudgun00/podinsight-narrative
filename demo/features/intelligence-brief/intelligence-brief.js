const IntelligenceBrief = {
    init: function(container) {
        this.container = container;
        this.bindEvents();
        this.setupTimeRangeListener();
        
        // Populate content from unified data
        if (window.unifiedData) {
            this.populateBriefContent(window.unifiedData);
        }
        
        // Initialize with 7 days data
        this.updateConsensusMonitor('7 days');
        this.updateVelocityTracking();
        this.updateInfluenceMetrics();
        this.updateTopicCorrelations();
    },
    
    populateBriefContent: function(data) {
        // Update header meta information
        this.updateBriefMeta(data.meta);
        
        // Update brief summary content
        if (data.intelligenceBrief && data.intelligenceBrief.summary) {
            this.updateBriefSummary(data.intelligenceBrief.summary);
        }
        
        // Update value indicators
        this.updateValueIndicators(data);
        
        // Update influence metrics dynamically
        if (data.intelligenceBrief && data.intelligenceBrief.metrics && data.intelligenceBrief.metrics.influenceMetrics) {
            this.populateInfluenceMetrics(data.intelligenceBrief.metrics.influenceMetrics);
        }
    },
    
    updateBriefMeta: function(meta) {
        const metaElement = document.getElementById('brief-meta');
        if (!metaElement || !meta || !meta.analysis) return;
        
        const hours = meta.analysis.hoursAnalyzed || 'N/A';
        const lastAnalysis = meta.analysis.lastAnalysis || 'just now';
        
        metaElement.textContent = `${hours.toLocaleString()} hours analyzed • Updated ${lastAnalysis}`;
    },
    
    updateValueIndicators: function(data) {
        const container = document.getElementById('value-indicators');
        if (!container) return;
        
        // Clear existing content
        container.innerHTML = '';
        
        // Count key trends (consensus + contrarian + blindspots)
        let trendCount = 0;
        if (data.intelligenceBrief && data.intelligenceBrief.summary && data.intelligenceBrief.summary.expanded) {
            const expanded = data.intelligenceBrief.summary.expanded;
            trendCount = (expanded.consensus || []).length + 
                        (expanded.contrarian || []).length + 
                        (expanded.blindspots || []).length;
        }
        
        // Count action items
        let actionCount = 0;
        if (data.weeklyBrief && data.weeklyBrief.actionItems) {
            actionCount = (data.weeklyBrief.actionItems.thisWeek || []).length + 
                         (data.weeklyBrief.actionItems.monitor || []).length;
        }
        
        // Create badges
        const badges = [
            { icon: '📊', count: trendCount, label: 'Key Trends' },
            { icon: '🎯', count: actionCount, label: 'Action Items' },
            { icon: '📈', label: 'Visual Analysis' } // No count for this one
        ];
        
        badges.forEach(badge => {
            const span = document.createElement('span');
            span.className = 'brief-value-badge';
            span.textContent = badge.count !== undefined ? 
                `${badge.icon} ${badge.count} ${badge.label}` : 
                `${badge.icon} ${badge.label}`;
            container.appendChild(span);
        });
    },
    
    updateBriefSummary: function(summary) {
        if (!summary) return;
        
        // Update collapsed/preview content
        const consensusPreview = document.getElementById('consensus-preview');
        const contrarianPreview = document.getElementById('contrarian-preview');
        const blindspotPreview = document.getElementById('blindspot-preview');
        
        if (summary.collapsed) {
            // Parse the collapsed summary to extract sections
            const sections = this.parseCollapsedSummary(summary.collapsed);
            
            if (consensusPreview) {
                consensusPreview.textContent = sections.consensus || 'Loading consensus data...';
            }
            if (contrarianPreview) {
                contrarianPreview.textContent = sections.contrarian || 'Loading contrarian signals...';
            }
            if (blindspotPreview) {
                blindspotPreview.textContent = sections.blindspot || 'Loading blindspots...';
            }
        }
        
        // Update expanded content
        if (summary.expanded) {
            this.updateExpandedSection('consensus-expanded', summary.expanded.consensus);
            this.updateExpandedSection('contrarian-expanded', summary.expanded.contrarian);
            this.updateExpandedSection('blindspots-expanded', summary.expanded.blindspots);
        }
    },
    
    parseCollapsedSummary: function(collapsed) {
        // The collapsed summary contains key points separated by periods
        // Extract main themes from the summary
        const parts = collapsed.split('. ');
        
        return {
            consensus: parts[0] || '',
            contrarian: parts[1] || '',
            blindspot: parts[4] || '' // "Blindspot:" is typically the 5th element
        };
    },
    
    updateExpandedSection: function(elementId, items) {
        const element = document.getElementById(elementId);
        if (!element || !items || !Array.isArray(items)) return;
        
        element.innerHTML = '';
        
        items.forEach(item => {
            const li = document.createElement('li');
            
            if (item.title && item.sources && item.detail) {
                li.innerHTML = `<strong>${item.title}</strong> ${item.sources} - ${item.detail}`;
            } else if (item.title && item.description && item.context) {
                li.innerHTML = `<strong>${item.title}</strong> ${item.description} - ${item.context}`;
            } else if (item.title && item.description) {
                li.innerHTML = `<strong>${item.title}:</strong> ${item.description}`;
            } else if (typeof item === 'string') {
                li.textContent = item;
            }
            
            element.appendChild(li);
        });
    },
    
    populateInfluenceMetrics: function(metrics) {
        const listElement = document.getElementById('influence-metrics-list');
        if (!listElement || !metrics || !Array.isArray(metrics)) return;
        
        listElement.innerHTML = '';
        
        metrics.forEach((metric, index) => {
            const influenceItem = document.createElement('div');
            influenceItem.className = 'influence-item';
            
            // Extract percentage from score string (e.g., "High (97)" -> 97)
            let percentage = 0;
            const scoreMatch = metric.score.match(/\((\d+)\)/);
            if (scoreMatch) {
                percentage = parseInt(scoreMatch[1], 10);
            }
            
            influenceItem.innerHTML = `
                <span class="influence-name">${metric.name}</span>
                <div class="influence-bar-container">
                    <div class="influence-bar" style="width: 0%;"></div>
                </div>
                <span class="influence-score">${percentage}%</span>
            `;
            
            listElement.appendChild(influenceItem);
            
            // Animate the bar after adding to DOM
            const bar = influenceItem.querySelector('.influence-bar');
            setTimeout(() => {
                requestAnimationFrame(() => {
                    bar.style.width = `${percentage}%`;
                });
            }, 50 + (index * 150));
        });
    },
    
    bindEvents: function() {
        const toggleBtn = this.container.querySelector('[data-action="toggleBrief"]');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleBrief());
        }
        
        // Main Download button
        const downloadBtn = this.container.querySelector('[data-action="downloadBrief"]');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', () => this.downloadPDF());
        }
        
        // Slack button
        const slackBtn = this.container.querySelector('.brief-action-btn[title="Share via Slack"]');
        if (slackBtn) {
            slackBtn.addEventListener('click', () => this.shareViaSlack());
        }
        
        // Email Brief button
        const emailBtn = this.container.querySelector('.brief-action-btn[title="Email Brief"]');
        if (emailBtn) {
            emailBtn.addEventListener('click', () => this.emailBrief());
        }
    },
    
    toggleBrief: function() {
        const collapsed = this.container.querySelector('#briefCollapsed');
        const expanded = this.container.querySelector('#briefExpanded');
        const btn = this.container.querySelector('#expandBriefBtn');
        const btnText = this.container.querySelector('#expandText');
        
        if (expanded.style.display === 'none') {
            collapsed.style.display = 'none';
            expanded.style.display = 'block';
            btn.classList.add('expanded');
            btnText.textContent = 'Collapse Analysis';
        } else {
            collapsed.style.display = 'block';
            expanded.style.display = 'none';
            btn.classList.remove('expanded');
            btnText.textContent = 'View Full Analysis';
        }
    },
    
    downloadPDF: function() {
        // Open the weekly brief HTML in a new tab
        window.open('pdf/weekly-brief.html', '_blank');
    },
    
    emailBrief: function() {
        // Get current date for the subject line
        const today = new Date();
        const weekNum = Math.ceil(((today - new Date(today.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        const month = monthNames[today.getMonth()];
        const year = today.getFullYear();
        
        // Get data from unified data source
        const data = window.unifiedData;
        const brief = data.intelligenceBrief;
        const meta = data.meta;
        
        // Email parameters
        const subject = `Synthea.ai Weekly Intelligence Brief - Week ${weekNum}, ${month} ${year}`;
        
        // Build email body with dynamic data
        let body = `Hi team,

Please find this week's Synthea.ai Intelligence Brief below.

Key Highlights:
`;
        
        // Add top 3 consensus items if available
        if (brief.summary && brief.summary.expanded && brief.summary.expanded.consensus) {
            brief.summary.expanded.consensus.slice(0, 3).forEach(item => {
                body += `• ${item.title}\n`;
            });
        }
        
        body += `
View the full brief here: ${window.location.origin}/demo/pdf/weekly-brief.html

Best regards,
Synthea.ai Intelligence Team

--
Synthesized from ${meta.analysis.hoursAnalyzed.toLocaleString()} hours across ${meta.analysis.podcastsTracked} VC podcasts
© ${year} Synthea.ai • Proprietary & Confidential`;

        // Create mailto link
        const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        
        // Open email client
        window.location.href = mailtoLink;
    },
    
    shareViaSlack: function() {
        // Get current date for the message
        const today = new Date();
        const weekNum = Math.ceil(((today - new Date(today.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        const month = monthNames[today.getMonth()];
        
        // Get data from unified data source
        const data = window.unifiedData;
        const brief = data.intelligenceBrief;
        
        // Create Slack message with dynamic data
        let message = `📊 *Synthea.ai Weekly Intelligence Brief - Week ${weekNum}, ${month}*\n\n` +
                     `Key highlights:\n`;
        
        // Add top velocity tracking items
        if (brief.metrics && brief.metrics.velocityTracking) {
            brief.metrics.velocityTracking.slice(0, 3).forEach(item => {
                const symbol = item.direction === 'positive' ? '📈' : '📉';
                message += `${symbol} ${item.theme}: ${item.change}\n`;
            });
        }
        
        message += `\nView full brief: ${window.location.origin}/demo/pdf/weekly-brief.html`;
        
        // Copy to clipboard and show notification
        navigator.clipboard.writeText(message).then(() => {
            // Create notification
            const notification = document.createElement('div');
            notification.className = 'slack-notification';
            notification.textContent = 'Brief copied to clipboard - paste in Slack!';
            document.body.appendChild(notification);
            
            // Show notification
            setTimeout(() => notification.classList.add('show'), 10);
            
            // Hide and remove after 3 seconds
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        });
    },
    
    setupTimeRangeListener: function() {
        // Listen for time range changes from Narrative Pulse
        window.addEventListener('timeRangeChanged', (event) => {
            this.updateConsensusMonitor(event.detail.timeRange);
        });
    },
    
    updateConsensusMonitor: function(timeRange) {
        if (!window.unifiedData) {
            return;
        }
        
        const consensusContainer = document.querySelector('.consensus-monitor-container');
        if (!consensusContainer) {
            return;
        }
        
        let consensusData = [];
        
        // For 7 days, use the static consensusMonitor data
        if (timeRange === '7 days' && 
            window.unifiedData.intelligenceBrief && 
            window.unifiedData.intelligenceBrief.metrics && 
            window.unifiedData.intelligenceBrief.metrics.consensusMonitor) {
            
            // Use the pre-formatted consensus monitor data for 7 days
            const consensusItems = window.unifiedData.intelligenceBrief.metrics.consensusMonitor;
            
            // Process the first 4 items
            consensusData = consensusItems.slice(0, 4).map(item => {
                // Extract percentage from level string
                const match = item.level.match(/(\d+)/);
                const percentage = match ? parseInt(match[0], 10) : 0;
                
                return {
                    topic: item.topic,
                    label: this.getShortLabel(item.topic),
                    level: item.level,
                    percentage: percentage,
                    trend: this.generateMockTrend(percentage) // Temporary mock trend
                };
            });
        } else if (window.unifiedData.narrativePulse) {
            // Fallback to dynamic calculation from narrative pulse topics
            const topics = window.unifiedData.narrativePulse.topics;
            
            // Extract consensus data for each topic based on time range
            Object.entries(topics).forEach(([topicName, topicData]) => {
                let consensusLevel = '';
                let consensusPercentage = 0;
                
                if (timeRange === '7 days') {
                    // For 7 days, use the consensusLevel field
                    consensusLevel = topicData.consensusLevel;
                    // Extract percentage from strings like "Strong (>85% agreement)"
                    const match = consensusLevel.match(/(\d+)%/);
                    consensusPercentage = match ? parseInt(match[1]) : 50;
                } else {
                    // For 30/90 days, use the last value in the progression
                    const chartKey = timeRange === '30 days' ? '30d' : '90d';
                    if (topicData.chartData[chartKey] && topicData.chartData[chartKey].consensus) {
                        const progression = topicData.chartData[chartKey].consensus.progression;
                        if (Array.isArray(progression)) {
                            // Get the last consensus level
                            const lastLevel = progression[progression.length - 1];
                            consensusLevel = this.formatConsensusLevel(lastLevel);
                            consensusPercentage = this.getConsensusPercentage(lastLevel);
                        }
                    }
                }
                
                consensusData.push({
                    topic: topicName,
                    label: this.getShortTopicName(topicName),
                    level: consensusLevel,
                    percentage: consensusPercentage,
                    trend: this.generateMockTrend(consensusPercentage) // Temporary mock trend
                });
            });
            
            // Sort by consensus percentage (highest first) and take top 4
            consensusData.sort((a, b) => b.percentage - a.percentage);
            consensusData = consensusData.slice(0, 4);
        }
        
        // Clear existing content
        consensusContainer.innerHTML = '';
        
        // Render progress bars using influence-item structure
        consensusData.forEach((item, index) => {
            const consensusItem = document.createElement('div');
            consensusItem.className = 'influence-item';
            
            // Determine consensus level class
            let levelClass = 'consensus-low';
            if (item.percentage > 75) {
                levelClass = 'consensus-high';
            } else if (item.percentage >= 50) {
                levelClass = 'consensus-medium';
            }
            
            consensusItem.innerHTML = `
                <span class="influence-name">${item.label}</span>
                <div class="influence-bar-container">
                    <div class="influence-bar ${levelClass}" 
                         role="progressbar" 
                         aria-valuenow="0" 
                         aria-valuemin="0" 
                         aria-valuemax="100" 
                         style="width: 0%;">
                    </div>
                </div>
                <span class="influence-score">${item.percentage}%</span>
            `;
            
            consensusContainer.appendChild(consensusItem);
            
            // Trigger animation after a frame
            const bar = consensusItem.querySelector('.influence-bar');
            setTimeout(() => {
                requestAnimationFrame(() => {
                    bar.style.width = `${item.percentage}%`;
                    bar.setAttribute('aria-valuenow', item.percentage);
                });
            }, 50 + (index * 150)); // Staggered animation
        });
    },
    
    // Temporary method to generate mock trend data
    generateMockTrend: function(percentage) {
        // Generate a random trend between -15 and +15
        const trendValue = Math.floor(Math.random() * 31) - 15;
        let direction = 'neutral';
        
        if (trendValue > 2) {
            direction = 'up';
        } else if (trendValue < -2) {
            direction = 'down';
        }
        
        return {
            value: Math.abs(trendValue),
            direction: direction
        };
    },
    
    formatConsensusLevel: function(level) {
        // Map the progression values to formatted strings
        const levelMap = {
            'Weak': 'Weak (<25%)',
            'Very Low': 'Weak (<25%)',
            'Low': 'Low (25-40%)',
            'Mixed': 'Mixed (40-60%)',
            'Moderate': 'Mixed (40-60%)',
            'Building': 'Building (60-80%)',
            'Strong': 'Strong (>80%)',
            'Very High': 'Strong (>85%)',
            'Peak': 'Peak (>90%)'
        };
        
        return levelMap[level] || level;
    },
    
    getConsensusPercentage: function(level) {
        // Map levels to percentages for sorting
        const percentageMap = {
            'Weak': 20,
            'Very Low': 15,
            'Low': 30,
            'Mixed': 50,
            'Moderate': 55,
            'Building': 70,
            'Strong': 85,
            'Very High': 90,
            'Peak': 95
        };
        
        return percentageMap[level] || 50;
    },
    
    getShortTopicName: function(topic) {
        // Return topic names with proper case - no abbreviations
        return topic;
    },
    
    getShortLabel: function(topic) {
        // Shorten labels from consensusMonitor data with proper case
        const labelMap = {
            'Infrastructure > Apps': 'AI Infrastructure',
            'Enterprise AI Adoption': 'Enterprise Agents',
            'Series A Bar Rising': 'Series A Strategy',
            'Defense Tech Value': 'Defense Tech',
            'Vertical AI Premium': 'Vertical AI',
            'Exit Environment': 'Exit Strategies',
            'Traditional SaaS': 'Traditional SaaS'
        };
        
        return labelMap[topic] || topic;
    },
    
    getTopicSparklineData: function(themeName) {
        // Try to get real 7-day momentum data from Narrative Pulse
        if (!window.unifiedData || !window.unifiedData.narrativePulse || !window.unifiedData.narrativePulse.topics) {
            return null;
        }
        
        // Find matching topic in Narrative Pulse data
        const topics = window.unifiedData.narrativePulse.topics;
        for (const [topicName, topicData] of Object.entries(topics)) {
            // Check if this topic matches the velocity tracking theme
            if (topicName === themeName || 
                (themeName === 'Enterprise Agents' && topicName === 'Enterprise Agents') ||
                (themeName === 'Defense Tech' && topicName === 'Defense Tech') ||
                (themeName === 'AI Infrastructure' && topicName === 'AI Infrastructure') ||
                (themeName === 'Exit Strategies' && topicName === 'Exit Strategies') ||
                (themeName === 'Vertical AI' && topicName === 'Vertical AI') ||
                (themeName === 'Climate Tech' && topicName === 'Climate Tech') ||
                (themeName === 'Traditional SaaS' && topicName === 'Traditional SaaS')) {
                
                // Return the actual 7-day momentum data points
                if (topicData.chartData && topicData.chartData['7d'] && 
                    topicData.chartData['7d'].momentum && 
                    topicData.chartData['7d'].momentum.dataPoints) {
                    return topicData.chartData['7d'].momentum.dataPoints;
                }
            }
        }
        
        return null;
    },
    
    renderSparkline: function(data, isPositive) {
        const width = 45;
        const height = 18;
        const padding = 2;
        
        // Find min and max values for scaling
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1; // Prevent division by zero
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
        svg.setAttribute('class', 'velocity-sparkline');
        
        // Generate more descriptive aria-label
        const trend = data[data.length - 1] > data[0] ? 'increasing' : 'decreasing';
        const changePercent = ((data[data.length - 1] - data[0]) / data[0] * 100).toFixed(0);
        svg.setAttribute('aria-label', `Daily mentions ${trend} from ${data[0]} to ${data[data.length - 1]} over 7 days`);
        
        // Generate path data
        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * (width - 2 * padding) + padding;
            const y = height - padding - ((value - min) / range) * (height - 2 * padding);
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');
        
        // Create path element
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', points);
        path.setAttribute('fill', 'none');
        path.setAttribute('stroke', isPositive ? '#10B981' : '#EF4444');
        path.setAttribute('stroke-width', '1.5');
        path.setAttribute('stroke-linecap', 'round');
        path.setAttribute('stroke-linejoin', 'round');
        
        svg.appendChild(path);
        
        // Add a title element for better tooltip on hover
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `Daily trend: ${data.join(', ')}`;
        svg.appendChild(title);
        
        return svg.outerHTML;
    },

    updateVelocityTracking: function() {
        if (!window.unifiedData) {
            return;
        }
        
        const velocityContainer = document.getElementById('velocityTrackingList');
        if (!velocityContainer) {
            return;
        }
        
        // Check if we have the static velocity tracking data
        if (window.unifiedData.intelligenceBrief && 
            window.unifiedData.intelligenceBrief.metrics && 
            window.unifiedData.intelligenceBrief.metrics.velocityTracking) {
            
            const velocityItems = window.unifiedData.intelligenceBrief.metrics.velocityTracking;
            
            // Generate HTML for velocity items using influence-item structure
            const velocityHTML = velocityItems.map(item => {
                const changeClass = item.direction === 'positive' ? 'positive' : 'negative';
                const changeSymbol = item.direction === 'positive' ? '↑' : '↓';
                const colorClass = item.direction === 'positive' ? 'trend-up' : 'trend-down';
                
                // Get real sparkline data from Narrative Pulse or fall back to empty
                const sparklineData = this.getTopicSparklineData(item.theme);
                let sparklineSVG = '';
                
                if (sparklineData && sparklineData.length > 0) {
                    sparklineSVG = this.renderSparkline(sparklineData, item.direction === 'positive');
                } else {
                    // If no real data available, show a placeholder or skip
                    sparklineSVG = '<span class="sparkline-placeholder" style="display: inline-block; width: 45px;"></span>';
                }
                
                return `
                    <div class="influence-item velocity-item">
                        <span class="influence-name">${item.theme}</span>
                        ${sparklineSVG}
                        <span class="velocity-change ${colorClass}" style="font-weight: 600; color: ${item.direction === 'positive' ? 'var(--sage)' : 'var(--dusty-rose)'};">
                            ${changeSymbol} ${item.change}
                        </span>
                    </div>
                `;
            }).join('');
            
            velocityContainer.innerHTML = velocityHTML;
        }
    },
    
    updateInfluenceMetrics: function() {
        // This function is now handled by populateInfluenceMetrics
        // Called during initialization to maintain compatibility
        // No need to animate here as populateInfluenceMetrics handles it
    },
    
    updateTopicCorrelations: function() {
        const container = document.getElementById('topicCorrelationsContainer');
        if (!container) {
            return;
        }
        
        // Define color palette matching the main topics from Narrative Pulse
        // These colors align with the actual topics in our unified data
        const topicColors = {
            'AI + Infrastructure': '#4a7c59',      // sage - matches AI Infrastructure
            'Enterprise + Production': '#f4a261',   // amber - matches Enterprise Agents
            'Exit Drought + M&A': '#c77d7d',       // dusty rose - matches Exit Strategies
            'Vertical AI + Valuations': '#8a68a8', // purple - matches Vertical AI
            'Defense + Geopolitics': '#5a6c8c',    // slate blue - matches Defense Tech
            'Climate + Industrial': '#68a87c'      // green - matches Climate Tech
        };
        
        // Get topic correlations from unified data
        let correlations = [];
        try {
            const unifiedData = window.unifiedData || window.masterData;
            if (unifiedData && unifiedData.intelligenceBrief && unifiedData.intelligenceBrief.metrics && unifiedData.intelligenceBrief.metrics.topicCorrelations) {
                correlations = unifiedData.intelligenceBrief.metrics.topicCorrelations.map((item) => ({
                    label: item.topics,
                    percentage: item.percentage,
                    color: topicColors[item.topics] || 'var(--sage)' // Use mapped color or default
                }));
            }
        } catch (error) {
            console.error('Error loading topic correlations:', error);
        }
        
        // Fallback to default if no data available (shouldn't happen with unified data)
        if (correlations.length === 0) {
            correlations = [
                { label: 'AI + Infrastructure', percentage: 82, color: '#4a7c59' },
                { label: 'Enterprise + Production', percentage: 73, color: '#f4a261' },
                { label: 'Exit Drought + M&A', percentage: 79, color: '#c77d7d' },
                { label: 'Vertical AI + Valuations', percentage: 68, color: '#8a68a8' }
            ];
        }
        
        // Clear existing content
        container.innerHTML = '';
        
        // Create pie charts - show only top 4 for space constraints
        correlations.slice(0, 4).forEach((item, index) => {
            const chartDiv = document.createElement('div');
            chartDiv.className = 'mini-pie-chart';
            
            // Calculate stroke-dasharray for the filled portion
            // Circumference of circle with radius 40 is 2 * π * 40 ≈ 251.3
            const circumference = 2 * Math.PI * 40;
            const filledLength = (item.percentage / 100) * circumference;
            const emptyLength = circumference - filledLength;
            
            // Format label to show on two lines: "Word1 +" on first line, "Word2" on second
            const labelParts = item.label.split(' ');
            let formattedLabel = item.label;
            if (labelParts.length === 3 && labelParts[1] === '+') {
                // Format as "Word1 +<br>Word2"
                formattedLabel = `${labelParts[0]} ${labelParts[1]}<br>${labelParts[2]}`;
            }
            
            chartDiv.innerHTML = `
                <svg viewBox="0 0 100 100" style="width: 80px; height: 80px;">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#e5e7eb" stroke-width="20"/>
                    <circle cx="50" cy="50" r="40" fill="none" stroke="${item.color}" stroke-width="20"
                            stroke-dasharray="0 ${circumference}" transform="rotate(-90 50 50)"
                            class="progress-circle"/>
                    <text x="50" y="55" text-anchor="middle" fill="#1a1a2e" font-size="16" font-weight="600">${item.percentage}%</text>
                </svg>
                <span class="pie-label">${formattedLabel}</span>
            `;
            
            container.appendChild(chartDiv);
            
            // Trigger animation after DOM update
            setTimeout(() => {
                const progressCircle = chartDiv.querySelector('.progress-circle');
                if (progressCircle) {
                    requestAnimationFrame(() => {
                        progressCircle.setAttribute('stroke-dasharray', `${filledLength} ${emptyLength}`);
                        chartDiv.classList.add('animated');
                    });
                }
            }, 50 + (index * 200)); // Stagger animations
        });
    }
};

window.IntelligenceBrief = IntelligenceBrief;