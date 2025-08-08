// Episode Panel Compact Injector - Forcefully applies compact styles
// This script directly modifies the DOM and injects inline styles with maximum priority

(function() {
    'use strict';
    
    // Function to inject compact styles with maximum specificity
    function injectCompactStyles() {
        // Create a style element with maximum priority
        const styleEl = document.createElement('style');
        styleEl.id = 'episode-panel-compact-override';
        styleEl.innerHTML = `
            /* NUCLEAR OVERRIDE - Maximum specificity with !important on everything */
            
            /* Force panel to 65% width */
            body .episode-panel-container,
            body div.episode-panel-container,
            body > * .episode-panel-container,
            #root .episode-panel-container,
            .episode-panel-container.episode-panel-container {
                width: 65% !important;
                max-width: 900px !important;
                min-width: 600px !important;
            }
            
            /* Force compact header */
            body .episode-panel-container .panel-header,
            .episode-panel-container > .panel-header,
            .episode-panel-container .panel-header.panel-header {
                padding: 10px 16px !important;
                max-height: 75px !important;
                min-height: auto !important;
                height: auto !important;
            }
            
            /* Force title size reduction */
            body .episode-panel-container .episode-title,
            .episode-panel-container .episode-title.episode-title {
                font-size: 18px !important;
                line-height: 1.2 !important;
                margin: 0 0 6px 0 !important;
            }
            
            /* Force participants on same line */
            body .episode-panel-container .episode-participants,
            .episode-panel-container .episode-participants.episode-participants {
                display: flex !important;
                flex-direction: row !important;
                gap: 20px !important;
                margin: 0 !important;
            }
            
            body .episode-panel-container .participant,
            .episode-panel-container .participant.participant {
                flex: 1 !important;
                display: flex !important;
                align-items: baseline !important;
                gap: 6px !important;
            }
            
            /* Force smaller fonts everywhere */
            body .episode-panel-container .participant-label {
                font-size: 9px !important;
                min-width: 30px !important;
            }
            
            body .episode-panel-container .participant-name {
                font-size: 11px !important;
            }
            
            body .episode-panel-container .podcast-details h3 {
                font-size: 12px !important;
                margin: 0 !important;
            }
            
            body .episode-panel-container .podcast-meta {
                font-size: 10px !important;
            }
            
            /* Force smaller logo */
            body .episode-panel-container .podcast-logo {
                width: 28px !important;
                height: 28px !important;
                min-width: 28px !important;
                min-height: 28px !important;
            }
            
            /* Force compact content padding */
            body .episode-panel-container .panel-content {
                padding: 0 !important;
                max-height: calc(100vh - 75px) !important;
            }
            
            body .episode-panel-container .panel-main-column {
                padding: 12px 16px !important;
            }
            
            body .episode-panel-container .panel-sidebar {
                padding: 12px !important;
            }
            
            /* Force section headers to be smaller */
            body .episode-panel-container .section-header,
            .episode-panel-container .section-header.section-header {
                font-size: 9px !important;
                margin-bottom: 6px !important;
                letter-spacing: 0.4px !important;
                padding: 0 !important;
            }
            
            /* Force conversation section compact */
            body .episode-panel-container .conversation-section {
                padding: 10px 12px !important;
                margin-bottom: 12px !important;
            }
            
            body .episode-panel-container .conversation-content {
                font-size: 11px !important;
                line-height: 1.4 !important;
            }
            
            /* Force compact insights */
            body .episode-panel-container .insight-item {
                padding: 8px 10px !important;
                margin-bottom: 6px !important;
                gap: 8px !important;
            }
            
            body .episode-panel-container .insight-number {
                width: 18px !important;
                height: 18px !important;
                font-size: 10px !important;
            }
            
            body .episode-panel-container .insight-item div:last-child {
                font-size: 11px !important;
                line-height: 1.3 !important;
            }
            
            /* Force compact quote */
            body .episode-panel-container .quote-block,
            .episode-panel-container .quote-block.quote-block {
                padding: 8px 10px !important;
                margin-bottom: 12px !important;
            }
            
            body .episode-panel-container .quote-text {
                font-size: 12px !important;
                line-height: 1.3 !important;
                margin-bottom: 4px !important;
            }
            
            body .episode-panel-container .quote-attribution,
            body .episode-panel-container .quote-author {
                font-size: 10px !important;
            }
            
            /* Force numbers horizontal */
            body .episode-panel-container .numbers-list,
            .episode-panel-container .numbers-list.numbers-list {
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 8px !important;
            }
            
            body .episode-panel-container .number-item {
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                text-align: center !important;
                padding: 6px !important;
                background: white !important;
                border-radius: 4px !important;
                border: 1px solid #e2e8f0 !important;
            }
            
            body .episode-panel-container .number-value {
                font-size: 16px !important;
                font-weight: 600 !important;
                order: 1 !important;
            }
            
            body .episode-panel-container .number-label {
                font-size: 9px !important;
                order: 2 !important;
            }
            
            body .episode-panel-container .number-divider {
                display: none !important;
            }
            
            /* Force mentions side by side */
            body .episode-panel-container .mentions-section {
                display: flex !important;
                gap: 8px !important;
            }
            
            body .episode-panel-container .mentions-compact-block {
                flex: 1 !important;
                padding: 6px 8px !important;
                margin: 0 !important;
            }
            
            body .episode-panel-container .mentions-label {
                font-size: 9px !important;
            }
            
            body .episode-panel-container .mentions-count {
                width: 18px !important;
                height: 18px !important;
                font-size: 10px !important;
            }
            
            /* Force smaller buttons */
            body .episode-panel-container .header-action-btn {
                width: 24px !important;
                height: 24px !important;
                min-width: 24px !important;
                min-height: 24px !important;
            }
            
            body .episode-panel-container .header-actions {
                gap: 4px !important;
            }
            
            /* Force all sections to be compact */
            body .episode-panel-container .intelligence-section {
                margin-bottom: 12px !important;
            }
            
            /* Force thin scrollbars */
            body .episode-panel-container ::-webkit-scrollbar {
                width: 4px !important;
                height: 4px !important;
            }
            
            body .episode-panel-container ::-webkit-scrollbar-thumb {
                background: rgba(0,0,0,0.2) !important;
            }
            
            body .episode-panel-container ::-webkit-scrollbar-track {
                background: transparent !important;
            }
        `;
        
        // Remove any existing override styles
        const existingStyle = document.getElementById('episode-panel-compact-override');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Add to head with highest priority
        document.head.appendChild(styleEl);
    }
    
    // Function to directly modify DOM elements
    function modifyDOMStructure() {
        const panel = document.querySelector('.episode-panel-container');
        if (!panel) {
            console.log('Episode panel not found');
            return;
        }
        
        console.log('Applying compact modifications to episode panel...');
        
        // 1. Force inline styles on the panel itself
        panel.style.cssText = `
            width: 65% !important;
            max-width: 900px !important;
            min-width: 600px !important;
        `;
        
        // 2. Compact the header
        const header = panel.querySelector('.panel-header');
        if (header) {
            header.style.cssText = `
                padding: 10px 16px !important;
                max-height: 75px !important;
                height: auto !important;
            `;
        }
        
        // 3. Make title smaller
        const title = panel.querySelector('.episode-title');
        if (title) {
            title.style.cssText = `
                font-size: 18px !important;
                line-height: 1.2 !important;
                margin: 0 0 6px 0 !important;
            `;
        }
        
        // 4. Force participants on same line
        const participants = panel.querySelector('.episode-participants');
        if (participants) {
            participants.style.cssText = `
                display: flex !important;
                flex-direction: row !important;
                gap: 20px !important;
                margin: 0 !important;
            `;
            
            const participantDivs = participants.querySelectorAll('.participant');
            participantDivs.forEach(div => {
                div.style.cssText = `
                    flex: 1 !important;
                    display: flex !important;
                    align-items: baseline !important;
                    gap: 6px !important;
                `;
            });
        }
        
        // 5. Make numbers horizontal
        const numbersList = panel.querySelector('.numbers-list');
        if (numbersList) {
            numbersList.style.cssText = `
                display: grid !important;
                grid-template-columns: repeat(3, 1fr) !important;
                gap: 8px !important;
            `;
            
            // Hide dividers
            const dividers = numbersList.querySelectorAll('.number-divider');
            dividers.forEach(d => d.style.display = 'none');
            
            // Style items
            const items = numbersList.querySelectorAll('.number-item');
            items.forEach(item => {
                item.style.cssText = `
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: center !important;
                    text-align: center !important;
                    padding: 6px !important;
                    background: white !important;
                    border-radius: 4px !important;
                    border: 1px solid #e2e8f0 !important;
                `;
            });
        }
        
        // 6. Compact all sections
        const sections = panel.querySelectorAll('.intelligence-section');
        sections.forEach(section => {
            section.style.marginBottom = '12px';
        });
        
        // 7. Compact conversation
        const convSection = panel.querySelector('.conversation-section');
        if (convSection) {
            convSection.style.cssText = `
                padding: 10px 12px !important;
                margin-bottom: 12px !important;
            `;
        }
        
        // 8. Compact quote
        const quoteBlock = panel.querySelector('.quote-block');
        if (quoteBlock) {
            quoteBlock.style.cssText = `
                padding: 8px 10px !important;
                margin-bottom: 12px !important;
            `;
        }
        
        // 9. Side-by-side mentions
        const mentionsSection = panel.querySelector('.mentions-section');
        if (mentionsSection) {
            mentionsSection.style.cssText = `
                display: flex !important;
                gap: 8px !important;
            `;
            
            const blocks = mentionsSection.querySelectorAll('.mentions-compact-block');
            blocks.forEach(block => {
                block.style.cssText = `
                    flex: 1 !important;
                    padding: 6px 8px !important;
                    margin: 0 !important;
                `;
            });
        }
        
        console.log('Compact modifications applied successfully!');
    }
    
    // Function to apply both CSS and DOM modifications
    function applyCompactMode() {
        injectCompactStyles();
        modifyDOMStructure();
    }
    
    // Apply immediately
    applyCompactMode();
    
    // Watch for panel opening
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.target.classList && mutation.target.classList.contains('active')) {
                setTimeout(applyCompactMode, 100);
            }
        });
    });
    
    // Start observing
    const panel = document.querySelector('.episode-panel-container');
    if (panel) {
        observer.observe(panel, { 
            attributes: true, 
            attributeFilter: ['class'],
            subtree: true 
        });
    }
    
    // Also watch for panel being added to DOM
    const bodyObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.classList && node.classList.contains('episode-panel-container')) {
                    setTimeout(applyCompactMode, 100);
                }
            });
        });
    });
    
    bodyObserver.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    
    // Expose function globally for manual trigger
    window.makeEpisodePanelCompact = applyCompactMode;
    
    console.log('Episode Panel Compact Injector loaded. Use window.makeEpisodePanelCompact() to manually apply.');
})();