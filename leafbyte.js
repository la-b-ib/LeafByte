// ====== CORE CONSTANTS ======
const ENERGY_FACTORS = {
  wifi: 0.0038, 
  ethernet: 0.0035, 
  '4g': 0.0065, 
  '5g': 0.0058, 
  '3g': 0.0082
};

const CARBON_INTENSITY = {
  global: 0.379, // kg CO2/kWh (global average)
  renewable: 0.05, // kg CO2/kWh (renewable energy)
  coal: 0.82, // kg CO2/kWh (coal-based)
};

const EQUIVALENCIES = {
  car: 0.192,    // kg CO2 per km
  tree: 21.77,   // kg CO2 per tree per year
  smartphone: 0.085, // kg CO2 per smartphone charge
  flight: 0.115, // kg CO2 per km (short-haul flight)
  beef: 26.0    // kg CO2 per kg of beef
};

const ECO_TIPS = [
  "Stream videos at 480p instead of 1080p to reduce data usage by up to 70%",
  "Use dark mode on OLED screens to reduce energy consumption by up to 40%",
  "Close unused tabs - each open tab consumes memory and energy",
  "Enable data saver in your browser settings to compress web pages",
  "Use ad blockers - ads can account for over 50% of page data",
  "Prefer text-based sites over media-heavy pages when possible",
  "Disable auto-play videos on social media platforms",
  "Download content instead of streaming when you'll view it multiple times",
  "Use progressive web apps (PWAs) instead of websites when available",
  "Schedule large downloads during off-peak energy hours"
];

const ENERGY_SOURCES = {
  'global': 'Global Average',
  'renewable': 'Renewable Energy',
  'coal': 'Coal-based'
};

// ====== STATE MANAGEMENT ======
const DEFAULT_STATE = {
  todayData: 0, 
  todayCO2: 0, 
  weekData: Array(7).fill(0),
  weekCO2: Array(7).fill(0),
  monthData: Array(30).fill(0),
  monthCO2: Array(30).fill(0),
  theme: 'light',
  history: [], 
  settings: { 
    notifications: true,
    networkType: 'wifi',
    energySource: 'global',
    dataLimit: 500, // MB
    co2Limit: 0.5, // kg
    darkModeSchedule: null,
    installedDate: new Date().toISOString(),
    lastReset: new Date().toISOString()
  },
  achievements: {
    lowDataDay: false,
    ecoWarrior: false,
    darkModeMaster: false
  }
};

let state = {...DEFAULT_STATE};
let chart = null;
let currentTipIndex = 0;
let trackingEnabled = true;
let dataPoints = [];
let errorState = false;

// ====== ERROR HANDLING ======
class LeafByteError extends Error {
  constructor(message, severity = 'warning') {
    super(message);
    this.name = 'LeafByteError';
    this.severity = severity;
    this.timestamp = new Date().toISOString();
  }

  log() {
    console[this.severity](`[${this.timestamp}] ${this.name}: ${this.message}`);
  }
}

const handleError = (error, context = 'general') => {
  const lbError = new LeafByteError(
    `Error in ${context}: ${error.message}`,
    error.severity || 'error'
  );
  lbError.log();
  
  errorState = true;
  showErrorUI(lbError);
  
  if (context === 'critical') {
    disableTracking();
  }
  
  return lbError;
};

const showErrorUI = (error) => {
  try {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-state';
    errorElement.innerHTML = `
      <i class="material-icons-round">error</i>
      <p>${error.message}</p>
      <button id="dismissError">Dismiss</button>
    `;
    document.body.prepend(errorElement);
    
    document.getElementById('dismissError')?.addEventListener('click', () => {
      errorElement.remove();
      errorState = false;
    });
  } catch (uiError) {
    console.error('Failed to show error UI:', uiError);
  }
};

// ====== INITIALIZATION ======
async function init() {
  try {
    await loadState();
    setupPerformanceMonitoring();
    applyTheme(state.theme);
    setupEventListeners();
    setupIdleDetection();
    startTracking();
    showRandomTip();
    await initChart();
    checkAchievements();
    setupAutoReset();
    
    // Show loading state
    document.querySelectorAll('.stat-value').forEach(el => {
      el.classList.add('skeleton');
    });

    // Simulate initial data (replace with real tracking)
    setTimeout(() => {
      updateStats(Math.random() * 5000000 + 1000000);
      document.querySelectorAll('.stat-value').forEach(el => {
        el.classList.remove('skeleton');
      });
    }, 300);
    
    // Check for updates
    checkForUpdates();
  } catch (error) {
    handleError(error, 'initialization');
  }
}

