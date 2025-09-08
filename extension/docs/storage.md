# Storage.js Documentation

## Overview
The `storage.js` module provides a unified storage interface for the Daily Photo Art extension. It abstracts the complexity of different storage mechanisms, offering seamless data persistence across both Chrome extension environment and standalone web applications.

## Key Features
- **Dual storage support** (Chrome extension storage + localStorage fallback)
- **Automatic environment detection** and optimal storage selection
- **Promise-based API** for consistent async handling
- **JSON serialization** for complex data types
- **Cross-platform compatibility** for extension and web deployment

## Storage Mechanisms

### Chrome Extension Storage (Primary)
- **Type**: `chrome.storage.sync`
- **Benefits**: Cloud synchronization across user devices
- **Capacity**: Up to 100KB total, 8KB per item
- **Persistence**: Permanent until extension uninstall
- **Sync**: Automatic across Chrome instances

### localStorage (Fallback)
- **Type**: Browser localStorage API
- **Benefits**: Simple, fast, widely supported
- **Capacity**: ~5-10MB depending on browser
- **Persistence**: Permanent until manual clear
- **Sync**: Local device only

## Functions

### `save(key, value)`
**Purpose**: Stores data with automatic serialization and storage mechanism selection.

**Parameters**:
- `key` (string): Unique identifier for the stored data
- `value` (any): Data to store (automatically serialized)

**Returns**: Promise that resolves when storage operation completes

**Process**:
1. **Environment Detection**: Checks for Chrome extension APIs
2. **Storage Selection**: Uses chrome.storage.sync if available, localStorage otherwise
3. **Data Handling**: 
   - Chrome storage: Direct object storage
   - localStorage: JSON serialization
4. **Promise Resolution**: Consistent async interface

**Examples**:
```javascript
// Save user preferences
await save('userSettings', {
  name: 'John',
  language: 'en',
  theme: 'dark'
})

// Save simple values
await save('cacheDuration', 24)
await save('lastUpdate', Date.now())
```

### `load(key)`
**Purpose**: Retrieves data with automatic deserialization and storage mechanism selection.

**Parameters**:
- `key` (string): Unique identifier for the data to retrieve

**Returns**: Promise that resolves with the stored value or `undefined` if not found

**Process**:
1. **Environment Detection**: Matches save() mechanism selection
2. **Data Retrieval**:
   - Chrome storage: Direct object retrieval
   - localStorage: JSON deserialization
3. **Error Handling**: Returns `undefined` for missing or corrupted data
4. **Type Preservation**: Maintains original data types

**Examples**:
```javascript
// Load user preferences
const settings = await load('userSettings')
// Returns: { name: 'John', language: 'en', theme: 'dark' }

// Load simple values
const duration = await load('cacheDuration')  // Returns: 24
const timestamp = await load('lastUpdate')   // Returns: 1694188800000
```

## Storage Architecture

### Environment Detection Logic
```javascript
if (typeof chrome !== 'undefined' && chrome.storage) {
  // Chrome extension environment
  // Use chrome.storage.sync
} else {
  // Standalone web environment
  // Use localStorage
}
```

### Data Flow Diagram
```
User Data Input
       ↓
   save(key, value)
       ↓
Environment Detection
   ↓              ↓
Chrome Storage   localStorage
   ↓              ↓
Sync Across      Local Storage
Devices          Only
       ↓
   Promise Resolution
```

### Serialization Strategy

**Chrome Storage**:
- Native object support
- No manual serialization needed
- Direct storage of complex types

**localStorage**:
- JSON.stringify() on save
- JSON.parse() on load
- Automatic type conversion

## Data Types Support

### Supported Data Types
- **Primitives**: string, number, boolean
- **Objects**: Plain objects, nested structures
- **Arrays**: Any array type with supported elements
- **Dates**: Stored as timestamps (manual conversion needed)
- **null/undefined**: Handled gracefully

### Unsupported Data Types
- **Functions**: Cannot be serialized
- **Circular References**: JSON serialization limitation
- **Symbol**: Not JSON serializable
- **BigInt**: Requires manual conversion

## Error Handling

### Chrome Storage Errors
- **Quota Exceeded**: Automatic fallback to localStorage
- **Network Issues**: Retry mechanism (future enhancement)
- **Permission Issues**: Graceful degradation

### localStorage Errors
- **Quota Exceeded**: Clear error messaging
- **Private Mode**: Alternative storage strategies
- **Corrupted Data**: Returns undefined, continues operation

### JSON Serialization Errors
- **Circular References**: Prevents infinite loops
- **Invalid JSON**: Safe parsing with error handling
- **Type Conversion**: Preserves original types where possible

## Integration Points

### Extension Integration
```javascript
// Settings management
const userSettings = await load('userSettings')
await save('userSettings', updatedSettings)

// Cache duration
const duration = await load('cacheDuration') || 24
await save('cacheDuration', newDuration)
```

### Module Dependencies
- **main.js**: User settings and preferences
- **background.js**: Cache management data
- **weather.js**: City preferences and weather data
- **quotes.js**: Language preferences and quote settings
- **todo.js**: Task storage and todo list data

### Global Accessibility
```javascript
// Available globally as
window.StorageUtils = { save, load }

// Usage throughout application
const { save, load } = window.StorageUtils
```

## Performance Considerations

### Chrome Storage Performance
- **Sync Operations**: Slightly slower due to cloud sync
- **Batching**: Single operations preferred over multiple calls
- **Caching**: Consider in-memory caching for frequently accessed data

### localStorage Performance
- **Speed**: Very fast for local operations
- **Size Limits**: Monitor storage usage for large datasets
- **Blocking**: Synchronous operations in localStorage fallback

### Best Practices
- **Batch Operations**: Group related saves when possible
- **Consistent Keys**: Use predictable naming conventions
- **Data Validation**: Validate data before storage
- **Error Recovery**: Implement graceful fallback strategies

## Security Considerations

### Data Sensitivity
- **User Data**: Stored locally/in user's Chrome sync
- **No Server Transmission**: All data remains user-controlled
- **Privacy**: No data collection or external transmission

### Storage Security
- **Chrome Storage**: Encrypted and secured by Chrome
- **localStorage**: Browser security model protection
- **Cross-Site**: Isolated per origin/extension

## Migration and Compatibility

### Version Compatibility
- **Backward Compatibility**: Handles legacy data formats
- **Forward Compatibility**: Extensible data structures
- **Migration Paths**: Smooth upgrades between versions

### Cross-Browser Support
- **Chrome**: Full chrome.storage.sync support
- **Firefox**: localStorage fallback (with future WebExtensions support)
- **Safari**: localStorage fallback
- **Edge**: Chrome extension compatibility

## Debugging and Monitoring

### Storage Inspection
- **Chrome DevTools**: Application → Storage → Extensions
- **localStorage**: Application → Storage → Local Storage
- **Data Validation**: Built-in error logging

### Common Issues
- **Storage Quota**: Monitor usage in extension
- **Sync Conflicts**: Handle chrome.storage.sync limitations
- **Data Corruption**: Implement validation and recovery

## Future Enhancements
- **IndexedDB Support**: For large dataset storage
- **Encryption**: Additional security layer option
- **Compression**: Reduce storage footprint
- **Backup/Restore**: User data export/import functionality
