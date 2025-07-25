# Synthea.ai - VC Podcast Intelligence Platform

## Product Overview

**What it does**: Synthea.ai analyzes 1,500+ VC podcast episodes to provide pattern recognition and intelligence for venture capital professionals. The platform synthesizes insights from 50+ hours of weekly podcast content into actionable intelligence briefings.

**Value Proposition**: VCs can understand market narratives, track portfolio companies, and identify investment opportunities without listening to dozens of hours of content weekly.

**Key Features**:
- Pattern recognition across podcast episodes
- Portfolio company mention tracking
- Market narrative synthesis
- Thesis validation signals
- Curated priority briefings

## Project Overview

**Purpose**: Editorial/narrative-focused demo replacing the current data dashboard
**Status**: Two parallel implementations - functional demo and future React app
**Target Audience**: Venture capital professionals seeking intelligence briefings rather than raw data visualization

This project represents a fundamental shift from traditional dashboards to intelligence briefing platforms,
emphasizing storytelling, narrative synthesis, and actionable insights over pure data visualization.

  ## IMPORTANT: Current Implementation Status

  This project currently has TWO separate implementations:

  ### 1. Demo Dashboard (`/demo` folder) - FULLY FUNCTIONAL
  - **Technology**: Pure vanilla JavaScript, HTML, CSS
  - **Framework**: None - no build process required
  - **Status**: Complete and working with all features
  - **Location**: `/demo` folder
  - **Access**: Open `demo.html` via HTTP server (python3 -m http.server 8000)
  - **Components**: Object-based JavaScript modules (e.g., `NarrativePulse.init()`)
  - **State Management**: CSS classes and JavaScript object state
  - **Known Issues**: CSS nth-child conflicts required "nuclear" DOM replacement for Priority Briefings filter

  ### 2. React/Next.js App (Root directory) - PARTIALLY IMPLEMENTED
  - **Technology**: Next.js 14, React 18, TypeScript, Tailwind CSS
  - **Status**: Basic structure only (Header, Portfolio components)
  - **Location**: `/app`, `/components` folders
  - **Purpose**: Future production implementation
  - **Progress**: ~10% complete - only scaffolding exists

  ### Why Two Implementations?
  The vanilla JS demo was built first as a rapid prototype to validate concepts and design. The React/Next.js setup represents the intended production architecture but has not been built out yet. When working on this project, be aware which implementation you're modifying.

  ## Design Philosophy

  ### Intelligence Briefing vs Data Dashboard

  **Traditional Dashboard Approach (Old)**:
  - Focus on raw metrics and data visualization
  - Purple/dark theme emphasizing technical precision
  - Component names like "Topic Velocity Tracker"
  - User expected to derive insights from data

  **Intelligence Briefing Approach (New)**:
  - Focus on synthesized insights and narrative patterns
  - Warm, editorial color palette suggesting sophistication
  - Component names like "Narrative Pulse"
  - Pre-synthesized intelligence delivered to user
  - Editorial tone similar to premium research publications

  ### Editorial Design Language

  The visual design draws inspiration from:
  - Premium financial research publications (McKinsey, BCG reports)
  - Intelligence briefing documents
  - Editorial magazines with sophisticated layouts
  - Warm, trustworthy color palettes that suggest expertise

  ## Color Palette & Visual Identity

  ### Primary Colors
  ```css
  --deep-ink: #1a1a2e        /* Primary text, sophisticated navy */
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

1. **Narrative Pulse**: Topic momentum visualization
   - Three view modes: Momentum (curves), Volume (bars), Consensus (heatmap)
   - Time range selector: 7d, 30d, 90d
   - Interactive hover states showing detailed metrics

2. **Narrative Feed**: Timeline of pattern emergence
   - Expandable event cards
   - Time-based grouping
   - Pattern detection highlights

3. **Notable Signals**: 5 intelligence category cards
   - Market Narratives - Shifting consensus themes
   - Thesis Validation - Investment thesis confirmation
   - Notable Deals - Funding round intelligence
   - Portfolio Mentions - Company-specific intelligence
   - LP Sentiment - Limited partner mood tracking

4. **Priority Briefings**: Curated must-listen episodes
   - Shows 3 cards by default
   - "Show more" expands to 6, then 9 episodes
   - Filter dropdown for podcast selection
   - Priority levels: Critical (red), Opportunity (green), Elevated (amber)

5. **Search Bar**: Header-mounted AI-powered search
   - Dropdown with suggestions and trending topics
   - Quick filters for consensus/contrarian/emerging themes

### Right Sidebar (~30% width)

- **Weekly Intelligence Brief**: AI-synthesized summary
- **Velocity Tracking**: Topic momentum metrics
- **Influence Metrics**: Thought leader impact scores
- **Consensus Monitor**: Market agreement levels
- **Topic Correlations**: Related narrative clusters

  Architecture & Key Sections

  1. Narrative Pulse (Replaces: Topic Velocity Tracker)

  Purpose: Transform raw topic tracking into narrative momentum analysis
  Components:
  - NarrativePulse.tsx - Main container
  - Interactive SVG chart with three views:
    - Momentum View: Curved lines showing narrative acceleration
    - Volume View: Bar charts showing discussion volume
    - Consensus View: Heatmap showing agreement levels
  - Time controls (7d, 30d, 90d)
  - Insight cards with narrative synthesis

  2. Notable Signals (Enhanced Intelligence Cards)

  Purpose: Curated intelligence categories replacing raw data feeds
  Components:
  - NotableSignals.tsx - Grid container
  - SignalCard.tsx - Individual signal cards
  - Five Signal Types:
    a. Market Narratives - Shifting consensus themes
    b. Thesis Validation - Investment thesis confirmation
    c. Notable Deals - Funding round intelligence
    d. Portfolio Mentions - Company-specific intelligence
    e. LP Sentiment - Limited partner mood tracking

  3. Priority Briefings (Replaces: Episode Intelligence)

  Purpose: Curated episode summaries with intelligence prioritization
  Components:
  - PriorityBriefings.tsx - Container with filtering
  - BriefingCard.tsx - Individual episode cards
  - Priority Levels:
    - Critical (Red border): Immediate attention required
    - Opportunity (Green border): Investment opportunity identified
    - Elevated (Amber border): Notable but not urgent

  4. Intelligence Brief Sidebar

  Purpose: AI-synthesized market analysis and supporting analytics
  Components:
  - IntelligenceBrief.tsx - Sidebar container
  - Sections:
    - AI synthesis paragraph (main insights)
    - Velocity tracking (topic momentum)
    - Influence metrics (thought leader impact)
    - Consensus monitor (market agreement)
    - Topic correlations (narrative clustering)

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
  ```
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
  ```

  Component Pattern Example:
  ```javascript
  const NarrativePulse = {
    init: function(container) {
      this.container = container;
      // Component logic
    }
  };
  ```

  ### React App (Future) - PLANNED STRUCTURE

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

  Realistic VC Intelligence: All mock data should feel like genuine venture capital intelligence, not generic business
   metrics.

  Key Data Types

  interface NarrativeData {
    topics: TopicMomentum[]
    consensus: ConsensusLevel[]
    timeframe: TimeRange
  }

  interface TopicMomentum {
    name: string
    momentum: number // percentage change
    volume: number   // mention count
    consensus: 'weak' | 'building' | 'strong' | 'peak'
    color: string
  }

  interface IntelligenceBriefing {
    id: string
    priority: 'critical' | 'opportunity' | 'elevated'
    podcast: PodcastInfo
    title: string
    guest: string
    keyInsights: string[]
    signals: SignalTag[]
    publishedAt: Date
  }

  Mock Data Sources

  - Realistic VC firms: Sequoia, a16z, Founders Fund
  - Actual podcast names: 20VC, All-In, Invest Like the Best
  - Real market themes: AI agents, capital efficiency, DePIN
  - Authentic terminology: Use actual VC language and concepts

  Data Generation Rules

  1. Topic momentum: Realistic percentages (5-200% growth)
  2. Company mentions: Use well-known startups and unicorns
  3. Guest names: Reference actual VC partners and entrepreneurs
  4. Investment themes: Reflect current market conversations
  5. Timeline consistency: Ensure dates and sequences make sense

  AI Integration Strategy

  MCP with Gemini

  - Use Gemini models for complex analysis and content generation
  - Leverage mcp__zen__chat for design discussions
  - Use mcp__zen__thinkdeep for architectural decisions
  - Apply mcp__zen__refactor for component optimization

  Content Generation

  - AI-synthesized market analysis text
  - Realistic insight generation for briefings
  - Dynamic correlation and influence calculations
  - Contextual tooltip and description text

  Development Guidelines

  Editorial Focus Reminders

  When developing components, always ask:
  1. Does this feel like a premium intelligence briefing?
  2. Is the language sophisticated but accessible?
  3. Does the visual hierarchy guide attention properly?
  4. Are insights pre-synthesized rather than raw data?

  Quality Standards

  - Typography: Use proper hierarchy with editorial spacing
  - Animations: Subtle, sophisticated, purposeful
  - Interactions: Intuitive hover states and click feedback
  - Accessibility: Proper ARIA labels and keyboard navigation
  - Performance: Smooth 60fps animations and fast load times

  Testing Strategy

  - Responsive design: Test across mobile, tablet, desktop
  - Content overflow: Handle long titles and descriptions gracefully
  - Loading states: Smooth skeleton screens and progressive loading
  - Error boundaries: Graceful degradation for failed data loads

  Future Enhancements

  Planned Features

  1. Real-time data integration with podcast transcription APIs
  2. User personalization based on portfolio and interests
  3. Export functionality for briefings and reports
  4. Advanced filtering by topic, priority, or timeframe
  5. Collaborative features for team intelligence sharing

  Technical Debt Considerations

  ### Current Demo Issues

  1. **CSS Architecture Problems**
     - Heavy reliance on nth-child selectors causing conflicts
     - CSS doing double duty for styling AND state management
     - Required "nuclear" DOM replacement to fix filter issues
     - Specificity battles between different component states
     
     **Example - Priority Briefings Filter Issue**:
     ```css
     /* Problematic CSS that required DOM replacement */
     .episode-grid .episode-card:nth-child(n+4) { display: none; }
     .episode-grid.show-partial .episode-card:nth-child(n+7) { display: none; }
     .episode-grid.show-expanded .episode-card { display: block !important; }
     ```
     
     **"Nuclear" Solution Pattern**:
     ```javascript
     // Creates entirely new DOM structure to avoid CSS conflicts
     const newGrid = document.createElement('div');
     newGrid.className = 'briefings-list episode-grid-filtered';
     // Clone and rebuild all cards
     grid.parentNode.replaceChild(newGrid, grid);
     ```

  2. **State Management**
     - State scattered across CSS classes and JavaScript objects
     - No centralized state management
     - Manual DOM synchronization prone to bugs
     
     **State Storage Locations**:
     - CSS classes: `show-partial`, `show-expanded`, `filtered-out`
     - DOM attributes: `data-state`, `data-active`, `data-portfolio-count`
     - JavaScript objects: `this.state`, `window.portfolioManager.state`
     - LocalStorage: Portfolio companies, newMentions counter

  3. **Performance Issues**
     - Full DOM manipulation on every filter change
     - No virtual DOM or efficient diffing
     - Potential memory leaks from event listeners
     
     **Memory Leak Pattern**:
     ```javascript
     // Event listeners added without cleanup
     showMoreBtn.addEventListener('click', handler);
     // No removeEventListener on component teardown
     ```

  ### Migration to React Considerations

  - Component reusability: Extract common patterns into shared components
  - State management: Consider Zustand or Redux for complex state
  - Performance optimization: Implement virtual scrolling for large lists
  - SEO optimization: Add proper meta tags and structured data
  - Proper component lifecycle management
  - TypeScript for type safety and better developer experience

## Critical Implementation Notes

### State Storage Patterns
- **CSS Classes**: Used for visual states (`show-partial`, `show-expanded`, `active`)
- **DOM Attributes**: Used for component state (`data-state`, `data-portfolio-count`)
- **JavaScript Objects**: Component-level state (`this.state` in each module)
- **LocalStorage**: Persistent data (portfolio companies, newMentions value)
- **Global Objects**: Shared data (`window.demoData`, `window.tickerData`)

### Key Timing Behaviors
- **Portfolio Button**: Updates newMentions on 5-minute cycle (1→2→3→1...)
- **Hover States**: 200ms transition duration
- **Filter Animations**: 200ms delay before DOM updates
- **Panel Animations**: 300ms slide-in/out duration

### DOM Manipulation Patterns
```javascript
// Avoid: Direct innerHTML with user data
element.innerHTML = userData; // XSS risk

