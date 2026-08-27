const IntelligenceBrief = {
    init: function(container) {
        this.container = container;
        this.animatedSections = new Set(); // Track which sections have animated
        this.thumbnailsEnabled = true; // Track thumbnail visibility state

        // Live genuinely depends on ONE thing here: setupIntersectionObserver
        // assigns the #velocity-tracking-section / #influence-metrics-section /
        // #consensus-monitor-section / #topic-correlations-section ids that the
        // live sidebar components claim. That stays. Everything else on this
        // path renders the July 2025 dataset and is Vision-only.
        this.setupIntersectionObserver();

        // Consensus Monitor was DROPPED from Live on 28 Aug 2026 by James.
        // Measuring agreement needs stance detection, which is on no roadmap,
        // so the section is removed rather than left showing a permanent
        // not-built card. Removed AFTER setupIntersectionObserver, never
        // before: that function assigns the four section ids by position, so
        // taking this section out first would hand #consensus-monitor-section
        // to Topic Correlations. Vision is untouched and still renders it.
        if (window.SyntheaData && window.SyntheaData.isLive()) {
            var cm = document.querySelector('#consensus-monitor-section')
                  || (document.querySelector('.consensus-monitor-container') || {}).closest
                     && document.querySelector('.consensus-monitor-container').closest('.synthesis-section');
            if (cm && cm.parentNode) cm.parentNode.removeChild(cm);
        }

        if (window.SyntheaData && window.SyntheaData.isLive()) return;

        this.bindEvents();
        this.setupTimeRangeListener();

        // Populate content from unified data
        if (window.unifiedData) {
            this.populateBriefContent(window.unifiedData);
        }
        
        // Initialize data but don't animate yet
        this.updateConsensusMonitor('7 days', false);
        this.updateVelocityTracking(false);
        this.updateInfluenceMetrics();
        this.updateTopicCorrelations(false);
    },
    
    setupIntersectionObserver: function() {
        // Create observer that triggers when sections become 20% visible
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.2 // Trigger when 20% visible
        };
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedSections.has(entry.target.id)) {
                    // Mark as animated to prevent re-triggering
                    this.animatedSections.add(entry.target.id);
                    
                    // Trigger appropriate animation based on section
                    switch(entry.target.id) {
                        case 'velocity-tracking-section':
                            this.animateSparklines();
                            break;
                        case 'influence-metrics-section':
                            this.animateInfluenceMetrics();
                            break;
                        case 'consensus-monitor-section':
                            this.animateConsensusMonitor();
                            break;
                        case 'topic-correlations-section':
                            this.animateTopicCorrelations();
                            break;
                    }
                }
            });
        }, observerOptions);
        
        // Observe each animated section
        const sections = [
            document.querySelector('.synthesis-section:has(#velocityTrackingList)'),
            document.querySelector('.synthesis-section:has(#influence-metrics-list)'),
            document.querySelector('.synthesis-section:has(.consensus-monitor-container)'),
            document.querySelector('.synthesis-section:has(#topicCorrelationsContainer)')
        ];
        
        // Add IDs for tracking and observe
        sections.forEach((section, index) => {
            if (section) {
                const sectionIds = [
                    'velocity-tracking-section',
                    'influence-metrics-section', 
                    'consensus-monitor-section',
                    'topic-correlations-section'
                ];
                section.id = sectionIds[index];
                this.observer.observe(section);
            }
        });
    },
    
    populateBriefContent: function(data) {
        // Defensive check for data object
        if (!data) {
            console.warn('IntelligenceBrief: No data provided to populateBriefContent');
            return;
        }
        
        // Header meta comes from the API now, not from data.meta
        this.updateBriefMeta();
        
        // Update brief summary content
        if (data.intelligenceBrief && data.intelligenceBrief.summary) {
            this.updateBriefSummary(data.intelligenceBrief.summary);
        }
        
        // Update value indicators
        this.updateValueIndicators(data);
        
        // Influence Metrics is no longer populated from unified-data.js - it is
        // rendered by features/intelligence-brief/influence-metrics.js from
        // GET /api/entities.
    },
    
    /**
     * The brief header used to read "1,426 hours analyzed • Updated 38 mins ago".
     * Both halves were invented: the corpus is 45 hours, and nothing re-analyses
     * it on a cycle. The line is removed rather than restated - the header bar
     * already carries the real corpus size, and fetching it here would attribute
     * a live request to Consensus Monitor too, which this same file renders from
     * unified-data.js.
     */
    updateBriefMeta: function() {
        const metaElement = document.getElementById('brief-meta');
        if (metaElement) metaElement.remove();
    },

    updateValueIndicators: function(data) {
        const container = document.getElementById('value-indicators');
        if (!container) return;
        
        // Clear existing content
        container.innerHTML = '';
        
        // Count key trends (consensus + contrarian + blindspots)
        let trendCount = 0;
        if (data && data.intelligenceBrief && data.intelligenceBrief.summary && data.intelligenceBrief.summary.expanded) {
            const expanded = data.intelligenceBrief.summary.expanded;
            trendCount = (expanded.consensus || []).length + 
                        (expanded.contrarian || []).length + 
                        (expanded.blindspots || []).length;
        }
        
        // Count action items with defensive check
        let actionCount = 0;
        if (data && data.weeklyBrief && data.weeklyBrief.actionItems) {
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
    
    toggleInfluenceThumbnails: function(enable) {
        this.thumbnailsEnabled = enable !== undefined ? enable : !this.thumbnailsEnabled;
        
        const thumbnails = document.querySelectorAll('#influence-metrics-list .influence-thumbnail');
        
        if (this.thumbnailsEnabled) {
            // Show thumbnails
            thumbnails.forEach(thumb => {
                thumb.style.display = 'flex';
            });
            
            // Add class for proper spacing
            document.querySelectorAll('#influence-metrics-list .influence-item').forEach(item => {
                item.classList.add('has-thumbnail');
            });
        } else {
            // Hide thumbnails
            thumbnails.forEach(thumb => {
                thumb.style.display = 'none';
            });
            
            // Remove spacing class
            document.querySelectorAll('#influence-metrics-list .influence-item').forEach(item => {
                item.classList.remove('has-thumbnail');
            });
        }
        
        return this.thumbnailsEnabled;
    },
    
    animateInfluenceMetrics: function() {
        // Rendering and animation for this section live in influence-metrics.js
        if (window.InfluenceMetrics) {
            window.InfluenceMetrics.animate();
        }
    },
    
    bindEvents: function() {
        const toggleBtn = this.container.querySelector('[data-action="toggleBrief"]');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleBrief());
        }
        
        // Main Download button
        const downloadBtn = this.container.querySelector('[data-action="downloadBrief"]');
        console.log('Download button found:', downloadBtn);
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                console.log('Download button clicked');
                e.preventDefault();
                e.stopPropagation();
                this.downloadPDF();
            });
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
        console.log('downloadPDF called');
        // Open the weekly brief HTML in a new tab
        const url = 'pdf/weekly-brief.html';
        console.log('Opening URL:', url);
        window.open(url, '_blank');
    },
    
    emailBrief: function() {
        // Get current date for the subject line
        const today = new Date();
        const weekNum = Math.ceil(((today - new Date(today.getFullYear(), 0, 1)) / 86400000 + 1) / 7);
        const monthNames = ["January", "February", "March", "April", "May", "June", 
                          "July", "August", "September", "October", "November", "December"];
        const month = monthNames[today.getMonth()];
        const year = today.getFullYear();
        
        // Get data from unified data source with defensive checks
        const data = window.unifiedData || {};
        const brief = data.intelligenceBrief || {};
        const meta = data.meta || { analysis: { hoursAnalyzed: 0, podcastsTracked: 0 } };
        
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
        
        // Get data from unified data source with defensive checks
        const data = window.unifiedData || {};
        const brief = data.intelligenceBrief || {};
        
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
    
    updateConsensusMonitor: function(timeRange, animate = true) {
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
            
            // Add data-topic attribute for clickable topics
            const clickableAttr = (item.label === 'Defense Tech') ? 
                `data-topic="${item.label}" role="button" tabindex="0" style="cursor: pointer;" title="Click for details"` : '';
            
            consensusItem.innerHTML = `
                <span class="influence-name" ${clickableAttr}>${item.label}</span>
                <div class="influence-bar-container">
                    <div class="influence-bar ${levelClass}" 
                         role="progressbar" 
                         aria-valuenow="0" 
                         aria-valuemin="0" 
                         aria-valuemax="100" 
                         style="width: 0%;">
                        <span class="consensus-tooltip">${this.getQualitativeLabel(item.percentage)}</span>
                    </div>
                </div>
            `;
            
            consensusContainer.appendChild(consensusItem);
            
            // Store percentage for animation
            const bar = consensusItem.querySelector('.influence-bar');
            bar.dataset.percentage = item.percentage;
            
            // Animate immediately if requested (for time range changes)
            if (animate && this.animatedSections.has('consensus-monitor-section')) {
                setTimeout(() => {
                    requestAnimationFrame(() => {
                        bar.style.width = `${item.percentage}%`;
                        bar.setAttribute('aria-valuenow', item.percentage);
                    });
                }, 50 + (index * 150));
            }
        });
    },
    
    animateConsensusMonitor: function() {
        const bars = document.querySelectorAll('.consensus-monitor-container .influence-bar');
        bars.forEach((bar, index) => {
            const percentage = bar.dataset.percentage;
            setTimeout(() => {
                requestAnimationFrame(() => {
                    bar.style.width = `${percentage}%`;
                    bar.setAttribute('aria-valuenow', percentage);
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
    
    getQualitativeLabel: function(percentage) {
        // Map percentage ranges to qualitative consensus descriptions
        if (percentage >= 80) return 'Strong consensus';
        if (percentage >= 60) return 'Building consensus';
        if (percentage >= 40) return 'Mixed signals';
        if (percentage >= 20) return 'Limited consensus';
        return 'Weak signals';
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
        path.setAttribute('class', 'sparkline-path');
        
        svg.appendChild(path);
        
        // Add a title element for better tooltip on hover
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `Daily trend: ${data.join(', ')}`;
        svg.appendChild(title);
        
        return svg.outerHTML;
    },

    updateVelocityTracking: function(animate = true) {
        // Velocity Tracking is rendered by
        // features/intelligence-brief/velocity-tracking.js from
        // GET /api/topic-mentions. Kept as a no-op for the callers in init.js.
    },
    
    updateInfluenceMetrics: function() {
        // Kept for compatibility. Influence Metrics is rendered by
        // features/intelligence-brief/influence-metrics.js from /api/entities.
    },
    
    animateSparklines: function() {
        // Rendering and animation for this section live in velocity-tracking.js
        if (window.VelocityTracking) {
            window.VelocityTracking.animate();
        }
    },
    
    animateVelocityPercentages: function() {
        const percentageElements = document.querySelectorAll('.velocity-change');
        
        percentageElements.forEach((element, index) => {
            const targetValue = parseInt(element.dataset.value);
            const isPositive = element.dataset.positive === 'true';
            const percentSpan = element.querySelector('.velocity-percentage');
            
            if (!percentSpan) return;
            
            // Animate after row stagger
            setTimeout(() => {
                const duration = 1200; // 1.2s to match sparkline animation
                const startTime = performance.now();
                
                const animateCount = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Ease out cubic for smooth deceleration
                    const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                    const currentValue = Math.round(targetValue * easeOutCubic);
                    
                    percentSpan.textContent = (isPositive ? '+' : '-') + currentValue;
                    
                    if (progress < 1) {
                        requestAnimationFrame(animateCount);
                    }
                };
                
                requestAnimationFrame(animateCount);
            }, index * 100); // Stagger by 100ms per item
        });
    },
    
    updateTopicCorrelations: function(animate = true) {
        // Topic Correlations is rendered by
        // features/intelligence-brief/topic-correlations.js from
        // GET /api/topic-correlations. Kept as a no-op for existing callers.
    },
    
    animateTopicCorrelations: function() {
        // The live section renders a single figure, nothing to animate.
    }
};

window.IntelligenceBrief = IntelligenceBrief;