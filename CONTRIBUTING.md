
# 🤝 Contributing to LeafByte

Thank you for your interest in contributing to **LeafByte** — a Chrome extension that empowers users to browse the web more sustainably. We welcome developers, designers, testers, and eco-conscious thinkers to help us build a greener internet.

## 🧭 How to Get Started

1. **Fork the Repository**  
   Click the "Fork" button on GitHub to create your own copy of LeafByte.

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/la-b-ib/LeafByte.git
   cd LeafByte
   ```

3. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**  
   Edit code, fix bugs, improve documentation, or add new features.

5. **Test Locally**
   - Open Chrome and go to `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** and select your local LeafByte folder

6. **Commit and Push**
   ```bash
   git add .
   git commit -m "Add: your descriptive message"
   git push origin feature/your-feature-name
   ```

7. **Submit a Pull Request**  
   Go to your fork on GitHub and click **"Compare & pull request"**.

---

## 🧪 What You Can Work On

- 🐛 **Bug Fixes**: Help squash bugs and improve stability
- 🌱 **New Features**: Suggest and implement eco-friendly enhancements
- 🎨 **UI Improvements**: Make the dashboard and overlays more intuitive
- 📚 **Documentation**: Improve README, FAQs, or add tutorials
- 🧰 **Developer Tools**: Enhance audit mode or API integrations
- 🧪 **Testing**: Write unit tests or test across browsers

---

## 🧼 Code Guidelines

- Follow existing code style and structure
- Use clear, descriptive commit messages
- Avoid hardcoded values — use constants or config files
- Sanitize inputs and follow Chrome's Content Security Policy
- Test your changes before submitting a PR

---

## 📂 Project Structure

```
LeafByte/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for data processing
├── content.js             # Page injection and emission calculation
├── popup.html             # Dashboard interface
├── options.html           # Settings page
├── icons/                 # Extension icons
└── ...                    # Other assets and styles
```

---

## 🛡️ Security & Privacy

Please review our [Security Policy](./SECURITY.md) before contributing. All features must respect user privacy and avoid external tracking.

---

## 💬 Need Help?

- Open an [Issue](https://github.com/la-b-ib/LeafByte/issues) for bugs or questions
- Join the discussion in [GitHub Discussions](https://github.com/la-b-ib/LeafByte/discussions)


---

## 🙌 Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/) to ensure a welcoming and inclusive environment for everyone.

---

**Together, we can make the web more sustainable. 🌍**  
Happy coding!
<hr>
