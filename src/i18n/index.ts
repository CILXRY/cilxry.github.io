import { enUS } from "./L_en-US.ts";
import { zhCN } from "./L_zh-CN.ts";
import type { I18nKeys } from "./i18nKeys.ts";

const translations = {
  "zh-CN": zhCN,
  "en-US": enUS,
} as const;

const defaultLanguage = "zh-CN";

export function t(
  key: I18nKeys,
  lang: keyof typeof translations = defaultLanguage,
): string {
  const dict = translations[lang];
  if (!dict) {
    console.warn(`Unsupported language//不支持的语言 ${lang}`);
    return key;
  }
  return dict[key] || key;
}
