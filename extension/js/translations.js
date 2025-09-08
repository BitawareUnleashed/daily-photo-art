// Translation system for multi-language support
const translations = {
  it: {
    cleanButton: "Vista pulita",
    returnToNormal: "Torna alla vista normale",
    todoButton: "To-do",
    showTodoButton: "Mostra todo",
    settingsButton: "Impostazioni",
    languageSelect: "Lingua citazioni",
    closeTodo: "Chiudi",
    addToList: "Aggiungi alla lista",
    hideTodo: "Nascondi To-do",
    changeCity: "Cambia città",
    changeSecondCity: "Cambia seconda città",
    focusPlaceholder: "Qual è il tuo focus di oggi?",
    addTodoPlaceholder: "Aggiungi attività",
    namePlaceholder: "Es. Dario",
    cityPlaceholder: "Es. Roma",
    secondCityPlaceholder: "Es. Milano",
    settingsTitle: "Impostazioni",
    changeFirstCityTitle: "Cambia Prima Città",
    changeSecondCityTitle: "Cambia Seconda Città",
    yourNameLabel: "Il tuo nome",
    cacheDurationLabel: "Durata cache contenuti",
    cache2minutes: "2 minuti",
    cache1hour: "1 ora",
    cache6hours: "6 ore",
    cache12hours: "12 ore",
    cache24hours: "24 ore",
    cache48hours: "48 ore",
    cache72hours: "72 ore",
    cityWeatherLabel: "Città per il meteo",
    cityNameLabel: "Nome della città",
    saveButton: "Salva",
    cancelButton: "Annulla",
    goodMorning: "Buongiorno",
    goodAfternoon: "Buon pomeriggio", 
    goodEvening: "Buonasera",
    weatherNotAvailable: "Meteo non disponibile",
    cityNotFound: "Città non trovata",
    humidity: "Umidità",
    wind: "Vento",
    weatherError: "Errore meteo",
    welcomeTitle: "Benvenuto!",
    welcomeSubtitle: "Come ti chiami?",
    welcomeInputPlaceholder: "Inserisci il tuo nome",
    welcomeStartButton: "Inizia",
    photoBy: "Foto di",
    originalQuoteTooltip: "Tieni premuto per vedere la lingua originale",
    releaseToReturnTranslation: "Rilascia per tornare alla traduzione",
    categoryWork: "Lavoro",
    categoryHome: "Casa", 
    categoryHobby: "Hobby",
    categoryBureaucracy: "Burocrazia",
    categoryPayments: "Pagamenti"
  },
  en: {
    cleanButton: "Clean view",
    returnToNormal: "Return to normal view",
    todoButton: "To-do",
    showTodoButton: "Show todo",
    settingsButton: "Settings",
    languageSelect: "Quote language",
    closeTodo: "Close",
    addToList: "Add to list",
    hideTodo: "Hide To-do",
    changeCity: "Change city",
    changeSecondCity: "Change second city",
    focusPlaceholder: "What's your focus today?",
    addTodoPlaceholder: "Add task",
    namePlaceholder: "e.g. John",
    cityPlaceholder: "e.g. Rome",
    secondCityPlaceholder: "e.g. Milan",
    settingsTitle: "Settings",
    changeFirstCityTitle: "Change First City",
    changeSecondCityTitle: "Change Second City", 
    yourNameLabel: "Your name",
    cacheDurationLabel: "Cache duration",
    cache2minutes: "2 minutes",
    cache1hour: "1 hour",
    cache6hours: "6 hours",
    cache12hours: "12 hours",
    cache24hours: "24 hours",
    cache48hours: "48 hours",
    cache72hours: "72 hours",
    cityWeatherLabel: "City for weather",
    cityNameLabel: "City name",
    saveButton: "Save",
    cancelButton: "Cancel",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    weatherNotAvailable: "Weather not available",
    cityNotFound: "City not found",
    humidity: "Humidity",
    wind: "Wind",
    weatherError: "Weather error",
    welcomeTitle: "Welcome!",
    welcomeSubtitle: "What's your name?",
    welcomeInputPlaceholder: "Enter your name",
    welcomeStartButton: "Start",
    photoBy: "Photo by",
    originalQuoteTooltip: "Hold to see original language",
    releaseToReturnTranslation: "Release to return to translation",
    categoryWork: "Work",
    categoryHome: "Home",
    categoryHobby: "Hobby", 
    categoryBureaucracy: "Bureaucracy",
    categoryPayments: "Payments"
  },
  fr: {
    cleanButton: "Vue propre",
    returnToNormal: "Retourner à la vue normale",
    todoButton: "À faire", 
    showTodoButton: "Afficher tâches",
    settingsButton: "Paramètres",
    languageSelect: "Langue des citations",
    closeTodo: "Fermer",
    addToList: "Ajouter à la liste",
    hideTodo: "Masquer tâches",
    changeCity: "Changer ville",
    changeSecondCity: "Changer deuxième ville",
    focusPlaceholder: "Quel est votre objectif aujourd'hui?",
    addTodoPlaceholder: "Ajouter une tâche",
    namePlaceholder: "ex. Marie",
    cityPlaceholder: "ex. Rome",
    secondCityPlaceholder: "ex. Milan",
    settingsTitle: "Paramètres",
    changeFirstCityTitle: "Changer Première Ville",
    changeSecondCityTitle: "Changer Deuxième Ville",
    yourNameLabel: "Votre nom",
    cacheDurationLabel: "Durée du cache",
    cache2minutes: "2 minutes",
    cache1hour: "1 heure",
    cache6hours: "6 heures",
    cache12hours: "12 heures",
    cache24hours: "24 heures",
    cache48hours: "48 heures",
    cache72hours: "72 heures",
    cityWeatherLabel: "Ville pour météo",
    cityNameLabel: "Nom de la ville",
    saveButton: "Sauvegarder",
    cancelButton: "Annuler",
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    weatherNotAvailable: "Météo non disponible",
    cityNotFound: "Ville non trouvée",
    humidity: "Humidité",
    wind: "Vent",
    weatherError: "Erreur météo",
    welcomeTitle: "Bienvenue!",
    welcomeSubtitle: "Comment vous appelez-vous?",
    welcomeInputPlaceholder: "Entrez votre nom",
    welcomeStartButton: "Commencer",
    photoBy: "Photo par",
    originalQuoteTooltip: "Maintenez pour voir la langue originale",
    releaseToReturnTranslation: "Relâchez pour revenir à la traduction",
    categoryWork: "Travail",
    categoryHome: "Maison",
    categoryHobby: "Loisirs",
    categoryBureaucracy: "Bureaucratie", 
    categoryPayments: "Paiements"
  },
  de: {
    cleanButton: "Saubere Ansicht",
    returnToNormal: "Zur normalen Ansicht zurückkehren",
    todoButton: "Aufgaben",
    showTodoButton: "Aufgaben zeigen", 
    settingsButton: "Einstellungen",
    languageSelect: "Zitat Sprache",
    closeTodo: "Schließen",
    addToList: "Zur Liste hinzufügen",
    hideTodo: "Aufgaben ausblenden",
    changeCity: "Stadt ändern",
    changeSecondCity: "Zweite Stadt ändern",
    focusPlaceholder: "Was ist heute dein Fokus?",
    addTodoPlaceholder: "Aufgabe hinzufügen",
    namePlaceholder: "z.B. Max",
    cityPlaceholder: "z.B. Rom", 
    secondCityPlaceholder: "z.B. Mailand",
    settingsTitle: "Einstellungen",
    changeFirstCityTitle: "Erste Stadt Ändern",
    changeSecondCityTitle: "Zweite Stadt Ändern",
    yourNameLabel: "Dein Name",
    cacheDurationLabel: "Cache-Dauer",
    cache2minutes: "2 Minuten",
    cache1hour: "1 Stunde",
    cache6hours: "6 Stunden",
    cache12hours: "12 Stunden",
    cache24hours: "24 Stunden",
    cache48hours: "48 Stunden",
    cache72hours: "72 Stunden",
    cityWeatherLabel: "Stadt für Wetter",
    cityNameLabel: "Stadtname",
    saveButton: "Speichern", 
    cancelButton: "Abbrechen",
    goodMorning: "Guten Morgen",
    goodAfternoon: "Guten Tag",
    goodEvening: "Guten Abend",
    weatherNotAvailable: "Wetter nicht verfügbar",
    cityNotFound: "Stadt nicht gefunden",
    humidity: "Feuchtigkeit",
    wind: "Wind",
    weatherError: "Wetter Fehler",
    welcomeTitle: "Willkommen!",
    welcomeSubtitle: "Wie heißt du?",
    welcomeInputPlaceholder: "Namen eingeben",
    welcomeStartButton: "Start",
    photoBy: "Foto von",
    originalQuoteTooltip: "Halten um Originalsprache zu sehen",
    releaseToReturnTranslation: "Loslassen um zur Übersetzung zurückzukehren",
    categoryWork: "Arbeit",
    categoryHome: "Zuhause", 
    categoryHobby: "Hobby",
    categoryBureaucracy: "Bürokratie",
    categoryPayments: "Zahlungen"
  }
};

