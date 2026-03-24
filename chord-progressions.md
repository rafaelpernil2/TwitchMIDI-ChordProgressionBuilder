---
sidebar_position: 6
title: Chord Progressions
slug: chord-progressions
tags:
  - docs
  - guides
authors:
  - name: Rafael Pernil Bronchalo
    title: TwitchMIDI founder
    url: https://github.com/rafaelpernil2
    imageUrl: https://github.com/rafaelpernil2.png
---

This guide explains how to create and manage chord progression aliases in TwitchMIDI, with plenty of real examples to get you started.

## Overview

Chord progressions let you save sequences of chords under a friendly name so viewers can request them in chat. Instead of typing `!sendloop Dmaj7(2) Dbm7(2) Cmaj7(2) Bm7(2)`, a viewer can simply type `!sendloop bossa nova`.

## The Chord Progressions tab

In the TwitchMIDI+ Control Panel, go to **Aliases > Chord progressions**.

![Chord Progressions : Manage chord progression aliases](/img/screenshots/en/alias/chord-progressions.png)

Each entry has:

- **ACTIVE** — toggle to enable or disable the progression
- **Name** — the alias viewers type in chat (e.g. `bossa nova`, `giant steps`)
- **Chord progression** — the sequence of chords in TwitchMIDI notation

## Notation

Chords follow the notation from the [Chords](./chords) page. They are separated by spaces.

### Beat duration

A number in parentheses after a chord indicates how many **beats** that chord lasts:

- `(4)` — 4 beats (a full 4/4 measure)
- `(2)` — 2 beats (half a measure)
- `(1)` — 1 beat (a quarter note)

If no duration is specified, the chord defaults to 4 beats.

### Time signature

By default, all progressions play in **4/4** time. To use a different time signature, add `[X/Y]` at the beginning of the progression — where `X` is the numerator and `Y` is the denominator. Only one time signature is allowed per progression.

```
[3/4] C(3) G7(3) Am(3) F(3)
[5/4] Dm7(5) G7(5) Cmaj7(5)
[7/8] Am(7)
```

> Custom time signatures require **Allow custom time signatures** to be enabled in **.env > Flags**. See the [Time Signatures](time-signatures) guide for setup details.

### Rests

Use `rest` in place of a chord to insert a musical rest (silence). Rests follow the same beat duration rules as chords:

```
C rest G rest
C(2) rest(2) G(2) rest(2)
```

The first example plays C for 4 beats, silence for 4 beats, G for 4 beats, silence for 4 beats. The second does the same but with 2-beat durations.

### Examples from the Control Panel

| Name | Chord Progression | Description |
|---|---|---|
| `autumn leaves` | `Cm7 F7 Bbmaj7 Ebmaj7 Cm6 D7 Gm6` | Classic jazz standard, each chord lasts 4 beats |
| `bossa nova` | `Dmaj7(2) Dbm7(2) Cmaj7(2) Bm7(2)` | Each chord lasts 2 beats |
| `giant steps` | `Dm7(1) Eb7(1) Ab(1) B7(1) E(2) G7(2) C(4)` | Mixed durations across the progression |
| `sunshine of my life` | `C(2) F6(2) Em7(2) Bbdim(2) Dm7(2) G7(2) C(2) Dm7(1) G7(1) C(2) F6(2) Em7(2) Bbdim(2) Dm7(2) G7(2) C(2) Dm7(1) G7(1)` | Full verse progression with 2-beat and 1-beat chords |

## Creating a chord progression

### Step 1 — Add a new entry

Click the blue **+** button at the top right of the table to add a new row.

### Step 2 — Name it

Type a memorable name in the **Name** field. This is what viewers will type in chat (e.g. `blues in c`).

### Step 3 — Write the progression

In the **Chord progression** field, type your chords separated by spaces. Use the beat notation `(n)` when needed:

```
C7(4) F7(4) C7(4) C7(4) F7(4) F7(4) C7(4) C7(4) G7(2) F7(2) C7(4) G7(4)
```

This creates a 12-bar blues in C with standard durations.

### Step 4 — Save

Click **Apply** to save your changes. The progression is now available for viewers to request.

## More examples

Here are some chord progressions you can add to your setup:

### Pop (I-V-vi-IV in C)
```
C G Am F
```

### Jazz ii-V-I in C
```
Dm7(2) G7(2) Cmaj7(4)
```

### Neo-soul in Eb
```
Ebmaj7(2) Abmaj7(2) Dbmaj7(2) Gbmaj7(2)
```

### Waltz (3/4 time)
```
[3/4] C(3) G7(3) Am(3) F(3)
```

## How viewers use them

Once saved, viewers can request any progression by name:

- `!sendloop bossa nova` — plays the bossa nova progression
- `!sendloop giant steps` — plays the giant steps progression
- `!addchord jazz turnaround/Am7(2) D7(2) Gmaj7(4)` — saves a new progression named `jazz turnaround`

### Queue rules

Each loop repeats **4 times** by default before moving to the next request in the queue. You can change this with the `REPETITIONS_PER_LOOP` setting in your `.env` file.

Each viewer can only have **one request in the queue at a time**. If a viewer already has a request waiting, they must wait for it to play (or use `!wrongloop` to remove it) before they can add a new one. Broadcasters and moderators are exempt from this limit.

## Tips

> - Use short, memorable names that viewers can easily type in chat.
> - Test your progressions before going live by requesting them yourself.
> - Combine chord progressions with [Macros](macros) to create elaborate musical sequences.
> - Check the full list of supported chord types on the [Chords](../chords) page.
