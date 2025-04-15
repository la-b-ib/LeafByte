function setUserPreferences(preferences) {
    localStorage.setItem('preferences', JSON.stringify(preferences));
  }
  
  function getUserPreferences() {
    return JSON.parse(localStorage.getItem('preferences')) || {};
  }
  