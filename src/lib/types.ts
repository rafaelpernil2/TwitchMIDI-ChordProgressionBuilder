export interface TimeSignature {
  numerator: number;
  denominator: number;
}

export interface ProgressionItem {
  id: string;
  type: "chord" | "rest";
  root?: string;
  quality?: string;
  beats: number;
}

export interface ChordDefinition {
  label: string;
  suffix: string;
  semitones: number[];
  category: string;
}
