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
      console.log('⏰ Cache expired, removing...');
      localStorage.removeItem('cachedBackground');
      return null;
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
      if (cachedBackground.reloadFailed) {
        console.log('⚠️ Cache valid but reload failed - keeping current background');
        // Don't change the background, just wait for cache to expire naturally
        return;
      }
      
      console.log('📦 Using cached background');
      bgElement.style.setProperty('background-image', `url("${cachedBackground.imgUrl}")`, 'important');
      bgElement.style.setProperty('background-size', 'cover', 'important');
      bgElement.style.setProperty('background-position', 'center', 'important');
      bgElement.style.setProperty('background-repeat', 'no-repeat', 'important');
      
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

    // Apply background
    bgElement.style.setProperty('background-image', `url("${imgUrl}")`, 'important');
    bgElement.style.setProperty('background-size', 'cover', 'important');
    bgElement.style.setProperty('background-position', 'center', 'important');
    bgElement.style.setProperty('background-repeat', 'no-repeat', 'important');

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

// Export functions for use by other modules
if (typeof window !== 'undefined') {
  window.downloadCodicepuntoPhoto = downloadCodicepuntoPhoto;
  window.setBackground = setBackground;
  window.updatePhotoInfo = updatePhotoInfo;
}
