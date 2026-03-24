# TwitchMIDI Chord Progression Builder

A visual chord progression builder for [TwitchMIDI](https://github.com/rafaelpernil2/TwitchMIDI). Build chord progressions in `!sendloop` format with an interactive UI and preview them with audio playback.

## Features

- **Time signature selector** — presets (4/4, 3/4, 6/8, 5/4, 7/8, 12/8) and custom input with power-of-2 denominators
- **Root note selector** — 12 chromatic notes with sharps/flats toggle
- **Chord type selector** — 100+ chord types from [harmonics](https://github.com/scribbletune/harmonics) notation, searchable by name or suffix
- **Beat duration control** — quick buttons (1–4) or manual input
- **Rest insertion** — add silence with configurable duration
- **Visual chord strip** — drag-and-drop reordering, individual chord removal
- **Output bar** — live `!sendloop` string preview with copy to clipboard
- **Audio playback** — preview progressions with a synthesizer (BPM range: 35–400)

## Tech Stack

- [Astro](https://astro.build/) + TypeScript
- [Preact](https://preactjs.com/) (interactive island)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tone.js](https://tonejs.github.io/) (audio playback)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens a local dev server at `http://localhost:4321`.

### Build

```bash
npm run build
```

Static output is generated in the `dist/` directory.

### Preview

```bash
npm run preview
```

Serves the built site locally.

## Usage

1. Select a **time signature** (defaults to 4/4)
2. Pick a **root note** (C, D, E, etc.)
3. Choose a **chord type** (maj7, m7, dim, etc.)
4. Set the **beat duration**
5. Click **Add Chord** to append it to the progression
6. Use **Add Rest** for silence
7. Reorder chords by dragging or using the arrow buttons on mobile
8. Click **Copy** to copy the `!sendloop` command to your clipboard
9. Click **Play** to preview the progression with audio

### Output Format

The builder generates TwitchMIDI `!sendloop` format:

```
!sendloop Cmaj7(2) Dm7(2) G7(4)
!sendloop [3/4] C(3) G7(3) Am(3) F(3)
!sendloop Dmaj7(2) rest(2) Cmaj7(4)
```

## License

ISC
