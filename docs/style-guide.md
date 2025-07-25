# PodInsight Narrative Intelligence Dashboard - Style Guide

## Design Philosophy

The PodInsight Narrative Intelligence Dashboard represents a fundamental shift from traditional data dashboards to intelligence briefing platforms. This style guide embodies our editorial approach, emphasizing storytelling, narrative synthesis, and actionable insights over pure data visualization.

Our visual design draws inspiration from:
- Premium financial research publications (McKinsey, BCG reports)
- Intelligence briefing documents
- Editorial magazines with sophisticated layouts
- Warm, trustworthy color palettes that suggest expertise

---

## 1. Color Palette

### Primary Colors

| Color Name | Hex Value | Usage | Psychology |
|------------|-----------|-------|------------|
| **Deep Ink** | `#1a1a2e` | Primary text, headers | Authority, professionalism, readability |
| **Warm Paper** | `#fafaf9` | Background, canvas | Warmth, sophistication, editorial quality |
| **Sage** | `#4a7c59` | Primary accent, CTAs, success states | Trust, growth, stability (primary brand color) |
| **Dusty Rose** | `#c77d7d` | Secondary accent, alerts, critical states | Warmth, approachability, sophistication |
| **Amber Glow** | `#f4a261` | Highlights, warnings, attention states | Energy, attention, important highlights |
| **Slate Blue** | `#5a6c8c` | Supporting accent, secondary CTAs | Professional, trustworthy, calming |

### Supporting Colors

| Color Name | Hex Value | Usage |
|------------|-----------|-------|
| **Light Sage** | `#e8f0ea` | Background tints, hover states |
| **Light Rose** | `#f5e6e6` | Background tints, subtle alerts |
| **Gray 600** | `#6b7280` | Secondary text, subtle elements |
| **Gray 400** | `#9ca3af` | Tertiary text, disabled states |
| **Gray 200** | `#e5e7eb` | Borders, dividers, subtle backgrounds |

---

## 2. Typography

### Font Stack
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Monospace (for code/data)
```css
font-family: 'SF Mono', Monaco, Consolas, 'Courier New', monospace;
```

### Type Scale

| Element | Size | Weight | Additional Styling |
|---------|------|--------|-------------------|
| **Section Headers** | 14px (0.875rem) | 700 | `text-transform: uppercase; letter-spacing: 1px;` |
| **Section Subtitles** | 12px (0.75rem) | 400 | `color: var(--gray-600);` |
| **H1** | 20px (1.25rem) | 700 | For main dashboard titles |
| **H2** | 18px (1.125rem) | 600 | For card headers |
| **H3** | 16px (1rem) | 600 | For subsection headers |
| **Body** | 14px (0.875rem) | 400 | `line-height: 1.6;` |
| **Body Compact** | 13px (0.813rem) | 400 | For dense information |
| **Small** | 12px (0.75rem) | 400 | For metadata, timestamps |
| **Micro** | 11px (0.688rem) | 400 | For chart labels, fine print |

---

## 3. Spacing System

### Container Structure
- **Max Width**: 1400px
- **Container Padding**: 32px horizontal, 16px top, 32px bottom
- **Grid Gap**: 32px (2rem)
- **Section Spacing**: 32px (2rem) between major sections

### Component Spacing
- **Card Padding**: 24px (1.5rem)
- **Button Padding**: 6px 12px (small), 12px 24px (large)
- **Input Padding**: 10px 16px
- **Margin Scale**: 8px, 16px, 24px, 32px, 48px

---

## 4. Component Patterns

### Cards
```css
.card {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

.card:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
}
```

### Buttons

#### Primary Button
```css
.button-primary {
    background: var(--sage);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-weight: 500;
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.button-primary:hover {
    background: #3d6648; /* Darker sage */
    transform: translateY(-1px);
}
```

#### Secondary Button
```css
.button-secondary {
    background: white;
    border: 1px solid var(--gray-200);
    color: var(--deep-ink);
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;
}
```

