import type { TimeSignature } from "../lib/types";
import { useI18n } from "../lib/i18n";

interface Props {
  value: TimeSignature;
  onChange: (ts: TimeSignature) => void;
}

const PRESETS = [
  { label: "4/4", numerator: 4, denominator: 4 },
  { label: "3/4", numerator: 3, denominator: 4 },
  { label: "6/8", numerator: 6, denominator: 8 },
  { label: "5/4", numerator: 5, denominator: 4 },
  { label: "7/8", numerator: 7, denominator: 8 },
  { label: "12/8", numerator: 12, denominator: 8 },
];

const VALID_DENOMINATORS = [1, 2, 4, 8, 16, 32];

export default function TimeSignatureSelector({ value, onChange }: Props) {
  const { t } = useI18n();
  const currentLabel = `${value.numerator}/${value.denominator}`;
  const isPreset = PRESETS.some((p) => p.label === currentLabel);

  return (
    <div class="space-y-2">
      <label class="text-sm font-semibold text-violet-300 uppercase tracking-wider">
        {t.timeSignature}
      </label>
      <div class="flex gap-2 flex-wrap">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() =>
              onChange({
                numerator: preset.numerator,
                denominator: preset.denominator,
              })
            }
            class={`px-3.5 py-2 rounded-lg text-sm font-bold transition-all ${
              currentLabel === preset.label
                ? "bg-violet-600 text-white shadow-lg shadow-violet-600/40"
                : "bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700/50"
            }`}
          >
            {preset.label}
          </button>
        ))}
        <div
          class={`inline-flex flex-col items-center rounded-lg transition-all ${
            !isPreset
              ? "bg-violet-600/20 ring-2 ring-violet-500"
              : "bg-gray-800/80 border border-gray-700/50"
          }`}
          style="width: 48px; padding: 4px 0;"
        >
          <input
            type="number"
            min="1"
            max="16"
            value={value.numerator}
            onChange={(e) =>
              onChange({
                numerator: Math.max(1, parseInt((e.target as HTMLInputElement).value) || 4),
                denominator: value.denominator,
              })
            }
            class="bg-transparent text-center text-sm font-bold text-white focus:outline-none"
            style="width: 36px; -moz-appearance: textfield; appearance: textfield;"
          />
          <hr style="width: 24px; border: none; border-top: 2px solid rgba(167,139,250,0.6); margin: 2px 0;" />
          <select
            value={value.denominator}
            onChange={(e) =>
              onChange({
                numerator: value.numerator,
                denominator: parseInt((e.target as HTMLSelectElement).value),
              })
            }
            class="bg-transparent text-center text-sm font-bold text-white focus:outline-none cursor-pointer"
            style="width: 36px; -moz-appearance: none; -webkit-appearance: none; appearance: none; text-align-last: center;"
          >
            {VALID_DENOMINATORS.map((d) => (
              <option key={d} value={d} class="bg-[#12121e] text-white">
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
