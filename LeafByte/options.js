// LeafByte Settings Page JavaScript

class LeafByteSettings {
    constructor() {
        this.defaultSettings = {
            // General Settings
            showBadge: true,
            badgePosition: 'top-right',
            theme: 'auto',
            emissionUnits: 'grams',
            dateFormat: 'MM/DD/YYYY',
            
            // Emissions Settings
            location: 'global',
            customIntensity: 475,
            greenHosting: true,
            deviceFactor: 1.0,
            
            // Notifications Settings
            enableAlerts: true,
            highThreshold: 1.0,
            dailyAlerts: true,
            enableAchievements: true,
            achievementNotifications: true,
            
            // Privacy Settings
            storeHistory: true,
            enableSync: false,
            dataRetention: 90,
            
            // Advanced Settings
            enableAdBlock: false,
            calcFrequency: 5000,
            enableAudit: false,
            enableDebug: false
        };
        
        this.currentSettings = {};
        this.init();
    }
    
    async init() {
        await this.loadSettings();
        this.setupEventListeners();
        this.populateForm();
        this.updateDynamicElements();
    }
    
    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get('leafbyteSettings');
            this.currentSettings = { ...this.defaultSettings, ...result.leafbyteSettings };
        } catch (error) {
            console.error('Error loading settings:', error);
            this.currentSettings = { ...this.defaultSettings };
        }
    }
    
    async saveSettings() {
        try {
            await chrome.storage.sync.set({ leafbyteSettings: this.currentSettings });
            this.showMessage('Settings saved successfully!', 'success');
            
            // Notify background script of settings change
            chrome.runtime.sendMessage({
                type: 'SETTINGS_UPDATED',
                settings: this.currentSettings
            });
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showMessage('Error saving settings. Please try again.', 'error');
        }
    }
    
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchSection(e.target.dataset.section);
            });
        });
        
        // Form controls
        this.setupFormListeners();
        
        // Action buttons
        document.getElementById('saveSettings').addEventListener('click', () => {
            this.collectFormData();
            this.saveSettings();
        });
        
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportData();
        });
        
        document.getElementById('clearData').addEventListener('click', () => {
            this.showConfirmModal(
                'Clear All Data',
                'This will permanently delete all your emission data. This action cannot be undone.',
                () => this.clearAllData()
            );
        });
        
        document.getElementById('resetSettings').addEventListener('click', () => {
            this.showConfirmModal(
                'Reset Settings',
                'This will restore all settings to their default values.',
                () => this.resetToDefaults()
            );
        });
        
        // Modal controls
        document.getElementById('modalCancel').addEventListener('click', () => {
            this.hideModal();
        });
        
        document.getElementById('modalConfirm').addEventListener('click', () => {
            if (this.pendingAction) {
                this.pendingAction();
                this.pendingAction = null;
            }
            this.hideModal();
        });
    }
    
    setupFormListeners() {
        // Toggle switches
        document.querySelectorAll('input[type="checkbox"]').forEach(input => {
            input.addEventListener('change', () => {
                this.updateDynamicElements();
            });
        });
        
        // Location dropdown
        document.getElementById('location').addEventListener('change', (e) => {
            const customItem = document.getElementById('customIntensityItem');
            if (e.target.value === 'custom') {
                customItem.style.display = 'flex';
            } else {
                customItem.style.display = 'none';
            }
        });
        
        // Range slider
        document.getElementById('deviceFactor').addEventListener('input', (e) => {
            document.querySelector('.range-value').textContent = `${e.target.value}x`;
        });
        
        // Auto-save on change (optional)
        document.querySelectorAll('input, select').forEach(element => {
            element.addEventListener('change', () => {
                // Debounce auto-save
                clearTimeout(this.autoSaveTimeout);
                this.autoSaveTimeout = setTimeout(() => {
                    this.collectFormData();
                    this.saveSettings();
                }, 1000);
            });
        });
    }
    
    switchSection(sectionId) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');
        
        // Update content
        document.querySelectorAll('.settings-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.add('active');
    }
    
    populateForm() {
        // Populate all form fields with current settings
        Object.keys(this.currentSettings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    element.checked = this.currentSettings[key];
                } else if (element.type === 'range') {
                    element.value = this.currentSettings[key];
                    if (key === 'deviceFactor') {
                        document.querySelector('.range-value').textContent = `${this.currentSettings[key]}x`;
                    }
                } else {
                    element.value = this.currentSettings[key];
                }
            }
        });
        
        // Handle custom intensity visibility
        const customItem = document.getElementById('customIntensityItem');
        if (this.currentSettings.location === 'custom') {
            customItem.style.display = 'flex';
        } else {
            customItem.style.display = 'none';
        }
    }
    
    collectFormData() {
        // Collect all form data into currentSettings
        Object.keys(this.defaultSettings).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (element.type === 'checkbox') {
                    this.currentSettings[key] = element.checked;
                } else if (element.type === 'number' || element.type === 'range') {
                    this.currentSettings[key] = parseFloat(element.value);
                } else {
                    this.currentSettings[key] = element.value;
                }
            }
        });
    }
    
    updateDynamicElements() {
        // Update any dynamic elements based on current form state
        const enableSync = document.getElementById('enableSync').checked;
        const storeHistory = document.getElementById('storeHistory').checked;
        
        // You can add logic here to enable/disable related controls
        // For example, disable sync-related options if sync is off
    }
    
    async exportData() {
        try {
            // Get all stored data
            const result = await chrome.storage.local.get(null);
            
            // Format data for export
            const exportData = {
                settings: this.currentSettings,
                emissionData: result.siteStats || {},
                dailyStats: result.dailyStats || {},
                achievements: result.achievements || {},
                exportDate: new Date().toISOString(),
                version: '1.0.0'
            };
            
            // Create and download file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `leafbyte-data-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.showMessage('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showMessage('Error exporting data. Please try again.', 'error');
        }
    }
    
    async clearAllData() {
        try {
            // Clear all stored data except settings
            await chrome.storage.local.clear();
            
            // Reset achievements and stats
            await chrome.storage.local.set({
                siteStats: {},
                dailyStats: {},
                achievements: {
                    points: 0,
                    level: 1,
                    badges: [],
                    streaks: {}
                }
            });
            
            this.showMessage('All data cleared successfully!', 'success');
        } catch (error) {
            console.error('Error clearing data:', error);
            this.showMessage('Error clearing data. Please try again.', 'error');
        }
    }
    
    resetToDefaults() {
        this.currentSettings = { ...this.defaultSettings };
        this.populateForm();
        this.saveSettings();
        this.showMessage('Settings reset to defaults!', 'success');
    }
    
    showConfirmModal(title, message, action) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        this.pendingAction = action;
        document.getElementById('confirmModal').classList.add('show');
    }
    
    hideModal() {
        document.getElementById('confirmModal').classList.remove('show');
        this.pendingAction = null;
    }
    
    showMessage(text, type) {
        // Remove existing messages
        document.querySelectorAll('.message').forEach(msg => msg.remove());
        
        // Create new message
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        // Insert at top of main content
        const main = document.querySelector('.settings-main');
        main.insertBefore(message, main.firstChild);
        
        // Show with animation
        setTimeout(() => message.classList.add('show'), 10);
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            message.classList.remove('show');
            setTimeout(() => message.remove(), 300);
        }, 5000);
    }
    
    // Utility method to get carbon intensity by location
    getCarbonIntensity(location) {
        const intensities = {
            global: 475,
            us: 400,
            eu: 300,
            uk: 250,
            ca: 150,
            no: 20
        };
        
        return intensities[location] || 475;
    }
    
    // Method to validate settings
    validateSettings() {
        const errors = [];
        
        if (this.currentSettings.highThreshold < 0.1 || this.currentSettings.highThreshold > 10) {
            errors.push('High emission threshold must be between 0.1 and 10 grams');
        }
        
        if (this.currentSettings.customIntensity < 0 || this.currentSettings.customIntensity > 1000) {
            errors.push('Custom carbon intensity must be between 0 and 1000 g/kWh');
        }
        
        if (this.currentSettings.deviceFactor < 0.5 || this.currentSettings.deviceFactor > 2) {
            errors.push('Device energy factor must be between 0.5x and 2.0x');
        }
        
        return errors;
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LeafByteSettings();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + S to save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        document.getElementById('saveSettings').click();
    }
    
    // Escape to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('confirmModal');
        if (modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    }
});

// Handle window beforeunload to warn about unsaved changes
let hasUnsavedChanges = false;

document.addEventListener('input', () => {
    hasUnsavedChanges = true;
});

document.getElementById('saveSettings').addEventListener('click', () => {
    hasUnsavedChanges = false;
});

window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return e.returnValue;
    }
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LeafByteSettings;
}