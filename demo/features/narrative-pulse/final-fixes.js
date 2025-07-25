// Final fixes for Narrative Pulse issues
// Fixes: Missing X-axis, line going below 0, and consensus chart styling

(function() {
    function applyFinalFixes() {
        if (typeof NarrativePulse === 'undefined' || typeof window.narrativePulseData === 'undefined') {
            setTimeout(applyFinalFixes, 100);
            return;
        }

        // Fix 1 & 2: Update createMomentumView to include X-axis and prevent negative positioning
        NarrativePulse.createMomentumView = function() {
            const chartContent = this.container.querySelector('#chartContent');
            
            // Update legend first
            this.updateLegend();
            
            // Create paths for selected topics using dynamic data
            const currentData = this.getCurrentData();
            const paths = [];
            
            // Calculate all data points for scale
            const allDataPoints = [];
            this.selectedTopics.forEach(topic => {
                const topicData = currentData.topics[topic];
                if (topicData && topicData.dataPoints) {
                    allDataPoints.push(...topicData.dataPoints);
                    paths.push({
                        topic: topic,
                        color: topicData.color || this.getTopicColor(topic),
                        dataPoints: topicData.dataPoints,
                        momentum: topicData.displayMomentum || topicData.actualMomentum || '0%'
                    });
                }
            });
            
            if (allDataPoints.length === 0) {
                chartContent.innerHTML = '<text x="400" y="150" text-anchor="middle" fill="#666">No data available</text>';
                return;
            }
            
            // Calculate scale - ENSURE MINIMUM IS 0
            const maxDataValue = Math.max(...allDataPoints);
            const minDataValue = 0; // Always start at 0
            
            // Add some padding to the scale
            const range = maxDataValue - minDataValue;
            const padding = range * 0.1;
            const scaleMax = Math.ceil((maxDataValue + padding) / 10) * 10;
            const scaleMin = 0;
            
            // Calculate Y-axis labels
            const yAxisSteps = 5;
            const stepSize = (scaleMax - scaleMin) / (yAxisSteps - 1);
            const yAxisLabels = [];
            for (let i = 0; i < yAxisSteps; i++) {
                yAxisLabels.push(Math.round(scaleMax - (i * stepSize)));
            }
            
            chartContent.innerHTML = `
                <!-- Horizontal grid lines -->
                <line x1="${this.padding}" y1="40" x2="${this.chartWidth - this.padding}" y2="40" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
                <line x1="${this.padding}" y1="80" x2="${this.chartWidth - this.padding}" y2="80" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
                <line x1="${this.padding}" y1="120" x2="${this.chartWidth - this.padding}" y2="120" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
                <line x1="${this.padding}" y1="160" x2="${this.chartWidth - this.padding}" y2="160" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
                <line x1="${this.padding}" y1="200" x2="${this.chartWidth - this.padding}" y2="200" stroke="#e5e7eb" stroke-width="1" opacity="0.3"/>
                <line x1="${this.padding}" y1="220" x2="${this.chartWidth - this.padding}" y2="220" stroke="#e5e7eb" stroke-width="1"/>
                
                <!-- Vertical grid lines -->
                ${this.createGridLines ? this.createGridLines() : ''}
                
                <!-- Y-axis labels for momentum -->
                <text x="35" y="44" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[0]}</text>
                <text x="35" y="84" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[1]}</text>
                <text x="35" y="124" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[2]}</text>
                <text x="35" y="164" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[3]}</text>
                <text x="35" y="204" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[4]}</text>
                
                <!-- Y-axis label -->
                <text x="15" y="130" fill="#6b7280" font-size="11" text-anchor="middle" transform="rotate(-90 15 130)">Mentions</text>
                
                <!-- Momentum view paths -->
                ${paths.map(p => {
                    if (!p.dataPoints || p.dataPoints.length === 0) return '';
                    
                    const chartBottom = 220;
                    const chartTop = 40;
                    const range = chartBottom - chartTop;
                    
                    // Calculate Y positions - ensure they stay within bounds
                    const yPositions = p.dataPoints.map(value => {
                        // Clamp value to be at least 0
                        const clampedValue = Math.max(0, value);
                        const yPos = chartBottom - ((clampedValue - scaleMin) / (scaleMax - scaleMin)) * range;
                        // Ensure position doesn't go below the bottom line
                        return Math.min(chartBottom, Math.max(chartTop, yPos));
                    });
                    
                    // Create smooth path data
                    let pathData = '';
                    
                    if (yPositions.length > 1) {
                        // Different approaches based on number of points
                        if (yPositions.length <= 5) {
                            // For 5 or fewer points (30-day view), use quadratic curves
                            pathData = `M ${this.xPositions[0]},${yPositions[0]}`;
                            pathData += ` Q ${this.xPositions[1]},${yPositions[1]} ${this.xPositions[2]},${yPositions[2]}`;
                            if (yPositions.length > 3) {
                                pathData += ` T ${this.xPositions[3]},${yPositions[3]}`;
                            }
                            if (yPositions.length > 4) {
                                pathData += ` T ${this.xPositions[4]},${yPositions[4]}`;
                            }
                        } else {
                            // For more points (7-day and 90-day), use Catmull-Rom spline if available
                            if (this.createCatmullRomPath) {
                                pathData = this.createCatmullRomPath(this.xPositions, yPositions);
                            } else {
                                // Fallback to simple line
                                pathData = `M ${this.xPositions[0]},${yPositions[0]}`;
                                for (let i = 1; i < this.xPositions.length; i++) {
                                    pathData += ` L ${this.xPositions[i]},${yPositions[i]}`;
                                }
                            }
                        }
                    }
                    
                    return `<g class="topic-line chart-transition" data-topic="${p.topic}" data-momentum="${p.momentum}" data-color="${p.color}">
                        <path d="${pathData}" 
                              fill="none" stroke="${p.color}" stroke-width="3" class="topic-path animate-path chart-transition"/>
                        <!-- Static dots at data points -->
                        ${this.xPositions.map((x, i) => `
                            <circle cx="${x}" cy="${yPositions[i]}" r="3" fill="${p.color}" 
                                    class="data-point-dot chart-transition" opacity="0" data-topic="${p.topic}"/>
                        `).join('')}
                    </g>`;
                }).join('')}
                
                <!-- Vertical tracking line (hidden by default) -->
                <line id="verticalTracker" x1="0" y1="40" x2="0" y2="220" 
                      stroke="#6b7280" stroke-width="1" opacity="0" stroke-dasharray="4,4"/>
                
                <!-- Date labels -->
                ${this.createDateLabels ? this.createDateLabels(true) : this.dateLabels.map((label, i) => `
                    <text x="${this.xPositions[i]}" y="${this.chartHeight - 10}" 
                          fill="#666666" font-size="11" text-anchor="middle">${label}</text>
                `).join('')}
            `;
            
            // Re-initialize momentum view interactions after DOM update
            setTimeout(() => {
                this.removeViewListeners('momentum');
                this.initMomentumView();
            }, 50);
        };

        // Fix 3: Update consensus view with proper styling
        NarrativePulse.createConsensusView = function() {
            const chartContent = this.container.querySelector('#chartContent');
            const topicNames = this.selectedTopics;
            const currentData = this.getCurrentData();
            
            // Update legend first
            this.updateLegend();
            
            // Grid layout configuration - align with chart axes
            const gridStartX = this.padding + 35; // Shift grid right to make room for labels
            const gridStartY = 50;
            const gridEndX = this.chartWidth - 120; // Leave space for legend on right
            const availableWidth = gridEndX - gridStartX;
            const numCells = this.dateLabels.length;
            const cellWidth = (availableWidth - ((numCells - 1) * 1)) / numCells;
            const cellHeight = (220 - gridStartY) / topicNames.length - 1;
            const cellGap = 1;
            
            // Color gradient based on consensus percentage
            const getConsensusColor = (percent) => {
                if (percent >= 90) return '#2d5a3d'; // Deep green - Peak
                if (percent >= 70) return '#4a7c59'; // Sage green - Strong
                if (percent >= 50) return '#7fa569'; // Medium green - Building
                if (percent >= 30) return '#f4a261'; // Amber - Mixed
                return '#c77d7d'; // Dusty rose - Contested
            };
            
            // Helper function to calculate consensus percentage
            const getConsensusPercent = (topic, dateIndex) => {
                const topicData = currentData.topics[topic];
                if (!topicData) return 85;
                
                // For 30-day view with consensusBreakdown
                if (this.currentTimeRange === '30 days' && topicData.consensusBreakdown && topicData.consensusBreakdown[dateIndex]) {
                    const breakdown = topicData.consensusBreakdown[dateIndex];
                    const total = breakdown.positive + breakdown.neutral + breakdown.negative;
                    return total > 0 ? Math.round((breakdown.positive / total) * 100) : 85;
                }
                
                // For 90-day view with consensusProgression
                if (this.currentTimeRange === '90 days' && topicData.consensusProgression && topicData.consensusProgression[dateIndex]) {
                    const level = topicData.consensusProgression[dateIndex];
                    const levelToPercent = {
                        'Peak': 94,
                        'Strong': 88,
                        'Moderate': 75,
                        'Building': 65,
                        'Weak': 45,
                        'None': 20
                    };
                    return levelToPercent[level] || 75;
                }
                
                // For 7-day view, use consensusLevel with variation
                if (this.currentTimeRange === '7 days' && topicData.consensusLevel) {
                    const basePercent = {
                        'Peak': 94,
                        'Strong': 88,
                        'Moderate': 75,
                        'Building': 65,
                        'Weak': 45
                    }[topicData.consensusLevel] || 75;
                    
                    const mentions = topicData.dataPoints[dateIndex] || 0;
                    const avgMentions = topicData.dataPoints.reduce((a, b) => a + b, 0) / topicData.dataPoints.length;
                    const variation = mentions > avgMentions ? 2 : -2;
                    
                    return Math.min(98, Math.max(20, basePercent + variation));
                }
                
                return 85;
            };
            
            let html = `
                <!-- Grid cells -->
                ${topicNames.map((topic, rowIndex) => {
                    const topicData = currentData.topics[topic];
                    if (!topicData) return '';
                    
                    return this.dateLabels.map((date, colIndex) => {
                        const percent = getConsensusPercent(topic, colIndex);
                        const x = gridStartX + colIndex * (cellWidth + cellGap);
                        const y = gridStartY + rowIndex * (cellHeight + cellGap);
                        const fillColor = getConsensusColor(percent);
                        const textColor = percent >= 60 ? 'white' : '#374151';
                        
                        return `
                            <g class="consensus-cell-group" data-topic="${topic}" data-date="${date}" data-percent="${percent}" data-index="${colIndex}">
                                <rect class="consensus-cell"
                                      x="${x}" y="${y}"
                                      width="${cellWidth}" height="${cellHeight}"
                                      fill="${fillColor}"
                                      stroke="#e5e7eb" stroke-width="1"/>
                                <text x="${x + cellWidth/2}" y="${y + cellHeight/2 + 4}"
                                      fill="${textColor}"
                                      font-size="13" font-weight="600" text-anchor="middle">
                                    ${percent.toFixed(0)}%
                                </text>
                            </g>
                        `;
                    }).join('');
                }).join('')}
                
                <!-- Topic labels (left side) - NO COLOR DOTS -->
                ${topicNames.map((topic, i) => {
                    const y = gridStartY + i * (cellHeight + cellGap) + cellHeight/2;
                    
                    // Handle multi-line text for longer topic names
                    if (topic === 'Capital Efficiency') {
                        return `
                            <g>
                                <text x="${gridStartX - 8}" y="${y - 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    Capital
                                </text>
                                <text x="${gridStartX - 8}" y="${y + 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    Efficiency
                                </text>
                            </g>
                        `;
                    }
                    
                    if (topic === 'Developer Tools') {
                        return `
                            <g>
                                <text x="${gridStartX - 8}" y="${y - 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    Developer
                                </text>
                                <text x="${gridStartX - 8}" y="${y + 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    Tools
                                </text>
                            </g>
                        `;
                    }
                    
                    if (topic === 'AI Infrastructure') {
                        return `
                            <g>
                                <text x="${gridStartX - 8}" y="${y - 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    AI
                                </text>
                                <text x="${gridStartX - 8}" y="${y + 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    Infrastructure
                                </text>
                            </g>
                        `;
                    }
                    
                    return `
                        <g>
                            <text x="${gridStartX - 8}" y="${y + 4}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                ${topic}
                            </text>
                        </g>
                    `;
                }).join('')}
                
                <!-- Legend - aligned with grid -->
                <g transform="translate(${gridEndX + 15}, ${gridStartY})">
                    <defs>
                        <linearGradient id="consensusGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" style="stop-color:#c77d7d;stop-opacity:1" />
                            <stop offset="30%" style="stop-color:#f4a261;stop-opacity:1" />
                            <stop offset="50%" style="stop-color:#7fa569;stop-opacity:1" />
                            <stop offset="70%" style="stop-color:#4a7c59;stop-opacity:1" />
                            <stop offset="100%" style="stop-color:#2d5a3d;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                    
                    <!-- Title -->
                    <text x="0" y="-10" fill="#374151" font-size="11" font-weight="500">CONSENSUS</text>
                    
                    <!-- Gradient bar - height matches the grid height -->
                    <rect x="0" y="0" width="12" height="${(topicNames.length * (cellHeight + cellGap)) - cellGap}" 
                          fill="url(#consensusGradient)" stroke="#e5e7eb" stroke-width="1"/>
                    
                    <!-- Legend labels distributed evenly -->
                    <text x="16" y="8" fill="#666666" font-size="10">Peak</text>
                    <text x="16" y="20" fill="#666666" font-size="9">(90%+)</text>
                    
                    <text x="16" y="${(topicNames.length * (cellHeight + cellGap)) * 0.25}" fill="#666666" font-size="10">Strong</text>
                    <text x="16" y="${(topicNames.length * (cellHeight + cellGap)) * 0.25 + 12}" fill="#666666" font-size="9">(70%+)</text>
                    
                    <text x="16" y="${(topicNames.length * (cellHeight + cellGap)) * 0.5}" fill="#666666" font-size="10">Building</text>
                    <text x="16" y="${(topicNames.length * (cellHeight + cellGap)) * 0.5 + 12}" fill="#666666" font-size="9">(50%+)</text>
                    
                    <text x="16" y="${(topicNames.length * (cellHeight + cellGap)) * 0.75}" fill="#666666" font-size="10">Mixed</text>
                    <text x="16" y="${(topicNames.length * (cellHeight + cellGap)) * 0.75 + 12}" fill="#666666" font-size="9">(30%+)</text>
                    
                    <text x="16" y="${(topicNames.length * (cellHeight + cellGap)) - 8}" fill="#666666" font-size="10">Contested</text>
                    <text x="16" y="${(topicNames.length * (cellHeight + cellGap)) + 4}" fill="#666666" font-size="9">(&lt;30%)</text>
                </g>
                
                <!-- Date labels (bottom) -->
                ${this.dateLabels.map((date, i) => {
                    const x = gridStartX + i * (cellWidth + cellGap) + cellWidth/2;
                    const bottomY = 260;
                    return `
                        <text x="${x}" y="${bottomY}"
                              fill="#6b7280" font-size="11" text-anchor="middle">
                            ${date}
                        </text>
                    `;
                }).join('')}
            `;
            
            chartContent.innerHTML = html;
            
            // Initialize consensus interactions
            this.removeViewListeners('consensus');
            this.initConsensusInteractions();
        };

        console.log('Final NarrativePulse fixes applied successfully');
    }

    // Start applying fixes
    applyFinalFixes();
})();