import type { ProgressionItem, TimeSignature } from "./types";
import { chordToNotes } from "./chords";

let Tone: typeof import("tone") | null = null;
let sampler: import("tone").Sampler | null = null;
let samplerReady = false;
let toneLoadPromise: Promise<void> | null = null;
let audioUnlocked = false;
const debugLog: string[] = [];
function ts() { return new Date().toISOString().slice(11, 23); }

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

// Load Tone.js module eagerly (call on mount, not on gesture).
// This does NOT start the AudioContext — just loads the JS + creates the sampler.
export function loadTone(): Promise<void> {
  if (!toneLoadPromise) {
    debugLog.push(`[${ts()}] loadTone: starting import`);
    toneLoadPromise = (async () => {
      try {
        Tone = await import("tone");
        debugLog.push(`[${ts()}] loadTone: import done, ctx state=${Tone.getContext().state}`);
        sampler = new Tone.Sampler({
          urls: PIANO_SAMPLES,
          release: 1,
          baseUrl: "https://tonejs.github.io/audio/salamander/",
          onload: () => {
            samplerReady = true;
            debugLog.push(`[${ts()}] loadTone: samples loaded`);
          },
        }).toDestination();
        debugLog.push(`[${ts()}] loadTone: sampler created`);
      } catch (e: any) {
        debugLog.push(`[${ts()}] loadTone ERROR: ${e?.message ?? e}`);
        throw e;
      }
    })();
  }
  return toneLoadPromise;
}

// Unlock/resume the AudioContext. MUST be called from a user gesture
// handler (click/touchend). On iOS Safari, the AudioContext starts
// suspended and can only be resumed inside a user gesture.
export async function unlockAudio(): Promise<void> {
  debugLog.push(`[${ts()}] unlockAudio: Tone=${!!Tone}, ctx=${Tone ? Tone.getContext().state : 'n/a'}`);
  if (!Tone) {
    debugLog.push(`[${ts()}] unlockAudio: Tone not loaded, skipping`);
    return;
  }
  try {
    await Tone.start();
    audioUnlocked = true;
    debugLog.push(`[${ts()}] unlockAudio: done, ctx=${Tone.getContext().state}`);
  } catch (e: any) {
    debugLog.push(`[${ts()}] unlockAudio ERROR: ${e?.message ?? e}`);
  }
}

export async function startPlayback(
  items: ProgressionItem[],
  _timeSignature: TimeSignature,
  bpm: number,
  onCurrentItem: (index: number) => void
): Promise<void> {
  debugLog.push(`[${ts()}] startPlayback: begin`);

  // Ensure Tone is loaded
  await loadTone();
  debugLog.push(`[${ts()}] startPlayback: tone loaded, ctx=${Tone!.getContext().state}`);

  // Resume AudioContext (may already be running)
  await Tone!.start();
  debugLog.push(`[${ts()}] startPlayback: after Tone.start(), ctx=${Tone!.getContext().state}`);

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
  debugLog.push(`[${ts()}] startPlayback: transport started, state=${Tone!.getTransport().state}`);
}

// Debug helper — returns current state of audio internals
export function getDebugInfo(): { state: Record<string, string>; log: string[] } {
  const state: Record<string, string> = {};
  state["Tone loaded"] = Tone ? "yes" : "no";
  state["Sampler created"] = sampler ? "yes" : "no";
  state["Samples ready"] = samplerReady ? "yes" : "no";
  state["Audio unlocked"] = audioUnlocked ? "yes" : "no";
  state["UA"] = typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 80) : "n/a";
  if (Tone) {
    try {
      const ctx = Tone.getContext();
      state["Context state"] = ctx.state;
      state["Context sampleRate"] = String((ctx.rawContext as AudioContext).sampleRate);
      state["Transport state"] = Tone.getTransport().state;
    } catch (e: any) {
      state["Context error"] = e?.message ?? String(e);
    }
  }
  return { state, log: debugLog };
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
