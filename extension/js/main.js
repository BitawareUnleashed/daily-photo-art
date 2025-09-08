/**
 * Main orchestration module for Daily Photo Art extension
 * Handles initialization, event listeners, and global state management
 */

// Track clean view state
let isCleanView = false;

/**
 * Initialize the application when DOM is loaded
 */
async function initializeApp() {
  console.log('DOM loaded');
  
  // Set up all event listeners
  setupWelcomeEventListeners();
  setupCleanViewEventListeners();
  setupTestCrossfadeEventListeners();
  setupSettingsEventListeners();
  setupTodoEventListeners();
  setupWeatherEventListeners();
  setupQuoteEventListeners();
  setupKeyboardEventListeners();
  
  // Initialize core components
  await setBackground();
  
  // Start automatic cache expiration checking
  if (window.startCacheExpirationChecker) {
    window.startCacheExpirationChecker();
  }
  
  tickClock();
  setInterval(tickClock, 1000);
  
  // Wait for all modules to load before calling greeting
  setTimeout(() => {
    if (window.ClockUtils && window.ClockUtils.greeting) {
      window.ClockUtils.greeting();
    }
  }, 150); // Slightly longer delay to ensure all modules are ready
}

/**
 * Set up welcome screen event listeners
 */
function setupWelcomeEventListeners() {
  const welcomeNameInput = document.getElementById('welcome-name-input');
  const welcomeSaveBtn = document.getElementById('welcome-save-btn');
  
  if (welcomeSaveBtn) {
    welcomeSaveBtn.addEventListener('click', saveWelcomeName);
  }
  
  if (welcomeNameInput) {
    welcomeNameInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        saveWelcomeName();
      }
    });
    
    // Enable/disable save button based on input
    welcomeNameInput.addEventListener('input', function() {
      const hasName = this.value.trim().length > 0;
      if (welcomeSaveBtn) {
        welcomeSaveBtn.disabled = !hasName;
      }
    });
  }
}

/**
 * Set up clean view toggle functionality
 */
function setupCleanViewEventListeners() {
  const clearBtn = document.getElementById('clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      if (isCleanView) {
        // Return to normal view
        document.body.classList.remove('clean-view');
        clearBtn.classList.remove('clean-mode');
        clearBtn.textContent = '🧹';
        isCleanView = false;
        updateCleanButton(isCleanView);
      } else {
        // Go to clean view
        document.body.classList.add('clean-view');
        clearBtn.classList.add('clean-mode');
        clearBtn.textContent = '👁️';
        isCleanView = true;
        updateCleanButton(isCleanView);
      }
    });
  }
}

/**
 * Set up test crossfade button functionality
 */
function setupTestCrossfadeEventListeners() {
  const testCrossfadeBtn = document.getElementById('test-crossfade-btn');
  if (testCrossfadeBtn) {
    testCrossfadeBtn.addEventListener('click', async function() {
      console.log('🎨 Test crossfade button clicked');
      
      // Disable button temporarily to prevent spam
      testCrossfadeBtn.disabled = true;
      testCrossfadeBtn.style.opacity = '0.5';
      
      try {
        // Force load a new background (bypass cache)
        console.log('🔄 Loading new background for test...');
        
        // Temporarily clear cache to force new image
        localStorage.removeItem('cachedBackground');
        
        // Load new background
        await setBackground();
        
        console.log('✅ Test crossfade completed');
      } catch (error) {
        console.error('❌ Error during test crossfade:', error);
      } finally {
        // Re-enable button after delay
        setTimeout(() => {
          testCrossfadeBtn.disabled = false;
          testCrossfadeBtn.style.opacity = '1';
        }, 1000);
      }
    });
  }
}

/**
 * Set up settings popover event listeners
 */
