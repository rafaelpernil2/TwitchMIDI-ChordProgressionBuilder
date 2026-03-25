import { useI18n } from "../lib/i18n";
import type { Locale } from "../lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();

  function toggle() {
    setLocale(locale === "en" ? "es" : "en");
  }

  return (
    <button
      onClick={toggle}
      class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1a2e] border border-gray-700/50 hover:border-violet-500/50 text-sm font-bold text-gray-300 hover:text-white transition-all"
      title={locale === "en" ? "Cambiar a Espanol" : "Switch to English"}
    >
      <span class={locale === "en" ? "text-white" : "text-gray-500"}>EN</span>
      <span class="text-gray-600">/</span>
      <span class={locale === "es" ? "text-white" : "text-gray-500"}>ES</span>
    </button>
  );
}
