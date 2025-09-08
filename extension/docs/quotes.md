# Quotes.js Documentation

## Overview
The `quotes.js` module manages daily inspirational quotes with multi-language translation support, intelligent caching, and fallback systems. It provides a robust quote display system with automatic translation, cache management, and multiple API sources for reliability.

## Key Features
- **Multi-API Support**: ZenQuotes, Quotable, and local fallback quotes
- **Intelligent Caching**: 15-minute cache duration with automatic expiration
- **Real-time Translation**: MyMemory API integration for multi-language support
- **Original Quote Toggle**: Button to view quotes in original English
- **Fallback System**: Graceful degradation when APIs are unavailable
- **Performance Optimized**: Cache-first loading with smart invalidation

## Core Variables

### `currentQuote`
**Type**: Object | null
**Purpose**: Stores the currently loaded quote data
**Structure**:
```javascript
{
  text: string,    // Quote content
  author: string   // Quote author
}
```

### `CACHE_DURATION`
**Value**: 15 minutes (900,000 milliseconds)
**Purpose**: Defines how long quotes remain cached before automatic refresh

## Cache Management

### `saveQuoteToCache(quote)`
**Purpose**: Persists quote data to localStorage with timestamp for expiration tracking.

**Process**:
1. **Timestamp Addition**: Adds current timestamp to quote data
2. **JSON Serialization**: Converts data to JSON for storage
3. **LocalStorage Save**: Stores in 'cachedQuote' key
4. **Logging**: Console logging for debugging

**Storage Format**:
```javascript
{
  quote: { text: string, author: string },
  timestamp: number // Date.now()
}
```

### `loadQuoteFromCache()`
**Purpose**: Retrieves cached quote if still within cache duration.

**Logic Flow**:
```
Check localStorage → Parse JSON → Calculate age → Valid? → Return quote
                                                    ↓
                                                   No
                                                    ↓
                                            Remove cache → Return null
```

**Features**:
- **Age Calculation**: Compares current time with cache timestamp
- **Automatic Cleanup**: Removes expired cache entries
- **Error Handling**: Graceful handling of corrupted cache data
- **Performance Logging**: Console output for cache hit/miss tracking

### `getCacheRemainingTime()`
**Purpose**: Returns remaining cache time in minutes for UI display.

**Returns**: Number of minutes remaining in cache, 0 if expired/no cache

**Usage**: Can be used for cache status indicators or debug information

## Translation System

### `translateText(text, targetLang = 'it')`
**Purpose**: Translates English text to target language using MyMemory API.

**Parameters**:
- `text` (string): Original English text to translate
- `targetLang` (string): Target language code (default: 'it')

**API Integration**:
- **Service**: MyMemory Translation API
- **Endpoint**: `https://api.mymemory.translated.net/get`
- **Language Pair**: Always from English ('en') to target language
- **Rate Limits**: Respectful usage within API limits

**Features**:
- **English Passthrough**: Returns original text for English language
- **Error Fallback**: Returns original text if translation fails
- **URL Encoding**: Proper encoding for special characters
- **Status Validation**: Checks API response status before using translation

**Example Usage**:
```javascript
const translated = await translateText("The way to get started is to quit talking and begin doing.", "it");
// Returns: "Il modo per iniziare è smettere di parlare e iniziare a fare."
```

## Quote Loading System

### `loadQuote()`
**Purpose**: Main quote loading function that handles cache, translation, and UI updates.

**Logic Flow**:
```
Check currentQuote → Exists? → Translate to selected language → Update UI
       ↓                              ↓
   Check cache                    Return
       ↓
   Cache valid? → Yes → Set currentQuote → Translate → Update UI
       ↓
       No
       ↓
   getNewQuote()
```

**Features**:
- **Cache-First Loading**: Checks cache before API calls
- **Language Switching**: Translates existing quotes without reloading
- **UI State Management**: Updates quote display and original button
- **Smart Caching**: Uses cached quotes when available

**UI Elements Updated**:
- `#quote`: Main quote display element
- `#original-quote-btn`: Toggle button for original language

### `getNewQuote()`
**Purpose**: Fetches fresh quote from external APIs with intelligent fallback system.

**API Priority Chain**:
1. **ZenQuotes API** (Primary)
   - Endpoint: `https://zenquotes.io/api/random`
   - Response: `{ q: string, a: string }`
   - Reliability: High quality quotes

2. **Quotable API** (Secondary)
   - Endpoint: `https://api.quotable.io/random`
   - Response: `{ content: string, author: string }`
   - Backup: Alternative source

3. **Local Fallback** (Tertiary)
   - **Source**: Hardcoded array of inspirational quotes
   - **Authors**: Walt Disney, John Lennon, Eleanor Roosevelt, etc.
   - **Purpose**: Ensures app functionality when all APIs fail

