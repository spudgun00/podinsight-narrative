# CSS File Inventory - Synthea.ai Project

## Overview
This document provides a comprehensive inventory of all CSS files in the Synthea.ai crypto intelligence platform project, organized by implementation and purpose.

## Demo Dashboard CSS Files (/demo folder)

### Core Style Files (/demo/styles/)
1. **variables.css**
   - Path: `/demo/styles/variables.css`
   - Purpose: CSS Custom Properties and Color Definitions
   - Contains: All CSS variables, color palette definitions, and reusable values

2. **base.css**
   - Path: `/demo/styles/base.css`
   - Purpose: Base styles and CSS reset

3. **layout.css**
   - Path: `/demo/styles/layout.css`
   - Purpose: Layout and grid system styles

4. **components.css**
   - Path: `/demo/styles/components.css`
   - Purpose: Component-specific styles for all UI elements

5. **utilities.css**
   - Path: `/demo/styles/utilities.css`
   - Purpose: Utility classes and helpers

6. **portfolio.css**
   - Path: `/demo/styles/portfolio.css`
   - Purpose: Styles for the portfolio panel feature

7. **search.css**
   - Path: `/demo/styles/search.css`
   - Purpose: Search functionality and search dropdown styles

### Feature-Specific CSS Files
1. **episode-panel.css**
   - Path: `/demo/features/episode-panel/episode-panel.css`
   - Purpose: Styles for the episode panel component

### Temporary/Fix CSS Files
1. **episode-panel-clean-fix.css**
   - Path: `/demo/episode-panel-clean-fix.css`
   - Purpose: Temporary fixes for episode panel styling issues

2. **fix-filter-simple.css**
   - Path: `/demo/fix-filter-simple.css`
   - Purpose: Simple fixes for filter functionality

## React/Next.js App CSS Files (Root directory)

### Global Styles
1. **globals.css**
   - Path: `/styles/globals.css`
   - Purpose: Global styles for the React/Next.js application

## Node Modules CSS (Dependencies)
The following CSS files are part of the Tailwind CSS framework:
- `/node_modules/tailwindcss/base.css`
- `/node_modules/tailwindcss/components.css`
- `/node_modules/tailwindcss/utilities.css`
- `/node_modules/tailwindcss/tailwind.css`
- `/node_modules/tailwindcss/screens.css`
- `/node_modules/tailwindcss/variants.css`
- `/node_modules/tailwindcss/lib/css/preflight.css`
- `/node_modules/tailwindcss/src/css/preflight.css`

Next.js font-related CSS:
- `/node_modules/next/font/google/target.css`
- `/node_modules/next/font/local/target.css`

## CSS Architecture Summary

### Demo Dashboard (Vanilla JS)
- Uses CSS Custom Properties (CSS Variables) defined in `variables.css`
- Modular structure with separation of concerns:
  - Base styles (reset, typography)
  - Layout (grid, flexbox, spacing)
  - Components (UI elements)
  - Features (specific functionality)
  - Utilities (helper classes)

### React/Next.js App
- Uses Tailwind CSS framework
- Global styles in `/styles/globals.css`
- Component-level styling likely uses Tailwind utility classes

## Color System Location
The main color palette is defined in:
- **Demo**: `/demo/styles/variables.css`
- **React App**: Would be in `/styles/globals.css` or Tailwind config

## Notes
- The demo implementation is fully functional and uses traditional CSS
- The React/Next.js implementation is only ~10% complete
- There are some temporary fix files indicating CSS architecture challenges that were addressed