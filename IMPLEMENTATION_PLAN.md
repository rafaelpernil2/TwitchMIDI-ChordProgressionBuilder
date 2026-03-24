# Chord Progression Builder - Implementation Plan

## Context
Build a single-page web app that lets users visually construct chord progressions in TwitchMIDI `!sendloop` format. The app needs a time signature selector, note/chord-type pickers, a visual chord strip, clipboard export, and audio playback.

## Tech Stack
- **Astro** + TypeScript
- **Preact** (interactive island via `client:load`)
- **Tailwind CSS**
- **Tone.js** (audio playback)

## File Structure

```
src/
├── layouts/Layout.astro          # HTML shell, Tailwind, favicon
├── pages/index.astro             # Single page, mounts <App client:load />
├── components/
│   ├── App.tsx                   # Root island, owns all state
│   ├── TimeSignatureSelector.tsx # Dropdown + custom inputs
│   ├── NoteSelector.tsx          # 12-button chromatic grid
│   ├── ChordTypeSelector.tsx     # Searchable quality list
│   ├── BeatDurationSelector.tsx  # Quick buttons (1-4) + input
│   ├── ChordStrip.tsx            # Horizontal scrollable strip
│   ├── ChordCard.tsx             # Individual chord chip (draggable, deletable)
│   ├── RestButton.tsx            # Inserts rest items
│   ├── OutputBar.tsx             # Shows sendloop string + copy button
│   └── PlaybackControls.tsx      # Play/Stop + BPM slider
├── lib/
│   ├── types.ts                  # ProgressionItem, TimeSignature, AppState, ChordDefinition
│   ├── chords.ts                 # NOTE_TO_SEMITONE, CHORD_INTERVALS, chordToNotes()
│   ├── formatter.ts              # formatSendloop() → output string
│   └── playback.ts               # Tone.js Transport scheduling, PolySynth
└── styles/global.css             # Tailwind directives
```

## Data Model (src/lib/types.ts)

- **TimeSignature**: `{ numerator: number, denominator: number }`
- **ProgressionItem**: `{ id: string, type: 'chord' | 'rest', root?: string, quality?: string, beats: number }`
- **ChordDefinition**: `{ label: string, suffix: string, semitones: number[] }`

Each item gets a UUID for stable reorder/removal.

## Key Implementation Details

### Chord-to-Notes (chords.ts)
- Map note names to semitone offsets (C=0 through B=11, with enharmonics)
- Define ~25 chord qualities as semitone interval arrays (e.g. maj7 = [0,4,7,11])
- `chordToNotes(root, quality, octave=4)` resolves to Tone.js note names

### Formatter (formatter.ts)
- Omit time signature prefix when 4/4 (default)
- Omit `(beats)` when beats === 4 (default)
- Output: `[3/4] Cmaj7(2) Dm7(2) rest(1) G7(3)`

### Playback (playback.ts)
- `Tone.PolySynth(Tone.Synth)` with triangle oscillator
- `Tone.Transport` for beat-accurate scheduling
- `Tone.Draw.schedule` for UI highlighting sync
- Dynamic import of Tone.js to avoid SSR issues
- `Tone.start()` called on user gesture (Play button)

### UX Flow
1. User selects a note (stays highlighted)
2. User picks a chord quality → chord auto-added to strip
3. Beat duration adjustable before adding (defaults to 4)
4. Rest button adds silence with current beat duration
5. Chord strip supports drag reorder + delete
6. Output bar shows live `!sendloop` string + copy button
7. Play button previews with synth audio, highlighting current chord

## Implementation Order

### Phase 1: Project Scaffold
- `npm create astro@latest`, add Preact + Tailwind integrations, add Tone.js
- Create Layout.astro, index.astro with logo header
- Verify dev server runs

### Phase 2: Data Layer
- Create types.ts, chords.ts, formatter.ts
- All logic, no UI

### Phase 3: Core UI
- App.tsx with state management (useState)
- NoteSelector, ChordTypeSelector, BeatDurationSelector, RestButton
- ChordCard, ChordStrip, OutputBar, TimeSignatureSelector
- Wire: note + quality click → add to progression

### Phase 4: Drag & Reorder
- HTML5 drag-and-drop on ChordCard/ChordStrip
- Mobile fallback: up/down arrow buttons on each card

### Phase 5: Audio Playback
- playback.ts with startPlayback/stopPlayback
- PlaybackControls component with BPM control
- Highlight current chord during playback

### Phase 6: Polish
- Responsive layout (stack on mobile)
- Empty state messaging
- Keyboard accessibility
- Favicon from logo_bot.svg

## Verification
1. `npm run dev` → page loads with all components
2. Select note + quality → chord appears in strip
3. Add multiple chords + rests → output bar shows correct sendloop string
4. Copy button → clipboard contains correct string
5. Play button → audio plays chords in sequence with correct timing
6. Drag reorder → strip and output update
7. Change time signature → output prefix updates
8. Mobile: layout stacks, arrow buttons work for reorder
