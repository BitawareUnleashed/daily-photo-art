# weather.js Documentation

## Overview
The weather module provides weather information display for two configurable cities using the Open-Meteo API. Features automatic geolocation, weather code translation, robust error handling, and complete translation fallback support for reliable multilingual operation.

## Recent Updates (September 2025)
- **Fixed undefined translations bug** - All fallback objects now include complete translation keys
- **Enhanced error resilience** - Improved fallback handling when translation system is unavailable
- **Standardized fallback patterns** - Consistent translation fallbacks across all weather functions

## Features

### Dual City Weather Display
- **Primary Weather**: Main city weather display (`#weather` element)
- **Secondary Weather**: Optional second city display (`#weather-2` element)  
- **Independent Configuration**: Each city has separate settings and cache
- **Automatic Refresh**: Weather data updates based on cache duration settings

### Weather Data Sources
- **Geocoding**: Open-Meteo geocoding service for city coordinate resolution
- **Weather API**: Open-Meteo forecast API for current conditions
- **Data Points**: Temperature, weather conditions, humidity, wind speed
- **Localization**: Weather descriptions in multiple languages

### Translation System Integration
- **Multilingual Support**: Weather labels adapt to user's selected language
- **Robust Fallbacks**: Complete Italian fallbacks when translation system unavailable
- **Dynamic Updates**: Weather display updates when language changes
- **Error Messages**: Localized error messages for all failure scenarios

## Core Functions

### City Weather Loading

#### `loadWeatherForCity(cityName)`
Loads weather for a specified city and displays in primary weather element.

**Enhanced Translation Fallback:**
```javascript
const texts = window.currentTexts || { 
  cityNotFound: "Città non trovata", 
  humidity: "Umidità", 
  wind: "Vento",
  weatherNotAvailable: "Meteo non disponibile"
};
```

**Process Flow:**
1. Geocode city name to coordinates
2. Fetch current weather data from Open-Meteo
3. Process weather codes and translate descriptions
4. Display formatted weather information
5. Save city configuration for future loads

#### `loadWeatherForCity2(cityName)`
Identical functionality to `loadWeatherForCity` but targets the secondary weather display (`#weather-2`).

**Usage Example:**
```javascript
await loadWeatherForCity("Roma");      // Primary display
await loadWeatherForCity2("Milano");   // Secondary display
```

### Configuration-Based Loading

#### `loadWeather()`
Loads weather using saved primary city configuration.

**Enhanced Error Handling:**
```javascript
const texts = window.currentTexts || { 
  weatherNotAvailable: "Meteo non disponibile",
  humidity: "Umidità", 
  wind: "Vento"
};
```

**Configuration Storage:**
- **Key**: `weatherCfg`
- **Data**: `{ lat, lon, city }`
- **Fallback**: Shows "Meteo non disponibile" if no configuration

#### `loadWeather2()`
Loads weather for secondary city using saved configuration (`weatherCfg2`).

### Utility Functions

#### `getCoordinates(cityName)`
Resolves city name to geographic coordinates using Open-Meteo geocoding.

**API Endpoint:**
```
https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1&language=it&format=json
```

**Return Format:**
```javascript
{
  name: "Roma",
  country: "IT", 
  lat: 41.8919,
  lon: 12.5113
}
```

#### `getWeatherDescription(code)`
Translates Open-Meteo weather codes to localized descriptions.

**Weather Code Mapping:**
- `0`: Clear sky / Cielo sereno
- `1-3`: Partly cloudy variants / Parzialmente nuvoloso
- `45-48`: Fog conditions / Nebbia
- `51-67`: Rain variants / Pioggia
- `71-86`: Snow conditions / Neve
- `95-99`: Thunderstorm variants / Temporale

#### `getWeatherIcon(code)`
Maps weather codes to appropriate emoji icons for visual representation.

**Icon Examples:**
- ☀️ Clear sky
- ⛅ Partly cloudy
- 🌧️ Rain
- ❄️ Snow
- ⛈️ Thunderstorm

## Display Format

