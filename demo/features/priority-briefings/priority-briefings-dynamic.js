// Priority Briefings - Dynamic version that reads from unified data
const PriorityBriefings = {
    init: function(container) {
        this.container = container;
        
        // Get data from unified data
        const briefingsData = window.unifiedData?.priorityBriefings?.items || [];
        if (!briefingsData.length) {
            console.error('Priority Briefings: No data found in unifiedData');
            return;
        }
        
        // Generate HTML from data
        this.generateHTML(briefingsData);
        
        // Add click handler for "ALL BRIEFINGS" link
        const viewAllLink = container.querySelector('#view-all-briefings');
        
        if (viewAllLink) {
            viewAllLink.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Open Episode Library overlay
                if (window.EpisodeLibrary && window.EpisodeLibrary.open) {
                    try {
                        window.EpisodeLibrary.open();
                    } catch (error) {
                        console.error('Priority Briefings: Error opening Episode Library:', error);
                    }
                } else {
                    // Try again after a delay
                    setTimeout(() => {
                        if (window.EpisodeLibrary && window.EpisodeLibrary.open) {
                            window.EpisodeLibrary.open();
                        } else {
                            alert('Episode Library is not yet loaded. Please try again in a moment.');
                        }
                    }, 500);
                }
            });
            
            viewAllLink.style.cursor = 'pointer';
            viewAllLink.style.textDecoration = 'underline';
        } else {
            console.error('Priority Briefings: ALL BRIEFINGS link not found!');
        }
        
        // Initialize interactive elements
        let grid = container.querySelector('.briefings-list.episode-grid, .episode-grid, .briefings-list');
        const showMoreBtn = container.querySelector('.show-more-btn');
        const btnText = container.querySelector('.btn-text');
        const btnIcon = container.querySelector('.btn-icon svg');
        const filterSelect = container.querySelector('#podcast-filter');
        const noResultsMsg = container.querySelector('.no-results-message');
        
        // Defensive checks
        if (!grid || !showMoreBtn) {
            console.error('Priority Briefings: Required elements not found');
            return;
        }
        
        // Initialize variables
        let currentState = 'collapsed';
        let currentFilter = 'curated';
        let isFiltering = false;
        const allCards = Array.from(grid.querySelectorAll('.episode-card'));
        
        // Extract unique podcasts for filter dropdown
        if (filterSelect) {
            this.populateFilterOptions(briefingsData, filterSelect);
        }
        
        // Remove initial state classes
        grid.classList.remove('show-partial', 'show-expanded');
        
        // Filter functionality (only if dropdown exists)
        if (filterSelect) {
            // Normalize strings for reliable comparison (handles hidden characters)
            function normalizeStringForComparison(str) {
                if (!str) return '';
                return str
                    .replace(/[\s\u00A0]+/g, ' ')  // Replace ALL whitespace including non-breaking spaces with single space
                    .normalize('NFC')               // Normalize Unicode characters to canonical form
                    .toLowerCase()                  // Convert to lowercase
                    .trim();                        // Trim leading/trailing spaces
            }
            
            // Filter matching function
            function filterMatches(card, filter) {
                if (filter === 'all') return true;
                if (filter === 'curated') {
                    // Show only first 3 cards (those with portfolio mentions)
                    return allCards.slice(0, 3).includes(card);
                }
                
                // Get podcast name safely
                const nameElement = card.querySelector('.podcast-name');
                if (!nameElement) {
                    return false;
                }
                
                const podcastName = nameElement.textContent.trim();
                
                // Case-insensitive comparison with proper normalization
                const normalizedPodcast = normalizeStringForComparison(podcastName);
                const normalizedFilter = normalizeStringForComparison(filter);
                
                return normalizedPodcast === normalizedFilter;
            }
            
            // Store original order for restoration
            const originalOrder = Array.from(allCards);
            
            // Apply filter with DOM reordering
            function applyFilter() {
                if (isFiltering) return;
                isFiltering = true;
                
                // Add transition class
                allCards.forEach(card => card.classList.add('filtering'));
                
                // Wait for DOM update
                setTimeout(() => {
                    let visibleCards = [];
                    
                    // When filtering is active, we'll use a completely different approach
                    if (currentFilter !== 'all' && currentFilter !== 'curated') {
                        // NUCLEAR OPTION: Create a completely new grid container
                        const newGrid = document.createElement('div');
                        newGrid.className = 'briefings-list episode-grid-filtered'; // Different class name!
                        
                        // Process cards
                        allCards.forEach((card, index) => {
                            const shouldShow = filterMatches(card, currentFilter);
                            
                            if (shouldShow) {
                                // Clone the card to break all CSS inheritance
                                const cardClone = card.cloneNode(true);
                                cardClone.classList.remove('filtered-out', 'filtering');
                                cardClone.classList.add('filter-visible');
                                visibleCards.push(cardClone);
                                newGrid.appendChild(cardClone);
                            }
                        });
                        
                        // Replace the old grid with the new one
                        grid.parentNode.replaceChild(newGrid, grid);
                        grid = newGrid; // Update reference
                        
                        // Store original grid reference for restoration
                        if (!container._originalGrid) {
                            container._originalGrid = document.querySelector('.briefings-list.episode-grid');
                        }
                        
                    } else {
                        // For 'all' or 'curated', we need to restore the original grid
                        
                        // Check if we have a filtered grid that needs to be replaced
                        const currentGrid = container.querySelector('.episode-grid-filtered');
                        if (currentGrid) {
                            // Create the original grid structure
                            const originalGrid = document.createElement('div');
                            originalGrid.className = 'briefings-list episode-grid';
                            
                            // Restore all original cards
                            if (currentFilter === 'all') {
                                // Sort alphabetically for 'all'
                                const sorted = Array.from(allCards).sort((a, b) => {
                                    const nameA = a.querySelector('.podcast-name')?.textContent.trim() || '';
                                    const nameB = b.querySelector('.podcast-name')?.textContent.trim() || '';
                                    return nameA.localeCompare(nameB);
                                });
                                sorted.forEach(card => {
                                    card.classList.remove('filtered-out', 'filtering', 'filter-visible');
                                    visibleCards.push(card);
                                    originalGrid.appendChild(card);
                                });
                            } else {
                                // Restore original order for 'curated' - only show first 3
                                originalOrder.forEach((card, index) => {
                                    card.classList.remove('filtered-out', 'filtering', 'filter-visible');
                                    if (index < 3) {
                                        visibleCards.push(card);
                                    }
                                    originalGrid.appendChild(card);
                                });
                                // Reset to collapsed state to ensure nth-child rules work
                                currentState = 'collapsed';
                            }
                            
                            // Replace filtered grid with original
                            currentGrid.parentNode.replaceChild(originalGrid, currentGrid);
                            grid = originalGrid;
                        } else {
                            // Normal restoration if not using filtered grid
                            grid.classList.remove('filter-active');
                            const fragment = document.createDocumentFragment();
                            
                            if (currentFilter === 'all') {
                                const sorted = Array.from(allCards).sort((a, b) => {
                                    const nameA = a.querySelector('.podcast-name')?.textContent.trim() || '';
                                    const nameB = b.querySelector('.podcast-name')?.textContent.trim() || '';
                                    return nameA.localeCompare(nameB);
                                });
                                sorted.forEach(card => {
                                    card.classList.remove('filtered-out', 'filtering');
                                    visibleCards.push(card);
                                    fragment.appendChild(card);
                                });
                            } else {
                                // For 'curated', only show first 3 cards
                                originalOrder.forEach((card, index) => {
                                    card.classList.remove('filtered-out', 'filtering');
                                    if (index < 3) visibleCards.push(card);
                                    fragment.appendChild(card);
                                });
                                // Reset to collapsed state and remove any show classes
                                grid.classList.remove('show-partial', 'show-expanded');
                                currentState = 'collapsed';
                            }
                            
                            grid.innerHTML = '';
                            grid.appendChild(fragment);
                        }
                    }
                    
                    
                    // Handle no results
                    if (noResultsMsg) {
                        if (visibleCards.length === 0) {
                            noResultsMsg.style.display = 'block';
                            const filterName = noResultsMsg.querySelector('.filter-name');
                            if (filterName && filterSelect.selectedIndex >= 0) {
                                filterName.textContent = filterSelect.options[filterSelect.selectedIndex].text;
                            }
                            showMoreBtn.style.display = 'none';
                        } else {
                            noResultsMsg.style.display = 'none';
                        }
                    }
                    
                    // Update show more button
                    if (visibleCards.length <= 3) {
                        showMoreBtn.style.display = 'none';
                    } else {
                        showMoreBtn.style.display = '';
                        // Only reset button text/icon if not already in collapsed state
                        if (currentState !== 'collapsed') {
                            if (btnText) btnText.textContent = 'Show more briefings';
                            if (btnIcon) btnIcon.style.transform = 'rotate(0deg)';
                            showMoreBtn.setAttribute('aria-expanded', 'false');
                        }
                    }
                    
                    
                    // Update last visible card
                    updateLastVisibleCard();
                    
                    // Update active indicator
                    filterSelect.setAttribute('data-active', currentFilter);
                    
                    isFiltering = false;
                }, 200);
            }
            
            // Filter change event with error handling
            filterSelect.addEventListener('change', (e) => {
                try {
                    currentFilter = e.target.value;
                    applyFilter();
                } catch (error) {
                    console.error('Filter error:', error);
                    // Fail silently for user
                    isFiltering = false;
                }
            });
        }
        
        // Original updateLastVisibleCard function (modified for filtering)
        function updateLastVisibleCard() {
            // Get current grid (might be filtered or original)
            const currentGrid = container.querySelector('.briefings-list.episode-grid, .episode-grid-filtered');
            if (!currentGrid) return;
            
            const visibleCards = Array.from(currentGrid.querySelectorAll('.episode-card:not(.filtered-out)'));
            
            visibleCards.forEach(card => card.classList.remove('last-visible'));
            
            if (currentState === 'collapsed' && visibleCards[2]) {
                visibleCards[2].classList.add('last-visible');
            } else if (currentState === 'partial' && visibleCards[5]) {
                visibleCards[5].classList.add('last-visible');
            } else if (currentState === 'expanded' && visibleCards.length > 0) {
                visibleCards[visibleCards.length - 1].classList.add('last-visible');
            }
        }
        
        // Original show more functionality (preserved)
        showMoreBtn.addEventListener('click', () => {
            // Get current grid (might be filtered or original)
            const currentGrid = container.querySelector('.briefings-list.episode-grid, .episode-grid-filtered');
            if (!currentGrid) return;
            
            if (currentState === 'collapsed') {
                currentGrid.classList.add('show-partial');
                currentState = 'partial';
                if (btnText) btnText.textContent = 'Show more briefings';
                showMoreBtn.setAttribute('aria-expanded', 'false');
            } else if (currentState === 'partial') {
                currentGrid.classList.remove('show-partial');
                currentGrid.classList.add('show-expanded');
                currentState = 'expanded';
                if (btnText) btnText.textContent = 'Collapse briefings';
                if (btnIcon) btnIcon.style.transform = 'rotate(180deg)';
                showMoreBtn.setAttribute('aria-expanded', 'true');
            } else {
                currentGrid.classList.remove('show-partial', 'show-expanded');
                currentState = 'collapsed';
                if (btnText) btnText.textContent = 'Show more briefings';
                if (btnIcon) btnIcon.style.transform = 'rotate(0deg)';
                showMoreBtn.setAttribute('aria-expanded', 'false');
                container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            
            updateLastVisibleCard();
        });
        
        // Keyboard support
        showMoreBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                showMoreBtn.click();
            }
        });
        
        // Initialize
        updateLastVisibleCard();
        
        // Apply initial filter if dropdown exists
        if (filterSelect) {
            // Add a small delay to ensure DOM is ready
            setTimeout(() => {
                applyFilter();
            }, 100);
        }
    },
    
    // Generate HTML from unified data
    generateHTML: function(briefings) {
        const html = `
            <!-- Priority Briefings: Dynamically generated from unified data -->
            <div class="priority-briefings-container">
                <!-- Header INSIDE container -->
                <div class="section-header-wrapper">
                    <div class="section-header-content">
                        <div class="feed-title-group">
                            <h2 class="section-title">PRIORITY BRIEFINGS</h2>
                            <span class="section-subtitle">What requires your attention today</span>
                        </div>
                        <a href="#" class="view-all-link" id="view-all-briefings">ALL BRIEFINGS →</a>
                    </div>
                    <!-- Filter dropdown -->
                    <div class="filter-dropdown-container">
                        <select id="podcast-filter" class="podcast-filter-select" data-active="curated">
                            <option value="curated">Curated for You</option>
                            <option value="all">All Episodes</option>
                        </select>
                    </div>
                </div>
                
                <!-- Briefings content -->
                <div class="briefings-content">
                    <div class="briefings-list episode-grid">
                        ${briefings.map(briefing => this.generateBriefingCard(briefing)).join('')}
                    </div>
                    <!-- No results message -->
                    <div class="no-results-message" style="display: none;">
                        <p>No episodes found for <span class="filter-name"></span></p>
                    </div>
                </div>
                
                <!-- Show more button INSIDE container -->
                <div class="show-more-container">
                    <button class="show-more-btn brief-expand-btn">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" class="btn-icon">
                            <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <span class="btn-text">Show more briefings</span>
                    </button>
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
    },
    
    // HTML escaping helper function for security
    escapeHTML: function(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    },

    // Generate individual briefing card
    generateBriefingCard: function(briefing) {
        // Access cardView data
        const card = briefing.cardView;
        
        // Map priorityTag to CSS classes
        const priorityClass = card.priorityTag === 'Consensus Forming' ? 'priority-critical' :
                            card.priorityTag === 'New Data' ? 'priority-opportunity' :
                            card.priorityTag === 'Portfolio Impact' ? 'priority-elevated' :
                            card.priorityTag === 'LP Intel' ? 'priority-elevated' :
                            card.priorityTag === 'Contrarian View' ? 'priority-opportunity' :
                            'priority-elevated';
        
        // Map podcast names to avatar images
        const avatarMap = {
            'All-In': 'images/allin.png',
            '20VC': 'images/20vc.jpeg',
            'The Twenty Minute VC': 'images/20vc.jpeg',
            'The Information\'s 411': 'images/theinformation.png',
            'Capital Allocators': 'images/capital allocators.webp',
            'Acquired': 'images/acquired.jpeg',
            'Invest Like the Best': 'images/investlikethebest.jpeg',
            'The Logan Bartlett Show': 'images/logan.jpeg',
            'Stratechery': 'images/stratechery.jpeg',
            'Khosla Ventures Podcast': 'images/khosla.png',
            'Indie Hackers': 'images/indiehackers.png',
            'The Tim Ferriss Show': 'images/timf.jpeg',
            'This Week in Startups': 'images/theweekinstartups.jpeg',
            'The Knowledge Project': 'images/knowledgeproject.webp',
            'BG2Pod': 'images/bg2.png',
            'Changelog': 'images/changelog.png'
        };
        
        const avatarSrc = avatarMap[card.podcast] || 'images/20vc.jpeg'; // Use 20vc as fallback
        
        // Build hashtags string
        const hashtagsHtml = card.hashtags && card.hashtags.length > 0
            ? card.hashtags.map(tag => `<span class="hashtag">${this.escapeHTML(tag)}</span>`).join(' ')
            : '';
        
        return `
            <div class="episode-card ${priorityClass}" data-id="${briefing.id}">
                <div class="episode-header">
                    <div class="podcast-info">
                        <div class="podcast-avatar">
                            <img src="${avatarSrc}" alt="${this.escapeHTML(card.podcast)}" />
                        </div>
                        <div class="podcast-details">
                            <div class="podcast-meta-line">
                                <span class="podcast-name">${this.escapeHTML(card.podcast)}</span>
                                <span class="separator">•</span>
                                <span class="time-ago">${this.escapeHTML(card.time)}</span>
                                <span class="separator">•</span>
                                <span class="duration">${this.escapeHTML(card.duration)}</span>
                                <span class="separator">•</span>
                                <span class="score-label">Score: <strong>${card.score}</strong></span>
                            </div>
                            <div class="priority-tag-line">
                                <span class="episode-signal ${priorityClass.includes('critical') ? 'priority-red' : priorityClass.includes('opportunity') ? 'priority-green' : ''}">${this.escapeHTML(card.priorityTag)}</span>
                                ${hashtagsHtml}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="episode-guest-line">
                    ${this.escapeHTML(card.guests)}
                </div>
                <h3 class="episode-title">"${this.escapeHTML(card.title)}"</h3>
                <div class="episode-why-care">
                    <strong>Why You Should Care:</strong> ${this.escapeHTML(card.whyCare)}
                </div>
                ${card.socialProof ? `<div class="episode-social-proof">${this.escapeHTML(card.socialProof)}</div>` : ''}
                ${this.generateMentionsSection(card)}
                <div class="episode-footer">
                    <button class="episode-action" type="button">View Full Brief →</button>
                </div>
            </div>
        `;
    },
    
    // Populate filter dropdown with unique podcasts
    populateFilterOptions: function(briefings, filterSelect) {
        // Get unique podcast names from cardView
        const podcasts = [...new Set(briefings.map(b => b.cardView.podcast))];
        
        // Add podcast options after "All Episodes"
        podcasts.forEach(podcast => {
            const option = document.createElement('option');
            option.value = podcast;
            option.textContent = podcast;
            filterSelect.appendChild(option);
        });
    },
    
    // Get truncated summary based on screen size
    getTruncatedSummary: function(summary) {
        const isMobile = window.innerWidth <= 768;
        const maxLength = isMobile ? 100 : 150;
        
        if (summary.length <= maxLength) {
            return summary;
        }
        
        return summary.substring(0, maxLength) + '...';
    },
    
    // Generate mentions section for portfolio and watchlist
    generateMentionsSection: function(card) {
        const hasMentions = (card.portfolioMentions && Object.keys(card.portfolioMentions).length > 0) ||
                          (card.watchlistMentions && Object.keys(card.watchlistMentions).length > 0);
        
        if (!hasMentions) return '';
        
        let html = '<div class="mentions-section">';
        
        // Portfolio mentions
        if (card.portfolioMentions && Object.keys(card.portfolioMentions).length > 0) {
            html += '<span class="mention-badge">📊 Portfolio: ';
            const mentions = Object.entries(card.portfolioMentions)
                .map(([company, count]) => `${this.escapeHTML(company)} (${count})`)
                .join(', ');
            html += mentions;
            html += '</span>';
        }
        
        // Watchlist mentions  
        if (card.watchlistMentions && Object.keys(card.watchlistMentions).length > 0) {
            if (card.portfolioMentions && Object.keys(card.portfolioMentions).length > 0) {
                html += ' <span class="separator">|</span> ';
            }
            html += '<span class="mention-badge">📍 Watchlist: ';
            const mentions = Object.entries(card.watchlistMentions)
                .map(([company, count]) => `${this.escapeHTML(company)} (${count})`)
                .join(', ');
            html += mentions;
            html += '</span>';
        }
        
        html += '</div>';
        return html;
    },
    
    // Get episode info (episode number and host)
    getEpisodeInfo: function(briefing) {
        // Map of podcast to host names and episode numbers
        const podcastInfo = {
            'All-In': { host: 'Chamath, Sacks, Friedberg & Calacanis', episode: 'E147' },
            'The Twenty Minute VC': { host: 'Harry Stebbings', episode: '#892' },
            'Capital Allocators': { host: 'Ted Seides', episode: 'EP324' },
            'BG2Pod': { host: 'Brad Gerstner & Bill Gurley', episode: '#12' },
            'This Week in Startups': { host: 'Jason Calacanis', episode: 'E1892' },
            'Invest Like the Best': { host: 'Patrick O\'Shaughnessy', episode: 'EP324' },
            'Acquired': { host: 'Ben Gilbert & David Rosenthal', episode: 'S8E4' },
            'The Tim Ferriss Show': { host: 'Tim Ferriss', episode: '#712' },
            'Changelog': { host: 'Adam Stacoviak & Jerod Santo', episode: '#568' },
            'The Knowledge Project': { host: 'Shane Parrish', episode: '#772' }
        };
        
        const info = podcastInfo[briefing.podcast] || { host: 'Host', episode: '#001' };
        return `${info.episode} • ${info.host}`;
    },
    
    // Truncate summary to specific number of sentences
    truncateSummary: function(summary, targetSentences = 3) {
        if (!summary) return summary;
        
        // Split by sentence endings (period followed by space or end of string)
        const sentences = summary.match(/[^.!?]+[.!?]+/g) || [];
        
        if (sentences.length <= targetSentences) {
            return summary;
        }
        
        // Take first N sentences
        let truncated = sentences.slice(0, targetSentences).join('').trim();
        
        // If result is too short (less than 100 chars), add one more sentence if available
        if (truncated.length < 100 && sentences.length > targetSentences) {
            truncated = sentences.slice(0, targetSentences + 1).join('').trim();
        }
        
        // Add .. after the final punctuation if we truncated
        if (truncated.endsWith('.')) {
            return truncated.slice(0, -1) + '...';
        } else if (truncated.endsWith('!') || truncated.endsWith('?')) {
            return truncated + '..';
        }
        
        return truncated;
    },
    
    // Helper to parse influence string like "High (97)" into label and score
    parseInfluence: function(influenceStr) {
        const match = influenceStr.match(/^(\w+)\s*\((\d+)\)$/);
        if (match) {
            return {
                label: match[1],
                score: match[2]
            };
        }
        return {
            label: influenceStr,
            score: ''
        };
    },
    
    // Helper function to wrap numbers/percentages in spans for emphasis
    wrapMetrics: function(text) {
        // Matches: $20B, 70%, sub-20%, 30%, numbers with B/M/K suffix
        return text.replace(/(\$?\d+(?:\.\d+)?[BMK]?%?|\d+%|sub-\d+%)/g, '<span class="insight-metric">$1</span>');
    }
};

window.PriorityBriefings = PriorityBriefings;