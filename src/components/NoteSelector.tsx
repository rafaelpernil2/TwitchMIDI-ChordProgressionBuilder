import { NOTES, ENHARMONIC_MAP } from "../lib/chords";
import { useI18n } from "../lib/i18n";

interface Props {
  selected: string | null;
  useFlats: boolean;
  onSelect: (note: string) => void;
  onToggleFlats: () => void;
}

export default function NoteSelector({
  selected,
  useFlats,
  onSelect,
  onToggleFlats,
}: Props) {
  const { t } = useI18n();

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
      <div class="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
        {NOTES.map((note) => {
          const val = noteValue(note);
          const isSelected = selected === val;
          const isAccidental = note.includes("#");
          return (
            <button
              key={note}
              onClick={() => onSelect(val)}
              class={`py-2.5 px-1 rounded-lg text-sm font-bold transition-all ${
                isSelected
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/40 scale-105 ring-2 ring-emerald-400/50"
                  : isAccidental
                    ? "bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700/60"
                    : "bg-[#1a1a2e] text-gray-200 hover:bg-gray-800 hover:text-white border border-gray-700/40"
              }`}
            >
              {displayNote(note)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
