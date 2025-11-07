# Typing Speed Test (Web)

Overview
--------
A modern, modular, and user-friendly typing speed test web app. It features:

- Time-based and words-based test modes
- Real-time WPM, raw WPM, accuracy, error tracking
- Punctuation toggle for realistic practice
- Dark/light theme toggle and responsive layout
- Local leaderboard (top 10) stored in the browser
- Accessible input handling (works on desktop and mobile)

Quick Start
----------

1. Open a terminal in this folder.
2. Start a local server:
   - If you have Python: `python3 -m http.server 8000`
   - Then open `http://localhost:8000` in your browser.

Usage
-----

1. Choose Mode:
   - Time: pick a duration (15s, 30s, 60s, 120s)
   - Words: pick a word count (25, 50, 100)
2. Optionally toggle “Include punctuation”.
3. Click Start and begin typing. Press Reset to generate new text.
4. Pause and resume any time.
5. Review your results in the local leaderboard. Click Clear to reset it.

Architecture (Modular Design)
-----------------------------

The app is structured into small, focused modules to make it easy to add or remove features:

- `src/modules/textGenerator.js` — Generates the text to type. Replaceable source and strategy.
- `src/modules/testSession.js` — Core typing engine. Tracks correctness, errors, WPM, end conditions.
- `src/modules/stats.js` — WPM/raw/accuracy computations based on counts and elapsed time.
- `src/modules/timer.js` — A general timer utility (used by time mode; simple to swap).
- `src/modules/ui.js` — UI helpers for rendering text and stats. No business logic.
- `src/modules/settings.js` — Reads and emits changes from the settings controls.
- `src/modules/persistence.js` — LocalStorage-based leaderboard. Swap with a backend API easily.
- `src/main.js` — Wiring module. Composes all modules and orchestrates the UX.

Styling:

- `assets/styles.css` — Theming via CSS variables. Toggle dark/light by switching a root class.

Extend/Replace Features Easily
------------------------------

- Replace Text Generator:
  - Implement `generateText({ words, includePunctuation })` in a new file and update the import in `main.js`.
- Add New Modes (e.g., quote mode, paragraph mode):
  - Extend `Settings` to include a new mode option.
  - Update `prepareSession()` in `main.js` to create the session with your new mode logic.
- Swap Leaderboard Storage:
  - Replace `persistence.js` with API calls. Keep the same `addResult`, `loadLeaderboard`, `clearLeaderboard` interface for minimal changes.
- Customize UI/UX:
  - Update `ui.js` render helpers and `styles.css`. Business logic stays isolated in `testSession.js`.

Error-Free Operation
--------------------

- The app uses safe DOM checks and guards to avoid null references.
- Input handling works with both desktop keyboard and mobile on-screen keyboards.
- Stats update at 100ms intervals; computations are bounded and robust.

License
-------
See `LICENSE` for licensing details.

Deploy (Netlify)
----------------
This project is a static site (HTML/CSS/JS), so it deploys perfectly on Netlify — fast and free.

Option A: Drag-and-drop
- Go to https://app.netlify.com/ → Add new site → Deploy manually.
- Drag your project folder (the one containing `index.html`) into the dropzone.
- Netlify will deploy and give you a live URL with HTTPS.

Option B: CLI
- Install CLI: `npm install -g netlify-cli`
- Login: `netlify login`
- Initialize: `netlify init` (choose “Create & configure a new site” and follow prompts)
- Deploy: `netlify deploy --prod --dir="."`

Notes
- A `netlify.toml` is included to optimize caching:
  - `index.html` is served with `no-cache` so updates reflect immediately.
  - `/assets/*` (CSS) caches for 7 days.
  - `/src/*` (JS modules) caches for 1 day.
  - Common security headers are set (HSTS, nosniff, frame options, referrer policy).
- Custom domain: set your domain in Netlify → Domain management, then add the DNS records they show.
- Re-deploying: if you change CSS/JS and don’t see updates, try a hard refresh or “Clear cache and deploy” from Netlify.