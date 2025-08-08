# Briefing Card Click Behavior Documentation

## Overview
When clicking on a Priority Briefing card, there are two different click targets that trigger two completely different sliding panels from the right side of the screen.

---

## 1. Clicking on the Briefing Card (General Area)
**Trigger:** Clicking anywhere on the `.briefing-card` element EXCEPT the "View Full Brief →" button or tags

### JavaScript Execution Flow:
1. **Initial Handler:** `/demo/features/priority-briefings/priority-briefings-compact.js`
   - Lines 167-180
   - Event listener checks for `.briefing-card` click
   - Excludes clicks on `.view-brief-btn` and `.tag` elements
   - Calls `window.EpisodePanel.openPanelById(briefingId)`

2. **Panel Creation:** `/demo/features/episode-panel/episode-panel.js`
   - Line 971: `openPanelById()` function
   - Creates the Episode Panel sliding interface

### CSS Files Activated:
- `/demo/features/episode-panel/episode-panel.css` - Main styling for the Episode Panel

### DOM Elements Created:
- `.episode-panel-backdrop` - Semi-transparent dark overlay
- `.episode-panel` - The sliding panel container
- Classes applied: `active` (for animation), `data-state="open"`

### Visual Result:
- A panel slides in from the right side
- Shows episode details in the "Episode Panel" format
- Dark backdrop covers the main content

---

## 2. Clicking "View Full Brief →" Button
**Trigger:** Clicking on the `.view-brief-btn` button inside the briefing card

### JavaScript Execution Flow:
1. **Global Interceptor:** `/demo/main.js`
   - Lines 1130-1154
   - Global click handler using capture phase (runs before bubble phase)
   - Prevents default behavior with `event.preventDefault()` and `event.stopPropagation()`
   - Extracts `data-briefing-id` from button
   - Calls `window.EpisodeLibrary.showEpisodeDetail(briefingId)`

2. **Episode Library Handler:** `/demo/features/episode-library/episode-library.js`
   - Line 1481: `showEpisodeDetail()` function
   - Finds episode data from `window.unifiedData.priorityBriefings.items`
   - Line 1493: Calls `createEpisodeDetailPanel(episode)`

3. **Panel Creation:** `/demo/features/episode-library/episode-library.js`
   - Lines 1496-1539: `createEpisodeDetailPanel()` function
   - Removes any existing panels
   - Creates new panel structure
   - Adds event listeners and animations

### CSS Files Activated:
- `/demo/features/episode-library/episode-library.css` - Episode Library detail panel styles
- `/demo/styles/components.css` - Additional component styling

### DOM Elements Created:
- `.episode-detail-backdrop` - Semi-transparent dark overlay (different class from Episode Panel)
- `.episode-detail-panel` - The sliding panel container (different class)
- Classes applied: `active`, `data-state="open"`
- Body modifications: 
  - `style="overflow: hidden"`
  - Class `panel-open` added to body

### Visual Result:
- A panel slides in from the right side
- Shows episode details in the "Episode Library" format
- Dark backdrop covers the main content
- Body scroll is disabled while panel is open

---

## Key Differences Between the Two Panels

| Aspect | Episode Panel (Card Click) | Episode Library Detail (Button Click) |
|--------|---------------------------|---------------------------------------|
| **Trigger** | Click on card body | Click on "View Full Brief →" button |
| **JavaScript File** | episode-panel.js | episode-library.js |
| **CSS Classes** | `.episode-panel`, `.episode-panel-backdrop` | `.episode-detail-panel`, `.episode-detail-backdrop` |
| **Function Called** | `EpisodePanel.openPanelById()` | `EpisodeLibrary.showEpisodeDetail()` |
| **Implementation** | Original Episode Panel component | Episode Library's modern panel |
| **Body Modifications** | None specified | Adds `panel-open` class, sets `overflow: hidden` |

---

## Historical Context

The original implementation in `priority-briefings-compact.js` (lines 160-164) had a different behavior:
- The "View Full Brief →" button originally called `this.openExpandedView(briefingId)`
- This would open a modal overlay (not a sliding panel)
- The modal used `#briefingModalOverlay` and `.expanded-card` elements

However, the global click handler in `main.js` (added later) intercepts these clicks and redirects them to the Episode Library's modern sliding panel implementation instead.

---

## File References

### JavaScript Files:
- `/demo/main.js` - Global event mediator
- `/demo/features/priority-briefings/priority-briefings-compact.js` - Briefing card component
- `/demo/features/episode-panel/episode-panel.js` - Episode Panel implementation
- `/demo/features/episode-library/episode-library.js` - Episode Library with detail panel

### CSS Files:
- `/demo/features/episode-panel/episode-panel.css` - Episode Panel styles
- `/demo/features/episode-library/episode-library.css` - Episode Library styles
- `/demo/styles/components.css` - Shared component styles

---

## Debugging Tips

To trace which panel is being opened:
1. Check the browser console for log messages:
   - Episode Panel: `"Opening Episode Panel for briefing: [id]"`
   - Episode Library: `"[Episode Library] Opening modern detail panel for: [id]"`

2. Inspect the DOM for class names:
   - Episode Panel creates `.episode-panel`
   - Episode Library creates `.episode-detail-panel`

3. The global handler in main.js uses capture phase, so it runs before other event handlers
   - This is why the button click doesn't trigger the original modal behavior