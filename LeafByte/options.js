// Modern LeafByte Settings - Clean & Simple JavaScript

class ModernSettings {
    constructor() {
        this.settings = {
            // Default settings
            showBadge: true,
            badgePosition: 'top-right',
            theme: 'light',
            units: 'g',
            compactMode: false,
            animations: true,
            opacity: 0.9,
            autoCalculate: true,
            updateFrequency: 5,
            greenHosting: true,
            notifications: false,
            threshold: 100,
            storeHistory: true,
            dataRetention: '90',
            debugMode: false,
            customApi: ''
        };
        
        this.currentSection = 'general';
        this.init();
    }
    
    async init() {
        await this.loadSettings();
        this.setupNavigation();
        this.setupControls();
        this.updateUI();
    }
    
    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get('leafbyteSettings');
            if (result.leafbyteSettings) {
                this.settings = { ...this.settings, ...result.leafbyteSettings };
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }
    
    async saveSettings() {
        try {
            await chrome.storage.sync.set({ leafbyteSettings: this.settings });
            this.showNotification('Settings saved successfully!', 'success');
            
            // Notify other parts of the extension
            chrome.runtime.sendMessage({
                type: 'SETTINGS_UPDATED',
                settings: this.settings
            });
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Error saving settings', 'error');
        }
    }
    
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.section');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor behavior
                const sectionId = item.dataset.section;
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Show corresponding section
                sections.forEach(section => section.classList.remove('active'));
                const targetSection = document.getElementById(`${sectionId}-section`);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
                
                // Update header
                this.updateSectionHeader(sectionId);
                this.currentSection = sectionId;
            });
        });
    }
    
    setupControls() {
        // Switch toggles
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const setting = e.target.dataset.setting;
                if (setting) {
                    this.settings[setting] = e.target.checked;
                    this.saveSettings();
                }
            });
        });
        
        // Select dropdowns
        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', (e) => {
                const setting = e.target.dataset.setting;
                if (setting) {
                    this.settings[setting] = e.target.value;
                    this.saveSettings();
                }
            });
        });
        
        // Radio buttons (segmented control)
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.addEventListener('change', (e) => {
                const setting = e.target.dataset.setting;
                if (setting && e.target.checked) {
                    this.settings[setting] = e.target.value;
                    this.saveSettings();
                }
            });
        });
        
        // Range sliders
        document.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const setting = e.target.dataset.setting;
                if (setting) {
                    this.settings[setting] = parseFloat(e.target.value);
                    this.saveSettings();
                }
            });
        });
        
        // Number inputs
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const setting = e.target.dataset.setting;
                if (setting) {
                    this.settings[setting] = parseInt(e.target.value) || 0;
                    this.saveSettings();
                }
            });
        });
        
        // Text inputs
        document.querySelectorAll('input[type="url"], input[type="text"]').forEach(input => {
            input.addEventListener('change', (e) => {
                const setting = e.target.dataset.setting;
                if (setting) {
                    this.settings[setting] = e.target.value;
                    this.saveSettings();
                }
            });
        });
        
        // Action buttons
        document.querySelector('[data-action="save"]')?.addEventListener('click', () => {
            this.saveSettings();
        });
        
        document.querySelector('[data-action="export"]')?.addEventListener('click', () => {
            this.exportData();
        });
    }
    
    updateUI() {
        // Update all form controls with current settings
        Object.keys(this.settings).forEach(key => {
            const value = this.settings[key];
            
            // Checkboxes
            const checkbox = document.querySelector(`input[type="checkbox"][data-setting="${key}"]`);
            if (checkbox) {
                checkbox.checked = value;
            }
            
            // Select dropdowns
            const select = document.querySelector(`select[data-setting="${key}"]`);
            if (select) {
                select.value = value;
            }
            
            // Radio buttons
            const radio = document.querySelector(`input[type="radio"][data-setting="${key}"][value="${value}"]`);
            if (radio) {
                radio.checked = true;
            }
            
            // Range sliders
            const slider = document.querySelector(`input[type="range"][data-setting="${key}"]`);
            if (slider) {
                slider.value = value;
            }
            
            // Number inputs
            const numberInput = document.querySelector(`input[type="number"][data-setting="${key}"]`);
            if (numberInput) {
                numberInput.value = value;
            }
            
            // Text inputs
            const textInput = document.querySelector(`input[type="url"][data-setting="${key}"], input[type="text"][data-setting="${key}"]`);
            if (textInput) {
                textInput.value = value;
            }
        });
    }
    
    updateSectionHeader(sectionId) {
        const titles = {
            general: 'General Settings',
            appearance: 'Appearance',
            analytics: 'Analytics & Tracking',
            notifications: 'Notifications',
            privacy: 'Privacy & Data',
            advanced: 'Advanced Settings',
            about: 'About LeafByte'
        };
        
        const descriptions = {
            general: 'Basic configuration options',
            appearance: 'Customize the visual appearance',
            analytics: 'Configure emission tracking and analytics',
            notifications: 'Manage notifications and alerts',
            privacy: 'Control your data and privacy settings',
            advanced: 'Advanced options for power users',
            about: 'Information about the extension and developer'
        };
        
        document.getElementById('section-title').textContent = titles[sectionId] || 'Settings';
        document.getElementById('section-description').textContent = descriptions[sectionId] || '';
    }
    
    showNotification(message, type = 'info') {
        // Create a simple toast notification
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 16px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1000;
            font-size: 14px;
            max-width: 300px;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Show toast
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(0)';
        });
        
        // Hide and remove toast after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    async exportData() {
        try {
            const allData = await chrome.storage.sync.get(null);
            const dataStr = JSON.stringify(allData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `leafbyte-settings-${new Date().toISOString().split('T')[0]}.json`;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(url);
            this.showNotification('Settings exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showNotification('Error exporting settings', 'error');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.modernSettings = new ModernSettings();
});