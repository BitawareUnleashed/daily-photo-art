const save = (key, value) => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return chrome.storage.sync.set({ [key]: value });
  } else {
    localStorage.setItem(key, JSON.stringify(value));
    return Promise.resolve();
  }
};
const load = (key) => {
  if (typeof chrome !== 'undefined' && chrome.storage) {
    return new Promise(res => chrome.storage.sync.get(key, it => res(it[key])));
  } else {
    const value = localStorage.getItem(key);
    return Promise.resolve(value ? JSON.parse(value) : undefined);
  }
};

function tickClock() {
  const el = document.getElementById("clock");
  const now = new Date();
  el.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function greeting() {
  load("name").then(name => {
    if (!name) {
      // Show welcome screen if no name is saved
      showWelcomeScreen();
    } else {
      displayGreeting(name);
      showMainContent(); // Initialize everything when name exists
    }
  });
}

function showWelcomeScreen() {
  // Hide main content and show only welcome screen and language selector
  const welcomeScreen = document.getElementById('welcome-screen');
  const container = document.querySelector('.container');
  const weatherBar = document.querySelector('.weather-status-bar');
  const allButtons = document.querySelectorAll('#clear-btn, #main-add-todo-btn, #todo-notification-btn, #settings-btn');
  
  // Show welcome screen
  if (welcomeScreen) {
    welcomeScreen.style.display = 'flex';
  }
  
  // Hide main content
  if (container) container.style.display = 'none';
  if (weatherBar) weatherBar.style.display = 'none';
  
  // Hide all buttons except language selector
  allButtons.forEach(btn => {
    if (btn) btn.style.display = 'none';
  });
  
  // Keep language selector visible
  const languageSelect = document.getElementById('quote-language');
  if (languageSelect) {
    languageSelect.style.display = 'inline-flex';
  }
}

function showMainContent() {
  // Show main content and hide welcome screen
  const welcomeScreen = document.getElementById('welcome-screen');
  const container = document.querySelector('.container');
  const weatherBar = document.querySelector('.weather-status-bar');
  const allButtons = document.querySelectorAll('#clear-btn, #main-add-todo-btn, #todo-notification-btn, #settings-btn');
  
  // Hide welcome screen
  if (welcomeScreen) {
    welcomeScreen.style.display = 'none';
  }
  
  // Show main content
  if (container) container.style.display = 'grid';
  if (weatherBar) weatherBar.style.display = 'flex';
  
  // Show all buttons
  allButtons.forEach(btn => {
    if (btn) btn.style.display = 'inline-flex';
  });
  
  // Initialize main content components
  loadQuote();
  loadWeather();
  loadWeather2();
  renderTodos();
  updateTodoNotificationVisibility();
}

function saveWelcomeName() {
  const nameInput = document.getElementById('welcome-name-input');
  const name = nameInput ? nameInput.value.trim() : '';
  
  if (name) {
    save('name', name).then(() => {
      displayGreeting(name);
      showMainContent(); // This will initialize everything including weather, todos, etc.
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
const focusEl = document.getElementById("focus");
const focusDisplay = document.getElementById("focus-display");

load("focus").then(v => { 
  if (v) {
    // If focus is already set, hide input and show label
    focusEl.style.display = 'none';
    focusDisplay.textContent = v;
    focusDisplay.style.display = 'block';
  } else {
    focusDisplay.style.display = 'none';
  }
});

focusEl.addEventListener("keypress", (e) => {
  if (e.key === 'Enter') {
    const value = focusEl.value.trim();
    if (value) {
      save("focus", value);
      focusEl.style.display = 'none';
      focusDisplay.textContent = value;
      focusDisplay.style.display = 'block';
    }
  }
});

// Add this event after the existing keypress event
focusEl.addEventListener("blur", async () => {
  const value = focusEl.value.trim();
  if (!value) {
    // If input is empty, clear from localStorage and hide label
    await save("focus", "");
    focusDisplay.style.display = 'none';
    focusEl.style.display = 'block';
  }
});

// Allow clicking on label to edit focus
focusDisplay.addEventListener("click", () => {
  focusEl.style.display = 'block';
  focusEl.value = focusDisplay.textContent;
  focusEl.focus();
  focusDisplay.style.display = 'none';
});

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");

// Helper function to translate category names
function translateCategory(category) {
  if (!category) return '';
  
  // Get current language
  const languageSelect = document.getElementById('quote-language');
  const currentLang = languageSelect ? languageSelect.value : (localStorage.getItem('quoteLang') || 'it');
  const texts = translations[currentLang] || translations.it;
  
  // Map original categories to translation keys
  const categoryMap = {
    'Lavoro': 'categoryWork',
    'Work': 'categoryWork', 
    'Travail': 'categoryWork',
    'Arbeit': 'categoryWork',
    'Casa': 'categoryHome',
    'Home': 'categoryHome',
    'Maison': 'categoryHome', 
    'Zuhause': 'categoryHome',
    'Hobby': 'categoryHobby',
    'Loisirs': 'categoryHobby',
    'Burocrazia': 'categoryBureaucracy',
    'Bureaucracy': 'categoryBureaucracy',
    'Bureaucratie': 'categoryBureaucracy',
    'Bürokratie': 'categoryBureaucracy',
    'Pagamenti': 'categoryPayments',
    'Payments': 'categoryPayments',
    'Paiements': 'categoryPayments',
    'Zahlungen': 'categoryPayments'
  };
  
  const translationKey = categoryMap[category];
  return translationKey ? texts[translationKey] : category;
}

// Alternative version with event listener instead of inline onclick
async function renderTodos() {
  const items = (await load("todos")) || [];
  list.innerHTML = items
    .map((item, i) => {
      const status = item.status || (item.completed ? 'completed' : 'todo'); // Backward compatibility
      const color = item.color || '#ffffff';
      const category = item.category || '';
      const translatedCategory = translateCategory(category);
      
      // Determine text styling based on status
      let textStyle;
      if (status === 'completed') {
        textStyle = `style=\"text-decoration: line-through; opacity: 0.6; color: ${color};\"`;
      } else if (status === 'priority') {
        textStyle = `style=\"font-weight: bold; color: ${color};\"`;
      } else {
        textStyle = `style=\"color: ${color};\"`;
      }
      
      const categoryBadge = translatedCategory ? `<span class=\"todo-category-badge\">${translatedCategory}</span>` : '';
      return `
        <li>
          <div style=\"display: flex; align-items: center; gap: 8px; flex: 1;\">
            <div class=\"todo-checkbox-custom state-${status}\" data-index=\"${i}\"></div>
            <span ${textStyle}>${item.text}${categoryBadge}</span>
          </div>
          <div style=\"display: flex; gap: 4px;\">
            <button data-index=\"${i}\" class=\"todo-edit\" title=\"Modifica\">✏️</button>
            <button data-index=\"${i}\" class=\"todo-delete\">✕</button>
          </div>
        </li>
      `;
    })
    .join("");

  // Aggiorna preview panel con stessa struttura di #todo-list
  const previewPanel = document.getElementById('todo-preview-panel');
  if (items.length > 0) {
    previewPanel.style.display = 'block';
    previewPanel.innerHTML = items
      .map((item, i) => {
        const status = item.status || (item.completed ? 'completed' : 'todo'); // Backward compatibility
        const color = item.color || '#ffffff';
        const category = item.category || '';
        const translatedCategory = translateCategory(category);
        
        // Determine text styling based on status
        let textStyle;
        if (status === 'completed') {
          textStyle = `style="text-decoration: line-through; opacity: 0.6; color: ${color};"`;
        } else if (status === 'priority') {
          textStyle = `style="font-weight: bold; color: ${color};"`;
        } else {
          textStyle = `style="color: ${color};"`;
        }
        
        const categoryBadge = translatedCategory ? `<span class="todo-category-badge">${translatedCategory}</span>` : '';
        return `
          <li style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, .15); font-size: 16px;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1;">
              <div class="todo-checkbox-custom state-${status}" data-index="${i}"></div>
              <span ${textStyle}>${item.text}${categoryBadge}</span>
            </div>
            <div style="display: flex; gap: 4px;">
              <button data-index="${i}" class="todo-preview-edit" style="background: transparent; border: 0; color: var(--muted); cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;" title="Modifica">✏️</button>
              <button data-index="${i}" class="todo-preview-delete" style="background: transparent; border: 0; color: var(--muted); cursor: pointer; padding: 4px 8px; border-radius: 4px; transition: background 0.2s;">✕</button>
            </div>
          </li>
        `;
      })
      .join("");
  } else {
    previewPanel.style.display = 'none';
    previewPanel.innerHTML = '';
  }

  // Add event listener after creating HTML - custom checkboxes for main list
  const mainListCheckboxes = list.querySelectorAll('.todo-checkbox-custom');
  mainListCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      await cycleTodoStatus(index);
    });
  });
  
  // Add event listeners for preview panel custom checkboxes
  const previewCheckboxes = previewPanel.querySelectorAll('.todo-checkbox-custom');
  previewCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      await cycleTodoStatus(index);
    });
  });
  
  // Add event listeners for preview panel delete buttons
  const previewDeleteButtons = previewPanel.querySelectorAll('.todo-preview-delete');
  previewDeleteButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      await deleteTodo(index);
    });
  });
  
  // Add event listeners for preview panel edit buttons
  const previewEditButtons = previewPanel.querySelectorAll('.todo-preview-edit');
  previewEditButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      editTodo(index);
    });
  });
  
  const deleteButtons = list.querySelectorAll('.todo-delete');
  deleteButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      await deleteTodo(index);
    });
  });
  
  // Add event listeners for main list edit buttons
  const editButtons = list.querySelectorAll('.todo-edit');
  editButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      editTodo(index);
    });
  });
  updateTodoNotificationVisibility();
}

