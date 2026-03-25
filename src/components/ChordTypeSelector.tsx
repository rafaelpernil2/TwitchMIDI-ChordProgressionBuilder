import { useState, useEffect } from "preact/hooks";
import { CHORD_DEFINITIONS } from "../lib/chords";
import { useI18n } from "../lib/i18n";

interface Props {
  selected: string | null;
  selectedNote: string | null;
  editingIndex: number | null;
  resetKey: number;
  onSelect: (suffix: string) => void;
}

export default function ChordTypeSelector({
  selected,
  selectedNote,
  editingIndex,
  resetKey,
  onSelect,
}: Props) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch("");
  }, [editingIndex, resetKey]);

  const filtered = search
    ? CHORD_DEFINITIONS.filter(
        (d) =>
          d.label.toLowerCase().includes(search.toLowerCase()) ||
          d.suffix.toLowerCase().includes(search.toLowerCase())
      )
    : CHORD_DEFINITIONS;

  const categories = [...new Set(filtered.map((d) => d.category))];

  return (
    <div class="space-y-2">
      <label class="text-sm font-semibold text-amber-300 uppercase tracking-wider">
        {t.chordType}
      </label>
      <input
        type="text"
        placeholder={t.searchChords}
        value={search}
        onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
        class="w-full px-3 py-2 rounded-lg bg-[#1a1a2e] text-white text-sm border border-gray-700/50 focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 focus:outline-none placeholder-gray-500 transition-all"
      />
      <div class="max-h-52 overflow-y-auto space-y-3 pr-1">
        {categories.map((cat) => (
          <div key={cat}>
            <div class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              {t.categories[cat] ?? cat}
            </div>
            <div class="flex flex-wrap gap-1.5">
              {filtered
                .filter((d) => d.category === cat)
                .map((chord) => {
                  const isSelected = selected === chord.suffix;
                  const preview = selectedNote
                    ? `${selectedNote}${chord.suffix}`
                    : chord.suffix || "maj";
                  return (
                    <button
                      key={chord.suffix}
                      onClick={() => onSelect(chord.suffix)}
                      title={chord.label}
                      class={`px-2.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        isSelected
                          ? "bg-amber-500 text-black shadow-lg shadow-amber-500/30 font-bold"
                          : "bg-[#1a1a2e] text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700/40"
                      }`}
                    >
                      {preview}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
