# LeafByte Extension Installation Guide

## Quick Installation Steps

1. **Open Chrome Extensions Page**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Or go to Menu → More Tools → Extensions

2. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

3. **Load the Extension**
   - Click "Load unpacked" button
   - Navigate to and select the `/Users/5u3uki/Downloads/LeafByte` folder
   - Click "Select Folder"

4. **Verify Installation**
   - You should see the LeafByte extension appear in your extensions list
   - The green leaf icon should appear in your Chrome toolbar
   - Click the icon to open the dashboard

## Troubleshooting

### If you see "Could not load manifest" error:
- Make sure you selected the correct folder containing `manifest.json`
- Ensure all files are present in the directory
- Try refreshing the extensions page and loading again

### If icons don't appear:
- The extension now uses SVG icons which should work properly
- If issues persist, check the Chrome console for specific errors

### If you see Chart.js or CSP errors:
- The extension now includes a local copy of Chart.js to avoid Content Security Policy issues
- Make sure `chart.min.js` is present in the extension directory
- Reload the extension if you encounter "Chart is not defined" errors

### If the extension doesn't work:
- Check that all permissions are granted
- Reload the extension from the extensions page
- Check the browser console for any JavaScript errors

## Features to Test

1. **Real-time Emission Display**: Visit any website and look for the green emission badge
2. **Dashboard**: Click the extension icon to view your carbon footprint dashboard
3. **Settings**: Right-click the extension icon and select "Options" to customize settings
4. **Notifications**: Enable notifications in settings to get emission alerts

## Support

If you encounter any issues, please check the browser console (F12) for error messages and refer to the main README.md file for detailed documentation.