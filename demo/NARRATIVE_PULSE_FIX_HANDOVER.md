# Narrative Pulse Chart Fix - Handover Document

## Problem Summary
The Narrative Pulse charts are showing old hardcoded topics (AI Agents, AI Infrastructure, Developer Tools, etc.) instead of the new topics from unified-data.js (Enterprise Agents, Defense Tech, AI Infrastructure, Exit Strategies, Vertical AI, Traditional SaaS, Climate Tech).

## Current Status
- **Issue**: Chart displays only one line (AI Infrastructure) and shows old topic names
- **Root Cause**: Conflicting init() overrides between unified-data-adapter.js and apply-data-updates.js
- **Solution Identified**: Remove init override from unified-data-adapter.js

## Files Involved

### 1. `/demo/data/unified-data.js`
- Contains the NEW topics that should be displayed
- Topics: AI Infrastructure (+38%), Enterprise Agents (+52%), Defense Tech (+41%), Exit Strategies (+29%), Vertical AI (+31%), Climate Tech (+26%), Traditional SaaS (-18%)

### 2. `/demo/features/narrative-pulse/narrative-pulse.js`
- Contains HARDCODED old topics in `availableTopics` array
- Has hardcoded `timeRangeData` with old topic data
- This is where the old data is coming from

### 3. `/demo/features/narrative-pulse/unified-data-adapter.js`
- Created to transform unified data structure
- Currently OVERRIDES NarrativePulse.init() (lines 224-234)
- This conflicts with apply-data-updates.js

### 4. `/demo/features/narrative-pulse/apply-data-updates.js`
- ALSO overrides NarrativePulse.init() (lines 31-83)
- Already handles data transformation correctly
- Should be the only script managing initialization

### 5. `/demo/demo.html`
- Script loading order:
  1. unified-data.js
  2. unified-data-adapter.js
  3. data-transformer.js
  4. narrative-pulse.js
  5. apply-data-updates.js

## The Conflict
Both unified-data-adapter.js and apply-data-updates.js override NarrativePulse.init(). This creates a race condition where:
1. unified-data-adapter.js sets its init override
2. apply-data-updates.js overwrites it with its own
3. The adapters fight for control, causing incorrect behavior

## Fix Required

### Step 1: Edit unified-data-adapter.js
Remove the init override (lines 218-234) but KEEP:
- Data transformation logic (lines 1-176)
- Topic array updates (lines 188-189)
- getTopicColor override (lines 197-216)
- Force update logic (lines 237-260)

### Step 2: Verify the fix
After removing the init override:
1. Refresh the page
2. Check that all 7 new topics appear in the chart
3. Verify all three views work (Momentum, Volume, Consensus)
4. Confirm topic colors match those defined in unified-data.js

## Quick Fix Code
In unified-data-adapter.js, DELETE lines 218-234:
```javascript
// DELETE THIS ENTIRE BLOCK:
// Store original init if not already stored
if (!window.NarrativePulse._originalInit) {
    window.NarrativePulse._originalInit = window.NarrativePulse.init;
}

// Override init to ensure topics are set
window.NarrativePulse.init = function(containerElement) {
    // Ensure topics are set from unified data
    const topics = Object.keys(window.narrativePulseData.sevenDayData.topics);
    this.availableTopics = [...topics];
    this.selectedTopics = [...topics];
    
    console.log('NarrativePulse init with topics:', this.selectedTopics);
    
    // Call original init
    return window.NarrativePulse._originalInit.call(this, containerElement);
};
```

Keep everything else in the file intact.

## Testing Checklist
- [ ] All 7 new topics visible in legend
- [ ] Momentum view shows curved lines for all topics
- [ ] Volume view shows stacked bars
- [ ] Consensus view shows heatmap
- [ ] Time range switching (7d/30d/90d) works
- [ ] Hover tooltips show correct data
- [ ] No console errors

## Additional Context
- This is a vanilla JS demo, not React
- Uses global window objects for data
- CSS does double duty for styling AND state management
- Known issue: Priority Briefings requires "nuclear" DOM replacement due to CSS conflicts