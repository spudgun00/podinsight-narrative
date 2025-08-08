// Shared Briefing Card Renderer
// This is the single source of truth for rendering episode/briefing cards
// Used by both Priority Briefings and Episode Library components

(function() {
    // Helper function to get priority class
    function getPriorityClass(priorityTag) {
        if (!priorityTag) return '';
        const tag = priorityTag.toLowerCase().replace(/\s+/g, '-');
        const classMap = {
            'consensus-forming': 'consensus',
            'new-data': 'new-data',
            'lp-intel': 'lp-intel',
            'contrarian-view': 'contrarian',
            'portfolio-impact': 'portfolio'
        };
        return classMap[tag] || '';
    }

    // Helper function to format mentions
    function formatMentions(portfolioMentions, watchlistMentions) {
        let mentions = [];
        
        if (portfolioMentions && Object.keys(portfolioMentions).length > 0) {
            const companies = Object.entries(portfolioMentions)
                .map(([company, count]) => `${company} (${count})`)
                .join(', ');
            mentions.push(`
                <span>📁</span>
                <span class="mention-count">${companies}</span>
            `);
        }
        
        if (watchlistMentions && Object.keys(watchlistMentions).length > 0) {
            const companies = Object.entries(watchlistMentions)
                .map(([company, count]) => `${company} (${count})`)
                .join(', ');
            mentions.push(`
                <span>👁</span>
                <span class="mention-count">${companies}</span>
            `);
        }
        
        return mentions.join('');
    }

    // Helper function to generate episode number
    function getEpisodeNumber(podcast, episodeId) {
        // Map podcasts to their typical episode ranges for demo purposes
        const podcastEpisodeRanges = {
            'All-In': 180,
            '20VC': 1200,
            'The Twenty Minute VC': 1200,
            'The Information\'s 411': 89,
            'Acquired': 145,
            'Invest Like the Best': 450,
            'The Logan Bartlett Show': 67,
            'Stratechery': 234,
            'Khosla Ventures Podcast': 342,
            'Khosla Ventures': 342,
            'Indie Hackers': 289
        };
        
        // Get base episode number for the podcast, or use a default
        const baseNumber = podcastEpisodeRanges[podcast] || 100;
        
        // Create variation based on episode ID to make each one unique
        const idMatch = episodeId?.match(/\d+/);
        const variation = idMatch ? parseInt(idMatch[0]) : 0;
        
        // Generate episode number (going backwards from most recent)
        const episodeNum = baseNumber - variation;
        return `#${episodeNum}`;
    }

    // Main renderer function
    window.renderBriefingCards = function(episodes, options = {}) {
        // Default options
        const defaults = {
            startIndex: 0,
            endIndex: episodes.length
        };
        const settings = { ...defaults, ...options };
        
        // Slice the array if needed
        const cardsToShow = episodes.slice(settings.startIndex, settings.endIndex);
        
        return cardsToShow.map((briefing, index) => {
            // Support both direct cardView or nested structure
            const cardData = briefing.cardView || briefing;
            
            // Format priority tag class
            const priorityClass = getPriorityClass(cardData.priorityTag);
            
            // Format mentions
            const mentions = formatMentions(cardData.portfolioMentions, cardData.watchlistMentions);
            
            // Extract hashtags (support both hashtags and topics fields)
            const hashtags = cardData.hashtags || cardData.topics || [];
            
            // Clean up podcast name - remove " Podcast" suffix if present
            const podcastName = cardData.podcast.replace(/ Podcast$/i, '');
            
            // Episode number no longer displayed to save space
            // const episodeNumber = getEpisodeNumber(cardData.podcast, briefing.id);
            
            // Just use the podcast name without episode number
            const podcastBadgeText = podcastName;
            
            return `
                <div class="briefing-card" data-briefing-id="${briefing.id}" data-index="${index}">
                    <div class="card-header">
                        <span class="podcast-badge">${podcastBadgeText}</span>
                        <div class="episode-info">
                            <span>${cardData.time}</span>
                            <span class="separator">•</span>
                            <span>${cardData.duration}</span>
                            <span class="separator">•</span>
                            <span>Score: ${cardData.score}</span>
                        </div>
                        ${cardData.priorityTag ? `<span class="priority-tag ${priorityClass}">${cardData.priorityTag}</span>` : ''}
                    </div>
                    
                    ${cardData.guests ? `<div class="guest-info">${cardData.guests}</div>` : ''}
                    
                    <h3 class="card-title">${cardData.title}</h3>
                    
                    ${cardData.whyCare ? `<p class="card-summary">${cardData.whyCare}</p>` : ''}
                    
                    ${hashtags.length > 0 ? `
                        <div class="card-tags">
                            ${hashtags.map(tag => `<a href="#" class="tag">${tag}</a>`).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="card-footer">
                        <div class="mentions">
                            ${mentions}
                        </div>
                        <button class="view-brief-btn" data-briefing-id="${briefing.id}">
                            View Full Brief →
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    };

    // Also export the helper functions if needed elsewhere
    window.BriefingCardHelpers = {
        getPriorityClass,
        formatMentions
    };
})();