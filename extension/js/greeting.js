/**
 * Greeting management module
 * Handles personalized greetings based on time of day and user name
 */

/**
 * Display personalized greeting based on time of day
 * @param {string} name - User's name
 */
function displayGreeting(name) {
  const h = new Date().getHours();
  const texts = window.currentTexts || {
    goodMorning: "Buongiorno",
    goodAfternoon: "Buon pomeriggio", 
    goodEvening: "Buonasera"
  };
  const msg = h < 12 ? texts.goodMorning : h < 18 ? texts.goodAfternoon : texts.goodEvening;
  const greetingEl = document.getElementById("greeting");
  if (greetingEl) {
    greetingEl.textContent = `${msg}, ${name}.`;
  }
}

/**
 * Initialize greeting system - check if user has name and display appropriate content
 */
function initializeGreeting() {
  load("name").then(name => {
    if (!name) {
      showWelcomeScreen();
    } else {
      displayGreeting(name);
      showMainContent();
    }
  });
}

/**
 * Show welcome screen when no name is saved
 */
function showWelcomeScreen() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const container = document.querySelector('.container');
  const weatherBar = document.querySelector('.weather-status-bar');
  const allButtons = document.querySelectorAll('#clear-btn, #main-add-todo-btn, #todo-notification-btn, #settings-btn');
  
  if (welcomeScreen) {
    welcomeScreen.style.display = 'flex';
  }
  
  if (container) container.style.display = 'none';
  if (weatherBar) weatherBar.style.display = 'none';
  
  allButtons.forEach(btn => {
    if (btn) btn.style.display = 'none';
  });
  
  const languageSelect = document.getElementById('quote-language');
  if (languageSelect) {
    languageSelect.style.display = 'inline-flex';
  }
}

/**
 * Show main content and emit initialization event
 */
function showMainContent() {
  const welcomeScreen = document.getElementById('welcome-screen');
  const container = document.querySelector('.container');
  const weatherBar = document.querySelector('.weather-status-bar');
  const allButtons = document.querySelectorAll('#clear-btn, #main-add-todo-btn, #todo-notification-btn, #settings-btn');
  
  if (welcomeScreen) {
    welcomeScreen.style.display = 'none';
  }
  
  if (container) container.style.display = 'grid';
  if (weatherBar) weatherBar.style.display = 'flex';
  
  allButtons.forEach(btn => {
    if (btn) btn.style.display = 'inline-flex';
  });
  
  // Emit initialization event for all modules to handle their own initialization
  window.dispatchEvent(new CustomEvent('app:initialized'));
}

/**
 * Save welcome name and initialize main content
 */
function saveWelcomeName() {
  const nameInput = document.getElementById('welcome-name-input');
  const name = nameInput ? nameInput.value.trim() : '';
  
  if (name) {
    save('name', name).then(() => {
      displayGreeting(name);
      showMainContent();
    });
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.GreetingUtils = { 
    displayGreeting,
    initializeGreeting,
    showWelcomeScreen, 
    showMainContent, 
    saveWelcomeName
  };
  
  // Make key functions globally available for backward compatibility
  window.displayGreeting = displayGreeting;
  window.showWelcomeScreen = showWelcomeScreen;
  window.showMainContent = showMainContent;
  window.saveWelcomeName = saveWelcomeName;
}
