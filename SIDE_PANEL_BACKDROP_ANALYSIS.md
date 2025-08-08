# Side Panel Backdrop Configuration Analysis

## Overview
This document captures all backdrop configurations for side panels across the Synthea.ai platform, highlighting consistency issues and recommendations for standardization.

## Side Panel Comparison Table

| Feature | Backdrop Color | Opacity | Blur | Z-Index | Transition | Click to Close | Panel Width | Position |
|---------|---------------|---------|------|---------|------------|----------------|-------------|----------|
| **Portfolio Panel** (Company Tracking) | rgba(0, 0, 0, 0.08) | 8% | 1px | 999 | 0.3s ease | ✓ Yes | 480px | Fixed |
| **Episode Library Detail Panel** (Table & Card views) | rgba(26, 26, 46, 0.1) | 10% | 1px | 1100 | 0.3s ease | ✓ Yes | 50vw (max 800px) | Fixed |
| **Topic Customization Panel** | rgba(0, 0, 0, 0.3) | 30% | 1px | 999 | 0.4s ease | ✓ Yes | 480px | Fixed |
| **Priority Briefings Panel** (Episode Panel) | rgba(0, 0, 0, 0.3) | 30% | 1px | 9998 | 0.4s ease | ✓ Yes | 50vw (max 800px) | Fixed |
| **Notable Signals Panel** | rgba(0, 0, 0, 0.3) | 30% | 1px | 999 | 0.4s ease | ✓ Yes | 400px | Fixed |
| **Episode Panel** (Clean Fix - Legacy) | rgba(0, 0, 0, 0.3) | 30% | 1px | 99998 | N/A | ✓ Yes | 100% | Fixed |

## Notes on Panel Triggers

- **Notable Signals**: All 5 cards (Market Narratives, Thesis Validation, Notable Deals, Portfolio Mentions, LP Sentiment) open side panels when clicked
- **Priority Briefings**: Cards open the Episode Panel when clicked (shares same panel component)
- **Episode Library**: Both table rows and cards open the same detail panel when clicked

## Key Inconsistencies Found

### 1. **Backdrop Colors & Opacity**
- **Portfolio Panel**: Uses very light black (rgba(0, 0, 0, 0.08)) at 8% opacity with 2px blur
- **Episode Library Detail**: Uses deep-ink color (rgba(26, 26, 46, 0.1)) at 10% opacity
- **All Others**: Use standard black (rgba(0, 0, 0, 0.3)) at 30% opacity
- **Recommendation**: Consider standardizing to either the light 8-10% opacity or the darker 30% opacity

### 2. **Z-Index Values**
- **Portfolio, Topic Customization, Notable Signals**: 999
- **Episode Library Detail**: 1100 (higher to appear over Episode Library overlay at z-index 1000)
- **Priority Briefings Panel (Episode Panel)**: 9998 (high to ensure above content)
- **Episode Panel (Legacy)**: 99998 (extremely high - likely a hotfix for layering issues)
- **Recommendation**: Establish a z-index hierarchy:
  - Base overlays: 999-1000
  - Nested panels (like Episode Library Detail): 1100-1101
  - Special overlays: 2000+

### 3. **Blur Effects**
- **All Panels**: Now standardized to 1px blur for subtle depth effect
- **Previous inconsistencies**: Ranged from no blur to 4px blur
- **Current standard**: 1px blur across all panels for consistency

### 4. **Transition Durations**
- **Portfolio & Episode Library**: 0.3s
- **Topic Customization & Notable Signals**: 0.4s
- **Recommendation**: Standardize to 0.3s for all panels

### 5. **Panel Widths**
- **Notable Signals**: 400px
- **Episode Library Detail**: 420px
- **Portfolio & Topic Customization**: 480px
- **Episode Panel**: 100% (full screen)
- **Recommendation**: Consider two standards: 420px for detail views, 480px for larger panels

## CSS Implementation Details

### Portfolio Panel
```css
.portfolio-backdrop {
    background: rgba(0, 0, 0, 0.08);    /* Very light black - 8% */
    backdrop-filter: blur(1px);         /* Subtle blur effect */
    z-index: 999;
    transition: opacity 0.3s ease;
}
```

### Episode Library Detail Panel
```css
.episode-detail-backdrop {
    background: rgba(26, 26, 46, 0.1);  /* Deep-ink color - 10% */
    backdrop-filter: blur(1px);         /* Subtle blur effect */
    -webkit-backdrop-filter: blur(1px); /* Safari support */
    z-index: 1100;                      /* Above Episode Library overlay */
    transition: opacity 0.3s ease;
    cursor: pointer;
}
```

### Topic Customization Panel
```css
.topic-customization-backdrop {
    background: rgba(0, 0, 0, 0.3);     /* Standard black */
    backdrop-filter: blur(1px);         /* Standardized blur effect */
    -webkit-backdrop-filter: blur(1px);
    z-index: 999;
    transition: opacity 0.4s ease, visibility 0.4s ease;
}
```

### Priority Briefings Panel (Episode Panel)
```css
.episode-panel-backdrop {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(1px);         /* Standardized blur effect */
    -webkit-backdrop-filter: blur(1px);
    z-index: 9998;                      /* High to ensure above content */
    transition: opacity 0.4s ease;
}
```

### Notable Signals Panel
```css
.panel-backdrop {
    background: rgba(0, 0, 0, 0.3);     /* Standard black */
    backdrop-filter: blur(1px);         /* Standardized blur effect */
    -webkit-backdrop-filter: blur(1px);
    z-index: 999;
    transition: opacity 0.4s ease;
}
```

## Recommended Standard Configuration

### Proposed Unified Backdrop Style
```css
.standard-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    z-index: 999;
    cursor: pointer;
    transition: opacity 0.3s ease;
}

.standard-panel {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 480px;
    background: white;
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.1);
    transform: translateX(100%);
    transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 1000;
}
```

## Implementation Priority

1. **High Priority**: Standardize backdrop opacity - decide between light (8-10%) or darker (30%) approach
2. **High Priority**: Establish clear z-index hierarchy for nested panels vs base panels
3. **Medium Priority**: Align transition durations to 0.3s (Topic Customization & Notable Signals from 0.4s)
4. **Medium Priority**: Standardize panel widths - consider 420px for detail views, 480px for larger panels
5. **Low Priority**: Decide on blur effect strategy (keep for subtle effect or remove for performance)

## Key Findings

- **Two Design Approaches**: Light backdrops (8-10% opacity) vs darker backdrops (30% opacity)
- **Nested Panel Challenge**: Episode Library Detail requires higher z-index (1100) to appear over its parent overlay
- **Color Variations**: Portfolio uses light black, Episode Library uses deep-ink tint, others use standard black
- **Blur Effects**: All panels now standardized to 1px blur for consistent subtle depth effect
- **Width Standards**: Responsive 50vw (max 800px) for detail panels, 480px for configuration panels
- **Click-Outside Pattern**: All panels correctly implement click-outside-to-close functionality
- **Fixed Positioning**: All panels use fixed positioning (correct for overlays)
- **Layering Issues**: Episode Panel's extremely high z-index (99998) suggests it was a hotfix for layering issues
- **Priority Briefings Use Episode Panel**: Priority Briefings cards trigger the Episode Panel component when clicked

---

*Updated: January 31, 2025*