// Helper functions for DOM manipulation
function updateElement(id, attribute, value) {
  const element = document.getElementById(id);
  if (element) {
    if (attribute === 'textContent') {
      element.textContent = value;
    } else {
      element.setAttribute(attribute, value);
    }
  }
}

function updateElementText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

// Update photo info when language changes
function updatePhotoInfo() {
  const photoTextElement = document.getElementById("photo-text");
  const photoData = localStorage.getItem('currentPhotoData');
  
  if (photoData && photoTextElement) {
    const parsedData = JSON.parse(photoData);
    const languageSelect = document.getElementById('quote-language');
    const currentLang = languageSelect ? languageSelect.value : (localStorage.getItem('quoteLang') || 'it');
    const t = translations[currentLang];
    
    photoTextElement.textContent = `${t.photoBy} ${parsedData.author} • Picsum Photos ID: ${parsedData.id}`;
  }
}

// Translate interface texts
function translateInterface(lang) {
  const texts = translations[lang] || translations.it;
  window.currentTexts = texts;
  
  // Update all interface elements
  updateElement('clear-btn', 'title', texts.cleanButton);
  updateElement('main-add-todo-btn', 'title', texts.todoButton);
  updateElement('todo-notification-btn', 'title', texts.showTodoButton);
  updateElement('settings-btn', 'title', texts.settingsButton);
  updateElement('quote-language', 'title', texts.languageSelect);
  updateElement('todo-close-btn', 'title', texts.closeTodo);
  updateElement('add-todo-btn', 'title', texts.addToList);
  updateElement('hide-todo-form', 'title', texts.hideTodo);
  updateElement('change-city-btn', 'title', texts.changeCity);
  updateElement('change-city-btn-2', 'title', texts.changeSecondCity);
  
  // Update clean button based on current state
  const isCurrentlyClean = document.body.classList.contains('clean-view');
  if (typeof updateCleanButton === 'function') {
    updateCleanButton(isCurrentlyClean);
  }
  
  // Update placeholders
  updateElement('focus', 'placeholder', texts.focusPlaceholder);
  updateElement('todo-input', 'placeholder', texts.addTodoPlaceholder);
  updateElement('name-input', 'placeholder', texts.namePlaceholder);
  updateElement('city-input', 'placeholder', texts.cityPlaceholder);
  updateElement('city-input-1', 'placeholder', texts.cityPlaceholder);
  updateElement('city-input-2', 'placeholder', texts.secondCityPlaceholder);
  
  // Update text content in popovers
  const settingsTitle = document.querySelector('#settings-popover h2');
  if (settingsTitle) settingsTitle.textContent = texts.settingsTitle;
  
  const cityTitle1 = document.querySelector('#city-popover-1 h2');
  if (cityTitle1) cityTitle1.textContent = texts.changeFirstCityTitle;
  
  const cityTitle2 = document.querySelector('#city-popover-2 h2');
  if (cityTitle2) cityTitle2.textContent = texts.changeSecondCityTitle;
  
  // Update button texts
  updateElementText('#save-settings', texts.saveButton);
  updateElementText('#save-city-1', texts.saveButton);
  updateElementText('#save-city-2', texts.saveButton);
  
  // Update labels
  const settingsLabels = document.querySelectorAll('#settings-popover label');
  if (settingsLabels[0]) settingsLabels[0].textContent = texts.yourNameLabel;
  if (settingsLabels[1]) settingsLabels[1].textContent = texts.cityWeatherLabel;
  
  const cityLabel1 = document.querySelector('#city-popover-1 label');
  if (cityLabel1) cityLabel1.textContent = texts.cityNameLabel;
  
  const cityLabel2 = document.querySelector('#city-popover-2 label');
  if (cityLabel2) cityLabel2.textContent = texts.cityNameLabel;
  
  // Update cancel buttons
  const cancelButtons = document.querySelectorAll('.close-city-popover.cancel-btn');
  cancelButtons.forEach(btn => btn.textContent = texts.cancelButton);
  
  // Update welcome screen texts
  updateElementText('#welcome-title', texts.welcomeTitle);
  updateElementText('#welcome-subtitle', texts.welcomeSubtitle);
  updateElement('welcome-name-input', 'placeholder', texts.welcomeInputPlaceholder);
  updateElementText('#welcome-save-btn', texts.welcomeStartButton);
  
  // Update category labels
  const categoryLabels = document.querySelectorAll('.category-option');
  categoryLabels.forEach(label => {
    const categoryKey = label.getAttribute('data-translate');
    if (categoryKey && texts[categoryKey]) {
      const emoji = label.textContent.substring(0, 2);
      label.textContent = `${emoji} ${texts[categoryKey]}`;
    }
  });
  
  // Update all elements with data-translate attribute
  const translateElements = document.querySelectorAll('[data-translate]');
  translateElements.forEach(element => {
    const translateKey = element.getAttribute('data-translate');
    if (translateKey && texts[translateKey] && !element.classList.contains('category-option')) {
      element.textContent = texts[translateKey];
    }
  });
  
  // Update original quote button tooltip after translations are loaded
  setTimeout(() => {
    if (window.QuoteUtils && window.QuoteUtils.updateOriginalQuoteTooltip) {
      window.QuoteUtils.updateOriginalQuoteTooltip();
    }
  }, 50); // Small delay to ensure quotes module is ready
}

// Export for global access
if (typeof window !== 'undefined') {
  window.TranslationUtils = { 
    translations, 
    updateElement, 
    updateElementText, 
    updatePhotoInfo, 
    translateInterface 
  };
  
  // Also expose TranslationManager for backward compatibility
  window.TranslationManager = {
    getTranslation: (key) => {
      const languageSelect = document.getElementById('quote-language');
      const currentLang = languageSelect ? languageSelect.value : (localStorage.getItem('quoteLang') || 'it');
      const texts = translations[currentLang] || translations['it'];
      return texts[key] || key;
    }
  };
}
