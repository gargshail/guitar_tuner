import './style.css';
import { PitchDetector, GUITAR_TUNING } from './src/pitch_detection.js';

let audioContext = null;
let analyser = null;
let detector = null;
let isTuning = false;
let animationId = null;

const startBtn = document.getElementById('start-btn');
const noteNameEl = document.getElementById('note-name');
const freqValEl = document.getElementById('freq-val');
const needleEl = document.getElementById('needle');
const stringEls = document.querySelectorAll('.string');

// Initialize detector
async function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);

        analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        detector = new PitchDetector(audioContext.sampleRate, analyser.fftSize);
        return true;
    } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Could not access microphone. Please ensure permissions are granted.');
        return false;
    }
}

function updateTuning() {
    if (!isTuning) return;

    const buffer = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(buffer);

    const frequency = detector.detect(buffer);

    if (frequency) {
        const note = PitchDetector.getNote(frequency);

        // Update UI
        noteNameEl.textContent = note.name;
        freqValEl.textContent = `${frequency.toFixed(2)} Hz`;

        // Update needle (cents range is -50 to 50)
        // Map cents to percentage for needle position
        const cents = Math.max(-50, Math.min(50, note.cents));
        const percentage = 50 + cents; // 0 to 100
        needleEl.style.left = `${percentage}%`;

        // Visual feedback
        if (Math.abs(note.cents) < 5) {
            noteNameEl.classList.add('in-tune');
            needleEl.classList.add('in-tune');
        } else {
            noteNameEl.classList.remove('in-tune');
            needleEl.classList.remove('in-tune');
        }

        // Highlight corresponding string if close to standard tuning
        highlightString(note.fullName);
    } else {
        // Reset or fade out if no signal
        // We don't clear note immediately to avoid flickering
    }

    animationId = requestAnimationFrame(updateTuning);
}

function highlightString(noteFullName) {
    stringEls.forEach(el => {
        if (el.dataset.target === noteFullName) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

startBtn.addEventListener('click', async () => {
    if (isTuning) {
        isTuning = false;
        startBtn.textContent = 'START TUNING';
        if (animationId) cancelAnimationFrame(animationId);
        if (audioContext) audioContext.close();
        audioContext = null;
    } else {
        const success = await initAudio();
        if (success) {
            isTuning = true;
            startBtn.textContent = 'STOP TUNING';
            updateTuning();
        }
    }
});

// PWA Install logic
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installBtn.style.display = 'none';
        }
        deferredPrompt = null;
    }
});

// Register Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(reg => {
            console.log('SW registered:', reg);
        }).catch(err => {
            console.log('SW registration failed:', err);
        });
    });
}
