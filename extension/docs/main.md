# Main.js Documentation

## Overview
The `main.js` module serves as the central orchestrator for the Daily Photo Art extension. It handles application initialization, event listeners setup, user settings management, and coordinates between all other modules.

## Recent Updates (September 2025)
- **Optimized loading sequence** - Separated UI initialization from background loading for faster startup
- **Eliminated default background** - No more placeholder images during loading
- **Instant first load** - Background images apply without fade effect on first load
- **Non-blocking initialization** - UI components load immediately while background loads asynchronously

## Key Features
- **Application initialization** and lifecycle management with optimized loading
- **Event listener orchestration** for all UI components
- **Settings management** with cache duration configuration
- **Clean view toggle** functionality
- **Cross-module coordination** and integration
- **Asynchronous background loading** for improved performance

## Functions

### `initializeApp()`
**Purpose**: Main initialization function that bootstraps the entire application when DOM is loaded.

**Enhanced Loading Strategy (Sept 2025)**:
```javascript
async function initializeApp() {
  await initializeUI();           // Load UI immediately
  initializeBackgroundAsync();    // Load background without blocking
}
```

**Optimization Benefits**:
- UI components (clock, greeting, controls) load instantly
- Background loading doesn't block user interaction
- Eliminated placeholder/default background images
- First image loads without fade effect for immediate display

### `initializeUI()`
**Purpose**: Immediately loads all user interface components without waiting for background.

**Immediate Initialization**:
1. Sets up all event listeners for UI components instantly
2. Starts clock with 1-second intervals immediately
3. Triggers greeting system with minimal delay (50ms)
4. Enables all controls and interactions without waiting

**Performance Impact**: UI becomes interactive within milliseconds of DOM ready.

### `initializeBackgroundAsync()`
**Purpose**: Loads background images asynchronously without blocking UI.

**Background Loading Strategy**:
1. No default/placeholder image loading
2. Waits for high-quality cached or fresh images only
3. First image applies instantly (no fade effect)
4. Subsequent images use fade transitions
5. Starts cache expiration checker after completion

**Quality Control**: Only displays images that meet quality standards (150KB+, <15min age).

### `setupWelcomeEventListeners()`
**Purpose**: Manages the welcome screen functionality for new users.

**Features**:
- Name input validation and saving
- Enter key support for quick submission
- Input field management and feedback
- Smooth transition to main interface

**Event Handlers**:
- Welcome save button click
- Enter key press in name input
- Input field changes for validation

### `setupCleanViewEventListeners()`
**Purpose**: Implements clean view toggle functionality for distraction-free experience.

**Clean View Features**:
- Toggles between normal and minimal interface
- Hides/shows UI elements dynamically
- Visual feedback with icon changes
- State persistence across sessions

**Toggle States**:
- **Normal View**: Full interface with all elements
- **Clean View**: Minimal interface, hidden distractions

### `setupTestCrossfadeEventListeners()`
**Purpose**: Provides testing functionality for the crossfade transition system.

**Test Features**:
- Immediate background change trigger
- Cache bypass for testing
- Button disable prevention (anti-spam)
- Visual feedback during operation
- Error handling and recovery

**Usage**: Development and quality assurance testing

### `setupSettingsEventListeners()`
**Purpose**: Manages the settings popover and user configuration options.

**Settings Management**:
- Name input and validation
- City selection for weather
- Cache duration configuration (2min - 72h)
- Settings persistence and loading

**Cache Duration Options**:
- 2 minutes (0.033 hours) - Testing
- 1, 6, 12, 24, 48, 72 hours - Production use

**Event Handlers**:
- Settings button click (popover open)
- Close button and overlay clicks
- Save button with validation
- Radio button selection for cache duration

**Popover Management**:
- Dynamic content loading
- Overlay backdrop handling
- Smooth open/close animations
- Click-outside-to-close functionality

### `setupTodoEventListeners()`
**Purpose**: Manages todo list functionality and task management.

**Todo Features**:
- Task creation and editing
- Task state management (todo/priority/completed)
- Visual feedback and animations
- Persistent storage

**Event Handlers**:
- Add todo button clicks
- Task state cycling
- Todo form management
- Hide/show todo section

### `setupWeatherEventListeners()`
**Purpose**: Handles weather display and city management functionality.

**Weather Management**:
- City change popover handling
- Dual city support (primary/secondary)
- Weather data loading coordination
- Input validation and saving

**City Management**:
- Primary and secondary city configuration
- City input validation
- Save button handling
- Popover open/close management

### `setupQuoteEventListeners()`
**Purpose**: Manages quote display and language selection functionality.

**Quote Features**:
- Language selection handling
- Quote refresh coordination
- Translation system integration

### `setupKeyboardEventListeners()`
**Purpose**: Implements keyboard shortcuts and navigation.

**Keyboard Support**:
- Enter key shortcuts
- Navigation helpers
- Accessibility improvements

### `getCacheDuration()`
**Purpose**: Retrieves user-configured cache duration from storage.

**Return Values**:
- User-selected duration in hours
- Default: 24 hours if not configured
- Supports decimal values (e.g., 0.033 for 2 minutes)

**Integration**: Used by background.js for cache validation

### `save(key, value)` / `load(key)`
**Purpose**: Unified storage interface supporting both Chrome extension storage and localStorage.

**Storage Strategy**:
- Chrome extension storage (preferred)
- localStorage fallback
- Consistent API across environments

**Features**:
- Automatic storage type detection
- Error handling and fallback
- Async/await support

### `displayGreeting(name)`
**Purpose**: Shows personalized greeting based on time of day and user name.

**Greeting Logic**:
- Time-based greetings (morning/afternoon/evening)
- Personalization with user name
- Fallback to default if no name set

## Application Architecture

### Initialization Flow
```
DOM Ready → initializeApp()
├── Setup Event Listeners
│   ├── Welcome screen
│   ├── Clean view toggle
│   ├── Test crossfade
│   ├── Settings management
│   ├── Todo functionality
│   ├── Weather display
│   ├── Quote system
│   └── Keyboard shortcuts
├── Load Background System
├── Start Cache Expiration Checker
├── Initialize Clock
└── Trigger Greeting System
```

### Event Coordination
The main.js module coordinates events between:
- UI interactions and backend systems
- Settings changes and module updates
- User input and data persistence
- Module initialization and configuration

### Settings Architecture
```javascript
{
  name: string,           // User's name
  city: string,          // Primary city
  cacheDuration: number, // Hours (0.033-72)
  // ... other settings
}
```

## Integration Points

### Module Dependencies
- **background.js**: Image loading and cache management
- **storage.js**: Data persistence
- **translations.js**: Multi-language support
- **weather.js**: Weather data loading
- **clock.js**: Time display
- **quotes.js**: Quote management
- **todo.js**: Task management

### DOM Elements
- Settings popover and controls
- Welcome screen elements
- Weather display components
- Todo interface elements
- Background and overlay elements

## Error Handling
- Storage operation failures
- Network connectivity issues
- Invalid user input validation
- Module loading failures
- Graceful degradation strategies

## Performance Considerations
- Event listener efficiency
- Settings loading optimization
- Module initialization order
- Memory management
- Storage operation batching

## User Experience Features
- Smooth transitions and animations
- Responsive feedback
- Accessibility support
- Keyboard navigation
- Mobile-friendly interactions

## Configuration Management
- Persistent user preferences
- Real-time setting updates
- Cache duration reconfiguration
- Module restart coordination
- Settings validation and sanitization