// Function to cycle through the 3 states: priority -> todo -> completed
async function cycleTodoStatus(index) {
  const items = (await load("todos")) || [];
  if (items[index]) {
    const currentStatus = items[index].status || (items[index].completed ? 'completed' : 'todo');
    
    // Cycle through states: todo -> priority -> completed -> todo
    switch (currentStatus) {
      case 'todo':
        items[index].status = 'priority';
        items[index].completed = false;
        break;
      case 'priority':
        items[index].status = 'completed';
        items[index].completed = true;
        break;
      case 'completed':
        items[index].status = 'todo';
        items[index].completed = false;
        break;
      default:
        items[index].status = 'todo';
        items[index].completed = false;
    }
    
    await save("todos", items);
    renderTodos();
    updateTodoNotificationVisibility();
  }
}

// Function to update todo notification button visibility
async function updateTodoNotificationVisibility() {
  const items = (await load("todos")) || [];
  const todoNotificationBtn = document.getElementById('todo-notification-btn');
  const todoSection = document.querySelector('.todo');
  
  if (!todoNotificationBtn) return;
  
  const hasTodos = items.length > 0;
  const isSectionVisible = todoSection.style.display === 'block';
  
  if (hasTodos) {
    // Show button if there are todos
    todoNotificationBtn.style.display = 'inline-flex';
    
    if (isSectionVisible) {
      // If section is visible, show close button
      todoNotificationBtn.textContent = '✕';
      todoNotificationBtn.title = 'Nascondi todo';
      todoNotificationBtn.classList.remove('blinking');
    } else {
      // If section is hidden, show notification button with blink
      todoNotificationBtn.textContent = '📝';
      todoNotificationBtn.title = 'Mostra todo';
      todoNotificationBtn.classList.add('blinking');
    }
  } else {
    // Hide button if no todos
    todoNotificationBtn.style.display = 'none';
    todoNotificationBtn.classList.remove('blinking');
  }
}

