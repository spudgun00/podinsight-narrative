// Episode Library Component

// Helper functions to handle both old string format and new number format
const INFLUENCE_THRESHOLDS = {
    HIGH: 90,  // Matching your existing logic
    MEDIUM: 70
};

// Extract numeric score from either format
function extractInfluenceScore(influence) {
    console.log('[Episode Library] Extracting score from:', influence, 'type:', typeof influence);
    
    if (typeof influence === 'number') {
        console.log('[Episode Library] Direct number:', influence);
        return influence;
    }
    
    if (typeof influence === 'string') {
        const match = influence.match(/\d+/);
        const score = match ? parseInt(match[0]) : 0;
        console.log('[Episode Library] Extracted from string:', score);
        return score;
    }
    
    console.warn('[Episode Library] Unable to extract score from:', influence);
    return 0;
}

const EpisodeLibrary = {
    state: {
        isOpen: false,
        searchQuery: '',
        activeFilters: {
            podcast: 'all',
            dateRange: 'all',
            topics: ['all']
        },
        sortBy: 'date',
        sortOrder: 'desc',
        selectedEpisodes: new Set(),
        viewMode: 'table' // 'table' or 'cards'
    },

    podcastImages: {
        'All-In': 'images/allin.png',
        'The Twenty Minute VC': 'images/20vc.jpeg',
        '20VC': 'images/20vc.jpeg',
        'The Information\'s 411': 'images/information.jpg',
        'Acquired': 'images/acquired.jpeg',
        'Invest Like the Best': 'images/investlikethebest.jpeg',
        'The Logan Bartlett Show': 'images/loganbartlett.jpg',
        'Stratechery': 'images/stratechery.jpeg',
        'Khosla Ventures Podcast': 'images/kv.png',
        'Khosla Ventures': 'images/kv.png',
        'Indie Hackers': 'images/indiehackers.png',
        'BG2Pod': 'images/bg2.png',
        'BG2': 'images/bg2.png',
        'Capital Allocators': 'images/capital allocators.webp',
        'Changelog': 'images/changelog.png',
        'The Knowledge Project': 'images/knowledgeproject.webp',
        'This Week in Startups': 'images/theweekinstartups.jpeg',
        'The Tim Ferriss Show': 'images/timf.jpeg'
    },

    init() {
        // Prevent double initialization
        if (this.overlay) {
            console.log('Episode Library already initialized');
            return;
        }
        
        // Extract all unique topics from episodes for the filter
        this.allTopics = this.getAllUniqueTopics();
        
        this.createOverlay();
        this.attachEventListeners();
        console.log('[Episode Library] Initialized with data source:', 
            window.unifiedData ? 'unified-data.js' : 'unknown');
        console.log('[Episode Library] Found unique topics:', this.allTopics.length);
        console.log('Episode Library initialized');
    },
    
    // Extract all unique topics from all episodes
    getAllUniqueTopics() {
        const topicsSet = new Set();
        const episodes = window.unifiedData?.priorityBriefings?.items || [];
        
        episodes.forEach(episode => {
            const hashtags = episode.cardView?.hashtags || episode.hashtags || [];
            hashtags.forEach(tag => {
                // Remove # prefix and add to set
                const cleanTag = tag.replace(/^#/, '');
                if (cleanTag) {
                    topicsSet.add(cleanTag);
                }
            });
        });
        
        // Convert to array and sort alphabetically
        return Array.from(topicsSet).sort((a, b) => 
            a.toLowerCase().localeCompare(b.toLowerCase())
        );
    },
    
    // Format topic name for display
    formatTopicForDisplay(topic) {
        // Use the more sophisticated formatHashtagForDisplay method
        return this.formatHashtagForDisplay(topic);
    },
    
    // Convert topic name to ID-safe value
    topicToId(topic) {
        return topic.toLowerCase().replace(/[^a-z0-9]/g, '-');
    },
    
    // Render the topics dropdown with dynamic topics
    renderTopicsDropdown() {
        let html = `
            <div class="multi-select-option">
                <input type="checkbox" id="topic-all" value="all" checked>
                <label for="topic-all">All Topics</label>
            </div>
        `;
        
        // Add all unique topics from the data
        this.allTopics.forEach(topic => {
            const topicId = this.topicToId(topic);
            const displayName = this.formatTopicForDisplay(topic);
            html += `
                <div class="multi-select-option">
                    <input type="checkbox" id="topic-${topicId}" value="${topic}">
                    <label for="topic-${topicId}">${displayName}</label>
                </div>
            `;
        });
        
        return html;
    },

    createOverlay() {
        // Remove any existing overlays first
        const existingOverlay = document.querySelector('.episode-library-overlay');
        const existingBackdrop = document.querySelector('.episode-library-backdrop');
        if (existingOverlay) {
            existingOverlay.remove();
        }
        if (existingBackdrop) {
            existingBackdrop.remove();
        }
        
        // Also remove any stray text nodes that might contain checkbox HTML
        const allTextNodes = document.evaluate(
            "//text()[contains(., 'checkbox')]",
            document.body,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );
        
        for (let i = 0; i < allTextNodes.snapshotLength; i++) {
            const textNode = allTextNodes.snapshotItem(i);
            if (textNode.nodeValue && textNode.nodeValue.includes('<input') && textNode.nodeValue.includes('checkbox')) {
                console.error('Found stray checkbox text node, removing:', textNode.nodeValue);
                textNode.remove();
            }
        }
        
        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'episode-library-backdrop';
        document.body.appendChild(backdrop);

        // Create main overlay
        const overlay = document.createElement('div');
        overlay.className = 'episode-library-overlay';
        const htmlContent = this.getOverlayHTML();
        
        // Ensure HTML is clean
        overlay.innerHTML = htmlContent;
        document.body.appendChild(overlay);

        this.overlay = overlay;
        this.backdrop = backdrop;
    },

    getOverlayHTML() {
        const episodes = window.unifiedData?.priorityBriefings?.items || [];
        const totalEpisodes = window.unifiedData?.meta?.analysis?.episodesAnalyzed || 1547;
        const totalHours = window.unifiedData?.meta?.analysis?.hoursAnalyzed || 1426;
        const lastUpdated = window.unifiedData?.meta?.analysis?.lastAnalysis || '38 mins ago';
        
        console.log('Episode Library: Generating HTML for', episodes.length, 'episodes');

        return `
            <div class="episode-library-container">
                <!-- Header -->
                <div class="episode-library-header">
                    <div class="library-header-left">
                        <h1>Podcast Intelligence Repository</h1>
                        <div class="library-stats">${totalEpisodes.toLocaleString()} episodes • ${totalHours.toLocaleString()} hours analyzed • Updated ${lastUpdated}</div>
                    </div>
                    <div class="library-header-actions">
                        <button class="btn-export">
                            <span>↓</span> Export Results
                        </button>
                        <div class="library-view-toggle">
                            <button class="active">Table</button>
                            <button>Cards</button>
                        </div>
                        <button class="library-close-btn" aria-label="Close Episode Library">×</button>
                    </div>
                </div>

                <!-- Search and Filters -->
                <div class="library-filters-bar">
                    <div class="library-search-box">
                        <span class="library-search-icon">🔍</span>
                        <input type="text" class="library-search-input" placeholder="Search episodes, topics, guests, or quotes...">
                    </div>
                    <select class="library-filter-dropdown" data-filter="podcast">
                        <option value="all">All Podcasts</option>
                        <option value="all-in">All-In</option>
                        <option value="20vc">20VC</option>
                        <option value="information-411">The Information's 411</option>
                        <option value="acquired">Acquired</option>
                        <option value="invest-like-best">Invest Like the Best</option>
                        <option value="logan-bartlett">The Logan Bartlett Show</option>
                        <option value="stratechery">Stratechery</option>
                        <option value="khosla-ventures">Khosla Ventures</option>
                        <option value="indie-hackers">Indie Hackers</option>
                    </select>
                    <div class="library-multi-select-wrapper" data-filter="topics">
                        <button class="library-multi-select-toggle">
                            <span class="multi-select-label">All Topics</span>
                            <span class="multi-select-arrow">▼</span>
                        </button>
                        <div class="library-multi-select-dropdown">
                            ${this.renderTopicsDropdown()}
                        </div>
                    </div>
                    <select class="library-filter-dropdown" data-filter="dateRange">
                        <option value="all">All Time</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="3months">Last 3 Months</option>
                        <option value="custom">Custom Range</option>
                    </select>
                    <div class="library-active-filters" id="activeFilters"></div>
                </div>

                <!-- Content Container -->
                <div class="library-content-container" id="libraryContent">
                    ${this.state.viewMode === 'table' ? this.renderTableView(episodes) : this.renderCardView(episodes)}
                </div>
            </div>
        `;
    },

    renderTableView(episodes) {
        return `
            <div class="library-table-container">
                <div class="library-table-wrapper">
                    <table class="library-data-table">
                        <thead>
                            <tr>
                                <th style="width: 180px;" data-sort="podcast">
                                    Podcast <span class="sort-icon">↕</span>
                                </th>
                                <th style="width: 60px;" data-sort="episode-number">
                                    # <span class="sort-icon">↕</span>
                                </th>
                                <th style="width: 300px;" data-sort="title">
                                    Episode <span class="sort-icon">↕</span>
                                </th>
                                <th style="width: 100px;" class="sorted" data-sort="date">
                                    Date <span class="sort-icon">↓</span>
                                </th>
                                <th style="width: 80px;" data-sort="duration">
                                    Length <span class="sort-icon">↕</span>
                                </th>
                                <th style="width: 200px;">
                                    Guests
                                </th>
                                <th style="width: 100px;" data-sort="influence">
                                    Influence <span class="sort-icon">↕</span>
                                </th>
                                <th style="width: 200px;">
                                    Topics
                                </th>
                                <th style="width: 60px;">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody id="episodeTableBody">
                            ${this.renderTableRows(episodes)}
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="library-pagination">
                    <div class="library-pagination-info">
                        Showing 1-9 of 9 episodes
                    </div>
                    <div class="library-pagination-controls">
                        <select class="library-filter-dropdown" style="width: auto;">
                            <option>50 per page</option>
                            <option>100 per page</option>
                            <option>200 per page</option>
                        </select>
                        <button class="library-page-btn" disabled>←</button>
                        <button class="library-page-btn active">1</button>
                        <button class="library-page-btn">→</button>
                    </div>
                </div>
            </div>
        `;
    },

    renderCardView(episodes) {
        console.log('[Episode Library] renderCardView called with', episodes.length, 'episodes');
        
        // Check if shared renderer is available
        if (!window.renderBriefingCards) {
            console.error('[Episode Library] ERROR: window.renderBriefingCards not found!');
            return '<div class="error-message">Shared renderer not loaded. Please refresh the page.</div>';
        }
        
        const grid = document.createElement('div');
        grid.className = 'episode-library-cards-grid';
        
        // Use the shared renderer - exactly the same as Priority Briefings
        const cardsHTML = window.renderBriefingCards(episodes);
        console.log('[Episode Library] Cards HTML generated, length:', cardsHTML.length);
        grid.innerHTML = cardsHTML;
        
        // Add event listeners
        grid.querySelectorAll('.briefing-card').forEach(card => {
            // Card click (entire card is clickable except buttons and tags)
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.view-brief-btn') && !e.target.closest('.tag')) {
                    e.preventDefault();
                    const episodeId = card.dataset.episodeId || card.dataset.briefingId;
                    if (episodeId) {
                        this.showEpisodeDetail(episodeId);
                    }
                }
            });
            
            // View brief button
            const viewBtn = card.querySelector('.view-brief-btn');
            if (viewBtn) {
                viewBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const episodeId = viewBtn.dataset.briefingId;
                    if (episodeId) {
                        this.showEpisodeDetail(episodeId);
                    }
                });
            }
            
            // Prevent tag clicks from triggering card click
            card.querySelectorAll('.tag').forEach(tag => {
                tag.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Could implement tag filtering here
                });
            });
        });
        
        return grid.outerHTML;
    },
    
    // Helper methods moved to shared briefing-card-renderer.js

    renderTableRows(episodes) {
        return episodes.map((episode, index) => {
            // Safely access cardView properties with fallback to direct properties for backward compatibility
            const card = episode.cardView || episode;
            
            const topics = this.extractTopics(card);
            console.log('[Episode Library] Card data:', card.podcast, 'score:', card.score, 'influence:', card.influence);
            const influenceClass = this.getInfluenceClass(card.score || card.influence);
            const podcastImage = this.podcastImages[card.podcast];
            
            return `
                <tr data-episode-id="${episode.id}" class="library-episode-row">
                    <td>
                        <div class="library-podcast-cell">
                            ${podcastImage ? 
                                `<img src="${podcastImage}" alt="${card.podcast}" class="library-podcast-logo">` :
                                `<div class="library-podcast-logo library-podcast-fallback">${this.getPodcastInitials(card.podcast)}</div>`
                            }
                            <span>${card.podcast || ''}</span>
                        </div>
                    </td>
                    <td class="episode-number-cell">
                        ${this.extractEpisodeNumber(card)}
                    </td>
                    <td>
                        <div class="library-episode-title">${card.title || 'No title'}</div>
                        <div class="library-episode-subtitle">${this.getHostInfo(card)}</div>
                    </td>
                    <td>${card.time || ''}</td>
                    <td>${card.duration || ''}</td>
                    <td>
                        <div class="library-guest-pills">
                            ${this.renderGuestPills(card.guests || card.guest)}
                        </div>
                    </td>
                    <td>
                        <span class="library-influence-score ${influenceClass}">
                            ${this.getInfluenceIcon(card.score || card.influence)} ${this.getInfluenceValue(card.score || card.influence)}
                        </span>
                    </td>
                    <td>
                        <div class="library-topic-tags" data-episode-id="${episode.id}">
                            ${this.renderTopicTags(topics, episode.id)}
                        </div>
                    </td>
                    <td>
                        <div style="position: relative;">
                            <button class="library-actions-btn" data-episode-id="${episode.id}">⋮</button>
                            <div class="library-actions-dropdown" id="actions-${episode.id}">
                                <div class="library-action-item">Play Episode</div>
                                <div class="library-action-item">View Transcript</div>
                                <div class="library-action-divider"></div>
                                <div class="library-action-item">Download Audio</div>
                                <div class="library-action-item">Download Transcript</div>
                                <div class="library-action-divider"></div>
                                <div class="library-action-item">Share</div>
                                <div class="library-action-item">Add to Brief</div>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    },

    renderTopicTags(topics, episodeId) {
        const maxDisplay = 2;
        
        if (topics.length <= maxDisplay) {
            return topics.map(topic => `<span class="library-topic-tag">${topic}</span>`).join('');
        }
        
        // Show first 2 topics and a clickable +X tag
        const visibleTopics = topics.slice(0, maxDisplay);
        const hiddenTopics = topics.slice(maxDisplay);
        const remainingCount = hiddenTopics.length;
        
        let html = visibleTopics.map(topic => `<span class="library-topic-tag">${topic}</span>`).join('');
        html += `<span class="library-topic-tag library-topic-more" data-episode-id="${episodeId}" data-expanded="false">+${remainingCount}</span>`;
        
        // Add hidden topics that will be shown when expanded
        html += hiddenTopics.map(topic => `<span class="library-topic-tag library-topic-hidden" style="display: none;">${topic}</span>`).join('');
        
        return html;
    },

    renderGuestPills(guestString) {
        // Add defensive check to prevent crash when guestString is undefined
        if (!guestString) {
            return '<span class="library-guest-pill">No guests listed</span>';
        }
        
        // Use regex to extract only guest names (before parentheses)
        // Pattern: captures name, skips parenthetical content, handles + separator
        const regex = /([^(]+?)(?:\s*\([^)]*\))?(?:\s*\+|$)/g;
        const names = [];
        
        // Extract all guest names using matchAll
        for (const match of guestString.matchAll(regex)) {
            // The actual name is in the first capturing group (index 1)
            // .trim() removes any leading/trailing whitespace
            const name = match[1]?.trim();
            if (name && name.length > 0) {
                // Remove common prefixes like "Guest:" or "Host:"
                const cleanName = name.replace(/^(Guest:|Host:)\s*/i, '').trim();
                if (cleanName.length > 0) {
                    names.push(cleanName);
                }
            }
        }
        
        // If no names were extracted, show a default message
        if (names.length === 0) {
            return '<span class="library-guest-pill">No guests listed</span>';
        }
        
        // Limit display to first 2 names
        const maxDisplay = 2;
        const displayNames = names.slice(0, maxDisplay);
        const remaining = names.length - maxDisplay;
        
        // Build the pills HTML
        let pills = displayNames.map(name => 
            `<span class="library-guest-pill">${name}</span>`
        ).join('');
        
        // Add "+N" pill if there are more guests
        if (remaining > 0) {
            pills += `<span class="library-guest-pill">+${remaining}</span>`;
        }
        
        return pills;
    },

    formatHashtagForDisplay(hashtag) {
        if (!hashtag) return '';
        
        // 1. Remove '#' prefix
        let text = hashtag.startsWith('#') ? hashtag.substring(1) : hashtag;
        
        // 2. Handle exact matches and specific transformations
        const exactMatches = {
            // Common acronyms and terms that should stay together
            'AI': 'AI',
            'AIAgents': 'AI Agents',
            'AIAdoption': 'AI Adoption',
            'AIEconomics': 'AI Economics',
            'AIFunding': 'AI Funding',
            'AIInfrastructure': 'AI Infrastructure',
            'AIMonetization': 'AI Monetization',
            'B2B': 'B2B',
            'B2BSaaS': 'B2B SaaS',
            'B2C': 'B2C',
            'DeFi': 'DeFi',
            'DevOps': 'DevOps',
            'DevTools': 'Dev Tools',
            'DeveloperTools': 'Developer Tools',
            'DefenseTech': 'Defense Tech',
            'DeepTech': 'Deep Tech',
            'DeveloperProductivity': 'Developer Productivity',
            'FinTech': 'FinTech',
            'GenAI': 'GenAI',
            'GPUEconomics': 'GPU Economics',
            'LLMs': 'LLMs',
            'LLM': 'LLM',
            'ML': 'ML',
            'MLOps': 'MLOps',
            'SaaS': 'SaaS',
            'PaaS': 'PaaS',
            'IaaS': 'IaaS',
            'API': 'API',
            'APIs': 'APIs',
            'SDK': 'SDK',
            'IoT': 'IoT',
            'VR': 'VR',
            'AR': 'AR',
            'XR': 'XR',
            'Web3': 'Web3',
            'DePIN': 'DePIN',
            // M&A related
            'mastrategy': 'M&A Strategy',
            'maStrategy': 'M&A Strategy',
            'MAStrategy': 'M&A Strategy',
            'MA': 'M&A',
            // Financial metrics
            'DPI': 'DPI',
            'ARR': 'ARR',
            'ROI': 'ROI',
            'IPO': 'IPO',
            'SPV': 'SPV',
            'LP': 'LP',
            'LPStrategy': 'LP Strategy',
            'LPAllocations': 'LP Allocations',
            'LPLiquidity': 'LP Liquidity',
            'GP': 'GP',
            'VC': 'VC',
            // C-suite
            'CEO': 'CEO',
            'CTO': 'CTO',
            'CFO': 'CFO',
            'COO': 'COO',
            'CPO': 'CPO',
            'CMO': 'CMO',
            // Series
            'SeriesA': 'Series A',
            'SeriesB': 'Series B',
            'SeriesC': 'Series C',
            'SeriesD': 'Series D',
            // Other common terms
            'GoToMarket': 'Go-to-Market',
            'GTM': 'GTM',
            'PMF': 'PMF',
            'TAM': 'TAM',
            'SAM': 'SAM',
            'SOM': 'SOM',
            'CAC': 'CAC',
            'LTV': 'LTV',
            'NPS': 'NPS',
            'KPI': 'KPI',
            'OKR': 'OKR',
            'MVP': 'MVP',
            'POC': 'POC',
            'UI': 'UI',
            'UX': 'UX',
            'UIUX': 'UI/UX',
            'QA': 'QA',
            'CI': 'CI',
            'CD': 'CD',
            'CICD': 'CI/CD',
            'ETL': 'ETL',
            'ERP': 'ERP',
            'CRM': 'CRM',
            'HRM': 'HRM',
            'ESG': 'ESG',
            'DEI': 'DEI',
            'R&D': 'R&D',
            'RnD': 'R&D',
            'M&A': 'M&A',
            'P&L': 'P&L',
            'B2B2C': 'B2B2C',
            'D2C': 'D2C',
            'DTC': 'DTC',
            // Additional hashtags from data
            'BootstrappedAI': 'Bootstrapped AI',
            'Bootstrapping': 'Bootstrapping',
            'BurnRate': 'Burn Rate',
            'CloudRepatriation': 'Cloud Repatriation',
            'CodingAssistants': 'Coding Assistants',
            'CorpDev': 'Corp Dev',
            'DataCenters': 'Data Centers',
            'DataCenterScaling': 'Data Center Scaling',
            'DownRounds': 'Down Rounds',
            'EnergyInfrastructure': 'Energy Infrastructure',
            'EnergyTech': 'Energy Tech',
            'ExitPlanning': 'Exit Planning',
            'ExitStrategy': 'Exit Strategy',
            'FundingBar': 'Funding Bar',
            'Hyperscalers': 'Hyperscalers',
            'IndieSuccess': 'Indie Success',
            'Infrastructure': 'Infrastructure',
            'InfrastructureArbitrage': 'Infrastructure Arbitrage',
            'MicroSaaS': 'MicroSaaS',
            'PortfolioConstruction': 'Portfolio Construction',
            'Productivity': 'Productivity',
            'RunwayPlanning': 'Runway Planning',
            'SaaSDisruption': 'SaaS Disruption',
            'SecondaryMarkets': 'Secondary Markets',
            'SeedExtensions': 'Seed Extensions',
            'SeriesA': 'Series A',
            'SoftwareDemand': 'Software Demand',
            'SoloFounders': 'Solo Founders',
            'StrategicBuyers': 'Strategic Buyers',
            'StrategicPartnerships': 'Strategic Partnerships',
            'Sustainability': 'Sustainability',
            'TechnicalDebt': 'Technical Debt',
            'UnitEconomics': 'Unit Economics',
            'VentureReturns': 'Venture Returns',
            'WorkflowAutomation': 'Workflow Automation',
            'AgentEconomics': 'Agent Economics',
            'AgentOrchestration': 'Agent Orchestration'
        };
        
        // Check for exact match (case-sensitive first)
        if (exactMatches[text]) {
            return exactMatches[text];
        }
        
        // Check for exact match (case-insensitive)
        const textUpper = text.toUpperCase();
        for (const [key, value] of Object.entries(exactMatches)) {
            if (key.toUpperCase() === textUpper) {
                return value;
            }
        }
        
        // 3. Apply CamelCase/PascalCase splitting for unmatched terms
        // But first, protect known acronyms from being split
        const protectedAcronyms = ['AI', 'ML', 'B2B', 'B2C', 'API', 'SDK', 'IoT', 'VR', 'AR', 'XR', 'UI', 'UX', 'QA', 'CI', 'CD'];
        let protectedText = text;
        protectedAcronyms.forEach(acronym => {
            // Add markers to protect the acronym from splitting
            const regex = new RegExp(`\\b${acronym}\\b`, 'g');
            protectedText = protectedText.replace(regex, `__${acronym}__`);
        });
        
        // Apply splitting on the protected text
        protectedText = protectedText.replace(/([a-z0-9])([A-Z])/g, '$1 $2');
        protectedText = protectedText.replace(/([A-Z]{2,})([A-Z][a-z])/g, '$1 $2');
        
        // Remove the protection markers
        protectedAcronyms.forEach(acronym => {
            protectedText = protectedText.replace(new RegExp(`__${acronym}__`, 'g'), acronym);
        });
        
        // 4. Clean up whitespace
        text = protectedText.replace(/\s+/g, ' ').trim();
        
        // 5. Smart capitalization - preserve acronyms and special casing
        const words = text.split(' ');
        const processedWords = words.map(word => {
            // Check if word is a known acronym
            if (protectedAcronyms.includes(word.toUpperCase())) {
                return word.toUpperCase();
            }
            // Keep word as-is if it's all uppercase and short (likely an acronym)
            else if (word.toUpperCase() === word && word.length <= 4) {
                return word;
            }
            // Contains digits - keep original casing
            else if (/\d/.test(word)) {
                return word;
            }
            // Known mixed-case terms
            else if (['SaaS', 'PaaS', 'IaaS', 'DeFi', 'FinTech', 'DevOps', 'GenAI', 'MLOps', 'DePIN'].includes(word)) {
                return word;
            }
            // Standard word - capitalize first letter only
            else {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }
        });
        
        return processedWords.join(' ');
    },

    extractTopics(episode) {
        let topics = [];
        
        // Handle both cardView structure and direct properties
        const rawHashtags = episode.cardView?.hashtags || episode.hashtags || [];
        
        // 1. Extract hashtags from the episode data and clean them
        if (rawHashtags && rawHashtags.length > 0) {
            // Remove # prefix but keep original casing
            topics = rawHashtags
                .map(tag => tag.replace(/^#/, ''))
                .filter(tag => tag.length > 0); // Remove empty strings
        }
        
        // 2. Use fallback topics only if no hashtags are found
        if (topics.length === 0) {
            // Topic mapping based on podcast (fallback)
            const podcastTopics = {
                'All-In': ['Market Analysis', 'Venture Capital', 'AI Infrastructure', 'Policy'],
                'The Twenty Minute VC': ['Series A', 'Fundraising', 'Growth Metrics', 'Portfolio Strategy'],
                '20VC': ['Series A', 'Fundraising', 'Growth Metrics', 'Portfolio Strategy'],
                'Capital Allocators': ['LP Strategy', 'Fund Management', 'Asset Allocation', 'Risk Management'],
                'BG2Pod': ['AI Agents', 'Enterprise Software', 'B2B SaaS', 'Market Dynamics'],
                'This Week in Startups': ['Startups', 'Founder Stories', 'Product Strategy', 'Growth Hacking'],
                'Invest Like the Best': ['Defense Tech', 'Deep Tech', 'Capital Efficiency', 'Emerging Markets'],
                'Acquired': ['M&A', 'Company Strategy', 'Tech History', 'Business Models'],
                'The Tim Ferriss Show': ['Productivity', 'Leadership', 'Mental Models', 'Performance'],
                'The Information\'s 411': ['Tech News', 'Industry Analysis', 'LP Strategy', 'Market Trends'],
                'The Logan Bartlett Show': ['Portfolio Strategy', 'M&A', 'Exit Planning', 'Venture Capital'],
                'Khosla Ventures Podcast': ['Energy Tech', 'Deep Tech', 'AI Infrastructure', 'Sustainability'],
                'Indie Hackers': ['Bootstrapping', 'MicroSaaS', 'Indie Success', 'Product Strategy'],
                'Changelog': ['Developer Tools', 'Open Source', 'DevOps', 'Programming'],
                'Stratechery': ['Platform Strategy', 'Tech Analysis', 'Business Strategy', 'Disruption'],
                'The Knowledge Project': ['Decision Making', 'Mental Models', 'Learning', 'Psychology']
            };
            
            // Use podcast-specific fallback topics
            const fallbackTopics = podcastTopics[podcast] || ['Tech Trends', 'Innovation'];
            topics.push(...fallbackTopics);
        }
        
        // 3. Deduplicate topics (case-sensitive now since we've formatted them)
        const uniqueTopics = [...new Set(topics)];
        
        return uniqueTopics.length > 0 ? uniqueTopics : ['General'];
    },

    getInfluenceClass(influence) {
        console.log('[Episode Library] getInfluenceClass input:', influence, 'type:', typeof influence);
        
        if (!influence) {
            console.log('[Episode Library] No influence value, returning default: influence-medium');
            return 'influence-medium';
        }
        
        const score = extractInfluenceScore(influence);
        const result = score >= 90 ? 'influence-high' : 'influence-medium';
        console.log('[Episode Library] Score:', score, '→ Class:', result);
        return result;
    },

    getTopicValue(topicName) {
        // Since we're now using the raw hashtag values (without #),
        // we can just return the topic as-is for matching
        return topicName;
    },

    getInfluenceIcon(influence) {
        console.log('[Episode Library] getInfluenceIcon input:', influence, 'type:', typeof influence);
        
        const score = extractInfluenceScore(influence);
        let icon;
        
        if (score >= 90) icon = '↗';
        else if (score >= 70) icon = '→';
        else icon = '↓';
        
        console.log('[Episode Library] Score:', score, '→ Icon:', icon);
        return icon;
    },

    getInfluenceValue(influence) {
        console.log('[Episode Library] getInfluenceValue input:', influence, 'type:', typeof influence);
        
        const score = extractInfluenceScore(influence);
        const value = score.toString();
        
        console.log('[Episode Library] Score:', score, '→ Value:', value);
        return value;
    },

    getPodcastInitials(podcast) {
        const initials = {
            'All-In': 'AI',
            'The Twenty Minute VC': '20',
            '20VC': '20',
            'Capital Allocators': 'CA',
            'BG2Pod': 'BG',
            'This Week in Startups': 'TW',
            'Invest Like the Best': 'IL',
            'Acquired': 'AQ',
            'The Tim Ferriss Show': 'TF'
        };
        if (!podcast) return 'NA';
        return initials[podcast] || podcast.substring(0, 2).toUpperCase();
    },

    getEpisodeSubtitle(episode) {
        // Map of podcast to host names and typical episode numbers
        const podcastHosts = {
            'All-In': { host: 'Chamath, Sacks, Friedberg & Calacanis', prefix: 'E' },
            'The Twenty Minute VC': { host: 'Harry Stebbings', prefix: '#' },
            '20VC': { host: 'Harry Stebbings', prefix: '#' },
            'Capital Allocators': { host: 'Ted Seides', prefix: 'EP' },
            'BG2Pod': { host: 'Brad Gerstner & Bill Gurley', prefix: '#' },
            'This Week in Startups': { host: 'Jason Calacanis', prefix: 'E' },
            'Invest Like the Best': { host: 'Patrick O\'Shaughnessy', prefix: 'EP' },
            'Acquired': { host: 'Ben Gilbert & David Rosenthal', prefix: 'S' },
            'The Tim Ferriss Show': { host: 'Tim Ferriss', prefix: '#' }
        };

        // Generate episode numbers based on podcast and index
        const episodeNumbers = {
            'All-In': 'E147',
            'The Twenty Minute VC': '#892',
            'Capital Allocators': 'EP324',
            'BG2Pod': '#12',
            'This Week in Startups': 'E1892',
            'Invest Like the Best': 'EP324',
            'Acquired': 'S8E4',
            'The Tim Ferriss Show': '#712'
        };

        const podcast = episode.cardView?.podcast || episode.podcast;
        const hostInfo = podcastHosts[podcast] || { host: 'Host', prefix: '#' };
        const episodeNum = episodeNumbers[podcast] || `${hostInfo.prefix}${Math.floor(Math.random() * 900) + 100}`;
        
        return `${episodeNum} • ${hostInfo.host}`;
    },

    truncateSummary(summary, targetSentences = 3) {
        if (!summary) return summary;
        
        // Split by sentence endings (period followed by space or end of string)
        const sentences = summary.match(/[^.!?]+[.!?]+/g) || [];
        
        if (sentences.length <= targetSentences) {
            return summary;
        }
        
        // Take first 3 sentences
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

    extractEpisodeNumber(episode) {
        // Handle both cardView structure and direct properties
        const podcast = episode.cardView?.podcast || episode.podcast;
        
        // Get episode number from hardcoded data - using realistic numbers for each podcast
        const episodeNumbers = {
            'All-In': 147,
            'The Twenty Minute VC': 892,
            '20VC': 892,  // Same as The Twenty Minute VC
            'Capital Allocators': 324,
            'BG2Pod': 12,
            'This Week in Startups': 1892,
            'Invest Like the Best': 450,
            'Acquired': 184,  // Season 8 Episode 4 converted to sequential number
            'The Tim Ferriss Show': 712,
            'The Information\'s 411': 89,
            'The Logan Bartlett Show': 67,
            'Stratechery': 234,
            'Khosla Ventures Podcast': 342,
            'Khosla Ventures': 342,  // Same as Khosla Ventures Podcast
            'Indie Hackers': 289,
            'Changelog': 568,
            'The Knowledge Project': 172,
            'SaaStr Podcast': 456,
            'CloudNative Podcast': 234,
            'Enterprise Software Weekly': 156
        };
        
        // Return the episode number or empty string if not found
        return episodeNumbers[podcast]?.toString() || '';
    },

    getHostInfo(episode) {
        // Handle both cardView structure and direct properties
        const podcast = episode.cardView?.podcast || episode.podcast;
        
        // Map of podcast to host names
        const podcastHosts = {
            'All-In': 'Chamath, Sacks, Friedberg & Calacanis',
            'The Twenty Minute VC': 'Harry Stebbings',
            '20VC': 'Harry Stebbings',
            'Capital Allocators': 'Ted Seides',
            'BG2Pod': 'Brad Gerstner & Bill Gurley',
            'This Week in Startups': 'Jason Calacanis',
            'Invest Like the Best': 'Patrick O\'Shaughnessy',
            'Acquired': 'Ben Gilbert & David Rosenthal',
            'The Tim Ferriss Show': 'Tim Ferriss'
        };
        
        const host = podcastHosts[podcast] || 'Host';
        return `Host: ${host}`;
    },

    attachEventListeners() {
        // Close button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('library-close-btn')) {
                this.close();
            }
            
            // Actions dropdown
            if (e.target.classList.contains('library-actions-btn')) {
                this.toggleActionsDropdown(e.target);
            }
            
            // Close dropdowns when clicking outside
            if (!e.target.closest('.library-actions-btn') && !e.target.closest('.library-actions-dropdown')) {
                this.closeAllDropdowns();
            }
            
            // Topic expansion
            if (e.target.classList.contains('library-topic-more')) {
                e.stopPropagation(); // Prevent event from bubbling up to row click handler
                this.toggleTopicExpansion(e.target);
            }
            
            // Episode row click (table view)
            if (e.target.closest('.library-episode-row')) {
                const row = e.target.closest('.library-episode-row');
                // Don't open if clicking on checkbox or actions
                if (!e.target.closest('.library-checkbox') && !e.target.closest('.library-actions-btn')) {
                    const episodeId = row.dataset.episodeId;
                    if (episodeId) {
                        this.showEpisodeDetail(episodeId);
                    }
                }
            }
            
            // Episode card click (card view)
            if (e.target.closest('.episode-card') && e.target.closest('.episode-library-overlay')) {
                const card = e.target.closest('.episode-card');
                // Don't open if clicking on checkbox
                if (!e.target.closest('.library-checkbox')) {
                    const episodeId = card.dataset.episodeId;
                    if (episodeId) {
                        this.showEpisodeDetail(episodeId);
                    }
                }
            }
            
            // View toggle
            if (e.target.closest('.library-view-toggle button')) {
                const button = e.target.closest('.library-view-toggle button');
                console.log('[Episode Library] View toggle button clicked:', button.textContent);
                const isTableView = button.textContent.includes('Table');
                console.log('[Episode Library] Is table view?', isTableView, '-> Setting mode to:', isTableView ? 'table' : 'cards');
                this.setViewMode(isTableView ? 'table' : 'cards');
            }
        });

        // Backdrop click
        this.backdrop.addEventListener('click', () => this.close());

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isOpen) {
                this.close();
            }
        });

        // Search input
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('library-search-input')) {
                this.handleSearch(e.target.value);
            }
        });

        // Multi-select toggle
        document.addEventListener('click', (e) => {
            if (e.target.closest('.library-multi-select-toggle')) {
                e.preventDefault();
                this.toggleMultiSelect(e.target.closest('.library-multi-select-wrapper'));
            }
            
            // Close multi-select when clicking outside
            if (!e.target.closest('.library-multi-select-wrapper')) {
                document.querySelectorAll('.library-multi-select-dropdown.active').forEach(dropdown => {
                    dropdown.classList.remove('active');
                });
            }
        });

        // Filters
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('library-filter-dropdown')) {
                this.handleFilterChange(e.target);
            }
            
            // Topic checkboxes
            if (e.target.closest('.library-multi-select-dropdown') && e.target.type === 'checkbox') {
                this.handleTopicChange(e.target);
            }
            
            // Checkboxes - Removed for now
            // if (e.target.classList.contains('library-checkbox')) {
            //     this.handleCheckboxChange(e.target);
            // }
        });

        // Sort headers
        document.addEventListener('click', (e) => {
            if (e.target.closest('th[data-sort]')) {
                this.handleSort(e.target.closest('th[data-sort]'));
            }
        });
    },

    open() {
        console.log('EpisodeLibrary.open() called!');
        console.log('Current state:', this.state);
        console.log('Overlay element:', this.overlay);
        console.log('Backdrop element:', this.backdrop);
        
        // Check for stray checkbox text before opening
        const bodyText = document.body.textContent || '';
        if (bodyText.includes('<input type="checkbox"')) {
            console.error('WARNING: Found checkbox HTML as text in body before opening!');
            // Try to find and log where it is
            const walker = document.createTreeWalker(
                document.body,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );
            
            let node;
            while (node = walker.nextNode()) {
                if (node.nodeValue && node.nodeValue.includes('<input type="checkbox"')) {
                    console.error('Found checkbox text in:', node.parentElement);
                    // Remove the text node
                    node.remove();
                }
            }
        }
        
        if (!this.overlay) {
            console.error('Episode Library: Overlay element not found!');
            console.log('Attempting to re-initialize...');
            this.init();
            if (!this.overlay) {
                console.error('Episode Library: Failed to create overlay even after re-init');
                return;
            }
        }
        
        this.state.isOpen = true;
        this.overlay.classList.add('active');
        this.backdrop.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        console.log('Episode Library: Opened successfully');
        console.log('Overlay classes:', this.overlay.className);
        console.log('Backdrop classes:', this.backdrop.className);
    },

    close() {
        this.state.isOpen = false;
        this.overlay.classList.remove('active');
        this.backdrop.classList.remove('active');
        document.body.style.overflow = '';
        this.closeAllDropdowns();
    },

    toggleActionsDropdown(button) {
        const episodeId = button.dataset.episodeId;
        const dropdown = document.getElementById(`actions-${episodeId}`);
        
        // Close all other dropdowns
        this.closeAllDropdowns();
        
        // Toggle this dropdown
        dropdown.classList.toggle('active');
    },

    closeAllDropdowns() {
        document.querySelectorAll('.library-actions-dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    },

    toggleTopicExpansion(moreTag) {
        const episodeId = moreTag.dataset.episodeId;
        const isExpanded = moreTag.dataset.expanded === 'true';
        const topicContainer = moreTag.closest('.library-topic-tags');
        const hiddenTags = topicContainer.querySelectorAll('.library-topic-hidden');
        
        if (isExpanded) {
            // Collapse
            hiddenTags.forEach(tag => tag.style.display = 'none');
            moreTag.dataset.expanded = 'false';
            
            // Update the count
            const hiddenCount = hiddenTags.length;
            moreTag.textContent = `+${hiddenCount}`;
        } else {
            // Expand
            hiddenTags.forEach(tag => tag.style.display = 'inline-block');
            moreTag.dataset.expanded = 'true';
            moreTag.textContent = '−'; // Change to minus sign
        }
    },

    handleSearch(query) {
        this.state.searchQuery = query.toLowerCase();
        this.updateTable();
    },

    handleFilterChange(select) {
        const filterType = select.dataset.filter;
        const value = select.value;
        
        this.state.activeFilters[filterType] = value;
        this.updateTable();
        this.updateActiveFilters();
    },

    toggleMultiSelect(wrapper) {
        const dropdown = wrapper.querySelector('.library-multi-select-dropdown');
        dropdown.classList.toggle('active');
    },

    handleTopicChange(checkbox) {
        const allCheckbox = document.getElementById('topic-all');
        const topicCheckboxes = document.querySelectorAll('.library-multi-select-dropdown input[type="checkbox"]:not(#topic-all)');
        
        if (checkbox.id === 'topic-all') {
            // If "All Topics" is checked, uncheck all others
            if (checkbox.checked) {
                topicCheckboxes.forEach(cb => cb.checked = false);
                this.state.activeFilters.topics = ['all'];
            } else {
                // Don't allow unchecking "All" if nothing else is selected
                checkbox.checked = true;
            }
        } else {
            // If any specific topic is checked, uncheck "All Topics"
            if (checkbox.checked) {
                allCheckbox.checked = false;
                
                // Collect all checked topics
                const checkedTopics = [];
                topicCheckboxes.forEach(cb => {
                    if (cb.checked) {
                        checkedTopics.push(cb.value);
                    }
                });
                
                // If nothing is checked, revert to "All"
                if (checkedTopics.length === 0) {
                    allCheckbox.checked = true;
                    this.state.activeFilters.topics = ['all'];
                } else {
                    this.state.activeFilters.topics = checkedTopics;
                }
            } else {
                // Check if this was the last topic
                const checkedCount = Array.from(topicCheckboxes).filter(cb => cb.checked).length;
                if (checkedCount === 0) {
                    allCheckbox.checked = true;
                    this.state.activeFilters.topics = ['all'];
                } else {
                    // Update topics list
                    this.state.activeFilters.topics = Array.from(topicCheckboxes)
                        .filter(cb => cb.checked)
                        .map(cb => cb.value);
                }
            }
        }
        
        this.updateMultiSelectLabel();
        this.updateTable();
        this.updateActiveFilters();
    },

    updateMultiSelectLabel() {
        const label = document.querySelector('.multi-select-label');
        const topics = this.state.activeFilters.topics;
        
        if (topics.includes('all') || topics.length === 0) {
            label.textContent = 'All Topics';
        } else if (topics.length === 1) {
            // Format the topic for display using the same logic as formatHashtagForDisplay
            const formattedTopic = this.formatHashtagForDisplay(topics[0]);
            label.textContent = formattedTopic;
        } else {
            label.textContent = `${topics.length} topics selected`;
        }
    },

    // Checkbox handling - Removed for now
    // handleCheckboxChange(checkbox) {
    //     if (checkbox.id === 'selectAll') {
    //         const isChecked = checkbox.checked;
    //         document.querySelectorAll('.library-checkbox:not(#selectAll)').forEach(cb => {
    //             cb.checked = isChecked;
    //             const id = cb.dataset.id;
    //             if (id) {
    //                 if (isChecked) {
    //                     this.state.selectedEpisodes.add(id);
    //                 } else {
    //                     this.state.selectedEpisodes.delete(id);
    //                 }
    //             }
    //         });
    //     } else {
    //         const id = checkbox.dataset.id;
    //         if (checkbox.checked) {
    //             this.state.selectedEpisodes.add(id);
    //         } else {
    //             this.state.selectedEpisodes.delete(id);
    //         }
    //     }
    // },

    handleSort(th) {
        const sortBy = th.dataset.sort;
        
        // Update sort state
        if (this.state.sortBy === sortBy) {
            this.state.sortOrder = this.state.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.state.sortBy = sortBy;
            this.state.sortOrder = 'desc';
        }
        
        // Update UI
        document.querySelectorAll('.library-data-table th').forEach(header => {
            header.classList.remove('sorted');
        });
        th.classList.add('sorted');
        
        const icon = th.querySelector('.sort-icon');
        icon.textContent = this.state.sortOrder === 'asc' ? '↑' : '↓';
        
        this.updateTable();
    },

    setViewMode(mode) {
        console.log('[Episode Library] Setting view mode to:', mode);
        this.state.viewMode = mode;
        
        // Update toggle buttons
        document.querySelectorAll('.library-view-toggle button').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = mode === 'table' 
            ? document.querySelector('.library-view-toggle button:first-child')
            : document.querySelector('.library-view-toggle button:last-child');
        if (activeBtn) {
            activeBtn.classList.add('active');
            console.log('[Episode Library] Active button set:', activeBtn.textContent);
        }
        
        // Update content
        this.updateContent();
    },

    // Function removed - using raw episodes directly with shared renderer

    updateContent() {
        // Get episodes from unified data - use raw format for shared renderer
        const rawEpisodes = window.unifiedData?.priorityBriefings?.items || [];
        // No conversion needed - shared renderer expects the raw format
        const filtered = this.filterEpisodes(rawEpisodes);
        const sorted = this.sortEpisodes(filtered);
        
        const container = document.getElementById('libraryContent');
        if (container) {
            console.log('[Episode Library] Updating content, view mode:', this.state.viewMode);
            console.log('[Episode Library] Episodes to render:', sorted.length);
            
            container.innerHTML = this.state.viewMode === 'table' 
                ? this.renderTableView(sorted)
                : this.renderCardView(sorted);
        }
    },

    updateTable() {
        // Just call updateContent since it handles both views
        this.updateContent();
    },

    filterEpisodes(episodes) {
        return episodes.filter(episode => {
            // Search filter
            if (this.state.searchQuery) {
                const card = episode.cardView || episode;
                const searchableText = [
                    card.title,
                    card.podcast,
                    card.guest || card.guests,
                    ...(episode.keyInsights || []),
                    ...(episode.signals?.map(s => s.text) || [])
                ].join(' ').toLowerCase();
                
                if (!searchableText.includes(this.state.searchQuery)) {
                    return false;
                }
            }
            
            // Podcast filter
            if (this.state.activeFilters.podcast !== 'all') {
                // Map filter values to actual podcast names
                const podcastMap = {
                    'all-in': 'All-In',
                    '20vc': ['20VC', 'The Twenty Minute VC'],
                    'information-411': 'The Information\'s 411',
                    'acquired': 'Acquired',
                    'invest-like-best': 'Invest Like the Best',
                    'logan-bartlett': 'The Logan Bartlett Show',
                    'stratechery': 'Stratechery',
                    'khosla-ventures': ['Khosla Ventures Podcast', 'Khosla Ventures'],
                    'indie-hackers': 'Indie Hackers'
                };
                
                const filterValue = this.state.activeFilters.podcast;
                const mappedValue = podcastMap[filterValue];
                
                if (mappedValue) {
                    // Handle array of possible names (like 20VC)
                    if (Array.isArray(mappedValue)) {
                        const podcast = episode.cardView?.podcast || episode.podcast;
                        if (!mappedValue.includes(podcast)) {
                            return false;
                        }
                    } else {
                        const podcast = episode.cardView?.podcast || episode.podcast;
                        if (podcast !== mappedValue) {
                            return false;
                        }
                    }
                }
            }
            
            // Topics filter
            if (!this.state.activeFilters.topics.includes('all') && this.state.activeFilters.topics.length > 0) {
                // Extract topics from the episode
                const episodeTopics = this.extractTopics(episode);
                
                // Check if any of the episode's topics match the selected filters
                const hasMatchingTopic = episodeTopics.some(topic => {
                    // Convert topic display name to filter value
                    const topicValue = this.getTopicValue(topic);
                    return this.state.activeFilters.topics.includes(topicValue);
                });
                
                if (!hasMatchingTopic) {
                    return false;
                }
            }
            
            return true;
        });
    },

    sortEpisodes(episodes) {
        const sorted = [...episodes];
        
        sorted.sort((a, b) => {
            let aVal, bVal;
            
            switch(this.state.sortBy) {
                case 'podcast':
                    // Handle both direct properties and cardView structure
                    aVal = a.cardView?.podcast || a.podcast || '';
                    bVal = b.cardView?.podcast || b.podcast || '';
                    break;
                case 'title':
                    // Handle both direct properties and cardView structure
                    aVal = a.cardView?.title || a.title || '';
                    bVal = b.cardView?.title || b.title || '';
                    break;
                case 'date':
                    // Convert time strings to sortable values
                    // Handle both direct properties and cardView structure
                    const aTime = a.cardView?.time || a.time || '0h ago';
                    const bTime = b.cardView?.time || b.time || '0h ago';
                    aVal = this.parseTimeAgo(aTime);
                    bVal = this.parseTimeAgo(bTime);
                    break;
                case 'duration':
                    // Handle both direct properties and cardView structure
                    const aDur = a.cardView?.duration || a.duration || '0 min';
                    const bDur = b.cardView?.duration || b.duration || '0 min';
                    aVal = parseInt(aDur);
                    bVal = parseInt(bDur);
                    break;
                case 'episode-number':
                    // Extract numeric values for sorting
                    const aNum = this.extractEpisodeNumber(a);
                    const bNum = this.extractEpisodeNumber(b);
                    
                    // Convert to integers for proper numerical sorting
                    aVal = parseInt(aNum) || 0;
                    bVal = parseInt(bNum) || 0;
                    break;
                default:
                    return 0;
            }
            
            if (this.state.sortOrder === 'asc') {
                return aVal > bVal ? 1 : -1;
            } else {
                return aVal < bVal ? 1 : -1;
            }
        });
        
        return sorted;
    },

    parseTimeAgo(timeStr) {
        // Convert "3h ago", "2d ago" etc to minutes for sorting
        if (!timeStr || typeof timeStr !== 'string') {
            console.warn('[Episode Library] Invalid time string:', timeStr);
            return 0;
        }
        
        const match = timeStr.match(/(\d+)([hd])/);
        if (!match) return 0;
        
        const value = parseInt(match[1]);
        const unit = match[2];
        
        return unit === 'h' ? value * 60 : value * 24 * 60;
    },

    updateActiveFilters() {
        const container = document.getElementById('activeFilters');
        const filters = [];
        
        Object.entries(this.state.activeFilters).forEach(([key, value]) => {
            if (key === 'topics') {
                // Handle topics array
                if (!value.includes('all') && value.length > 0) {
                    value.forEach(topic => {
                        filters.push({
                            type: key,
                            value: topic,
                            label: this.getFilterLabel(key, topic)
                        });
                    });
                }
            } else {
                // Handle other filters
                if (value !== 'all') {
                    filters.push({
                        type: key,
                        value: value,
                        label: this.getFilterLabel(key, value)
                    });
                }
            }
        });
        
        container.innerHTML = filters.map(filter => `
            <div class="library-filter-chip">
                ${filter.label}
                <span class="remove" data-filter="${filter.type}" data-value="${filter.value}">×</span>
            </div>
        `).join('');
        
        // Add remove handlers
        container.querySelectorAll('.remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterType = e.target.dataset.filter;
                const filterValue = e.target.dataset.value;
                this.resetFilter(filterType, filterValue);
            });
        });
    },

    getFilterLabel(type, value) {
        const labels = {
            podcast: {
                'all-in': 'All-In',
                '20vc': '20VC',
                'invest-like-best': 'Invest Like the Best'
            },
            dateRange: {
                '7days': 'Last 7 Days',
                '30days': 'Last 30 Days',
                '3months': 'Last 3 Months',
                'custom': 'Custom Range'
            },
            topics: {
                'ai-infrastructure': 'AI Infrastructure',
                'ai-agents': 'AI Agents',
                'developer-tools': 'Developer Tools',
                'defense-tech': 'Defense Tech',
                'series-a': 'Series A',
                'ma': 'M&A',
                'vertical-ai': 'Vertical AI',
                'enterprise-software': 'Enterprise Software',
                'fundraising': 'Fundraising',
                'lp-strategy': 'LP Strategy',
                'market-analysis': 'Market Analysis'
            }
        };
        
        return labels[type]?.[value] || value;
    },

    getConversationPreview(episode) {
        if (!episode.conversationSummary) {
            // Fallback to original subtitle format if no summary
            return this.getEpisodeSubtitle(episode);
        }
        // Truncate to 80 characters
        const preview = episode.conversationSummary.substring(0, 80);
        return preview + (episode.conversationSummary.length > 80 ? '...' : '');
    },




    showEpisodeDetail(episodeId) {
        // Delegate to the shared Episode Panel component
        if (window.episodePanel && typeof window.episodePanel.open === 'function') {
            console.log('[Episode Library] Opening shared Episode Panel for:', episodeId);
            
            // Keep Episode Library open so users can browse multiple episodes
            // The Episode Panel will open on top of the library
            
            // Open the shared Episode Panel
            window.episodePanel.open(episodeId);
        } else {
            console.error('[Episode Library] Episode Panel not initialized or open method missing');
        }
    },

    resetFilter(filterType, filterValue = null) {
        const defaults = {
            podcast: 'all',
            dateRange: 'all',
            topics: ['all']
        };
        
        if (filterType === 'topics' && filterValue) {
            // Remove specific topic from array
            const index = this.state.activeFilters.topics.indexOf(filterValue);
            if (index > -1) {
                this.state.activeFilters.topics.splice(index, 1);
            }
            
            // If no topics left, revert to "all"
            if (this.state.activeFilters.topics.length === 0) {
                this.state.activeFilters.topics = ['all'];
                document.getElementById('topic-all').checked = true;
            }
            
            // Update checkbox state
            const checkbox = document.querySelector(`#topic-${filterValue}`);
            if (checkbox) checkbox.checked = false;
        } else {
            // Reset entire filter
            this.state.activeFilters[filterType] = defaults[filterType];
            
            if (filterType === 'topics') {
                // Reset all topic checkboxes
                document.querySelectorAll('.library-multi-select-dropdown input[type="checkbox"]').forEach(cb => {
                    cb.checked = cb.id === 'topic-all';
                });
            } else {
                // Update dropdown
                const select = document.querySelector(`[data-filter="${filterType}"]`);
                if (select) {
                    select.value = defaults[filterType];
                }
            }
        }
        
        this.updateMultiSelectLabel();
        this.updateTable();
        this.updateActiveFilters();
    }
};

// Export for use
window.EpisodeLibrary = EpisodeLibrary;