# Focus.js Documentation

## Overview
The `focus.js` module manages the daily focus feature in the Daily Photo Art extension. It provides a simple yet effective interface for users to set and display their main focus or goal for the day, with smart text truncation and inline editing capabilities.

## Key Features
- **Daily Focus Setting**: Single-line focus input with character limits
- **Smart Text Truncation**: Automatic ellipsis for long focus statements
- **Inline Editing**: Click-to-edit interface with immediate feedback
- **Persistent Storage**: Focus goals saved across browser sessions
- **Hover Tooltips**: Full text display on hover for truncated content
- **Real-time Validation**: Character limit enforcement during typing

## Core Functionality

### `initializeFocus()`
**Purpose**: Initializes the focus management system with event handlers and display logic.

**Process**:
1. **Element Validation**: Checks for required DOM elements
2. **Configuration Loading**: Gets character limits from HTML attributes
3. **Storage Loading**: Retrieves existing focus from storage
4. **Event Binding**: Sets up all user interaction handlers
5. **Display Management**: Configures initial visibility states

**Required DOM Elements**:
- `#focus`: Input field for editing focus
- `#focus-display`: Display element for showing focus

**Configuration**:
- `maxlength` attribute on `#focus` element (default: 16 characters)
- Character limit enforcement for concise focus statements

### `formatDisplayText(text)`
**Purpose**: Internal function that handles text truncation with ellipsis for display.

**Logic**:
```javascript
if (text.length > maxLength) {
  return text.substring(0, maxLength) + '...';
}
return text;
```

**Features**:
- **Precise Truncation**: Cuts text at exact character limit
- **Visual Indicator**: Adds "..." to indicate truncated content
- **Preservation**: Original text maintained in storage and tooltip

**Example**:
- Input: "Complete the important project presentation"
- Display: "Complete the im..."
- Tooltip: Full original text

## User Interface States

### Display Mode
**Active When**: Focus is set and saved
**Visibility**:
- `#focus-display`: Visible (block)
- `#focus`: Hidden

**Features**:
- Shows formatted (potentially truncated) focus text
- Click-to-edit functionality
- Hover tooltip with full text
- Clean, readable presentation

### Edit Mode  
**Active When**: User is inputting or editing focus
**Visibility**:
- `#focus`: Visible (input field)
- `#focus-display`: Hidden

**Features**:
- Direct text input with character limit
- Real-time character counting and limitation
- Enter key to save and switch to display mode
- Blur event handling for empty input

### Empty State
**Active When**: No focus is set
**Visibility**:
- `#focus-display`: Hidden
- `#focus`: Visible (ready for input)

**Behavior**: Ready for user to input their first focus

## Event Handling

### Keypress Event (Enter Key)
**Trigger**: User presses Enter in input field
**Process**:
1. **Value Extraction**: Gets and trims input value
2. **Validation**: Checks for non-empty content
3. **Storage**: Saves focus using storage.js
4. **UI Update**: Switches to display mode
5. **Text Display**: Shows formatted text with tooltip

**Code Flow**:
```javascript
Enter pressed → trim value → save to storage → hide input → show display
```

### Input Event (Real-time Validation)
**Trigger**: User types in input field
**Purpose**: Enforces character limit during typing
**Process**:
1. **Length Check**: Monitors input length
2. **Truncation**: Cuts text if exceeds maximum
3. **Update**: Maintains input field value within limits

**Benefits**:
- **Immediate Feedback**: Users see limit enforcement
- **Prevents Overflow**: Stops typing at character limit
- **Smooth UX**: No jarring validation messages

### Blur Event (Focus Loss)
**Trigger**: User clicks away from input field
**Purpose**: Handles empty input cleanup
**Process**:
1. **Value Check**: Tests for empty/whitespace input
2. **Storage Clear**: Saves empty string to storage
3. **UI Reset**: Returns to empty state display

**Behavior**: Automatic cleanup for abandoned empty inputs

### Click Event (Edit Activation)
**Trigger**: User clicks on focus display text
**Purpose**: Switches from display to edit mode
**Process**:
1. **Mode Switch**: Shows input, hides display
2. **Value Loading**: Retrieves full text from storage (not truncated display)
3. **Focus Setting**: Automatically focuses input field
4. **Edit Ready**: Cursor positioned for immediate editing

**Smart Loading**: Always loads complete text from storage, ensuring no data loss from display truncation

## Storage Integration

### Save Operations
**Function**: Uses storage.js `save("focus", value)`
**Triggers**:
- Enter key press with valid content
- Blur event with empty content (saves empty string)

