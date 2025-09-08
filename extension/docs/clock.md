# Clock.js Documentation

## Overview
The `clock.js` module manages time display, user greetings, and application state transitions in the Daily Photo Art extension. It handles the welcome screen flow, main content visibility, and personalized greeting messages based on time of day.

## Key Features
- **Real-time clock display** with automatic updates
- **Welcome screen management** for new users
- **Personalized greetings** based on time of day and user name
- **Application state transitions** between welcome and main views
- **Multi-language greeting support** with dynamic text loading
- **Main content initialization** coordination

## Core Functions

### `tickClock()`
**Purpose**: Updates the digital clock display with current time.

**Process**:
1. Gets current date/time
2. Formats time to HH:MM format
3. Updates clock DOM element

**Features**:
- **24-hour format**: European time standard
- **Auto-padding**: Two-digit hour and minute display
- **Live updates**: Called by timer interval
- **Locale-aware**: Uses browser locale for time formatting

**DOM Target**: `#clock` element

**Example Output**: "14:32", "09:15", "23:59"

### `greeting()`
**Purpose**: Main greeting initialization that determines whether to show welcome screen or main content.

**Logic Flow**:
```
Check for saved name
    ↓
Name exists? → Yes → displayGreeting() → showMainContent()
    ↓
    No
    ↓
showWelcomeScreen()
```

**Integration**: Uses storage.js `load()` function to check for existing user name.

### `showWelcomeScreen()`
**Purpose**: Displays the first-time user welcome interface and hides main application elements.

**UI State Changes**:
- **Show**: `#welcome-screen` (flex display)
- **Hide**: `.container` (main content grid)
- **Hide**: `.weather-status-bar` (weather display)
- **Hide**: All main action buttons
- **Show**: Language selector for quotes

**Target Elements**:
```javascript
#welcome-screen          // Welcome interface
.container              // Main content grid
.weather-status-bar     // Weather information
#clear-btn              // Clear todos button
#main-add-todo-btn      // Add todo button
#todo-notification-btn  // Todo notifications
#settings-btn           // Settings button
#quote-language         // Language selector
```

**User Flow**: New user → Name input → Language selection → Enter main app

### `showMainContent()`
**Purpose**: Transitions from welcome screen to main application interface.

**UI State Changes**:
- **Hide**: `#welcome-screen`
- **Show**: `.container` (grid display)
- **Show**: `.weather-status-bar` (flex display)
- **Show**: All main action buttons (inline-flex)

**Component Initialization**:
After UI transition, initializes main content components:
- **Quotes**: `loadQuote()` - Daily quote display
- **Weather**: `loadWeather()` - Primary city weather
- **Secondary Weather**: `loadWeather2()` - Second city weather
- **Todos**: `renderTodos()` - Task list display
- **Notifications**: `updateTodoNotificationVisibility()` - Todo alerts

**Integration**: Coordinates with multiple modules for complete app initialization.

### `saveWelcomeName()`
**Purpose**: Processes new user name input and transitions to main application.

**Process**:
1. **Input Validation**: Gets and trims name from input field
2. **Storage**: Saves name using storage.js `save()` function
3. **Greeting**: Calls `displayGreeting()` with new name
4. **Transition**: Calls `showMainContent()` to enter main app

**Input Source**: `#welcome-name-input` field value

**Validation**: Requires non-empty trimmed string

**Flow**: Name input → Storage → Greeting → Main content

### `displayGreeting(name)`
**Purpose**: Shows personalized time-based greeting message.

**Time-Based Logic**:
- **Morning (0-11)**: Good morning message
- **Afternoon (12-17)**: Good afternoon message  
- **Evening (18-23)**: Good evening message

**Localization**:
Uses `window.currentTexts` for translated greetings:
```javascript
{
  goodMorning: "Buongiorno",      // or "Good morning"
  goodAfternoon: "Buon pomeriggio", // or "Good afternoon"
  goodEvening: "Buonasera"        // or "Good evening"
}
```

**Output Format**: `"Good morning, Marco."` or `"Buonasera, Lisa."`

**DOM Target**: `#greeting` element

**Fallback**: Italian greetings as default if translations not loaded

## Application State Management

### Welcome Flow State Machine
```
App Start
    ↓
greeting() called
    ↓
Name stored? → No → showWelcomeScreen()
    ↓              ↓
    Yes            User enters name
    ↓              ↓
displayGreeting()  saveWelcomeName()
    ↓              ↓
showMainContent() ←─────┘
```

### UI Visibility States

