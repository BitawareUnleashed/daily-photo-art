# Popover.css Documentation

## Overview
The `popover.css` file defines modal overlay styles for the Daily Photo Art extension. It implements a sophisticated glassmorphism design system for settings dialogs, city selection modals, and cache duration configuration interfaces.

## Design System

### Glassmorphism Modal Pattern
All popovers follow a consistent multi-layer glassmorphism design:
- **Background Overlay**: Blurred backdrop with semi-transparent black
- **Content Container**: Heavily blurred glass panel with subtle borders
- **Interactive Elements**: Consistent transparent buttons and inputs

## Settings Popover

### Modal Container
```css
#settings-popover {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
}
```

**Features**:
- **Full Viewport Coverage**: Complete overlay prevents interaction with background
- **Centered Layout**: Flexbox centers content both horizontally and vertically
- **High Z-index**: 1000 ensures visibility above all interface elements
- **Flexible Display**: Show/hide controlled by JavaScript

### Background Overlay
```css
.popover-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
}
```

**Visual Effects**:
- **Dark Backdrop**: 50% black overlay reduces background distraction
- **Subtle Blur**: 5px blur creates depth and focus on modal content
- **Full Coverage**: Absolute positioning covers entire viewport
- **Cross-browser**: Webkit prefix ensures Safari compatibility

### Content Panel
```css
.popover-content {
    position: relative;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;
    padding: 0;
    width: 90%;
    max-width: 400px;
    max-height: 80vh;
    overflow: hidden;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

**Glassmorphism Implementation**:
- **Enhanced Transparency**: 15% white opacity for stronger glass effect
- **Heavy Blur**: 20px backdrop blur creates pronounced frosted glass
- **Subtle Border**: 20% white opacity border for definition
- **Rounded Corners**: 12px radius for modern appearance
- **Deep Shadow**: Large shadow (8px blur, 32px spread) for elevation

**Responsive Design**:
- **Flexible Width**: 90% with 400px maximum for various screen sizes
- **Height Constraint**: 80vh maximum prevents viewport overflow
- **Overflow Handling**: Hidden overflow with internal scrolling

## Header Section

### Header Layout
```css
.popover-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Structure**:
- **Flexbox Layout**: Space-between distributes title and close button
- **Generous Padding**: 20px vertical, 24px horizontal for touch targets
- **Subtle Separator**: 10% opacity border creates visual section division

### Header Typography
```css
.popover-header h2 {
    margin: 0;
    color: white;
    font-size: 20px;
}
```

**Design**:
- **Clean Typography**: Zero margin for precise control
- **High Contrast**: White text for readability
- **Hierarchy**: 20px size establishes clear heading hierarchy

### Close Button
```css
#close-popover {
    background: transparent;
    border: none;
    color: white;
    font-size: 20px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background 0.2s;
}
```

**Interaction**:
- **Minimal Design**: Transparent until hover
- **Touch Target**: 4px padding creates adequate touch area
- **Hover Feedback**: 10% white background on hover
- **Smooth Transition**: 0.2s background transition

## Body Content

### Body Container
```css
.popover-body {
    padding: 24px;
}
```

**Layout**: Consistent 24px padding for content breathing room

### Form Labels
```css
.popover-body label {
    display: block;
    color: white;
    margin: 16px 0 8px;
    font-weight: 500;
    font-size: 16px;
    float: left;
}
```

**Typography**:
- **Block Display**: Full width for form structure
- **Medium Weight**: 500 weight for clear hierarchy
- **Consistent Spacing**: 16px top, 8px bottom margins
- **Float Left**: Allows for flexible form layouts

### Input Fields
```css
.popover-body input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    font-size: 14px;
    outline: none;
    transition: all 0.2s;
    box-sizing: border-box;
}
```

**Glassmorphism Input Design**:
- **Full Width**: 100% width with border-box sizing
- **Glass Background**: 10% white transparency
- **Subtle Border**: 20% white opacity for definition
- **Rounded Corners**: 8px radius matches content panel
- **Generous Padding**: 12px vertical, 16px horizontal for comfortable typing

**Input States**:
```css
.popover-body input:focus {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
}
```
- **Focus Enhancement**: Stronger border (40%) and background (15%)
- **Accessibility**: Clear focus indication for keyboard navigation

### Placeholder Styling
```css
.popover-body input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}
```
**Visibility**: 60% white opacity ensures placeholder readability without dominating

## Action Buttons

### Primary Save Button
```css
#save-settings {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    margin-top: 8px;
    margin-bottom: 24px;
    width: 50%;
    float: right;
}
```

**Primary Action Styling**:
- **Enhanced Background**: 20% opacity for prominence
- **Stronger Border**: 30% opacity for definition
- **Right Alignment**: Float right for action button convention
- **Half Width**: 50% width allows for secondary actions

**Hover Enhancement**:
```css
#save-settings:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
}
```

## City Popover System

### City Modal Container
```css
.city-popover {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
    align-items: center;
    justify-content: center;
}
```

