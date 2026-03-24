interface Props {
  value: number;
  onChange: (beats: number) => void;
}

const QUICK_BEATS = [1, 2, 3, 4];

export default function BeatDurationSelector({ value, onChange }: Props) {
  return (
    <div class="space-y-2">
      <label class="text-sm font-semibold text-sky-300 uppercase tracking-wider">
        Beats
      </label>
      <div class="flex items-center gap-2">
        {QUICK_BEATS.map((b) => (
          <button
            key={b}
            onClick={() => onChange(b)}
            class={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${
              value === b
                ? "bg-sky-500 text-white shadow-lg shadow-sky-500/40"
                : "bg-[#1a1a2e] text-gray-300 hover:bg-gray-800 hover:text-white border border-gray-700/40"
            }`}
          >
            {b}
          </button>
        ))}
        <input
          type="number"
          min="1"
          max="32"
          value={value}
          onChange={(e) =>
            onChange(
              Math.max(1, parseInt((e.target as HTMLInputElement).value) || 4)
            )
          }
          class="w-14 px-2 py-2 rounded-lg bg-[#1a1a2e] text-white text-sm text-center font-bold border border-gray-700/50 focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30 focus:outline-none transition-all"
        />
      </div>
    </div>
  );
}