// Use: Text content for user data
element.textContent = userData;

// Priority Briefings filter requires complete rebuild
if (currentFilter !== 'all' && currentFilter !== 'curated') {
  // Must create new grid to avoid CSS conflicts
  const newGrid = document.createElement('div');
  newGrid.className = 'episode-grid-filtered';
}
```

## Component Behavior Reference

### Priority Briefings
- **Default State**: Shows 3 episode cards
- **First Click**: Expands to 6 cards
- **Second Click**: Expands to 9 cards
- **Third Click**: Collapses back to 3
- **Filter Behavior**: Complete DOM replacement when filtering by podcast
- **Special Filters**: "Curated" shows first 3, "All" shows all alphabetically

### Portfolio Panel
- **Trigger**: Portfolio button click
- **Animation**: Slides in from right with backdrop
- **Close Methods**: X button, backdrop click, or ESC key
- **Company Lists**: Portfolio (tracked) and Watchlist (monitoring)
- **Demo Behavior**: Companies reset on page refresh (not persisted)

### Narrative Pulse
- **View Modes**: Momentum (curves), Volume (bars), Consensus (heatmap)
- **Time Ranges**: 7d, 30d, 90d
- **Hover Behavior**: Shows detailed metrics tooltip
- **Chart Updates**: Smooth transitions between views

### Search Functionality
- **Activation**: Click or Cmd+K shortcut
- **Dropdown Sections**: Suggestions, Trending Topics, Quick Filters
- **Search Modes**: Consensus, Contrarian, Emerging, Deals, People

### Notable Signals
- **Grid Layout**: 5 cards in responsive grid
- **Card Types**: Market Narratives, Thesis Validation, Notable Deals, Portfolio Mentions, LP Sentiment
- **Hover Effect**: Slight elevation and shadow
- **Click Behavior**: Expands to show more details

  ---
  Getting Started

  ### Working with the Demo (Current Implementation)

  1. Navigate to the demo folder: `cd demo`
  2. Start a local HTTP server: `python3 -m http.server 8000`
  3. Open browser to: `http://localhost:8000/demo.html`
  4. Main files to understand:
     - `demo.html` - Entry point
     - `main.js` - Application orchestrator
     - `/features/*/` - Individual components
     - `/styles/` - CSS architecture

  ### Understanding the Codebase

  1. Focus on the editorial briefing approach vs dashboard mindset
  2. Study the warm color palette and sophisticated typography
  3. Examine component naming that emphasizes narrative over data
  4. Review mock data that feels like real VC intelligence
  5. Test interactions that feel premium and purposeful

  ### Known Issues & Workarounds

  - **Priority Briefings Filter**: Uses DOM replacement approach due to CSS conflicts
  - **State Management**: Relies on CSS classes - be careful with cascading effects
  - **Event Listeners**: Manual cleanup required to prevent memory leaks

  The goal is creating a platform that venture capital professionals would trust for market intelligence, combining
  the authority of premium research with the accessibility of modern web interfaces.

  This CLAUDE.md provides comprehensive context for any future AI assistance, covering the philosophy, technical
  details, and development guidelines needed to maintain consistency with your vision.

  ## Prompt Optimization

  When responding to requests, consider applying the Lyra prompt optimization methodology from .claude/commands/lyra.md:
  - Use the 4-D approach (Deconstruct, Diagnose, Develop, Deliver) for complex requests
  - Apply appropriate optimization techniques based on request type
  - Ensure prompts are clear, specific, and structured for optimal AI performance