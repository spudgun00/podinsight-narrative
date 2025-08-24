// Customization Panel Component
// Clean architecture avoiding existing technical debt issues

const CustomizationPanel = {
    // Preset podcast groups
    PRESETS: {
        signal: ['20VC', 'All-In', 'BG2Pod', 'Acquired'],
        broad: ['20VC', 'All-In', 'InvestLike', 'TimFerriss', 'Acquired', 'BG2Pod', 'MyFirstMillion', 'Founders']
    },

    // Default topic selections
    DEFAULT_TOPICS: ['ai-infrastructure', 'defense-tech', 'enterprise-agents', 'exit-strategies', 'vertical-ai', 'traditional-saas', 'climate-tech'],

    // Component state - single source of truth
    state: {
        isOpen: false,
        presetMode: 'all',
        selectedPodcasts: [],
        selectedTopics: [],
        expandedGroups: {
            signal: false,
            broad: false
        }
    },

    // Initialize the component
    init() {
        console.log('[CustomizationPanel] Initializing...');
        const elementsFound = this.cacheElements();
        if (!elementsFound) {
            console.error('[CustomizationPanel] Failed to find required elements');
            return false;
        }
        this.bindEvents();
        this.loadDefaults();
        this.updatePreview();
        console.log('[CustomizationPanel] Initialization complete');
        return true;
    },

    // Cache DOM elements for performance
    cacheElements() {
        this.panel = document.querySelector('.customization-panel');
        this.backdrop = document.querySelector('.customization-backdrop');
        
        if (!this.panel) {
            console.error('[CustomizationPanel] Panel element not found (.customization-panel)');
            return false;
        }
        if (!this.backdrop) {
            console.error('[CustomizationPanel] Backdrop element not found (.customization-backdrop)');
            return false;
        }
        
        this.closeBtn = this.panel.querySelector('.close-button');
        this.applyBtn = this.panel.querySelector('.apply-changes');
        this.resetBtn = this.panel.querySelector('.reset-defaults');
        
        // Podcast elements
        this.presetRadios = this.panel?.querySelectorAll('input[name="podcast-preset"]');
        this.expandableGroups = this.panel?.querySelectorAll('.preset-option.expandable');
        this.podcastCheckboxes = this.panel?.querySelectorAll('.preset-podcasts input[type="checkbox"]');
        
        // Topic elements
        this.topicCheckboxes = this.panel?.querySelectorAll('.topic-grid input[type="checkbox"]');
        this.selectAllBtn = this.panel?.querySelector('.select-all');
        this.clearAllBtn = this.panel?.querySelector('.clear-all');
        
        // Preview elements
        this.podcastCount = this.panel?.querySelector('#podcastCount');
        this.topicCount = this.panel?.querySelector('#topicCount');
        this.coveragePercent = this.panel?.querySelector('.coverage-percent');
        this.podcastSelectedCount = this.panel?.querySelector('#podcastSelectedCount');
        
        console.log('[CustomizationPanel] Elements cached:', {
            panel: !!this.panel,
            backdrop: !!this.backdrop,
            closeBtn: !!this.closeBtn,
            applyBtn: !!this.applyBtn,
            resetBtn: !!this.resetBtn
        });
        
        return true;
    },

    // Bind event handlers
    bindEvents() {
        // Panel controls
        this.closeBtn?.addEventListener('click', () => this.close());
        this.backdrop?.addEventListener('click', () => this.close());
        this.applyBtn?.addEventListener('click', () => this.applyFilters());
        this.resetBtn?.addEventListener('click', () => this.resetToDefaults());
        
        // Preset radio changes
        this.presetRadios?.forEach(radio => {
            radio.addEventListener('change', (e) => this.handlePresetChange(e.target.value));
        });
        
        // Expandable groups
        this.expandableGroups?.forEach(group => {
            const header = group.querySelector('.preset-header');
            header?.addEventListener('click', (e) => {
                if (!e.target.matches('input[type="radio"]')) {
                    this.toggleExpanded(group);
                }
            });
        });
        
        // Individual podcast changes
        this.podcastCheckboxes?.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.handleIndividualPodcastChange());
        });
        
        // Topic controls
        this.selectAllBtn?.addEventListener('click', () => this.selectAllTopics());
        this.clearAllBtn?.addEventListener('click', () => this.clearAllTopics());
        
        this.topicCheckboxes?.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateTopicSelection());
        });
        
        // ESC key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.state.isOpen) {
                this.close();
            }
        });
    },

    // Load default selections
    loadDefaults() {
        this.state.presetMode = 'all';
        this.state.selectedPodcasts = [...this.PRESETS.signal, ...this.PRESETS.broad];
        this.state.selectedTopics = [...this.DEFAULT_TOPICS];
    },

    // Open the panel
    open() {
        console.log('[CustomizationPanel] Opening panel...');
        
        if (!this.panel || !this.backdrop) {
            console.error('[CustomizationPanel] Cannot open - panel or backdrop not found');
            return;
        }
        
        this.state.isOpen = true;
        
        // Update DOM state
        this.panel.setAttribute('data-state', 'open');
        this.backdrop.style.setProperty('display', 'block');
        
        // Trigger animations
        requestAnimationFrame(() => {
            this.backdrop.classList.add('active');
            this.panel.style.setProperty('right', '0');
            console.log('[CustomizationPanel] Panel opened');
        });
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    },

    // Close the panel
    close() {
        this.state.isOpen = false;
        
        // Update DOM state
        this.panel?.setAttribute('data-state', 'closed');
        this.panel?.style.setProperty('right', '-850px');
        this.backdrop?.classList.remove('active');
        
        // Hide backdrop after animation
        setTimeout(() => {
            this.backdrop?.style.setProperty('display', 'none');
        }, 300);
        
        // Restore body scroll
        document.body.style.overflow = '';
    },

    // Handle preset radio change
    handlePresetChange(value) {
        this.state.presetMode = value;
        
        // Update podcast selections based on preset
        switch(value) {
            case 'all':
                this.state.selectedPodcasts = [...this.PRESETS.signal, ...this.PRESETS.broad];
                this.disableAllPodcastCheckboxes();
                break;
            case 'signal':
                this.state.selectedPodcasts = [...this.PRESETS.signal];
                this.updatePodcastCheckboxes('signal');
                break;
            case 'broad':
                this.state.selectedPodcasts = [...this.PRESETS.broad];
                this.updatePodcastCheckboxes('broad');
                break;
        }
        
        this.updatePreview();
    },

    // Handle individual podcast checkbox change
    handleIndividualPodcastChange() {
        // Switch to custom mode if user modifies individual selections
        const checkedPodcasts = Array.from(this.podcastCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        // Check if selections match a preset
        const matchesSignal = this.arraysEqual(checkedPodcasts, this.PRESETS.signal);
        const matchesBroad = this.arraysEqual(checkedPodcasts, this.PRESETS.broad);
        
        if (!matchesSignal && !matchesBroad) {
            // Switch to custom mode (no radio selected)
            this.presetRadios?.forEach(radio => radio.checked = false);
            this.state.presetMode = 'custom';
            this.state.selectedPodcasts = checkedPodcasts;
            
            // Enable all checkboxes for custom mode
            this.podcastCheckboxes?.forEach(cb => cb.disabled = false);
        }
        
        this.updatePreview();
    },

    // Update podcast checkboxes based on preset
    updatePodcastCheckboxes(preset) {
        const selectedPodcasts = this.PRESETS[preset];
        
        this.podcastCheckboxes?.forEach(checkbox => {
            checkbox.checked = selectedPodcasts.includes(checkbox.value);
            checkbox.disabled = true; // Disable when preset is active
        });
    },

    // Disable all podcast checkboxes (for "All" preset)
    disableAllPodcastCheckboxes() {
        this.podcastCheckboxes?.forEach(checkbox => {
            checkbox.checked = true;
            checkbox.disabled = true;
        });
    },

    // Toggle expanded state of preset group
    toggleExpanded(group) {
        const podcastsDiv = group.querySelector('.preset-podcasts');
        const icon = group.querySelector('.expand-icon');
        const isExpanded = podcastsDiv?.getAttribute('data-expanded') === 'true';
        
        if (podcastsDiv) {
            podcastsDiv.setAttribute('data-expanded', !isExpanded);
            
            // Animate height
            if (!isExpanded) {
                podcastsDiv.style.maxHeight = podcastsDiv.scrollHeight + 'px';
                icon?.classList.add('rotated');
            } else {
                podcastsDiv.style.maxHeight = '0';
                icon?.classList.remove('rotated');
            }
        }
    },

    // Topic selection methods
    selectAllTopics() {
        this.topicCheckboxes?.forEach(checkbox => checkbox.checked = true);
        this.updateTopicSelection();
    },

    clearAllTopics() {
        this.topicCheckboxes?.forEach(checkbox => checkbox.checked = false);
        this.updateTopicSelection();
    },

    updateTopicSelection() {
        this.state.selectedTopics = Array.from(this.topicCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        this.updatePreview();
    },

    // Update preview section
    updatePreview() {
        const podcastCount = this.state.presetMode === 'all' ? 60 : this.state.selectedPodcasts.length;
        const topicCount = this.state.selectedTopics.length;
        const coverage = this.calculateCoverage(podcastCount, topicCount);
        
        // Update counts
        if (this.podcastCount) this.podcastCount.textContent = podcastCount;
        if (this.topicCount) this.topicCount.textContent = topicCount;
        if (this.coveragePercent) this.coveragePercent.textContent = `~${coverage}%`;
        if (this.podcastSelectedCount) {
            this.podcastSelectedCount.textContent = `(${podcastCount} selected)`;
        }
    },

    // Calculate content coverage percentage
    calculateCoverage(podcastCount, topicCount) {
        // Simple formula: (selected / total) * 100
        const totalPodcasts = 60;
        const totalTopics = 8;
        
        const podcastCoverage = (podcastCount / totalPodcasts);
        const topicCoverage = (topicCount / totalTopics);
        
        // Average of both coverages
        return Math.round((podcastCoverage * topicCoverage) * 100);
    },

    // Apply filters to dashboard
    applyFilters() {
        // Show loading state
        this.showLoading();
        
        // Calculate coverage for subtitle
        const podcastCount = this.state.presetMode === 'all' ? 60 : this.state.selectedPodcasts.length;
        const topicCount = this.state.selectedTopics.length;
        const coverage = this.calculateCoverage(podcastCount, topicCount);
        
        // Emit custom event with filter data
        const filterEvent = new CustomEvent('customizationApplied', {
            detail: {
                presetMode: this.state.presetMode,
                podcasts: this.state.selectedPodcasts,
                topics: this.state.selectedTopics,
                coverage: coverage
            }
        });
        document.dispatchEvent(filterEvent);
        
        // Update dashboard subtitle
        this.updateDashboardSubtitle(podcastCount, topicCount);
        
        // Show toast notification
        this.showToast('Dashboard updated');
        
        // Close panel after delay
        setTimeout(() => {
            this.hideLoading();
            this.close();
        }, 1000);
    },

    // Reset to default selections
    resetToDefaults() {
        // Reset state
        this.loadDefaults();
        
        // Reset UI
        const allRadio = this.panel?.querySelector('input[value="all"]');
        if (allRadio) allRadio.checked = true;
        
        this.disableAllPodcastCheckboxes();
        
        // Reset topics to defaults
        this.topicCheckboxes?.forEach(checkbox => {
            checkbox.checked = this.DEFAULT_TOPICS.includes(checkbox.value);
        });
        
        this.updatePreview();
    },

    // Update dashboard subtitle to show active filters
    updateDashboardSubtitle(podcastCount, topicCount) {
        const subtitle = document.querySelector('.dashboard-subtitle');
        if (subtitle) {
            if (this.state.presetMode === 'all') {
                subtitle.textContent = 'Tracking all podcasts and topics';
            } else {
                subtitle.textContent = `Filtered: ${podcastCount} podcasts, ${topicCount} topics`;
            }
        }
    },

    // Loading state
    showLoading() {
        if (this.applyBtn) {
            this.applyBtn.classList.add('loading');
            this.applyBtn.innerHTML = '<span class="spinner"></span> Applying...';
        }
    },

    hideLoading() {
        if (this.applyBtn) {
            this.applyBtn.classList.remove('loading');
            this.applyBtn.textContent = 'Apply Changes';
        }
    },

    // Show toast notification
    showToast(message) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Utility: Check if arrays are equal
    arraysEqual(a, b) {
        if (a.length !== b.length) return false;
        const sortedA = [...a].sort();
        const sortedB = [...b].sort();
        return sortedA.every((val, i) => val === sortedB[i]);
    }
};

// Export for use in main.js
window.CustomizationPanel = CustomizationPanel;