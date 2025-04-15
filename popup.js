// Function to toggle between dark and light theme
function toggleTheme() {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme); // Save user preference
  }
  
  // Function to toggle notifications
  function toggleNotifications(isEnabled) {
    localStorage.setItem('notificationsEnabled', isEnabled);
    if (isEnabled) {
      showAlert('Notifications Enabled!');
    } else {
      showAlert('Notifications Disabled!');
    }
  }
  
  // Function to update the accent color
  function updateAccentColor(color) {
    document.documentElement.style.setProperty('--accent-color', color);
    localStorage.setItem('accentColor', color); // Save user preference
  }
  
  // Function to show an alert message
  function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert');
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    setTimeout(() => {
      alertBox.remove();
    }, 3000); // Remove the alert after 3 seconds
  }
  
  // Function to calculate and display the carbon footprint
  function displayCarbonFootprint() {
    const dataUsageMB = 500; // Example value, you can dynamically calculate this based on user data
    const result = calculateCarbonFootprint(dataUsageMB);
  
    const carbonDataDiv = document.getElementById('carbonData');
    carbonDataDiv.innerHTML = `
      <p><strong>Data Usage:</strong> ${result.dataUsageMB} MB</p>
      <p><strong>Energy Consumed:</strong> ${result.energyConsumed} kWh</p>
      <p><strong>Carbon Emissions:</strong> ${result.emissions} kg CO2</p>
      <p><strong>Equivalent to:</strong> ${result.equivalentKmDriven} km driven by car</p>
      <p><strong>Equivalent to:</strong> ${result.treeEquivalent} trees planted</p>
    `;
  }
  
  // Load the saved preferences on page load
  window.onload = function() {
    // Apply theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
  
    // Apply accent color from localStorage
    const savedAccentColor = localStorage.getItem('accentColor') || '#4CAF50';
    updateAccentColor(savedAccentColor);
  
    // Load notification status from localStorage
    const notificationsEnabled = JSON.parse(localStorage.getItem('notificationsEnabled') || 'true');
    document.getElementById('notificationsToggle').checked = notificationsEnabled;
  
    // Display carbon footprint data
    displayCarbonFootprint();
  };
  
  