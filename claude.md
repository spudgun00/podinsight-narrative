Synthea.ai - Crypto Audio Intelligence Platform
Product Overview
What it does: Synthea.ai analyzes 500+ crypto podcasts, Twitter Spaces, and audio content to provide pattern recognition and alpha extraction for crypto funds and professional traders. The platform synthesizes insights from 50+ hours of weekly audio content into actionable trading intelligence.
Value Proposition: Crypto professionals can identify narrative shifts, track protocol mentions, and spot alpha opportunities without listening to dozens of hours of content weekly. "Never miss the next narrative before CT finds it."
Key Features:

Narrative momentum tracking across podcasts/spaces
Protocol position monitoring and sentiment analysis
Market narrative synthesis before Twitter consensus
Trading thesis validation signals
Curated alpha briefings from key influencers

Project Overview
Purpose: Editorial/narrative-focused demo for crypto intelligence rather than traditional data dashboards
Status: Two parallel implementations - functional demo and future React app
Target Audience: Crypto funds, professional traders, and sophisticated retail seeking alpha from audio content
This project represents a fundamental shift from on-chain analytics dashboards to narrative intelligence platforms,
emphasizing alpha extraction, narrative synthesis, and tradeable insights over pure data visualization.
IMPORTANT: Current Implementation Status
This project currently has TWO separate implementations:
1. Demo Dashboard (/demo folder) - FULLY FUNCTIONAL

Technology: Pure vanilla JavaScript, HTML, CSS
Framework: None - no build process required
Status: Complete and working with all features
Location: /demo folder
Access: Open demo.html via HTTP server (python3 -m http.server 8000)
Components: Object-based JavaScript modules (e.g., NarrativePulse.init())
State Management: CSS classes and JavaScript object state
Known Issues: CSS nth-child conflicts required "nuclear" DOM replacement for Priority Briefings filter

2. React/Next.js App (Root directory) - PARTIALLY IMPLEMENTED

Technology: Next.js 14, React 18, TypeScript, Tailwind CSS
Status: Basic structure only (Header, Portfolio components)
Location: /app, /components folders
Purpose: Future production implementation
Progress: ~10% complete - only scaffolding exists

Why Two Implementations?
The vanilla JS demo was built first as a rapid prototype to validate concepts and design. The React/Next.js setup represents the intended production architecture but has not been built out yet. When working on this project, be aware which implementation you're modifying.
Design Philosophy
Alpha Intelligence vs Analytics Dashboard
Traditional Dashboard Approach (Old):

Focus on on-chain metrics and TVL charts
Dark/purple theme emphasizing technical data
Component names like "Protocol TVL Tracker"
User expected to derive alpha from data

Intelligence Briefing Approach (New):

Focus on synthesized narratives and alpha opportunities
Warm, sophisticated color palette suggesting expertise
Component names like "Narrative Pulse"
Pre-synthesized alpha delivered to user
Editorial tone similar to premium crypto research

Editorial Design Language
The visual design draws inspiration from:

Premium crypto research publications (Messari, Delphi)
Trading intelligence briefings
Sophisticated financial terminals with editorial polish
Warm, trustworthy palette that contrasts with typical crypto neon

Color Palette & Visual Identity
Primary Colors
css--deep-ink: #1a1a2e        /* Primary text, sophisticated navy */
--warm-paper: #fafaf9      /* Background, off-white warmth */
--sage: #4a7c59            /* Primary accent, trustworthy green */
--dusty-rose: #c77d7d      /* Secondary accent, approachable red */
--amber-glow: #f4a261      /* Highlight color, attention-drawing */
--slate-blue: #5a6c8c      /* Supporting accent, professional blue */

Supporting Colors

--light-sage: #e8f0ea      /* Sage background tints */
--light-rose: #f5e6e6      /* Rose background tints */
--gray-600: #6b7280        /* Secondary text */
--gray-400: #9ca3af        /* Tertiary text */
--gray-200: #e5e7eb        /* Borders and dividers */

Color Psychology

- Sage Green: Trust, growth, stability (primary brand color)
- Dusty Rose: Warmth, approachability, sophistication
- Amber: Energy, attention, important highlights
- Deep Ink: Authority, professionalism, readability

## Dashboard Structure & Layout

### Main Dashboard Area (Left side, ~70% width)

1. **Narrative Pulse**: Crypto narrative momentum visualization
 - Three view modes: Momentum (curves), Volume (bars), Consensus (heatmap)
 - Time range selector: 7d, 30d, 90d
 - Interactive hover states showing detailed metrics