function setupSettingsEventListeners() {
  const settingsBtn = document.getElementById('settings-btn');
  const settingsPopover = document.getElementById('settings-popover');
  const closePopover = document.getElementById('close-popover');
  const popoverOverlay = document.querySelector('.popover-overlay');
  const saveSettings = document.getElementById('save-settings');
  const nameInput = document.getElementById('name-input');
  const cityInput = document.getElementById('city-input');

  if (settingsBtn && settingsPopover) {
    // Open popover
    settingsBtn.addEventListener('click', async function() {
      // Load saved values
      const savedName = await load('name');
      const savedCity = await load('weatherCfg');
      const savedCacheDuration = await load('cacheDuration'); // Load from storage
      
      if (savedName && nameInput) nameInput.value = savedName;
      if (savedCity && savedCity.city && cityInput) cityInput.value = savedCity.city;
      
      // Set the correct cache duration radio button
      const cacheDurationRadios = document.querySelectorAll('input[name="cache-duration"]');
      let radioSelected = false;
      
      // Try to select the saved value first
      if (savedCacheDuration !== null && savedCacheDuration !== undefined) {
        cacheDurationRadios.forEach(radio => {
          if (radio.value === String(savedCacheDuration)) {
            radio.checked = true;
            radioSelected = true;
          } else {
            radio.checked = false;
          }
        });
      }
      
      // If no radio was selected (no saved value or saved value not found), select the first one
      if (!radioSelected && cacheDurationRadios.length > 0) {
        cacheDurationRadios[0].checked = true;
        console.log(`No saved cache duration found, defaulting to first option: ${cacheDurationRadios[0].value}`);
      }
      
      settingsPopover.style.display = 'flex';
    });

    // Close popover function
    const closePopoverFn = () => {
      settingsPopover.style.display = 'none';
    };

    if (closePopover) closePopover.addEventListener('click', closePopoverFn);
    if (popoverOverlay) popoverOverlay.addEventListener('click', closePopoverFn);

    // Save settings
    if (saveSettings) {
      saveSettings.addEventListener('click', async function() {
        const name = nameInput ? nameInput.value.trim() : '';
        const city = cityInput ? cityInput.value.trim() : '';
        
        // Get selected cache duration
        const selectedCacheDuration = document.querySelector('input[name="cache-duration"]:checked');
        const cacheDuration = selectedCacheDuration ? parseFloat(selectedCacheDuration.value) : 24;

        if (name) {
          await save('name', name);
          displayGreeting(name);
        } else {
          // If name is empty, remove it from storage
          if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.sync.remove('name');
          } else {
            localStorage.removeItem('name');
          }
          // Display default greeting
          displayGreeting("Amico");
        }

        if (city) {
          loadWeatherForCity(city);
        }
        
        // Save cache duration
        await save('cacheDuration', cacheDuration);
        console.log(`Cache duration set to: ${cacheDuration} hours`);
        
        // Restart cache expiration timer with new duration
        if (window.startCacheExpirationChecker) {
          console.log('🔄 Restarting cache timer with new duration');
          window.startCacheExpirationChecker();
        }

        closePopoverFn();
      });
    }
  }
}

/**
 * Set up TODO-related event listeners
 */
