// Weekly Brief Generator
// Generates the weekly intelligence brief HTML from unified data
// Replaces hardcoded content in weekly-brief.html with dynamic data

class WeeklyBriefGenerator {
    constructor(data) {
        this.data = data || window.unifiedData;
        if (!this.data) {
            throw new Error('Unified data not available');
        }
    }

    // Generate complete HTML for weekly brief
    generateHTML() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>synthea.ai - Weekly Intelligence Brief</title>
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='44' height='44' fill='white'/%3E%3Cdefs%3E%3CclipPath id='c1'%3E%3Ccircle r='13' cx='14' cy='16'/%3E%3C/clipPath%3E%3CclipPath id='c2'%3E%3Ccircle r='13' cx='30' cy='16'/%3E%3C/clipPath%3E%3CclipPath id='c3'%3E%3Ccircle r='13' cx='22' cy='30'/%3E%3C/clipPath%3E%3C/defs%3E%3Cg clip-path='url(%23c1)'%3E%3Ccircle r='13' cx='30' cy='16' fill='%234a7c59' fill-opacity='0.3'/%3E%3C/g%3E%3Cg clip-path='url(%23c1)'%3E%3Ccircle r='13' cx='22' cy='30' fill='%234a7c59' fill-opacity='0.3'/%3E%3C/g%3E%3Cg clip-path='url(%23c2)'%3E%3Ccircle r='13' cx='22' cy='30' fill='%234a7c59' fill-opacity='0.3'/%3E%3C/g%3E%3Cg clip-path='url(%23c1)'%3E%3Cg clip-path='url(%23c2)'%3E%3Ccircle r='13' cx='22' cy='30' fill='%234a7c59' fill-opacity='0.6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E">
    
