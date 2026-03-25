# Chord Progression Builder - Implementation Plan

## Context
Build a single-page web app that lets users visually construct chord progressions in TwitchMIDI `!sendloop` format. The app needs a time signature selector, note/chord-type pickers, a visual chord strip, clipboard export, and audio playback.

## Tech Stack
- **Astro 5** + TypeScript
- **Preact** (interactive island via `client:load`)
- **Tailwind CSS**
- **Tone.js** (audio playback with piano samples)
- **Cloudflare Workers** (deployment via wrangler)

## File Structure

```
src/
├── layouts/Layout.astro          # HTML shell, Tailwind, custom scrollbar CSS
├── pages/index.astro             # Single page, mounts <App client:load />
├── components/
│   ├── App.tsx                   # Root island, owns all state, URL sync
│   ├── TimeSignatureSelector.tsx # Preset buttons (4/4, 3/4, 6/8...) + custom input
│   ├── NoteSelector.tsx          # 12-button chromatic grid with sharps/flats toggle
│   ├── ChordTypeSelector.tsx     # Searchable quality list with categories (140+ chords)
│   ├── BeatDurationSelector.tsx  # Quick buttons (1-4) + manual input
│   ├── ChordStrip.tsx            # Horizontal scrollable strip with drag-and-drop
│   ├── ChordCard.tsx             # Individual chord chip (draggable, deletable, editable)
│   ├── LanguageSwitcher.tsx      # EN/ES language toggle
│   ├── OutputBar.tsx             # Sendloop string + Copy/Raw/Share buttons + editable input
│   └── PlaybackControls.tsx      # BPM control (editable, 35-400 range) + Play/Stop
├── lib/
│   ├── types.ts                  # ProgressionItem, TimeSignature, ChordDefinition
│   ├── chords.ts                 # NOTE_TO_SEMITONE, 140+ chord definitions, chordToNotes()
│   ├── formatter.ts              # formatSendloop() / parseSendloop()
│   ├── i18n.ts                   # EN/ES translations (60+ keys), auto-locale detection
│   └── playback.ts               # Tone.js Transport scheduling, piano sample synth
└── styles/global.css             # Tailwind directives
```

## Data Model (src/lib/types.ts)

- **TimeSignature**: `{ numerator: number, denominator: number }`
- **ProgressionItem**: `{ id: string, type: 'chord' | 'rest', root?: string, quality?: string, beats: number }`
- **ChordDefinition**: `{ label: string, suffix: string, semitones: number[], category: string }`

Each item gets a UUID for stable reorder/removal.

## Key Implementation Details

### Chord-to-Notes (chords.ts)
- Map note names to semitone offsets (C=0 through B=11, with enharmonics)
- 140+ chord qualities as semitone interval arrays, organized by category (Triads, Suspended, Sixths, Sevenths, Sus Sevenths, Ninths, Altered, Elevenths, Thirteenths)
- `chordToNotes(root, quality, octave=4)` resolves to Tone.js note names

### Formatter (formatter.ts)
- `formatSendloop()` — converts progression items to sendloop string
- `parseSendloop()` — parses sendloop string back to items + time signature
- Omit time signature prefix when 4/4 (default)
- Omit `(beats)` when beats === 4 (default)
- Output: `[3/4] Cmaj7(2) Dm7(2) rest(1) G7(3)`

### Playback (playback.ts)
- Piano sample-based synthesis via Tone.js
- `Tone.Transport` for beat-accurate scheduling
- `Tone.Draw.schedule` for UI highlighting sync
- Dynamic import of Tone.js to avoid SSR issues
- `Tone.start()` called on user gesture (Play button)

### Internationalization (i18n.ts)
- English and Spanish translations (60+ keys)
- Chord category translations
- Auto-detection from `navigator.language`
- Preact Context API (`I18nContext`) for global translation access

### URL State Persistence (App.tsx)
- Chord progression is encoded in the URL hash fragment
- On mount: parses hash via `parseSendloop()` to restore state
- On output change: syncs state to hash via `history.replaceState()`
- Enables shareable URLs containing the full chord progression

