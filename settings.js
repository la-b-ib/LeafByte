// Update settings with user preferences
export function updateSettings(key, value) {
    localStorage.setItem(key, value);
  }
  
  // Get user settings
  export function getSettings(key) {
    return localStorage.getItem(key);
  }
  
  // Handle notification preferences
  export function toggleNotifications(isEnabled) {
    localStorage.setItem('notificationsEnabled', isEnabled);
  }
  
  // Handle accent color change
  export function updateAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color);
  }
  
  export function setLanguage(languageCode) {
    localStorage.setItem('language', languageCode);
  }
  