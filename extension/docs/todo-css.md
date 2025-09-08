# Todo-CSS.css Documentation

## Overview
The `todo.css` file implements a comprehensive task management interface with a sophisticated glassmorphism design. It provides a floating modal panel with custom 3-state checkboxes, category selection, color coding, and advanced visual feedback systems.

## Modal Container System

### Todo Panel Container
```css
.todo {
  display: none;
  position: fixed;
  top: 100px;
  left: 25px;
  width: 50vw;
  height: calc(75vh - 100px);
  z-index: 9999;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}
```

**Advanced Glassmorphism**:
- **High Opacity Background**: 85% black for strong contrast with content
- **Heavy Backdrop Blur**: 20px blur creates deep frosted glass effect
- **Large Border Radius**: 16px for premium modern appearance
- **Deep Shadow**: 20px offset, 40px blur for strong elevation
- **Responsive Sizing**: 50vw width, calculated height based on viewport

**Positioning Strategy**:
- **Fixed Position**: Maintains position during scroll
- **High Z-index**: 9999 ensures visibility above all other elements
- **Left-aligned**: 25px from left edge for consistent placement
- **Calculated Height**: `calc(75vh - 100px)` provides space for interface elements

### Background Overlay
```css
.todo::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: -1;
}
```

**Backdrop Strategy**:
- **Pseudo-element**: Uses ::before for backdrop without additional DOM
- **Full Coverage**: Fixed positioning covers entire viewport
- **Negative Z-index**: Places behind panel but above main content
- **Subtle Darkness**: 30% black opacity maintains background visibility

## Header System

### Todo Header
```css
.todo-header {
  background: rgba(255, 255, 255, 0.1);
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  border-radius: 16px 16px 0 0;
}
```

**Design Features**:
- **Glassmorphism Header**: 10% white background for subtle definition
- **Right-aligned Content**: Flex end alignment for close button
- **Rounded Top**: Matches container border-radius on top corners only
- **User-select Prevention**: Prevents text selection during drag operations
- **Subtle Border**: Bottom border creates visual separation

### Close Button
```css
#todo-close-btn {
  background: transparent;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}
```

**Interaction Design**:
- **Minimal Appearance**: Transparent until hover
- **Adequate Touch Target**: 4px vertical, 8px horizontal padding
- **Smooth Feedback**: 0.2s background transition
- **Hover Enhancement**: 20% white background on hover

## Content Structure

### Content Area
```css
.todo-content {
  padding: 16px;
  height: calc(100% - 48px);
  overflow-y: auto;
}
```

**Layout Management**:
- **Calculated Height**: Subtracts header height (48px) from container
- **Scrollable Content**: Vertical overflow with auto scrollbars
- **Consistent Padding**: 16px all around for content breathing room

### Todo List Container
```css
#todo-list {
  display: none;
  list-style: none;
  margin: 12px 0 0;
  padding: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 16px;
  margin-top: 8px;
}
```

**Nested Glassmorphism**:
- **Darker Background**: 40% black for content contrast
- **Moderate Blur**: 10px backdrop blur for subtle glass effect
- **Rounded Container**: 12px radius for consistency
- **Internal Padding**: 16px padding for list item spacing

## Custom Checkbox System

### Base Checkbox Design
```css
.todo-checkbox-custom {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.6);
  border-radius: 3px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  line-height: 1;
  transition: all 0.2s ease;
  color: white;
  background: transparent;
}
```

**Custom Control Features**:
- **Consistent Size**: 16px square for optimal click target
- **Flexbox Centering**: Perfect alignment of status indicators
- **Smooth Transitions**: 0.2s ease for all property changes
- **Visual Feedback**: Scale and border changes on hover

### Three-State System

#### State 1: Priority (Filled Square)
```css
.todo-checkbox-custom.state-priority {
  background: rgba(255, 255, 255, 0.8);
  border-color: rgba(255, 255, 255, 0.8);
  color: #333;
}

.todo-checkbox-custom.state-priority::after {
  content: "■";
  font-size: 8px;
}
```

**Priority Indication**:
- **Filled Background**: 80% white opacity for prominence
- **Dark Text**: #333 for contrast against light background
- **Filled Square Symbol**: ■ character indicates priority status

