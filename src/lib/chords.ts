import type { ChordDefinition } from "./types";

export const NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
] as const;

export const ENHARMONIC_MAP: Record<string, string> = {
  "C#": "Db",
  "D#": "Eb",
  "F#": "Gb",
  "G#": "Ab",
  "A#": "Bb",
};

export const FLAT_TO_SHARP: Record<string, string> = Object.fromEntries(
  Object.entries(ENHARMONIC_MAP).map(([sharp, flat]) => [flat, sharp])
);

export const NOTE_TO_SEMITONE: Record<string, number> = {
  C: 0, "C#": 1, Db: 1,
  D: 2, "D#": 3, Eb: 3,
  E: 4, F: 5, "F#": 6, Gb: 6,
  G: 7, "G#": 8, Ab: 8,
  A: 9, "A#": 10, Bb: 10,
  B: 11,
};

// All chord types from TwitchMIDI (harmonics + custom notation)
// Intervals are semitone offsets from the root
export const CHORD_DEFINITIONS: ChordDefinition[] = [
  // --- Triads / Basic ---
  { label: "Major", suffix: "", semitones: [0, 4, 7], category: "Triads" },
  { label: "Major (M)", suffix: "M", semitones: [0, 4, 7], category: "Triads" },
  { label: "Minor", suffix: "m", semitones: [0, 3, 7], category: "Triads" },
  { label: "Minor (min)", suffix: "min", semitones: [0, 3, 7], category: "Triads" },
  { label: "Diminished", suffix: "dim", semitones: [0, 3, 6], category: "Triads" },
  { label: "Augmented", suffix: "aug", semitones: [0, 4, 8], category: "Triads" },
  { label: "Power (5th)", suffix: "5", semitones: [0, 7], category: "Triads" },
  { label: "Flat 5", suffix: "Mb5", semitones: [0, 4, 6], category: "Triads" },

  // --- Suspended ---
  { label: "Sus 2", suffix: "sus2", semitones: [0, 2, 7], category: "Suspended" },
  { label: "Sus 4", suffix: "sus4", semitones: [0, 5, 7], category: "Suspended" },
  { label: "Sus 2/4", suffix: "sus24", semitones: [0, 2, 5, 7], category: "Suspended" },
  { label: "4th", suffix: "4", semitones: [0, 5, 7], category: "Suspended" },

  // --- Sixths ---
  { label: "6th", suffix: "6", semitones: [0, 4, 7, 9], category: "Sixths" },
  { label: "Minor 6", suffix: "m6", semitones: [0, 3, 7, 9], category: "Sixths" },
  { label: "Minor 6 (min6)", suffix: "min6", semitones: [0, 3, 7, 9], category: "Sixths" },
  { label: "6/9", suffix: "6/9", semitones: [0, 4, 7, 9, 14], category: "Sixths" },

  // --- Sevenths ---
  { label: "Dominant 7", suffix: "7", semitones: [0, 4, 7, 10], category: "Sevenths" },
  { label: "Major 7", suffix: "maj7", semitones: [0, 4, 7, 11], category: "Sevenths" },
  { label: "Minor 7", suffix: "m7", semitones: [0, 3, 7, 10], category: "Sevenths" },
  { label: "Minor 7 (min7)", suffix: "min7", semitones: [0, 3, 7, 10], category: "Sevenths" },
  { label: "Dim 7", suffix: "dim7", semitones: [0, 3, 6, 9], category: "Sevenths" },
  { label: "Half-dim (m7b5)", suffix: "m7b5", semitones: [0, 3, 6, 10], category: "Sevenths" },
  { label: "Half-dim (min7b5)", suffix: "min7b5", semitones: [0, 3, 6, 10], category: "Sevenths" },
  { label: "Min/Maj 7", suffix: "m/ma7", semitones: [0, 3, 7, 11], category: "Sevenths" },
  { label: "Min/Maj 7 (min/ma7)", suffix: "min/ma7", semitones: [0, 3, 7, 11], category: "Sevenths" },
  { label: "7 no5", suffix: "7no5", semitones: [0, 4, 10], category: "Sevenths" },
  { label: "Maj7 b5", suffix: "M7b5", semitones: [0, 4, 6, 11], category: "Sevenths" },
  { label: "7 b5", suffix: "7b5", semitones: [0, 4, 6, 10], category: "Sevenths" },
  { label: "Maj7 b6", suffix: "M7b6", semitones: [0, 4, 7, 8, 11], category: "Sevenths" },
  { label: "7 b6", suffix: "7b6", semitones: [0, 4, 7, 8, 10], category: "Sevenths" },
  { label: "7 add6", suffix: "7add6", semitones: [0, 4, 7, 9, 10], category: "Sevenths" },
  { label: "Maj7 #5", suffix: "maj7#5", semitones: [0, 4, 8, 11], category: "Sevenths" },
  { label: "7 #5", suffix: "7#5", semitones: [0, 4, 8, 10], category: "Sevenths" },
  { label: "dim M7", suffix: "oM7", semitones: [0, 3, 6, 11], category: "Sevenths" },
  { label: "dim7 M7", suffix: "o7M7", semitones: [0, 3, 6, 9, 11], category: "Sevenths" },
  { label: "m #5", suffix: "m#5", semitones: [0, 3, 8], category: "Sevenths" },
  { label: "m #5 (min#5)", suffix: "min#5", semitones: [0, 3, 8], category: "Sevenths" },
  { label: "mb6M7", suffix: "mb6M7", semitones: [0, 3, 8, 11], category: "Sevenths" },
  { label: "mb6M7 (minb6M7)", suffix: "minb6M7", semitones: [0, 3, 8, 11], category: "Sevenths" },
  { label: "m7 #5", suffix: "m7#5", semitones: [0, 3, 8, 10], category: "Sevenths" },
  { label: "m7 #5 (min7#5)", suffix: "min7#5", semitones: [0, 3, 8, 10], category: "Sevenths" },
  { label: "mMaj7 b6", suffix: "mMaj7b6", semitones: [0, 3, 7, 8, 11], category: "Sevenths" },
  { label: "mMaj7 b6 (minMaj7b6)", suffix: "minMaj7b6", semitones: [0, 3, 7, 8, 11], category: "Sevenths" },
  { label: "7 b13", suffix: "7b13", semitones: [0, 4, 7, 10, 20], category: "Sevenths" },

  // --- Sus 4 Sevenths ---
  { label: "Maj7 sus4", suffix: "M7sus4", semitones: [0, 5, 7, 11], category: "Sus Sevenths" },
  { label: "7 sus4", suffix: "7sus4", semitones: [0, 5, 7, 10], category: "Sus Sevenths" },
  { label: "Maj7#5 sus4", suffix: "M7#5sus4", semitones: [0, 5, 8, 11], category: "Sus Sevenths" },
  { label: "7#5 sus4", suffix: "7#5sus4", semitones: [0, 5, 8, 10], category: "Sus Sevenths" },

  // --- Ninths ---
  { label: "Dominant 9", suffix: "9", semitones: [0, 4, 7, 10, 14], category: "Ninths" },
  { label: "Major 9", suffix: "maj9", semitones: [0, 4, 7, 11, 14], category: "Ninths" },
  { label: "Minor 9", suffix: "m9", semitones: [0, 3, 7, 10, 14], category: "Ninths" },
  { label: "Minor 9 (min9)", suffix: "min9", semitones: [0, 3, 7, 10, 14], category: "Ninths" },
  { label: "Add 9", suffix: "Madd9", semitones: [0, 4, 7, 14], category: "Ninths" },
  { label: "mAdd9", suffix: "madd9", semitones: [0, 3, 7, 14], category: "Ninths" },
  { label: "mAdd9 (minAdd9)", suffix: "minadd9", semitones: [0, 3, 7, 14], category: "Ninths" },
  { label: "mM9", suffix: "mM9", semitones: [0, 3, 7, 11, 14], category: "Ninths" },
  { label: "mM9 (minM9)", suffix: "minM9", semitones: [0, 3, 7, 11, 14], category: "Ninths" },
  { label: "9 no5", suffix: "9no5", semitones: [0, 4, 10, 14], category: "Ninths" },
  { label: "9 sus4", suffix: "9sus4", semitones: [0, 5, 7, 10, 14], category: "Ninths" },
  { label: "Maj9 sus4", suffix: "M9sus4", semitones: [0, 5, 7, 11, 14], category: "Ninths" },
  { label: "Maj9#5 sus4", suffix: "M9#5sus4", semitones: [0, 5, 8, 11, 14], category: "Ninths" },
  { label: "M#5 add9", suffix: "M#5add9", semitones: [0, 4, 8, 14], category: "Ninths" },
  { label: "Maj9 #5", suffix: "maj9#5", semitones: [0, 4, 8, 11, 14], category: "Ninths" },
  { label: "9 #5", suffix: "9#5", semitones: [0, 4, 8, 10, 14], category: "Ninths" },
  { label: "9 b5", suffix: "9b5", semitones: [0, 4, 6, 10, 14], category: "Ninths" },
  { label: "M9 b5", suffix: "M9b5", semitones: [0, 4, 6, 11, 14], category: "Ninths" },
  { label: "9 b13", suffix: "9b13", semitones: [0, 4, 7, 10, 14, 20], category: "Ninths" },
  { label: "m9 #5", suffix: "m9#5", semitones: [0, 3, 8, 10, 14], category: "Ninths" },
  { label: "m9 #5 (min9#5)", suffix: "min9#5", semitones: [0, 3, 8, 10, 14], category: "Ninths" },
  { label: "m9 b5", suffix: "m9b5", semitones: [0, 3, 6, 10, 14], category: "Ninths" },
  { label: "m9 b5 (min9b5)", suffix: "min9b5", semitones: [0, 3, 6, 10, 14], category: "Ninths" },
  { label: "m69", suffix: "m69", semitones: [0, 3, 7, 9, 14], category: "Ninths" },
  { label: "m69 (min69)", suffix: "min69", semitones: [0, 3, 7, 9, 14], category: "Ninths" },
  { label: "mMaj9 b6", suffix: "mMaj9b6", semitones: [0, 3, 7, 8, 11, 14], category: "Ninths" },
  { label: "mMaj9 b6 (minMaj9b6)", suffix: "minMaj9b6", semitones: [0, 3, 7, 8, 11, 14], category: "Ninths" },
  { label: "Add b9", suffix: "Maddb9", semitones: [0, 4, 7, 13], category: "Ninths" },
  { label: "Add #9", suffix: "add#9", semitones: [0, 4, 7, 15], category: "Ninths" },

  // --- Altered Ninths ---
  { label: "7 #9", suffix: "7#9", semitones: [0, 4, 7, 10, 15], category: "Altered" },
  { label: "7 b9", suffix: "7b9", semitones: [0, 4, 7, 10, 13], category: "Altered" },
  { label: "Maj7 b9", suffix: "M7b9", semitones: [0, 4, 7, 11, 13], category: "Altered" },
  { label: "7 b9 #9", suffix: "7b9#9", semitones: [0, 4, 7, 10, 13, 15], category: "Altered" },
  { label: "7#5 b9", suffix: "7#5b9", semitones: [0, 4, 8, 10, 13], category: "Altered" },
  { label: "7#5 #9", suffix: "7#5#9", semitones: [0, 4, 8, 10, 15], category: "Altered" },
  { label: "Alt 7", suffix: "alt7", semitones: [0, 4, 6, 10, 13], category: "Altered" },
  { label: "b9 sus", suffix: "b9sus", semitones: [0, 5, 7, 10, 13], category: "Altered" },
  { label: "mb6 b9", suffix: "mb6b9", semitones: [0, 3, 8, 13], category: "Altered" },
  { label: "mb6 b9 (minb6b9)", suffix: "minb6b9", semitones: [0, 3, 8, 13], category: "Altered" },
  { label: "7 b9 b13", suffix: "7b9b13", semitones: [0, 4, 7, 10, 13, 20], category: "Altered" },
  { label: "7sus4 b9 b13", suffix: "7sus4b9b13", semitones: [0, 5, 7, 10, 13, 20], category: "Altered" },

  // --- Elevenths ---
  { label: "11th", suffix: "11", semitones: [0, 4, 7, 10, 14, 17], category: "Elevenths" },
  { label: "11 b9", suffix: "11b9", semitones: [0, 4, 7, 10, 13, 17], category: "Elevenths" },
  { label: "m11", suffix: "m11", semitones: [0, 3, 7, 10, 14, 17], category: "Elevenths" },
  { label: "m11 (min11)", suffix: "min11", semitones: [0, 3, 7, 10, 14, 17], category: "Elevenths" },
  { label: "m11A", suffix: "m11A", semitones: [0, 3, 7, 11, 14, 17], category: "Elevenths" },
  { label: "m11A (min11A)", suffix: "min11A", semitones: [0, 3, 7, 11, 14, 17], category: "Elevenths" },
  { label: "Maj #4", suffix: "maj#4", semitones: [0, 4, 6, 7], category: "Elevenths" },
  { label: "7 #11", suffix: "7#11", semitones: [0, 4, 7, 10, 18], category: "Elevenths" },
  { label: "Maj9 #11", suffix: "maj9#11", semitones: [0, 4, 7, 11, 14, 18], category: "Elevenths" },
  { label: "9 #11", suffix: "9#11", semitones: [0, 4, 7, 10, 14, 18], category: "Elevenths" },
  { label: "69 #11", suffix: "69#11", semitones: [0, 4, 7, 9, 14, 18], category: "Elevenths" },
  { label: "M6 #11", suffix: "M6#11", semitones: [0, 4, 7, 9, 18], category: "Elevenths" },
  { label: "9#5 #11", suffix: "9#5#11", semitones: [0, 4, 8, 10, 14, 18], category: "Elevenths" },
  { label: "7#9 #11", suffix: "7#9#11", semitones: [0, 4, 7, 10, 15, 18], category: "Elevenths" },
  { label: "Maj7#9 #11", suffix: "maj7#9#11", semitones: [0, 4, 7, 11, 15, 18], category: "Elevenths" },
  { label: "7#5b9 #11", suffix: "7#5b9#11", semitones: [0, 4, 8, 10, 13, 18], category: "Elevenths" },
  { label: "7b9 #11", suffix: "7b9#11", semitones: [0, 4, 7, 10, 13, 18], category: "Elevenths" },
  { label: "7#11 b13", suffix: "7#11b13", semitones: [0, 4, 7, 10, 18, 20], category: "Elevenths" },
  { label: "9#11 b13", suffix: "9#11b13", semitones: [0, 4, 7, 10, 14, 18, 20], category: "Elevenths" },
  { label: "7#9 b13", suffix: "7#9b13", semitones: [0, 4, 7, 10, 15, 20], category: "Elevenths" },
  { label: "7#9#11 b13", suffix: "7#9#11b13", semitones: [0, 4, 7, 10, 15, 18, 20], category: "Elevenths" },
  { label: "7b9b13 #11", suffix: "7b9b13#11", semitones: [0, 4, 7, 10, 13, 18, 20], category: "Elevenths" },
  { label: "mAdd4", suffix: "madd4", semitones: [0, 3, 5, 7], category: "Elevenths" },
  { label: "mAdd4 (minAdd4)", suffix: "minadd4", semitones: [0, 3, 5, 7], category: "Elevenths" },
  { label: "m7 add11", suffix: "m7add11", semitones: [0, 3, 7, 10, 17], category: "Elevenths" },
  { label: "m7 add11 (min7add11)", suffix: "min7add11", semitones: [0, 3, 7, 10, 17], category: "Elevenths" },

  // --- Thirteenths ---
  { label: "13th", suffix: "13", semitones: [0, 4, 7, 10, 14, 21], category: "Thirteenths" },
  { label: "Maj 13", suffix: "maj13", semitones: [0, 4, 7, 11, 14, 21], category: "Thirteenths" },
  { label: "m13", suffix: "m13", semitones: [0, 3, 7, 10, 14, 21], category: "Thirteenths" },
  { label: "m13 (min13)", suffix: "min13", semitones: [0, 3, 7, 10, 14, 21], category: "Thirteenths" },
  { label: "Maj7 add13", suffix: "M7add13", semitones: [0, 4, 7, 11, 21], category: "Thirteenths" },
  { label: "13 no5", suffix: "13no5", semitones: [0, 4, 10, 14, 21], category: "Thirteenths" },
  { label: "13 sus4", suffix: "13sus4", semitones: [0, 5, 7, 10, 14, 21], category: "Thirteenths" },
  { label: "13 b5", suffix: "13b5", semitones: [0, 4, 6, 10, 14, 21], category: "Thirteenths" },
  { label: "M13 #11", suffix: "M13#11", semitones: [0, 4, 7, 11, 14, 18, 21], category: "Thirteenths" },
  { label: "13 #11", suffix: "13#11", semitones: [0, 4, 7, 10, 14, 18, 21], category: "Thirteenths" },
  { label: "13 #9", suffix: "13#9", semitones: [0, 4, 7, 10, 15, 21], category: "Thirteenths" },
  { label: "13 b9", suffix: "13b9", semitones: [0, 4, 7, 10, 13, 21], category: "Thirteenths" },
  { label: "13#9 #11", suffix: "13#9#11", semitones: [0, 4, 7, 10, 15, 18, 21], category: "Thirteenths" },
  { label: "13b9 #11", suffix: "13b9#11", semitones: [0, 4, 7, 10, 13, 18, 21], category: "Thirteenths" },
];

const SUFFIX_TO_SEMITONES = new Map(
  CHORD_DEFINITIONS.map((d) => [d.suffix, d.semitones])
);

const SEMITONE_TO_NOTE = [
  "C", "C#", "D", "D#", "E", "F",
  "F#", "G", "G#", "A", "A#", "B",
];

export function chordToNotes(root: string, quality: string, octave = 4): string[] {
  const rootSemitone = NOTE_TO_SEMITONE[root] ?? 0;
  const intervals = SUFFIX_TO_SEMITONES.get(quality) ?? [0, 4, 7];

  return intervals.map((interval) => {
    const absoluteSemitone = rootSemitone + interval;
    const noteOctave = octave + Math.floor(absoluteSemitone / 12);
    const noteIndex = ((absoluteSemitone % 12) + 12) % 12;
    return `${SEMITONE_TO_NOTE[noteIndex]}${noteOctave}`;
  });
}