**Process Flow**:
```
For each API in order:
    Try API call → Success? → Save to cache → Translate → Update UI → Return
                      ↓
                     Fail
                      ↓
               Try next API

All APIs failed → Show error message
```

**Error Handling**:
- **Individual Failures**: Logs warning and tries next API
- **Complete Failure**: Shows localized error message
- **Network Issues**: Graceful degradation to offline functionality

## Original Quote Feature

### Button Management
**Element**: `#original-quote-btn`
**Visibility Logic**:
- **Show**: When language ≠ English AND translation ≠ original text
- **Hide**: When language = English OR no translation performed

**Button Properties**:
- **Text**: 🌐 (globe emoji)
- **Tooltip**: Translated "Hold to see original language" message
- **Stored Data**: Both translated and original quote versions

### Interaction System
The button stores both quote versions:
- `originalQuoteBtn.translatedText`: Current translated version
- `originalQuoteBtn.originalText`: Original English version

**Tooltip Translation**:
Uses TranslationManager for localized tooltip text:
```javascript
originalQuoteBtn.title = window.TranslationManager.getTranslation('originalQuoteTooltip');
```

### `updateOriginalQuoteTooltip()`
**Purpose**: Updates tooltip text when language changes.

**Integration**: Called by translation system when language switching occurs

## Performance Optimizations

### Caching Strategy
- **Duration**: 15-minute cache for balance of freshness and performance
- **Storage**: localStorage for persistence across sessions
- **Validation**: Timestamp-based cache expiration
- **Cleanup**: Automatic removal of expired cache

### Network Efficiency
- **Cache-First**: Avoids unnecessary API calls
- **Fallback Chain**: Multiple APIs prevent single points of failure
- **Local Backup**: Offline functionality with hardcoded quotes
- **Smart Loading**: Translation of existing quotes vs new quote fetching

### Translation Efficiency
- **English Bypass**: No translation for English language selection
- **Reuse Logic**: Translates existing quotes when changing language
- **Error Tolerance**: Falls back to original text on translation failure

## Error Handling

### API Failures
- **Individual Service**: Try next service in chain
- **All Services**: Show error message, app continues functioning
- **Network Issues**: Graceful degradation with cached or local content

### Cache Errors
- **Corrupted Data**: Remove invalid cache, proceed with fresh fetch
- **Storage Issues**: Continue without caching
- **JSON Errors**: Clean slate approach with error logging

### Translation Errors
- **API Unavailable**: Return original English text
- **Invalid Response**: Use original text as fallback
- **Network Issues**: Maintain English display

## Integration Architecture

### Storage System
- **Method**: localStorage for quote caching
- **Key**: 'cachedQuote' for quote storage
- **Format**: JSON with quote data and timestamp

### Translation System
- **Dependency**: window.TranslationManager for UI text
- **Integration**: Tooltip translations and error messages
- **Fallback**: Hardcoded Italian text when TranslationManager unavailable

### Language Selection
- **Element**: `#quote-language` select element
- **Default**: Italian ('it')
- **Trigger**: Language changes trigger quote translation

## Global API

### Window Exports
```javascript
window.QuoteUtils = {
  translateText,              // Translation function
  loadQuote,                 // Main quote loading
  getNewQuote,               // Fresh quote fetching  
  getCurrentQuote,           // Current quote getter
  updateOriginalQuoteTooltip, // Tooltip update function
  getCacheRemainingTime      // Cache status function
}
```

### Integration Points
- **Main.js**: Called during app initialization
- **Translations.js**: Tooltip and UI text updates
- **Settings**: Language selection integration

## Configuration

### Cache Settings
- **Duration**: 15 minutes (configurable via CACHE_DURATION constant)
- **Storage Key**: 'cachedQuote' in localStorage
- **Cleanup**: Automatic expired cache removal

### API Settings
- **Primary**: ZenQuotes.io for high-quality quotes
- **Secondary**: Quotable.io for reliability backup
- **Fallback**: 7 hardcoded inspirational quotes
- **Translation**: MyMemory API for multi-language support

### Language Support
- **Primary**: English (original quotes)
- **Translations**: Italian, French, German, Spanish (via API)
- **Fallback**: Original English when translation unavailable

## Error Messages
- **Italian**: "Impossibile caricare citazione al momento."
- **Localization**: Uses TranslationManager when available
- **Fallback**: Hardcoded Italian for critical failures

## Future Enhancements
- **Favorite Quotes**: User ability to save preferred quotes
- **Quote Categories**: Filter quotes by themes (motivation, wisdom, etc.)
- **Custom Cache Duration**: User-configurable cache timing
- **Offline Sync**: Enhanced offline quote storage
- **Quote Sharing**: Social sharing capabilities
- **Author Information**: Extended author details and biographical information
