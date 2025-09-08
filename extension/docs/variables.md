# Variables.css Documentation

## Overview
The `variables.css` file establishes the foundational design system for the Daily Photo Art extension. It defines global CSS custom properties (variables), universal box-sizing, and base typography settings that ensure consistent styling across all components.

## CSS Variables

### Color System
```css
:root {
  --overlay: rgba(0, 0, 0, .25);  /* Semi-transparent black overlay */
  --fg: #fff;                     /* Primary foreground (white text) */
  --muted: #e6e6e6;              /* Muted text color (light gray) */
}
```

### Variable Usage
- **`--overlay`**: Used for background overlays on buttons, popover backgrounds, and modal underlays
- **`--fg`**: Primary text color for high contrast readability over background images
- **`--muted`**: Secondary text color for less prominent interface elements

## Global Styles

### Universal Box Model
```css
* {
  box-sizing: border-box;
}
```
**Purpose**: Ensures predictable sizing by including padding and borders in element width/height calculations

### Base Layout
```css
html, body {
  margin: 0;
  padding: 0;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: transparent;
  color: white;
  text-align: center;
}
```

### Typography System
- **Font Stack**: Native system fonts for optimal performance and OS integration
  - macOS: `-apple-system, BlinkMacSystemFont`
  - Windows: `"Segoe UI"`
  - Linux/Android: `Roboto`
  - Fallback: `sans-serif`
- **Default Color**: White text for visibility over dark background images
- **Text Alignment**: Centered as default for the extension's layout

### Layout Foundation
- **Full Viewport**: `height: 100vh` ensures full browser window coverage
- **No Overflow**: `overflow: hidden` prevents scrollbars in new tab context
- **Transparent Background**: Allows background images to show through
- **Reset Margins**: Removes browser default spacing

## Design Principles

### Accessibility
- **High Contrast**: White text on potentially dark backgrounds
- **System Fonts**: Respects user's OS font preferences
- **Consistent Spacing**: Zero margins/padding for precise control

### Performance
- **Minimal Variables**: Only essential color values to reduce CSS complexity
- **System Fonts**: No web font loading delays
- **Box-sizing**: Prevents layout calculation issues

### Cross-browser Compatibility
- **Universal Reset**: Works across all modern browsers
- **CSS Variables**: Supported in all target browsers (Chrome extension)
- **Font Stack**: Comprehensive fallback system

## Integration Points

### JavaScript Modules
This CSS foundation supports all JavaScript modules by providing:
- **Consistent Typography**: All text elements inherit system font
- **Color Variables**: Used by dynamically generated content
- **Layout Base**: Foundation for absolute positioning of components

### Component Stylesheets
Other CSS files build upon these foundations:
- **buttons.css**: Uses `--overlay` for button backgrounds
- **popover.css**: Inherits text color and font system
- **todo.css**: Builds on color variables for consistent theming
- **weather.css**: Uses muted colors for secondary information

## Usage Examples

### In Component CSS
```css
.component {
  background: var(--overlay);      /* Semi-transparent background */
  color: var(--fg);               /* Primary white text */
  border-color: var(--muted);     /* Subtle border color */
}
```

### Dynamic Content
JavaScript-generated elements automatically inherit:
- System font family
- White text color
- Box-sizing behavior
- Centered text alignment

## Browser Support
- **Chrome**: Full support (primary target)
- **Modern Browsers**: Full CSS variable support
- **Fallback**: Graceful degradation with direct color values

## Maintenance Guidelines

### Adding Variables
When adding new CSS variables:
1. Follow naming convention (descriptive, kebab-case)
2. Document purpose and usage
3. Ensure sufficient color contrast
4. Test across all components

### Color Accessibility
- **Foreground Colors**: Maintain WCAG AA contrast ratios
- **Background Colors**: Consider overlay opacity for readability
- **Testing**: Verify readability over various background images

## Future Enhancements
- **Theme System**: Additional color schemes (dark/light mode)
- **Responsive Variables**: Different values for mobile vs desktop
- **Animation Variables**: Consistent timing and easing functions
- **Spacing System**: Standardized margin/padding scale
