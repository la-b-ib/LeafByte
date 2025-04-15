export const MaterialIcons = {
    eco: '\uE335',         // Eco Icon
    analytics: '\uE92F',   // Analytics Icon
    leaderboard: '\uF20C', // Leaderboard Icon
    settings: '\uE8B8',    // Settings Icon
    notifications: '\uE7F4', // Notifications Icon
    palette: '\uE40A'      // Palette Icon
  };
  
  export function createIcon(iconName) {
    const icon = document.createElement('span');
    icon.classList.add('material-icon');
    icon.textContent = MaterialIcons[iconName] || '';
    return icon;
  }
  
  export function addIconToElement(element, iconName) {
    const icon = createIcon(iconName);
    element.appendChild(icon);
  }
  