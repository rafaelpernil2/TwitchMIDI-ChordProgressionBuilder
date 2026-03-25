import { useI18n } from "../lib/i18n";

interface Props {
  bpm: number;
  isPlaying: boolean;
  disabled: boolean;
  onBpmChange: (bpm: number) => void;
  onPlay: () => void;
  onStop: () => void;
}

export default function PlaybackControls({
  bpm,
  isPlaying,
  disabled,
  onBpmChange,
  onPlay,
  onStop,
}: Props) {
  const { t } = useI18n();

  return (
    <div class="flex items-center gap-3 flex-wrap">
      <label class="text-sm font-semibold text-orange-300 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
        BPM:
        <input
          type="number"
          min="35"
          max="400"
          value={bpm}
          onInput={(e) => {
            const val = parseInt((e.target as HTMLInputElement).value);
            if (!isNaN(val)) onBpmChange(Math.max(35, Math.min(400, val)));
          }}
          class="w-12 bg-transparent text-white text-sm font-bold text-center focus:outline-none focus:border-b focus:border-orange-400"
          style="-moz-appearance: textfield; appearance: textfield;"
        />
      </label>
      <input
        type="range"
        min="35"
        max="400"
        value={bpm}
        onInput={(e) =>
          onBpmChange(parseInt((e.target as HTMLInputElement).value))
        }
        class="flex-1 min-w-[120px] accent-orange-500"
      />
      <button
        onClick={isPlaying ? onStop : onPlay}
        disabled={disabled}
        class={`w-28 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none ${
          isPlaying
            ? "bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/30"
            : "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/30"
        }`}
      >
        {isPlaying ? t.stop : t.play}
      </button>
    </div>
  );
}
