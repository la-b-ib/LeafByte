// This script will run on every page the user visits, analyzing data usage
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getDataUsage') {
      const dataUsage = calculateDataUsage(window.performance);
      sendResponse({ dataUsage });
    }
  });
  
  function calculateDataUsage(performance) {
    const bytesTransferred = performance.getEntriesByType('resource').reduce((total, entry) => total + entry.transferSize, 0);
    return (bytesTransferred / (1024 * 1024)).toFixed(2); // Convert bytes to MB
  }
  