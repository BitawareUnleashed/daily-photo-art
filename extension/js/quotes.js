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
  const selectedLang = document.getElementById('quote-language')?.value || 'it';
  
  // If we already have a quote and are just changing language, translate it
  if (currentQuote) {
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
      } else {
        originalQuoteBtn.style.display = 'none';
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
      currentQuote = quote;
      
      const translatedQuote = await translateText(quote.text, selectedLang);
      document.getElementById("quote").textContent = `"${translatedQuote}" — ${quote.author}`;
      
      // Show/hide original quote button
      const originalQuoteBtn = document.getElementById('original-quote-btn');
      if (originalQuoteBtn) {
        if (selectedLang !== 'en' && translatedQuote !== quote.text) {
          originalQuoteBtn.style.display = 'inline-block';
          originalQuoteBtn.textContent = '🌐';
          originalQuoteBtn.title = 'Tieni premuto per vedere la lingua originale';
          originalQuoteBtn.translatedText = `"${translatedQuote}" — ${quote.author}`;
          originalQuoteBtn.originalText = `"${quote.text}" — ${quote.author}`;
        } else {
          originalQuoteBtn.style.display = 'none';
        }
      }
      
      console.log(`✅ ${quoteServices[i].name} success:`, { 
        original: quote.text, 
        translated: translatedQuote, 
        author: quote.author,
        lang: selectedLang 
      });
      
      return;
      
    } catch (error) {
      console.warn(`❌ ${quoteServices[i].name} failed:`, error.message);
      
      if (i === quoteServices.length - 1) {
        document.getElementById("quote").textContent = "Impossibile caricare citazione al momento.";
        console.error('All quote services failed');
      }
    }
  }
}

async function getNewQuote() {
  currentQuote = null;
  loadQuote();
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