// Function to complete/uncomplete a todo
async function toggleTodo(index) {
  const items = (await load("todos")) || [];
  if (items[index]) {
    items[index].completed = !items[index].completed;
    await save("todos", items);
    renderTodos();
    updateTodoNotificationVisibility();
  }
}

// Function to delete a todo
async function deleteTodo(index) {
  const items = (await load("todos")) || [];
  items.splice(index, 1);
  await save("todos", items);
  renderTodos();
  updateTodoNotificationVisibility();
}

// Function to edit a todo - reuse existing form
function editTodo(index) {
  const todoSection = document.querySelector('.todo');
  const form = document.getElementById('todo-form');
  const input = document.getElementById('todo-input');
  const editIndexField = document.getElementById('edit-todo-index');
  const addBtn = document.getElementById('add-todo-btn');
  
  load("todos").then(items => {
    const item = items[index];
    if (!item) return;
    
    // Show todo section and form
    todoSection.style.display = 'block';
    form.style.display = 'block';
    
    // Set editing mode
    editIndexField.value = index;
    
    // Populate form with current values
    input.value = item.text;
    input.placeholder = "Modifica attività";
    
    // Set current color
    const colorRadio = document.querySelector(`input[name="todo-color"][value="${item.color || '#ffffff'}"]`);
    if (colorRadio) colorRadio.checked = true;
    
    // Set current category
    const categoryRadio = document.querySelector(`input[name="todo-category"][value="${item.category || 'Lavoro'}"]`);
    if (categoryRadio) categoryRadio.checked = true;
    
    // Change button text and title
    addBtn.textContent = "💾";
    addBtn.title = "Salva modifiche";
    
    // Focus input
    input.focus();
    input.select();
  });
}

// Make functions global so they can be called from HTML
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  
  const editIndexField = document.getElementById('edit-todo-index');
  const editIndex = parseInt(editIndexField.value);
  const addBtn = document.getElementById('add-todo-btn');
  
  // Get selected color and category
  const selectedColor = document.querySelector('input[name="todo-color"]:checked').value;
  const selectedCategory = document.querySelector('input[name="todo-category"]:checked').value;
  
  const items = (await load("todos")) || [];
  
  if (editIndex >= 0 && items[editIndex]) {
    // Edit existing todo
    items[editIndex].text = text;
    items[editIndex].color = selectedColor;
    items[editIndex].category = selectedCategory;
  } else {
    // Add new todo
    items.push({ 
      text, 
      createdAt: Date.now(), 
      completed: false,
      status: 'todo', // New field: 'todo', 'priority', 'completed'
      color: selectedColor,
      category: selectedCategory
    });
  }
  
  await save("todos", items);
  
  // Reset form
  input.value = "";
  input.placeholder = "Aggiungi attività";
  editIndexField.value = "-1";
  addBtn.textContent = "✔";
  addBtn.title = "Aggiungi alla lista";
  
  // Reset color to white and category to default
  document.getElementById('color-white').checked = true;
  document.getElementById('category-lavoro').checked = true;
  
  renderTodos();
  
  // Hide todo section after adding/editing
  const todoSection = document.querySelector('.todo');
  todoSection.style.display = 'none';
  form.style.display = 'none';
  
  // Update notification button visibility after adding todo
  setTimeout(() => {
    updateTodoNotificationVisibility();
  }, 100);
});