// ====== STATE MANAGEMENT ======
async function loadState() {
  try {
    const data = await chrome.storage.local.get(['state']);
    if (data.state) {
      // Merge with default state to ensure all fields exist
      state = {
        ...DEFAULT_STATE,
        ...data.state,
        settings: {
          ...DEFAULT_STATE.settings,
          ...(data.state.settings || {})
        }
      };
      
      // Migration for new fields
      if (!state.settings.energySource) {
        state.settings.energySource = 'global';
      }
      
      // Ensure arrays are properly initialized
      if (!state.weekData || state.weekData.length !== 7) {
        state.weekData = Array(7).fill(0);
      }
      
      if (!state.monthData || state.monthData.length !== 30) {
        state.monthData = Array(30).fill(0);
      }
    }
  } catch (error) {
    throw handleError(error, 'loadState');
  }
}

async function saveState() {
  try {
    await chrome.storage.local.set({ state });
    
    // Sync with cloud if available
    if (chrome.storage.sync) {
      try {
        await chrome.storage.sync.set({ 
          settings: state.settings,
          achievements: state.achievements
        });
      } catch (syncError) {
        // Not critical if sync fails
        console.warn('Cloud sync failed:', syncError);
      }
    }
  } catch (error) {
    throw handleError(error, 'saveState');
  }
}

function resetDailyData() {
  state.history.push({
    date: new Date().toISOString(),
    data: state.todayData,
    co2: state.todayCO2
  });
  
  // Shift week data
  state.weekData.pop();
  state.weekData.unshift(state.todayData);
  state.weekCO2.pop();
  state.weekCO2.unshift(state.todayCO2);
  
  // Shift month data every 7 days (for demo purposes)
  if (state.history.length % 7 === 0) {
    state.monthData.pop();
    state.monthData.unshift(state.todayData);
    state.monthCO2.pop();
    state.monthCO2.unshift(state.todayCO2);
  }
  
  state.todayData = 0;
  state.todayCO2 = 0;
  state.settings.lastReset = new Date().toISOString();
  
  updateUI(calculateFootprint(0));
  saveState();
}

function setupAutoReset() {
  // Check if we need to reset (new day)
  const now = new Date();
  const lastReset = new Date(state.settings.lastReset);
  
  if (
    now.getDate() !== lastReset.getDate() ||
    now.getMonth() !== lastReset.getMonth() ||
    now.getFullYear() !== lastReset.getFullYear()
  ) {
    resetDailyData();
  }
  
  // Schedule next reset check
  const nextMidnight = new Date();
  nextMidnight.setHours(24, 0, 0, 0);
  const msUntilMidnight = nextMidnight - now;
  
  setTimeout(() => {
    resetDailyData();
    setupAutoReset(); // Reschedule
  }, msUntilMidnight);
}

// ====== CARBON CALCULATIONS ======
function calculateFootprint(dataMB, networkType = state.settings.networkType) {
  try {
    const energy = dataMB * (ENERGY_FACTORS[networkType] || ENERGY_FACTORS.wifi);
    const emissions = energy * (CARBON_INTENSITY[state.settings.energySource] || CARBON_INTENSITY.global);
    
    return {
      dataMB: parseFloat(dataMB.toFixed(2)),
      energy: parseFloat(energy.toFixed(4)),
      emissions: parseFloat(emissions.toFixed(4)),
      equivalents: {
        carKm: parseFloat((emissions / EQUIVALENCIES.car).toFixed(2)),
        trees: parseFloat((emissions / (EQUIVALENCIES.tree / 365)).toFixed(3)),
        smartphones: parseFloat((emissions / EQUIVALENCIES.smartphone).toFixed(1)),
        flightKm: parseFloat((emissions / EQUIVALENCIES.flight).toFixed(2)),
        beefKg: parseFloat((emissions / EQUIVALENCIES.beef).toFixed(3))
      },
      intensity: ENERGY_SOURCES[state.settings.energySource] || 'Global Average'
    };
  } catch (error) {
    throw handleError(error, 'calculateFootprint');
  }
}

