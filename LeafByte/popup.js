// LeafByte Popup Dashboard JavaScript
// Handles dashboard functionality, charts, and user interactions

class LeafByteDashboard {
  constructor() {
    console.log('LeafByte: Dashboard constructor called');
    this.currentTab = 'overview';
    this.charts = {};
    this.data = {
      stats: null,
      settings: null,
      gamification: null,
      currentPage: null,
      sites: []
    };
    
    this.init();
  }
  
  async init() {
    try {
      await this.loadData();
      this.setupEventListeners();
      this.renderDashboard();
      this.setupCharts();
    } catch (error) {
      console.error('Error initializing LeafByte dashboard:', error);
      // Show error message to user
      const container = document.body;
      if (container) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'padding: 20px; text-align: center; color: #e74c3c;';
        errorDiv.innerHTML = '<p>Error loading dashboard. Please refresh the extension.</p>';
        container.appendChild(errorDiv);
      }
    }
  }
  
  async loadData() {
    try {
      // Load data from storage
      const result = await chrome.storage.local.get(['stats', 'settings', 'gamification']);
      this.data.stats = result.stats || this.getDefaultStats();
      this.data.settings = result.settings || this.getDefaultSettings();
      this.data.gamification = result.gamification || this.getDefaultGamification();
      
      // Get current tab emissions
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab) {
        this.data.currentPage = await this.getCurrentPageEmissions(tab.id);
      }
      
      // Load site data
      await this.loadSiteData();
      
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }
  
  async getCurrentPageEmissions(tabId) {
    try {
      const result = await chrome.storage.session.get([`tab_${tabId}`]);
      return result[`tab_${tabId}`] || null;
    } catch (error) {
      console.error('Error getting current page emissions:', error);
      return null;
    }
  }
  
  async loadSiteData() {
    try {
      const allData = await chrome.storage.local.get();
      this.data.sites = [];
      
      Object.keys(allData).forEach(key => {
        if (key.startsWith('site_')) {
          this.data.sites.push(allData[key]);
        }
      });
      
      // Sort by total emissions
      this.data.sites.sort((a, b) => b.totalEmissions - a.totalEmissions);
    } catch (error) {
      console.error('Error loading site data:', error);
    }
  }
  
  setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.switchTab(e.target.dataset.tab);
      });
    });

    // Action buttons - check if elements exist
    const exportBtn = document.getElementById('exportBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    
    if (exportBtn) exportBtn.addEventListener('click', () => this.exportData());
    if (settingsBtn) settingsBtn.addEventListener('click', () => this.openSettings());
    if (refreshBtn) refreshBtn.addEventListener('click', () => this.refresh());

    // Filter controls - check if elements exist
    const emissionFilter = document.getElementById('emissionFilter');
    const sortBy = document.getElementById('sortBy');
    
    if (emissionFilter) emissionFilter.addEventListener('change', () => this.filterSites());
    if (sortBy) sortBy.addEventListener('change', () => this.filterSites());
  }  switchTab(tabName) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update active tab content
    document.querySelectorAll('.tab-content').forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(tabName).classList.add('active');
    
    this.currentTab = tabName;
    
    // Render tab-specific content
    if (tabName === 'trends') {
      this.renderTrendsChart();
    } else if (tabName === 'sites') {
      this.renderSitesList();
    }
  }
  
  renderDashboard() {
    this.renderOverview();
    this.renderGoals();
    this.renderCurrentPage();
  }
  
  renderOverview() {
    const stats = this.data.stats;
    const gamification = this.data.gamification;
    
    // Update quick stats
    document.getElementById('todayEmissions').textContent = `${stats.dailyEmissions.toFixed(1)}g`;
    document.getElementById('weekEmissions').textContent = `${stats.weeklyEmissions.toFixed(1)}g`;
    document.getElementById('userLevel').textContent = gamification.level;
    
    // Update current emissions (from current page)
    if (this.data.currentPage) {
      document.getElementById('currentEmissions').textContent = this.data.currentPage.emissions.toFixed(1);
    }
    
    // Render eco tips
    this.renderEcoTips();
  }
  
  renderCurrentPage() {
    const currentPage = this.data.currentPage;
    
    if (!currentPage) {
      document.getElementById('currentPageUrl').textContent = 'No data available';
      document.getElementById('pageEmissions').textContent = '0.0g CO₂e';
      document.getElementById('pageStatus').textContent = 'Unknown';
      return;
    }
    
    // Update page info
    const url = new URL(currentPage.url);
    document.getElementById('currentPageUrl').textContent = url.hostname;
    document.getElementById('pageEmissions').textContent = `${currentPage.emissions.toFixed(1)}g CO₂e`;
    
    // Update page status
    const status = this.getEmissionStatus(currentPage.emissions);
    const statusElement = document.getElementById('pageStatus');
    statusElement.textContent = status.text;
    statusElement.className = `page-status ${status.class}`;
    
    // Render resource breakdown chart
    this.renderResourceChart();
  }
  
  renderResourceChart() {
    const canvas = document.getElementById('resourceChart');
    const ctx = canvas.getContext('2d');
    
    if (this.charts.resource) {
      this.charts.resource.destroy();
    }
    
    const currentPage = this.data.currentPage;
    if (!currentPage || !currentPage.resourceBreakdown) {
      return;
    }
    
    const breakdown = currentPage.resourceBreakdown;
    const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
    
    if (total === 0) return;
    
    const data = {
      labels: ['Images', 'JavaScript', 'CSS', 'HTML', 'Other'],
      datasets: [{
        data: [
          breakdown.images || 0,
          breakdown.javascript || 0,
          breakdown.css || 0,
          breakdown.html || 0,
          (breakdown.videos || 0) + (breakdown.fonts || 0) + (breakdown.other || 0)
        ],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF'
        ],
        borderWidth: 0
      }]
    };
    
    this.charts.resource = new Chart(ctx, {
      type: 'doughnut',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              fontSize: 10,
              padding: 10
            }
          }
        }
      }
    });
  }
  
  renderTrendsChart() {
    const canvas = document.getElementById('trendsChart');
    const ctx = canvas.getContext('2d');
    
    if (this.charts.trends) {
      this.charts.trends.destroy();
    }
    
    // Generate sample trend data (in real implementation, this would come from stored historical data)
    const days = 7;
    const labels = [];
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
      
      // Generate sample data based on current stats
      const dailyAvg = this.data.stats.weeklyEmissions / 7;
      const variation = (Math.random() - 0.5) * dailyAvg * 0.5;
      data.push(Math.max(0, dailyAvg + variation));
    }
    
    this.charts.trends = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Daily Emissions (g CO₂e)',
          data: data,
          borderColor: '#4CAF50',
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'CO₂e (grams)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });
    
    // Update trend stats
    const weeklyAvg = data.reduce((sum, val) => sum + val, 0) / data.length;
    const bestDay = Math.min(...data);
    
    document.getElementById('weeklyAverage').textContent = `${weeklyAvg.toFixed(1)}g`;
    document.getElementById('bestDay').textContent = `${bestDay.toFixed(1)}g`;
    document.getElementById('totalSaved').textContent = `${(weeklyAvg * 7 * 0.1).toFixed(1)}g`;
  }
  
  renderSitesList() {
    const container = document.getElementById('sites-grid');
    
    if (!container) {
      console.error('LeafByte: sites-grid container not found');
      return;
    }
    
    container.innerHTML = '';
    
    if (this.data.sites.length === 0) {
      container.innerHTML = '<div class="no-data">No site data available yet. Browse some websites to see their carbon impact!</div>';
      return;
    }
    
    this.data.sites.slice(0, 10).forEach(site => {
      const siteElement = document.createElement('div');
      siteElement.className = 'site-card';
      
      const status = this.getEmissionStatus(site.averageEmissions);
      const favicon = site.favicon || 'https://www.google.com/s2/favicons?domain=' + site.domain;
      
      siteElement.innerHTML = `
        <div class="site-favicon">
          <img src="${favicon}" alt="${site.domain}" onerror="this.style.display='none'">
        </div>
        <div class="site-details">
          <h4 class="site-name">${site.domain}</h4>
          <div class="site-stats">
            <span class="visits-count">${site.visits} visits</span>
            <span class="avg-emission">${site.averageEmissions.toFixed(2)}g avg</span>
          </div>
          <div class="emission-bar">
            <div class="emission-fill ${status.class}" style="width: ${Math.min((site.averageEmissions / 10) * 100, 100)}%"></div>
          </div>
        </div>
        <div class="site-emission ${status.class}">${site.totalEmissions.toFixed(1)}g</div>
      `;
      
      container.appendChild(siteElement);
    });
  }
  
  renderGoals() {
    const stats = this.data.stats;
    const settings = this.data.settings;
    const gamification = this.data.gamification;
    
    // Daily goal
    const dailyProgress = Math.min((stats.dailyEmissions / settings.thresholds.daily) * 100, 100);
    document.getElementById('dailyProgress').style.width = `${dailyProgress}%`;
    document.getElementById('dailyGoalTarget').textContent = `${settings.thresholds.daily}g CO₂e`;
    document.getElementById('dailyGoalStatus').textContent = 
      dailyProgress < 80 ? 'On track' : dailyProgress < 100 ? 'Close to limit' : 'Over limit';
    
    // Weekly goal
    const weeklyProgress = Math.min((stats.weeklyEmissions / settings.thresholds.weekly) * 100, 100);
    document.getElementById('weeklyProgress').style.width = `${weeklyProgress}%`;
    document.getElementById('weeklyGoalTarget').textContent = `${settings.thresholds.weekly}g CO₂e`;
    document.getElementById('weeklyGoalStatus').textContent = 
      weeklyProgress < 80 ? 'On track' : weeklyProgress < 100 ? 'Close to limit' : 'Over limit';
    
    // Gamification
    document.getElementById('currentLevel').textContent = gamification.level;
    document.getElementById('currentPoints').textContent = gamification.points;
    
    const levelProgress = (gamification.points % 100);
    document.getElementById('levelProgress').style.width = `${levelProgress}%`;
    
    // Render badges
    this.renderBadges();
  }
  
  renderBadges() {
    const container = document.getElementById('badgesList');
    const badges = this.data.gamification.badges;
    
    container.innerHTML = '';
    
    const availableBadges = [
      { id: 'eco_warrior', name: 'Eco Warrior', icon: 'eco', description: 'Reach 100 points' },
      { id: 'low_impact', name: 'Low Impact', icon: 'nature', description: '7 days under 10g' },
      { id: 'streak_master', name: 'Streak Master', icon: 'local_fire_department', description: '30-day streak' }
    ];
    
    availableBadges.forEach(badge => {
      const earned = badges.includes(badge.id);
      const badgeElement = document.createElement('div');
      badgeElement.className = `badge ${earned ? 'earned' : 'locked'}`;
      badgeElement.innerHTML = `
        <span class="badge-icon material-icons-round">${badge.icon}</span>
        <span class="badge-name">${badge.name}</span>
      `;
      badgeElement.title = badge.description;
      container.appendChild(badgeElement);
    });
  }
  
  renderEcoTips() {
    const container = document.getElementById('ecoTips');
    const tips = this.generateEcoTips();
    
    container.innerHTML = '';
    tips.forEach(tip => {
      const tipElement = document.createElement('div');
      tipElement.className = 'tip-item';
      tipElement.textContent = tip;
      container.appendChild(tipElement);
    });
  }
  
  generateEcoTips() {
    const tips = [];
    const stats = this.data.stats;
    const currentPage = this.data.currentPage;
    
    if (stats.dailyEmissions > 15) {
      tips.push('Consider using an ad blocker to reduce page emissions');
    }
    
    if (currentPage && currentPage.resourceBreakdown) {
      const breakdown = currentPage.resourceBreakdown;
      const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
      
      if (breakdown.images / total > 0.4) {
        tips.push('This page loads many images - try disabling auto-play media');
      }
      
      if (breakdown.javascript / total > 0.3) {
        tips.push('Heavy JavaScript detected - consider using reader mode');
      }
    }
    
    if (this.data.sites.length > 0) {
      const topSite = this.data.sites[0];
      if (topSite.averageEmissions > 1.0) {
        tips.push(`${topSite.domain} has high emissions - try visiting less frequently`);
      }
    }
    
    if (tips.length === 0) {
      tips.push('Great job! Your browsing has low environmental impact');
    }
    
    return tips.slice(0, 3);
  }
  
  setupCharts() {
    // Initial chart setup is done in render methods
    Chart.defaults.font.size = 11;
    Chart.defaults.font.family = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  }
  
  getEmissionStatus(emissions) {
    if (emissions < 0.5) {
      return { text: 'Low Impact', class: 'low' };
    } else if (emissions < 1.0) {
      return { text: 'Medium Impact', class: 'medium' };
    } else {
      return { text: 'High Impact', class: 'high' };
    }
  }
  
  filterSites() {
    const emissionFilter = document.getElementById('emissionFilter')?.value || 'all';
    const sortBy = document.getElementById('sortBy')?.value || 'emissions';
    
    let filteredSites = [...this.data.sites];
    
    // Filter by emission level
    if (emissionFilter !== 'all') {
      filteredSites = filteredSites.filter(site => {
        const status = this.getEmissionStatus(site.averageEmissions);
        return status.class === emissionFilter;
      });
    }
    
    // Sort by selected criteria
    if (sortBy === 'emissions') {
      filteredSites.sort((a, b) => b.totalEmissions - a.totalEmissions);
    } else if (sortBy === 'visits') {
      filteredSites.sort((a, b) => b.visits - a.visits);
    } else if (sortBy === 'alphabetical') {
      filteredSites.sort((a, b) => a.domain.localeCompare(b.domain));
    }
    
    // Temporarily store filtered data
    const originalSites = this.data.sites;
    this.data.sites = filteredSites;
    this.renderSitesList();
    this.data.sites = originalSites;
  }
  
  async exportData() {
    try {
      const response = await chrome.runtime.sendMessage({ type: 'EXPORT_DATA' });
      
      const dataStr = JSON.stringify(response, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `leafbyte-data-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  }
  
  openSettings() {
    chrome.runtime.openOptionsPage();
  }
  
  async refresh() {
    await this.loadData();
    this.renderDashboard();
    
    if (this.currentTab === 'trends') {
      this.renderTrendsChart();
    } else if (this.currentTab === 'sites') {
      this.renderSitesList();
    }
  }
  
  getDefaultStats() {
    return {
      totalEmissions: 0,
      totalPages: 0,
      dailyEmissions: 0,
      weeklyEmissions: 0,
      monthlyEmissions: 0,
      lastResetDaily: Date.now(),
      lastResetWeekly: Date.now(),
      lastResetMonthly: Date.now()
    };
  }
  
  getDefaultSettings() {
    return {
      carbonIntensity: 475,
      country: 'global',
      thresholds: {
        page: 1.0,
        daily: 20.0,
        weekly: 140.0
      },
      notifications: true,
      gamification: true,
      adBlocking: false
    };
  }
  
  getDefaultGamification() {
    return {
      points: 0,
      level: 1,
      badges: [],
      streak: 0,
      lastActiveDay: Date.now()
    };
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('LeafByte: DOM loaded, initializing dashboard...');
  try {
    new LeafByteDashboard();
    console.log('LeafByte: Dashboard initialized successfully');
  } catch (error) {
    console.error('LeafByte: Failed to initialize dashboard:', error);
  }
});