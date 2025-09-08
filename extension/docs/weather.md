# Weather.js Documentation

## Overview
The `weather.js` module manages weather data fetching, display, and location services for the Daily Photo Art extension. It provides dual-city weather support with automatic geocoding and real-time weather information using the Open-Meteo API.

## Key Features
- **Dual city weather display** (primary and secondary locations)
- **Automatic geocoding** for city name to coordinates conversion
- **Real-time weather data** with comprehensive meteorological information
- **Multi-language support** for weather descriptions
- **Error handling** for network and API issues
- **Responsive UI updates** with loading states

## API Integration

### Open-Meteo Services
- **Geocoding API**: `geocoding-api.open-meteo.com/v1/search`
- **Weather API**: `api.open-meteo.com/v1/forecast`
- **Benefits**: Free, no API key required, reliable service
- **Rate Limits**: Generous limits for personal use

### Data Sources
- **Primary**: Open-Meteo weather service
- **Geocoding**: Open-Meteo geocoding service
- **Fallback**: Graceful error handling for service unavailability

## Functions

### `getCoordinates(cityName)`
**Purpose**: Converts city names to geographic coordinates using geocoding services.

**Parameters**:
- `cityName` (string): Name of the city to geocode

**Returns**: 
```javascript
{
  lat: number,      // Latitude coordinate
  lon: number,      // Longitude coordinate  
  name: string,     // Standardized city name
  country: string   // Country name
}
```
Returns `null` if city not found.

**Features**:
- URL encoding for international city names
- Italian language preference for results
- Single result optimization for performance
- Comprehensive error handling

**Example Usage**:
```javascript
const location = await getCoordinates("Milano")
// Returns: { lat: 45.4643, lon: 9.1895, name: "Milan", country: "Italy" }
```

### `loadWeatherForCity(cityName)`
**Purpose**: Loads and displays weather information for the primary city location.

**Process**:
1. **Geocoding**: Converts city name to coordinates
2. **Weather Fetch**: Retrieves current weather data
3. **UI Update**: Updates primary weather display
4. **Error Handling**: Shows appropriate error messages

**Parameters**:
- `cityName` (string): Name of the city for weather display

**UI Elements Updated**:
- `#weather`: Primary weather display
- Temperature, conditions, humidity, wind information

**Error States**:
- City not found message
- Network error handling
- API unavailability messaging

### `loadSecondWeatherForCity(cityName)`
**Purpose**: Loads and displays weather information for the secondary city location.

**Features**:
- Independent of primary city weather
- Separate UI elements and error handling
- Parallel processing capability
- Identical API integration as primary

**UI Elements Updated**:
- `#weather2`: Secondary weather display
- Independent temperature and condition display

### `getWeatherData(lat, lon)`
**Purpose**: Fetches detailed weather information for specific coordinates.

**Parameters**:
- `lat` (number): Latitude coordinate
- `lon` (number): Longitude coordinate

**Weather Data Retrieved**:
```javascript
{
  current: {
    temperature_2m: number,        // Current temperature (°C)
    relative_humidity_2m: number,  // Humidity percentage
    weather_code: number,          // Weather condition code
    wind_speed_10m: number,        // Wind speed (km/h)
    wind_direction_10m: number     // Wind direction (degrees)
  }
}
```

**API Configuration**:
- Current weather conditions
- Temperature in Celsius
- Humidity and wind data
- Timezone handling
- European time format

### `formatWeatherData(data, location)`
**Purpose**: Formats raw weather data into user-friendly display format.

**Process**:
1. **Temperature Conversion**: Rounds to nearest integer
2. **Weather Description**: Maps weather codes to descriptions
3. **Humidity Formatting**: Percentage display
4. **Wind Information**: Speed and direction formatting
5. **Localization**: Applies current language translations

**Output Format**:
```
CityName, Country
🌤️ 22°C - Partly Cloudy
💧 Humidity: 65% | 🌪️ Wind: 12 km/h
```

### `getWeatherEmoji(weatherCode)`
**Purpose**: Maps numeric weather codes to appropriate emoji representations.

**Weather Code Mapping**:
- **0**: ☀️ Clear sky
- **1-3**: 🌤️ Partly cloudy variations
- **45-48**: 🌫️ Fog conditions
- **51-67**: 🌧️ Rain variations
- **71-86**: 🌨️ Snow conditions
- **95-99**: ⛈️ Thunderstorm conditions

**Features**:
- Comprehensive weather code coverage
- Intuitive emoji selection
- Fallback for unknown codes