// ====== TRACKING SYSTEM ======
function startTracking() {
  if (!trackingEnabled) return;
  
  try {
    // Track page loads
    if (chrome.webNavigation?.onCompleted) {
      chrome.webNavigation.onCompleted.addListener(trackPageLoad, {
        url: [{ schemes: ['http', 'https'] }]
      });
    } else {
      throw new LeafByteError('webNavigation API not available', 'warning');
    }
    
    // Track resource loads
    if (chrome.webRequest?.onCompleted) {
      chrome.webRequest.onCompleted.addListener(
        trackResource,
        { urls: ['<all_urls>'] },
        ['responseHeaders']
      );
    } else {
      throw new LeafByteError('webRequest API not available', 'warning');
    }
    
    // Track system idle state
    if (chrome.idle?.onStateChanged) {
      chrome.idle.onStateChanged.dispatch('active');
    }
    
    // Track new tab usage
    if (chrome.tabs?.onCreated) {
      chrome.tabs.onCreated.addListener(handleNewTab);
    }
  } catch (error) {
    throw handleError(error, 'startTracking');
  }
}

function disableTracking() {
  trackingEnabled = false;
  if (chrome.webNavigation?.onCompleted) {
    chrome.webNavigation.onCompleted.removeListener(trackPageLoad);
  }
  if (chrome.webRequest?.onCompleted) {
    chrome.webRequest.onCompleted.removeListener(trackResource);
  }
  console.warn('Tracking has been disabled due to errors');
}

function trackPageLoad(details) {
  if (!trackingEnabled) return;
  if (details.frameId !== 0) return; // Main frame only
  
  try {
    // Estimate page size (will be refined by resource tracking)
    const pageSize = Math.random() * 2000 + 500; // Simulate page size
    updateStats(pageSize);
  } catch (error) {
    handleError(error, 'trackPageLoad');
  }
}

function trackResource(details) {
  if (!trackingEnabled) return;
  
  try {
    const contentLength = details.responseHeaders?.find(h => 
      h.name.toLowerCase() === 'content-length')?.value || 0;
    
    if (contentLength > 0) {
      updateStats(parseInt(contentLength));
    }
  } catch (error) {
    handleError(error, 'trackResource');
  }
}

function handleNewTab(tab) {
  if (!trackingEnabled) return;
  
  try {
    // Small footprint for new tab
    updateStats(50000); // ~50KB estimate
  } catch (error) {
    handleError(error, 'handleNewTab');
  }
}

function updateStats(bytes) {
  if (!trackingEnabled) return;
  
  try {
    const dataMB = bytes / (1024 * 1024);
    state.todayData += dataMB;
    
    // Store data point for detailed analytics
    dataPoints.push({
      timestamp: Date.now(),
      bytes,
      url: 'current' // Would be actual URL in production
    });
    
    // Check limits
    checkLimits();
    
    const footprint = calculateFootprint(state.todayData);
    state.todayCO2 = footprint.emissions;
    
    updateUI(footprint);
    saveState();
  } catch (error) {
    handleError(error, 'updateStats');
  }
}

function checkLimits() {
  try {
    // Data limit check
    if (state.settings.dataLimit > 0 && 
        state.todayData > state.settings.dataLimit) {
      showNotification(
        'Data Limit Exceeded',
        `You've used ${state.todayData.toFixed(2)}MB today (limit: ${state.settings.dataLimit}MB)`
      );
    }
    
    // CO2 limit check
    if (state.settings.co2Limit > 0 && 
        state.todayCO2 > state.settings.co2Limit) {
      showNotification(
        'CO₂ Limit Exceeded',
        `You've emitted ${state.todayCO2.toFixed(3)}kg CO₂ today (limit: ${state.settings.co2Limit}kg)`
      );
    }
  } catch (error) {
    handleError(error, 'checkLimits');
  }
}

// ====== NOTIFICATIONS ======
function showNotification(title, message) {
  if (!state.settings.notifications) return;
  
  try {
    if (chrome.notifications?.create) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: title,
        message: message,
        priority: 1
      });
    } else {
      // Fallback to alert
      alert(`${title}\n${message}`);
    }
  } catch (error) {
    handleError(error, 'showNotification');
  }
}

