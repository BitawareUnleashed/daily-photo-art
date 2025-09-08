// Clock, greeting and main UI management
function tickClock() {
  const el = document.getElementById("clock");
  const now = new Date();
  el.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function greeting() {
  load("name").then(name => {
    if (!name) {
      showWelcomeScreen();
    } else {
      displayGreeting(name);
      showMainContent();
    }
  });
}

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
  
  // Initialize main content components
  if (typeof loadQuote === 'function') loadQuote();
  if (typeof loadWeather === 'function') loadWeather();
  if (typeof loadWeather2 === 'function') loadWeather2();
  if (typeof renderTodos === 'function') renderTodos();
  if (typeof updateTodoNotificationVisibility === 'function') updateTodoNotificationVisibility();
}

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

function displayGreeting(name) {
  const h = new Date().getHours();
  const texts = window.currentTexts || {
    goodMorning: "Buongiorno",
    goodAfternoon: "Buon pomeriggio", 
    goodEvening: "Buonasera"
  };
  const msg = h < 12 ? texts.goodMorning : h < 18 ? texts.goodAfternoon : texts.goodEvening;
  document.getElementById("greeting").textContent = `${msg}, ${name}.`;
}

// Export for global access
if (typeof window !== 'undefined') {
  window.ClockUtils = { 
    tickClock, 
    greeting, 
    showWelcomeScreen, 
    showMainContent, 
    saveWelcomeName, 
    displayGreeting 
  };
}