async function translateText(text, targetLang = 'it') {
  try {
    if (targetLang === 'en') {
      return text; // Return original text if it's English
    }
    
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    return text; // Return original text if translation fails
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

// Global variable to save current quote
let currentQuote = null;

async function loadQuote() {
  const selectedLang = document.getElementById('quote-language')?.value || 'it';
  
  // If we already have a quote and are just changing language, translate it
  if (currentQuote) {
    const translatedQuote = await translateText(currentQuote.text, selectedLang);
    document.getElementById("quote").textContent = `"${translatedQuote}" — ${currentQuote.author}`;
    console.log('Quote translated:', { 
      original: currentQuote.text, 
      translated: translatedQuote, 
      author: currentQuote.author,
      lang: selectedLang 
    });
    return;
  }
  
  // Array of free quote services as fallback
  const quoteServices = [
    {
      name: 'ZenQuotes',
      fetch: async () => {
        const r = await fetch("https://zenquotes.io/api/random");
        const j = await r.json();
        return { text: j[0].q, author: j[0].a };
      }
    },
    {
      name: 'Quotable',
      fetch: async () => {
        const r = await fetch("https://api.quotable.io/random");
        const j = await r.json();
        return { text: j.content, author: j.author };
      }
    },
    {
      name: 'QuoteGarden',
      fetch: async () => {
        const r = await fetch("https://quote-garden.herokuapp.com/api/v3/quotes/random");
        const j = await r.json();
        return { text: j.data.quoteText, author: j.data.quoteAuthor };
      }
    },
    {
      name: 'Quotable Alternative',
      fetch: async () => {
        const r = await fetch("https://api.quotable.io/random?maxLength=150");
        const j = await r.json();
        return { text: j.content, author: j.author };
      }
    },
    {
      name: 'Local Fallback',
      fetch: async () => {
        const quotes = [
          { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
          { text: "Life is what happens to you while you're busy making other plans.", author: "John Lennon" },
          { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
          { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
          { text: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
          { text: "Success is the sum of small efforts repeated day in and day out.", author: "Robert Collier" },
          { text: "The best way to predict the future is to create it.", author: "Peter Drucker" }
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        return { text: randomQuote.text, author: randomQuote.author };
      }
    }
  ];

  for (let i = 0; i < quoteServices.length; i++) {
    try {
      console.log(`Trying ${quoteServices[i].name}...`);
      
      const quote = await quoteServices[i].fetch();
      
      // Save current quote for future translations
      currentQuote = quote;
      
      // Translate quote if necessary
      const translatedQuote = await translateText(quote.text, selectedLang);
      
      document.getElementById("quote").textContent = `"${translatedQuote}" — ${quote.author}`;
      console.log(`✅ ${quoteServices[i].name} success:`, { 
        original: quote.text, 
        translated: translatedQuote, 
        author: quote.author,
        lang: selectedLang 
      });
      
      return; // Success, exit loop
      
    } catch (error) {
      console.warn(`❌ ${quoteServices[i].name} failed:`, error.message);
      
      // If it's the last service, show error
      if (i === quoteServices.length - 1) {
        document.getElementById("quote").textContent = "Impossibile caricare citazione al momento.";
        console.error('All quote services failed');
      }
      
      // Continue with next service
    }
  }
}

// Separate function to get a new quote (if you want to add it in the future)
async function getNewQuote() {
  currentQuote = null; // Reset current quote
  loadQuote(); // Load new quote
}

async function loadWeather() {
  try {
    const cfg = await load("weatherCfg");
    if (cfg && cfg.city) {
      // If you have a saved city, use it
      loadWeatherForCity(cfg.city);
    } else {
      // Default: Roma
      loadWeatherForCity("Roma");
    }
  } catch (error) {
    const texts = window.currentTexts || { weatherNotAvailable: "Meteo non disponibile" };
    document.getElementById("weather").textContent = texts.weatherNotAvailable + ".";
  }
}

async function loadWeather2() {
  try {
    const cfg = await load("weatherCfg2");
    if (cfg && cfg.city) {
      // If you have a saved city, use it
      loadWeatherForCity2(cfg.city);
    } else {
      // Default: Milan
      loadWeatherForCity2("Milano");
    }
  } catch (error) {
    const texts = window.currentTexts || { weatherNotAvailable: "Meteo non disponibile" };
    document.getElementById("weather-2").textContent = texts.weatherNotAvailable + ".";
  }
}


// Scarica una foto e il relativo JSON da codicepunto.it/photos/DB
async function downloadCodicepuntoPhoto() {
  // Scegli un ID random (puoi cambiare range se necessario)
  const photoNum = Math.floor(Math.random() * 21) + 1;
  const photoId = `DBE_${photoNum.toString().padStart(3, '0')}`;
  //const baseUrl = `https://www.codicepunto.it/photos/DB/${photoId}`;
  const baseUrl = `https://raw.githubusercontent.com/bitawareunleashed/photo-storage/main/${photoId}`;
  const jpgUrl = `${baseUrl}.JPG`;
  const jsonUrl = `${baseUrl}.json`;
  try {
    // Scarica la foto
    const imgResp = await fetch(jpgUrl);
    if (!imgResp.ok) throw new Error('Immagine non trovata');
    const imgBlob = await imgResp.blob();
    const imgUrl = URL.createObjectURL(imgBlob);

    // Scarica il JSON
    const jsonResp = await fetch(jsonUrl);
    if (!jsonResp.ok) throw new Error('JSON non trovato');
    const photoData = await jsonResp.json();

    return { imgUrl, photoData, photoId };
  } catch (e) {
    console.warn('Errore download foto/JSON codicepunto:', e);
    return false;
  }
}

// Modifica setBackground per usare anche codicepunto.it
async function setBackground() {
  try {
    const bgElement = document.getElementById("bg");
    const photoInfoElement = document.getElementById("photo-info");
    if (!bgElement) {
      console.error('Background element not found!');
      return;
    }

    // 50% di probabilità: codicepunto oppure Picsum
    let useCodicepunto = Math.random() < 1;
    let imgUrl, photoData, photoId, source;
    //if (useCodicepunto) {
      const result = await downloadCodicepuntoPhoto();
      if (result) {
        imgUrl = result.imgUrl;
        photoData = result.photoData;
        photoId = result.photoId;
        source = 'codicepunto';
      }
    //}
    // fallback a Picsum se fallisce codicepunto
    //if (!imgUrl && false) {
    else{
      photoId = Math.floor(Math.random() * 1000) + 1;
      imgUrl = `https://picsum.photos/1536/864?random=${photoId}`;
      source = 'picsum';
      try {
        const infoResponse = await fetch(`https://picsum.photos/id/${photoId}/info`);
        photoData = await infoResponse.json();
      } catch {}
    }

    // Applica background
    bgElement.style.setProperty('background-image', `url("${imgUrl}")`, 'important');
    bgElement.style.setProperty('background-size', 'cover', 'important');
    bgElement.style.setProperty('background-position', 'center', 'important');
    bgElement.style.setProperty('background-repeat', 'no-repeat', 'important');

    // Mostra info foto
    if (photoData && photoInfoElement) {
      const photoTextElement = document.getElementById("photo-text");
      if (photoTextElement) {
        localStorage.setItem('currentPhotoData', JSON.stringify(photoData));
        const languageSelect = document.getElementById('quote-language');
        const currentLang = languageSelect ? languageSelect.value : (localStorage.getItem('quoteLang') || 'it');
        const t = translations[currentLang];
        if (source === 'codicepunto') {
          photoTextElement.textContent = `${t.photoBy} ${photoData.Name || photoData.ID || photoId} • Codicepunto.it`;
        } else {
          photoTextElement.textContent = `${t.photoBy} ${photoData.author} • Picsum Photos ID: ${photoData.id}`;
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

// Global translations object
const translations = {
  it: {
    // Buttons and tooltips
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
    
    // Placeholders
    focusPlaceholder: "Qual è il tuo focus di oggi?",
    addTodoPlaceholder: "Aggiungi attività",
    namePlaceholder: "Es. Dario",
    cityPlaceholder: "Es. Roma",
    secondCityPlaceholder: "Es. Milano",
    
    // Popover headers and labels
    settingsTitle: "Impostazioni",
    changeFirstCityTitle: "Cambia Prima Città",
    changeSecondCityTitle: "Cambia Seconda Città",
    yourNameLabel: "Il tuo nome",
    cityWeatherLabel: "Città per il meteo",
    cityNameLabel: "Nome della città",
    
    // Buttons in popovers
    saveButton: "Salva",
    cancelButton: "Annulla",
    
    // Greetings
    goodMorning: "Buongiorno",
    goodAfternoon: "Buon pomeriggio", 
    goodEvening: "Buonasera",
    
    // Weather
    weatherNotAvailable: "Meteo non disponibile",
    cityNotFound: "Città non trovata",
    humidity: "Umidità",
    wind: "Vento",
    weatherError: "Errore meteo",
    
    // Welcome screen
    welcomeTitle: "Benvenuto!",
    welcomeSubtitle: "Come ti chiami?",
    welcomeInputPlaceholder: "Inserisci il tuo nome",
    welcomeStartButton: "Inizia",
    
    // Photo info
    photoBy: "Foto di",
    
    // Categories
    categoryWork: "Lavoro",
    categoryHome: "Casa", 
    categoryHobby: "Hobby",
    categoryBureaucracy: "Burocrazia",
    categoryPayments: "Pagamenti"
  },
  en: {
    // Buttons and tooltips
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
    
    // Placeholders
    focusPlaceholder: "What's your focus today?",
    addTodoPlaceholder: "Add task",
    namePlaceholder: "e.g. John",
    cityPlaceholder: "e.g. Rome",
    secondCityPlaceholder: "e.g. Milan",
    
    // Popover headers and labels
    settingsTitle: "Settings",
    changeFirstCityTitle: "Change First City",
    changeSecondCityTitle: "Change Second City", 
    yourNameLabel: "Your name",
    cityWeatherLabel: "City for weather",
    cityNameLabel: "City name",
    
    // Buttons in popovers
    saveButton: "Save",
    cancelButton: "Cancel",
    
    // Greetings
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    
    // Weather
    weatherNotAvailable: "Weather not available",
    cityNotFound: "City not found",
    humidity: "Humidity",
    wind: "Wind",
    weatherError: "Weather error",
    
    // Welcome screen
    welcomeTitle: "Welcome!",
    welcomeSubtitle: "What's your name?",
    welcomeInputPlaceholder: "Enter your name",
    welcomeStartButton: "Start",
    
    // Photo info
    photoBy: "Photo by",
    
    // Categories
    categoryWork: "Work",
    categoryHome: "Home",
    categoryHobby: "Hobby", 
    categoryBureaucracy: "Bureaucracy",
    categoryPayments: "Payments"
  },
  fr: {
    // Buttons and tooltips
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
    
    // Placeholders
    focusPlaceholder: "Quel est votre objectif aujourd'hui?",
    addTodoPlaceholder: "Ajouter une tâche",
    namePlaceholder: "ex. Marie",
    cityPlaceholder: "ex. Rome",
    secondCityPlaceholder: "ex. Milan",
    
    // Popover headers and labels
    settingsTitle: "Paramètres",
    changeFirstCityTitle: "Changer Première Ville",
    changeSecondCityTitle: "Changer Deuxième Ville",
    yourNameLabel: "Votre nom",
    cityWeatherLabel: "Ville pour météo",
    cityNameLabel: "Nom de la ville",
    
    // Buttons in popovers
    saveButton: "Sauvegarder",
    cancelButton: "Annuler",
    
    // Greetings
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    
    // Weather
    weatherNotAvailable: "Météo non disponible",
    cityNotFound: "Ville non trouvée",
    humidity: "Humidité",
    wind: "Vent",
    weatherError: "Erreur météo",
    
    // Welcome screen
    welcomeTitle: "Bienvenue!",
    welcomeSubtitle: "Comment vous appelez-vous?",
    welcomeInputPlaceholder: "Entrez votre nom",
    welcomeStartButton: "Commencer",
    
    // Photo info
    photoBy: "Photo par",
    
    // Categories
    categoryWork: "Travail",
    categoryHome: "Maison",
    categoryHobby: "Loisirs",
    categoryBureaucracy: "Bureaucratie", 
    categoryPayments: "Paiements"
  },
  de: {
    // Buttons and tooltips
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
    
    // Placeholders
    focusPlaceholder: "Was ist heute dein Fokus?",
    addTodoPlaceholder: "Aufgabe hinzufügen",
    namePlaceholder: "z.B. Max",
    cityPlaceholder: "z.B. Rom", 
    secondCityPlaceholder: "z.B. Mailand",
    
    // Popover headers and labels
    settingsTitle: "Einstellungen",
    changeFirstCityTitle: "Erste Stadt Ändern",
    changeSecondCityTitle: "Zweite Stadt Ändern",
    yourNameLabel: "Dein Name",
    cityWeatherLabel: "Stadt für Wetter",
    cityNameLabel: "Stadtname",
    
    // Buttons in popovers
    saveButton: "Speichern", 
    cancelButton: "Abbrechen",
    
    // Greetings
    goodMorning: "Guten Morgen",
    goodAfternoon: "Guten Tag",
    goodEvening: "Guten Abend",
    
    // Weather
    weatherNotAvailable: "Wetter nicht verfügbar",
    cityNotFound: "Stadt nicht gefunden",
    humidity: "Feuchtigkeit",
    wind: "Wind",
    weatherError: "Wetter Fehler",
    
    // Welcome screen
    welcomeTitle: "Willkommen!",
    welcomeSubtitle: "Wie heißt du?",
    welcomeInputPlaceholder: "Namen eingeben",
    welcomeStartButton: "Start",
    
    // Photo info
    photoBy: "Foto von",
    
    // Categories
    categoryWork: "Arbeit",
    categoryHome: "Zuhause", 
    categoryHobby: "Hobby",
    categoryBureaucracy: "Bürokratie",
    categoryPayments: "Zahlungen"
  }
};

// Function to update photo info when language changes
function updatePhotoInfo() {
  const photoTextElement = document.getElementById("photo-text");
  const photoData = localStorage.getItem('currentPhotoData');
  
  if (photoData && photoTextElement) {
    const parsedData = JSON.parse(photoData);
    // Get current language from the dropdown or localStorage
    const languageSelect = document.getElementById('quote-language');
    const currentLang = languageSelect ? languageSelect.value : (localStorage.getItem('quoteLang') || 'it');
    const t = translations[currentLang];
    
    photoTextElement.textContent = `${t.photoBy} ${parsedData.author} • Picsum Photos ID: ${parsedData.id}`;
  }
}

// Add a function to translate interface texts
function translateInterface(lang) {
  const texts = translations[lang] || translations.it;
  
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
  updateCleanButton(isCurrentlyClean);
  
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
  
  // Update labels in settings popover
  const settingsLabels = document.querySelectorAll('#settings-popover label');
  if (settingsLabels[0]) settingsLabels[0].textContent = texts.yourNameLabel;
  if (settingsLabels[1]) settingsLabels[1].textContent = texts.cityWeatherLabel;
  
  // Update labels in city popovers
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
  
  // Update category labels and values
  const categoryLabels = document.querySelectorAll('[data-translate]');
  categoryLabels.forEach(label => {
    const key = label.getAttribute('data-translate');
    if (texts[key]) {
      // Keep the emoji and update the text
      const emoji = label.textContent.split(' ')[0];
      label.textContent = `${emoji} ${texts[key]}`;
      
      // Update the corresponding radio button value
      const radioId = label.getAttribute('for');
      const radio = document.getElementById(radioId);
      if (radio) {
        // Remember if this radio was checked before updating value
        const wasChecked = radio.checked;
        radio.value = texts[key];
        // Keep it checked if it was checked before
        if (wasChecked) {
          radio.checked = true;
        }
      }
    }
  });
  updateElement('welcome-name-input', 'placeholder', texts.welcomeInputPlaceholder);
  updateElementText('#welcome-save-btn', texts.welcomeStartButton);
  
  // Store current language and texts for greeting updates
  window.currentLang = lang;
  window.currentTexts = texts;
  
  // Re-render todos to update category translations in the lists
  renderTodos();
}

// Helper function to update clean button text
function updateCleanButton(isCleanView) {
  const clearBtn = document.getElementById('clear-btn');
  const texts = window.currentTexts || {
    cleanButton: "Vista pulita",
    returnToNormal: "Torna alla vista normale"
  };
  
  if (clearBtn) {
    if (isCleanView) {
      clearBtn.title = texts.returnToNormal;
    } else {
      clearBtn.title = texts.cleanButton;
    }
  }
}

// Helper functions
function updateElement(id, property, value) {
  const element = document.getElementById(id);
  if (element && value) {
    element[property] = value;
  }
}

function updateElementText(selector, value) {
  const element = document.querySelector(selector);
  if (element && value) {
    element.textContent = value;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded');
  
  // Welcome screen event listeners
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
  
  // Variable to track clean view state
  let isCleanView = false;
  
  // Clean/clean view button
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

  // Settings button
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
      
      if (savedName && nameInput) nameInput.value = savedName;
      if (savedCity && savedCity.city && cityInput) cityInput.value = savedCity.city;
      
      settingsPopover.style.display = 'flex';
    });

    // Close popover
    const closePopoverFn = () => {
      settingsPopover.style.display = 'none';
    };

    closePopover.addEventListener('click', closePopoverFn);
    popoverOverlay.addEventListener('click', closePopoverFn);

    // Save settings
    saveSettings.addEventListener('click', async function() {
      const name = nameInput ? nameInput.value.trim() : '';
      const city = cityInput ? cityInput.value.trim() : '';

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

      closePopoverFn();
    });

    // Close with ESC
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (settingsPopover.style.display === 'flex') {
          closePopoverFn();
        } else if (isCleanView) {
          // ESC also exits clean view
          document.body.classList.remove('clean-view');
          clearBtn.classList.remove('clean-mode');
          clearBtn.title = 'Vista pulita';
          clearBtn.textContent = '🧹';
          isCleanView = false;
        }
      }
    });
  }

  // Add event handler for main add todo button
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

  const hideBtn = document.getElementById('hide-todo-form');
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  
  if (hideBtn) {
    hideBtn.addEventListener('click', function() {
      console.log('Hide button clicked');
      
      // Reset editing mode if active
      const editIndexField = document.getElementById('edit-todo-index');
      const addBtn = document.getElementById('add-todo-btn');
      
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
      const todoList = document.getElementById('todo-list');
      
      todoSection.style.display = 'none';
      todoForm.style.display = 'none';
      
      // Update notification button visibility
      updateTodoNotificationVisibility();
    });
  }

  // Add event handler for todo notification button
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

  // Add event handler for todo close button
  const todoCloseBtn = document.getElementById('todo-close-btn');
  if (todoCloseBtn) {
    todoCloseBtn.addEventListener('click', function() {
      const todoSection = document.querySelector('.todo');
      todoSection.style.display = 'none';
      updateTodoNotificationVisibility();
    });
  }

  // Add event handler for change city button
  const changeCityBtn = document.getElementById('change-city-btn');
  if (changeCityBtn) {
    changeCityBtn.addEventListener('click', async function() {
      // Load current city configuration
      const cfg = await load("weatherCfg");
      const currentCity = cfg?.city || '';
      document.getElementById('city-input-1').value = currentCity;
      
      document.getElementById('city-popover-1').style.display = 'flex';
      document.getElementById('city-input-1').focus();
      document.getElementById('city-input-1').select();
    });
  }

  // Add event handler for second change city button
  const changeCityBtn2 = document.getElementById('change-city-btn-2');
  if (changeCityBtn2) {
    changeCityBtn2.addEventListener('click', async function() {
      // Load current city configuration
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
      cityPopover1.style.display = 'none';
      cityPopover2.style.display = 'none';
    });
  });

  // Close on overlay click
  [cityPopover1, cityPopover2].forEach(popover => {
    popover.querySelector('.popover-overlay').addEventListener('click', function() {
      popover.style.display = 'none';
    });
  });

  // Save city 1
  document.getElementById('save-city-1').addEventListener('click', async function() {
    const city = document.getElementById('city-input-1').value.trim();
    if (city) {
      loadWeatherForCity(city);
      cityPopover1.style.display = 'none';
      document.getElementById('city-input-1').value = '';
    }
  });

  // Save city 2
  document.getElementById('save-city-2').addEventListener('click', async function() {
    const city = document.getElementById('city-input-2').value.trim();
    if (city) {
      loadWeatherForCity2(city);
      cityPopover2.style.display = 'none';
      document.getElementById('city-input-2').value = '';
    }
  });

  // Handle Enter key in city inputs
  document.getElementById('city-input-1').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('save-city-1').click();
    }
  });

  document.getElementById('city-input-2').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('save-city-2').click();
    }
  });

  // Handle Escape key to close city popovers
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const cityPopover1 = document.getElementById('city-popover-1');
      const cityPopover2 = document.getElementById('city-popover-2');
      
      if (cityPopover1.style.display === 'flex') {
        cityPopover1.style.display = 'none';
      }
      if (cityPopover2.style.display === 'flex') {
        cityPopover2.style.display = 'none';
      }
      
      // Also close todo form if editing
      const editIndexField = document.getElementById('edit-todo-index');
      if (editIndexField && parseInt(editIndexField.value) >= 0) {
        const todoSection = document.querySelector('.todo');
        const form = document.getElementById('todo-form');
        const input = document.getElementById('todo-input');
        const addBtn = document.getElementById('add-todo-btn');
        
        // Reset form
        input.value = "";
        input.placeholder = "Aggiungi attività";
        editIndexField.value = "-1";
        addBtn.textContent = "✔";
        addBtn.title = "Aggiungi alla lista";
        
        todoSection.style.display = 'none';
        form.style.display = 'none';
      }
    }
  });

  // Add event listener for color radio buttons
  const colorRadios = document.querySelectorAll('input[name="todo-color"]');
  colorRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      todoInput.focus();
    });
  });

  // Add event listener for quote language change
  const languageSelect = document.getElementById('quote-language');
  if (languageSelect) {
    // Load saved language BEFORE loading quote
    load('quoteLang').then(savedLang => {
      const currentLang = savedLang || 'it';
      languageSelect.value = currentLang;
      
      // Translate interface in saved language
      translateInterface(currentLang);
      
      // Load quote AFTER restoring language
      loadQuote();
    });
    
    languageSelect.addEventListener('change', async function() {
      await save('quoteLang', this.value);
      
      // Translate interface in new language
      translateInterface(this.value);
      
      // Update greeting with new language
      load("name").then(name => {
        if (name) {
          displayGreeting(name);
        }
      });
      
      // Reload weather with new translations
      loadWeather();
      loadWeather2();
      
      // Update photo info with new language
      updatePhotoInfo();
      
      loadQuote(); // Now translates current quote instead of loading a new one
    });
  } else {
    // If there's no dropdown, use Italian as default
    translateInterface('it');
    loadQuote();
  }

  // Initialize everything
  setBackground();
  tickClock();
  setInterval(tickClock, 1000);
  greeting(); // This will decide whether to show welcome screen or main content
  // Other initializations will be called from showMainContent() or after name is saved
});

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

