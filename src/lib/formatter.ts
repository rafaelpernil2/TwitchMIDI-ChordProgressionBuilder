import type { TimeSignature, ProgressionItem } from "./types";
import { NOTE_TO_SEMITONE, CHORD_DEFINITIONS } from "./chords";

export function formatSendloop(
  timeSignature: TimeSignature,
  items: ProgressionItem[]
): string {
  const parts: string[] = [];

  if (timeSignature.numerator !== 4 || timeSignature.denominator !== 4) {
    parts.push(`[${timeSignature.numerator}/${timeSignature.denominator}]`);
  }

  for (const item of items) {
    if (item.type === "rest") {
      parts.push(item.beats === 4 ? "rest" : `rest(${item.beats})`);
    } else {
      const chordName = `${item.root ?? "C"}${item.quality ?? ""}`;
      parts.push(item.beats === 4 ? chordName : `${chordName}(${item.beats})`);
    }
  }

  return parts.join(" ");
}

const VALID_SUFFIXES = new Set(CHORD_DEFINITIONS.map((d) => d.suffix));

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

function parseChordToken(token: string): ProgressionItem | null {
  // Extract optional beats: token(N)
  let beats = 4;
  let body = token;
  const beatsMatch = token.match(/^(.+)\((\d+)\)$/);
  if (beatsMatch) {
    body = beatsMatch[1];
    beats = parseInt(beatsMatch[2], 10);
  }

  // Rest
  if (body.toLowerCase() === "rest") {
    return { id: generateId(), type: "rest", beats };
  }

  // Parse root note: letter A-G, optionally followed by # or b
  const noteMatch = body.match(/^([A-Ga-g][#b]?)(.*)/);
  if (!noteMatch) return null;

  let root = noteMatch[1];
  // Capitalize the note letter
  root = root[0].toUpperCase() + root.slice(1);

  // Validate it's a known note
  if (!(root in NOTE_TO_SEMITONE)) return null;

  const quality = noteMatch[2];

  // Validate quality is a known suffix (empty string = major)
  if (!VALID_SUFFIXES.has(quality)) return null;

  return { id: generateId(), type: "chord", root, quality, beats };
}

export interface ParseResult {
  timeSignature: TimeSignature;
  items: ProgressionItem[];
}

export function parseSendloop(input: string): ParseResult | null {
  let text = input.trim();

  // Strip optional !sendloop prefix
  if (text.toLowerCase().startsWith("!sendloop")) {
    text = text.slice(9).trim();
  }

  if (!text) {
    return { timeSignature: { numerator: 4, denominator: 4 }, items: [] };
  }

  // Parse optional time signature [n/d]
  let timeSignature: TimeSignature = { numerator: 4, denominator: 4 };
  const tsMatch = text.match(/^\[(\d+)\/(\d+)\]\s*/);
  if (tsMatch) {
    timeSignature = {
      numerator: parseInt(tsMatch[1], 10),
      denominator: parseInt(tsMatch[2], 10),
    };
    text = text.slice(tsMatch[0].length);
  }

  if (!text.trim()) {
    return { timeSignature, items: [] };
  }

  // Split remaining into tokens by whitespace
  const tokens = text.trim().split(/\s+/);
  const items: ProgressionItem[] = [];

  for (const token of tokens) {
    const item = parseChordToken(token);
    if (!item) return null; // invalid token → parse failure
    items.push(item);
  }

  return { timeSignature, items };
}
