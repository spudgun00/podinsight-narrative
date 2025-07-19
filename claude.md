 # PodInsight Narrative Intelligence Dashboard

  ## Project Overview

  **Purpose**: Editorial/narrative-focused demo replacing the current data dashboard
  **Status**: Standalone demo, separate from main dashboard
  **Target Audience**: Venture capital professionals seeking intelligence briefings rather than raw data visualization

  This project represents a fundamental shift from traditional dashboards to intelligence briefing platforms,
  emphasizing storytelling, narrative synthesis, and actionable insights over pure data visualization.

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

  Core Framework

  - Next.js 14 with App Router
  - React 18 with TypeScript
  - Tailwind CSS for styling
  - Framer Motion for animations

  Key Dependencies

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

  Naming Conventions

  Editorial Component Names (New):
  - NarrativePulse (not TopicVelocity)
  - PriorityBriefings (not EpisodeIntelligence)
  - IntelligenceBrief (not DataSidebar)
  - NotableSignals (not ActionableIntelligence)

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

  Component Hierarchy

  DashboardLayout
  ├── Header
  ├── Main Content
  │   ├── NarrativePulse
  │   ├── NotableSignals
  │   └── PriorityBriefings
  ├── Sidebar
  │   └── IntelligenceBrief
  └── FloatingAISearch

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

  - Component reusability: Extract common patterns into shared components
  - State management: Consider Zustand or Redux for complex state
  - Performance optimization: Implement virtual scrolling for large lists
  - SEO optimization: Add proper meta tags and structured data

  ---
  Getting Started

  To understand this project quickly:
  1. Focus on the editorial briefing approach vs dashboard mindset
  2. Study the warm color palette and sophisticated typography
  3. Examine component naming that emphasizes narrative over data
  4. Review mock data that feels like real VC intelligence
  5. Test interactions that feel premium and purposeful

  The goal is creating a platform that venture capital professionals would trust for market intelligence, combining
  the authority of premium research with the accessibility of modern web interfaces.

  This CLAUDE.md provides comprehensive context for any future AI assistance, covering the philosophy, technical
  details, and development guidelines needed to maintain consistency with your vision.

  ## Prompt Optimization

  When responding to requests, consider applying the Lyra prompt optimization methodology from .claude/commands/lyra.md:
  - Use the 4-D approach (Deconstruct, Diagnose, Develop, Deliver) for complex requests
  - Apply appropriate optimization techniques based on request type
  - Ensure prompts are clear, specific, and structured for optimal AI performance