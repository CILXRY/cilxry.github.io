import type { I18nKeys } from "./InternationalKeys.ts";
import { enUS } from "./Language-en_US.ts";
import { zhCN } from "./Language-zh_CN.ts";
import { validateI18nKeys } from "./InternationalKeys.ts";

const translations = {
  "zh-CN": zhCN,
  "en-US": enUS,
} as const;

const defaultLanguage = "zh-CN";

// 在开发环境下验证语言包完整性
if (import.meta.env?.DEV) {
  validateI18nKeys(zhCN, "zh-CN");
  validateI18nKeys(enUS, "en-US");
}

export function translate(
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
