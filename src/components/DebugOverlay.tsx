import { useState } from "preact/hooks";
import { getDebugInfo } from "../lib/playback";

export default function DebugOverlay() {
  const [visible, setVisible] = useState(false);
  const [info, setInfo] = useState<ReturnType<typeof getDebugInfo> | null>(null);

  function refresh() {
    setInfo(getDebugInfo());
  }

  if (!visible) {
    return (
      <button
        onClick={() => { setVisible(true); refresh(); }}
        class="fixed bottom-2 right-2 z-50 px-2 py-1 bg-red-600 text-white text-xs font-bold rounded opacity-70"
      >
        DEBUG
      </button>
    );
  }

  return (
    <div class="fixed bottom-0 left-0 right-0 z-50 bg-black/95 text-green-400 font-mono text-xs p-3 max-h-[50vh] overflow-y-auto border-t-2 border-red-500">
      <div class="flex justify-between items-center mb-2">
        <span class="text-red-400 font-bold">Audio Debug</span>
        <div class="flex gap-2">
          <button onClick={refresh} class="px-2 py-0.5 bg-green-800 text-white rounded text-xs">
            Refresh
          </button>
          <button onClick={() => setVisible(false)} class="px-2 py-0.5 bg-red-800 text-white rounded text-xs">
            Close
          </button>
        </div>
      </div>

      {info && (
        <>
          <div class="mb-2">
            <div class="text-yellow-400 font-bold mb-1">State:</div>
            {Object.entries(info.state).map(([k, v]) => (
              <div key={k}>
                <span class="text-gray-500">{k}:</span>{" "}
                <span class={v === "suspended" ? "text-red-400 font-bold" : ""}>{v}</span>
              </div>
            ))}
          </div>
          <div>
            <div class="text-yellow-400 font-bold mb-1">Log ({info.log.length}):</div>
            {info.log.length === 0 && <div class="text-gray-500">No events yet</div>}
            {info.log.map((line, i) => (
              <div key={i} class={line.includes("ERROR") ? "text-red-400" : ""}>
                {line}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
