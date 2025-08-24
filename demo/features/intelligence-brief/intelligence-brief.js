const IntelligenceBrief = {
    init: function(container) {
        this.container = container;
        this.animatedSections = new Set(); // Track which sections have animated
        this.thumbnailsEnabled = true; // Track thumbnail visibility state
        this.bindEvents();
        this.setupTimeRangeListener();
        this.setupIntersectionObserver(); // Set up visibility-based animations
        
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
        
        // Update header meta information
        if (data.meta) {
            this.updateBriefMeta(data.meta);
        }
        
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
    
    populateInfluenceMetrics: function(metrics) {
        const listElement = document.getElementById('influence-metrics-list');
        if (!listElement || !metrics || !Array.isArray(metrics)) return;
        
        listElement.innerHTML = '';
        
        // Podcast thumbnail mapping - paths relative to demo.html
        const PODCAST_THUMBNAILS = {
            'all-in podcast': 'images/allin.png',
            '20vc': 'images/20vc.jpeg',
            'bg2pod': 'images/bg2.png',
            'invest like best': 'images/investlikethebest.jpeg',
            'acquired': 'images/acquired.jpeg',
            'the logan bartlett show': 'images/loganbartlett.jpg',
            'stratechery': 'images/stratechery.jpeg',
            'the information': 'images/information.jpg',
            'khosla ventures podcast': 'images/kv.png',
            'indie hackers': 'images/indiehackers.png'
        };
        
        // Fallback colors using the platform's warm editorial palette
        const FALLBACK_COLORS = ['#4a7c59', '#c77d7d', '#f4a261', '#5a6c8c'];
        
        metrics.forEach((metric, index) => {
            const influenceItem = document.createElement('div');
            influenceItem.className = 'influence-item influence-metric-item';
            
            // Extract percentage from score string (e.g., "High (97)" -> 97)
            let percentage = 0;
            const scoreMatch = metric.score.match(/\((\d+)\)/);
            if (scoreMatch) {
                percentage = parseInt(scoreMatch[1], 10);
            }
            
            // Get thumbnail URL for this podcast
            const podcastKey = metric.name.toLowerCase();
            const thumbnailUrl = PODCAST_THUMBNAILS[podcastKey];
            
            // Create thumbnail element
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.className = 'influence-thumbnail';
            thumbnailDiv.setAttribute('aria-hidden', 'true');
            
            if (thumbnailUrl) {
                // Try to load the image
                const img = new Image();
                img.src = thumbnailUrl;
                
                img.onload = () => {
                    thumbnailDiv.style.backgroundImage = `url(${thumbnailUrl})`;
                    
                    // Adjust sizing for logos with built-in padding (relative to 23px base)
                    const podcastKey = metric.name.toLowerCase();
                    if (podcastKey === 'the logan bartlett show') {
                        thumbnailDiv.style.backgroundSize = '135%';
                        thumbnailDiv.style.backgroundPosition = 'center';
                    } else if (podcastKey === 'bg2pod') {
                        thumbnailDiv.style.backgroundSize = '115%';
                        thumbnailDiv.style.backgroundPosition = 'center';
                    }
                };
                
                img.onerror = () => {
                    // Apply fallback initial on error
                    this.applyThumbnailFallback(thumbnailDiv, metric.name, FALLBACK_COLORS);
                };
            } else {
                // No image found, apply fallback immediately
                this.applyThumbnailFallback(thumbnailDiv, metric.name, FALLBACK_COLORS);
            }
            
            influenceItem.appendChild(thumbnailDiv);
            
            // Add the rest of the content
            const nameSpan = document.createElement('span');
            nameSpan.className = 'influence-name';
            nameSpan.textContent = metric.name;
            influenceItem.appendChild(nameSpan);
            
            const barContainer = document.createElement('div');
            barContainer.className = 'influence-bar-container';
            barContainer.innerHTML = `<div class="influence-bar" data-percentage="${percentage}" style="width: 0%;"></div>`;
            influenceItem.appendChild(barContainer);
            
            const scoreSpan = document.createElement('span');
            scoreSpan.className = 'influence-score';
            scoreSpan.setAttribute('data-target', percentage);
            scoreSpan.textContent = '0%';
            influenceItem.appendChild(scoreSpan);
            
            listElement.appendChild(influenceItem);
        });
        
        // Animation will be triggered by intersection observer
    },
    
    applyThumbnailFallback: function(element, name, colors) {
        const initial = name.trim().charAt(0).toUpperCase();
        
        // Generate consistent color from name
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        const colorIndex = Math.abs(hash) % colors.length;
        const color = colors[colorIndex];
        
        element.style.backgroundColor = color;
        element.textContent = initial;
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
        const items = document.querySelectorAll('#influence-metrics-list .influence-item');
        const ROW_STAGGER_MS = 100;
        
        items.forEach((item, index) => {
            const bar = item.querySelector('.influence-bar');
            const scoreSpan = item.querySelector('.influence-score');
            const targetPercentage = parseInt(bar.dataset.percentage);
            
            // Add visible class for row appearance
            setTimeout(() => {
                item.classList.add('visible');
                
                // Animate bar width
                requestAnimationFrame(() => {
                    bar.style.width = `${targetPercentage}%`;
                });
                
                // Animate percentage counting
                if (scoreSpan) {
                    const duration = 800; // 0.8s for bar animation
                    const startTime = performance.now();
                    
                    const animateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Ease out cubic for smooth deceleration
                        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                        const currentValue = Math.round(targetPercentage * easeOutCubic);
                        
                        scoreSpan.textContent = currentValue + '%';
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateCount);
                        }
                    };
                    
                    requestAnimationFrame(animateCount);
                }
            }, 50 + (index * ROW_STAGGER_MS)); // Staggered animation
        });
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
        if (!window.unifiedData || !window.unifiedData.narrativePulse) {
            return;
        }
        
        const velocityContainer = document.getElementById('velocityTrackingList');
        if (!velocityContainer) {
            return;
        }
        
        // Get topics from narrativePulse and sort by momentum
        const topics = window.unifiedData.narrativePulse.topics;
        const sortedTopics = Object.entries(topics)
            .sort((a, b) => {
                // Parse momentum percentages for sorting
                const momentumA = parseInt(a[1].momentum.replace('%', '').replace('+', '')) || 0;
                const momentumB = parseInt(b[1].momentum.replace('%', '').replace('+', '')) || 0;
                // Sort by absolute value of momentum (highest first)
                return Math.abs(momentumB) - Math.abs(momentumA);
            })
            .slice(0, 7); // Show top 7 topics
        
        // Generate HTML for velocity items
        const velocityHTML = sortedTopics.map(([topicName, topicData]) => {
            const momentum = topicData.momentum;
            const isPositive = !momentum.startsWith('-');
            const changeClass = isPositive ? 'positive' : 'negative';
            const changeSymbol = isPositive ? '↑' : '↓';
            const colorClass = isPositive ? 'trend-up' : 'trend-down';
            
            // Get real sparkline data
            const sparklineData = this.getTopicSparklineData(topicName);
            let sparklineSVG = '';
            
            if (sparklineData && sparklineData.length > 0) {
                sparklineSVG = this.renderSparkline(sparklineData, isPositive);
            } else {
                sparklineSVG = '<span class="sparkline-placeholder" style="display: inline-block; width: 45px;"></span>';
            }
            
            // Extract numeric value for animation
            const percentValue = parseInt(momentum.replace('%', '').replace('+', '').replace('-', ''));
            
            // Add data-topic attribute for clickable topics
            const clickableAttr = (topicName === 'Defense Tech') ? 
                `data-topic="${topicName}" role="button" tabindex="0" style="cursor: pointer;" title="Click for details"` : '';
            
            return `
                <div class="influence-item velocity-item">
                    <span class="influence-name" ${clickableAttr}>${topicName}</span>
                    ${sparklineSVG}
                    <span class="velocity-change ${colorClass}" 
                          data-value="${percentValue}" 
                          data-positive="${isPositive}" 
                          style="font-weight: 600; color: ${isPositive ? 'var(--sage)' : 'var(--dusty-rose)'};">
                        ${changeSymbol} <span class="velocity-percentage">0</span>%
                    </span>
                </div>
            `;
        }).join('');
        
        velocityContainer.innerHTML = velocityHTML;
        
        // Only animate if section is already visible (for updates)
        if (animate && this.animatedSections.has('velocity-tracking-section')) {
            this.animateSparklines();
        }
    },
    
    updateInfluenceMetrics: function() {
        // This function is now handled by populateInfluenceMetrics
        // Called during initialization to maintain compatibility
        // No need to animate here as populateInfluenceMetrics handles it
    },
    
    animateSparklines: function() {
        const velocityItems = document.querySelectorAll('.velocity-item');
        const ROW_STAGGER_MS = 100; // Delay between each row appearing
        const SPARKLINE_DELAY_MS = 200; // Delay before sparklines start drawing
        
        // First, animate rows appearing
        velocityItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * ROW_STAGGER_MS);
        });
        
        // Then animate sparklines
        const sparklines = document.querySelectorAll('.velocity-sparkline path');
        sparklines.forEach((path, index) => {
            if (!path) return;
            
            // Calculate the total length of the path
            const length = path.getTotalLength();
            
            // Set initial state - path is invisible
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.transition = 'none';
            
            // Force browser to recalculate styles
            path.getBoundingClientRect();
            
            // Trigger animation after staggered delay
            setTimeout(() => {
                path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.42, 0, 0.58, 1)';
                path.style.strokeDashoffset = '0';
            }, SPARKLINE_DELAY_MS + (index * ROW_STAGGER_MS));
        });
        
        // Finally, animate percentages counting up
        setTimeout(() => {
            this.animateVelocityPercentages();
        }, SPARKLINE_DELAY_MS);
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
                    <text x="50" y="55" text-anchor="middle" fill="#1a1a2e" font-size="16" font-weight="600" 
                          class="pie-percentage" data-target="${item.percentage}">0%</text>
                </svg>
                <span class="pie-label">${formattedLabel}</span>
            `;
            
            container.appendChild(chartDiv);
            
            // Store animation data
            const progressCircle = chartDiv.querySelector('.progress-circle');
            if (progressCircle) {
                progressCircle.dataset.filledLength = filledLength;
                progressCircle.dataset.emptyLength = emptyLength;
            }
            
            // Animate immediately if requested (for updates)
            if (animate && this.animatedSections.has('topic-correlations-section')) {
                setTimeout(() => {
                    if (progressCircle) {
                        requestAnimationFrame(() => {
                            progressCircle.setAttribute('stroke-dasharray', `${filledLength} ${emptyLength}`);
                            chartDiv.classList.add('animated');
                        });
                    }
                }, 50 + (index * 200));
            }
        });
    },
    
    animateTopicCorrelations: function() {
        const charts = document.querySelectorAll('#topicCorrelationsContainer .mini-pie-chart');
        const ROW_STAGGER_MS = 150; // Delay between each pie chart
        
        charts.forEach((chartDiv, index) => {
            const progressCircle = chartDiv.querySelector('.progress-circle');
            const percentText = chartDiv.querySelector('.pie-percentage');
            
            // Add cascading appearance effect
            setTimeout(() => {
                chartDiv.classList.add('visible');
                
                if (progressCircle) {
                    const filledLength = progressCircle.dataset.filledLength;
                    const emptyLength = progressCircle.dataset.emptyLength;
                    
                    // Animate circle fill
                    requestAnimationFrame(() => {
                        progressCircle.setAttribute('stroke-dasharray', `${filledLength} ${emptyLength}`);
                        chartDiv.classList.add('animated');
                    });
                }
                
                // Animate percentage counting
                if (percentText) {
                    const targetValue = parseInt(percentText.dataset.target);
                    const duration = 1200; // 1.2s to match circle animation
                    const startTime = performance.now();
                    
                    const animateCount = (currentTime) => {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        // Ease out cubic for smooth deceleration
                        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
                        const currentValue = Math.round(targetValue * easeOutCubic);
                        
                        percentText.textContent = currentValue + '%';
                        
                        if (progress < 1) {
                            requestAnimationFrame(animateCount);
                        }
                    };
                    
                    requestAnimationFrame(animateCount);
                }
            }, 50 + (index * ROW_STAGGER_MS)); // Stagger animations
        });
    }
};

window.IntelligenceBrief = IntelligenceBrief;