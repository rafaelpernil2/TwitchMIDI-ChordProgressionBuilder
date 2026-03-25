import { useState, useRef, useEffect } from "preact/hooks";
import { useI18n } from "../lib/i18n";

interface Props {
  output: string;
  onCommandChange: (command: string) => void;
}

export default function OutputBar({ output, onCommandChange }: Props) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const [parseError, setParseError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync edit value when output changes externally (and not actively editing)
  useEffect(() => {
    if (!isEditing) {
      setEditValue(output ? `!sendloop ${output}` : "");
    }
  }, [output, isEditing]);

  function handleFocus() {
    setIsEditing(true);
    setEditValue(output ? `!sendloop ${output}` : "");
    setParseError(false);
  }

  function handleBlur() {
    setIsEditing(false);
    if (!parseError && editValue.trim()) {
      onCommandChange(editValue);
    }
    setParseError(false);
  }

  function handleInput(value: string) {
    setEditValue(value);
    setParseError(false);
    onCommandChange(value);
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    }
    if (e.key === "Escape") {
      setEditValue(output ? `!sendloop ${output}` : "");
      setParseError(false);
      setIsEditing(false);
      (e.target as HTMLInputElement).blur();
    }
  }

  async function handleCopy() {
    const text = output ? `!sendloop ${output}` : "";
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleCopyRaw() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div class="space-y-2">
      <label class="text-sm font-semibold text-rose-300 uppercase tracking-wider">
        {t.output}
      </label>
      <div class="flex flex-col sm:flex-row gap-2">
        <input
          ref={inputRef}
          type="text"
          value={isEditing ? editValue : (output ? `!sendloop ${output}` : "")}
          placeholder={t.outputPlaceholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onInput={(e) => handleInput((e.target as HTMLInputElement).value)}
          onKeyDown={handleKeyDown}
          class={`flex-1 min-w-0 px-4 py-2.5 rounded-lg bg-[#07070d] font-mono text-sm overflow-x-auto whitespace-nowrap focus:outline-none transition-all ${
            parseError
              ? "border-2 border-red-500/60 text-red-300"
              : isEditing
                ? "border-2 border-rose-500/40 text-white ring-1 ring-rose-500/20"
                : "border border-gray-800/60 text-gray-100"
          }`}
          spellcheck={false}
        />
        <div class="flex gap-2 shrink-0">
          <button
            onClick={handleCopy}
            disabled={!output}
            class={`flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/20"
            } disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none`}
            title={t.copyWithCommand}
          >
            {copied ? t.copied : t.copy}
          </button>
          <button
            onClick={handleCopyRaw}
            disabled={!output}
            class="flex-1 sm:flex-none px-4 py-2.5 rounded-lg bg-[#1a1a2e] text-gray-300 text-sm font-bold hover:bg-gray-800 hover:text-white border border-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all whitespace-nowrap"
            title={t.copyChordsOnly}
          >
            {t.raw}
          </button>
        </div>
      </div>
    </div>
  );
}
