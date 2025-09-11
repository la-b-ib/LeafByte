# 🔐 LeafByte Security Policy

LeafByte is committed to maintaining the highest standards of security and user privacy. This policy outlines our approach to safeguarding user data, preventing vulnerabilities, and responding to security issues.

## 🛡️ Guiding Principles

- **Privacy-First Design**: All data is stored locally unless explicitly synced by the user.
- **Minimal Permissions**: LeafByte only requests permissions essential for functionality.
- **No External Tracking**: We do not transmit or sell user data to third parties.
- **Transparency**: All code is open-source and auditable via GitHub.

## 🔍 Data Handling & Storage

- **Local Storage**: Emission data, settings, and achievements are stored locally on the user's device.
- **Sync Storage (Optional)**: Settings can be synced across devices using Chrome Sync.
- **No External APIs**: LeafByte does not send browsing data to external servers.
- **Data Retention Control**: Users can configure how long emission history is retained.

## 🔐 Permissions Overview

LeafByte uses the following Chrome extension permissions:

| Permission              | Purpose                                                                 |
|------------------------|-------------------------------------------------------------------------|
| `storage`              | Save user settings and emission data                                    |
| `history`              | Access browsing history for retroactive emission calculations           |
| `tabs`                 | Monitor active tabs for real-time tracking                              |
| `alarms`               | Schedule periodic data resets                                            |
| `notifications`        | Display alerts when emission thresholds are exceeded                    |
| `declarativeNetRequest`| Optional ad blocking and resource filtering                             |

All permissions are used strictly for their described purposes and never abused for tracking or profiling.

## 🧪 Security Testing & Audit

- **Audit Mode**: Developers can inspect performance and emissions without compromising user data.
- **Code Reviews**: All pull requests are reviewed for security implications.
- **Static Analysis**: Automated tools are used to detect vulnerabilities in JavaScript and manifest files.
- **Dependency Monitoring**: Third-party libraries are regularly scanned for known CVEs.

## 🚨 Reporting Vulnerabilities

We take security seriously. If you discover a vulnerability, please report it responsibly:

- **GitHub Issues**: Tag your report with `security` and mark it as confidential if needed

We aim to respond to all security reports within **72 hours** and resolve critical issues within **7 days**.

## 🔄 Updates & Patch Management

- **Versioning**: All releases are tagged and documented in the changelog.
- **Security Patches**: Critical fixes are prioritized and released promptly.
- **User Notification**: Users are notified of major security updates via extension changelog.

## 🧑‍💻 Developer Best Practices

Contributors must follow these security guidelines:

- Avoid using unsafe DOM manipulation
- Sanitize all user inputs
- Never include hardcoded secrets or credentials
- Use HTTPS for any external resources
- Follow Chrome Extension Content Security Policy (CSP)

## 📜 License & Legal

LeafByte is distributed under the **MIT License**, which includes no warranty. Users and contributors are responsible for ensuring compliance with local data protection laws.

---

**Your security is our responsibility.** LeafByte is built with care to protect your privacy and promote a safer, greener web.

<hr>
