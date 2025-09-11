// LeafByte Background Service Worker
// Handles emission calculations, data management, and notifications

// Constants for emission calculations
const CARBON_INTENSITY = {
  global: 475, // gCO2/kWh global average
  countries: {
    'US': 400,
    'DE': 350,
    'FR': 60,
    'NO': 20,
    'CN': 650,
    'IN': 700
  }
};

const ENERGY_PER_BYTE = 0.000006; // kWh per byte (average)
const BYTES_TO_CO2_FACTOR = CARBON_INTENSITY.global * ENERGY_PER_BYTE / 1000; // Convert to grams

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('LeafByte extension installed');
  
  // Set default settings
  await chrome.storage.local.set({
    settings: {
      carbonIntensity: CARBON_INTENSITY.global,
      country: 'global',
      thresholds: {
        page: 1.0, // grams CO2e per page
        daily: 20.0, // grams CO2e per day
        weekly: 140.0 // grams CO2e per week
      },
      notifications: true,
      gamification: true,
      adBlocking: false
    },
    stats: {
      totalEmissions: 0,
      totalPages: 0,
      dailyEmissions: 0,
      weeklyEmissions: 0,
      monthlyEmissions: 0,
      lastResetDaily: Date.now(),
      lastResetWeekly: Date.now(),
      lastResetMonthly: Date.now()
    },
    gamification: {
      points: 0,
      level: 1,
      badges: [],
      streak: 0,
      lastActiveDay: Date.now()
    }
  });
  
  // Set up periodic alarms
  chrome.alarms.create('dailyReset', { periodInMinutes: 1440 }); // 24 hours
  chrome.alarms.create('weeklyReset', { periodInMinutes: 10080 }); // 7 days
  chrome.alarms.create('monthlyReset', { periodInMinutes: 43200 }); // 30 days
});

// Handle tab updates for emission tracking
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    try {
      // Inject content script to calculate emissions
      await chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: calculatePageEmissions
      });
    } catch (error) {
      console.error('Error injecting script:', error);
    }
  }
});

// Function to be injected into pages for emission calculation
function calculatePageEmissions() {
  const BYTES_TO_CO2_FACTOR = 0.00000285; // Approximate conversion factor
  
  // Get performance entries
  const resources = performance.getEntriesByType('resource');
  const navigation = performance.getEntriesByType('navigation')[0];
  
  let totalBytes = 0;
  const resourceBreakdown = {
    html: 0,
    css: 0,
    javascript: 0,
    images: 0,
    videos: 0,
    fonts: 0,
    other: 0
  };
  
  // Calculate resource sizes
  resources.forEach(resource => {
    const size = resource.transferSize || resource.encodedBodySize || 0;
    totalBytes += size;
    
    // Categorize resources
    const url = resource.name;
    if (url.match(/\.(css)$/i)) {
      resourceBreakdown.css += size;
    } else if (url.match(/\.(js|jsx|ts|tsx)$/i)) {
      resourceBreakdown.javascript += size;
    } else if (url.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
      resourceBreakdown.images += size;
    } else if (url.match(/\.(mp4|webm|avi|mov)$/i)) {
      resourceBreakdown.videos += size;
    } else if (url.match(/\.(woff|woff2|ttf|otf)$/i)) {
      resourceBreakdown.fonts += size;
    } else if (resource.initiatorType === 'xmlhttprequest' || resource.initiatorType === 'fetch') {
      resourceBreakdown.other += size;
    } else {
      resourceBreakdown.html += size;
    }
  });
  
  // Add navigation size
  if (navigation) {
    const navSize = navigation.transferSize || navigation.encodedBodySize || 0;
    totalBytes += navSize;
    resourceBreakdown.html += navSize;
  }
  
  // Calculate CO2 emissions
  const emissions = totalBytes * BYTES_TO_CO2_FACTOR;
  
  // Send data to background script
  chrome.runtime.sendMessage({
    type: 'PAGE_EMISSIONS',
    data: {
      url: window.location.href,
      domain: window.location.hostname,
      totalBytes,
      emissions,
      resourceBreakdown,
      timestamp: Date.now()
    }
  });
}

// Handle messages from content scripts
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'PAGE_EMISSIONS') {
    await handlePageEmissions(message.data, sender.tab);
  } else if (message.type === 'GET_TAB_EMISSIONS') {
    const emissions = await getTabEmissions(sender.tab.id);
    sendResponse(emissions);
  }
  return true;
});

