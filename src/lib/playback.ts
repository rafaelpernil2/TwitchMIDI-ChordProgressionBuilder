import type { ProgressionItem, TimeSignature } from "./types";
import { chordToNotes } from "./chords";

let Tone: typeof import("tone") | null = null;
let synth: import("tone").PolySynth | null = null;

async function ensureTone() {
  if (!Tone) {
    Tone = await import("tone");
  }
  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 0.8 },
      volume: -8,
    }).toDestination();
  }
  return Tone;
}

export async function startPlayback(
  items: ProgressionItem[],
  _timeSignature: TimeSignature,
  bpm: number,
  onCurrentItem: (index: number) => void
): Promise<void> {
  const T = await ensureTone();
  await T.start();

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

    if (item.type === "chord" && item.root && synth) {
      const notes = chordToNotes(item.root, item.quality ?? "");
      const durationInSeconds = (item.beats / bpm) * 60;

      T.getTransport().schedule((time) => {
        synth!.triggerAttackRelease(notes, durationInSeconds, time);
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
  if (synth) {
    synth.releaseAll();
  }
  onCurrentItem(-1);
}
