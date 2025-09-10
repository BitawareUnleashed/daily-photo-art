/**
 * Weather management module for Daily Photo Art extension
 * Handles weather data fetching, display, and location management
 */

// Weather auto-update system
let weatherUpdateInterval = null;

// Default texts - centralized to avoid duplication
const DEFAULT_TEXTS = {
  cityNotFound: "Città non trovata",
  humidity: "Umidità",
  wind: "Vento",
  weatherNotAvailable: "Meteo non disponibile"
};

/**
 * Get current texts or fallback to defaults
 * @returns {Object} Current texts object
 */
function getTexts() {
  return window.currentTexts || DEFAULT_TEXTS;
}

/**
 * Get weather element ID based on indicator set
 * @param {number} indicatorSet - 1 for first weather, 2 for second weather
 * @returns {string} Weather element ID
 */
function getWeatherElementId(indicatorSet) {
  return `weather-${indicatorSet}`;
}

/**
 * Get weather config key based on indicator set
 * @param {number} indicatorSet - 1 for first weather, 2 for second weather
 * @returns {string} Config key for storage
 */
function getWeatherConfigKey(indicatorSet) {
  return indicatorSet === 1 ? 'weatherCfg' : 'weatherCfg2';
}

/**
 * Display error message in weather element
 * @param {number} indicatorSet - 1 for first weather, 2 for second weather
 * @param {string} message - Error message to display
 */
function displayWeatherError(indicatorSet, message) {
  const weatherEl = document.getElementById(getWeatherElementId(indicatorSet));
  if (weatherEl) {
    weatherEl.textContent = message + ".";
  }
}

/**
 * Get coordinates for a city name using geocoding
 * @param {string} cityName - The name of the city to geocode
 * @returns {Object|null} Location object with lat, lon, name, country or null if not found
 */