function setupTodoEventListeners() {
  // Main add todo button
  const addTodoMainBtn = document.getElementById('main-add-todo-btn');
  if (addTodoMainBtn) {
    addTodoMainBtn.addEventListener('click', function() {
      const todoSection = document.querySelector('.todo');
      const todoForm = document.getElementById('todo-form');
      const todoInput = document.getElementById('todo-input');
      
      // Show todo section and form
      todoSection.style.display = 'block';
      todoForm.style.display = 'block';
      
      // Focus on input
      if (todoInput) todoInput.focus();
    });
  }

  // Hide todo form button
  const hideBtn = document.getElementById('hide-todo-form');
  if (hideBtn) {
    hideBtn.addEventListener('click', function() {
      // Reset editing mode if active
      const editIndexField = document.getElementById('edit-todo-index');
      const addBtn = document.getElementById('add-todo-btn');
      const todoInput = document.getElementById('todo-input');
      
      if (editIndexField && parseInt(editIndexField.value) >= 0) {
        todoInput.value = "";
        todoInput.placeholder = "Aggiungi attività";
        editIndexField.value = "-1";
        addBtn.textContent = "✔";
        addBtn.title = "Aggiungi alla lista";
        
        // Reset color and category
        document.getElementById('color-white').checked = true;
        document.getElementById('category-lavoro').checked = true;
      }
      
      // Hide everything todo-related
      const todoSection = document.querySelector('.todo');
      const todoForm = document.getElementById('todo-form');
      
      todoSection.style.display = 'none';
      todoForm.style.display = 'none';
      
      // Update notification button visibility
      updateTodoNotificationVisibility();
    });
  }

  // Todo notification button
  const todoNotificationBtn = document.getElementById('todo-notification-btn');
  if (todoNotificationBtn) {
    todoNotificationBtn.addEventListener('click', function() {
      const todoSection = document.querySelector('.todo');
      const todoList = document.getElementById('todo-list');
      
      // Check if todo section is currently visible
      const isVisible = todoSection.style.display === 'block';
      
      if (isVisible) {
        // Hide todo section
        todoSection.style.display = 'none';
        
        // Update button appearance
        this.textContent = '📝';
        this.title = 'Mostra todo';
        this.classList.add('blinking');
      } else {
        // Show todo section and list
        todoSection.style.display = 'block';
        todoList.style.display = 'block';
        
        // Update button appearance
        this.textContent = '✕';
        this.title = 'Nascondi todo';
        this.classList.remove('blinking');
      }
      
      // Always show the button (don't hide it)
      this.style.display = 'inline-flex';
    });
  }

  // Todo close button
  const todoCloseBtn = document.getElementById('todo-close-btn');
  if (todoCloseBtn) {
    todoCloseBtn.addEventListener('click', function() {
      const todoSection = document.querySelector('.todo');
      todoSection.style.display = 'none';
      updateTodoNotificationVisibility();
    });
  }

  // Color radio button event listeners
  const colorRadios = document.querySelectorAll('input[name="todo-color"]');
  colorRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      const todoInput = document.getElementById('todo-input');
      if (todoInput) todoInput.focus();
    });
  });
}

/**
 * Set up weather-related event listeners
 */
function setupWeatherEventListeners() {
  // Change city buttons
  const changeCityBtn = document.getElementById('change-city-btn');
  const changeCityBtn2 = document.getElementById('change-city-btn-2');
  
  if (changeCityBtn) {
    changeCityBtn.addEventListener('click', async function() {
      const cfg = await load("weatherCfg");
      const currentCity = cfg?.city || '';
      document.getElementById('city-input-1').value = currentCity;
      
      document.getElementById('city-popover-1').style.display = 'flex';
      document.getElementById('city-input-1').focus();
      document.getElementById('city-input-1').select();
    });
  }

  if (changeCityBtn2) {
    changeCityBtn2.addEventListener('click', async function() {
      const cfg = await load("weatherCfg2");
      const currentCity = cfg?.city || '';
      document.getElementById('city-input-2').value = currentCity;
      
      document.getElementById('city-popover-2').style.display = 'flex';
      document.getElementById('city-input-2').focus();
      document.getElementById('city-input-2').select();
    });
  }

  // City popover handlers
  const cityPopover1 = document.getElementById('city-popover-1');
  const cityPopover2 = document.getElementById('city-popover-2');
  const closeCityBtns = document.querySelectorAll('.close-city-popover');
  
  // Close city popover handlers
  closeCityBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      if (cityPopover1) cityPopover1.style.display = 'none';
      if (cityPopover2) cityPopover2.style.display = 'none';
    });
  });

  // Close on overlay click
  [cityPopover1, cityPopover2].forEach(popover => {
    if (popover) {
      const overlay = popover.querySelector('.popover-overlay');
      if (overlay) {
        overlay.addEventListener('click', function() {
          popover.style.display = 'none';
        });
      }
    }
  });

  // Save city buttons
  const saveCity1Btn = document.getElementById('save-city-1');
  const saveCity2Btn = document.getElementById('save-city-2');
  
  if (saveCity1Btn) {
    saveCity1Btn.addEventListener('click', async function() {
      const city = document.getElementById('city-input-1').value.trim();
      if (city) {
        loadWeatherForCity(city);
        cityPopover1.style.display = 'none';
        document.getElementById('city-input-1').value = '';
      }
    });
  }

  if (saveCity2Btn) {
    saveCity2Btn.addEventListener('click', async function() {
      const city = document.getElementById('city-input-2').value.trim();
      if (city) {
        loadWeatherForCity2(city);
        cityPopover2.style.display = 'none';
        document.getElementById('city-input-2').value = '';
      }
    });
  }

  // Handle Enter key in city inputs
  const cityInput1 = document.getElementById('city-input-1');
  const cityInput2 = document.getElementById('city-input-2');
  
  if (cityInput1) {
    cityInput1.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const saveBtn = document.getElementById('save-city-1');
        if (saveBtn) saveBtn.click();
      }
    });
  }

  if (cityInput2) {
    cityInput2.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        const saveBtn = document.getElementById('save-city-2');
        if (saveBtn) saveBtn.click();
      }
    });
  }
}

