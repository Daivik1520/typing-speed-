<div align="center">

# ⚡ Typing Speed Test

### A Modern, Sleek & Feature-Rich Typing Test Application

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

[🚀 Live Demo](#) • [📖 Documentation](#features) • [🐛 Report Bug](https://github.com/Daivik1520/typing-speed-/issues)

</div>

---

## 🎯 Overview

A beautifully crafted, modular typing speed test application designed for both casual users and typing enthusiasts. Built with vanilla JavaScript, featuring a clean UI, multiple test modes, and real-time statistics tracking.

## ✨ Features

### 🎮 Multiple Test Modes
- **⏱️ Time-Based Mode** - Test yourself with 15s, 30s, 60s, or 120s challenges
- **📝 Word-Based Mode** - Complete 25, 50, or 100 word tests at your own pace

### 📊 Real-Time Analytics
- **WPM (Words Per Minute)** - Standard typing speed measurement
- **Raw WPM** - Unfiltered speed including errors
- **Accuracy Percentage** - Track your precision
- **Error Tracking** - Detailed mistake monitoring
- **Live Updates** - Stats refresh every 100ms

### 🎨 User Experience
- **🌗 Dark/Light Theme** - Toggle between themes for comfortable typing
- **📱 Responsive Design** - Works flawlessly on desktop and mobile
- **⌨️ Smart Input** - Supports both physical and on-screen keyboards
- **🔤 Punctuation Toggle** - Practice with or without punctuation
- **⏯️ Pause/Resume** - Take breaks without losing progress
- **🔄 Quick Reset** - Generate new text instantly

### 🏆 Leaderboard System
- **Top 10 Rankings** - Local browser-based leaderboard
- **Persistent Storage** - Your achievements saved locally
- **Easy Management** - Clear leaderboard anytime

---

## 🚀 Quick Start

### Option 1: Direct File Opening
```bash
# Clone the repository
git clone https://github.com/Daivik1520/typing-speed-.git

# Navigate to project directory
cd typing-speed-

# Open index.html in your browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python3 -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (npx)
npx serve

# Then open http://localhost:8000 in your browser
```

---

## 📖 How to Use

1. **🎯 Select Your Mode**
   - Choose between Time or Words mode
   - Pick your preferred duration or word count

2. **⚙️ Customize Settings** (Optional)
   - Toggle punctuation on/off
   - Switch between dark/light theme

3. **🎬 Start Typing**
   - Click "Start" to begin
   - Type the displayed text accurately
   - Use backspace to correct mistakes

4. **⏸️ Control Your Test**
   - Pause anytime to take a break
   - Resume when you're ready
   - Reset to generate new text

5. **🏆 Check Your Results**
   - View your stats at the end
   - Check the leaderboard for your ranking
   - Challenge yourself to improve!

---

## 🏗️ Architecture

### Modular Design Philosophy

The application follows a clean, modular architecture that makes it easy to extend, modify, or replace components:

```
src/
├── modules/
│   ├── textGenerator.js    # Text generation logic
│   ├── testSession.js      # Core typing engine
│   ├── stats.js            # WPM & accuracy calculations
│   ├── timer.js            # Timer utility
│   ├── ui.js               # UI rendering helpers
│   ├── settings.js         # Settings management
│   └── persistence.js      # LocalStorage leaderboard
└── main.js                 # Application orchestrator

assets/
└── styles.css              # Theme & styling (CSS variables)

index.html                  # Entry point
```

### 🔧 Component Overview

| Module | Purpose | Easy to Replace? |
|--------|---------|------------------|
| `textGenerator.js` | Generates typing text | ✅ Yes - swap text sources |
| `testSession.js` | Tracks typing accuracy & progress | ⚠️ Core logic |
| `stats.js` | Calculates WPM, accuracy, etc. | ✅ Yes - custom formulas |
| `timer.js` | Time tracking utility | ✅ Yes - any timer lib |
| `ui.js` | Renders text and updates display | ✅ Yes - framework integration |
| `settings.js` | Manages user preferences | ✅ Yes - add new options |
| `persistence.js` | Leaderboard storage | ✅ Yes - swap with backend API |
| `main.js` | Wires everything together | ⚠️ Orchestrator |

---

## 🛠️ Customization Guide

### 🎨 Change Theme Colors

Edit CSS variables in `assets/styles.css`:

```css
:root {
  --bg-color: #ffffff;
  --text-color: #2d3748;
  --primary-color: #3b82f6;
  /* ... more variables */
}
```

### 📝 Custom Text Sources

Replace `textGenerator.js` with your own implementation:

```javascript
export function generateText({ words, includePunctuation }) {
  // Your custom logic here
  return "your generated text";
}
```

### 🌐 Add Backend Leaderboard

Replace `persistence.js` with API calls:

```javascript
export async function addResult(result) {
  await fetch('/api/leaderboard', {
    method: 'POST',
    body: JSON.stringify(result)
  });
}
```

### ➕ Add New Test Modes

1. Update `settings.js` to include new mode
2. Modify `prepareSession()` in `main.js`
3. Add UI controls in `index.html`

---

## 🎭 Themes

### Light Mode
- Clean, modern aesthetic
- Easy on the eyes in bright environments
- Professional appearance

### Dark Mode
- Reduced eye strain in low light
- OLED-friendly
- Sleek, contemporary look

Toggle themes with the theme button in the top-right corner! 🌓

---

## 📦 Deployment

### Deploy to Netlify (Recommended)

This project is deployment-ready with included `netlify.toml` configuration.

#### Method 1: Drag & Drop
1. Go to [Netlify](https://app.netlify.com/)
2. Drag your project folder to the deploy zone
3. Get your live HTTPS URL instantly! 🎉

#### Method 2: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod --dir="."
```

#### Method 3: GitHub Integration
1. Push your code to GitHub
2. Connect repository in Netlify
3. Auto-deploy on every push

### Deploy to Other Platforms

<details>
<summary><b>GitHub Pages</b></summary>

```bash
# Enable GitHub Pages in repository settings
# Select main branch as source
# Your site will be live at: https://username.github.io/typing-speed-
```
</details>

<details>
<summary><b>Vercel</b></summary>

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```
</details>

<details>
<summary><b>Surge</b></summary>

```bash
# Install Surge
npm install -g surge

# Deploy
surge .
```
</details>

---

## 🔐 Privacy & Security

- **🔒 No Data Collection** - All data stays in your browser
- **💾 Local Storage Only** - Leaderboard saved locally
- **🚫 No Tracking** - Zero analytics or tracking scripts
- **🛡️ Secure Headers** - HTTPS and security headers configured
- **🔓 Open Source** - Fully transparent codebase

---

## 🧪 Browser Compatibility

| Browser | Support |
|---------|--------|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |
| Mobile Browsers | ✅ iOS Safari, Chrome Mobile |

**Minimum Requirements:**
- ES6 Module support
- LocalStorage API
- CSS Variables

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. 🍴 Fork the repository
2. 🔧 Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. 💾 Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. 📤 Push to the branch (`git push origin feature/AmazingFeature`)
5. 🎉 Open a Pull Request

### Ideas for Contributions
- 🌍 Multi-language support
- 📈 Advanced statistics graphs
- 🎯 Custom word lists
- 🏅 Achievement system
- 👥 Multiplayer mode
- 🔊 Sound effects
- ⌨️ Keyboard heat map

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - you're free to use, modify, and distribute this software.
```

---

## 💡 Inspiration

Inspired by popular typing test platforms like:
- [Monkeytype](https://monkeytype.com/)
- [TypeRacer](https://play.typeracer.com/)
- [10FastFingers](https://10fastfingers.com/)

---

## 👨‍💻 Author

**Daivik**
- GitHub: [@Daivik1520](https://github.com/Daivik1520)

---

## 🙏 Acknowledgments

- Built with vanilla JavaScript - no frameworks needed!
- Icons and design inspiration from modern web standards
- Thanks to all contributors and testers

---

<div align="center">

### ⭐ Star this repo if you found it helpful!

**Made with ❤️ and ⌨️**

[⬆ Back to Top](#-typing-speed-test)

</div>