#### State 2: Todo (Empty)
```css
.todo-checkbox-custom.state-todo {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.6);
}
```

**Default State**:
- **Empty Appearance**: Transparent background, border only
- **Subtle Border**: 60% white opacity for definition

#### State 3: Completed (Checkmark)
```css
.todo-checkbox-custom.state-completed {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.8);
}

.todo-checkbox-custom.state-completed::after {
  content: "✓";
  font-size: 10px;
  color: white;
}
```

**Completion Indication**:
- **Semi-transparent Background**: 20% white for subtle filled appearance
- **Strong Border**: 80% opacity for clear completion state
- **Checkmark Symbol**: ✓ character indicates completion

### Checkbox Interaction
```css
.todo-checkbox-custom:hover {
  border-color: rgba(255, 255, 255, 0.9);
  transform: scale(1.1);
}
```

**Hover Feedback**:
- **Enhanced Border**: 90% opacity for strong hover indication
- **Scale Transform**: 10% size increase for tactile feedback

## List Item Structure

### List Item Layout
```css
#todo-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, .15);
  font-size: 16px;
}
```

**Flexbox Organization**:
- **Space Between**: Checkbox/text on left, actions on right
- **Center Alignment**: Vertical centering of all elements
- **Visual Separation**: 15% opacity border between items
- **Readable Size**: 16px font for comfortable reading

### Action Buttons
```css
#todo-list button {
  background: transparent;
  border: 0;
  color: var(--muted);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}
```

**Button Styling**:
- **Minimal Design**: Transparent until hover
- **Muted Color**: Uses CSS variable for consistency
- **Touch-friendly**: 4px vertical, 8px horizontal padding
- **Hover Enhancement**: 10% white background on hover

## Form Interface

### Input Row Layout
```css
.todo-input-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.todo-input-row input {
  flex: 1;
}
```

**Flexible Input Design**:
- **Flexbox Layout**: Accommodates input and action button
- **Flex Growth**: Input takes available space
- **Consistent Gap**: 8px spacing between elements

## Category Selection System

### Category Picker Layout
```css
.category-picker {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  justify-content: center;
  flex-wrap: wrap;
}
```

**Category Organization**:
- **Centered Layout**: Justify-content center for balanced appearance
- **Flexible Wrapping**: Flex-wrap accommodates narrow containers
- **Consistent Spacing**: 8px gap between category options

### Category Option Styling
```css
.category-option {
  padding: 6px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  white-space: nowrap;
}
```

**Pill Design**:
- **Rounded Pills**: 16px border-radius for modern tag appearance
- **Glassmorphism**: 10% white background with border
- **Compact Typography**: 12px font, medium weight (500)
- **No Text Wrapping**: White-space nowrap prevents line breaks

### Selected Category State
```css
.category-picker input[type="radio"]:checked + .category-option {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
}
```

**Selection Indication**:
- **Enhanced Background**: 25% white opacity for prominence
- **Stronger Border**: 50% opacity for definition
- **Glow Effect**: Box-shadow creates selection halo

### Category Hover Effects
```css
.category-option:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-1px);
}
```

**Interactive Feedback**:
- **Background Enhancement**: 20% opacity on hover
- **Subtle Lift**: 1px vertical transform for elevation effect
- **Border Enhancement**: 40% opacity for hover indication

## Badge System

### Category Badge Display
```css
.todo-category-badge {
  display: inline-block;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  margin-left: 8px;
  opacity: 0.8;
}
```

**Compact Badge Design**:
- **Minimal Padding**: 2px vertical, 8px horizontal for compact appearance
- **Small Typography**: 11px font for unobtrusive labeling
- **Rounded Shape**: 12px radius for pill appearance
- **Reduced Opacity**: 80% for subtle presence

## Color Selection System

### Color Picker Layout
```css
.color-picker {
  display: flex;
  gap: 8px;
  margin-top: 8px;
  justify-content: center;
}
```

**Color Organization**:
- **Centered Layout**: Flex justify-content center
- **Consistent Spacing**: 8px gap between color options
- **Compact Margin**: 8px top spacing for form grouping

### Color Option Styling
```css
.color-option {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
}
```