// ====== CHART FUNCTIONS ======
async function initChart() {
  try {
    const ctx = document.getElementById('mainChart')?.getContext('2d');
    if (!ctx) {
      throw new LeafByteError('Chart canvas not found', 'warning');
    }
    
    if (chart) {
      chart.destroy();
    }
    
    // Load Chart.js if not available
    if (typeof Chart === 'undefined') {
      await loadChartJS();
    }
    
    chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Data (MB)', 'Energy (kWh)', 'CO₂ (kg)'],
        datasets: [{
          data: [0, 0, 0],
          backgroundColor: [
            'rgba(16, 185, 129, 0.9)',
            'rgba(59, 130, 246, 0.9)',
            'rgba(249, 115, 22, 0.9)'
          ],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 20,
              usePointStyle: true,
              pointStyle: 'circle',
              color: 'var(--text-primary)'
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.label || '';
                if (label) label += ': ';
                if (context.parsed !== null) {
                  label += context.parsed.toFixed(2);
                }
                return label;
              }
            },
            bodyFont: {
              family: 'Inter',
              size: 12
            }
          }
        }
      }
    });
  } catch (error) {
    throw handleError(error, 'initChart');
  }
}

async function loadChartJS() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = resolve;
    script.onerror = () => reject(new LeafByteError('Failed to load Chart.js'));
    document.head.appendChild(script);
  });
}

function updateChart(footprint) {
  try {
    if (!chart) {
      initChart();
      return;
    }
    
    chart.data.datasets[0].data = [
      footprint.dataMB,
      footprint.energy,
      footprint.emissions
    ];
    
    // Add source info to chart
    if (!chart.options.plugins.title) {
      chart.options.plugins.title = {
        display: true,
        text: `Energy Source: ${footprint.intensity}`,
        position: 'top',
        color: 'var(--text-secondary)',
        font: {
          family: 'Inter',
          size: 12
        }
      };
    } else {
      chart.options.plugins.title.text = `Energy Source: ${footprint.intensity}`;
    }
    
    chart.update();
  } catch (error) {
    handleError(error, 'updateChart');
  }
}

function changeChartType(type) {
  try {
    if (chart) {
      chart.config.type = type;
      
      // Adjust options for different chart types
      if (type === 'bar' || type === 'line') {
        chart.options.scales = {
          x: { grid: { display: false } },
          y: { 
            grid: { color: 'var(--border)' },
            ticks: { color: 'var(--text-secondary)' }
          }
        };
        chart.options.cutout = undefined;
      } else {
        chart.options.cutout = '72%';
        chart.options.scales = undefined;
      }
      
      chart.update();
    }
  } catch (error) {
    handleError(error, 'changeChartType');
  }
}

// ====== UI UPDATES ======
function updateUI(footprint) {
  try {
    // Update stats cards
    document.getElementById('todayData').textContent = `${footprint.dataMB.toFixed(2)} MB`;
    document.getElementById('todayCO2').textContent = `${footprint.emissions.toFixed(3)} kg`;
    document.getElementById('carKm').textContent = `${footprint.equivalents.carKm} km`;
    document.getElementById('treeDays').textContent = footprint.equivalents.trees;
    
    // Update chart
    updateChart(footprint);
    
    // Check for achievements
    checkAchievements();
  } catch (error) {
    handleError(error, 'updateUI');
  }
}

// ====== THEME MANAGEMENT ======
function applyTheme(theme) {
  try {
    document.documentElement.setAttribute('data-theme', theme);
    state.theme = theme;
    saveState();
    
    // Update theme toggle icon
    const themeIcon = document.getElementById('themeToggle')?.querySelector('i');
    if (themeIcon) {
      themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
    }
    
    // Update chart colors if exists
    if (chart) {
      chart.options.plugins.legend.labels.color = 'var(--text-primary)';
      chart.update();
    }
  } catch (error) {
    handleError(error, 'applyTheme');
  }
}

function toggleTheme() {
  try {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    
    // Achievement check
    if (newTheme === 'dark') {
      state.achievements.darkModeMaster = true;
      saveState();
    }
  } catch (error) {
    handleError(error, 'toggleTheme');
  }
}

