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

  const output = formatSendloop(timeSignature, items);

  function addChord() {
    if (!selectedNote || selectedQuality === null) return;
    const newItem: ProgressionItem = {
      id: generateId(),
      type: "chord",
      root: selectedNote,
      quality: selectedQuality,
      beats,
    };
    setItems((prev) => [...prev, newItem]);
  }

  function addRest() {
    const newItem: ProgressionItem = {
      id: generateId(),
      type: "rest",
      beats,
    };
    setItems((prev) => [...prev, newItem]);
  }

  function removeItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  function reorderItems(from: number, to: number) {
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }

  function clearAll() {
    setItems([]);
    setSelectedNote(null);
    setSelectedQuality(null);
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

  return (
    <div class="space-y-5">
      {/* Time Signature */}
      <section class="bg-[#12121e] rounded-2xl p-5 border border-violet-500/10 shadow-lg shadow-violet-500/5">
        <TimeSignatureSelector value={timeSignature} onChange={setTimeSignature} />
      </section>

      {/* Chord Builder */}
      <section class="bg-[#12121e] rounded-2xl p-5 border border-emerald-500/10 shadow-lg shadow-emerald-500/5 space-y-4">
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
                onClick={addChord}
                disabled={!selectedNote || selectedQuality === null}
                class="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold transition-all bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none"
              >
                + Add {selectedNote && selectedQuality !== null ? `${selectedNote}${selectedQuality}` : "Chord"}
              </button>
              <button
                onClick={addRest}
                class="px-4 py-2.5 rounded-lg bg-[#1a1a2e] text-gray-400 text-sm font-bold hover:bg-gray-800 hover:text-white border-2 border-dashed border-gray-700/50 hover:border-gray-600 transition-all"
              >
                + Rest
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
