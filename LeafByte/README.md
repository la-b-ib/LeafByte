# LeafByte 🌱

**Making the web more sustainable, one page at a time**

LeafByte is a Chrome extension that tracks and displays the carbon emissions of your web browsing, helping you make more environmentally conscious decisions online.

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

## Contributing

We welcome contributions! Here's how to get started:

### Development Setup
1. Clone the repository
2. Make your changes
3. Test in Chrome developer mode
4. Submit a pull request

### Code Structure
```
LeafByte/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for data processing
├── content.js            # Page injection and emission calculation
├── content.css           # Styles for page overlays
├── popup.html            # Dashboard interface
├── popup.js              # Dashboard functionality
├── popup.css             # Dashboard styles
├── options.html          # Settings page
├── options.js            # Settings functionality
├── options.css           # Settings styles
└── icons/                # Extension icons
```

### Key APIs Used
- **Performance API**: Resource timing and navigation data
- **Chrome Storage API**: Local and sync data persistence
- **Chrome History API**: Browsing history integration
- **Chrome Alarms API**: Scheduled tasks
- **Chrome Notifications API**: User alerts

## Roadmap

### Version 1.1
- [ ] Firefox support
- [ ] Enhanced green hosting detection
- [ ] Carbon offset integration
- [ ] Team/organization features

### Version 1.2
- [ ] Machine learning emission predictions
- [ ] Website sustainability scoring
- [ ] Integration with sustainability APIs
- [ ] Mobile companion app

## FAQ

**Q: How accurate are the emission calculations?**
A: Our calculations are based on industry-standard methodologies and provide good relative comparisons. Absolute values are estimates.

**Q: Does this extension slow down my browsing?**
A: No, LeafByte uses lightweight APIs and processes data asynchronously without impacting page load times.

**Q: Is my browsing data private?**
A: Yes, all data is stored locally on your device. We never collect or transmit your browsing information.

**Q: Can I use this for my website's sustainability audit?**
A: Yes! Enable "Audit Mode" in settings for detailed developer insights and optimization recommendations.

## Support

- **Issues**: Report bugs on GitHub Issues
- **Feature Requests**: Submit ideas via GitHub Discussions
- **Email**: leafbyte.extension@gmail.com

## License

MIT License - see LICENSE file for details

## Credits

**Developer**: Labib Bin Shahed
**Inspiration**: The urgent need for digital sustainability awareness
**Special Thanks**: The Green Web Foundation for hosting data

---

**Start your sustainable browsing journey today! 🌱**

Every gram of CO2 saved makes a difference. Together, we can make the web more sustainable.