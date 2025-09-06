chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("dailyRefresh", { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "dailyRefresh") {
    // Controlla se è passato un giorno dall'ultimo refresh
    const result = await chrome.storage.sync.get(['dailyRefreshAt']);
    const lastRefresh = result.dailyRefreshAt || 0;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24 ore in millisecondi
    
    if (now - lastRefresh >= oneDay) {
      // È passato almeno un giorno, cambia lo sfondo
      await changeBackground();
      chrome.storage.sync.set({ dailyRefreshAt: now });
    }
  }
});

async function changeBackground() {
  try {
    // Usa Unsplash per ottenere una nuova foto casuale
    const response = await fetch('https://source.unsplash.com/1920x1080/?nature,landscape');
    const imageUrl = response.url;
    
    // Salva l'URL dello sfondo
    await chrome.storage.sync.set({ backgroundUrl: imageUrl });
    
    console.log('Background changed to:', imageUrl);
  } catch (error) {
    console.error('Error changing background:', error);
  }
}