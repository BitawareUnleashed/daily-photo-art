/**
 * Weather management module for Daily Photo Art extension
 * Handles weather data fetching, display, and location management
 */

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
 * Load and display weather for a specific city (first weather display)
 * @param {string} cityName - The name of the city to get weather for
 */
async function loadWeatherForCity(cityName) {
  try {
    // First get city coordinates
    const location = await getCoordinates(cityName);
    const texts = window.currentTexts || { cityNotFound: "Città non trovata", humidity: "Umidità", wind: "Vento" };
    
    if (!location) {
      const weatherEl = document.getElementById("weather");
      if (weatherEl) weatherEl.textContent = texts.cityNotFound + ".";
      return;
    }

    // Then get weather for those coordinates
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();
    
    const temp = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;
    const humidity = data.current.relative_humidity_2m;
    const windSpeed = Math.round(data.current.wind_speed_10m);
    
    // Translate weather code to description and get icon
    const weatherDescription = getWeatherDescription(weatherCode);
    const weatherIcon = getWeatherIcon(weatherCode);
    
    const weatherEl = document.getElementById("weather");
    if (weatherEl) {
      weatherEl.innerHTML = `
        <strong>${location.name}, ${location.country}</strong> • ${weatherIcon} ${temp}°C - ${weatherDescription} • ${texts.humidity}: ${humidity}% • ${texts.wind}: ${windSpeed} km/h
      `;
    }
    
    // Save location for next time
    await save("weatherCfg", { lat: location.lat, lon: location.lon, city: location.name });
    
  } catch (error) {
    console.error('Weather error:', error);
    const texts = window.currentTexts || { weatherNotAvailable: "Meteo non disponibile" };
    const weatherEl = document.getElementById("weather");
    if (weatherEl) weatherEl.textContent = texts.weatherNotAvailable + ".";
  }
}

/**
 * Load and display weather for a specific city (second weather display)
 * @param {string} cityName - The name of the city to get weather for
 */
async function loadWeatherForCity2(cityName) {
  try {
    // First get city coordinates
    const location = await getCoordinates(cityName);
    const texts = window.currentTexts || { cityNotFound: "Città non trovata", humidity: "Umidità", wind: "Vento" };
    
    if (!location) {
      const weatherEl = document.getElementById("weather-2");
      if (weatherEl) weatherEl.textContent = texts.cityNotFound + ".";
      return;
    }

    // Then get weather for those coordinates
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();
    
    const temp = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;
    const humidity = data.current.relative_humidity_2m;
    const windSpeed = Math.round(data.current.wind_speed_10m);
    
    // Translate weather code to description and get icon
    const weatherDescription = getWeatherDescription(weatherCode);
    const weatherIcon = getWeatherIcon(weatherCode);
    
    const weatherEl = document.getElementById("weather-2");
    if (weatherEl) {
      weatherEl.innerHTML = `
        <strong>${location.name}, ${location.country}</strong> • ${weatherIcon} ${temp}°C - ${weatherDescription} • ${texts.humidity}: ${humidity}% • ${texts.wind}: ${windSpeed} km/h
      `;
    }
    
    // Save location for next time
    await save("weatherCfg2", { lat: location.lat, lon: location.lon, city: location.name });
    
  } catch (error) {
    console.error('Weather error 2:', error);
    const texts = window.currentTexts || { weatherNotAvailable: "Meteo non disponibile" };
    const weatherEl = document.getElementById("weather-2");
    if (weatherEl) weatherEl.textContent = texts.weatherNotAvailable + ".";
  }
}

/**
 * Load weather using saved configuration (first weather display)
 */