function setupSystemThemeDetection() {
  try {
    if (window.matchMedia) {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleSystemThemeChange = (e) => {
        const newTheme = e.matches ? 'dark' : 'light';
        applyTheme(newTheme);
      };
      
      // Set initial theme
      handleSystemThemeChange(darkModeMediaQuery);
      
      // Listen for changes
      darkModeMediaQuery.addListener(handleSystemThemeChange);
    }
  } catch (error) {
    handleError(error, 'setupSystemThemeDetection');
  }
}

// ====== ECO TIPS ======
function showRandomTip() {
  try {
    const tipElement = document.getElementById('currentTip');
    if (tipElement) {
      tipElement.textContent = ECO_TIPS[currentTipIndex];
      currentTipIndex = (currentTipIndex + 1) % ECO_TIPS.length;
    }
  } catch (error) {
    handleError(error, 'showRandomTip');
  }
}

// ====== ACHIEVEMENTS ======
function checkAchievements() {
  try {
    // Low Data Day
    if (!state.achievements.lowDataDay && state.todayData < 100) {
      state.achievements.lowDataDay = true;
      showNotification(
        'Achievement Unlocked!',
        'Low Data Day: Used less than 100MB today'
      );
    }
    
    // Eco Warrior
    if (!state.achievements.ecoWarrior && state.todayCO2 < 0.1) {
      state.achievements.ecoWarrior = true;
      showNotification(
        'Achievement Unlocked!',
        'Eco Warrior: Emitted less than 0.1kg CO₂ today'
      );
    }
    
    saveState();
  } catch (error) {
    handleError(error, 'checkAchievements');
  }
}