#### Welcome State
```
Visible:
- Welcome screen
- Language selector
- Name input field

Hidden:
- Main container
- Weather bar
- Action buttons
- Main content
```

#### Main Application State
```
Visible:
- Main container (grid)
- Weather status bar
- All action buttons
- Clock and greeting
- All main content

Hidden:
- Welcome screen
- Welcome input fields
```

## Integration Architecture

### Storage Integration
- **Name Persistence**: Uses storage.js for user name storage
- **Load Function**: `load('name')` for name retrieval
- **Save Function**: `save('name', value)` for name storage

### Translation Integration
- **Dynamic Greetings**: Uses `window.currentTexts` from translations.js
- **Language Updates**: Greeting updates when language changes
- **Fallback Text**: Italian defaults when translations unavailable

### Component Coordination
Initializes main content modules after state transition:
- **Quotes Module**: Daily inspirational quotes
- **Weather Module**: Dual-city weather display
- **Todo Module**: Task management system
- **Notification System**: Todo alerts and reminders

## Clock System

### Time Display
- **Format**: HH:MM (24-hour European format)
- **Update Frequency**: Called by main timer (typically 1-second intervals)
- **Locale Support**: Browser locale-aware formatting
- **Padding**: Zero-padded hours and minutes

### Integration with Main App
- **Timer Coordination**: Clock updates managed by main.js timer
- **DOM Binding**: Direct DOM manipulation for performance
- **Real-time Updates**: Continuous time display refresh

## User Experience Flow

### First-Time User Journey
1. **App Launch**: Extension opens
2. **Name Check**: System checks for stored name
3. **Welcome Screen**: Shows if no name found
4. **Name Input**: User enters their name
5. **Language Choice**: Optional language selection
6. **Save & Transition**: Name saved, main app loads
7. **Greeting Display**: Personalized greeting shown
8. **Content Load**: All main features initialized

### Returning User Journey
1. **App Launch**: Extension opens
2. **Name Check**: Finds existing stored name
3. **Direct Greeting**: Shows personalized greeting immediately
4. **Main Content**: Loads main app interface directly
5. **Content Initialization**: All features ready immediately

## Performance Optimizations

### DOM Efficiency
- **Batch Updates**: Single DOM query per element type
- **Element Caching**: Stores element references
- **Minimal Reflows**: Efficient display property changes

### State Management
- **Single Source**: Name storage as application state source
- **Lazy Loading**: Content components only load when needed
- **Event Optimization**: Minimal event listener attachment

### Memory Management
- **Global Exports**: Controlled global namespace exposure
- **Function Cleanup**: No memory leaks in timer functions
- **Element References**: Efficient DOM element management

## Error Handling

### Storage Errors
- **Load Failures**: Graceful fallback to welcome screen
- **Save Failures**: Error handling in promise chains
- **Storage Unavailable**: Continues with in-memory operation

### DOM Errors
- **Missing Elements**: Null checks before DOM manipulation
- **Display Issues**: Fallback to basic text display
- **Initialization Failures**: Component-level error isolation

### Content Loading
- **Component Failures**: Individual component error handling
- **Partial Loading**: App continues with available components
- **Recovery Mechanisms**: Retry logic for failed initializations

## Configuration

### Time Settings
- **Format**: 24-hour European standard
- **Locale**: Browser locale detection
- **Update Interval**: Managed by main app timer

### Greeting Settings
- **Time Ranges**: Morning (0-11), Afternoon (12-17), Evening (18-23)
- **Language Support**: Multi-language greeting text
- **Personalization**: User name integration

### UI Settings
- **Transition Speed**: Instant state changes for responsiveness
- **Display Properties**: Grid/flex layouts for modern browsers
- **Button Styling**: Consistent inline-flex button display

## Global API

### Window Exports
```javascript
window.ClockUtils = {
  tickClock,           // Clock update function
  greeting,            // Main greeting initialization
  showWelcomeScreen,   // Welcome state display
  showMainContent,     // Main app state display
  saveWelcomeName,     // Name input processing
  displayGreeting      // Greeting message display
}
```

### Integration Points
- **Main.js**: Timer management and app initialization
- **Storage.js**: Name persistence and retrieval
- **Translations.js**: Multi-language greeting support
- **Component Modules**: Content initialization coordination

## Future Enhancements
- **Custom Time Zones**: User-specified timezone display
- **Date Display**: Optional date alongside time
- **Greeting Customization**: User-defined greeting messages
- **Animation Transitions**: Smooth state change animations
