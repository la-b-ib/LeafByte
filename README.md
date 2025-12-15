## <samp> LeafByte

<samp>
  
**Making the web more sustainable, one page at a time.**

**LeafByte is a Chrome extension that tracks and displays the carbon emissions of your web browsing, helping you make more environmentally conscious decisions online.**
<hr>

## Features

### 🌍 Real-Time Emission Tracking
- **Live CO2 Display**: See real-time carbon emissions for every page you visit
- **Resource Breakdown**: Understand which elements (images, scripts, CSS) contribute most to emissions
- **Smart Badge**: Non-intrusive overlay showing current page emissions with detailed tooltips

### 📊 Comprehensive Dashboard
- **Interactive Charts**: Visualize your browsing emissions with responsive charts
- **Site Analytics**: Track emissions per website and identify your highest-impact browsing habits
- **Trend Analysis**: View daily, weekly, and monthly emission patterns
- **Goal Setting**: Set and track personal emission reduction targets

### 🎮 Gamification & Motivation
- **Achievement System**: Earn badges and points for eco-friendly browsing
- **Level Progression**: Advance through eco-warrior levels
- **Streak Tracking**: Maintain low-emission browsing streaks
- **Social Sharing**: Share your environmental achievements

### ⚙️ Advanced Customization
- **Location-Based Calculations**: Adjust for your local electricity grid's carbon intensity
- **Threshold Alerts**: Get notified when pages exceed your emission limits
- **Multiple Themes**: Light, dark, and auto themes
- **Export Data**: Download your emission data in CSV or JSON format

### 🔒 Privacy-First Design
- **Local Storage**: All data stored locally on your device
- **Optional Sync**: Choose to sync across devices with Chrome sync
- **No External Tracking**: Your browsing data never leaves your control
- **Data Retention Control**: Set how long to keep emission history

### 🛠️ Developer Tools
- **Audit Mode**: Detailed performance metrics for web developers
- **Optimization Suggestions**: Get recommendations to reduce page emissions
- **Debug Logging**: Console logging for troubleshooting
- **API Integration**: Green hosting detection via The Green Web Foundation

<hr>

## Preview



<p align="left">
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop.png" width="49%" />
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop%20(1).png" width="49%" />
</p>
<p align="left">
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop%20(2).png" width="49%" />
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop%20(3).png" width="48%" />
</p>
<p align="left">
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop%20(4).png" width="49%" />
  <img src="https://raw.githubusercontent.com/la-b-ib/LeafByte/main/preview/desktop%20(5).png" width="49%" />
</p>

<hr>

## Installation

### From Chrome Web Store (Recommended)
1. Visit the Chrome Web Store (link coming soon)
2. Click "Add to Chrome"
3. Confirm installation
4. Start browsing sustainably!

### Manual Installation (Developer Mode)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the LeafByte folder
5. The extension will appear in your toolbar
   
<hr>

## How It Works

### Emission Calculation
LeafByte uses the Performance API to measure:
- **Data Transfer**: Total bytes downloaded (HTML, CSS, JS, images, etc.)
- **Energy Consumption**: Estimated device and network energy usage
- **Carbon Intensity**: Your location's electricity grid carbon factor

**Formula**: `Emissions = Data Transfer × Energy per Byte × Carbon Intensity`

### Default Values
- **Global Average**: 475g CO2/kWh
- **Energy Factor**: 0.5 kWh per GB of data
- **Green Hosting Bonus**: 50% reduction for renewable-powered sites
<hr>

## Usage

### Quick Start
1. **Install** the extension
2. **Visit any website** - emissions will be calculated automatically
3. **Click the badge** in the corner to see detailed breakdown
4. **Open the popup** (click extension icon) for full dashboard
5. **Customize settings** via the options page

### Dashboard Navigation
- **Overview**: Quick stats and current page analysis
- **Sites**: Per-domain emission tracking and filtering
- **Trends**: Historical charts and pattern analysis
- **Goals**: Set targets and track progress

### Settings Configuration
1. Right-click the extension icon → "Options"
2. Configure your location for accurate carbon intensity
3. Set emission thresholds and notification preferences
4. Customize display options and privacy settings
<hr>

## Technical Details

### Browser Compatibility
- **Chrome**: Version 88+ (Manifest V3)
- **Edge**: Chromium-based versions
- **Other Browsers**: Not currently supported

### Permissions Required
- `storage`: Save settings and emission data
- `history`: Access browsing history for retroactive calculations
- `tabs`: Monitor active tabs for real-time tracking
- `alarms`: Schedule periodic data resets
- `notifications`: Display emission alerts
- `declarativeNetRequest`: Optional ad blocking features

### Data Storage
- **Local Storage**: Emission data, settings, achievements
- **Sync Storage**: Settings only (if enabled)
- **No External APIs**: All processing done locally
<hr>