**Data**: Raw untruncated text stored

### Load Operations  
**Function**: Uses storage.js `load("focus")`
**Triggers**:
- Component initialization
- Edit mode activation (to ensure full text loading)

**Usage**: Retrieved value used for both display and editing

### Data Persistence
- **Cross-Session**: Focus persists across browser restarts
- **Full Text**: Complete content saved regardless of display truncation
- **Empty State**: Empty focus properly handled and cleared

## Character Limit Management

### Configuration
- **Default Limit**: 16 characters
- **HTML Attribute**: `maxlength` on input element
- **Dynamic Loading**: Reads limit from DOM for flexibility

### Enforcement Points
1. **Input Event**: Real-time typing limitation
2. **Display Format**: Truncation with ellipsis
3. **Storage**: Full text saved regardless of display limit

### User Experience
- **Visual Feedback**: Ellipsis indicates truncation
- **Full Access**: Hover and edit show complete text
- **Typing Limit**: Prevents over-length input
- **Tooltip**: Immediate access to full content

## Display Management

### Text Formatting
- **Truncation**: Smart cutting at character limit
- **Ellipsis**: Visual indicator for truncated content
- **Preservation**: Original text maintained in storage

### Tooltip System
- **Full Text Access**: Complete focus shown on hover
- **Browser Native**: Uses standard `title` attribute
- **Immediate**: No delay for tooltip display

### Responsive Design
- **Inline Display**: Fits naturally in layout
- **Adaptive Width**: Adjusts to content within limits
- **Clean Appearance**: Minimal visual impact

## Integration Architecture

### Storage System
**Dependency**: storage.js module
**Functions Used**:
- `save("focus", value)` - Focus persistence
- `load("focus")` - Focus retrieval

### Event System
**DOM Events**:
- `keypress` - Enter key handling
- `input` - Real-time validation
- `blur` - Focus loss handling
- `click` - Edit mode activation

### Main Application
**Initialization**: Automatic setup on DOM ready
**Global Export**: `window.FocusUtils.initializeFocus`
**Integration**: Called by main app initialization

## Performance Optimizations

### DOM Efficiency
- **Element Caching**: DOM elements queried once
- **Event Delegation**: Minimal event listeners
- **Direct Manipulation**: Efficient visibility changes

### Storage Efficiency  
- **Minimal Calls**: Storage accessed only when needed
- **Async Operations**: Non-blocking storage operations
- **Efficient Updates**: Only saves when content changes

### User Experience
- **Immediate Response**: Real-time typing feedback
- **Smooth Transitions**: Instant mode switching
- **No Delays**: Direct focus and blur handling

## Error Handling

### Missing Elements
- **Graceful Failure**: Returns early if DOM elements missing
- **No Errors**: Silent failure for optional component
- **Fault Isolation**: Doesn't break other components

### Storage Failures
- **Promise Handling**: Proper async/await error management
- **Fallback Behavior**: Continues operation without storage
- **Data Recovery**: Reload from storage on edit activation

### Input Validation
- **Trim Whitespace**: Prevents empty space-only entries
- **Character Limits**: Hard limits prevent overflow
- **Type Safety**: String validation for storage values

## Configuration Options

### Character Limits
- **HTML Attribute**: `maxlength` on input element
- **Runtime Override**: JavaScript can modify limits
- **Default Fallback**: 16 characters when not specified

### Display Behavior
- **Truncation Point**: Configurable via maxlength
- **Ellipsis Style**: Standard "..." indicator
- **Tooltip Delay**: Browser default hover timing

### Integration Settings
- **Auto-Initialize**: Runs on DOM ready
- **Global Access**: Available via window object
- **Event Binding**: Automatic event handler setup

## Accessibility Features

### Keyboard Support
- **Enter Key**: Primary save action
- **Tab Navigation**: Standard focus management
- **Blur Handling**: Logical focus loss behavior

### Screen Reader Support
- **Tooltip Text**: Full content available via title attribute
- **State Changes**: Clear visual state indicators
- **Input Labels**: Proper form field associations

### Visual Indicators
- **Ellipsis**: Clear truncation indication
- **Hover States**: Interactive element feedback
- **Focus States**: Clear edit mode indication

## Future Enhancements
- **Character Counter**: Real-time character count display
- **Focus Categories**: Predefined focus types or tags
- **Focus History**: Track previous daily focuses
- **Analytics**: Focus completion tracking and insights
- **Rich Text**: Basic formatting options for focus text
- **Drag & Drop**: Reorder multiple focus items
