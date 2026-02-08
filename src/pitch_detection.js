/**
 * Pitch detection using autocorrelation
 * Adapted from standard autocorrelation algorithms for real-time pitch detection.
 */

export class PitchDetector {
    constructor(sampleRate, bufferSize = 2048) {
        this.sampleRate = sampleRate;
        this.bufferSize = bufferSize;
        this.buffer = new Float32Array(bufferSize);
    }

    /**
     * Finds the fundamental frequency from a buffer of audio data.
     * @param {Float32Array} float32AudioData 
     * @returns {number|null} Frequency in Hz or null if not found
     */
    detect(float32AudioData) {
        // Use RMS to detect if there is enough signal
        let rms = 0;
        for (let i = 0; i < float32AudioData.length; i++) {
            rms += float32AudioData[i] * float32AudioData[i];
        }
        rms = Math.sqrt(rms / float32AudioData.length);

        if (rms < 0.01) return null; // Signal too weak

        // Autocorrelation
        let bestOffset = -1;
        let bestCorrelation = 0;
        let correlations = new Float32Array(this.bufferSize);

        for (let offset = 0; offset < this.bufferSize; offset++) {
            let correlation = 0;
            for (let i = 0; i < this.bufferSize - offset; i++) {
                correlation += float32AudioData[i] * float32AudioData[i + offset];
            }
            correlations[offset] = correlation;
        }

        // Find the first peak after the initial descent
        let d = 0;
        while (correlations[d] > correlations[d + 1]) d++;

        let maxVal = -1;
        for (let i = d; i < this.bufferSize; i++) {
            if (correlations[i] > maxVal) {
                maxVal = correlations[i];
                bestOffset = i;
            }
        }

        if (bestOffset !== -1) {
            // Refine with parabolic interpolation
            const x1 = correlations[bestOffset - 1];
            const x2 = correlations[bestOffset];
            const x3 = correlations[bestOffset + 1];
            const a = (x1 + x3 - 2 * x2) / 2;
            const b = (x3 - x1) / 2;
            const refinedOffset = bestOffset - b / (2 * a);

            return this.sampleRate / refinedOffset;
        }

        return null;
    }

    /**
     * Converts a frequency to a note name and its offset in cents.
     * @param {number} frequency 
     */
    static getNote(frequency) {
        const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
        const semi = 12 * (Math.log(frequency / 440) / Math.log(2));
        const noteNum = Math.round(semi) + 69;
        const noteName = noteStrings[noteNum % 12];
        const octave = Math.floor(noteNum / 12) - 1;
        const targetFrequency = 440 * Math.pow(2, (noteNum - 69) / 12);
        const cents = Math.floor(1200 * (Math.log(frequency / targetFrequency) / Math.log(2)));

        return {
            name: noteName,
            octave: octave,
            fullName: `${noteName}${octave}`,
            cents: cents,
            frequency: frequency
        };
    }
}

export const GUITAR_TUNING = [
    { name: 'E', frequency: 82.41, full: 'E2' },
    { name: 'A', frequency: 110.00, full: 'A2' },
    { name: 'D', frequency: 146.83, full: 'D3' },
    { name: 'G', frequency: 196.00, full: 'G3' },
    { name: 'B', frequency: 246.94, full: 'B3' },
    { name: 'e', frequency: 329.63, full: 'E4' }
];
