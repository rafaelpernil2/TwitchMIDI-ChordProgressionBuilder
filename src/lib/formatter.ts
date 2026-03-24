import type { TimeSignature, ProgressionItem } from "./types";

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
