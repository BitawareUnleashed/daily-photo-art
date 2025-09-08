chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("dailyRefresh", { periodInMinutes: 1 });
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "dailyRefresh") {
    // Check if a day has passed since last refresh
    const result = await chrome.storage.sync.get(['dailyRefreshAt']);
    const lastRefresh = result.dailyRefreshAt || 0;
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    if (now - lastRefresh >= oneDay) {
      // At least one day has passed, change the background
      await changeBackground();
      chrome.storage.sync.set({ dailyRefreshAt: now });
    }
  }
});

async function changeBackground() {
  try {
    // Use Unsplash to get a new random photo
    const response = await fetch('https://source.unsplash.com/1920x1080/?nature,landscape');
    const imageUrl = response.url;
    
    // Save the background URL
    await chrome.storage.sync.set({ backgroundUrl: imageUrl });
    
    console.log('Background changed to:', imageUrl);
  } catch (error) {
    console.error('Error changing background:', error);
  }
}