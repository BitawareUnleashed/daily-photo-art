/**
 * Background management module for Daily Photo Art extension
 * Handles background image loading from multiple sources
 */

// Cache configuration
const BACKGROUND_CACHE_DURATION = 5 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Save background to cache with timestamp and image data
 */
async function saveBackgroundToCache(imgUrl, photoData, photoId, source) {
  try {
    console.log('💾 Saving background to cache with image data...');
    
    // Convert any image URL to base64 for storage
    let imageBase64 = null;
    if (imgUrl) {
      try {
        console.log('🔄 Converting image to base64 for caching:', imgUrl);
        const response = await fetch(imgUrl);
        if (response.ok) {
          const blob = await response.blob();
          
          // Convert blob to base64
          const reader = new FileReader();
          imageBase64 = await new Promise((resolve) => {
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          
          console.log('✅ Image converted to base64 for caching');
        } else {
          console.warn('⚠️ Failed to fetch image for caching:', response.status, response.statusText);
        }
      } catch (error) {
        console.warn('⚠️ Failed to convert image to base64, will cache metadata only:', error);
      }
    }
    
    const cacheData = {
      photoData: photoData,
      photoId: photoId,
      source: source,
      timestamp: Date.now(),
      imageBase64: imageBase64 // Store the actual image data
    };
    
    localStorage.setItem('cachedBackground', JSON.stringify(cacheData));
    console.log('💾 Background saved to cache:', { 
      photoId, 
      source, 
      hasImageData: !!imageBase64,
      size: imageBase64 ? `${Math.round(imageBase64.length / 1024)}KB` : 'No image data'
    });
  } catch (error) {
    console.error('❌ Error saving background to cache:', error);
  }
}

/**
 * Load background from cache if still valid
 */
async function loadBackgroundFromCache() {
  try {
    console.log('🔍 Checking localStorage for cached background...');
    const cached = localStorage.getItem('cachedBackground');
    if (!cached) {
      console.log('📦 No cached background found');
      return null;
    }
    
    console.log('📦 Found cached background, parsing...');
    const cacheData = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;
    
    // Get cache duration from settings
    const cacheDurationHours = (typeof getCacheDuration === 'function') ? 
      await getCacheDuration() : 24;
    const cacheDuration = cacheDurationHours * 60 * 60 * 1000;
    
    console.log(`📦 Cache age: ${Math.round(age / 1000)} seconds`);
    console.log(`📦 Cache duration: ${Math.round(cacheDuration / 1000)} seconds`);
    console.log(`📦 Cache valid: ${age < cacheDuration}`);
    
    if (age < cacheDuration) {
      console.log('✅ Cache is valid');
      console.log('📦 Cached source:', cacheData.source);
      console.log('📦 Cached photoId:', cacheData.photoId);
      console.log('📦 Has cached image data:', !!cacheData.imageBase64);
      
      // If we have cached image data, use it directly (no network call!)
      if (cacheData.imageBase64) {
        console.log('� Using cached image data (offline mode)');
        try {
          // Convert base64 back to blob URL
          const response = await fetch(cacheData.imageBase64);
          const blob = await response.blob();
          const imgUrl = URL.createObjectURL(blob);
          
          console.log('✅ Cached image loaded from storage');
          return { 
            imgUrl: imgUrl, 
            photoData: cacheData.photoData, 
            photoId: cacheData.photoId,
            source: cacheData.source,
            fromCache: true
          };
        } catch (error) {
          console.warn('⚠️ Failed to load cached image data:', error);
          // Fall back to network reload below
        }
      }
      
      // Fallback: reload the image from the original source (network call)
      console.log('🔄 No cached image data, reloading from network...');
      
      let reloadUrl = null;
      if ((cacheData.source === 'codicepunto.it' || cacheData.source === 'codicepunto') && cacheData.photoId) {
        reloadUrl = `https://raw.githubusercontent.com/bitawareunleashed/photo-storage/main/${cacheData.photoId}.JPG`;
      } else if (cacheData.source === 'picsum' && cacheData.photoId) {
        reloadUrl = `https://picsum.photos/1536/864?random=${cacheData.photoId}`;
      } else if (cacheData.source === 'unsplash' && cacheData.photoId) {
        reloadUrl = `https://source.unsplash.com/1536x864/?${cacheData.photoId}`;
      }
      
      if (reloadUrl) {
        try {
          console.log(`🔄 Reloading cached image from ${cacheData.source}: ${reloadUrl}`);
          const response = await fetch(reloadUrl);
          if (response.ok) {
            const blob = await response.blob();
            const imgUrl = URL.createObjectURL(blob);
            console.log('✅ Cached image reloaded successfully from network');
            return { 
              imgUrl: imgUrl, 
              photoData: cacheData.photoData, 
              photoId: cacheData.photoId,
              source: cacheData.source,
              fromCache: false
            };
          } else {
            console.error(`❌ Failed to reload cached image: ${response.status} ${response.statusText}`);
          }
        } catch (error) {
          console.error('❌ Network error reloading cached image:', error);
        }
      } else {
        console.warn('⚠️ Unknown source for cache reload:', cacheData.source);
      }
      
      console.log('⚠️ Cache is valid but image reload failed - keeping cache for next time');
      // Return a special object indicating cache is valid but reload failed
      return { 
        cacheValid: true, 
        reloadFailed: true,
        photoData: cacheData.photoData,
        photoId: cacheData.photoId,
        source: cacheData.source
      };
    } else {
      console.log('⏰ Cache expired, loading new image automatically...');
      localStorage.removeItem('cachedBackground');
      
      // Return special object indicating cache expired and new image should be loaded
      return { 
        cacheExpired: true,
        loadNewImage: true
      };
    }
  } catch (error) {
    console.error('❌ Error loading background from cache:', error);
    localStorage.removeItem('cachedBackground');
    return null;
  }
}

/**
 * Download a photo and related JSON from codicepunto.it/photos/DB
 * @returns {Object|false} Object with imgUrl, photoData, photoId or false if failed
 */
async function downloadCodicepuntoPhoto() {
  // Choose a random ID (you can change range if necessary)
  const photoNum = Math.floor(Math.random() * 21) + 1;
  const photoId = `DBE_${photoNum.toString().padStart(3, '0')}`;
  const baseUrl = `https://raw.githubusercontent.com/bitawareunleashed/photo-storage/main/${photoId}`;
  const jpgUrl = `${baseUrl}.JPG`;
  const jsonUrl = `${baseUrl}.json`;
  
  try {
    // Download the photo
    const imgResp = await fetch(jpgUrl);
    if (!imgResp.ok) throw new Error('Immagine non trovata');
    const imgBlob = await imgResp.blob();
    const imgUrl = URL.createObjectURL(imgBlob);

    // Download the JSON
    const jsonResp = await fetch(jsonUrl);
    if (!jsonResp.ok) throw new Error('JSON non trovato');
    const photoData = await jsonResp.json();

    return { imgUrl, photoData, photoId };
  } catch (e) {
    console.warn('Errore download foto/JSON codicepunto:', e);
    return false;
  }
}

/**
 * Preload image and apply background with crossfade effect
 */
async function applyBackgroundWithFade(bgElement, imgUrl) {
  return new Promise((resolve, reject) => {
    // First, preload the new image to ensure it's ready
    const preloadImg = new Image();
    
    preloadImg.onload = () => {
      console.log('✅ New image preloaded, starting crossfade');
      
      // Create a temporary overlay element for the new image
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.zIndex = '-1';
      overlay.style.backgroundImage = `url("${imgUrl}")`;
      overlay.style.backgroundSize = 'cover';
      overlay.style.backgroundPosition = 'center';
      overlay.style.backgroundRepeat = 'no-repeat';
      overlay.style.opacity = '0';
      overlay.style.transition = 'opacity 3000ms ease-in-out';
      
      // Insert the overlay right after the current background
      bgElement.parentNode.insertBefore(overlay, bgElement.nextSibling);
      
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        // Start crossfade: new image fades in, old image fades out
        overlay.style.opacity = '1';
        bgElement.style.transition = 'opacity 3000ms ease-in-out';
        bgElement.style.opacity = '0';
        
        setTimeout(() => {
          // Update the main background element with new image
          bgElement.style.transition = '';
          bgElement.style.setProperty('background-image', `url("${imgUrl}")`, 'important');
          bgElement.style.setProperty('background-size', 'cover', 'important');
          bgElement.style.setProperty('background-position', 'center', 'important');
          bgElement.style.setProperty('background-repeat', 'no-repeat', 'important');
          bgElement.style.opacity = '1';
          
          // Remove the temporary overlay
          overlay.remove();
          
          console.log('✅ Crossfade completed');
          resolve();
        }, 3000);
      }, 50);
    };
    
    preloadImg.onerror = () => {
      console.error('❌ Failed to preload image for crossfade');
      // Fallback to direct application without fade
      bgElement.style.setProperty('background-image', `url("${imgUrl}")`, 'important');
      bgElement.style.setProperty('background-size', 'cover', 'important');
      bgElement.style.setProperty('background-position', 'center', 'important');
      bgElement.style.setProperty('background-repeat', 'no-repeat', 'important');
      resolve();
    };
    
    // Start preloading
    console.log('🔄 Preloading new image for crossfade...');
    preloadImg.src = imgUrl;
  });
}

