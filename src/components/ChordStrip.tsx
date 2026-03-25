import { useState } from "preact/hooks";
import type { ProgressionItem } from "../lib/types";
import { useI18n } from "../lib/i18n";
import ChordCard from "./ChordCard";

interface Props {
  items: ProgressionItem[];
  currentPlayingIndex: number;
  editingIndex: number | null;
  onSelect: (index: number) => void;
  onCancelEdit: () => void;
  onReorder: (from: number, to: number) => void;
  onRemove: (index: number) => void;
}

export default function ChordStrip({
  items,
  currentPlayingIndex,
  editingIndex,
  onSelect,
  onCancelEdit,
  onReorder,
  onRemove,
}: Props) {
  const { t } = useI18n();
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  function handleDragStart(e: DragEvent, index: number) {
    setDragIndex(index);
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = "move";
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = "move";
    }
  }

  function handleDrop(e: DragEvent, targetIndex: number) {
    e.preventDefault();
    if (dragIndex !== null && dragIndex !== targetIndex) {
      onReorder(dragIndex, targetIndex);
    }
    setDragIndex(null);
  }

  function handleMoveLeft(index: number) {
    if (index > 0) onReorder(index, index - 1);
  }

  function handleMoveRight(index: number) {
    if (index < items.length - 1) onReorder(index, index + 1);
  }

  if (items.length === 0) {
    return (
      <div class="border-2 border-dashed border-gray-700/60 rounded-xl p-8 text-center">
        <p class="text-sm text-gray-500">
          {t.emptyState}
        </p>
      </div>
    );
  }

  return (
    <div class="space-y-2">
      <label class="text-sm font-semibold text-pink-300 uppercase tracking-wider">
        {t.progression} ({items.length} {items.length === 1 ? t.chord : t.chords})
        {editingIndex !== null && (
          <span class="text-amber-300 ml-2 normal-case tracking-normal">
            — {t.clickToEdit}
          </span>
        )}
      </label>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onCancelEdit();
        }}
        class="flex flex-wrap gap-2.5 p-4 bg-[#07070d] rounded-xl border border-gray-800/60 min-h-[70px]"
      >
        {items.map((item, i) => (
          <ChordCard
            key={item.id}
            item={item}
            index={i}
            isPlaying={currentPlayingIndex === i}
            isEditing={editingIndex === i}
            totalItems={items.length}
            onSelect={() => onSelect(i)}
            onRemove={() => onRemove(i)}
            onMoveLeft={() => handleMoveLeft(i)}
            onMoveRight={() => handleMoveRight(i)}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>
    </div>
  );
}
