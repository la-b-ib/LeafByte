function showNotification(message) {
    new Notification("LeafByte Notification", {
      body: message,
      icon: "icon.png"
    });
  }
  
  chrome.runtime.onInstalled.addListener(() => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        showNotification("Welcome to LeafByte!");
      }
    });
  });
  