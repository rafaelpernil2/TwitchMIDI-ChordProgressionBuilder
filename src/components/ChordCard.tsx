import type { ProgressionItem } from "../lib/types";
import { useI18n } from "../lib/i18n";

interface Props {
  item: ProgressionItem;
  index: number;
  isPlaying: boolean;
  isEditing: boolean;
  totalItems: number;
  onSelect: () => void;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onDragStart: (e: DragEvent, index: number) => void;
  onDragOver: (e: DragEvent) => void;
  onDrop: (e: DragEvent, index: number) => void;
}

export default function ChordCard({
  item,
  index,
  isPlaying,
  isEditing,
  totalItems,
  onSelect,
  onRemove,
  onMoveLeft,
  onMoveRight,
  onDragStart,
  onDragOver,
  onDrop,
}: Props) {
  const { t } = useI18n();

  const label =
    item.type === "rest"
      ? t.rest
      : `${item.root ?? ""}${item.quality ?? ""}`;

  function getCardClass() {
    if (isPlaying) {
      return "bg-violet-500 text-white shadow-lg shadow-violet-500/50 scale-110 ring-2 ring-violet-300/50";
    }
    if (isEditing) {
      return "bg-amber-500/20 text-amber-200 ring-2 ring-amber-400 shadow-lg shadow-amber-500/20 scale-105";
    }
    if (item.type === "rest") {
      return "bg-[#1a1a2e]/80 text-gray-500 border-2 border-dashed border-gray-700 hover:border-amber-500/40 cursor-pointer";
    }
    return "bg-[#1a1a2e] text-gray-100 border border-gray-700/60 hover:border-amber-500/40 hover:shadow-md hover:shadow-amber-500/10 cursor-pointer";
  }

  const beatLabel = item.beats === 1 ? t.beat : t.beats.toLowerCase();

  return (
    <div
      draggable
      onClick={onSelect}
      onDragStart={(e) => onDragStart(e as unknown as DragEvent, index)}
      onDragOver={(e) => onDragOver(e as unknown as DragEvent)}
      onDrop={(e) => onDrop(e as unknown as DragEvent, index)}
      class={`group relative flex flex-col items-center gap-1 px-4 py-2.5 rounded-xl cursor-grab active:cursor-grabbing transition-all select-none ${getCardClass()}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        class="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-400 shadow-lg"
        aria-label="Remove chord"
      >
        x
      </button>
      <span class="text-sm font-bold whitespace-nowrap">{label}</span>
      <span
        class={`text-xs font-medium ${
          isPlaying
            ? "text-violet-200"
            : isEditing
              ? "text-amber-400"
              : "text-gray-500"
        }`}
      >
        {item.beats} {beatLabel}
      </span>
      <div class="flex gap-0.5 sm:hidden">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveLeft();
          }}
          disabled={index === 0}
          class="text-xs px-1.5 text-gray-500 hover:text-white disabled:opacity-20"
          aria-label="Move left"
        >
          &larr;
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoveRight();
          }}
          disabled={index === totalItems - 1}
          class="text-xs px-1.5 text-gray-500 hover:text-white disabled:opacity-20"
          aria-label="Move right"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
