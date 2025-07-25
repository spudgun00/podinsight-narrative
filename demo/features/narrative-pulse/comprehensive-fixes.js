// Comprehensive fixes for Narrative Pulse data integration issues
// This file contains all the fixes for consensus chart, Y-axis, and legend calculations

(function() {
    function applyComprehensiveFixes() {
        if (typeof NarrativePulse === 'undefined' || typeof window.narrativePulseData === 'undefined') {
            setTimeout(applyComprehensiveFixes, 100);
            return;
        }

        // Fix 1: Override createConsensusView to handle new data structure
        NarrativePulse.createConsensusView = function() {
            const chartContent = this.container.querySelector('#chartContent');
            const topicNames = this.selectedTopics;
            const currentData = this.getCurrentData();
            
            // Update legend first
            this.updateLegend();
            
            // Grid layout configuration
            const gridStartX = this.padding;
            const gridStartY = 50;
            const availableWidth = this.chartWidth - (2 * this.padding);
            const numCells = this.dateLabels.length;
            const cellWidth = (availableWidth - ((numCells - 1) * 1)) / numCells;
            const cellHeight = (220 - gridStartY) / topicNames.length - 1;
            const cellGap = 1;
            
            // Color gradient based on consensus percentage
            const getConsensusColor = (percent) => {
                if (percent >= 90) return '#2d5a3d';
                if (percent >= 70) return '#4a7c59';
                if (percent >= 50) return '#7fa569';
                if (percent >= 30) return '#f4a261';
                return '#c77d7d';
            };
            
            // Helper function to calculate consensus percentage
            const getConsensusPercent = (topic, dateIndex) => {
                const topicData = currentData.topics[topic];
                if (!topicData) return 85; // Default
                
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
                
                // For 7-day view, use consensusLevel to generate variation
                if (this.currentTimeRange === '7 days' && topicData.consensusLevel) {
                    const basePercent = {
                        'Peak': 94,
                        'Strong': 88,
                        'Moderate': 75,
                        'Building': 65,
                        'Weak': 45
                    }[topicData.consensusLevel] || 75;
                    
                    // Add some variation based on mentions
                    const mentions = topicData.dataPoints[dateIndex] || 0;
                    const avgMentions = topicData.dataPoints.reduce((a, b) => a + b, 0) / topicData.dataPoints.length;
                    const variation = mentions > avgMentions ? 2 : -2;
                    
                    return Math.min(98, Math.max(20, basePercent + variation));
                }
                
                return 85; // Default
            };
            
            let html = `
                <!-- Background -->
                <rect x="0" y="0" width="${this.chartWidth}" height="${this.chartHeight}" fill="transparent"/>
                
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
                                    ${percent}%
                                </text>
                            </g>
                        `;
                    }).join('');
                }).join('')}
                
                <!-- Topic labels (left side) -->
                ${topicNames.map((topic, i) => {
                    const y = gridStartY + i * (cellHeight + cellGap) + cellHeight/2;
                    const topicData = currentData.topics[topic];
                    const color = topicData ? topicData.color : '#666666';
                    
                    // Handle multi-line text for longer topic names
                    if (topic === 'Capital Efficiency') {
                        return `
                            <g>
                                <circle cx="${this.padding - 20}" cy="${y}" r="3" fill="${color}"/>
                                <text x="${this.padding - 28}" y="${y - 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    Capital
                                </text>
                                <text x="${this.padding - 28}" y="${y + 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    Efficiency
                                </text>
                            </g>
                        `;
                    }
                    
                    if (topic === 'Developer Tools') {
                        return `
                            <g>
                                <circle cx="${this.padding - 20}" cy="${y}" r="3" fill="${color}"/>
                                <text x="${this.padding - 28}" y="${y - 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    Developer
                                </text>
                                <text x="${this.padding - 28}" y="${y + 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    Tools
                                </text>
                            </g>
                        `;
                    }
                    
                    if (topic === 'AI Infrastructure') {
                        return `
                            <g>
                                <circle cx="${this.padding - 20}" cy="${y}" r="3" fill="${color}"/>
                                <text x="${this.padding - 28}" y="${y - 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    AI
                                </text>
                                <text x="${this.padding - 28}" y="${y + 6}"
                                      fill="#666666" font-size="12" text-anchor="end">
                                    Infrastructure
                                </text>
                            </g>
                        `;
                    }
                    
                    return `
                        <g>
                            <circle cx="${this.padding - 20}" cy="${y}" r="3" fill="${color}"/>
                            <text x="${this.padding - 15}" y="${y + 4}"
                                  fill="#666666" font-size="12" text-anchor="end">
                                ${topic}
                            </text>
                        </g>
                    `;
                }).join('')}
                
                <!-- Date labels (bottom) -->
                ${this.dateLabels.map((date, i) => {
                    const x = gridStartX + i * (cellWidth + cellGap) + cellWidth/2;
                    return `<text x="${x}" y="${this.chartHeight - 20}" 
                                  fill="#666666" font-size="11" text-anchor="middle">${date}</text>`;
                }).join('')}
                
                <!-- Legend -->
                <g transform="translate(${this.chartWidth - 180}, 30)">
                    <text x="0" y="0" fill="#374151" font-size="11" font-weight="500">CONSENSUS LEVEL</text>
                    <rect x="0" y="8" width="12" height="12" fill="#2d5a3d"/>
                    <text x="16" y="18" fill="#666666" font-size="10">Peak (90%+)</text>
                    <rect x="0" y="24" width="12" height="12" fill="#4a7c59"/>
                    <text x="16" y="34" fill="#666666" font-size="10">Strong (70-89%)</text>
                    <rect x="0" y="40" width="12" height="12" fill="#7fa569"/>
                    <text x="16" y="50" fill="#666666" font-size="10">Building (50-69%)</text>
                    <rect x="0" y="56" width="12" height="12" fill="#f4a261"/>
                    <text x="16" y="66" fill="#666666" font-size="10">Mixed (30-49%)</text>
                    <rect x="0" y="72" width="12" height="12" fill="#c77d7d"/>
                    <text x="16" y="82" fill="#666666" font-size="10">Contested (&lt;30%)</text>
                </g>
            `;
            
            const svg = this.container.querySelector('#chartContent svg');
            if (svg) {
                svg.innerHTML = html;
            } else {
                chartContent.innerHTML = `<svg width="${this.chartWidth}" height="${this.chartHeight}">${html}</svg>`;
            }
            
            // Re-initialize consensus interactions with proper data
            this.removeViewListeners('consensus');
            this.initConsensusInteractions();
        };

        // Fix 2: Override createMomentumView to ensure positive Y-axis
        const originalCreateMomentumView = NarrativePulse.createMomentumView;
        NarrativePulse.createMomentumView = function() {
            const chartContent = this.container.querySelector('#chartContent');
            
            // Update legend first
            this.updateLegend();
            
            // Create paths for selected topics using dynamic data
            const currentData = this.getCurrentData();
            const pathConfigs = {};
            
            // Calculate all data points for scale
            const allDataPoints = [];
            this.selectedTopics.forEach(topic => {
                const topicData = currentData.topics[topic];
                if (topicData && topicData.dataPoints) {
                    allDataPoints.push(...topicData.dataPoints);
                }
            });
            
            if (allDataPoints.length === 0) {
                chartContent.innerHTML = '<text x="400" y="150" text-anchor="middle" fill="#666">No data available</text>';
                return;
            }
            
            // Calculate scale - ENSURE MINIMUM IS 0 FOR MENTION COUNTS
            const maxDataValue = Math.max(...allDataPoints);
            const minDataValue = Math.min(...allDataPoints);
            
            // Add some padding to the scale
            const range = maxDataValue - minDataValue;
            const padding = range * 0.1;
            const scaleMax = Math.ceil((maxDataValue + padding) / 10) * 10;
            const scaleMin = 0; // ALWAYS start at 0 for mention counts
            
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
                
                <!-- Y-axis -->
                <line x1="${this.padding}" y1="40" x2="${this.padding}" y2="220" stroke="#e5e7eb" stroke-width="1"/>
                
                <!-- Y-axis labels for momentum -->
                <text x="35" y="44" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[0]}</text>
                <text x="35" y="84" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[1]}</text>
                <text x="35" y="124" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[2]}</text>
                <text x="35" y="164" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[3]}</text>
                <text x="35" y="204" fill="#9ca3af" font-size="10" text-anchor="end">${yAxisLabels[4]}</text>
                
                <!-- Y-axis label -->
                <text x="15" y="${this.chartHeight/2}" fill="#666666" font-size="11" text-anchor="middle" transform="rotate(-90 15 ${this.chartHeight/2})">Mentions</text>
                
                <!-- Lines -->
                ${this.selectedTopics.map(topic => {
                    const p = currentData.topics[topic];
                    if (!p || !p.dataPoints) return '';
                    
                    const chartBottom = 220;
                    const chartTop = 40;
                    const range = chartBottom - chartTop;
                    
                    const yPositions = p.dataPoints.map(value => 
                        chartBottom - ((value - scaleMin) / (scaleMax - scaleMin)) * range
                    );
                    
                    // Create smooth path data
                    let pathData = '';
                    
                    for (let i = 0; i < this.xPositions.length; i++) {
                        const x = this.xPositions[i];
                        const y = yPositions[i];
                        
                        if (i === 0) {
                            pathData = `M ${x} ${y}`;
                        } else {
                            // Create smooth curve
                            const prevX = this.xPositions[i - 1];
                            const prevY = yPositions[i - 1];
                            const cpx1 = prevX + (x - prevX) / 3;
                            const cpy1 = prevY;
                            const cpx2 = prevX + 2 * (x - prevX) / 3;
                            const cpy2 = y;
                            pathData += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x} ${y}`;
                        }
                    }
                    
                    return `
                        <g class="topic-line-group" data-topic="${topic}">
                            <path d="${pathData}" 
                                  stroke="${p.color}" 
                                  stroke-width="2.5" 
                                  fill="none"
                                  class="topic-line"
                                  opacity="0.9"/>
                            ${this.xPositions.map((x, i) => `
                                <circle cx="${x}" cy="${yPositions[i]}" r="5" 
                                        fill="${p.color}" 
                                        stroke="white" 
                                        stroke-width="2"
                                        class="topic-dot"
                                        opacity="0"/>
                            `).join('')}
                        </g>
                    `;
                }).join('')}
                
                <!-- Date labels (x-axis) -->
                ${this.dateLabels.map((label, i) => `
                    <text x="${this.xPositions[i]}" y="${this.chartHeight - 10}" 
                          fill="#666666" font-size="11" text-anchor="middle">${label}</text>
                `).join('')}
                
                <!-- Vertical tracker line (hidden by default) -->
                <line id="verticalTracker" x1="0" y1="40" x2="0" y2="220" 
                      stroke="#374151" stroke-width="1" opacity="0" stroke-dasharray="2,2"/>
            `;
            
            // Re-initialize interactions
            this.removeViewListeners('momentum');
            this.initMomentumView();
        };

        // Fix 3: Update legend to use dynamic data
        NarrativePulse.updateLegend = function() {
            const legend = this.container.querySelector('.pulse-legend');
            const currentData = this.getCurrentData();
            
            // Get colors and momentum from current data
            const legendItems = this.selectedTopics.map(topic => {
                const topicData = currentData.topics[topic];
                if (!topicData) return null;
                
                return {
                    topic: topic,
                    color: topicData.color || this.getTopicColor(topic),
                    momentum: topicData.displayMomentum || topicData.actualMomentum || '0%'
                };
            }).filter(item => item !== null);
            
            legend.innerHTML = legendItems.map(item => `
                <div class="legend-item ${this.activeFilter === item.topic ? 'active' : ''}" 
                     data-topic="${item.topic}"
                     onclick="window.NarrativePulse.handleLegendClick('${item.topic}')">
                    <span class="legend-dot" style="background-color: ${item.color};"></span>
                    <span class="legend-label">${item.topic}</span>
                    <span class="momentum-badge ${item.momentum.startsWith('+') ? 'positive' : item.momentum.startsWith('-') ? 'negative' : ''}">${item.momentum}</span>
                </div>
            `).join('');
        };

        console.log('Comprehensive NarrativePulse fixes applied successfully');
    }

    // Start applying fixes
    applyComprehensiveFixes();
})();