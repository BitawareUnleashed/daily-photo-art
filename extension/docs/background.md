# Background.js Documentation

## Overview
The `background.js` module is responsible for managing background images in the Daily Photo Art extension. It handles image downloading, caching, crossfade transitions, and automatic background updates based on configurable cache durations.

## Key Features
- **Multi-source image loading** (Codicepunto.it priority, Picsum fallback)
- **Intelligent caching system** with base64 storage
- **Smooth crossfade transitions** between images
- **Automatic cache expiration** with precise timing
- **Offline support** through cached image data

## Functions

### `saveBackgroundToCache(imgUrl, photoData, photoId, source)`
**Purpose**: Saves background image and metadata to localStorage with base64 encoding for offline access.

**Parameters**:
- `imgUrl` (string): The image URL (blob or HTTP)
- `photoData` (object): Photo metadata and information
- `photoId` (string): Unique identifier for the photo
- `source` (string): Source name ('codicepunto', 'picsum', etc.)

**Features**:
- Converts any image URL to base64 for storage
- Stores complete image data for offline use
- Handles network errors gracefully
- Logs cache size and status

### `loadBackgroundFromCache()`
**Purpose**: Retrieves and validates cached background images, handling expiration and fallback loading.

**Returns**: Object with image data or special status indicators

**Cache Validation**:
- Checks cache age against user-configured duration
- Supports dynamic cache duration (2 minutes to 72 hours)
- Returns cached base64 images for instant loading
- Provides fallback network reload for missing data

**Special Return Values**:
- `{ cacheExpired: true, loadNewImage: true }` - Cache expired, trigger new load
- `{ reloadFailed: true }` - Cache valid but network reload failed
- `null` - No cache found or error occurred

### `downloadCodicepuntoPhoto()`
**Purpose**: Downloads random photos from the Codicepunto.it repository with associated metadata.

**Process**:
1. Generates random photo ID (DBE_001 to DBE_021)
2. Downloads JPG image from GitHub repository
3. Downloads corresponding JSON metadata
4. Creates blob URL for immediate use

**Returns**: `{ imgUrl, photoData, photoId }` or `false` on failure

### `applyBackgroundWithFade(bgElement, imgUrl)`
**Purpose**: Applies new background image with smooth crossfade transition effect.

**Crossfade Process**:
1. **Preload**: Loads new image completely before transition
2. **Overlay Creation**: Creates temporary div with new image
3. **Crossfade**: Simultaneous fade-out of old image and fade-in of new
4. **Cleanup**: Updates main background and removes overlay

**Timing**: 3000ms (3 seconds) for smooth professional transition

**Features**:
- Prevents flash/flicker during image changes
- Handles preload failures with direct fallback
- Maintains proper z-index layering
- Ensures DOM synchronization

### `setBackground()`
**Purpose**: Main background loading function that orchestrates the entire background management system.

**Workflow**:
1. **Cache Check**: Attempts to load from cache first
2. **Source Priority**: Tries Codicepunto.it, falls back to Picsum
3. **Image Application**: Uses crossfade for smooth transition
4. **Cache Update**: Saves new image for future use
5. **UI Update**: Updates photo information display

**Cache Handling**:
- Uses cached images for instant loading
- Handles cache expiration gracefully
- Bypasses cache when explicitly expired

### `updatePhotoInfo()`
**Purpose**: Updates photo attribution text when language changes.

**Features**:
- Retrieves photo data from localStorage
- Applies current language translations
- Updates photo info display dynamically

### `startCacheExpirationChecker()`
**Purpose**: Implements precise automatic cache expiration with exact timing.

**Smart Timing**:
- Calculates exact time until cache expiration
- Sets single timeout for precise moment
- Automatically loads new image on expiration
- Restarts timer after loading new image

**Features**:
- Clears previous timers to prevent conflicts
- Handles immediate expiration
- Supports dynamic cache duration changes
- Provides detailed logging for debugging

## Cache System Architecture

### Storage Format
```javascript
{
  photoData: object,     // Photo metadata
  photoId: string,       // Unique identifier
  source: string,        // Source name
  timestamp: number,     // Save timestamp
  imageBase64: string    // Complete image data
}
```

### Cache Duration Support
- **2 minutes** (0.033 hours) - For rapid testing
- **1-72 hours** - Standard durations
- **Dynamic updates** - Changes without restart

### Offline Capabilities
- Complete image data stored as base64
- No network calls during cache validity
- Fallback network loading if base64 missing
- Graceful degradation on storage errors

## Integration Points

### Dependencies
- `getCacheDuration()` from main.js for user settings
- `window.updatePhotoInfo()` for UI updates
- DOM elements: `#bg`, `#photo-info`, `#photo-text`

### Exported Functions
- `downloadCodicepuntoPhoto`
- `setBackground`
- `updatePhotoInfo`
- `startCacheExpirationChecker`

## Performance Optimizations

### Memory Management
- Automatic blob URL cleanup
- Temporary overlay removal
- Timer cleanup on restart

### Network Efficiency
- Base64 caching eliminates repeat downloads
- Smart fallback hierarchy
- Preloading prevents transition delays

### User Experience
- Instant loading from cache
- Smooth crossfade transitions
- Automatic background refresh
- No manual intervention required

## Error Handling
- Network timeout handling
- Invalid image format recovery
- Storage quota exceeded fallback
- Graceful degradation strategies

## Configuration
- Cache duration: User configurable (2min - 72h)
- Transition duration: 3000ms
- Source priority: Codicepunto.it → Picsum
- Photo range: DBE_001 to DBE_021 (Codicepunto)
