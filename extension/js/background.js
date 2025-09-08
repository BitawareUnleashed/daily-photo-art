/**
 * Background management module for Daily Photo Art extension
 * Handles background image loading from multiple sources
 */

// Cache configuration
const BACKGROUND_CACHE_DURATION = 5 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Save background to cache with timestamp
 */
function saveBackgroundToCache(imgUrl, photoData, photoId, source) {
  const cacheData = {
    imgUrl: imgUrl,
    photoData: photoData,
    photoId: photoId,
    source: source,
    timestamp: Date.now()
  };
  localStorage.setItem('cachedBackground', JSON.stringify(cacheData));
  console.log('💾 Background saved to cache:', { photoId, source });
}

/**
 * Load background from cache if still valid
 */
function loadBackgroundFromCache() {
  try {
    const cached = localStorage.getItem('cachedBackground');
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;
    
    if (age < BACKGROUND_CACHE_DURATION) {
      console.log('📦 Background loaded from cache (age:', Math.round(age / 1000), 'seconds)');
      return cacheData;
    } else {
      console.log('⏰ Cached background expired (age:', Math.round(age / 1000), 'seconds)');
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
    const cachedBackground = loadBackgroundFromCache();
    if (cachedBackground) {
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
    saveBackgroundToCache(imgUrl, photoData, photoId, source);

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