// ====== BUTTON ACTIONS ======
async function exportData() {
  try {
    const data = {
      date: new Date().toISOString(),
      dataUsage: state.todayData,
      co2Emissions: state.todayCO2,
      equivalents: calculateFootprint(state.todayData).equivalents,
      settings: state.settings,
      history: state.history.slice(-30) // Last 30 days
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    if (chrome.downloads?.download) {
      await chrome.downloads.download({
        url: url,
        filename: `leafbyte-data-${new Date().toISOString().split('T')[0]}.json`,
        conflictAction: 'uniquify'
      });
    } else {
      // Fallback for browsers without downloads API
      const a = document.createElement('a');
      a.href = url;
      a.download = `leafbyte-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    }
  } catch (error) {
    handleError(error, 'exportData');
  }
}

function offsetFootprint() {
  try {
    const cost = (state.todayCO2 * 0.02).toFixed(2); // $0.02 per kg CO2
    const confirmed = confirm(
      `Offset ${state.todayCO2.toFixed(3)}kg CO₂ for ~$${cost}?\n` +
      `This will redirect you to our carbon offset partner.`
    );
    
    if (confirmed) {
      // In a real extension, this would redirect to a partner site
      showNotification(
        'Redirection',
        'Would redirect to carbon offset partner in production'
      );
    }
  } catch (error) {
    handleError(error, 'offsetFootprint');
  }
}

function showInsights() {
  try {
    // In a real extension, this would show detailed insights
    const footprint = calculateFootprint(state.todayData);
    const insights = [
      `🌍 Your digital activity today is equivalent to:`,
      `🚗 Driving ${footprint.equivalents.carKm} km in a car`,
      `✈️ Flying ${footprint.equivalents.flightKm} km on a short-haul flight`,
      `🍖 Producing ${footprint.equivalents.beefKg} kg of beef`,
      `🌳 Requiring ${footprint.equivalents.trees} trees to absorb`
    ].join('\n\n');
    
    alert(insights);
  } catch (error) {
    handleError(error, 'showInsights');
  }
}

function showGoals() {
  try {
    const newLimit = prompt(
      'Set daily data limit (MB):',
      state.settings.dataLimit
    );
    
    if (newLimit !== null && !isNaN(newLimit) {
      state.settings.dataLimit = parseFloat(newLimit);
      saveState();
      showNotification('Goal Updated', `Daily data limit set to ${newLimit}MB`);
    }
  } catch (error) {
    handleError(error, 'showGoals');
  }
}

function showHistory() {
  try {
    // In a real extension, this would show a detailed history view
    const lastWeekData = state.weekData.reduce((a, b) => a + b, 0);
    const lastWeekCO2 = state.weekCO2.reduce((a, b) => a + b, 0);
    const avgDaily = lastWeekData / 7;
    
    alert(
      `📊 Last Week Summary:\n\n` +
      `Total Data: ${lastWeekData.toFixed(2)} MB\n` +
      `Total CO₂: ${lastWeekCO2.toFixed(3)} kg\n` +
      `Daily Avg: ${avgDaily.toFixed(2)} MB\n\n` +
      `(Full history available in exported data)`
    );
  } catch (error) {
    handleError(error, 'showHistory');
  }
}

function showSettings() {
  try {
    const newNetwork = prompt(
      'Set network type (wifi, 4g, 5g, 3g, ethernet):',
      state.settings.networkType
    );
    
    if (newNetwork && ENERGY_FACTORS[newNetwork.toLowerCase()]) {
      state.settings.networkType = newNetwork.toLowerCase();
      saveState();
      showNotification(
        'Settings Updated',
        `Network type set to ${newNetwork.toUpperCase()}`
      );
    }
    
    const newEnergy = prompt(
      'Set energy source (global, renewable, coal):',
      state.settings.energySource
    );
    
    if (newEnergy && CARBON_INTENSITY[newEnergy.toLowerCase()]) {
      state.settings.energySource = newEnergy.toLowerCase();
      saveState();
      showNotification(
        'Settings Updated',
        `Energy source set to ${ENERGY_SOURCES[newEnergy.toLowerCase()] || newEnergy}`
      );
      // Recalculate with new source
      updateUI(calculateFootprint(state.todayData));
    }
  } catch (error) {
    handleError(error, 'showSettings');
  }
}

// ====== PERFORMANCE MONITORING ======
function setupPerformanceMonitoring() {
  try {
    // Track memory usage
    setInterval(() => {
      if (chrome.system?.memory) {
        chrome.system.memory.getInfo((info) => {
          if (info.availableCapacity / info.capacity < 0.2) {
            showNotification(
              'High Memory Usage',
              'Your device is running low on memory. Consider closing some tabs.'
            );
          }
        });
      }
    }, 60000); // Check every minute
  } catch (error) {
    handleError(error, 'setupPerformanceMonitoring');
  }
}

function setupIdleDetection() {
  try {
    if (chrome.idle?.onStateChanged) {
      chrome.idle.onStateChanged.addListener((newState) => {
        if (newState === 'idle') {
          // Reduce tracking when idle
          trackingEnabled = false;
        } else if (newState === 'active') {
          trackingEnabled = true;
        }
      });
    }
  } catch (error) {
    handleError(error, 'setupIdleDetection');
  }
}

// ====== UPDATE CHECK ======
function checkForUpdates() {
  try {
    if (chrome.runtime?.requestUpdateCheck) {
      chrome.runtime.requestUpdateCheck((status) => {
        if (status === 'update_available') {
          showNotification(
            'Update Available',
            'A new version of LeafByte is available. Restart Chrome to update.'
          );
        }
      });
    }
  } catch (error) {
    handleError(error, 'checkForUpdates');
  }
}

// ====== EVENT LISTENERS ======
function setupEventListeners() {
  try {
    // Theme toggle
    document.getElementById('themeToggle')?.addEventListener('click', toggleTheme);
    
    // Next tip button
    document.getElementById('nextTip')?.addEventListener('click', showRandomTip);
    
    // Chart type buttons
    document.querySelectorAll('.chart-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.chart-tab').forEach(t => 
          t.classList.remove('active')
        );
        tab.classList.add('active');
        changeChartType(tab.dataset.chart);
      });
    });
    
    // Action buttons
    document.getElementById('exportBtn')?.addEventListener('click', exportData);
    document.getElementById('offsetBtn')?.addEventListener('click', offsetFootprint);
    document.getElementById('insightsBtn')?.addEventListener('click', showInsights);
    document.getElementById('goalsBtn')?.addEventListener('click', showGoals);
    document.getElementById('historyBtn')?.addEventListener('click', showHistory);
    document.getElementById('settingsBtn')?.addEventListener('click', showSettings);
    
    // System theme detection
    setupSystemThemeDetection();
  } catch (error) {
    handleError(error, 'setupEventListeners');
  }
}

// ====== STARTUP ======
if (typeof chrome !== 'undefined' && chrome.storage) {
  document.addEventListener('DOMContentLoaded', init);
} else {
  handleError(new LeafByteError('Chrome extension API not available', 'critical'));
}