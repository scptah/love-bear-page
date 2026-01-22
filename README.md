# Love Bear Page — Improved Version

Files added:
- index.html
- styles.css
- script.js

What I changed
- Reworked the page into three files (HTML, CSS, JS) for clarity and maintainability.
- Improved visuals: gradient background, polished card, animated bear, floating hearts, nicer fonts.
- Added music controls (play/pause + volume) and autoplay-safe start on user gesture.
- Enhanced the "No" button behavior (evasive but friendly), mobile touch support, keyboard accessibility.
- Added a modal and stronger confetti/heart celebration when the user accepts.
- Accessibility improvements: ARIA attributes, focus management, keyboard handlers.

How to run
1. Save/replace the files in your repository root.
2. Serve locally (recommended):
   - Python 3: `python -m http.server 8000`
   - Visit: `http://localhost:8000`
3. Or open `index.html` directly in a browser (some browsers block autoplay until interaction).

Notes
- Browsers require a user gesture before starting audio; interact with the page (tap/click) to start the music.
- You can pass a name in the URL: `index.html?name=Alex` to personalize the heading.