### Weather Information Template
```html
<strong>Roma, IT</strong> • ☀️ 23°C - Soleggiato • Umidità: 65% • Vento: 12 km/h
```

### Template Components
- **Location**: `City, Country` in bold
- **Temperature**: Rounded to nearest degree Celsius
- **Icon**: Weather condition emoji
- **Description**: Localized weather description
- **Humidity**: Percentage with localized label
- **Wind Speed**: km/h with localized label

## Error Handling

### Translation Fallback Strategy
**Problem Solved**: Previous versions showed "undefined" for humidity and wind labels when translation system was unavailable.

**Solution**: Complete fallback objects in all weather functions:
```javascript
// Before (incomplete - caused undefined display)
const texts = window.currentTexts || { weatherNotAvailable: "Meteo non disponibile" };

// After (complete - prevents undefined)
const texts = window.currentTexts || { 
  weatherNotAvailable: "Meteo non disponibile",
  humidity: "Umidità", 
  wind: "Vento",
  cityNotFound: "Città non trovata"
};
```

### Error Scenarios
- **City Not Found**: Displays localized "Città non trovata" message
- **Network Errors**: Shows "Meteo non disponibile" with console error logging
- **API Failures**: Graceful degradation with user-friendly error messages
- **Translation Unavailable**: Uses Italian fallbacks to prevent undefined display

### Logging Strategy
```javascript
console.error('Weather error:', error);        // Detailed error for debugging
weatherEl.textContent = texts.weatherNotAvailable + "."; // User-friendly message
```

## Integration Points

### Translation System
- **Dependency**: `translations.js` for `window.currentTexts`
- **Fallback**: Complete Italian translations when system unavailable
- **Dynamic Updates**: Weather display refreshes when language changes

### Storage System
- **Primary Config**: `weatherCfg` stores main city settings
- **Secondary Config**: `weatherCfg2` stores second city settings
- **Persistence**: Configurations survive browser restarts

### DOM Integration
- **Primary Element**: `#weather` for main city display
- **Secondary Element**: `#weather-2` for second city display
- **Dynamic Content**: HTML content injection with formatted weather data

### Main Application
- **Event Listeners**: Weather functions called from main app event handlers
- **Initialization**: Weather loads automatically when city configurations exist
- **Settings Integration**: Weather functions called when users change city settings

## API Dependencies

### Open-Meteo Services
- **Geocoding API**: City name to coordinates resolution
- **Forecast API**: Current weather conditions
- **Rate Limits**: Free tier limitations apply
- **Reliability**: High availability weather service

### API Request Format
```javascript
// Geocoding
const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=it&format=json`;

// Weather
const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`;
```

## Performance Considerations

### Caching Strategy
- **City Coordinates**: Saved after first successful geocoding
- **Configuration Persistence**: Avoids repeated city lookups
- **Error Resilience**: Graceful handling of API failures

### Network Optimization
- **Minimal Requests**: Only fetches current conditions
- **Efficient Endpoints**: Uses timezone=auto for automatic time handling
- **Error Recovery**: Continues operation if one weather source fails

## Browser Compatibility
- **Modern Browsers**: Full support for fetch API and async/await
- **Error Handling**: Graceful degradation for older browsers
- **Translation Support**: Works with or without translation system

## Development Notes

### Recent Bug Fixes (September 2025)
1. **Translation Undefined Bug**: Fixed incomplete fallback objects causing "undefined" in weather display
2. **Error Resilience**: Enhanced error handling for translation system unavailability
3. **Consistency**: Standardized fallback patterns across all weather functions

### Testing Considerations
- **Translation System**: Test with and without `window.currentTexts` available
- **Network Failures**: Verify graceful error handling
- **City Configurations**: Test both primary and secondary weather displays
- **Language Changes**: Verify weather display updates with language switching

### Future Enhancements
- **Weather Alerts**: Integration with severe weather warnings
- **Extended Forecast**: Multi-day weather predictions
- **Weather Maps**: Integration with visual weather data
- **Custom Units**: Support for Fahrenheit and other unit systems
