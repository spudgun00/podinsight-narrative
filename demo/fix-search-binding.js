/**
 * Enhanced VCPulse Search with improved keyboard shortcut handling
 * This version addresses common issues with ⌘K not working
 */

class VCPulseSearchFixed extends VCPulseSearch {
    constructor() {
        super();
        this.boundHandleGlobalKeydown = null;
    }
    
    bindEvents() {
        // Call parent bindEvents first
        super.bindEvents();
        
        // Remove existing listener if any
        if (this.boundHandleGlobalKeydown) {
            document.removeEventListener('keydown', this.boundHandleGlobalKeydown);
        }
        
        // Create properly bound handler
        this.boundHandleGlobalKeydown = this.handleGlobalKeydown.bind(this);
        
        // Add listener with capture phase to intercept before browser
        document.addEventListener('keydown', this.boundHandleGlobalKeydown, true);
        
        // Also add to window for redundancy
        window.addEventListener('keydown', this.boundHandleGlobalKeydown, true);
        
        console.log('Enhanced keyboard event listeners attached');
    }
    
    handleGlobalKeydown(e) {
        console.log('Enhanced handler - Key:', e.key, 'Meta:', e.metaKey, 'Ctrl:', e.ctrlKey);
        
        // Check for Cmd/Ctrl + K
        if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
            console.log('⌘K/Ctrl+K intercepted!');
            
            // Prevent ALL default behaviors
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            
            // Return false for legacy browser support
            if (e.returnValue !== undefined) {
                e.returnValue = false;
            }
            
            console.log('Search input element:', this.searchInput);
            
            // Focus search immediately (no scroll needed if in viewport)
            if (this.searchInput) {
                // Check if search is in viewport
                const rect = this.searchInput.getBoundingClientRect();
                const isInViewport = rect.top >= 0 && rect.bottom <= window.innerHeight;
                
                if (!isInViewport) {
                    // Scroll to top if not visible
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    
                    // Delay focus until scroll completes
                    setTimeout(() => {
                        this.focusSearch();
                    }, 300);
                } else {
                    // Focus immediately if visible
                    this.focusSearch();
                }
            } else {
                console.error('Search input not found!');
                // Try to find and initialize
                this.searchInput = document.getElementById('searchInput');
                if (this.searchInput) {
                    console.log('Search input found after retry');
                    this.focusSearch();
                }
            }
            
            return false; // Extra prevention
        }
        
        // ESC to close results
        if (e.key === 'Escape' && this.searchResults?.classList.contains('active')) {
            this.closeResults();
        }
    }
    
    focusSearch() {
        if (!this.searchInput) return;
        
        console.log('Focusing search input...');
        
        // Remove any existing focus
        if (document.activeElement && document.activeElement !== this.searchInput) {
            document.activeElement.blur();
        }
        
        // Focus with retry mechanism
        const attemptFocus = (attempts = 0) => {
            if (attempts > 3) {
                console.error('Failed to focus search after 3 attempts');
                return;
            }
            
            this.searchInput.focus();
            
            // Verify focus was successful
            setTimeout(() => {
                if (document.activeElement === this.searchInput) {
                    console.log('Search input focused successfully');
                    this.searchInput.select(); // Select existing text
                    
                    // Trigger focus event manually if needed
                    const focusEvent = new Event('focus', { bubbles: true });
                    this.searchInput.dispatchEvent(focusEvent);
                } else {
                    console.log(`Focus attempt ${attempts + 1} failed, retrying...`);
                    attemptFocus(attempts + 1);
                }
            }, 50);
        };
        
        attemptFocus();
    }
    
    // Clean up on destroy
    destroy() {
        if (this.boundHandleGlobalKeydown) {
            document.removeEventListener('keydown', this.boundHandleGlobalKeydown, true);
            window.removeEventListener('keydown', this.boundHandleGlobalKeydown, true);
        }
        
        // Clear intervals
        if (this.placeholderInterval) {
            clearInterval(this.placeholderInterval);
        }
    }
}

// Replace the global instance with the fixed version
if (window.vcPulseSearch) {
    // Destroy old instance if it has destroy method
    if (typeof window.vcPulseSearch.destroy === 'function') {
        window.vcPulseSearch.destroy();
    }
}

// Create new instance with fixes
window.vcPulseSearch = new VCPulseSearchFixed();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.vcPulseSearch.init();
        console.log('VCPulseSearchFixed initialized on DOMContentLoaded');
    });
} else {
    window.vcPulseSearch.init();
    console.log('VCPulseSearchFixed initialized immediately');
}

// Add diagnostic info
console.log('VCPulse Search Fix loaded. Press ⌘K to test.');

// Add visual indicator that fix is loaded
document.addEventListener('DOMContentLoaded', () => {
    const shortcutHint = document.querySelector('.shortcut-hint');
    if (shortcutHint) {
        shortcutHint.style.background = '#4a7c59';
        shortcutHint.style.color = 'white';
        setTimeout(() => {
            shortcutHint.style.background = '';
            shortcutHint.style.color = '';
        }, 2000);
    }
});