async function getCoordinates(cityName) {
  try {
    // Use Open-Meteo geocoding service
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=1&language=it&format=json`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        lat: result.latitude,
        lon: result.longitude,
        name: result.name,
        country: result.country
      };
    }
    return null;
  } catch (error) {
    console.error('Errore nel geocoding:', error);
    return null;
  }
}

/**
 * Load and display weather for specific coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude 
 * @param {string} city - City name
 * @param {number} indicatorSet - 1 for first weather, 2 for second weather
 * @param {boolean} showIndicator - Whether to show update indicator
 */
async function loadWeather(lat, lon, city, indicatorSet, showIndicator = false) {
  try {
    const texts = getTexts();

    if (!lat || !lon || !city) {
      displayWeatherError(indicatorSet, texts.weatherNotAvailable);
      return;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();

    const temp = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;
    const humidity = data.current.relative_humidity_2m;
    const windSpeed = Math.round(data.current.wind_speed_10m);

    const weatherDescription = getWeatherDescription(weatherCode);
    const weatherIcon = getWeatherIcon(weatherCode);

    const weatherEl = document.getElementById(getWeatherElementId(indicatorSet));
    if (weatherEl) {
      weatherEl.innerHTML = `
        <strong>${city}</strong> • ${weatherIcon} ${temp}°C - ${weatherDescription} • ${texts.humidity}: ${humidity}% • ${texts.wind}: ${windSpeed} km/h
      `;
    }

    // Save configuration
    const configKey = getWeatherConfigKey(indicatorSet);
    await save(configKey, { lat, lon, city });

    // Show indicator if requested
    if (showIndicator) {
      showWeatherUpdateIndicator(indicatorSet);
    }

  } catch (error) {
    console.error(`Weather error ${indicatorSet}:`, error);
    const texts = getTexts();
    displayWeatherError(indicatorSet, texts.weatherNotAvailable);
  }
}

/**
 * Load and display weather for a city name
 * @param {string} cityName - The name of the city to get weather for
 * @param {number} indicatorSet - 1 for first weather, 2 for second weather
 * @param {boolean} showIndicator - Whether to show update indicator
 */
async function loadWeatherForCity(cityName, indicatorSet, showIndicator = true) {
  try {
    const texts = getTexts();
    
    // First get city coordinates
    const location = await getCoordinates(cityName);
    
    if (!location) {
      displayWeatherError(indicatorSet, texts.cityNotFound);
      return;
    }

    // Load weather for those coordinates
    await loadWeather(location.lat, location.lon, location.name, indicatorSet, showIndicator);

  } catch (error) {
    console.error(`Weather error ${indicatorSet}:`, error);
    const texts = getTexts();
    displayWeatherError(indicatorSet, texts.weatherNotAvailable);
  }
}

/**
 * Load weather using saved configuration
 * @param {number} indicatorSet - 1 for first weather, 2 for second weather
 * @param {boolean} showIndicator - Whether to show update indicator
 */
async function loadWeatherFromConfig(indicatorSet, showIndicator = false) {
  try {
    console.log(`🌦️ Loading weather from config for location ${indicatorSet}`);
    const configKey = getWeatherConfigKey(indicatorSet);
    const cfg = await load(configKey);
    
    console.log(`🌦️ Config for ${configKey}:`, cfg);
    
    if (cfg && cfg.lat && cfg.lon && cfg.city) {
      console.log(`🌦️ Loading weather for ${cfg.city} (${cfg.lat}, ${cfg.lon})`);
      await loadWeather(cfg.lat, cfg.lon, cfg.city, indicatorSet, showIndicator);
    } else {
      console.log(`❌ No weather config found for location ${indicatorSet}`);
      const texts = getTexts();
      displayWeatherError(indicatorSet, texts.weatherNotAvailable);
    }
  } catch (error) {
    console.error(`❌ Error loading weather ${indicatorSet}:`, error);
    const texts = getTexts();
    displayWeatherError(indicatorSet, texts.weatherNotAvailable);
  }
}



/**
 * Get weather description based on weather code and current language
 * @param {number} code - Weather code from OpenMeteo API
 * @returns {string} Translated weather description
 */
function getWeatherDescription(code) {
  const currentLang = window.currentLang || 'it';

  const weatherTranslations = {
    it: {
      0: "Sereno",
      1: "Prevalentemente sereno",
      2: "Parzialmente nuvoloso",
      3: "Coperto",
      45: "Nebbia",
      48: "Nebbia con brina",
      51: "Pioggerella leggera",
      53: "Pioggerella moderata",
      55: "Pioggerella intensa",
      61: "Pioggia leggera",
      63: "Pioggia moderata",
      65: "Pioggia intensa",
      71: "Neve leggera",
      73: "Neve moderata",
      75: "Neve intensa",
      95: "Temporale",
      unknown: "Sconosciuto"
    },
    en: {
      0: "Clear",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Light rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Light snow",
      73: "Moderate snow",
      75: "Heavy snow",
      95: "Thunderstorm",
      unknown: "Unknown"
    },
    fr: {
      0: "Dégagé",
      1: "Principalement dégagé",
      2: "Partiellement nuageux",
      3: "Couvert",
      45: "Brouillard",
      48: "Brouillard givrant",
      51: "Bruine légère",
      53: "Bruine modérée",
      55: "Bruine dense",
      61: "Pluie légère",
      63: "Pluie modérée",
      65: "Pluie forte",
      71: "Neige légère",
      73: "Neige modérée",
      75: "Neige forte",
      95: "Orage",
      unknown: "Inconnu"
    },
    de: {
      0: "Klar",
      1: "Größtenteils klar",
      2: "Teilweise bewölkt",
      3: "Bedeckt",
      45: "Nebel",
      48: "Reifnebel",
      51: "Leichter Nieselregen",
      53: "Mäßiger Nieselregen",
      55: "Dichter Nieselregen",
      61: "Leichter Regen",
      63: "Mäßiger Regen",
      65: "Starker Regen",
      71: "Leichter Schnee",
      73: "Mäßiger Schnee",
      75: "Starker Schnee",
      95: "Gewitter",
      unknown: "Unbekannt"
    }
  };

  const translations = weatherTranslations[currentLang] || weatherTranslations.it;
  return translations[code] || translations.unknown;
}

/**
 * Get weather icon based on weather code
 * @param {number} code - Weather code from OpenMeteo API
 * @returns {string} Weather emoji icon
 */
function getWeatherIcon(code) {
  const weatherIcons = {
    0: "☀️",      // Clear
    1: "🌤️",      // Mostly clear
    2: "⛅",      // Partly cloudy
    3: "☁️",      // Overcast
    45: "🌫️",     // Fog
    48: "🌫️",     // Fog with rime
    51: "🌦️",     // Light drizzle
    53: "🌦️",     // Moderate drizzle
    55: "🌧️",     // Heavy drizzle
    61: "🌧️",     // Light rain
    63: "🌧️",     // Moderate rain
    65: "⛈️",     // Heavy rain
    71: "🌨️",     // Light snow
    73: "❄️",     // Moderate snow
    75: "❄️",     // Heavy snow
    95: "⛈️"      // Thunderstorm
  };
  return weatherIcons[code] || "🌡️";
}


/**
 * Show weather update indicator for 10 seconds
 * @param {number} weatherIndex - 1 for first weather, 2 for second weather
 */
function showWeatherUpdateIndicator(weatherIndex) {
  const indicator = document.getElementById(`weather-update-indicator-${weatherIndex}`);
  if (indicator) {
    indicator.classList.add('visible');

    // Hide after 10 seconds
    setTimeout(() => {
      indicator.classList.remove('visible');
    }, 10000);
  }
}

/**
 * Start automatic weather updates every 2 minutes
 */
function startWeatherAutoUpdate() {
  // Clear any existing interval
  if (weatherUpdateInterval) {
    clearInterval(weatherUpdateInterval);
  }

  // Set up interval for every hour (3600000 ms)
  weatherUpdateInterval = setInterval(async () => {
    console.log('🌦️ Auto-updating weather...');

    // Update both weather locations
    await loadWeatherFromConfig(1, true); // First location with indicator
    await loadWeatherFromConfig(2, true); // Second location with indicator
  }, 3600000); // 1 hour

  console.log('✅ Weather auto-update started (every 1 hour)');
}

/**
 * Stop automatic weather updates
 */
function stopWeatherAutoUpdate() {
  if (weatherUpdateInterval) {
    clearInterval(weatherUpdateInterval);
    weatherUpdateInterval = null;
    console.log('⏹️ Weather auto-update stopped');
  }
}

/**
 * Initialize weather with default cities if no config exists
 */
async function initializeWeatherDefaults() {
  try {
    console.log('🌦️ Initializing weather defaults...');
    
    // Check if first location has config
    const cfg1 = await load('weatherCfg');
    if (!cfg1 || !cfg1.city) {
      console.log('🌦️ Setting default city 1: Roma');
      await loadWeatherForCity('Roma', 1, false);
    }
    
    // Check if second location has config
    const cfg2 = await load('weatherCfg2');
    if (!cfg2 || !cfg2.city) {
      console.log('🌦️ Setting default city 2: Milano');
      await loadWeatherForCity('Milano', 2, false);
    }
  } catch (error) {
    console.error('Error initializing weather defaults:', error);
  }
}

// Compatibility functions for legacy code
/**
 * Load weather using saved configuration (compatibility function for first weather)
 * @deprecated Use loadWeatherFromConfig(1) instead
 */
async function loadWeatherCompat() {
  await loadWeatherFromConfig(1, false);
}

/**
 * Load weather 2 using saved configuration (compatibility function for second weather)
 * @deprecated Use loadWeatherFromConfig(2) instead
 */
async function loadWeather2Compat() {
  await loadWeatherFromConfig(2, false);
}

// Export functions for use by other modules
if (typeof window !== 'undefined') {
  window.getCoordinates = getCoordinates;
  window.loadWeather = loadWeather;
  window.loadWeatherForCity = loadWeatherForCity;
  window.loadWeatherFromConfig = loadWeatherFromConfig;
  window.initializeWeatherDefaults = initializeWeatherDefaults;
  window.getWeatherDescription = getWeatherDescription;
  window.getWeatherIcon = getWeatherIcon;
  window.showWeatherUpdateIndicator = showWeatherUpdateIndicator;
  window.startWeatherAutoUpdate = startWeatherAutoUpdate;
  window.stopWeatherAutoUpdate = stopWeatherAutoUpdate;
  
  // Event listeners for separation of concerns
  window.addEventListener('app:initialized', async function() {
    console.log('🌦️ Weather module received app initialization event');
    
    // Initialize weather with defaults if needed, then load from config
    await initializeWeatherDefaults();
    await loadWeatherFromConfig(1, false);
    await loadWeatherFromConfig(2, false);
    
    // Start auto-update after initialization
    setTimeout(() => {
      startWeatherAutoUpdate();
    }, 5000); // Wait 5 seconds after initialization
  });
}