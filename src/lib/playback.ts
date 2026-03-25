import type { ProgressionItem, TimeSignature } from "./types";
import { chordToNotes } from "./chords";

let Tone: typeof import("tone") | null = null;
let sampler: import("tone").Sampler | null = null;
let samplerReady = false;
let toneLoadPromise: Promise<void> | null = null;

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

// Load Tone.js module and create sampler. Safe to call multiple times.
// Must be called from a user gesture on iOS so the AudioContext is unlocked.
export function loadTone(): Promise<void> {
  if (!toneLoadPromise) {
    toneLoadPromise = (async () => {
      Tone = await import("tone");
      sampler = new Tone.Sampler({
        urls: PIANO_SAMPLES,
        release: 1,
        baseUrl: "https://tonejs.github.io/audio/salamander/",
        onload: () => {
          samplerReady = true;
        },
      }).toDestination();
    })();
  }
  return toneLoadPromise;
}

// Resume the AudioContext. Call from a user gesture handler on iOS.
export async function unlockAudio(): Promise<void> {
  if (!Tone) return;
  await Tone.start();
}

export async function startPlayback(
  items: ProgressionItem[],
  _timeSignature: TimeSignature,
  bpm: number,
  onCurrentItem: (index: number) => void
): Promise<void> {
  await loadTone();
  await Tone!.start();

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

  Tone!.getTransport().bpm.value = bpm;
  Tone!.getTransport().cancel();
  Tone!.getTransport().stop();
  Tone!.getTransport().position = 0;

  let currentBeat = 0;

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const beatTime = currentBeat;
    const index = i;

    const timeInSeconds = (beatTime / bpm) * 60;

    if (item.type === "chord" && item.root && sampler && samplerReady) {
      const notes = chordToNotes(item.root, item.quality ?? "");
      const durationInSeconds = (item.beats / bpm) * 60;

      Tone!.getTransport().schedule((time) => {
        sampler!.triggerAttackRelease(notes, durationInSeconds, time);
        Tone!.getDraw().schedule(() => onCurrentItem(index), time);
      }, timeInSeconds);
    } else {
      Tone!.getTransport().schedule((time) => {
        Tone!.getDraw().schedule(() => onCurrentItem(index), time);
      }, timeInSeconds);
    }

    currentBeat += item.beats;
  }

  const totalTime = (currentBeat / bpm) * 60;
  Tone!.getTransport().schedule((time) => {
    Tone!.getDraw().schedule(() => {
      stopPlayback(onCurrentItem);
    }, time);
  }, totalTime);

  Tone!.getTransport().start();
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