// Handle page emissions data
async function handlePageEmissions(data, tab) {
  try {
    // Store per-site data
    const siteData = await chrome.storage.local.get([`site_${data.domain}`]);
    const currentSiteData = siteData[`site_${data.domain}`] || {
      domain: data.domain,
      visits: 0,
      totalEmissions: 0,
      totalBytes: 0,
      lastVisit: 0,
      averageEmissions: 0
    };
    
    currentSiteData.visits += 1;
    currentSiteData.totalEmissions += data.emissions;
    currentSiteData.totalBytes += data.totalBytes;
    currentSiteData.lastVisit = data.timestamp;
    currentSiteData.averageEmissions = currentSiteData.totalEmissions / currentSiteData.visits;
    
    await chrome.storage.local.set({
      [`site_${data.domain}`]: currentSiteData
    });
    
    // Update global stats
    const stats = await chrome.storage.local.get(['stats']);
    const currentStats = stats.stats;
    
    currentStats.totalEmissions += data.emissions;
    currentStats.totalPages += 1;
    currentStats.dailyEmissions += data.emissions;
    currentStats.weeklyEmissions += data.emissions;
    currentStats.monthlyEmissions += data.emissions;
    
    await chrome.storage.local.set({ stats: currentStats });
    
    // Store current tab emissions
    await chrome.storage.session.set({
      [`tab_${tab.id}`]: {
        ...data,
        tabId: tab.id,
        title: tab.title
      }
    });
    
    // Check thresholds and send notifications
    await checkThresholds(data.emissions, currentStats);
    
    // Update gamification
    await updateGamification(data.emissions);
    
    // Update badge
    await updateBadge(tab.id, data.emissions);
    
  } catch (error) {
    console.error('Error handling page emissions:', error);
  }
}

// Check emission thresholds and trigger notifications
async function checkThresholds(pageEmissions, stats) {
  const settings = await chrome.storage.local.get(['settings']);
  const thresholds = settings.settings.thresholds;
  
  if (!settings.settings.notifications) return;
  
  // Check page threshold
  if (pageEmissions > thresholds.page) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'High Emission Page',
      message: `This page emitted ${pageEmissions.toFixed(2)}g CO2e (threshold: ${thresholds.page}g)`
    });
  }
  
  // Check daily threshold
  if (stats.dailyEmissions > thresholds.daily) {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Daily Emission Limit Exceeded',
      message: `Today's emissions: ${stats.dailyEmissions.toFixed(2)}g CO2e`
    });
  }
}

// Update gamification system
async function updateGamification(emissions) {
  const gamification = await chrome.storage.local.get(['gamification']);
  const current = gamification.gamification;
  
  // Award points for low emissions
  if (emissions < 0.5) {
    current.points += 10;
  } else if (emissions < 1.0) {
    current.points += 5;
  }
  
  // Check for level up
  const newLevel = Math.floor(current.points / 100) + 1;
  if (newLevel > current.level) {
    current.level = newLevel;
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Level Up!',
      message: `You've reached level ${newLevel}!`
    });
  }
  
  // Check for badges
  if (current.points >= 100 && !current.badges.includes('eco_warrior')) {
    current.badges.push('eco_warrior');
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'Badge Earned!',
      message: 'You earned the Eco Warrior badge!'
    });
  }
  
  await chrome.storage.local.set({ gamification: current });
}

// Update extension badge
async function updateBadge(tabId, emissions) {
  const badgeText = emissions < 1 ? emissions.toFixed(1) : Math.round(emissions).toString();
  const badgeColor = emissions < 0.5 ? '#4CAF50' : emissions < 1.0 ? '#FF9800' : '#F44336';
  
  chrome.action.setBadgeText({
    text: badgeText + 'g',
    tabId: tabId
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: badgeColor,
    tabId: tabId
  });
}

// Handle alarms for resetting counters
chrome.alarms.onAlarm.addListener(async (alarm) => {
  const stats = await chrome.storage.local.get(['stats']);
  const currentStats = stats.stats;
  
  switch (alarm.name) {
    case 'dailyReset':
      currentStats.dailyEmissions = 0;
      currentStats.lastResetDaily = Date.now();
      break;
    case 'weeklyReset':
      currentStats.weeklyEmissions = 0;
      currentStats.lastResetWeekly = Date.now();
      break;
    case 'monthlyReset':
      currentStats.monthlyEmissions = 0;
      currentStats.lastResetMonthly = Date.now();
      break;
  }
  
  await chrome.storage.local.set({ stats: currentStats });
});

// Get emissions for specific tab
async function getTabEmissions(tabId) {
  const tabData = await chrome.storage.session.get([`tab_${tabId}`]);
  return tabData[`tab_${tabId}`] || null;
}

// Export data functionality
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.type === 'EXPORT_DATA') {
    const allData = await chrome.storage.local.get();
    const exportData = {
      stats: allData.stats,
      settings: allData.settings,
      gamification: allData.gamification,
      sites: {}
    };
    
    // Collect site data
    Object.keys(allData).forEach(key => {
      if (key.startsWith('site_')) {
        exportData.sites[key] = allData[key];
      }
    });
    
    sendResponse(exportData);
  }
  return true;
});