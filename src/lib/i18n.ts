import { createContext } from "preact";
import { useContext } from "preact/hooks";

export type Locale = "en" | "es";

const translations = {
  en: {
    // Header
    title: "Loop Architect",

    // Time Signature
    timeSignature: "Time Signature",

    // Note Selector
    rootNote: "Root Note",
    flats: "Flats",
    sharps: "Sharps",

    // Chord Type
    chordType: "Chord Type",
    searchChords: "Search chords...",

    // Beat Duration
    beats: "Beats",

    // Buttons
    addChord: "Add",
    updateChord: "Update",
    addRest: "Rest",
    setRest: "Set Rest",
    cancel: "Cancel",
    clearAll: "Clear all",

    // Editing
    editingChord: "Editing chord",
    rest: "rest",

    // Chord Strip
    progression: "Progression",
    chord: "chord",
    chords: "chords",
    clickToEdit: "click a chord to edit it",
    emptyState: "Select a root note and chord type to start building your progression",
    beat: "beat",

    // Output
    output: "Output",
    outputPlaceholder: "Your chord progression will appear here...",
    copy: "Copy",
    copied: "Copied!",
    raw: "Raw",
    copyWithCommand: "Copy with !sendloop command",
    copyChordsOnly: "Copy chords only",
    share: "Share",
    shareCopied: "Link copied!",
    shareLoop: "Copy link to share this loop",

    // Chord Categories
    categories: {
      Triads: "Triads",
      Suspended: "Suspended",
      Sixths: "Sixths",
      Sevenths: "Sevenths",
      "Sus Sevenths": "Sus Sevenths",
      Ninths: "Ninths",
      Altered: "Altered",
      Elevenths: "Elevenths",
      Thirteenths: "Thirteenths",
    } as Record<string, string>,

    // Playback
    play: "Play",
    stop: "Stop",

    // Language
    language: "EN",
  },
  es: {
    // Header
    title: "Loop Architect",

    // Time Signature
    timeSignature: "Compas",

    // Note Selector
    rootNote: "Nota Raiz",
    flats: "Bemoles",
    sharps: "Sostenidos",

    // Chord Type
    chordType: "Tipo de Acorde",
    searchChords: "Buscar acordes...",

    // Beat Duration
    beats: "Pulsos",

    // Buttons
    addChord: "Agregar",
    updateChord: "Actualizar",
    addRest: "Silencio",
    setRest: "Silencio",
    cancel: "Cancelar",
    clearAll: "Limpiar todo",

    // Editing
    editingChord: "Editando acorde",
    rest: "silencio",

    // Chord Strip
    progression: "Progresion",
    chord: "acorde",
    chords: "acordes",
    clickToEdit: "haz clic en un acorde para editarlo",
    emptyState: "Selecciona una nota raiz y un tipo de acorde para empezar",
    beat: "pulso",

    // Output
    output: "Resultado",
    outputPlaceholder: "Tu progresion de acordes aparecera aqui...",
    copy: "Copiar",
    copied: "Copiado!",
    raw: "Raw",
    copyWithCommand: "Copiar con el comando !sendloop",
    copyChordsOnly: "Copiar solo los acordes",
    share: "Compartir",
    shareCopied: "Enlace copiado!",
    shareLoop: "Copiar enlace para compartir este loop",

    // Chord Categories
    categories: {
      Triads: "Triadas",
      Suspended: "Suspendidos",
      Sixths: "Sextas",
      Sevenths: "Septimas",
      "Sus Sevenths": "Septimas Sus",
      Ninths: "Novenas",
      Altered: "Alterados",
      Elevenths: "Oncenas",
      Thirteenths: "Trecenas",
    } as Record<string, string>,

    // Playback
    play: "Reproducir",
    stop: "Parar",

    // Language
    language: "ES",
  },
} as const;

export type Translations = (typeof translations)["en"];

export const I18nContext = createContext<{
  t: Translations;
  locale: Locale;
  setLocale: (l: Locale) => void;
}>({
  t: translations.en,
  locale: "en",
  setLocale: () => {},
});

export function useI18n() {
  return useContext(I18nContext);
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language || "";
  if (lang.startsWith("es")) return "es";
  return "en";
}
