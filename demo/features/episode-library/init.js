// Episode Library Initialization
(function() {
    // Wait for DOM and dependencies
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEpisodeLibrary);
    } else {
        initializeEpisodeLibrary();
    }

    function initializeEpisodeLibrary() {
        // Check if EpisodeLibrary is available
        if (typeof window.EpisodeLibrary === 'undefined') {
            setTimeout(initializeEpisodeLibrary, 100);
            return;
        }
        
        // Force CSS reload with timestamp - v3
        const cssLink = document.querySelector('link[href*="episode-library.css"]');
        if (cssLink) {
            const newHref = cssLink.href.split('?')[0] + '?v3=' + Date.now();
            cssLink.href = newHref;
        }
        
        // Initialize the component
        window.EpisodeLibrary.init();
        
        // Add button to header (if not already present)
        addLibraryButton();
    }

    function addLibraryButton() {
        // Check if button already exists
        let libraryButton = document.querySelector('.episode-library-btn');
        
        if (libraryButton) {
            // Button exists in HTML, just add the click handler
            libraryButton.addEventListener('click', () => {
                window.EpisodeLibrary.open();
            });
        } else {
            // Find the header actions container for dynamic creation
            const headerActions = document.querySelector('.header-actions');
            if (!headerActions) {
                // Retry after a short delay
                setTimeout(addLibraryButton, 100);
                return;
            }

            // Create the Episode Library button
            libraryButton = document.createElement('button');
        libraryButton.className = 'episode-library-btn';
        libraryButton.innerHTML = `
            <span class="library-text">Episode Library</span>
        `;
        libraryButton.setAttribute('aria-label', 'Open Episode Library');
        libraryButton.title = 'Browse all analyzed episodes';

        // Add styles for the button
        const style = document.createElement('style');
        style.textContent = `
            .episode-library-btn {
                display: flex;
                align-items: center;
                padding: 10px 20px;
                background: white;
                border: 1px solid var(--gray-200);
                border-radius: 8px;
                color: var(--deep-ink);
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                white-space: nowrap;
                min-width: 140px;
                justify-content: center;
            }

            .episode-library-btn:hover {
                background: var(--light-sage);
                border-color: var(--sage);
                transform: translateY(-1px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
            }

            .episode-library-btn:active {
                transform: translateY(0);
                box-shadow: none;
            }

            .library-text {
                font-weight: 500;
            }

            /* Responsive - hide text on small screens */
            @media (max-width: 768px) {
                .library-text {
                    display: none;
                }
                
                .episode-library-btn {
                    padding: 10px 12px;
                }
            }
        `;
        document.head.appendChild(style);

            // Insert before the portfolio button
            const portfolioButton = headerActions.querySelector('.portfolio-button');
            if (portfolioButton) {
                headerActions.insertBefore(libraryButton, portfolioButton);
            } else {
                headerActions.appendChild(libraryButton);
            }

            // Add click handler
            libraryButton.addEventListener('click', () => {
                window.EpisodeLibrary.open();
            });
        }

        // Add keyboard shortcut (Cmd/Ctrl + L) - outside the if/else
        // Only add it once
        if (!window.episodeLibraryShortcutAdded) {
            window.episodeLibraryShortcutAdded = true;
            document.addEventListener('keydown', (e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === 'l') {
                    e.preventDefault();
                    window.EpisodeLibrary.open();
                }
            });
        }
    }
})();