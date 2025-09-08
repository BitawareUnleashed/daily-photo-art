# Layout.css Documentation

## Overview
The `layout.css` file defines the core layout structure for the Daily Photo Art extension. It establishes the background system, main grid layout, typography scales, and focus input styling with glassmorphism effects.

## Background System

### Background Container
```css
#bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: -1;
  background-color: #00a6ff33;
  opacity: 1;
}
```

**Features**:
- **Full Viewport Coverage**: Fixed positioning covers entire browser window
- **Optimized Image Display**: Cover sizing with center positioning for best visual impact
- **Fallback Color**: Light blue tint when no image is loaded
- **Layer Management**: Negative z-index places behind all content
- **Smooth Transitions**: Opacity for fade effects (controlled by JavaScript)

### Background Overlay
```css
#bg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: var(--overlay);
}
```

**Purpose**: Provides consistent dark overlay (25% black) for text readability over any background image

## Grid Layout System

### Main Container
```css
.container {
  position: relative;
  z-index: 1;
  height: 100%;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  padding: 32px 32px 80px 32px;
}
```

**Architecture**:
- **Three Equal Sections**: Top, center, and bottom areas
- **Flexible Heights**: Each section takes equal space (1fr)
- **Responsive Padding**: 32px sides, 80px bottom for UI buttons
- **Content Layering**: Positioned above background (z-index: 1)

### Section Styling
```css
.top, .center, .bottom {
  display: grid;
  place-items: center;
  text-align: center;
}
```

**Features**:
- **Perfect Centering**: Grid place-items centers content both horizontally and vertically
- **Text Alignment**: All text centered within sections
- **Flexible Content**: Adapts to any content size

## Typography Hierarchy

### Primary Clock Display
```css
#clock {
  font-size: 96px;
  font-weight: 700;
  line-height: 1;
}
```
- **Dominant Size**: Large 96px for primary time display
- **Bold Weight**: 700 for strong visual hierarchy
- **Tight Leading**: line-height: 1 for compact appearance

### Greeting Text
```css
#greeting {
  font-size: 48px;
  opacity: .95;
}
```
- **Secondary Size**: 48px for personalized greeting
- **Subtle Opacity**: Slightly transparent for visual hierarchy
- **Readable Scale**: Half the clock size for balanced proportions

### Quote Display
```css
#quote {
  font-size: 20px;
  max-width: 900px;
  color: var(--muted);
}
```
- **Readable Size**: 20px for comfortable reading
- **Content Width**: 900px max-width prevents overly long lines
- **Muted Color**: Light gray for less prominent display

## Focus Input System

### Focus Input Field
```css
#focus {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 16px 24px;
  color: white;
  font-size: 18px;
  text-align: center;
  outline: none;
  transition: all 0.3s ease;
  width: 50%;
  max-width: 80%;
  margin-top: 5%;
}
```

**Glassmorphism Design**:
- **Transparent Background**: 10% white opacity for subtle visibility
- **Backdrop Blur**: 10px blur creates frosted glass effect
- **Subtle Border**: 20% white opacity for definition
- **Rounded Corners**: 12px radius for modern appearance
- **Smooth Transitions**: 0.3s ease for all property changes

**Layout Properties**:
- **Responsive Width**: 50% default, 80% maximum for mobile compatibility
- **Centered Text**: Input text appears centered
- **Generous Padding**: 16px vertical, 24px horizontal for touch-friendly interaction

### Focus Placeholder
```css
#focus::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
```
**Accessibility**: 60% white opacity for visible but subtle placeholder text

### Focus State
```css
#focus:focus {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}
```

**Interactive Feedback**:
- **Enhanced Background**: Increased opacity (15%) when focused
- **Stronger Border**: 40% opacity for clear focus indication
- **Depth Effect**: Shadow creates elevation appearance
- **Accessibility**: Clear visual focus state for keyboard navigation

### Focus Display
```css
#focus-display {
  font-size: 120px;
  margin-top: 16px;
  color: var(--muted);
  font-weight: 500;
}
```

**Display Mode**:
- **Prominent Size**: 120px for large, visible focus display
- **Medium Weight**: 500 for readable but not overpowering text
- **Muted Color**: Uses CSS variable for consistency
- **Spacing**: 16px top margin for visual separation

## Layout Behavior

### Responsive Design
- **Flexible Grid**: Three-row grid adapts to content height
- **Percentage Widths**: Focus input scales with viewport
- **Maximum Constraints**: Prevents overly wide elements on large screens

### Content Organization
```
┌─────────────────────────────┐
│         TOP SECTION         │  ← Clock, Greeting
│       (place-items: center) │
├─────────────────────────────┤
│       CENTER SECTION        │  ← Focus, Quote
│       (place-items: center) │
├─────────────────────────────┤
│       BOTTOM SECTION        │  ← Additional content
│       (place-items: center) │
└─────────────────────────────┘
```

### Z-Index Hierarchy
- **Background**: `z-index: -1` (behind everything)
- **Main Container**: `z-index: 1` (content layer)
- **Other Components**: Higher z-index values for overlays and popups

## Integration Points

### JavaScript Integration
- **Background Management**: `#bg` element manipulated by background.js for crossfade effects
- **Focus System**: `#focus` and `#focus-display` controlled by focus.js
- **Dynamic Content**: Clock, greeting, and quote updated by respective modules

### CSS Dependencies
- **Variables**: Uses `--overlay` and `--muted` from variables.css
- **Typography**: Inherits font-family from global styles
- **Box Model**: Builds on universal box-sizing from variables.css

### Component Integration
- **Glassmorphism**: Focus input style used as pattern for other components
- **Grid System**: Layout foundation used by overlaid components
- **Typography Scale**: Size relationships maintained across components

## Browser Support

### Modern Features
- **CSS Grid**: Full support in target browsers (Chrome extension)
- **Backdrop Filter**: Supported with webkit prefix for compatibility
- **CSS Variables**: Full support for color integration
- **CSS Transitions**: Smooth animations across all properties

### Fallback Strategies
- **Backdrop Filter**: Webkit prefix ensures Safari compatibility
- **Flexible Layout**: Grid with fallback to flexbox behavior
- **Color Values**: CSS variables with fallback to direct values

## Performance Considerations

### Rendering Optimization
- **Fixed Positioning**: Background doesn't trigger reflows
- **Transform-friendly**: Uses opacity for transitions
- **GPU Acceleration**: Backdrop filter utilizes hardware acceleration
- **Minimal Repaints**: Efficient property animations

### Layout Efficiency
- **Grid Layout**: Optimal for three-section design
- **Centered Content**: Grid place-items more efficient than flexbox
- **Single Container**: Minimal DOM structure for fast rendering

## Accessibility Features

### Visual Hierarchy
- **Clear Size Relationships**: Clock > Greeting > Quote > Focus
- **Sufficient Contrast**: White text over dark backgrounds
- **Focus States**: Visible focus indication for keyboard navigation

### Responsive Behavior
- **Scalable Text**: em/rem units where appropriate
- **Touch Targets**: Adequate padding for mobile interaction
- **Readable Widths**: Max-width prevents overly long text lines

## Future Enhancements
- **Breakpoint System**: Responsive typography for different screen sizes
- **Animation System**: More sophisticated transitions and micro-interactions
- **Theme Variants**: Alternative layout configurations
- **Accessibility Improvements**: Enhanced focus management and screen reader support
