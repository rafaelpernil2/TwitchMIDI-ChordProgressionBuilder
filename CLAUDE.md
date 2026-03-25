# CLAUDE.md - TwitchMIDI Chord Progression Builder

## Project Overview

A single-page web app that lets users visually construct chord progressions in TwitchMIDI `!sendloop` format. Users pick notes, chord types, and beat durations to build a progression, then copy the result or share it via URL.

Part of the [TwitchMIDI](https://github.com/rafaelpernil2) ecosystem — the `!sendloop` command lets Twitch chat viewers request chord progressions for live music performance.

## Tech Stack

- **Astro 5** — static site builder with island architecture
- **Preact** — lightweight React alternative for interactive components (`client:load`)
- **Tailwind CSS** — utility-first styling with custom dark theme colors
- **Tone.js** — piano sample-based audio playback
- **Cloudflare Workers** — deployment via wrangler
- **TypeScript** — strict mode via `astro/tsconfigs/strict`

## Commands

```bash
npm run dev        # Start dev server (Astro + Vite)
npm run build      # Production build (Astro + Cloudflare adapter)
npm run preview    # Build + local preview via wrangler dev
npm run deploy     # Build + deploy to Cloudflare Workers
```

If Vite throws stale cache errors (e.g. `Failed to fetch dynamically imported module`), clear the cache: `rm -rf node_modules/.vite` and restart dev.

## Project Structure

```
src/
├── layouts/Layout.astro            # HTML shell, Tailwind, custom scrollbar CSS
├── pages/index.astro               # Single page, mounts <App client:load />
├── components/
│   ├── App.tsx                     # Root island — all state, URL hash sync
│   ├── TimeSignatureSelector.tsx   # Preset buttons (4/4, 3/4, 6/8...) + custom input
│   ├── NoteSelector.tsx            # 12-note chromatic grid, sharps/flats toggle
│   ├── ChordTypeSelector.tsx       # Searchable categorized list (140+ chords)
│   ├── BeatDurationSelector.tsx    # Quick buttons (1-4) + manual input
│   ├── ChordStrip.tsx              # Horizontal scrollable strip, drag-and-drop
│   ├── ChordCard.tsx               # Individual chord chip (drag, delete, edit)
│   ├── LanguageSwitcher.tsx        # EN/ES toggle
│   ├── OutputBar.tsx               # Sendloop output + Copy/Raw/Share buttons + editable input
│   └── PlaybackControls.tsx        # BPM control (35-400) + Play/Stop
├── lib/
│   ├── types.ts                    # ProgressionItem, TimeSignature, ChordDefinition
│   ├── chords.ts                   # 140+ chord definitions with categories, chordToNotes()
│   ├── formatter.ts                # formatSendloop() / parseSendloop() (bidirectional)
│   ├── i18n.ts                     # EN/ES translations (60+ keys), Preact Context, auto-locale
│   └── playback.ts                 # Tone.js Transport scheduling, piano sample synth
└── styles/global.css               # Tailwind directives
```

Config files: `astro.config.mjs`, `tailwind.config.mjs`, `wrangler.jsonc`, `tsconfig.json`

## Architecture

### State Management
- All state lives in `App.tsx` via Preact `useState` hooks
- No external state library — props flow down, callbacks flow up
- i18n uses Preact Context API (`I18nContext`)

### URL Hash Persistence
- The chord progression is encoded in the URL hash fragment (e.g. `#[3/4] Cmaj7(2) Dm7(2)`)
- On mount: `parseSendloop(hash)` restores state
- On output change: `history.replaceState()` syncs hash
- This makes every progression shareable via URL

### Formatter (formatter.ts)
- `formatSendloop(items, timeSignature)` — items to string
- `parseSendloop(input)` — string to items + time signature
- Defaults: 4/4 time signature omitted, 4-beat duration omitted
- Output format: `[3/4] Cmaj7(2) Dm7(2) rest(1) G7(3)`

### Playback (playback.ts)
- Dynamic import of Tone.js to avoid SSR issues
- Piano sample-based synthesis
- `Tone.Transport` for beat-accurate scheduling
- `Tone.Draw.schedule` for UI highlight sync
- `Tone.start()` called on user gesture (Play button)

### Chord Data (chords.ts)
- Based on [harmonics](https://github.com/scribbletune/harmonics) by scribbletune
- 140+ chord qualities as semitone interval arrays
- Categories: Triads, Suspended, Sixths, Sevenths, Sus Sevenths, Ninths, Altered, Elevenths, Thirteenths
- `chordToNotes(root, quality, octave)` resolves to Tone.js note names

## Data Model

```typescript
interface TimeSignature { numerator: number; denominator: number }
interface ProgressionItem {
  id: string;           // UUID for stable reorder/removal
  type: "chord" | "rest";
  root?: string;        // e.g. "C", "F#", "Bb"
  quality?: string;     // e.g. "maj7", "m7", "", "dim"
  beats: number;
}
interface ChordDefinition {
  label: string;        // Display name
  suffix: string;       // Notation suffix
  semitones: number[];  // MIDI interval offsets
  category: string;
}
```

## UI Conventions

- Dark theme: surface `#0a0a12`, card `#12121e`, elevated `#1a1a2e`
- Button colors: violet (primary), emerald (success/play), rose (share), amber (update mode), dark gray (secondary)
- All buttons use: `disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none`
- Labels: small, bold, uppercase, tracked letter spacing, colored per section
- Responsive: `flex-col sm:flex-row` for button groups, stacking on mobile
- Clipboard buttons show "Copied!" feedback for 2 seconds
- Inline SVG icons (no icon library)

## i18n

- Two locales: `en`, `es`
- Auto-detected from `navigator.language`
- All UI strings go through `t.keyName` from `useI18n()` hook
- Translations defined in `src/lib/i18n.ts` — add new keys to both `en` and `es` objects
- Chord category names are also translated

## Reference Docs

- `chords.md` — full list of supported chord notations (from TwitchMIDI docs)
- `chord-progressions.md` — guide on `!sendloop` command and chord progression aliases
- `IMPLEMENTATION_PLAN.md` — detailed implementation plan with all phases and status