2. **Narrative Feed**: Timeline of alpha emergence
 - Expandable event cards
 - Time-based grouping
 - Pattern detection highlights

3. **Notable Signals**: 5 alpha category cards
 - Market Narratives - Shifting crypto themes
 - Thesis Validation - Trading thesis confirmation
 - Token Launches - Protocol updates & launches
 - Protocol Mentions - Position-specific intelligence
 - Whale Sentiment - Smart money tracking

4. **Priority Briefings**: Curated must-listen episodes
 - Shows 3 cards by default
 - "Show more" expands to 6, then 9 episodes
 - Filter dropdown for podcast selection
 - Priority levels: Critical (red), Opportunity (green), Elevated (amber)

5. **Search Bar**: Header-mounted AI-powered search
 - Dropdown with suggestions and trending narratives
 - Quick filters for consensus/contrarian/whale movements

### Right Sidebar (~30% width)

- **Weekly Intelligence Brief**: AI-synthesized alpha summary
- **Velocity Tracking**: Narrative momentum metrics
- **Influence Metrics**: Crypto thought leader impact
- **Consensus Monitor**: Market agreement levels
- **Topic Correlations**: Related narrative clusters

Architecture & Key Sections

1. Narrative Pulse (Tracks Crypto Narratives)

Purpose: Transform raw mention tracking into narrative momentum analysis
Components:
- NarrativePulse.tsx - Main container
- Interactive SVG chart with three views:
  - Momentum View: Curved lines showing narrative acceleration (RWAs +420%)
  - Volume View: Bar charts showing discussion volume
  - Consensus View: Heatmap showing bullish/bearish alignment
- Time controls (7d, 30d, 90d)
- Insight cards with narrative synthesis

2. Notable Signals (Crypto Alpha Categories)

Purpose: Curated alpha categories replacing raw on-chain data
Components:
- NotableSignals.tsx - Grid container
- SignalCard.tsx - Individual signal cards
- Five Signal Types:
  a. Market Narratives - Shifting crypto consensus
  b. Thesis Validation - Trading thesis confirmation
  c. Token Launches - Protocol updates and TGEs
  d. Protocol Mentions - Position-specific intelligence
  e. Whale Sentiment - Smart money movements

3. Priority Briefings (Alpha-Rich Episodes)

Purpose: Curated podcast/space summaries with alpha prioritization
Components:
- PriorityBriefings.tsx - Container with filtering
- BriefingCard.tsx - Individual episode cards
- Priority Levels:
  - Critical (Red border): Immediate trading opportunity
  - Opportunity (Green border): Emerging narrative identified
  - Elevated (Amber border): Notable but not urgent

4. Intelligence Brief Sidebar

