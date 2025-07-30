// Data Validator for Unified Data Structure
// Ensures data integrity and consistency across the platform
// Version: 1.0.0
// Last Updated: 2025-07-28

class DataValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        
        // Define expected structure
        this.schema = {
            meta: {
                required: ['version', 'lastUpdated', 'dataWeek', 'analysis'],
                dataWeek: ['number', 'year', 'range'],
                analysis: ['episodesAnalyzed', 'podcastsTracked', 'hoursAnalyzed']
            },
            ui: {
                required: ['header'],
                header: {
                    required: ['ticker', 'search'],
                    search: ['suggestions', 'trendingTopics', 'quickFilters']
                }
            },
            narrativePulse: {
                required: ['config', 'topics'],
                topics: {
                    minCount: 4,
                    requiredFields: ['color', 'momentum', 'mentions', 'episodes', 'chartData']
                }
            },
            priorityBriefings: {
                required: ['items'],
                items: {
                    minCount: 3,
                    requiredFields: ['id', 'priority', 'podcast', 'title', 'guest', 'keyInsights', 'signals']
                }
            },
            intelligenceBrief: {
                required: ['summary', 'metrics'],
                metrics: ['velocityTracking', 'influenceMetrics', 'consensusMonitor', 'topicCorrelations']
            },
            weeklyBrief: {
                required: ['executive', 'keyMetrics', 'topicMomentum', 'podcastHighlights']
            }
        };
    }
    
    validate(data = window.unifiedData) {
        this.errors = [];
        this.warnings = [];
        
        if (!data) {
            this.errors.push('No unified data found');
            return this.getResults();
        }
        
        // Validate top-level structure
        this.validateTopLevel(data);
        
        // Validate metadata
        this.validateMeta(data.meta);
        
        // Validate UI configuration
        this.validateUI(data.ui);
        
        // Validate narrative pulse
        this.validateNarrativePulse(data.narrativePulse);
        
        // Validate priority briefings
        this.validatePriorityBriefings(data.priorityBriefings);
        
        // Validate intelligence brief
        this.validateIntelligenceBrief(data.intelligenceBrief);
        
        // Validate weekly brief
        this.validateWeeklyBrief(data.weeklyBrief);
        
        // Cross-validation checks
        this.crossValidate(data);
        
        return this.getResults();
    }
    
    validateTopLevel(data) {
        const required = ['meta', 'ui', 'narrativePulse', 'narrativeFeed', 
                         'notableSignals', 'priorityBriefings', 'intelligenceBrief', 
                         'weeklyBrief'];
        
        required.forEach(field => {
            if (!data[field]) {
                this.errors.push(`Missing required top-level field: ${field}`);
            }
        });
    }
    
    validateMeta(meta) {
        if (!meta) return;
        
        // Check version format
        if (meta.version && !/^\d+\.\d+\.\d+$/.test(meta.version)) {
            this.warnings.push('Version should follow semantic versioning (x.y.z)');
        }
        
        // Check date format
        if (meta.lastUpdated && !Date.parse(meta.lastUpdated)) {
            this.errors.push('Invalid date format in meta.lastUpdated');
        }
        
        // Validate analysis metrics
        if (meta.analysis) {
            const { episodesAnalyzed, podcastsTracked, hoursAnalyzed } = meta.analysis;
            
            if (episodesAnalyzed && episodesAnalyzed < 0) {
                this.errors.push('Episodes analyzed cannot be negative');
            }
            
            if (hoursAnalyzed && episodesAnalyzed) {
                const avgHoursPerEpisode = hoursAnalyzed / episodesAnalyzed;
                if (avgHoursPerEpisode > 3) {
                    this.warnings.push('Average hours per episode seems high (>3 hours)');
                }
            }
        }
    }
    
    validateUI(ui) {
        if (!ui) return;
        
        // Validate ticker items
        if (ui.header && ui.header.ticker) {
            if (ui.header.ticker.length < 3) {
                this.warnings.push('Ticker should have at least 3 items');
            }
            
            ui.header.ticker.forEach((item, index) => {
                if (!item.label || !item.value) {
                    this.errors.push(`Ticker item ${index} missing label or value`);
                }
            });
        }
        
        // Validate search suggestions
        if (ui.header && ui.header.search && ui.header.search.suggestions) {
            if (ui.header.search.suggestions.length < 3) {
                this.warnings.push('Should have at least 3 search suggestions');
            }
        }
    }
    
    validateNarrativePulse(narrativePulse) {
        if (!narrativePulse || !narrativePulse.topics) return;
        
        const topics = narrativePulse.topics;
        const topicNames = Object.keys(topics);
        
        if (topicNames.length < this.schema.narrativePulse.topics.minCount) {
            this.errors.push(`Need at least ${this.schema.narrativePulse.topics.minCount} topics`);
        }
        
        topicNames.forEach(topicName => {
            const topic = topics[topicName];
            
            // Validate required fields
            this.schema.narrativePulse.topics.requiredFields.forEach(field => {
                if (!topic[field]) {
                    this.errors.push(`Topic "${topicName}" missing required field: ${field}`);
                }
            });
            
            // Validate momentum format
            if (topic.momentum && !/^[+-]\d+%$/.test(topic.momentum)) {
                this.errors.push(`Topic "${topicName}" has invalid momentum format`);
            }
            
            // Validate color format
            if (topic.color && !/^#[0-9A-Fa-f]{6}$/.test(topic.color)) {
                this.errors.push(`Topic "${topicName}" has invalid color format`);
            }
            
            // Validate chart data
            if (topic.chartData) {
                ['7d', '30d', '90d'].forEach(timeframe => {
                    if (!topic.chartData[timeframe]) {
                        this.warnings.push(`Topic "${topicName}" missing ${timeframe} chart data`);
                    }
                });
            }
        });
    }
    
    validatePriorityBriefings(priorityBriefings) {
        if (!priorityBriefings || !priorityBriefings.items) return;
        
        const items = priorityBriefings.items;
        
        if (items.length < this.schema.priorityBriefings.items.minCount) {
            this.errors.push(`Need at least ${this.schema.priorityBriefings.items.minCount} priority briefings`);
        }
        
        const seenIds = new Set();
        
        items.forEach((briefing, index) => {
            // Check for duplicate IDs
            if (seenIds.has(briefing.id)) {
                this.errors.push(`Duplicate briefing ID: ${briefing.id}`);
            }
            seenIds.add(briefing.id);
            
            // Validate required fields
            this.schema.priorityBriefings.items.requiredFields.forEach(field => {
                if (!briefing[field]) {
                    this.errors.push(`Briefing ${index} missing required field: ${field}`);
                }
            });
            
            // Validate priority values
            if (briefing.priority && !['critical', 'opportunity', 'elevated'].includes(briefing.priority)) {
                this.errors.push(`Briefing ${briefing.id} has invalid priority: ${briefing.priority}`);
            }
            
            // Validate signals
            if (briefing.signals && briefing.signals.length === 0) {
                this.warnings.push(`Briefing ${briefing.id} has no signals`);
            }
        });
    }
    
    validateIntelligenceBrief(intelligenceBrief) {
        if (!intelligenceBrief) return;
        
        // Validate metrics
        if (intelligenceBrief.metrics) {
            const metrics = intelligenceBrief.metrics;
            
            // Check velocity tracking
            if (metrics.velocityTracking && metrics.velocityTracking.length < 3) {
                this.warnings.push('Velocity tracking should have at least 3 items');
            }
            
            // Validate percentage formats
            if (metrics.velocityTracking) {
                metrics.velocityTracking.forEach((item, index) => {
                    if (item.change && !/^[+-]\d+%$/.test(item.change)) {
                        this.errors.push(`Velocity tracking item ${index} has invalid change format`);
                    }
                });
            }
        }
    }
    
    validateWeeklyBrief(weeklyBrief) {
        if (!weeklyBrief) return;
        
        // Check executive summary
        if (weeklyBrief.executive && weeklyBrief.executive.summary) {
            if (weeklyBrief.executive.summary.length < 100) {
                this.warnings.push('Executive summary seems too short');
            }
        }
        
        // Validate metrics
        if (weeklyBrief.keyMetrics) {
            weeklyBrief.keyMetrics.forEach((metric, index) => {
                if (!metric.label || !metric.value) {
                    this.errors.push(`Key metric ${index} missing label or value`);
                }
            });
        }
    }
    
    crossValidate(data) {
        // Check consistency between different sections
        
        // 1. Topics mentioned in weekly brief should exist in narrative pulse
        if (data.weeklyBrief && data.weeklyBrief.topicMomentum && data.narrativePulse && data.narrativePulse.topics) {
            const pulseTopic = Object.keys(data.narrativePulse.topics);
            data.weeklyBrief.topicMomentum.forEach(topic => {
                if (!pulseTopic.includes(topic.topic)) {
                    this.warnings.push(`Topic "${topic.topic}" in weekly brief not found in narrative pulse`);
                }
            });
        }
        
        // 2. Briefings count consistency
        if (data.priorityBriefings && data.meta && data.meta.analysis) {
            const briefingCount = data.priorityBriefings.items.length;
            const episodesAnalyzed = data.meta.analysis.episodesAnalyzed;
            
            if (briefingCount > episodesAnalyzed) {
                this.errors.push('More briefings than episodes analyzed');
            }
        }
        
        // 3. Data freshness
        if (data.meta && data.meta.lastUpdated) {
            const lastUpdate = new Date(data.meta.lastUpdated);
            const now = new Date();
            const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);
            
            if (daysSinceUpdate > 7) {
                this.warnings.push('Data is more than 7 days old');
            }
        }
    }
    
    getResults() {
        return {
            valid: this.errors.length === 0,
            errors: this.errors,
            warnings: this.warnings,
            summary: {
                errorCount: this.errors.length,
                warningCount: this.warnings.length,
                status: this.errors.length === 0 ? 'VALID' : 'INVALID'
            }
        };
    }
    
    // Utility method to validate and fix data
    autoFix(data = window.unifiedData) {
        const fixes = [];
        
        // Fix momentum formats
        if (data.narrativePulse && data.narrativePulse.topics) {
            Object.entries(data.narrativePulse.topics).forEach(([name, topic]) => {
                if (topic.momentum && !topic.momentum.startsWith('+') && !topic.momentum.startsWith('-')) {
                    const value = parseInt(topic.momentum);
                    if (value >= 0) {
                        topic.momentum = `+${topic.momentum}`;
                        fixes.push(`Fixed momentum format for ${name}`);
                    }
                }
            });
        }
        
        // Add missing chart data structure
        if (data.narrativePulse && data.narrativePulse.topics) {
            Object.entries(data.narrativePulse.topics).forEach(([name, topic]) => {
                if (!topic.chartData) {
                    topic.chartData = {
                        '7d': { points: [], labels: [] },
                        '30d': { points: [], labels: [] },
                        '90d': { points: [], labels: [] }
                    };
                    fixes.push(`Added missing chart data structure for ${name}`);
                }
            });
        }
        
        return {
            fixes: fixes,
            data: data
        };
    }
}

// Create global validator instance
window.dataValidator = new DataValidator();

// Auto-validate on load if unified data exists
if (window.unifiedData) {
    console.log('Running data validation...');
    const results = window.dataValidator.validate();
    
    if (!results.valid) {
        console.error('Data validation failed:', results.errors);
    } else {
        console.log('Data validation passed!');
    }
    
    if (results.warnings.length > 0) {
        console.warn('Data validation warnings:', results.warnings);
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataValidator;
}