    ${this.generateStyles()}
</head>
<body>
    <div class="container">
        ${this.generateHeader()}
        <div class="content">
            ${this.generateExecutiveSummary()}
            ${this.generateKeyMetrics()}
            ${this.generateTopicMomentum()}
            ${this.generateConsensusForming()}
            ${this.generateAlertsSection()}
            ${this.generateActionItems()}
            ${this.generateFooter()}
        </div>
    </div>
</body>
</html>`;
    }

    // Generate styles (unchanged from original)
    generateStyles() {
        return `<style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background: #0A0A0A;
            color: #111827;
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }
        
        /* Layout */
        .container {
            max-width: 850px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            min-height: 1100px;
            position: relative;
            overflow: hidden;
        }
        
        /* Gradient Accent */
        .container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #4a7c59 0%, #5a8c69 50%, #4a7c59 100%);
            background-size: 200% 100%;
            animation: shimmer 3s ease-in-out infinite;
        }
        
        /* Watermark Effect */
        .container::after {
            content: 'CONFIDENTIAL';
            position: absolute;
            bottom: 50%;
            right: -100px;
            transform: rotate(-45deg);
            font-size: 120px;
            font-weight: 800;
            color: rgba(0, 0, 0, 0.02);
            letter-spacing: 0.1em;
            pointer-events: none;
            z-index: 1;
        }
        
        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        
        /* Header */
        .header {
            background: #FAFAF8;
            border-bottom: 1px solid #E8E8E8;
            height: 64px;
            display: flex;
            align-items: center;
            position: relative;
            z-index: 2;
        }
        
        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            padding: 0 32px;
            position: relative;
        }
        
        .logo-section {
            display: flex;
            align-items: center;
            width: auto;
        }
        
        .logo-container {
            display: flex;
            align-items: center;
            gap: 2px;
        }
        
        .logo-mark {
            width: 39px;
            height: 39px;
            transform: translateY(6px);
            transition: opacity 0.2s ease;
            cursor: pointer;
        }
        
        .logo-text {
            display: flex;
            flex-direction: column;
            gap: 2px;
            justify-content: space-between;
        }
        
        .logo {
            font-family: 'Inter', sans-serif;
            font-size: 17px;
            font-weight: 600;
            color: #2C2C2C;
            line-height: 1;
            letter-spacing: 0.11em;
        }
        
        .tagline {
            font-family: 'Inter', sans-serif;
            font-size: 9px;
            font-weight: 400;
            color: #B5B5B5;
            line-height: 1;
            letter-spacing: 0.01em;
            text-transform: lowercase;
        }
        
        .report-title {
            font-family: 'Inter', sans-serif;
            font-size: 20px;
            font-weight: 600;
            color: #2C2C2C;
            letter-spacing: 0.02em;
            text-transform: uppercase;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .report-date {
            font-family: 'Inter', sans-serif;
            font-size: 11.2px;
            font-weight: 400;
            color: #6B6B6B;
        }
        
        /* Content */
        .content {
            padding: 32px 40px;
            background: #FAFAFA;
            position: relative;
            z-index: 2;
        }
        
        /* Cards */
        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid rgba(229, 231, 235, 0.5);
            padding: 28px;
            margin-bottom: 24px;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, #16a34a, transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .card:hover {
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
            transform: translateY(-2px);
        }
        
        .card:hover::before {
            opacity: 1;
        }
        
        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
        }
        
        .card-title {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
        }
        
        .card-meta {
            font-size: 14px;
            color: #6B7280;
        }
        
        /* Executive Summary */
        .summary-text {
            color: #374151;
            line-height: 1.8;
            font-size: 15px;
        }
        
        .summary-text p {
            margin-bottom: 16px;
            position: relative;
            padding-left: 20px;
        }
        
        .summary-text p::before {
            content: '▸';
            position: absolute;
            left: 0;
            color: #16a34a;
            font-weight: 700;
        }
        
        .summary-text p:last-child {
            margin-bottom: 0;
        }
        
        .summary-text strong {
            font-weight: 700;
            color: #111827;
            background: linear-gradient(to bottom, transparent 60%, rgba(22, 163, 74, 0.1) 60%);
            padding: 0 2px;
        }
        
        .contrarian {
            color: #D97706;
            font-weight: 700;
            background: linear-gradient(to bottom, transparent 60%, rgba(217, 119, 6, 0.1) 60%);
            padding: 0 2px;
        }
        
        .blindspot {
            color: #DC2626;
            font-weight: 700;
            background: linear-gradient(to bottom, transparent 60%, rgba(220, 38, 38, 0.1) 60%);
            padding: 0 2px;
        }
        
        /* Metrics Grid */
        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 32px;
        }
        
        .metric-card {
            background: linear-gradient(135deg, #FFFFFF 0%, #FAFAFA 100%);
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(229, 231, 235, 0.5);
            padding: 20px;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
        }
        
        .metric-card::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, #16a34a, #22c55e);
            transform: translateX(-100%);
            transition: transform 0.3s ease;
        }
        
        .metric-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .metric-card:hover::after {
            transform: translateX(0);
        }
        
        .metric-label {
            font-size: 11px;
            color: #6B7280;
            text-transform: uppercase;
            margin-bottom: 8px;
            font-weight: 600;
            letter-spacing: 0.05em;
        }
        
        .metric-value {
            font-size: 32px;
            font-weight: 800;
            color: #111827;
            line-height: 1;
        }
        
        .metric-context {
            font-size: 14px;
            color: #6B7280;
            margin-top: 4px;
        }
        
        .metric-change {
            font-size: 12px;
            margin-top: 8px;
        }
        
        .change-up {
            color: #059669;
        }
        
        .change-warn {
            color: #D97706;
        }
        
        /* Topic Momentum */
        .momentum-item {
            margin-bottom: 20px;
            padding: 16px;
            background: rgba(249, 250, 251, 0.5);
            border-radius: 8px;
            transition: all 0.2s ease;
        }
        
        .momentum-item:hover {
            background: rgba(249, 250, 251, 0.8);
            transform: translateX(4px);
        }
        
        .momentum-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }
        
        .momentum-name {
            font-size: 15px;
            font-weight: 600;
            color: #111827;
        }
        
        .momentum-change {
            font-size: 15px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 4px;
        }
        
        .positive {
            color: #059669;
        }
        
        .positive::before {
            content: '↑';
            font-size: 18px;
        }
        
        .negative {
            color: #DC2626;
        }
        
        .negative::before {
            content: '↓';
            font-size: 18px;
        }
        
        .warning {
            color: #D97706;
        }
        
        .progress-bar {
            width: 100%;
            background: rgba(243, 244, 246, 0.8);
            border-radius: 9999px;
            height: 10px;
            overflow: hidden;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        
        .progress-fill {
            height: 100%;
            border-radius: 9999px;
            position: relative;
            overflow: hidden;
        }
        
        .progress-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
            animation: shimmer 2s infinite;
        }
        
        .momentum-context {
            font-size: 12px;
            color: #6B7280;
            margin-top: 4px;
        }
        
        /* Consensus Items */
        .consensus-item {
            background: linear-gradient(135deg, #FFFFFF 0%, #F9FAFB 100%);
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(229, 231, 235, 0.3);
            padding: 20px;
            margin-bottom: 16px;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .consensus-item:hover {
            transform: translateX(8px);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        }
        
        .consensus-content {
            display: flex;
            gap: 16px;
        }
        
        .consensus-marker {
            width: 4px;
            background: linear-gradient(180deg, #10B981 0%, #059669 100%);
            border-radius: 2px;
            flex-shrink: 0;
        }
        
        .consensus-details h4 {
            font-weight: 500;
            color: #111827;
            margin-bottom: 4px;
        }
        
        .consensus-sources {
            font-size: 12px;
            color: #6B7280;
            margin-bottom: 8px;
        }
        
        .consensus-insight {
            font-size: 14px;
            color: #374151;
        }
        
        /* Alert Boxes */
        .alert-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
            margin-bottom: 32px;
        }
        
        .alert-box {
            border-radius: 12px;
            padding: 24px;
            position: relative;
            overflow: hidden;
        }
        
        .alert-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
        }
        
        .warning-box {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border: 1px solid rgba(252, 211, 77, 0.5);
            box-shadow: 0 4px 6px -1px rgba(217, 119, 6, 0.1);
        }
        
        .warning-box::before {
            background: linear-gradient(90deg, #F59E0B, #D97706);
        }
        
        .danger-box {
            background: linear-gradient(135deg, #FEE2E2 0%, #FECACA 100%);
            border: 1px solid rgba(252, 165, 165, 0.5);
            box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.1);
        }
        
        .danger-box::before {
            background: linear-gradient(90deg, #EF4444, #DC2626);
        }
        
        .alert-item {
            margin-bottom: 12px;
        }
        
        .alert-item:last-child {
            margin-bottom: 0;
        }
        
        .alert-header {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }
        
        .alert-icon {
            width: 16px;
            height: 16px;
        }
        
        .alert-title {
            font-weight: 500;
            color: #111827;
        }
        
        .alert-description {
            font-size: 14px;
            color: #374151;
        }
        
        .alert-context {
            font-size: 12px;
            color: #6B7280;
            margin-top: 4px;
        }
        
        /* Action Items - Premium Dark style */
        .action-box {
            background: linear-gradient(135deg, #1F2937 0%, #111827 100%);
            color: white;
            border-radius: 16px;
            padding: 32px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            position: relative;
            overflow: hidden;
        }
        
        .action-box::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 2px;
            background: linear-gradient(90deg, #16a34a, #22c55e, #16a34a);
            background-size: 200% 100%;
            animation: shimmer 3s ease-in-out infinite;
        }
        
        .action-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 24px;
        }
        
        .action-title {
            font-size: 18px;
            font-weight: 700;
            color: white;
            letter-spacing: -0.025em;
        }
        
        .action-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
        }
        
        .action-section h4 {
            font-size: 12px;
            font-weight: 700;
            color: #10B981;
            text-transform: uppercase;
            margin-bottom: 16px;
            letter-spacing: 0.1em;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .action-section h4::after {
            content: '';
            flex: 1;
            height: 1px;
            background: linear-gradient(90deg, #10B981, transparent);
        }
        
        .action-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 12px;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 8px;
            transition: all 0.2s ease;
        }
        
        .action-item:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateX(4px);
            color: white;
        }
        
        /* Footer */
        .footer {
            margin-top: 40px;
            padding: 32px 0;
            background: linear-gradient(135deg, #FAFAFA 0%, #F3F4F6 100%);
            border-top: 1px solid rgba(229, 231, 235, 0.5);
        }
        
        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 13px;
            color: #6B7280;
            padding: 0 40px;
        }
        
        .footer-brand {
            font-weight: 700;
            font-size: 16px;
            color: #111827;
            letter-spacing: -0.025em;
        }
        
        .footer-right {
            text-align: right;
            line-height: 1.6;
        }
        
        .footer-right p:first-child {
            font-weight: 600;
            color: #374151;
        }
        
        /* Print styles */
        @media print {
            body {
                background: white;
            }
            
            .container {
                box-shadow: none;
                max-width: 100%;
            }
            
            .card {
                break-inside: avoid;
                box-shadow: none;
            }
            
            .alert-grid,
            .metrics-grid {
                break-inside: avoid;
            }
        }
    </style>`;
    }

    // Generate header
    generateHeader() {
        const meta = this.data.meta;
        return `
        <!-- Header -->
        <div class="header">
            <div class="header-content">
                <div class="logo-section">
                    <div class="logo-container">
                        <svg class="logo-mark" width="39" height="39" viewBox="0 0 44 44" xmlns="http://www.w3.org/2000/svg" aria-label="Synthea.ai Logo">
                            <defs>
                                <clipPath id="sage-circle1">
                                    <circle r="13" cx="14" cy="16"></circle>
                                </clipPath>
                                <clipPath id="sage-circle2">
                                    <circle r="13" cx="30" cy="16"></circle>
                                </clipPath>
                                <clipPath id="sage-circle3">
                                    <circle r="13" cx="22" cy="30"></circle>
                                </clipPath>
                            </defs>
                            
                            <!-- Overlap between circle 1 and 2 -->
                            <g clip-path="url(#sage-circle1)">
                                <circle r="13" cx="30" cy="16" fill="#4a7c59" fill-opacity="0.3"></circle>
                            </g>
                            
                            <!-- Overlap between circle 1 and 3 -->
                            <g clip-path="url(#sage-circle1)">
                                <circle r="13" cx="22" cy="30" fill="#4a7c59" fill-opacity="0.3"></circle>
                            </g>
                            
                            <!-- Overlap between circle 2 and 3 -->
                            <g clip-path="url(#sage-circle2)">
                                <circle r="13" cx="22" cy="30" fill="#4a7c59" fill-opacity="0.3"></circle>
                            </g>
                            
                            <!-- Center overlap (all three) -->
                            <g clip-path="url(#sage-circle1)">
                                <g clip-path="url(#sage-circle2)">
                                    <circle r="13" cx="22" cy="30" fill="#4a7c59" fill-opacity="0.6"></circle>
                                </g>
                            </g>
                        </svg>
                        <div class="logo-text">
                            <div class="logo">synthea.ai</div>
                            <div class="tagline">synthesized intelligence</div>
                        </div>
                    </div>
                </div>
                <div class="report-title">WEEKLY INTELLIGENCE BRIEF</div>
                <div class="report-date">${meta.dataWeek.range}</div>
            </div>
        </div>`;
    }

    // Generate executive summary
    generateExecutiveSummary() {
        const summary = this.data.weeklyBrief.executive.summary;
        const lastUpdated = this.data.intelligenceBrief.summary.lastUpdated;
        
        return `
        <!-- Executive Summary -->
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">Executive Summary</h2>
                <span class="card-meta">${lastUpdated}</span>
            </div>
            <div class="summary-text">
                ${summary.map(item => {
                    const className = item.type === 'contrarian' ? 'contrarian' : 
                                    item.type === 'warning' ? 'blindspot' : '';
                    return `<p>
                        <strong${className ? ` class="${className}"` : ''}>${item.text}</strong> ${item.details}
                    </p>`;
                }).join('')}
            </div>
        </div>`;
    }

    // Generate key metrics
    generateKeyMetrics() {
        const metrics = this.data.weeklyBrief.keyMetrics;
        
        return `
        <!-- Key Metrics -->
        <div class="metrics-grid">
            ${metrics.map(metric => `
            <div class="metric-card">
                <p class="metric-label">${metric.label}</p>
                <p class="metric-value">${metric.value}</p>
                <p class="metric-context">${metric.context}</p>
                <div class="metric-change ${metric.changeType === 'up' ? 'change-up' : metric.changeType === 'warn' ? 'change-warn' : ''}">${metric.change}</div>
            </div>
            `).join('')}
        </div>`;
    }

    // Generate topic momentum
    generateTopicMomentum() {
        const topics = this.data.weeklyBrief.topicMomentum;
        
        return `
        <!-- Topic Momentum -->
        <div class="card">
            <h3 class="card-title" style="margin-bottom: 16px;">Topic Momentum This Week</h3>
            
            ${topics.map(topic => {
                const color = this.data.narrativePulse.topics[topic.name]?.color || '#4a7c59';
                return `
                <div class="momentum-item">
                    <div class="momentum-header">
                        <span class="momentum-name">${topic.name}</span>
                        <span class="momentum-change ${topic.direction}">${topic.change}</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${Math.abs(topic.momentum)}%; background: ${color};"></div>
                    </div>
                    <p class="momentum-context">${topic.mentions} mentions, ${topic.context}</p>
                </div>
                `;
            }).join('')}
        </div>`;
    }

    // Generate consensus forming section
    generateConsensusForming() {
        const consensus = this.data.weeklyBrief.consensusForming;
        
        return `
        <!-- Consensus Forming -->
        <div style="margin-bottom: 24px;">
            <h3 style="font-weight: 600; color: #111827; margin-bottom: 12px;">Consensus Forming</h3>
            
            ${consensus.map(item => `
            <div class="consensus-item">
                <div class="consensus-content">
                    <div class="consensus-marker"></div>
                    <div class="consensus-details">
                        <h4>${item.title}</h4>
                        <p class="consensus-sources">${item.sources}</p>
                        <p class="consensus-insight">${item.insight}</p>
                    </div>
                </div>
            </div>
            `).join('')}
        </div>`;
    }

    // Generate alerts section (contrarian & blindspots)
    generateAlertsSection() {
        const contrarian = this.data.weeklyBrief.contrarian;
        const blindspots = this.data.weeklyBrief.blindspots;
        
        return `
        <!-- Contrarian & Blindspots -->
        <div class="alert-grid">
            <div>
                <h3 style="font-weight: 600; color: #111827; margin-bottom: 12px;">Contrarian Signals</h3>
                <div class="alert-box warning-box">
                    ${contrarian.map((item, index) => `
                    ${index > 0 ? '<div class="alert-item" style="padding-top: 12px; border-top: 1px solid #FCD34D;">' : '<div class="alert-item">'}
                        <div class="alert-header">
                            <svg class="alert-icon" fill="#D97706" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                            </svg>
                            <h4 class="alert-title">${item.title}</h4>
                        </div>
                        <p class="alert-description">${item.description}</p>
                        <p class="alert-context">${item.context}</p>
                    </div>
                    `).join('')}
                </div>
            </div>

            <div>
                <h3 style="font-weight: 600; color: #111827; margin-bottom: 12px;">Emerging Blindspots</h3>
                <div class="alert-box danger-box">
                    ${blindspots.map((item, index) => `
                    ${index > 0 ? '<div class="alert-item" style="padding-top: 12px; border-top: 1px solid #FCA5A5;">' : '<div class="alert-item">'}
                        <div class="alert-header">
                            <svg class="alert-icon" fill="#DC2626" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                            </svg>
                            <h4 class="alert-title">${item.title}</h4>
                        </div>
                        <p class="alert-description">${item.description}</p>
                        <p class="alert-context">${item.context}</p>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
    }

    // Generate action items
    generateActionItems() {
        const actions = this.data.weeklyBrief.actionItems;
        
        return `
        <!-- Action Items - Dark themed -->
        <div class="action-box">
            <div class="action-header">
                <svg width="20" height="20" fill="white" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clip-rule="evenodd"/>
                </svg>
                <h3 class="action-title">Recommended Actions</h3>
            </div>
            
            <div class="action-grid">
                <div>
                    <h4>THIS WEEK</h4>
                    ${actions.thisWeek.map(action => `
                    <div class="action-item">
                        <svg width="16" height="16" fill="#34D399" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
                        </svg>
                        <span>${action}</span>
                    </div>
                    `).join('')}
                </div>
                
                <div>
                    <h4>MONITOR</h4>
                    ${actions.monitor.map(action => `
                    <div class="action-item">
                        <svg width="16" height="16" fill="#FCD34D" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                            <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                        </svg>
                        <span>${action}</span>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
    }

    // Generate footer
    generateFooter() {
        const meta = this.data.meta;
        return `
        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <div>
                    <p class="footer-brand">synthea.ai</p>
                    <p>Weekly Intelligence Brief • Week ${meta.dataWeek.number}, ${meta.dataWeek.year}</p>
                </div>
                <div class="footer-right">
                    <p>Synthesized from ${meta.analysis.episodesAnalyzed.toLocaleString()} episodes across ${meta.analysis.podcastsTracked} VC podcasts</p>
                    <p>© ${meta.dataWeek.year} synthea.ai • Proprietary & Confidential</p>
                </div>
            </div>
        </div>`;
    }

    // Utility method to save HTML to file
    saveToFile(filename = 'weekly-brief-generated.html') {
        const html = this.generateHTML();
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // Utility method to open in new window
    openInNewWindow() {
        const html = this.generateHTML();
        const newWindow = window.open('', '_blank');
        newWindow.document.write(html);
        newWindow.document.close();
    }
}

// Export for use
window.WeeklyBriefGenerator = WeeklyBriefGenerator;

// Initialize on data ready
if (window.unifiedData) {
    window.weeklyBriefGenerator = new WeeklyBriefGenerator();
} else {
    window.addEventListener('dataAdapterReady', () => {
        window.weeklyBriefGenerator = new WeeklyBriefGenerator();
        console.log('Weekly Brief Generator initialized');
    });
}