### `getWeatherDescription(weatherCode, language)`
**Purpose**: Provides textual weather descriptions in multiple languages.

**Supported Languages**:
- Italian (it) - Primary language
- English (en) - Full coverage
- French (fr) - Complete translations
- German (de) - Full localization

**Description Categories**:
- Clear conditions
- Cloud variations
- Precipitation types
- Severe weather conditions
- Atmospheric phenomena

## Weather Display Architecture

### Dual City System
```
Primary City (Top)           Secondary City (Right)
├── City name + country      ├── City name + country
├── Temperature + emoji      ├── Temperature + emoji  
├── Weather description      ├── Weather description
└── Humidity + wind data     └── Humidity + wind data
```

### UI Integration
- **Primary**: `#weather` element (top of screen)
- **Secondary**: `#weather2` element (right side)
- **Loading States**: Temporary loading indicators
- **Error States**: Localized error messages

### Responsive Design
- Mobile-friendly layout
- Adaptive text sizing
- Overflow handling for long city names
- Weather emoji consistent sizing

## Data Flow

### Weather Loading Process
```
City Name Input
       ↓
   getCoordinates()
       ↓
Geographic Coordinates
       ↓
   getWeatherData()
       ↓
Raw Weather Data
       ↓
   formatWeatherData()
       ↓
Formatted Display
       ↓
UI Update
```

### Error Handling Flow
```
API Request
    ↓
Success? → Yes → Format Data → Update UI
    ↓
    No
    ↓
Error Type Detection
    ↓
Network Error → Show connectivity message
Geocoding Error → Show city not found
Weather Error → Show weather unavailable
```

## Integration Points

### Storage Integration
- **City Preferences**: Saved via storage.js
- **Last Update**: Timestamp tracking
- **Settings Persistence**: User city choices

### Translation Integration
- **Dynamic Language**: Updates with language changes
- **Weather Descriptions**: Localized condition text
- **Error Messages**: Translated error states
- **UI Labels**: Humidity, wind, temperature labels

### Settings Integration
- **City Management**: Settings popover integration
- **Primary/Secondary Cities**: Independent configuration
- **Real-time Updates**: Immediate weather refresh on city change

## Performance Optimizations

### Caching Strategy
- **Location Cache**: Coordinates cached for repeated city lookups
- **Weather Cache**: Recent weather data cache (5-minute TTL)
- **Geocoding Cache**: City coordinate mapping persistence

### Network Efficiency
- **Single API Calls**: Optimized request patterns
- **Parallel Processing**: Dual city data loading
- **Request Debouncing**: Prevents excessive API calls
- **Offline Handling**: Graceful degradation without network

### UI Performance
- **Smooth Updates**: Non-blocking UI updates
- **Progressive Loading**: Incremental data display
- **Error Recovery**: Automatic retry mechanisms
- **Memory Management**: Efficient data cleanup

## Error Handling

### Network Errors
- **Connection Issues**: Offline detection and messaging
- **Timeout Handling**: Request timeout with retry
- **Rate Limiting**: Respectful API usage patterns

### Data Validation
- **Coordinate Validation**: Valid latitude/longitude ranges
- **Weather Code Validation**: Known weather code handling
- **City Name Sanitization**: Safe input processing

### User Experience
- **Loading Indicators**: Visual feedback during data fetch
- **Error Messages**: Clear, actionable error communication
- **Fallback Content**: Default weather display when data unavailable

## Configuration

### API Settings
- **Base URLs**: Open-Meteo service endpoints
- **Request Parameters**: Optimal parameter configuration
- **Language Settings**: Localization preferences
- **Update Intervals**: Weather refresh timing

### Display Settings
- **Temperature Unit**: Celsius default (configurable)
- **Wind Speed Unit**: km/h (European standard)
- **Time Format**: 24-hour European format
- **Date Format**: ISO standard with timezone

## Security and Privacy

### Data Handling
- **No Personal Data**: Only city names processed
- **No Storage**: Weather data not permanently stored
- **API Security**: HTTPS-only connections
- **User Privacy**: No tracking or data collection

### API Compliance
- **Terms of Service**: Open-Meteo compliance
- **Rate Limiting**: Respectful usage patterns
- **Attribution**: Proper service attribution (where required)

## Future Enhancements
- **Weather Alerts**: Severe weather notifications
- **Extended Forecast**: Multi-day weather predictions
- **Weather Maps**: Visual weather data integration
- **Custom Locations**: GPS-based automatic location detection
