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
    
    // Generate individual briefing card
    generateBriefingCard: function(briefing) {
        // Map priority levels to CSS classes
        const priorityClass = briefing.priority === 'critical' ? 'priority-critical' : 
                            briefing.priority === 'opportunity' ? 'priority-opportunity' : 
                            'priority-elevated';
        
        // Map podcast names to avatar images (you may need to adjust these)
        const avatarMap = {
            'All-In': 'images/allin.png',
            'All-In Emergency Pod': 'images/allin.png', // Legacy support
            'The Twenty Minute VC': 'images/20vc.jpeg',
            'Capital Allocators': 'images/capital allocators.webp',
            'Institutional Investor Allocator': 'images/capital allocators.webp', // Legacy support
            'Acquired': 'images/acquired.jpeg',
            'The Tim Ferriss Show': 'images/timf.jpeg',
            'Indie Hackers': 'images/indiehackers.png',
            'This Week in Startups': 'images/theweekinstartups.jpeg',
            'The Knowledge Project': 'images/knowledgeproject.webp',
            'BG2': 'images/bg2.png',
            'BG2Pod': 'images/bg2.png',
            'Changelog': 'images/changelog.png',
            'Invest Like the Best': 'images/investlikethebest.jpeg',
            'Stratechery': 'images/stratechery.jpeg'
        };
        
        const avatarSrc = avatarMap[briefing.podcast] || 'images/default-podcast.jpeg';
        
        return `
            <div class="episode-card ${priorityClass}">
                <div class="episode-header">
                    <div class="podcast-info">
                        <div class="podcast-avatar">
                            <img src="${avatarSrc}" alt="${briefing.podcast}" />
                        </div>
                        <div class="podcast-details">
                            <div class="podcast-name">${briefing.podcast}</div>
                            <div class="episode-time">${briefing.time} • ${briefing.duration} • <span style="color: var(--sage); font-weight: 600;">${briefing.influence}</span></div>
                        </div>
                    </div>
                    <div class="episode-signal ${briefing.priority === 'critical' ? 'priority-red' : briefing.priority === 'opportunity' ? 'priority-green' : ''}">${briefing.priorityLabel}</div>
                </div>
                <h3 class="episode-title">${briefing.title}</h3>
                <p class="episode-guest">Guest: ${briefing.guest}</p>
                <div class="key-insights">
                    <div class="key-insights-label">Key Insights</div>
                    <ul class="insight-list">
                        ${briefing.keyInsights.map(insight => `<li>${insight}</li>`).join('')}
                    </ul>
                </div>
                <div class="additional-signals">
                    ${briefing.signals.map(signal => `<span class="signal-tag ${signal.type}">${signal.text}</span>`).join('')}
                </div>
                <div class="episode-footer">
                    <div class="episode-stats">
                        <span>${briefing.time}</span>
                        <span>•</span>
                        <span>${briefing.duration}</span>
                    </div>
                    <a href="#" class="episode-action">View Full Brief →</a>
                </div>
            </div>
        `;
    },
    
    // Populate filter dropdown with unique podcasts
    populateFilterOptions: function(briefings, filterSelect) {
        // Get unique podcast names
        const podcasts = [...new Set(briefings.map(b => b.podcast))];
        
        // Add podcast options after "All Episodes"
        podcasts.forEach(podcast => {
            const option = document.createElement('option');
            option.value = podcast;
            option.textContent = podcast;
            filterSelect.appendChild(option);
        });
    }
};

window.PriorityBriefings = PriorityBriefings;