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



## Technical Details

**Technical Overview**: Compatible with Chrome v88+ (Manifest V3) and Chromium-based Edge; requires `storage`, `history`, `tabs`, `alarms`, `notifications`, and optional `declarativeNetRequest` permissions; persists emission data/settings in `local` and `sync` storage with all computation performed locally (no external APIs).
