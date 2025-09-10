// Storage utilities for Chrome extension and localStorage fallback
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

// Export for ES6 modules or make global
if (typeof window !== 'undefined') {
  window.StorageUtils = { save, load };
  window.save = save;
  window.load = load;
}
