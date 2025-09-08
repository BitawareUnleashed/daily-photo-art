// Quote management and translation functionality
let currentQuote = null;

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
        originalQuoteBtn.title = 'Tieni premuto per vedere la lingua originale';
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
  
  // Use only local fallback for now to avoid API issues
  try {
    console.log('📝 Using local fallback quotes...');
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
    currentQuote = randomQuote;
    console.log('📝 Selected local quote:', randomQuote);
    
    const translatedQuote = await translateText(randomQuote.text, selectedLang);
    console.log('📝 Translated quote:', translatedQuote);
    
    document.getElementById("quote").textContent = `"${translatedQuote}" — ${randomQuote.author}`;
    
    // Show/hide original quote button
    const originalQuoteBtn = document.getElementById('original-quote-btn');
    if (originalQuoteBtn) {
      if (selectedLang !== 'en' && translatedQuote !== randomQuote.text) {
        originalQuoteBtn.style.display = 'inline-block';
        originalQuoteBtn.textContent = '🌐';
        originalQuoteBtn.title = 'Tieni premuto per vedere la lingua originale';
        originalQuoteBtn.translatedText = `"${translatedQuote}" — ${randomQuote.author}`;
        originalQuoteBtn.originalText = `"${randomQuote.text}" — ${randomQuote.author}`;
        console.log('📝 Original quote button shown');
      } else {
        originalQuoteBtn.style.display = 'none';
        console.log('📝 Original quote button hidden');
      }
    }
    
    console.log('📝 Quote loaded successfully');
    
  } catch (error) {
    console.error('📝 Error in local fallback:', error);
    document.getElementById("quote").textContent = "Impossibile caricare citazione al momento.";
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.QuoteUtils = { 
    translateText, 
    loadQuote, 
    getNewQuote,
    getCurrentQuote: () => currentQuote
  };
}
