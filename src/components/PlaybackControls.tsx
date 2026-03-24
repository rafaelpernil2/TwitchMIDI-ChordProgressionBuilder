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
  return (
    <div class="flex items-center gap-3 flex-wrap">
      <label class="text-sm font-semibold text-orange-300 uppercase tracking-wider whitespace-nowrap">
        BPM: <span class="text-white">{bpm}</span>
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
        class={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none ${
          isPlaying
            ? "bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/30"
            : "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/30"
        }`}
      >
        {isPlaying ? "Stop" : "Play"}
      </button>
    </div>
  );
}
