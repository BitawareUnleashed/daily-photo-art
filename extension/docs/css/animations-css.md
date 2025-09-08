# animations.css Documentation

## Overview
The animations module provides keyframe animations, smooth transitions, and dynamic visual effects for the Daily Photo Art Chrome extension. It implements clean view modes, blinking indicators, and interactive preview panels with consistent timing and easing functions.

## Features

### Core Animation System
- **Smooth Blinking**: Customizable opacity-based blinking animation with configurable timing
- **Clean View Transitions**: Seamless opacity transitions for minimalist display modes  
- **Interactive Hover Effects**: Consistent button and element hover state animations
- **Preview Panel Animations**: Dynamic positioning and background transitions for todo previews

### Keyframe Animations

#### Blink Animation
```css
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}
```
- **Purpose**: Creates attention-grabbing blinking effect for UI elements
- **Duration**: Infinite loop with 1.5 second cycles
- **States**: Full opacity (50%) → Reduced opacity (50%)
- **Use Cases**: Status indicators, alerts, notifications

### Clean View Mode System

#### Photo Info Clean View
- **Target**: `#photo-info` element in clean view state
- **Effect**: Reduces opacity to 75% with smooth 0.5s transition
- **Interaction**: Disables pointer events during clean view
- **Positioning**: Fixed bottom-right with vertical text orientation

#### Implementation Details
```css
.clean-view #photo-info {
  opacity: 0.75;
  pointer-events: none;
  transition: opacity 0.5s ease-in-out;
}
```

### Interactive Elements

#### Todo Preview Panel
- **Layout**: Absolute positioning with flexible width constraints
- **Background**: Semi-transparent black with glassmorphism effect
- **Dimensions**: 
  - Min width: 25% of container
  - Max width: 60% of container
  - Dynamic height based on content
- **Visual Effects**: Border radius, subtle shadow, backdrop blur

#### Button Hover States
- **Edit Buttons**: Transparent background with white overlay on hover
- **Delete Buttons**: Consistent hover feedback with opacity transitions
- **Timing**: 0.2s transition duration for responsive feel

## Component Specifications

### Photo Information Display
```css
#photo-info {
  position: fixed;
  bottom: 20%;
  right: 25px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}
```
- **Positioning**: Fixed to viewport, bottom-right corner
- **Typography**: 12px font size, 500 font weight, white color
- **Text Effects**: Strong text shadow for visibility over images
- **Orientation**: Vertical right-to-left with 180° rotation

### Todo Preview Styling
- **Background**: `rgba(0, 0, 0, 0.15)` for subtle overlay
- **Border Radius**: 10px for consistent rounded design
- **Shadow**: Minimal `0 2px 8px #0001` for depth
- **Z-index**: 20 for proper layering above background content

## Integration Points

### JavaScript Interactions
- **Clean View Toggle**: Works with `newtab.js` clean view functionality
- **Todo Management**: Integrates with `todo.js` for preview panel display
- **Photo Display**: Coordinates with background image system

### CSS Dependencies
- **Variables**: Uses CSS custom properties from `variables.css`
- **Layout**: Builds on base layout from `layout.css`
- **Components**: Extends button styles from `buttons.css`

### HTML Structure
```html
<!-- Photo info display -->
<div id="photo-info">
  <p id="photo-text">Photo information</p>
</div>

<!-- Todo preview panel -->
<div class="todo-preview-panel">
  <button class="todo-edit">Edit</button>
  <button class="todo-preview-delete">Delete</button>
</div>
```

## Animation Performance

### Optimization Strategies
- **Hardware Acceleration**: Uses `transform` and `opacity` for GPU rendering
- **Minimal Repaints**: Avoids layout-triggering properties
- **Efficient Selectors**: Simple class-based targeting for fast rendering
- **Controlled Timing**: Consistent 0.2-0.5s durations for smooth UX

### Browser Compatibility
- **Modern Browsers**: Full support for CSS3 animations and transforms
- **Fallbacks**: Graceful degradation without animation support
- **Performance**: Optimized for 60fps animation rendering

## Accessibility Features

### Visual Accessibility
- **High Contrast**: Strong text shadows ensure readability
- **Reduced Motion**: Respects user motion preferences
- **Focus States**: Clear interactive element identification
- **Color Independence**: Animations work without color dependency

### Interaction Accessibility
- **Keyboard Navigation**: Maintains focus visibility during animations
- **Screen Readers**: Non-interfering with assistive technology
- **Timing Control**: Reasonable animation durations for cognitive accessibility

## Usage Examples

### Implementing Blink Effect
```css
.status-indicator {
  animation: blink 1.5s infinite;
}
```

### Creating Clean View Transition
```css
.element {
  transition: opacity 0.5s ease-in-out;
}

.clean-view .element {
  opacity: 0.75;
  pointer-events: none;
}
```

### Adding Hover Animation
```css
.interactive-button {
  transition: background 0.2s;
}

.interactive-button:hover {
  background: rgba(255, 255, 255, 0.1);
}
```

## Customization Options

### Animation Timing
- **Blink Speed**: Modify keyframe percentages for different timing
- **Transition Duration**: Adjust 0.2s and 0.5s values for faster/slower effects
- **Easing Functions**: Use `ease-in-out`, `ease`, or custom cubic-bezier curves

### Visual Effects
- **Opacity Levels**: Customize clean view opacity (0.75) for different emphasis
- **Background Transparency**: Adjust rgba values for preview panel visibility
- **Shadow Intensity**: Modify shadow opacity and blur for depth control

## File Structure
- **Location**: `css/animations.css`
- **Size**: ~147 lines
- **Dependencies**: `variables.css` (CSS custom properties)
- **Load Order**: After base styles, before component-specific styles

## Development Notes

### Best Practices
- Keep animation durations under 0.5s for responsive feel
- Use transform and opacity for smooth hardware acceleration
- Maintain consistent easing functions across related animations
- Test with reduced motion preferences enabled

### Extension Points
- Additional keyframe animations for new UI elements
- Responsive animation scaling for different screen sizes
- Theme-based animation variations
- Advanced micro-interactions for enhanced UX

## Browser Support
- **Chrome**: Full support (target browser)
- **Modern Browsers**: CSS3 animations, transforms, transitions
- **Performance**: Optimized for extension environment constraints
- **Fallbacks**: Functional without animation support
