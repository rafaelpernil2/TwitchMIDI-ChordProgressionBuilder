import type { ProgressionItem, TimeSignature } from "./types";
import { chordToNotes } from "./chords";

let Tone: typeof import("tone") | null = null;
let sampler: import("tone").Sampler | null = null;
let samplerReady = false;
let toneInitialized = false;
let sharedAudioContext: AudioContext | null = null;

// Create and resume an AudioContext synchronously within a user gesture.
// iOS Safari requires this to happen in the same call stack as the
// touch/click event — no awaits before this call.
export function warmUpAudioContext(): void {
  if (sharedAudioContext) {
    // Context exists but may be suspended (iOS suspends on page visibility change)
    if (sharedAudioContext.state === "suspended") {
      sharedAudioContext.resume();
    }
    return;
  }
  const AC = window.AudioContext || (window as any).webkitAudioContext;
  sharedAudioContext = new AC();
  // Play a silent buffer to fully unlock audio on iOS
  const buffer = sharedAudioContext.createBuffer(1, 1, 22050);
  const source = sharedAudioContext.createBufferSource();
  source.buffer = buffer;
  source.connect(sharedAudioContext.destination);
  source.start(0);
}

const PIANO_SAMPLES: Record<string, string> = {
  A0: "A0.mp3",
  C1: "C1.mp3",
  "D#1": "Ds1.mp3",
  "F#1": "Fs1.mp3",
  A1: "A1.mp3",
  C2: "C2.mp3",
  "D#2": "Ds2.mp3",
  "F#2": "Fs2.mp3",
  A2: "A2.mp3",
  C3: "C3.mp3",
  "D#3": "Ds3.mp3",
  "F#3": "Fs3.mp3",
  A3: "A3.mp3",
  C4: "C4.mp3",
  "D#4": "Ds4.mp3",
  "F#4": "Fs4.mp3",
  A4: "A4.mp3",
  C5: "C5.mp3",
  "D#5": "Ds5.mp3",
  "F#5": "Fs5.mp3",
  A5: "A5.mp3",
  C6: "C6.mp3",
  "D#6": "Ds6.mp3",
  "F#6": "Fs6.mp3",
  A6: "A6.mp3",
  C7: "C7.mp3",
  "D#7": "Ds7.mp3",
  "F#7": "Fs7.mp3",
  A7: "A7.mp3",
  C8: "C8.mp3",
};

// Load Tone.js and wire it to the already-unlocked AudioContext.
export async function initTone(): Promise<void> {
  if (toneInitialized) return;
  toneInitialized = true;
  Tone = await import("tone");
  // If we already unlocked an AudioContext, hand it to Tone.js
  if (sharedAudioContext) {
    Tone.setContext(sharedAudioContext);
  }
  await Tone.start();
  sampler = new Tone.Sampler({
    urls: PIANO_SAMPLES,
    release: 1,
    baseUrl: "https://tonejs.github.io/audio/salamander/",
    onload: () => {
      samplerReady = true;
    },
  }).toDestination();
}

async function ensureTone() {
  if (!Tone || !sampler) {
    await initTone();
  }
  return Tone!;
}

export async function startPlayback(
  items: ProgressionItem[],
  _timeSignature: TimeSignature,
  bpm: number,
  onCurrentItem: (index: number) => void
): Promise<void> {
  // Warm up AudioContext synchronously within the click gesture (iOS requirement)
  warmUpAudioContext();

  const T = await ensureTone();
  await T.start();

  // Wait for piano samples to load
  if (!samplerReady) {
    await new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (samplerReady) {
          clearInterval(check);
          resolve();
        }
      }, 100);
    });
  }

  T.getTransport().bpm.value = bpm;
  T.getTransport().cancel();
  T.getTransport().stop();
  T.getTransport().position = 0;

  let currentBeat = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const beatTime = currentBeat;
    const index = i;

    const timeInSeconds = (beatTime / bpm) * 60;

    if (item.type === "chord" && item.root && sampler && samplerReady) {
      const notes = chordToNotes(item.root, item.quality ?? "");
      const durationInSeconds = (item.beats / bpm) * 60;

      T.getTransport().schedule((time) => {
        sampler!.triggerAttackRelease(notes, durationInSeconds, time);
        T.getDraw().schedule(() => onCurrentItem(index), time);
      }, timeInSeconds);
    } else {
      T.getTransport().schedule((time) => {
        T.getDraw().schedule(() => onCurrentItem(index), time);
      }, timeInSeconds);
    }

    currentBeat += item.beats;
  }

  const totalTime = (currentBeat / bpm) * 60;
  T.getTransport().schedule((time) => {
    T.getDraw().schedule(() => {
      stopPlayback(onCurrentItem);
    }, time);
  }, totalTime);

  T.getTransport().start();
}

export async function stopPlayback(
  onCurrentItem: (index: number) => void
): Promise<void> {
  if (Tone) {
    Tone.getTransport().stop();
    Tone.getTransport().cancel();
    Tone.getTransport().position = 0;
  }
  if (sampler) {
    sampler.releaseAll();
  }
  onCurrentItem(-1);
}