async function loadWeatherForCity(cityName) {
  try {
    // First get city coordinates
    const location = await getCoordinates(cityName);
    const texts = window.currentTexts || { cityNotFound: "Città non trovata", humidity: "Umidità", wind: "Vento" };
    
    if (!location) {
      document.getElementById("weather").textContent = texts.cityNotFound + ".";
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
    
    document.getElementById("weather").innerHTML = `
      <strong>${location.name}, ${location.country}</strong> • ${weatherIcon} ${temp}°C - ${weatherDescription} • ${texts.humidity}: ${humidity}% • ${texts.wind}: ${windSpeed} km/h
    `;
    
    // Save location for next time
    await save("weatherCfg", { lat: location.lat, lon: location.lon, city: location.name });
    
  } catch (error) {
    console.error('Weather error:', error);
    const texts = window.currentTexts || { weatherNotAvailable: "Meteo non disponibile" };
    document.getElementById("weather").textContent = texts.weatherNotAvailable + ".";
  }
}

async function loadWeatherForCity2(cityName) {
  try {
    // First get city coordinates
    const location = await getCoordinates(cityName);
    const texts = window.currentTexts || { cityNotFound: "Città non trovata", humidity: "Umidità", wind: "Vento" };
    
    if (!location) {
      document.getElementById("weather-2").textContent = texts.cityNotFound + ".";
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
    
    document.getElementById("weather-2").innerHTML = `
      <strong>${location.name}, ${location.country}</strong> • ${weatherIcon} ${temp}°C - ${weatherDescription} • ${texts.humidity}: ${humidity}% • ${texts.wind}: ${windSpeed} km/h
    `;
    
    // Save location for next time
    await save("weatherCfg2", { lat: location.lat, lon: location.lon, city: location.name });
    
  } catch (error) {
    console.error('Weather error 2:', error);
    const texts = window.currentTexts || { weatherNotAvailable: "Meteo non disponibile" };
    document.getElementById("weather-2").textContent = texts.weatherNotAvailable + ".";
  }
}

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