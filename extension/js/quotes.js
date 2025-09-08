// Quote management and translation functionality
let currentQuote = null;

// Cache configuration
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

/**
 * Save quote to cache with timestamp
 */
function saveQuoteToCache(quote) {
  const cacheData = {
    quote: quote,
    timestamp: Date.now()
  };
  localStorage.setItem('cachedQuote', JSON.stringify(cacheData));
  console.log('💾 Quote saved to cache:', quote);
}

/**
 * Load quote from cache if still valid
 */
function loadQuoteFromCache() {
  try {
    const cached = localStorage.getItem('cachedQuote');
    if (!cached) return null;
    
    const cacheData = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;
    
    if (age < CACHE_DURATION) {
      console.log('📦 Quote loaded from cache (age:', Math.round(age / 1000), 'seconds)');
      return cacheData.quote;
    } else {
      console.log('⏰ Cached quote expired (age:', Math.round(age / 1000), 'seconds)');
      localStorage.removeItem('cachedQuote');
      return null;
    }
  } catch (error) {
    console.error('❌ Error loading quote from cache:', error);
    localStorage.removeItem('cachedQuote');
    return null;
  }
}

async function translateText(text, targetLang = 'it') {
  try {
    if (targetLang === 'en') {
      return text;
    }
    
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    }
    return text;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

async function loadQuote() {
  console.log('📝 loadQuote() called');
  console.log('📝 currentQuote state:', currentQuote);
  const selectedLang = document.getElementById('quote-language')?.value || 'it';
  console.log('Selected language:', selectedLang);
  
  // Check cache first if we don't have a current quote
  if (!currentQuote) {
    const cachedQuote = loadQuoteFromCache();
    if (cachedQuote) {
      currentQuote = cachedQuote;
      console.log('📦 Using cached quote:', currentQuote);
    }
  }
  
  // If we already have a quote and are just changing language, translate it
  if (currentQuote) {
    console.log('📝 Translating existing quote:', currentQuote);
    const translatedQuote = await translateText(currentQuote.text, selectedLang);
    document.getElementById("quote").textContent = `"${translatedQuote}" — ${currentQuote.author}`;
    
    // Show/hide original quote button
    const originalQuoteBtn = document.getElementById('original-quote-btn');
    if (originalQuoteBtn) {
      if (selectedLang !== 'en' && translatedQuote !== currentQuote.text) {
        originalQuoteBtn.style.display = 'inline-block';
        originalQuoteBtn.textContent = '🌐';
        console.log('📝 TranslationManager available?', !!window.TranslationManager);
        originalQuoteBtn.title = window.TranslationManager ? window.TranslationManager.getTranslation('originalQuoteTooltip') : 'Tieni premuto per vedere la lingua originale';
        console.log('📝 Tooltip set to:', originalQuoteBtn.title);
        originalQuoteBtn.translatedText = `"${translatedQuote}" — ${currentQuote.author}`;
        originalQuoteBtn.originalText = `"${currentQuote.text}" — ${currentQuote.author}`;
        console.log('📝 Original quote button shown with tooltip:', originalQuoteBtn.title);
      } else {
        originalQuoteBtn.style.display = 'none';
        console.log('📝 Original quote button hidden');
      }
    }
    
    console.log('Quote translated:', { 
      original: currentQuote.text, 
      translated: translatedQuote, 
      author: currentQuote.author,
      lang: selectedLang 
    });
    return;
  }
  
  console.log('📝 No current quote, getting new one...');
  await getNewQuote();
}

async function getNewQuote() {
  console.log('🔄 Loading new quote...');
  const selectedLang = document.getElementById('quote-language')?.value || 'it';
  
  // Array of quote services to try
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

  // Try each service until one works
  for (let i = 0; i < quoteServices.length; i++) {
    try {
      console.log(`📝 Trying ${quoteServices[i].name}...`);
      
      const quote = await quoteServices[i].fetch();
      currentQuote = quote;
      console.log('📝 Selected quote:', quote);
      
      // Save to cache
      saveQuoteToCache(quote);
      
      const translatedQuote = await translateText(quote.text, selectedLang);
      console.log('📝 Translated quote:', translatedQuote);
      
      document.getElementById("quote").textContent = `"${translatedQuote}" — ${quote.author}`;
      
      // Show/hide original quote button
      const originalQuoteBtn = document.getElementById('original-quote-btn');
      if (originalQuoteBtn) {
        if (selectedLang !== 'en' && translatedQuote !== quote.text) {
          originalQuoteBtn.style.display = 'inline-block';
          originalQuoteBtn.textContent = '🌐';
          console.log('📝 TranslationManager available?', !!window.TranslationManager);
          originalQuoteBtn.title = window.TranslationManager ? window.TranslationManager.getTranslation('originalQuoteTooltip') : 'Tieni premuto per vedere la lingua originale';
          console.log('📝 Tooltip set to:', originalQuoteBtn.title);
          originalQuoteBtn.translatedText = `"${translatedQuote}" — ${quote.author}`;
          originalQuoteBtn.originalText = `"${quote.text}" — ${quote.author}`;
          console.log('📝 Original quote button shown');
        } else {
          originalQuoteBtn.style.display = 'none';
          console.log('📝 Original quote button hidden');
        }
      }
      
      console.log(`✅ ${quoteServices[i].name} success!`);
      return;
      
    } catch (error) {
      console.warn(`❌ ${quoteServices[i].name} failed:`, error.message);
      
      if (i === quoteServices.length - 1) {
        console.error('📝 All quote services failed');
        document.getElementById("quote").textContent = "Impossibile caricare citazione al momento.";
      }
    }
  }
}

/**
 * Get remaining cache time in minutes
 */
function getCacheRemainingTime() {
  try {
    const cached = localStorage.getItem('cachedQuote');
    if (!cached) return 0;
    
    const cacheData = JSON.parse(cached);
    const age = Date.now() - cacheData.timestamp;
    const remaining = CACHE_DURATION - age;
    
    return Math.max(0, Math.round(remaining / (60 * 1000))); // Return minutes
  } catch (error) {
    return 0;
  }
}

/**
 * Update the tooltip of the original quote button with current translation
 */
function updateOriginalQuoteTooltip() {
  const originalQuoteBtn = document.getElementById('original-quote-btn');
  if (originalQuoteBtn && originalQuoteBtn.style.display !== 'none' && window.TranslationManager) {
    const newTooltip = window.TranslationManager.getTranslation('originalQuoteTooltip');
    originalQuoteBtn.title = newTooltip;
    console.log('📝 Tooltip updated to:', newTooltip);
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.QuoteUtils = { 
    translateText, 
    loadQuote, 
    getNewQuote,
    getCurrentQuote: () => currentQuote,
    updateOriginalQuoteTooltip,
    getCacheRemainingTime
  };
}
