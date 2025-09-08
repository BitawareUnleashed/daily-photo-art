// Focus management functionality
function initializeFocus() {
  const focusEl = document.getElementById("focus");
  const focusDisplay = document.getElementById("focus-display");
  
  if (!focusEl || !focusDisplay) return;

  // Get max length from HTML element or default to 16
  const maxLength = parseInt(focusEl.getAttribute('maxlength')) || 16;

  // Function to format display text with ellipsis if needed
  function formatDisplayText(text) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }

  load("focus").then(v => { 
    if (v) {
      focusEl.style.display = 'none';
      focusDisplay.textContent = formatDisplayText(v);
      focusDisplay.title = v; // Show full text on hover
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
        focusDisplay.textContent = formatDisplayText(value);
        focusDisplay.title = value; // Show full text on hover
        focusDisplay.style.display = 'block';
      }
    }
  });

  // Add input event to limit characters in real-time
  focusEl.addEventListener("input", (e) => {
    if (e.target.value.length > maxLength) {
      e.target.value = e.target.value.substring(0, maxLength);
    }
  });

  focusEl.addEventListener("blur", async () => {
    const value = focusEl.value.trim();
    if (!value) {
      await save("focus", "");
      focusDisplay.style.display = 'none';
      focusEl.style.display = 'block';
    }
  });

  focusDisplay.addEventListener("click", () => {
    focusEl.style.display = 'block';
    // Get the full text from storage, not the potentially truncated display text
    load("focus").then(fullText => {
      focusEl.value = fullText || '';
      focusEl.focus();
      focusDisplay.style.display = 'none';
    });
  });
}

// Export for global access
if (typeof window !== 'undefined') {
  window.FocusUtils = { initializeFocus };
}

// Initialize focus functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeFocus();
});
