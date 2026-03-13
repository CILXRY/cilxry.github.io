/// <reference types="node" />

import { CONFIG } from "../config.ts";
import type { ContentInfo } from "../types.ts";

/**
 * 生成内容信息部分的 frontmatter
 */
export const generateContentInfo = (options: Partial<ContentInfo>): string => {
  const { warning, original = CONFIG.DEFAULT_ORIGINAL } = options;
  let output = "";

  // 可选字段：仅在有值时添加
  if (warning) {
    output += `warning: ${warning}\n`;
  }

  // original 默认为 true，如果不是默认值则添加
  if (original !== undefined && original !== CONFIG.DEFAULT_ORIGINAL) {
    output += `original: ${original}\n`;
  }

  return output;
};
