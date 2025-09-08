# Translations.js Documentation

## Overview
The `translations.js` module provides comprehensive internationalization (i18n) support for the Daily Photo Art extension. It manages multi-language content, dynamic text updates, and seamless language switching across the entire application.

## Key Features
- **Multi-language support** (Italian, English, French, German)
- **Dynamic language switching** without page reload
- **Automatic text application** via data attributes
- **Context-aware translations** for different UI elements
- **Extensible translation system** for easy language additions

## Supported Languages

### Available Languages
- **Italian (IT)**: Primary language, most comprehensive
- **English (EN)**: Full translation coverage
- **French (FR)**: Complete localization
- **German (DE)**: Full language support

### Language Codes
- `it` - Italian (Italiano)
- `en` - English
- `fr` - French (Français) 
- `de` - German (Deutsch)

## Translation Categories

### Core Interface Elements
- **Greetings**: Time-based salutations
- **Navigation**: Button labels and tooltips
- **Settings**: Configuration interface text
- **Weather**: Meteorological information
- **Quotes**: Citation and author attribution

### Time-Based Greetings
```javascript
goodMorning: "Good morning"    // Morning greeting
goodAfternoon: "Good afternoon" // Afternoon greeting
goodEvening: "Good evening"     // Evening greeting
```

### Weather Translations
```javascript
weatherNotAvailable: "Weather not available"
cityNotFound: "City not found"
humidity: "Humidity"
wind: "Wind"
weatherError: "Weather error"
```

### Photo Attribution
```javascript
photoBy: "Photo by"                    // Photo credit prefix
originalQuoteTooltip: "Hold to see original language"
releaseToReturnTranslation: "Release to return to translation"
```

### Cache Duration Labels
```javascript
cacheDurationLabel: "Cache duration"   // Main label
cache2minutes: "2 minutes"             // 2-minute option
cache1hour: "1 hour"                   // 1-hour option
cache6hours: "6 hours"                 // 6-hour option
cache12hours: "12 hours"               // 12-hour option
cache24hours: "24 hours"               // 24-hour option
cache48hours: "48 hours"               // 48-hour option
cache72hours: "72 hours"               // 72-hour option
```

### Todo Categories
```javascript
categoryWork: "Work"           // Work-related tasks
categoryHome: "Home"           // Household tasks
categoryHobby: "Hobby"         // Personal interests
categoryBureaucracy: "Bureaucracy"  // Administrative tasks
categoryPayments: "Payments"   // Financial tasks
```

### Welcome Screen
```javascript
welcomeTitle: "Welcome!"
welcomeSubtitle: "What's your name?"
welcomeInputPlaceholder: "Enter your name"
welcomeStartButton: "Start"
```

## Functions

### `loadTranslations(language)`
**Purpose**: Loads and applies translations for the specified language across the entire application.

**Parameters**:
- `language` (string): Language code ('it', 'en', 'fr', 'de')

**Process**:
1. Validates language code availability
2. Retrieves translation object for language
3. Updates global `currentTexts` variable
4. Applies translations to all UI elements
5. Updates specialized components

**Features**:
- Fallback to English if language not found
- Global text variable update
- Comprehensive UI text replacement

### `applyTranslations(texts)`
**Purpose**: Applies translation texts to all DOM elements with translation attributes.

**Translation Methods**:
1. **Direct Element Updates**: Updates specific elements by ID
2. **Category Labels**: Handles emoji + text combinations
3. **Generic Data Attributes**: Updates all `[data-translate]` elements

**Element Updates**:
```javascript
// Greeting and interface elements
updateElementText('#greeting', texts.greeting)
updateElementText('#date-display', texts.dateDisplay)

// Weather components
updateElementText('#weather-city-name', texts.cityName)
updateElementText('#weather-temp', texts.temperature)

// Settings interface
updateElementText('#settings-title', texts.settingsTitle)
updateElement('name-input', 'placeholder', texts.namePlaceholder)
```

**Category Label Handling**:
- Preserves emoji prefixes in category options
- Updates text while maintaining visual indicators
- Supports dynamic category additions

**Generic Translation Application**:
- Finds all elements with `data-translate` attribute
- Matches attribute value to translation key
- Updates element text content automatically
- Excludes category-specific elements to prevent conflicts

### `updateElementText(selector, text)`
**Purpose**: Helper function to safely update element text content.

**Features**:
- Null-safe element selection
- Graceful handling of missing elements
- Consistent text updating across application

### `updateElement(elementId, attribute, value)`
**Purpose**: Helper function to update element attributes (placeholders, titles, etc.).

**Supported Attributes**:
- `placeholder` - Input field hints
- `title` - Tooltip text
- `alt` - Image alt text
- Custom attributes as needed

## Language Data Structure

### Translation Object Format
```javascript
{
  // Core interface
  greeting: "Good morning",
  settingsTitle: "Settings",
  
  // Weather system
  weatherNotAvailable: "Weather not available",
  humidity: "Humidity",
  
  // Cache duration
  cacheDurationLabel: "Cache duration",
  cache1hour: "1 hour",
  
  // Categories
  categoryWork: "Work",
  
  // Welcome screen
  welcomeTitle: "Welcome!",
  
  // Attribution
  photoBy: "Photo by"
}
```

### Extensibility
New translations can be added by:
1. Adding new key-value pairs to each language object
2. Implementing corresponding `data-translate` attributes in HTML
3. No code changes required for basic translations

## Integration Points

### HTML Integration
```html
<!-- Basic translation -->
<label data-translate="cacheDurationLabel">Cache duration</label>

<!-- Category with emoji -->
<label class="category-option" data-translate="categoryWork">
  💼 Work
</label>

<!-- Input placeholders -->
<input id="name-input" data-translate="namePlaceholder" />
```

### JavaScript Integration
```javascript
// Load specific language
loadTranslations('en')

// Access current translations
const texts = window.currentTexts
const greeting = texts.goodMorning
```

### Global Variables
- `window.currentTexts`: Current active translation object
- Language persistence via localStorage

## Dynamic Language Switching

### Switching Process
1. User selects new language from dropdown
2. `loadTranslations()` called with new language code
3. All UI elements updated automatically
4. Language preference saved to storage
5. No page reload required

### Persistence
- Language choice saved to localStorage
- Restored on application restart
- Fallback to system default if not set

## Translation Guidelines

### Adding New Languages
1. Create new language object in translations structure
2. Translate all existing keys
3. Add language option to HTML select element
4. Test all UI components with new language

### Key Naming Conventions
- `camelCase` for multi-word keys
- Descriptive names indicating context
- Consistent naming across related elements
- Category prefix for grouped translations

### Text Guidelines
- Keep translations concise for UI space
- Maintain consistent tone across language
- Consider cultural context
- Test with longer text for layout issues

## Performance Considerations
- Translation objects loaded once per language switch
- Minimal DOM queries through caching
- Efficient element selection and updates
- No performance impact during normal operation

## Error Handling
- Graceful fallback for missing translations
- Safe element selection with null checks
- Language validation before loading
- Fallback to English for unknown languages

## Accessibility
- Proper language attributes for screen readers
- Consistent terminology across interface
- Clear and descriptive text for all elements
- Support for right-to-left languages (future enhancement)