Purpose: AI-synthesized crypto market analysis
Components:
- IntelligenceBrief.tsx - Sidebar container
- Sections:
  - AI synthesis paragraph (main alpha insights)
  - Velocity tracking (narrative momentum)
  - Influence metrics (who's moving markets)
  - Consensus monitor (bull/bear alignment)
  - Topic correlations (narrative pairs that pump together)

Technology Stack

### Demo Dashboard (Vanilla JS) - CURRENTLY ACTIVE

- **HTML5** with semantic markup
- **CSS3** with CSS custom properties (variables)
- **JavaScript ES6+** modules (no transpilation)
- **No framework** - pure DOM manipulation
- **No build process** - runs directly in browser
- **Component pattern**: Object literals with init() methods
- **Data**: Mock data loaded from separate JS files

### React App (Future Implementation)

- Next.js 14 with App Router
- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations

Key Dependencies (React App)

{
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.0.0",
  "framer-motion": "^10.0.0",
  "lucide-react": "^0.200.0"
}

Development Tools

- MCP (Model Context Protocol) with Gemini integration
- Claude Code for AI-assisted development
- ESLint/Prettier for code quality
- TypeScript for type safety

Component Architecture

### Demo Dashboard (Vanilla JS) - ACTUAL IMPLEMENTATION

File Structure:
/demo
/features
/narrative-pulse
narrative-pulse.js      # Main component object
init.js                 # Initialization logic
/priority-briefings
priority-briefings.js   # Component with filter logic
priority-briefings.html # HTML template
/notable-signals
notable-signals.js
/intelligence-brief
intelligence-brief.js
/styles
variables.css            # CSS custom properties
components.css           # Component styles
layout.css              # Layout styles
demo.html                  # Main entry point
main.js                    # Application orchestrator

Component Pattern Example:
```javascript
const NarrativePulse = {
  init: function(container) {
    this.container = container;
    // Component logic
  }
};
React App (Future) - PLANNED STRUCTURE
File Structure:
/components
/dashboard
NarrativePulse.tsx
NotableSignals.tsx
PriorityBriefings.tsx
IntelligenceBrief.tsx
/ui
SignalCard.tsx
BriefingCard.tsx
FloatingAISearch.tsx
/layout
Header.tsx
DashboardLayout.tsx
Data Strategy & Mock Data
Data Philosophy
Realistic Crypto Intelligence: All mock data should feel like genuine crypto market intelligence, not generic metrics.
Key Data Types
interface NarrativeData {
topics: NarrativeMomentum[]
consensus: ConsensusLevel[]
timeframe: TimeRange
}
interface NarrativeMomentum {
name: string          // "RWAs", "ETH Restaking", "Bitcoin L2s"
momentum: number      // percentage change (e.g., +420%)
volume: number        // mention count
consensus: 'weak' | 'building' | 'strong' | 'peak'
color: string
}
interface AlphaBriefing {
id: string
priority: 'critical' | 'opportunity' | 'elevated'
podcast: PodcastInfo  // Bankless, What Bitcoin Did, etc.
title: string
guest: string         // Vitalik, Raoul Pal, etc.
keyInsights: string[]
signals: SignalTag[]
publishedAt: Date
}
Mock Data Sources

Realistic crypto funds: Galaxy Digital, Three Arrows (reformed), Paradigm
Actual podcast names: Bankless, Unchained, The Defiant
Real crypto narratives: RWAs, restaking, Bitcoin L2s
Authentic terminology: Use actual crypto language and concepts

Data Generation Rules

Narrative momentum: Realistic percentages (-45% to +420%)
Protocol mentions: Use well-known protocols (EigenLayer, Celestia)
Guest names: Reference actual crypto thought leaders
Trading themes: Reflect current crypto conversations
Timeline consistency: 24/7 market requires timestamp precision

AI Integration Strategy
MCP with Gemini

Use Gemini models for complex narrative analysis
Leverage mcp__zen__chat for design discussions
Use mcp__zen__thinkdeep for architectural decisions
Apply mcp__zen__refactor for component optimization

Content Generation

AI-synthesized alpha analysis text
Realistic narrative generation for briefings
Dynamic correlation and influence calculations
Contextual tooltip and description text

Development Guidelines
Alpha Focus Reminders
When developing components, always ask:

Does this surface tradeable alpha?
Is the language sophisticated but crypto-native?
Does the visual hierarchy highlight opportunities?
Are insights actionable rather than just informative?

Quality Standards

Typography: Use proper hierarchy with editorial spacing
Animations: Subtle, sophisticated, purposeful
Interactions: Intuitive hover states and click feedback
Accessibility: Proper ARIA labels and keyboard navigation
Performance: Smooth 60fps animations and fast load times

Testing Strategy

Responsive design: Test across mobile, tablet, desktop
Content overflow: Handle long protocol names gracefully
Loading states: Smooth skeleton screens and progressive loading
Error boundaries: Graceful degradation for failed data loads

Future Enhancements
Planned Features

Real-time Twitter Spaces integration
Wallet connection for automatic portfolio tracking
Discord/Telegram alert integration
API access for systematic traders
Multi-chain protocol coverage

Technical Debt Considerations
Current Demo Issues

CSS Architecture Problems

Heavy reliance on nth-child selectors causing conflicts
CSS doing double duty for styling AND state management
Required "nuclear" DOM replacement to fix filter issues
Specificity battles between different component states

Example - Priority Briefings Filter Issue:
css/* Problematic CSS that required DOM replacement */
.episode-grid .episode-card:nth-child(n+4) { display: none; }
.episode-grid.show-partial .episode-card:nth-child(n+7) { display: none; }
.episode-grid.show-expanded .episode-card { display: block !important; }
"Nuclear" Solution Pattern:
javascript// Creates entirely new DOM structure to avoid CSS conflicts
const newGrid = document.createElement('div');
newGrid.className = 'briefings-list episode-grid-filtered';
// Clone and rebuild all cards
grid.parentNode.replaceChild(newGrid, grid);

State Management

State scattered across CSS classes and JavaScript objects
No centralized state management
Manual DOM synchronization prone to bugs

State Storage Locations:

CSS classes: show-partial, show-expanded, filtered-out
DOM attributes: data-state, data-active, data-portfolio-count
JavaScript objects: this.state, window.portfolioManager.state
LocalStorage: Protocol positions, newMentions counter


Performance Issues

Full DOM manipulation on every filter change
No virtual DOM or efficient diffing
Potential memory leaks from event listeners

Memory Leak Pattern:
javascript// Event listeners added without cleanup
showMoreBtn.addEventListener('click', handler);
// No removeEventListener on component teardown


Migration to React Considerations

Component reusability: Extract common patterns into shared components
State management: Consider Zustand or Redux for complex state
Performance optimization: Implement virtual scrolling for large lists
SEO optimization: Add proper meta tags and structured data
Proper component lifecycle management
TypeScript for type safety and better developer experience

Critical Implementation Notes
State Storage Patterns

CSS Classes: Used for visual states (show-partial, show-expanded, active)
DOM Attributes: Used for component state (data-state, data-portfolio-count)
JavaScript Objects: Component-level state (this.state in each module)
LocalStorage: Persistent data (protocol positions, newMentions value)
Global Objects: Shared data (window.demoData, window.tickerData)

Key Timing Behaviors

Portfolio Button: Updates newMentions on 5-minute cycle (3→5→8→3...)
Hover States: 200ms transition duration
Filter Animations: 200ms delay before DOM updates
Panel Animations: 300ms slide-in/out duration

DOM Manipulation Patterns
javascript// Avoid: Direct innerHTML with user data
element.innerHTML = userData; // XSS risk

// Use: Text content for user data
element.textContent = userData;

// Priority Briefings filter requires complete rebuild
if (currentFilter !== 'all' && currentFilter !== 'curated') {
  // Must create new grid to avoid CSS conflicts
  const newGrid = document.createElement('div');
  newGrid.className = 'episode-grid-filtered';
}
Component Behavior Reference
Priority Briefings

Default State: Shows 3 episode cards
First Click: Expands to 6 cards
Second Click: Expands to 9 cards
Third Click: Collapses back to 3
Filter Behavior: Complete DOM replacement when filtering by podcast
Special Filters: "Curated" shows first 3, "All" shows all alphabetically

Portfolio Panel

Trigger: Protocol tracking button click
Animation: Slides in from right with backdrop
Close Methods: X button, backdrop click, or ESC key
Protocol Lists: Portfolio (positions) and Watchlist (monitoring)
Demo Behavior: Protocols reset on page refresh (not persisted)

Narrative Pulse

View Modes: Momentum (curves), Volume (bars), Consensus (heatmap)
Time Ranges: 7d, 30d, 90d
Hover Behavior: Shows detailed metrics tooltip
Chart Updates: Smooth transitions between views

Search Functionality

Activation: Click or Cmd+K shortcut
Dropdown Sections: Suggestions, Trending Narratives, Quick Filters
Search Modes: Consensus, Contrarian, Whale, Launches, Influencers

Notable Signals

Grid Layout: 5 cards in responsive grid
Card Types: Market Narratives, Thesis Validation, Token Launches, Protocol Mentions, Whale Sentiment
Hover Effect: Slight elevation and shadow
Click Behavior: Expands to show more alpha

Getting Started
Working with the Demo (Current Implementation)

Navigate to the demo folder: cd demo
Start a local HTTP server: python3 -m http.server 8000
Open browser to: http://localhost:8000/demo.html
Main files to understand:

demo.html - Entry point
main.js - Application orchestrator
/features/*/ - Individual components
/styles/ - CSS architecture



Understanding the Codebase

Focus on the alpha intelligence approach vs analytics mindset
Study the warm color palette contrasting with typical crypto neon
Examine component naming that emphasizes narratives over metrics
Review mock data that feels like real crypto intelligence
Test interactions that surface tradeable insights

Known Issues & Workarounds

Priority Briefings Filter: Uses DOM replacement approach due to CSS conflicts
State Management: Relies on CSS classes - be careful with cascading effects
Event Listeners: Manual cleanup required to prevent memory leaks

The goal is creating a platform that crypto professionals would trust for narrative intelligence, combining
the authority of premium research with the speed required for 24/7 crypto markets.
This CLAUDE.md provides comprehensive context for any future AI assistance, covering the philosophy, technical
details, and development guidelines needed to maintain consistency with the crypto intelligence vision.
Prompt Optimization
When responding to requests, consider applying the Lyra prompt optimization methodology from .claude/commands/lyra.md:

Use the 4-D approach (Deconstruct, Diagnose, Develop, Deliver) for complex requests
Apply appropriate optimization techniques based on request type
Ensure prompts are clear, specific, and structured for optimal AI performance