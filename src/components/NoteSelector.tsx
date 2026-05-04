import { ENHARMONIC_MAP, NOTE_TO_SEMITONE } from "../lib/chords";
import { useI18n } from "../lib/i18n";

interface Props {
  selected: string | null;
  useFlats: boolean;
  onSelect: (note: string) => void;
  onToggleFlats: () => void;
}

const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"];
const BLACK_KEYS: { note: string; afterIndex: number }[] = [
  { note: "C#", afterIndex: 0 },
  { note: "D#", afterIndex: 1 },
  { note: "F#", afterIndex: 3 },
  { note: "G#", afterIndex: 4 },
  { note: "A#", afterIndex: 5 },
];

const BLACK_KEY_WIDTH_PCT = (100 / 7) * 0.6;

export default function NoteSelector({
  selected,
  useFlats,
  onSelect,
  onToggleFlats,
}: Props) {
  const { t } = useI18n();

  const selectedSemitone =
    selected != null ? NOTE_TO_SEMITONE[selected] : undefined;

  function isNoteSelected(note: string): boolean {
    return (
      selectedSemitone !== undefined &&
      NOTE_TO_SEMITONE[note] === selectedSemitone
    );
  }

  function displayNote(note: string): string {
    if (useFlats && ENHARMONIC_MAP[note]) {
      return ENHARMONIC_MAP[note];
    }
    return note;
  }

  function noteValue(note: string): string {
    if (useFlats && ENHARMONIC_MAP[note]) {
      return ENHARMONIC_MAP[note];
    }
    return note;
  }

  return (
    <div class="space-y-2">
      <div class="flex items-center justify-between">
        <label class="text-sm font-semibold text-emerald-300 uppercase tracking-wider">
          {t.rootNote}
        </label>
        <button
          onClick={onToggleFlats}
          class="text-xs px-2.5 py-1 rounded-md bg-[#1a1a2e] text-gray-300 hover:text-white border border-gray-700/50 hover:border-violet-500/50 transition-all"
        >
          {useFlats ? `♭ ${t.flats}` : `♯ ${t.sharps}`}
        </button>
      </div>
      <div class="relative w-full h-32 sm:h-40 select-none rounded-lg overflow-hidden bg-black/30 p-1">
        <div class="flex h-full w-full gap-0.5">
          {WHITE_KEYS.map((note) => {
            const val = noteValue(note);
            const isSelected = isNoteSelected(note);
            return (
              <button
                key={note}
                type="button"
                onClick={() => onSelect(val)}
                class={`flex-1 flex items-end justify-center pb-2 rounded-b-md text-sm font-bold transition-all border ${
                  isSelected
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-400/60 border-emerald-400"
                    : "bg-gray-100 text-gray-800 hover:bg-emerald-100 border-gray-300 active:bg-emerald-200"
                }`}
              >
                {displayNote(note)}
              </button>
            );
          })}
        </div>
        <div class="absolute inset-0 p-1 pointer-events-none">
          <div class="relative w-full h-full">
            {BLACK_KEYS.map(({ note, afterIndex }) => {
              const val = noteValue(note);
              const isSelected = isNoteSelected(note);
              const leftPct =
                ((afterIndex + 1) * 100) / 7 - BLACK_KEY_WIDTH_PCT / 2;
              return (
                <button
                  key={note}
                  type="button"
                  onClick={() => onSelect(val)}
                  style={{
                    left: `${leftPct}%`,
                    width: `${BLACK_KEY_WIDTH_PCT}%`,
                  }}
                  class={`absolute top-0 h-[62%] flex items-end justify-center pb-1.5 rounded-b-md text-[10px] sm:text-xs font-bold pointer-events-auto transition-all border shadow-md ${
                    isSelected
                      ? "bg-emerald-500 text-white shadow-emerald-500/40 ring-2 ring-emerald-400/60 border-emerald-400 z-10"
                      : "bg-gray-900 text-gray-200 hover:bg-gray-800 border-black"
                  }`}
                >
                  {displayNote(note)}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