**Circular Color Swatches**:
- **Perfect Circles**: 20px diameter with 50% border-radius
- **Transparent Border**: Allows selection indication
- **Smooth Transitions**: 0.2s for all property changes

### Color Selection States
```css
.color-picker input[type="radio"]:checked + .color-option {
  border-color: rgba(255, 255, 255, 0.8);
  transform: scale(1.2);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}
```

**Selection Feedback**:
- **White Border**: 80% opacity border for selection
- **Scale Enhancement**: 20% size increase for prominence
- **Glow Effect**: Box-shadow creates selection halo

## Button System

### Standard Button Layout
```css
#show-todo-form,
#hide-todo-form,
#add-todo-btn,
#change-city-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: #eee;
  font-size: 1.5em;
  font-weight: bold;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  padding: 0;
  line-height: 1;
  vertical-align: top;
}
```

**Consistent Button Design**:
- **Square Format**: 32px x 32px for uniform appearance
- **Flexbox Centering**: Perfect icon alignment
- **Large Icons**: 1.5em font size for visibility
- **No Padding**: Zero padding with flexbox centering

## Integration Points

### JavaScript Dependencies
- **State Management**: Display properties controlled by todo.js
- **Event Handling**: Click events managed by JavaScript
- **Dynamic Content**: List items generated and updated by JavaScript
- **Form Validation**: Input validation and submission handled by todo.js

### CSS Dependencies
- **Variables**: Uses `--muted` color from variables.css
- **Typography**: Inherits font family from global styles
- **Box Model**: Builds on universal box-sizing

### Component Relationships
- **Button Integration**: Coordinates with buttons.css for trigger elements
- **Glassmorphism Consistency**: Matches design patterns from popover.css
- **Layout Foundation**: Uses positioning strategies from layout.css

## Responsive Design

### Viewport Adaptation
- **Percentage Width**: 50vw adapts to screen size
- **Calculated Height**: Responsive to viewport height changes
- **Flexible Content**: Scrollable overflow accommodates content size
- **Mobile Considerations**: Touch-friendly target sizes

### Content Flexibility
- **Wrap Layouts**: Category and color pickers wrap on narrow screens
- **Scrollable Lists**: Vertical scrolling prevents content overflow
- **Flexible Typography**: Scalable font sizes for readability

## Performance Optimizations

### Rendering Efficiency
- **Fixed Positioning**: Avoids layout recalculations during scroll
- **Transform Animations**: GPU acceleration for smooth interactions
- **Backdrop Filter**: Hardware-accelerated blur effects
- **Efficient Transitions**: Minimal property changes for smooth animations

### Memory Management
- **Shared CSS Classes**: Common patterns reduce stylesheet complexity
- **Efficient Selectors**: ID and class selectors for optimal performance
- **Display None**: Hidden elements don't consume rendering resources

## Accessibility Features

### Keyboard Navigation
- **Focus Management**: Logical tab order through form elements
- **Custom Controls**: Keyboard-accessible checkbox replacements
- **Button States**: Clear visual focus indicators

### Visual Accessibility
- **High Contrast**: White text on dark backgrounds for readability
- **Large Click Targets**: Minimum 32px touch targets
- **Clear State Indication**: Distinct visual states for all interactive elements

### Screen Reader Support
- **Semantic Structure**: Proper list and form element markup
- **Label Association**: Radio buttons properly associated with labels
- **State Communication**: Visual states have semantic meaning

## Browser Compatibility

### Modern Features
- **CSS Grid/Flexbox**: Full support in target browsers
- **Backdrop Filter**: Webkit prefix for Safari compatibility
- **Custom Properties**: CSS variables for dynamic styling
- **Transform Effects**: Hardware acceleration support

### Fallback Strategies
- **Backdrop Filter**: Graceful degradation to solid backgrounds
- **Flex Wrapping**: Progressive enhancement for layout flexibility
- **Color Support**: Fallback colors for older browser versions

## Future Enhancements
- **Drag and Drop**: Visual todo reordering with drag feedback
- **Animation System**: Enter/exit animations for todo items
- **Theme Variations**: Alternative color schemes for different contexts
- **Mobile Optimization**: Touch gestures and swipe actions
- **Advanced Filtering**: Visual filtering by category, color, or status
