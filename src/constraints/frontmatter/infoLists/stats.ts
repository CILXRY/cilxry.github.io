/// <reference types="node" />

import type { ReadingStats } from "../types.ts";

/**
 * 生成阅读统计部分的 frontmatter
 */
export const generateReadingStats = (options: Partial<ReadingStats>): string => {
  const { wordCount = 0, readingTime = 0 } = options;
  let output = `wordCount: ${wordCount}\n`;
  output += `readingTime: ${readingTime}\n`;

  return output;
};
