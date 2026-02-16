# Guitar Tuner Pro

A professional-grade, professional-looking guitar tuner built as a Single Page Application (SPA) and Progressive Web App (PWA). It uses high-accuracy pitch detection (Autocorrelation) to help you tune your guitar with precision.

## Features

- **High-Accuracy Tuning**: Uses real-time autocorrelation algorithm for fundamental frequency detection.
- **Visual Meter**: A refined UI featuring a moving vertical bar indicator and a precise "cents" deviation readout.
- **Standard Tunings**: Visual cues for standard guitar strings (E2, A2, D3, G3, B3, E4).
- **Responsive Design**: Premium dark-mode aesthetic with glassmorphism, fully responsive for mobile and desktop.
- **PWA Support**: Installable on your device and works offline thanks to service worker caching.

## Tech Stack

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Audio Logic**: Web Audio API (AudioContext, AnalyserNode)
- **Build Tool**: Vite
- **PWA**: Web App Manifest, Service Workers

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository or download the source code.
2. Navigate to the project directory:
   ```bash
   cd guitar_tuner
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

To start the development server:
```bash
npm run dev
```
Open the provided URL (usually `http://localhost:5173`) in your browser.

### Building for Production

To create an optimized production build:
```bash
npm run build
```
The output will be in the `dist` directory.

## How to Use

1. Click the **"Start Tuner"** button.
2. Grant microphone access when prompted by the browser.
3. Pluck a guitar string.
4. The tuner will display the closest note and the frequency in Hz.
5. Use the **moving bar** and the **cents display** to fine-tune:
   - **Left**: The note is flat (Tighten the string).
   - **Right**: The note is sharp (Loosen the string).
   - **Center (Green)**: The note is in tune!

## License

MIT
