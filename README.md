AI-Emotion-Detection-System-using-NLP-Machine-Learning
EmoSense AI

**EmoSense AI** is a static web app for emotion detection from text. It uses browser-side JavaScript to analyze user input and display a predicted emotion, confidence score, probability bars, history, and charts in a polished UI.

## Features

- Emotion prediction from typed text
- Confidence meter and emotion probability visualization
- Prediction history stored in `localStorage`
- Sample prompt buttons for quick testing
- Voice input support (browser-dependent)
- Light/dark theme toggle
- Animated chart visualizations using Chart.js

## Tech Stack

- HTML
- CSS
- JavaScript
- Chart.js

## Usage

### Open locally

1. Open `index.html` in your browser.
2. Type a message into the `Enter text` field.
3. Click **Analyze Emotion**.
4. View the predicted emotion, confidence score, and analytic charts.

### Voice input

- Click the **🎤 Voice Input** button if your browser supports Web Speech API.
- Speak your message and the app will transcribe it for analysis.

### Clear controls

- Click **Reset** to clear the text input and assistant message.
- Click **Clear** in the history panel to reset prediction history.

## Notes

- The emotion detection logic runs entirely in the browser.
- Predictions are based on keyword matching and simulated probability values.
- Charts and history are updated live without a backend.

## File structure

- `index.html` — main UI markup
- `styles.css` — visual styling
- `script.js` — emotion detection logic and interactivity

## Development

For a simple development setup, serve the folder with a static file server or open `index.html` directly.

Example using Python:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.
