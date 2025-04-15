export const themes = {
    light: {
      '--background-color': '#ffffff',
      '--text-color': '#333333',
      '--accent-color': '#4CAF50'
    },
    dark: {
      '--background-color': '#333333',
      '--text-color': '#ffffff',
      '--accent-color': '#00BCD4'
    }
  };
  
  export function applyTheme(theme) {
    const root = document.documentElement;
    const selectedTheme = themes[theme] || themes.light;
    Object.keys(selectedTheme).forEach(key => {
      root.style.setProperty(key, selectedTheme[key]);
    });
  }
  
  export function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }
  