/**
 * Background management module for Daily Photo Art extension
 * Handles background image loading from multiple sources with quality checks
 */

// Cache configuration
const BACKGROUND_CACHE_DURATION = 5 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Check if cached image is of high quality - STRICT criteria
 */
function isCachedImageGoodQuality(cacheData) {
  if (!cacheData || !cacheData.imageBase64) {
    console.log('📊 No cached image data found');
    return false;
  }
  
  // Check image size (base64 encoded images should be reasonably large for good quality)
  const base64Length = cacheData.imageBase64.length;
  const estimatedSizeKB = (base64Length * 3/4) / 1024; // Rough estimate
  
  // STRICT SIZE REQUIREMENT - Higher threshold for quality
  if (estimatedSizeKB < 150) { // Raised from 50KB to 150KB for higher quality
    console.log('📊 Cached image too small for high quality (size:', estimatedSizeKB.toFixed(1), 'KB) - REJECTED');
    return false;
  }
  
  // STRICT AGE REQUIREMENT - Prefer very fresh images only
  const age = Date.now() - cacheData.timestamp;
  const ageMinutes = age / (60 * 1000);
  
  if (ageMinutes > 15) { // Reduced from 30 to 15 minutes for freshness
    console.log('📊 Cached image too old (', ageMinutes.toFixed(1), 'minutes) - REJECTED');
    return false;
  }
  
  console.log('✅ Cached image meets HIGH QUALITY standards (', estimatedSizeKB.toFixed(1), 'KB,', ageMinutes.toFixed(1), 'min old)');
  return true;
}

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
    
    // Get cache duration from settings with safety check
    let cacheDurationHours = (typeof getCacheDuration === 'function') ? 
      await getCacheDuration() : 24;
    
    // SAFETY: Prevent absurd cache durations (2 minutes = 0.033 hours minimum)
    if (!cacheDurationHours || cacheDurationHours < 0.03 || cacheDurationHours > 168) {
      console.warn('⚠️ CACHE: Invalid cache duration detected:', cacheDurationHours, '- using 24 hours default');
      cacheDurationHours = 24;
    }
    
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
  const photoId = `DBE_${photoNum.toString().padStart(3, '0')}`.toUpperCase();
  const baseUrl = `https://raw.githubusercontent.com/bitawareunleashed/photo-storage/main/${photoId}`;
  const jpgUrl = `${baseUrl}.JPG`;
  const jsonUrl = `${baseUrl}.json`;
  
  try {
    // Download the photo
    // Try to fetch with .JPG, if not found try .jpg
    let imgResp = await fetch(jpgUrl);
    if (!imgResp.ok) {
      // Try lowercase extension
      const altJpgUrl = `${baseUrl}.jpg`;
      imgResp = await fetch(altJpgUrl);
      if (!imgResp.ok) throw new Error('Image not found (.JPG or .jpg)');
    }
    const imgBlob = await imgResp.blob();
    const imgUrl = URL.createObjectURL(imgBlob);

    // EXIF
    const exifData = await setBackgroundAndReadExif(imgUrl);
    console.log("EXIF data:", exifData);


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
 * Apply background directly without fade effect (for first load)
 */
async function applyBackgroundDirect(bgElement, imgUrl) {
  return new Promise((resolve, reject) => {
    // Preload image to ensure it's ready
    const preloadImg = new Image();
    
    preloadImg.onload = () => {
      console.log('✅ First image loaded, applying directly (no fade)');
      
      // Apply directly without any transition
      bgElement.style.setProperty('background-image', `url("${imgUrl}")`, 'important');
      bgElement.style.setProperty('background-size', 'cover', 'important');
      bgElement.style.setProperty('background-position', 'center', 'important');
      bgElement.style.setProperty('background-repeat', 'no-repeat', 'important');
      bgElement.style.opacity = '1';
      
      console.log('✅ First background applied instantly');
      resolve();
    };
    
    preloadImg.onerror = () => {
      console.error('❌ Failed to load first image');
      reject(new Error('Failed to load image'));
    };
    
    // Start preloading
    console.log('🔄 Loading first image...');
    preloadImg.src = imgUrl;
  });
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
        console.log('🎬 Starting crossfade animation...');
        // Start crossfade: new image fades in, old image fades out
        overlay.style.opacity = '1';
        bgElement.style.transition = 'opacity 3000ms ease-in-out';
        bgElement.style.opacity = '0';
        console.log('🎬 Fade out started, waiting 3 seconds...');
        
        setTimeout(() => {
          console.log('🎬 Crossfade timeout reached, applying new background...');
          // Update the main background element with new image
          bgElement.style.setProperty('background-image', `url("${imgUrl}")`, 'important');
          bgElement.style.setProperty('background-size', 'cover', 'important');
          bgElement.style.setProperty('background-position', 'center', 'important');
          bgElement.style.setProperty('background-repeat', 'no-repeat', 'important');
          bgElement.style.opacity = '1';
          console.log('🎬 Background updated, opacity set to 1');
          
          // Remove the temporary overlay
          overlay.remove();
          console.log('🎬 Overlay removed');
          
          // IMPORTANT: Properly remove transition after fade is complete
          bgElement.style.removeProperty('transition');
          console.log('🎬 Transition property removed');
          console.log('🎬 Final bgElement styles:', {
            opacity: bgElement.style.opacity,
            transition: bgElement.style.transition,
            backgroundImage: bgElement.style.backgroundImage ? 'SET' : 'NOT SET'
          });
          
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
  const loadingIndicator = document.getElementById("bg-loading-indicator");
  
  try {
    const bgElement = document.getElementById("bg");
    const photoInfoElement = document.getElementById("photo-info");
    
    if (!bgElement) {
      console.error('Background element not found!');
      return;
    }

    // Show loading indicator
    if (loadingIndicator) {
      loadingIndicator.style.display = 'block';
    }

    // Check cache first, but ONLY use high-quality cached images
    const cachedBackground = await loadBackgroundFromCache();
    if (cachedBackground) {
      if (cachedBackground.cacheExpired && cachedBackground.loadNewImage) {
        console.log('⏰ Cache expired - loading new image automatically...');
        // Continue to load new image below (don't return here)
      } else if (cachedBackground.reloadFailed) {
        console.log('⚠️ Cache valid but reload failed - keeping current background');
        // Don't change the background, just wait for cache to expire naturally
        if (loadingIndicator) {
          loadingIndicator.style.display = 'none';
        }
        return;
      } else {
        console.log('📦 Found cached background - checking quality...');
        
        // Get cached data to check quality - STRICT quality check
        const cached = localStorage.getItem('cachedBackground');
        let isHighQuality = false;
        
        if (cached) {
          const cacheData = JSON.parse(cached);
          isHighQuality = isCachedImageGoodQuality(cacheData);
        }
        
        // ONLY use cache if it's genuinely high quality
        if (isHighQuality && cachedBackground.imgUrl) {
          console.log('✅ Applying HIGH QUALITY cached background');
          
          // Check if this is first load (background is empty)
          const currentBg = bgElement.style.backgroundImage;
          const isFirstLoad = !currentBg || currentBg === '' || currentBg === 'none';
          
          if (isFirstLoad) {
            // First load - apply directly without fade
            await applyBackgroundDirect(bgElement, cachedBackground.imgUrl);
          } else {
            // Subsequent load - use fade transition
            await applyBackgroundWithFade(bgElement, cachedBackground.imgUrl);
          }
          
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
          
          // Hide loading indicator since we applied good cached content
          if (loadingIndicator) {
            loadingIndicator.style.display = 'none';
          }
          return;
        } else {
          console.log('� Cached image NOT high quality enough - loading fresh image...');
          // Continue to load new fresh image below
        }
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

    // Check if this is first load (background is empty) before applying
    const currentBg = bgElement.style.backgroundImage;
    const isFirstLoad = !currentBg || currentBg === '' || currentBg === 'none';
    
    if (isFirstLoad) {
      // First load - apply directly without fade
      console.log('🚀 First background load - applying instantly without fade');
      await applyBackgroundDirect(bgElement, imgUrl);
    } else {
      // Subsequent load - use fade transition
      console.log('🔄 Subsequent background load - applying with fade transition');
      await applyBackgroundWithFade(bgElement, imgUrl);
    }

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
    
    // Hide loading indicator
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
    
  } catch (error) {
    console.error('Error loading background:', error);
    
    // Hide loading indicator even on error
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
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
    
    // Get cache duration from settings with safety check
    let cacheDurationHours = (typeof getCacheDuration === 'function') ? 
      await getCacheDuration() : 24;
    
    // SAFETY: Prevent absurd cache durations that cause infinite loops (2 minutes = 0.033 hours minimum)
    if (!cacheDurationHours || cacheDurationHours < 0.03 || cacheDurationHours > 168) {
      console.warn('⚠️ TIMER: Invalid cache duration detected:', cacheDurationHours, '- using 24 hours default');
      cacheDurationHours = 24;
    }
    
    const cacheDuration = cacheDurationHours * 60 * 60 * 1000;
    
    const timeUntilExpiration = cacheDuration - age;
    
    console.log('🔍 [TIMER DEBUG]:', {
      cacheDurationHours,
      cacheDurationMs: cacheDuration,
      ageMs: age,
      timeUntilExpirationMs: timeUntilExpiration,
      timeUntilExpirationSeconds: Math.round(timeUntilExpiration / 1000)
    });
    
    // SAFETY: Don't set timer for absurd durations
    if (timeUntilExpiration > 7 * 24 * 60 * 60 * 1000) { // Max 7 days
      console.warn('⚠️ Timer duration too long - not setting timer');
      return;
    }
    
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
      
      // After loading new image, set up next timer (with safety checks)
      console.log('� Timer expired - setting up next timer with safety checks');
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