/**
 * Set background image using codicepunto.it or Picsum as fallback
 */
async function setBackground() {
  try {
    const bgElement = document.getElementById("bg");
    const photoInfoElement = document.getElementById("photo-info");
    if (!bgElement) {
      console.error('Background element not found!');
      return;
    }

    // Check cache first
    const cachedBackground = await loadBackgroundFromCache();
    if (cachedBackground) {
      if (cachedBackground.cacheExpired && cachedBackground.loadNewImage) {
        console.log('⏰ Cache expired - loading new image automatically...');
        // Continue to load new image below (don't return here)
      } else if (cachedBackground.reloadFailed) {
        console.log('⚠️ Cache valid but reload failed - keeping current background');
        // Don't change the background, just wait for cache to expire naturally
        return;
      } else {
        console.log('📦 Using cached background');
        await applyBackgroundWithFade(bgElement, cachedBackground.imgUrl);
        
        if (photoInfoElement && cachedBackground.photoData) {
          const photoTextElement = document.getElementById("photo-text");
          if (photoTextElement) {
            localStorage.setItem('currentPhotoData', JSON.stringify(cachedBackground.photoData));
            if (window.updatePhotoInfo) {
              window.updatePhotoInfo();
            }
            photoInfoElement.style.display = 'block';
          }
        } else if (photoInfoElement) {
          photoInfoElement.style.display = 'none';
        }
        return;
      }
    }

    console.log('🔄 Loading new background...');
    
    // Try codicepunto first, then fallback to Picsum
    let imgUrl, photoData, photoId, source;
    
    // Try codicepunto
    const result = await downloadCodicepuntoPhoto();
    if (result) {
      imgUrl = result.imgUrl;
      photoData = result.photoData;
      photoId = result.photoId;
      source = 'codicepunto';
    } else {
      // Fallback to Picsum if codicepunto fails
      photoId = Math.floor(Math.random() * 1000) + 1;
      imgUrl = `https://picsum.photos/1536/864?random=${photoId}`;
      source = 'picsum';
      try {
        const infoResponse = await fetch(`https://picsum.photos/id/${photoId}/info`);
        photoData = await infoResponse.json();
      } catch (error) {
        console.warn('Failed to get Picsum photo info:', error);
      }
    }

    // Apply background with fade effect
    await applyBackgroundWithFade(bgElement, imgUrl);

    // Save to cache
    await saveBackgroundToCache(imgUrl, photoData, photoId, source);

    // Show photo info
    if (photoData && photoInfoElement) {
      const photoTextElement = document.getElementById("photo-text");
      if (photoTextElement) {
        localStorage.setItem('currentPhotoData', JSON.stringify(photoData));
        const languageSelect = document.getElementById('quote-language');
        const currentLang = languageSelect ? languageSelect.value : (localStorage.getItem('quoteLang') || 'it');
        const texts = window.currentTexts || { photoBy: "Foto di" };
        
        if (source === 'codicepunto') {
          photoTextElement.textContent = `${texts.photoBy} ${photoData.Name || photoData.ID || photoId} • Codicepunto.it`;
        } else {
          photoTextElement.textContent = `${texts.photoBy} ${photoData.author} • Picsum Photos ID: ${photoData.id}`;
        }
        photoInfoElement.style.display = 'block';
      }
    } else if (photoInfoElement) {
      photoInfoElement.style.display = 'none';
    }
  } catch (error) {
    console.error('Error loading background:', error);
  }
}