/**
 * Set up quote-related event listeners
 */
function setupQuoteEventListeners() {
  // Wait a bit to ensure all modules are loaded
  setTimeout(() => {
    // Language selector
    const languageSelect = document.getElementById('quote-language');
    if (languageSelect) {
      // Load saved language BEFORE loading quote
      load('quoteLang').then(savedLang => {
        const currentLang = savedLang || 'it';
        languageSelect.value = currentLang;
        
        // Translate interface in saved language
        if (window.TranslationUtils) {
          window.TranslationUtils.translateInterface(currentLang);
        }
        
        // Load quote AFTER restoring language
        if (window.QuoteUtils) {
          window.QuoteUtils.loadQuote();
        }
      });
      
      languageSelect.addEventListener('change', async function() {
        await save('quoteLang', this.value);
        
        // Reset original quote button state
        const originalQuoteBtn = document.getElementById('original-quote-btn');
        if (originalQuoteBtn && originalQuoteBtn.showingOriginal !== undefined) {
          originalQuoteBtn.showingOriginal = false;
          originalQuoteBtn.translatedText = null;
          originalQuoteBtn.originalText = null;
          originalQuoteBtn.textContent = '🌐';
          originalQuoteBtn.style.background = 'transparent';
        }
        
        // Translate interface in new language
        if (window.TranslationUtils) {
          window.TranslationUtils.translateInterface(this.value);
        }
        
        // Update greeting with new language
        load("name").then(name => {
          if (name) {
            displayGreeting(name);
          }
        });
        
        // Reload weather with new translations
        if (window.loadWeather) window.loadWeather();
        if (window.loadWeather2) window.loadWeather2();
        
        // Update photo info with new language
        if (window.updatePhotoInfo) window.updatePhotoInfo();
        
        // Load quote with new language
        if (window.QuoteUtils) {
          window.QuoteUtils.loadQuote();
        }
      });
    } else {
      // If there's no dropdown, use Italian as default
      if (window.TranslationUtils) {
        window.TranslationUtils.translateInterface('it');
      }
    }

    // Original quote button (hold to show original)
    setupOriginalQuoteButton();
  }, 100); // Small delay to ensure modules are loaded
}

/**
 * Set up the original quote button with hold-to-show functionality
 */
