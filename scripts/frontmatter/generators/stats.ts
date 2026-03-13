/// <reference types="node" />

import type { ReadingStats } from "../types.ts";

/**
 * 生成阅读统计部分的 frontmatter
 */
export const generateReadingStats = (options: Partial<ReadingStats>): string => {
  const { wordCount, readingTime } = options;
  let output = "";

  // 仅在有值时添加
  if (wordCount !== undefined) {
    output += `wordCount: ${wordCount}\n`;
  }

  if (readingTime !== undefined) {
    output += `readingTime: ${readingTime}\n`;
  }

  return output;
};