/**
 * Update photo info text when language changes
 */
function updatePhotoInfo() {
  const photoTextElement = document.getElementById("photo-text");
  const photoData = localStorage.getItem('currentPhotoData');
  
  if (photoData && photoTextElement) {
    const parsedData = JSON.parse(photoData);
    // Get current language from the dropdown or localStorage
    const languageSelect = document.getElementById('quote-language');
    const currentLang = languageSelect ? languageSelect.value : (localStorage.getItem('quoteLang') || 'it');
    const texts = window.currentTexts || { photoBy: "Foto di" };
    
    photoTextElement.textContent = `${texts.photoBy} ${parsedData.author} • Picsum Photos ID: ${parsedData.id}`;
  }
}

// Global timer ID for cache expiration
let cacheExpirationTimer = null;

/**
 * Start automatic cache expiration checking with precise timing
 */
async function startCacheExpirationChecker() {
  try {
    // Clear any existing timer
    if (cacheExpirationTimer) {
      clearTimeout(cacheExpirationTimer);
      cacheExpirationTimer = null;
      console.log('🔄 Cleared previous cache timer');
    }
    
    const cached = localStorage.getItem('cachedBackground');
    if (!cached) {
      console.log('🕒 No cache found, automatic checker not needed');
      return;
    }
    
    const cacheData = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;
    
    // Get cache duration from settings
    const cacheDurationHours = (typeof getCacheDuration === 'function') ? 
      await getCacheDuration() : 24;
    const cacheDuration = cacheDurationHours * 60 * 60 * 1000;
    
    const timeUntilExpiration = cacheDuration - age;
    
    if (timeUntilExpiration <= 0) {
      console.log('⏰ Cache already expired - loading new image immediately');
      await setBackground();
      return;
    }
    
    console.log(`🕒 Setting precise timer for cache expiration in ${Math.round(timeUntilExpiration / 1000)} seconds (${Math.round(timeUntilExpiration / 60000)} minutes)`);
    
    // Set timer for exact expiration time
    cacheExpirationTimer = setTimeout(async () => {
      console.log('⏰ Cache expired by timer - loading new image automatically');
      cacheExpirationTimer = null;
      await setBackground();
      
      // After loading new image, set up next timer
      startCacheExpirationChecker();
    }, timeUntilExpiration);
    
  } catch (error) {
    console.error('❌ Error setting up cache expiration timer:', error);
  }
}

// Export functions for use by other modules
if (typeof window !== 'undefined') {
  window.downloadCodicepuntoPhoto = downloadCodicepuntoPhoto;
  window.setBackground = setBackground;
  window.updatePhotoInfo = updatePhotoInfo;
  window.startCacheExpirationChecker = startCacheExpirationChecker;
}
