import { useState, useCallback } from "preact/hooks";
import type { TimeSignature, ProgressionItem } from "../lib/types";
import { formatSendloop } from "../lib/formatter";
import { startPlayback, stopPlayback } from "../lib/playback";
import TimeSignatureSelector from "./TimeSignatureSelector";
import NoteSelector from "./NoteSelector";
import ChordTypeSelector from "./ChordTypeSelector";
import BeatDurationSelector from "./BeatDurationSelector";
import ChordStrip from "./ChordStrip";
import OutputBar from "./OutputBar";
import PlaybackControls from "./PlaybackControls";

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export default function App() {
  const [timeSignature, setTimeSignature] = useState<TimeSignature>({
    numerator: 4,
    denominator: 4,
  });
  const [items, setItems] = useState<ProgressionItem[]>([]);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState<string | null>(null);
  const [beats, setBeats] = useState(4);
  const [useFlats, setUseFlats] = useState(false);
  const [bpm, setBpm] = useState(120);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(-1);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const output = formatSendloop(timeSignature, items);
  const isEditing = editingIndex !== null;
  const editingItem = isEditing ? items[editingIndex] : null;

  function selectForEditing(index: number) {
    const item = items[index];
    if (item.type === "rest") {
      setEditingIndex(index);
      setSelectedNote(null);
      setSelectedQuality(null);
      setBeats(item.beats);
    } else {
      setEditingIndex(index);
      setSelectedNote(item.root ?? null);
      setSelectedQuality(item.quality ?? null);
      setBeats(item.beats);
    }
  }

  function cancelEditing() {
    setEditingIndex(null);
    setSelectedNote(null);
    setSelectedQuality(null);
    setBeats(4);
  }

  function addOrUpdateChord() {
    if (!selectedNote || selectedQuality === null) return;

    if (isEditing) {
      setItems((prev) =>
        prev.map((item, i) =>
          i === editingIndex
            ? { ...item, type: "chord", root: selectedNote, quality: selectedQuality, beats }
            : item
        )
      );
      setEditingIndex(null);
    } else {
      const newItem: ProgressionItem = {
        id: generateId(),
        type: "chord",
        root: selectedNote,
        quality: selectedQuality,
        beats,
      };
      setItems((prev) => [...prev, newItem]);
    }
  }

  function addOrUpdateRest() {
    if (isEditing) {
      setItems((prev) =>
        prev.map((item, i) =>
          i === editingIndex
            ? { ...item, type: "rest", root: undefined, quality: undefined, beats }
            : item
        )
      );
      setEditingIndex(null);
    } else {
      const newItem: ProgressionItem = {
        id: generateId(),
        type: "rest",
        beats,
      };
      setItems((prev) => [...prev, newItem]);
    }
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
    if (editingIndex === index) {
      cancelEditing();
    } else if (editingIndex !== null && index < editingIndex) {
      setEditingIndex(editingIndex - 1);
    }
  }

  function reorderItems(from: number, to: number) {
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    if (editingIndex !== null) {
      if (editingIndex === from) {
        setEditingIndex(to);
      } else if (from < editingIndex && to >= editingIndex) {
        setEditingIndex(editingIndex - 1);
      } else if (from > editingIndex && to <= editingIndex) {
        setEditingIndex(editingIndex + 1);
      }
    }
  }

  function clearAll() {
    setItems([]);
    cancelEditing();
  }

  const handleCurrentItem = useCallback((index: number) => {
    setCurrentPlayingIndex(index);
    if (index === -1) {
      setIsPlaying(false);
    }
  }, []);

  async function handlePlay() {
    if (items.length === 0) return;
    setIsPlaying(true);
    await startPlayback(items, timeSignature, bpm, handleCurrentItem);
  }

  async function handleStop() {
    await stopPlayback(handleCurrentItem);
    setIsPlaying(false);
  }

  const chordLabel =
    selectedNote && selectedQuality !== null
      ? `${selectedNote}${selectedQuality}`
      : "Chord";

  return (
    <div class="space-y-5">
      {/* Time Signature */}
      <section class="bg-[#12121e] rounded-2xl p-5 border border-violet-500/10 shadow-lg shadow-violet-500/5">
        <TimeSignatureSelector value={timeSignature} onChange={setTimeSignature} />
      </section>

      {/* Chord Builder */}
      <section
        class={`bg-[#12121e] rounded-2xl p-5 space-y-4 border shadow-lg transition-all ${
          isEditing
            ? "border-amber-500/30 shadow-amber-500/5"
            : "border-emerald-500/10 shadow-emerald-500/5"
        }`}
      >
        {isEditing && (
          <div class="flex items-center justify-between">
            <span class="text-sm font-semibold text-amber-300 uppercase tracking-wider">
              Editing chord {editingIndex! + 1}
              {editingItem?.type === "rest"
                ? " (rest)"
                : editingItem?.root
                  ? ` (${editingItem.root}${editingItem.quality ?? ""})`
                  : ""}
            </span>
            <button
              onClick={cancelEditing}
              class="text-xs font-bold text-gray-500 hover:text-white px-2 py-1 rounded bg-[#1a1a2e] hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
          </div>
        )}

        <NoteSelector
          selected={selectedNote}
          useFlats={useFlats}
          onSelect={setSelectedNote}
          onToggleFlats={() => setUseFlats((f) => !f)}
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChordTypeSelector
            selected={selectedQuality}
            selectedNote={selectedNote}
            onSelect={setSelectedQuality}
          />
          <div class="space-y-4">
            <BeatDurationSelector value={beats} onChange={setBeats} />
            <div class="flex gap-2">
              <button
                onClick={addOrUpdateChord}
                disabled={!selectedNote || selectedQuality === null}
                class={`flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none ${
                  isEditing
                    ? "bg-amber-500 text-black hover:bg-amber-400 shadow-amber-500/20"
                    : "bg-violet-600 text-white hover:bg-violet-500 shadow-violet-600/20"
                }`}
              >
                {isEditing ? `Update ${chordLabel}` : `+ Add ${chordLabel}`}
              </button>
              <button
                onClick={addOrUpdateRest}
                class={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  isEditing
                    ? "bg-amber-500/20 text-amber-300 border-2 border-dashed border-amber-500/40 hover:border-amber-400"
                    : "bg-[#1a1a2e] text-gray-400 hover:bg-gray-800 hover:text-white border-2 border-dashed border-gray-700/50 hover:border-gray-600"
                }`}
              >
                {isEditing ? "Set Rest" : "+ Rest"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Chord Strip */}
      <section class="bg-[#12121e] rounded-2xl p-5 border border-pink-500/10 shadow-lg shadow-pink-500/5">
        <ChordStrip
          items={items}
          currentPlayingIndex={currentPlayingIndex}
          editingIndex={editingIndex}
          onSelect={selectForEditing}
          onReorder={reorderItems}
          onRemove={removeItem}
        />
        {items.length > 0 && (
          <div class="mt-3 flex justify-end">
            <button
              onClick={clearAll}
              class="text-xs font-medium text-gray-600 hover:text-red-400 transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </section>

      {/* Output & Playback */}
      <section class="bg-[#12121e] rounded-2xl p-5 border border-rose-500/10 shadow-lg shadow-rose-500/5 space-y-2">
        <OutputBar output={output} />
        <PlaybackControls
          bpm={bpm}
          isPlaying={isPlaying}
          disabled={items.length === 0}
          onBpmChange={setBpm}
          onPlay={handlePlay}
          onStop={handleStop}
        />
      </section>
    </div>
  );
}
