/**
 * Clock management module
 * Handles time display functionality only
 */

/**
 * Update clock display with current time (CSS handles colon blink)
 */
function tickClock() {
  const el = document.getElementById("clock");
  if (el) {
    const hoursEl = el.querySelector(".clock-hours");
    const minutesEl = el.querySelector(".clock-minutes");
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    if (hoursEl && hoursEl.textContent !== hours) {
      hoursEl.textContent = hours;
    }
    if (minutesEl && minutesEl.textContent !== minutes) {
      minutesEl.textContent = minutes;
    }
    // Colon blink is handled by CSS animation only
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  window.ClockUtils = { 
    tickClock
  };
}