function setupOriginalQuoteButton() {
  const originalQuoteBtn = document.getElementById('original-quote-btn');
  if (!originalQuoteBtn) return;
  
  originalQuoteBtn.showingOriginal = false;
  originalQuoteBtn.originalText = null;
  originalQuoteBtn.translatedText = null;
  
  function showOriginalQuote() {
    const currentQuote = window.QuoteUtils ? window.QuoteUtils.getCurrentQuote() : null;
    if (!currentQuote || originalQuoteBtn.showingOriginal || !originalQuoteBtn.originalText) return;
    
    const quoteEl = document.getElementById('quote');
    
    // Show original version
    quoteEl.textContent = originalQuoteBtn.originalText;
    originalQuoteBtn.textContent = '👁️';
    originalQuoteBtn.title = window.TranslationManager ? window.TranslationManager.getTranslation('releaseToReturnTranslation') : 'Rilascia per tornare alla traduzione';
    originalQuoteBtn.showingOriginal = true;
    originalQuoteBtn.style.background = 'rgba(255, 255, 255, 0.2)';
  }
  
  function showTranslatedQuote() {
    const currentQuote = window.QuoteUtils ? window.QuoteUtils.getCurrentQuote() : null;
    if (!currentQuote || !originalQuoteBtn.showingOriginal || !originalQuoteBtn.translatedText) return;
    
    const quoteEl = document.getElementById('quote');
    
    // Restore translated version
    quoteEl.textContent = originalQuoteBtn.translatedText;
    
    originalQuoteBtn.textContent = '🌐';
    originalQuoteBtn.title = window.TranslationManager ? window.TranslationManager.getTranslation('originalQuoteTooltip') : 'Tieni premuto per vedere la lingua originale';
    originalQuoteBtn.showingOriginal = false;
    originalQuoteBtn.style.background = 'transparent';
  }
  
  // Mouse events
  originalQuoteBtn.addEventListener('mousedown', showOriginalQuote);
  originalQuoteBtn.addEventListener('mouseup', showTranslatedQuote);
  originalQuoteBtn.addEventListener('mouseleave', showTranslatedQuote);
  
  // Touch events for mobile
  originalQuoteBtn.addEventListener('touchstart', function(e) {
    e.preventDefault();
    showOriginalQuote();
  });
  originalQuoteBtn.addEventListener('touchend', function(e) {
    e.preventDefault();
    showTranslatedQuote();
  });
  originalQuoteBtn.addEventListener('touchcancel', showTranslatedQuote);
  
  // Prevent default click behavior
  originalQuoteBtn.addEventListener('click', function(e) {
    e.preventDefault();
  });
}

/**
 * Set up global keyboard event listeners
 */
function setupKeyboardEventListeners() {
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      handleEscapeKey();
    }
  });
}

/**
 * Handle escape key press for various UI elements
 */
function handleEscapeKey() {
  const settingsPopover = document.getElementById('settings-popover');
  const cityPopover1 = document.getElementById('city-popover-1');
  const cityPopover2 = document.getElementById('city-popover-2');
  
  // Close settings popover
  if (settingsPopover && settingsPopover.style.display === 'flex') {
    settingsPopover.style.display = 'none';
    return;
  }
  
  // Close city popovers
  if (cityPopover1 && cityPopover1.style.display === 'flex') {
    cityPopover1.style.display = 'none';
    return;
  }
  if (cityPopover2 && cityPopover2.style.display === 'flex') {
    cityPopover2.style.display = 'none';
    return;
  }
  
  // Exit clean view
  if (isCleanView) {
    const clearBtn = document.getElementById('clear-btn');
    document.body.classList.remove('clean-view');
    if (clearBtn) {
      clearBtn.classList.remove('clean-mode');
      clearBtn.title = 'Vista pulita';
      clearBtn.textContent = '🧹';
    }
    isCleanView = false;
    return;
  }
  
  // Cancel todo editing
  const editIndexField = document.getElementById('edit-todo-index');
  if (editIndexField && parseInt(editIndexField.value) >= 0) {
    const todoSection = document.querySelector('.todo');
    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-todo-btn');
    
    // Reset form
    if (input) {
      input.value = "";
      input.placeholder = "Aggiungi attività";
    }
    if (editIndexField) editIndexField.value = "-1";
    if (addBtn) {
      addBtn.textContent = "✔";
      addBtn.title = "Aggiungi alla lista";
    }
    
    if (todoSection) todoSection.style.display = 'none';
    if (form) form.style.display = 'none';
  }
}

/**
 * Get cache duration in hours from settings
 * @returns {Promise<number>} Cache duration in hours
 */
async function getCacheDuration() {
  try {
    const cacheDuration = await load('cacheDuration');
    return cacheDuration ? parseFloat(cacheDuration) : 24; // Default to 24 hours
  } catch (error) {
    console.error('Error getting cache duration:', error);
    return 24; // Default fallback
  }
}

/**
 * Update clean button state (placeholder for compatibility)
 */
function updateCleanButton(isClean) {
  // This function exists for compatibility with existing code
  // The actual button update is handled in setupCleanViewEventListeners
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for use by other modules
if (typeof window !== 'undefined') {
  window.initializeApp = initializeApp;
  window.setupOriginalQuoteButton = setupOriginalQuoteButton;
  window.handleEscapeKey = handleEscapeKey;
  window.updateCleanButton = updateCleanButton;
  window.getCacheDuration = getCacheDuration;
}