### UX Flow
1. User selects a note (stays highlighted)
2. User picks a chord quality → chord auto-added to strip
3. Beat duration adjustable before adding (defaults to 4)
4. Rest button adds silence with current beat duration
5. Chord strip supports drag reorder + delete
6. Click a chord in the strip to edit it (note, quality, beats)
7. Output bar shows live `!sendloop` string + Copy/Raw/Share buttons
8. Output input is editable — user can type/paste a `!sendloop` command directly
9. Play button previews with piano audio, highlighting current chord
10. BPM is user-editable (35-400 range) with early validation
11. Share button copies the URL to clipboard for sharing progressions
12. Language switcher toggles between English and Spanish

## Implementation Status

### Phase 1: Project Scaffold — DONE
- [x] Astro project with Preact + Tailwind integrations + Tone.js
- [x] Layout.astro, index.astro with header
- [x] Cloudflare Workers deployment via wrangler
- [x] Assets ignore configuration

### Phase 2: Data Layer — DONE
- [x] types.ts — ProgressionItem, TimeSignature, ChordDefinition
- [x] chords.ts — 140+ chord definitions with categories, note-to-semitone map
- [x] formatter.ts — formatSendloop() and parseSendloop() (bidirectional)

### Phase 3: Core UI — DONE
- [x] App.tsx with state management (useState)
- [x] NoteSelector — 12-note chromatic grid with sharps/flats toggle
- [x] ChordTypeSelector — searchable, categorized chord list
- [x] BeatDurationSelector — quick buttons (1-4) + manual input
- [x] Rest button integrated into App
- [x] ChordCard, ChordStrip — visual progression display
- [x] OutputBar — sendloop string display + copy button
- [x] TimeSignatureSelector — preset buttons + custom input

### Phase 4: Drag & Reorder — DONE
- [x] HTML5 drag-and-drop on ChordCard/ChordStrip
- [x] Mobile fallback: reorder buttons on each card

### Phase 5: Audio Playback — DONE
- [x] playback.ts with startPlayback/stopPlayback
- [x] PlaybackControls component with BPM control
- [x] Highlight current chord during playback
- [x] Piano sample-based synthesis (upgraded from triangle synth)
- [x] BPM user-editable with early validation (35-400 range)

### Phase 6: Internationalization — DONE
- [x] i18n.ts with EN/ES translations (60+ keys)
- [x] LanguageSwitcher component
- [x] Auto-detect locale from browser
- [x] Chord type category translations
- [x] Fix: language switcher showing wrong language on deployment

### Phase 7: Chord Editing — DONE
- [x] Click-to-edit chords in the progression strip
- [x] Edit mode: update note, quality, and beats for existing chords
- [x] Cancel editing / Update chord buttons

### Phase 8: Editable Output & URL Sharing — DONE
- [x] Output input field is editable — users can type/paste `!sendloop` commands
- [x] Parse errors shown with red border styling
- [x] URL hash encodes chord progression state
- [x] State restored from URL hash on page load
- [x] Shareable URLs for chord progressions

### Phase 9: Clipboard & Sharing — DONE
- [x] Copy button — copies with `!sendloop` command prefix
- [x] Raw button — copies chords only (no command prefix)
- [x] Share button — copies current URL to clipboard with share icon
- [x] Visual "Copied!" / "Link copied!" feedback on all buttons
- [x] Responsive button layout (stack on mobile)

### Phase 10: Polish & Fixes — DONE
- [x] Responsive layout (stacks on mobile)
- [x] Empty state messaging
- [x] Custom scrollbar styling
- [x] Search bar resets on chord add
- [x] Dependency error fixes

## Verification
1. `npm run dev` → page loads with all components
2. Select note + quality → chord appears in strip
3. Add multiple chords + rests → output bar shows correct sendloop string
4. Copy button → clipboard contains correct string with command
5. Raw button → clipboard contains chords only
6. Share button → clipboard contains URL with chord progression
7. Play button → audio plays chords in sequence with piano samples
8. Drag reorder → strip and output update
9. Change time signature → output prefix updates
10. Mobile: layout stacks, buttons responsive
11. Click chord → enters edit mode, can update or cancel
12. Edit output field → progression updates from typed command
13. Paste URL with hash → progression restores on page load
14. Language switcher → all UI text toggles EN/ES
15. BPM editable → validates range 35-400