async function loadWeather() {
  try {
    const cfg = await load("weatherCfg");
    const texts = window.currentTexts || { weatherNotAvailable: "Meteo non disponibile" };
    
    if (!cfg || !cfg.lat || !cfg.lon) {
      const weatherEl = document.getElementById("weather");
      if (weatherEl) weatherEl.textContent = texts.weatherNotAvailable + ".";
      return;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${cfg.lat}&longitude=${cfg.lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();
    
    const temp = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;
    const humidity = data.current.relative_humidity_2m;
    const windSpeed = Math.round(data.current.wind_speed_10m);
    
    const weatherDescription = getWeatherDescription(weatherCode);
    const weatherIcon = getWeatherIcon(weatherCode);
    
    const weatherEl = document.getElementById("weather");
    if (weatherEl) {
      weatherEl.innerHTML = `
        <strong>${cfg.city}</strong> • ${weatherIcon} ${temp}°C - ${weatherDescription} • ${texts.humidity}: ${humidity}% • ${texts.wind}: ${windSpeed} km/h
      `;
    }
    
  } catch (error) {
    console.error('Weather error:', error);
    const texts = window.currentTexts || { weatherNotAvailable: "Meteo non disponibile" };
    const weatherEl = document.getElementById("weather");
    if (weatherEl) weatherEl.textContent = texts.weatherNotAvailable + ".";
  }
}

/**
 * Load weather using saved configuration (second weather display)
 */
async function loadWeather2() {
  try {
    const cfg = await load("weatherCfg2");
    const texts = window.currentTexts || { weatherNotAvailable: "Meteo non disponibile" };
    
    if (!cfg || !cfg.lat || !cfg.lon) {
      const weatherEl = document.getElementById("weather-2");
      if (weatherEl) weatherEl.textContent = texts.weatherNotAvailable + ".";
      return;
    }

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${cfg.lat}&longitude=${cfg.lon}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&timezone=auto`;
    const response = await fetch(url);
    const data = await response.json();
    
    const temp = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;
    const humidity = data.current.relative_humidity_2m;
    const windSpeed = Math.round(data.current.wind_speed_10m);
    
    const weatherDescription = getWeatherDescription(weatherCode);
    const weatherIcon = getWeatherIcon(weatherCode);
    
    const weatherEl = document.getElementById("weather-2");
    if (weatherEl) {
      weatherEl.innerHTML = `
        <strong>${cfg.city}</strong> • ${weatherIcon} ${temp}°C - ${weatherDescription} • ${texts.humidity}: ${humidity}% • ${texts.wind}: ${windSpeed} km/h
      `;
    }
    
  } catch (error) {
    console.error('Weather error 2:', error);
    const texts = window.currentTexts || { weatherNotAvailable: "Meteo non disponibile" };
    const weatherEl = document.getElementById("weather-2");
    if (weatherEl) weatherEl.textContent = texts.weatherNotAvailable + ".";
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
    0: "☀️",      // Sereno
    1: "🌤️",      // Prevalentemente sereno
    2: "⛅",      // Parzialmente nuvoloso
    3: "☁️",      // Coperto
    45: "🌫️",     // Nebbia
    48: "🌫️",     // Nebbia con brina
    51: "🌦️",     // Pioggerella leggera
    53: "🌦️",     // Pioggerella moderata
    55: "🌧️",     // Pioggerella intensa
    61: "🌧️",     // Pioggia leggera
    63: "🌧️",     // Pioggia moderata
    65: "⛈️",     // Pioggia intensa
    71: "🌨️",     // Neve leggera
    73: "❄️",     // Neve moderata
    75: "❄️",     // Neve intensa
    95: "⛈️"      // Temporale
  };
  return weatherIcons[code] || "🌡️";
}

// Export functions for use by other modules
if (typeof window !== 'undefined') {
  window.getCoordinates = getCoordinates;
  window.loadWeatherForCity = loadWeatherForCity;
  window.loadWeatherForCity2 = loadWeatherForCity2;
  window.loadWeather = loadWeather;
  window.loadWeather2 = loadWeather2;
  window.getWeatherDescription = getWeatherDescription;
  window.getWeatherIcon = getWeatherIcon;
}
