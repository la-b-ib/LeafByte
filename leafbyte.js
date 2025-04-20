// ====== CORE CONSTANTS ======
const ENERGY_FACTORS = {
  wifi: 0.0038, 
  ethernet: 0.0035, 
  '4g': 0.0065, 
  '5g': 0.0058, 
  '3g': 0.0082
};
const CARBON_INTENSITY = 0.379; // kg CO2/kWh
const EQUIVALENCIES = {
  car: 0.192,    // kg CO2 per km
  tree: 21.77,   // kg CO2 per tree per year
  smartphone: 0.085 // kg CO2 per smartphone charge
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

// ====== STATE MANAGEMENT ======
let state = {
  todayData: 0, 
  todayCO2: 0, 
  theme: 'light',
  history: [], 
  settings: { 
    notifications: true,
    networkType: 'wifi'
  }
};

// Chart instance
let chart = null;

// ====== INITIALIZATION ======
async function init() {
  await loadState();
  applyTheme(state.theme);
  setupEventListeners();
  startTracking();
  showRandomTip();
  initChart();
  
  // Simulate initial data
  setTimeout(() => {
    updateStats(Math.random() * 5000000 + 1000000);
  }, 300);
}

// Load state from storage
async function loadState() {
  try {
    const data = await chrome.storage.local.get(['state']);
    if (data.state) {
      state = { ...state, ...data.state };
    }
  } catch (error) {
    console.error("Failed to load state:", error);
  }
}

// Save state to storage
async function saveState() {
  try {
    await chrome.storage.local.set({ state });
  } catch (error) {
    console.error("Failed to save state:", error);
  }
}

// ====== CARBON CALCULATIONS ======
function calculateFootprint(dataMB, networkType = state.settings.networkType) {
  const energy = dataMB * (ENERGY_FACTORS[networkType] || ENERGY_FACTORS.wifi);
  const emissions = energy * CARBON_INTENSITY;
  
  return {
    dataMB: parseFloat(dataMB.toFixed(2)),
    energy: parseFloat(energy.toFixed(4)),
    emissions: parseFloat(emissions.toFixed(4)),
    equivalents: {
      carKm: parseFloat((emissions / EQUIVALENCIES.car).toFixed(2)),
      trees: parseFloat((emissions / (EQUIVALENCIES.tree / 365)).toFixed(3)), // Daily equivalent
      smartphones: parseFloat((emissions / EQUIVALENCIES.smartphone).toFixed(1))
    }
  };
}

// ====== TRACKING SYSTEM ======
function startTracking() {
  try {
    // Track page loads
    chrome.webNavigation?.onCompleted?.addListener(trackPageLoad, {
      url: [{ schemes: ['http', 'https'] }]
    });
    
    // Track resource loads
    chrome.webRequest?.onCompleted?.addListener(
      trackResource,
      { urls: ['<all_urls>'] },
      ['responseHeaders']
    );
  } catch (error) {
    console.error("Tracking initialization failed:", error);
  }
}

function trackPageLoad(details) {
  if (details.frameId === 0) { // Main frame only
    const pageSize = Math.random() * 2000 + 500; // Simulate page size
    updateStats(pageSize);
  }
}

function trackResource(details) {
  const contentLength = details.responseHeaders?.find(h => 
    h.name.toLowerCase() === 'content-length')?.value || 0;
  
  if (contentLength > 0) {
    updateStats(parseInt(contentLength));
  }
}

function updateStats(bytes) {
  const dataMB = bytes / (1024 * 1024);
  state.todayData += dataMB;
  const footprint = calculateFootprint(state.todayData);
  state.todayCO2 = footprint.emissions;
  
  updateUI(footprint);
  saveState();
}

// ====== CHART FUNCTIONS ======
function initChart() {
  const ctx = document.getElementById('mainChart').getContext('2d');
  
  if (chart) {
    chart.destroy();
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
}

function updateChart(footprint) {
  if (!chart) initChart();
  
  chart.data.datasets[0].data = [
    footprint.dataMB,
    footprint.energy,
    footprint.emissions
  ];
  
  chart.update();
}

function changeChartType(type) {
  if (chart) {
    chart.config.type = type;
    chart.update();
  }
}

// ====== UI UPDATES ======
function updateUI(footprint) {
  // Update stats cards
  document.getElementById('todayData').textContent = `${footprint.dataMB.toFixed(2)} MB`;
  document.getElementById('todayCO2').textContent = `${footprint.emissions.toFixed(3)} kg`;
  document.getElementById('carKm').textContent = `${footprint.equivalents.carKm} km`;
  document.getElementById('treeDays').textContent = footprint.equivalents.trees;
  
  // Update chart
  updateChart(footprint);
}

// ====== THEME MANAGEMENT ======
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  state.theme = theme;
  saveState();
  
  // Update theme toggle icon
  const themeIcon = document.getElementById('themeToggle').querySelector('i');
  themeIcon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
}

function toggleTheme() {
  const newTheme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme(newTheme);
}

// ====== ECO TIPS ======
let currentTipIndex = 0;

function showRandomTip() {
  const tipElement = document.getElementById('currentTip');
  if (tipElement) {
    tipElement.textContent = ECO_TIPS[currentTipIndex];
    currentTipIndex = (currentTipIndex + 1) % ECO_TIPS.length;
  }
}

// ====== BUTTON ACTIONS ======
function exportData() {
  const data = {
    date: new Date().toISOString(),
    dataUsage: state.todayData,
    co2Emissions: state.todayCO2,
    equivalents: calculateFootprint(state.todayData).equivalents
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  chrome.downloads.download({
    url: url,
    filename: `leafbyte-data-${new Date().toISOString().split('T')[0]}.json`,
    conflictAction: 'uniquify'
  });
}

function offsetFootprint() {
  const cost = (state.todayCO2 * 0.02).toFixed(2); // $0.02 per kg CO2
  alert(`Offsetting ${state.todayCO2.toFixed(3)} kg CO₂ would cost ~$${cost}\nRedirecting to carbon offset partner...`);
}

// ====== EVENT LISTENERS ======
function setupEventListeners() {
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
  
  // Other action buttons can be added here
  ['insightsBtn', 'goalsBtn', 'historyBtn', 'settingsBtn'].forEach(id => {
    document.getElementById(id)?.addEventListener('click', () => {
      console.log(`${id} clicked`); // Placeholder for future functionality
    });
  });
}

// Start the extension
if (typeof chrome !== 'undefined' && chrome.storage) {
  document.addEventListener('DOMContentLoaded', init);
} else {
  console.error('Chrome extension API not available');
}