### Form Elements
```css
.input {
    padding: 10px 16px;
    border: 1px solid var(--gray-200);
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s ease;
}

.input:focus {
    border-color: var(--sage);
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.1);
    outline: none;
}
```

---

## 5. Priority & Status Indicators

### Priority Levels
- **Critical**: `border-left: 3px solid var(--dusty-rose);`
- **Opportunity**: `border-left: 3px solid var(--sage);`
- **Elevated**: `border-left: 3px solid var(--amber-glow);`

### Consensus Levels
- **Strong**: Sage color (#4a7c59)
- **Building**: Amber color (#f4a261)
- **Weak**: Dusty rose (#c77d7d)
- **Peak**: Slate blue (#5a6c8c)

---

## 6. Animation & Transitions

### Standard Timing Functions
- **Default**: `all 0.3s ease`
- **Fast**: `all 0.2s ease`
- **Panel Slide**: `transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)`

### Common Animations
```css
/* Pulse for live indicators */
@keyframes pulse-glow {
    0%, 100% { transform: scale(1); opacity: 0.5; }
    50% { transform: scale(1.1); opacity: 0.8; }
}

/* Fade in for content */
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}

/* Draw path for charts */
@keyframes drawPath {
    from { stroke-dashoffset: 1000; }
    to { stroke-dashoffset: 0; }
}
```

---

## 7. Shadow System

```css
--shadow-subtle: 0 1px 3px rgba(0, 0, 0, 0.05);
--shadow-small: 0 2px 8px rgba(0, 0, 0, 0.05);
--shadow-medium: 0 4px 12px rgba(0, 0, 0, 0.08);
--shadow-large: 0 8px 24px rgba(0, 0, 0, 0.1);
--shadow-xlarge: 0 20px 60px rgba(0, 0, 0, 0.15);
```

---

## 8. Responsive Design

### Breakpoints
- **Desktop**: > 1400px
- **Laptop**: 1200px - 1400px
- **Tablet**: 768px - 1200px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

### Grid System
- Desktop: 3 columns + sidebar
- Tablet: 2 columns, sidebar below
- Mobile: Single column, stacked layout

---

## 9. Accessibility Guidelines

- **Focus States**: 3px sage-colored box shadow on all interactive elements
- **Touch Targets**: Minimum 44px × 44px
- **Color Contrast**: WCAG AA compliant (4.5:1 for normal text, 3:1 for large text)
- **Screen Readers**: Use semantic HTML and ARIA labels where needed
- **Keyboard Navigation**: All interactive elements accessible via keyboard

---

## 10. Icon Guidelines

- **Size Scale**: 24px (default), 16px (small), 12px (micro)
- **Stroke Width**: 2px for 24px icons, 1.5px for smaller sizes
- **Color**: Inherit from parent or use `var(--gray-600)` for neutral
- **Style**: Outline style, consistent with Inter font's geometric nature

---

## 11. Data Visualization

### Chart Colors (in order of preference)
1. Sage (#4a7c59)
2. Amber (#f4a261)
3. Slate Blue (#5a6c8c)
4. Dusty Rose (#c77d7d)
5. Additional colors as needed from the extended palette

### Chart Typography
- Axis labels: 11px, var(--gray-600)
- Data labels: 12px, var(--deep-ink)
- Tooltips: 13px, white on dark background

---

## Implementation Notes

1. **CSS Variables**: All colors should be referenced via CSS custom properties
2. **Component Library**: Use this guide when building React/Vue/Angular components
3. **Design Tokens**: Export these values for use in design tools (Figma, Sketch)
4. **Performance**: Limit animations on mobile devices for better performance
5. **Print Styles**: Provide high-contrast, simplified layouts for printing

---

## Version History

- **v1.0** - January 2025: Initial style guide creation
- Based on PodInsight Narrative Intelligence Dashboard design
- Emphasizes editorial, intelligence-briefing aesthetic over traditional dashboard design

---

*This style guide is a living document and should be updated as the design system evolves.*