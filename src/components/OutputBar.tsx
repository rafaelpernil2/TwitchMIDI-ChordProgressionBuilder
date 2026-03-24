import { useState } from "preact/hooks";

interface Props {
  output: string;
}

export default function OutputBar({ output }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!output) return;
    const sendloopCommand = `!sendloop ${output}`;
    await navigator.clipboard.writeText(sendloopCommand);
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
        Output
      </label>
      <div class="flex gap-2">
        <div class="flex-1 px-4 py-2.5 rounded-lg bg-[#07070d] border border-gray-800/60 font-mono text-sm text-gray-100 overflow-x-auto whitespace-nowrap">
          {output ? (
            <>
              <span class="text-violet-400 font-bold">!sendloop </span>
              <span class="text-emerald-300">{output}</span>
            </>
          ) : (
            <span class="text-gray-600 italic">
              Your chord progression will appear here...
            </span>
          )}
        </div>
        <button
          onClick={handleCopy}
          disabled={!output}
          class={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
            copied
              ? "bg-emerald-500 text-white"
              : "bg-violet-600 text-white hover:bg-violet-500 shadow-lg shadow-violet-600/20"
          } disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none`}
          title="Copy with !sendloop command"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
        <button
          onClick={handleCopyRaw}
          disabled={!output}
          class="px-4 py-2.5 rounded-lg bg-[#1a1a2e] text-gray-300 text-sm font-bold hover:bg-gray-800 hover:text-white border border-gray-700/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all whitespace-nowrap"
          title="Copy chords only"
        >
          Raw
        </button>
      </div>
    </div>
  );
}
