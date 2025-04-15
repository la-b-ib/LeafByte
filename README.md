

---

# LeafByte – Chrome Extension for Tracking Digital Carbon Footprint

**LeafByte** is an advanced Chrome extension that helps users monitor, understand, and reduce their digital carbon footprint. Designed with performance, accessibility, and sustainability in mind, LeafByte empowers environmentally-conscious browsing with real-time analytics, intelligent insights, and behavioral nudges.

---

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Sustainable Development Goals](#sustainable-development-goals)
- [Environmental Impact](#environmental-impact)
- [Installation](#installation)
- [Contributing](#contributing)
- [GitHub Workflow](#github-workflow)
- [Security](#security)
- [Contact](#contact)
- [License](#license)

---

## Project Structure

```
LeafByte/
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
├── charts.js
├── gamification.js
├── ml.js
├── api.js
├── leaderboard.js
├── user.js
├── security.js
├── notifications.js
├── feedback.js
├── preferences.js
├── accessibility.js
├── offline.js
├── performance.js
├── themes.js
├── alerts.js
├── settings.js
├── icons.js
├── calculations.js
├── login.js
├── about.js
├── style.css
├── icon.png
```

---

## Features

- Real-time tracking of digital data usage and CO₂ emissions
- Advanced carbon footprint calculation (energy use, CO₂ equivalent, km driven, tree offset)
- Machine learning-powered personal insights
- Data visualization via bar, pie, radar, line, and donut charts
- Gamification: badges, challenges, and global leaderboards
- User profile with login, preferences, and avatar
- Accent and theme customization
- Notification center with sound and behavior settings
- Material UI icons integration
- Offline mode support
- Accessibility options (keyboard nav, contrast, text scale)
- Secure cloud sync (planned)
- Feedback collection and user engagement metrics

---

## Sustainable Development Goals

LeafByte directly supports several United Nations Sustainable Development Goals:

- **Goal 12**: Responsible Consumption and Production  
- **Goal 13**: Climate Action  
- **Goal 9**: Industry, Innovation and Infrastructure  
- **Goal 11**: Sustainable Cities and Communities  
- **Goal 17**: Partnerships for the Goals

---

## Environmental Impact

LeafByte aims to drive behavioral change by making the invisible impact of digital activity visible. By measuring energy usage and translating emissions into relatable metrics like kilometers driven or tree absorption equivalents, it bridges awareness and action in everyday browsing.

---

## Installation

1. Clone or download the repository:
   ```bash
   git clone https://github.com/la-b-ib/leafbyte.git
   cd leafbyte
   ```

2. Open `chrome://extensions/` in your browser

3. Enable **Developer mode**

4. Click **Load unpacked** and select the `LeafByte` directory

5. The extension will appear in your browser toolbar

---

## Contributing

We welcome external contributions that improve LeafByte's performance, usability, or sustainability mission.

### Contribution Guidelines

1. Fork the repository
2. Create a new feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Describe your update"
   ```
4. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a pull request

### Areas to Contribute

- Carbon calculation models
- UI/UX improvements
- Charting and visualizations
- Localization support
- Security auditing
- API integrations

---

## GitHub Workflow

```yaml
name: CI Workflow

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18.x'
      - run: npm install
      - run: npm run lint
      - run: npm run build
```

Planned: carbon benchmarking scripts, test coverage analysis, and build previews.

---

## Security

LeafByte includes the following security measures:

- Encrypted local storage
- HTTPS-only communication
- CSP-enforced script security
- Input validation and sanitization
- Extension permission hardening

---


## Contact

- **Developer**: Labib Bin Shahed
- **Email**: [labib-x@protonmail.com](mailto:labib-x@protonmail.com)  
- **GitHub**: [github.com/la-b-ib](https://github.com/la-b-ib)

---

## License

This project is licensed under the MIT License. See `LICENSE` file for details.

---
