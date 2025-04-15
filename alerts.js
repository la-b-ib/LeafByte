function showAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert');
    alertBox.textContent = message;
  
    document.body.appendChild(alertBox);
  
    setTimeout(() => {
      alertBox.remove();
    }, 5000);
  }
  
  function showCarbonAlert(emissions) {
    if (emissions > 10) {
      showAlert(`Warning: Your carbon footprint for this session is high: ${emissions} kg CO2!`);
    }
  }
  
  export function setupAlerts(data) {
    const emissions = calculateCarbonFootprint(data.usage).emissions;
    showCarbonAlert(emissions);
  }
  