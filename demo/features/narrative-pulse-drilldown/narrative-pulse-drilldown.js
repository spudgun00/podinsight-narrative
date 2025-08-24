// Narrative Pulse Drill-Down Panel Component
const NarrativePulseDrilldown = {
    // Component state
    currentTopic: null,
    panelElement: null,
    backdropElement: null,
    triggerElement: null, // For focus restoration
    focusableElements: [],
    lastFocusedElement: null,
    
    // Initialize the component
    init() {
        console.log('Initializing Narrative Pulse Drilldown...');
        this.createPanel();
        this.attachEventListeners();
    },
    
    // Create the panel DOM structure
    createPanel() {
        // Create backdrop
        this.backdropElement = document.createElement('div');
        this.backdropElement.className = 'drilldown-backdrop';
        document.body.appendChild(this.backdropElement);
        
        // Create panel
        this.panelElement = document.createElement('div');
        this.panelElement.className = 'drilldown-panel';
        this.panelElement.setAttribute('data-state', 'closed');
        this.panelElement.setAttribute('role', 'dialog');
        this.panelElement.setAttribute('aria-modal', 'true');
        this.panelElement.setAttribute('aria-labelledby', 'drilldown-title');
        
        // Panel HTML structure - matching Customize Topics panel layout
        this.panelElement.innerHTML = `
            <div class="panel-header">
                <div>
                    <h2 id="drilldown-title"></h2>
                    <p class="panel-subtitle"></p>
                </div>
                <button class="close-button" aria-label="Close panel" title="Close">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"></path>
                    </svg>
                </button>
            </div>
            
            <div class="panel-content">
                <!-- Key Drivers Section -->
                <section class="key-drivers">
                    <h3>📍 Key Drivers This Week</h3>
                    <div class="episode-drivers"></div>
                </section>
                
                <!-- Momentum Breakdown Section -->
                <section class="momentum-breakdown">
                    <h3>📊 This Week's Momentum</h3>
                    <div class="daily-progression"></div>
                </section>
                
                <!-- Consensus Status Section -->
                <section class="consensus-status-section">
                    <h3>🎯 Market Consensus</h3>
                    <div class="consensus-status"></div>
                </section>
            </div>
        `;
        
        document.body.appendChild(this.panelElement);
    },
    
    // Attach event listeners
    attachEventListeners() {
        // Use event delegation on the legend container
        // Wait for DOM to be ready
        const attachLegendListeners = () => {
            // Try both possible legend container selectors
            const legendContainer = document.querySelector('.pulse-legend') || 
                                  document.querySelector('.narrative-pulse-legend');
            
            if (legendContainer) {
                console.log('✓ Found legend container:', legendContainer.className);
                
                // Debug: Log all legend values found
                const legendValues = legendContainer.querySelectorAll('.legend-value[data-topic]');
                console.log(`Found ${legendValues.length} clickable legend values:`, 
                    Array.from(legendValues).map(el => el.getAttribute('data-topic')));
                
                // Click handler for mouse users
                legendContainer.addEventListener('click', (e) => {
                    console.log('Click event on:', e.target);
                    
                    // Check for clicks on both legend-value and legend-label
                    const legendValue = e.target.closest('.legend-value[data-topic]');
                    const legendLabel = e.target.closest('.legend-label[data-topic]');
                    
                    if (legendValue || legendLabel) {
                        const clickedElement = legendValue || legendLabel;
                        const topic = clickedElement.getAttribute('data-topic');
                        console.log('Legend clicked, topic:', topic);
                        
                        if (topic) {
                            e.preventDefault();
                            e.stopPropagation();
                            this.openPanel(topic);
                        }
                    } else {
                        console.log('Click was not on a legend-value or legend-label element');
                    }
                });
                
                // Keyboard handler for accessibility
                legendContainer.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        const legendValue = e.target.closest('.legend-value[data-topic]');
                        const legendLabel = e.target.closest('.legend-label[data-topic]');
                        
                        if (legendValue || legendLabel) {
                            e.preventDefault(); // Prevent page scroll on spacebar
                            const clickedElement = legendValue || legendLabel;
                            const topic = clickedElement.getAttribute('data-topic');
                            console.log('Keyboard activation, topic:', topic);
                            if (topic) {
                                this.openPanel(topic);
                            }
                        }
                    }
                });
                
                // Also add direct click handlers as fallback for both labels and values
                const legendLabels = legendContainer.querySelectorAll('.legend-label[data-topic]');
                [...legendValues, ...legendLabels].forEach(element => {
                    element.style.cursor = 'pointer'; // Ensure cursor is set
                    element.addEventListener('click', (e) => {
                        const topic = element.getAttribute('data-topic');
                        console.log('Direct click handler triggered for:', topic);
                        e.preventDefault();
                        e.stopPropagation();
                        this.openPanel(topic);
                    });
                });
            } else {
                console.warn('⚠ Legend container not found! Trying again in 500ms...');
                setTimeout(attachLegendListeners, 500);
            }
        };
        
        // Also attach listeners for sidebar elements (Velocity Tracking & Consensus Monitor)
        // Use document-level delegation since sidebar content is created dynamically
        const attachSidebarListeners = () => {
            console.log('✓ Attaching sidebar Defense Tech listeners via delegation');
            
            // Add click listener at document level for sidebar Defense Tech items
            document.addEventListener('click', (e) => {
                // Check if clicked element is Defense Tech in sidebar
                const defenseLabel = e.target.closest('.synthesis-sidebar .influence-name[data-topic="Defense Tech"]');
                
                if (defenseLabel) {
                    console.log('Sidebar Defense Tech clicked');
                    e.preventDefault();
                    e.stopPropagation();
                    this.openPanel('Defense Tech');
                }
            });
            
            // Keyboard support
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const defenseLabel = e.target.closest('.synthesis-sidebar .influence-name[data-topic="Defense Tech"]');
                    
                    if (defenseLabel) {
                        e.preventDefault();
                        console.log('Sidebar Defense Tech keyboard activation');
                        this.openPanel('Defense Tech');
                    }
                }
            });
        };
        
        // Try to attach immediately and also on DOM ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                attachLegendListeners();
                attachSidebarListeners();
            });
        } else {
            attachLegendListeners();
            attachSidebarListeners();
        }
        
        // Close button
        const closeButton = this.panelElement.querySelector('.close-button');
        closeButton.addEventListener('click', () => this.closePanel());
        
        // Backdrop click to close
        this.backdropElement.addEventListener('click', () => this.closePanel());
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panelElement.getAttribute('data-state') === 'open') {
                this.closePanel();
            }
        });
    },
    
    // Open the panel with topic data
    openPanel(topicName) {
        console.log('Opening drilldown panel for:', topicName);
        
        // Store trigger element for focus restoration
        this.triggerElement = document.activeElement;
        
        // Get topic data
        const topicData = window.unifiedData?.narrativePulse?.topics?.[topicName];
        
        if (!topicData) {
            console.error('No data found for topic:', topicName);
            return;
        }
        
        this.currentTopic = topicName;
        
        // Get current timeframe from Narrative Pulse component
        const timeframe = this.getCurrentTimeframe();
        
        // Render content with timeframe
        this.renderHeader(topicName, topicData, timeframe);
        this.renderEpisodeDrivers(topicName);
        this.renderMomentumBreakdown(topicData);
        this.renderConsensusStatus(topicData);
        
        // Show panel
        this.backdropElement.classList.add('active');
        this.panelElement.setAttribute('data-state', 'open');
        
        // Focus management
        this.trapFocus();
        
        // Prevent body scroll on mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
    },
    
    // Close the panel
    closePanel() {
        console.log('Closing drilldown panel');
        
        // Stop any playing audio
        if (this.currentPlayback.button) {
            this.stopPlayback(this.currentPlayback.button);
        }
        
        // Hide panel
        this.backdropElement.classList.remove('active');
        this.panelElement.setAttribute('data-state', 'closed');
        
        // Remove focus trap
        this.removeFocusTrap();
        
        // Clear focus from legend items to prevent persistent outline
        const focusedLegendElements = document.querySelectorAll('.legend-item [tabindex]:focus, .legend-item:focus-within [tabindex]');
        focusedLegendElements.forEach(el => el.blur());
        
        // Don't restore focus to trigger element to avoid persistent outline
        // Just clear the reference
        this.triggerElement = null;
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Clear any return state
        if (window.drilldownReturnState) {
            delete window.drilldownReturnState;
        }
        
        this.currentTopic = null;
    },
    
    // Restore panel when returning from Priority Briefing
    restorePanel() {
        console.log('Restoring drilldown panel');
        
        // Show the panel again
        this.panelElement.style.display = '';
        this.backdropElement.style.display = '';
        this.backdropElement.classList.add('active');
        this.panelElement.setAttribute('data-state', 'open');
        
        // Restore focus trap
        this.trapFocus();
        
        // Prevent body scroll on mobile
        if (window.innerWidth <= 768) {
            document.body.style.overflow = 'hidden';
        }
    },
    
    // Get current timeframe from Narrative Pulse component
    getCurrentTimeframe() {
        // Try to get the active time control button from Narrative Pulse
        const activeTimeButton = document.querySelector('.time-controls button.active');
        if (activeTimeButton) {
            const timeText = activeTimeButton.textContent.trim();
            // Return the text as is (e.g., "7 days", "30 days", "90 days")
            return timeText;
        }
        
        // Default to 7 days if no active button found
        return '7 days';
    },
    
    // Render header section matching Customize Topics panel format
    renderHeader(topicName, topicData, timeframe = '7 days') {
        const titleElement = this.panelElement.querySelector('#drilldown-title');
        const subtitleElement = this.panelElement.querySelector('.panel-subtitle');
        
        // Set title
        titleElement.textContent = topicName;
        
        // Format subtitle with performance and mentions (matching Customize Topics format)
        const momentum = topicData.momentum || '+0%';
        const mentions = topicData.mentions || 0;
        const episodes = topicData.episodes || 0;
        
        // Format: "+111% (7 days) • 178 mentions across 24 episodes"
        subtitleElement.innerHTML = `
            <span class="topic-momentum ${momentum.startsWith('+') ? 'positive' : momentum.startsWith('-') ? 'negative' : ''}">${momentum} (${timeframe})</span>
            <span> • ${mentions} mentions across ${episodes} episodes</span>
        `;
    },
    
    // Render episode drivers section
    renderEpisodeDrivers(topicName) {
        const container = this.panelElement.querySelector('.episode-drivers');
        
        // Get hardcoded demo episodes for this topic
        const episodes = window.unifiedData?.drilldownEpisodes?.[topicName] || [];
        
        if (!episodes.length) {
            container.innerHTML = `
                <div class="empty-state">
                    Demo episodes coming soon for ${topicName}.
                </div>
            `;
            return;
        }
        
        container.innerHTML = episodes.map(episode => `
            <div class="episode-driver-card" data-episode-id="${episode.id}" data-podcast="${episode.podcast}">
                <div class="episode-meta">
                    <span class="podcast-badge">${episode.podcast.replace(' Podcast', '')}</span>
                    <span class="separator">•</span>
                    <span class="time-ago">${episode.timeAgo}</span>
                    <span class="separator">•</span>
                    <span class="mentions-count">${episode.mentions} mentions</span>
                </div>
                <h4 class="episode-title">${episode.title}</h4>
                <div class="key-quote">
                    <div class="quote-content">
                        <button class="play-button-inline" data-episode-id="${episode.id}" aria-label="Play quote" title="Play quote">
                            <svg viewBox="0 0 10 10">
                                <path class="icon-play" d="M2 1 L2 9 L8 5 Z"/>
                                <g class="icon-pause" style="display: none;">
                                    <rect x="2" y="2" width="2" height="6" />
                                    <rect x="6" y="2" width="2" height="6" />
                                </g>
                            </svg>
                        </button>
                        <div class="quote-body">
                            <span class="quote-text">"${episode.quote}"</span>
                            <span class="quote-author">${episode.guest}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Add click handlers to cards to open Priority Briefings
        container.querySelectorAll('.episode-driver-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't trigger if clicking the play button or quote area
                if (e.target.closest('.play-button-inline') || e.target.closest('.key-quote')) {
                    return;
                }
                
                const podcastName = card.getAttribute('data-podcast');
                const episodeId = card.getAttribute('data-episode-id');
                
                // Don't close the panel - keep it open in background
                // Just hide it temporarily
                this.panelElement.style.display = 'none';
                this.backdropElement.style.display = 'none';
                
                // Store state that we came from drill-down
                window.drilldownReturnState = {
                    isOpen: true,
                    topic: this.currentTopic,
                    source: 'drilldown'
                };
                
                // Find and click the corresponding Priority Briefing card
                // Look for a briefing card from the same podcast
                const briefingCards = document.querySelectorAll('.briefing-card');
                let foundCard = null;
                
                briefingCards.forEach(briefingCard => {
                    const podcastBadge = briefingCard.querySelector('.podcast-badge');
                    if (podcastBadge && podcastBadge.textContent.includes(podcastName.replace(' Podcast', ''))) {
                        foundCard = briefingCard;
                    }
                });
                
                if (foundCard) {
                    // Trigger the view brief button click
                    const viewBriefBtn = foundCard.querySelector('.view-brief-btn');
                    if (viewBriefBtn) {
                        viewBriefBtn.click();
                    }
                } else {
                    // If no matching briefing found, show a message
                    console.log(`No Priority Briefing found for ${podcastName}`);
                    // Restore the panel if nothing was found
                    this.panelElement.style.display = '';
                    this.backdropElement.style.display = '';
                }
            });
        });
        
        // Add play button listeners for inline buttons
        container.querySelectorAll('.play-button-inline').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const episodeId = button.getAttribute('data-episode-id');
                this.playEpisodeExcerpt(episodeId);
            });
        });
        
        // Make entire quote clickable
        container.querySelectorAll('.key-quote').forEach(quoteElement => {
            quoteElement.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click from triggering
                
                // Don't trigger if clicking the play button itself
                if (e.target.closest('.play-button-inline')) return;
                
                // Find the play button within this quote
                const playButton = quoteElement.querySelector('.play-button-inline');
                if (playButton) {
                    const episodeId = playButton.getAttribute('data-episode-id');
                    this.playEpisodeExcerpt(episodeId);
                }
            });
        });
    },
    
    // Render momentum breakdown section
    renderMomentumBreakdown(topicData) {
        const container = this.panelElement.querySelector('.daily-progression');
        
        const chartData = topicData.chartData?.['7d'];
        if (!chartData || !chartData.quotes) {
            container.innerHTML = '<div class="empty-state">No momentum data available.</div>';
            return;
        }
        
        const dates = Object.keys(chartData.quotes);
        const volumes = chartData.volume?.dataPoints || [];
        const peakIndex = volumes.indexOf(Math.max(...volumes));
        
        container.innerHTML = dates.map((date, index) => {
            const isPeak = index === peakIndex;
            const currentVolume = volumes[index] || 0;
            const prevVolume = volumes[index - 1] || currentVolume;
            let arrow = '↑'; // Default up arrow
            if (currentVolume < prevVolume) arrow = '↓';
            else if (currentVolume === prevVolume) arrow = '→';
            
            return `
                <div class="progression-item ${isPeak ? 'progression-peak' : ''}">
                    <div class="day-label">${date}</div>
                    <div class="day-metrics">
                        <span>${currentVolume}</span>
                        <span style="color: ${arrow === '↑' ? 'var(--sage)' : arrow === '↓' ? 'var(--dusty-rose)' : 'var(--gray-400)'};">${arrow}</span>
                        ${isPeak ? '<span style="color: var(--amber-glow); font-size: 10px;">Peak</span>' : ''}
                    </div>
                    <div class="day-insight">${chartData.quotes[date]}</div>
                </div>
            `;
        }).join('');
    },
    
    // Render consensus status section
    renderConsensusStatus(topicData) {
        const container = this.panelElement.querySelector('.consensus-status');
        
        const consensusLevel = topicData.consensusLevel || 'Unknown';
        let badgeClass = 'building';
        let description = '';
        
        // Parse consensus level
        if (consensusLevel.includes('Strong') || consensusLevel.includes('85%')) {
            badgeClass = 'strong';
            description = 'The market has reached strong consensus on this narrative.';
        } else if (consensusLevel.includes('Building') || consensusLevel.includes('70%')) {
            badgeClass = 'building';
            description = 'Market consensus is building around this theme.';
        } else if (consensusLevel.includes('Mixed') || consensusLevel.includes('Contested')) {
            badgeClass = 'contested';
            description = 'Views remain divided on this topic across the ecosystem.';
        }
        
        container.innerHTML = `
            <div class="consensus-badge ${badgeClass}">${consensusLevel}</div>
            <div class="consensus-description">${description}</div>
        `;
    },
    
    // Get episodes for a specific topic
    getEpisodesForTopic(topicName) {
        const episodes = window.unifiedData?.priorityBriefings?.items || [];
        
        // Map topic names to possible tag variations
        const topicMappings = {
            'AI Infrastructure': ['AI Infrastructure', 'AI Infra', 'Infrastructure'],
            'Enterprise Agents': ['Enterprise Agents', 'AI Agents', 'Agents'],
            'Defense Tech': ['Defense Tech', 'Defense', 'National Security'],
            'Exit Strategies': ['Exit Strategies', 'M&A', 'IPO'],
            'Vertical AI': ['Vertical AI', 'Vertical SaaS', 'Industry AI']
        };
        
        const searchTags = topicMappings[topicName] || [topicName];
        
        // Filter episodes that have matching tags
        return episodes.filter(episode => {
            if (!episode.tags) return false;
            return episode.tags.some(tag => 
                searchTags.some(searchTag => 
                    tag.toLowerCase().includes(searchTag.toLowerCase())
                )
            );
        });
    },
    
    // Simulated audio playback state
    currentPlayback: {
        button: null,
        timeoutId: null,
        progressOverlay: null
    },
    
    // Play episode excerpt with simulated visual feedback
    playEpisodeExcerpt(episodeId) {
        console.log('Playing episode excerpt:', episodeId);
        
        // Find the inline button that was clicked
        const button = this.panelElement.querySelector(`.play-button-inline[data-episode-id="${episodeId}"]`);
        if (!button) return;
        
        // If this button is already playing, stop it
        if (button.classList.contains('is-playing')) {
            this.stopPlayback(button);
        } else {
            this.startPlayback(button);
        }
    },
    
    // Start simulated playback with circular progress
    startPlayback(button) {
        // Stop any currently playing excerpt
        if (this.currentPlayback.button && this.currentPlayback.button !== button) {
            this.stopPlayback(this.currentPlayback.button);
        }
        
        // Set this button as currently playing
        this.currentPlayback.button = button;
        const playPath = button.querySelector('.icon-play');
        const pauseGroup = button.querySelector('.icon-pause');
        
        // Update button visual state
        button.classList.add('is-playing');
        if (playPath) playPath.style.display = 'none';
        if (pauseGroup) pauseGroup.style.display = 'block';
        button.setAttribute('aria-label', 'Pause quote');
        
        // Fixed duration to match Episode Panel
        const duration = 15000; // 15 seconds demo duration (same as Episode Panel)
        
        // Auto-stop after duration
        this.currentPlayback.timeoutId = setTimeout(() => {
            this.stopPlayback(button);
        }, duration);
    },
    
    // Stop simulated playback
    stopPlayback(button) {
        if (!button) return;
        
        const playPath = button.querySelector('.icon-play');
        const pauseGroup = button.querySelector('.icon-pause');
        
        // Clear timeout if this was the playing button
        if (this.currentPlayback.timeoutId && this.currentPlayback.button === button) {
            clearTimeout(this.currentPlayback.timeoutId);
            this.currentPlayback.timeoutId = null;
        }
        
        // Reset button visual state
        button.classList.remove('is-playing');
        if (playPath) playPath.style.display = 'block';
        if (pauseGroup) pauseGroup.style.display = 'none';
        button.setAttribute('aria-label', 'Play quote');
        
        // Clear current playback reference if this was the one playing
        if (this.currentPlayback.button === button) {
            this.currentPlayback.button = null;
            this.currentPlayback.progressOverlay = null;
        }
    },
    
    // Focus management for accessibility
    trapFocus() {
        // Get all focusable elements in the panel
        const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        this.focusableElements = Array.from(this.panelElement.querySelectorAll(focusableSelectors));
        
        if (this.focusableElements.length === 0) return;
        
        // Focus first element (close button)
        this.focusableElements[0].focus();
        
        // Add tab trap listener
        this.handleTabKey = (e) => {
            if (e.key !== 'Tab') return;
            
            const firstElement = this.focusableElements[0];
            const lastElement = this.focusableElements[this.focusableElements.length - 1];
            
            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };
        
        document.addEventListener('keydown', this.handleTabKey);
    },
    
    // Remove focus trap
    removeFocusTrap() {
        if (this.handleTabKey) {
            document.removeEventListener('keydown', this.handleTabKey);
            this.handleTabKey = null;
        }
        this.focusableElements = [];
    }
};

// Export for use in other modules
window.NarrativePulseDrilldown = NarrativePulseDrilldown;