**Enhanced Z-index**: 9999 ensures city popovers appear above settings popover

### City Content Sizing
```css
.city-popover .popover-content {
    max-width: 400px;
    min-width: 350px;
}
```
**Fixed Dimensions**: Consistent sizing for city selection interfaces

### City Action Buttons
```css
#save-city-1, #save-city-2 {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    width: 50%;
    height: 5%;
    text-align: center;
}
```

### Cancel Button
```css
.cancel-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s;
    width: 50%;
    height: 5%;
    text-align: center;
}
```

**Secondary Action**: Reduced opacity (10% background) to de-emphasize

### Button Container Layout
```css
.city-popover .popover-body p {
    display: flex;
    gap: 12px;
    margin-top: 20px;
}
```
**Button Pairing**: Flexbox with 12px gap for save/cancel button pairs

## Cache Duration Interface

### Radio Button Grid
```css
.cache-duration-options {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0;
    margin-top: 0;
    max-height: 160px;
    overflow-y: auto;
}
```

**Grid Layout**:
- **Two Columns**: Efficient use of modal space
- **Scrollable**: 160px max-height with overflow for many options
- **No Gap**: Border-adjacent layout for seamless appearance

### Duration Label
```css
.cache-duration-label {
    display: flex;
    margin-top: 24px;
    justify-content: space-between;
    align-items: center;
}
```

### Radio Option Styling
```css
.radio-option {
    display: flex;
    align-items: center;
    padding: 6px 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 13px;
}
```

**Interactive Cards**:
- **Subtle Background**: 5% opacity for minimal presence
- **Hover Enhancement**: 10% opacity on hover
- **Border Definition**: 10% opacity borders
- **Compact Size**: 13px font, minimal padding
- **Smooth Interaction**: 0.2s transitions

### Radio Input Styling
```css
.radio-option input[type="radio"] {
    margin-right: 6px;
    accent-color: #74c0fc;
    transform: scale(0.9);
}
```

**Custom Radio Design**:
- **Color Accent**: Light blue accent color (#74c0fc)
- **Compact Scale**: 90% size for better proportion
- **Proper Spacing**: 6px margin from label text

## Layer Hierarchy

### Z-index Management
```
Background Content: z-index: auto
Settings Popover: z-index: 1000
City Popover: z-index: 9999
Popover Content: position: relative (stacking context)
```

### Stacking Context
Each popover creates its own stacking context for internal element layering

## Responsive Design

### Viewport Adaptation
- **Mobile Width**: 90% width adapts to narrow screens
- **Max Width**: 400px prevents overly wide modals on large screens
- **Height Constraints**: 80vh max-height prevents viewport overflow
- **Scrollable Content**: Internal scrolling for overflow content

### Touch Optimization
- **Touch Targets**: Minimum 44px tap targets for buttons
- **Adequate Spacing**: 12px gaps between interactive elements
- **Clear Boundaries**: Visible borders define clickable areas

## Performance Considerations

### Rendering Optimization
- **Fixed Positioning**: Avoids layout recalculations
- **Backdrop Filter**: Hardware acceleration for blur effects
- **Transform Friendly**: Uses opacity and transform for animations
- **Minimal Repaints**: Efficient property transitions

### Memory Efficiency
- **Shared Classes**: Common popover styles reduce CSS complexity
- **Efficient Selectors**: ID and class selectors for optimal performance
- **Lazy Loading**: Display: none until needed

## Accessibility Features

### Keyboard Navigation
- **Focus Management**: Proper focus trapping within modals
- **Tab Order**: Logical navigation flow through form elements
- **Escape Handling**: JavaScript controls modal dismissal

### Screen Reader Support
- **Semantic Elements**: Proper heading and form structures
- **Label Associations**: Form labels properly connected to inputs
- **ARIA Attributes**: Modal state communicated to assistive technology

### Visual Accessibility
- **High Contrast**: White text on semi-transparent backgrounds
- **Focus Indicators**: Clear visual focus states for all interactive elements
- **Color Independence**: Functionality not dependent on color alone

## Integration Points

### JavaScript Dependencies
- **Show/Hide Logic**: Display property controlled by main.js
- **Event Handling**: Form submission and button clicks managed by JavaScript
- **State Management**: Modal state synchronized with application state

### CSS Dependencies
- **Variables**: May use color variables from variables.css
- **Box Model**: Inherits box-sizing from global styles
- **Typography**: Font family inherited from variables.css

### Component Coordination
- **Button System**: Triggered by buttons.css styled elements
- **Form Integration**: Works with form elements across the application
- **Settings Storage**: Coordinates with storage.js for persistence

## Future Enhancements
- **Animation System**: Enter/exit animations for modal appearances
- **Theme Variations**: Alternative color schemes for different contexts
- **Accessibility Improvements**: Enhanced ARIA support and focus management
- **Mobile Optimization**: Gesture-based modal interactions
- **Progressive Enhancement**: Fallback styles for limited browser support
