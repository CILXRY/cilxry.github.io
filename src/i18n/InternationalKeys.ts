import { navItems } from "@cfg/index.ts";

// 从 navItems 提取所有唯一的 key
const navKeys = [...new Set(navItems.map(item => item.key))] as const;

// 生成 I18nKeys 对象
export const I18nKeys = Object.fromEntries(
  navKeys.map(key => [key, key])
) as { readonly [K in typeof navKeys[number]]: K };

// 导出类型
export type I18nKeys = typeof navKeys[number];

// 运行时验证函数：检查语言包是否包含所有必需的 key
export function validateI18nKeys(translations: Record<string, string>, lang: string): void {
  const missingKeys = navKeys.filter(key => !(key in translations));
  if (missingKeys.length > 0) {
    console.error(
      `[i18n] 语言包 "${lang}" 缺少以下翻译键:`,
      missingKeys.join(', ')
    );
    console.error(
      `[i18n] 请在 src/i18n/Language-${lang.replace('-', '_')}.ts 中补充这些翻译`
    );
  }
  console.info(`[i18n] ${lang} 语言包完整`)
}
