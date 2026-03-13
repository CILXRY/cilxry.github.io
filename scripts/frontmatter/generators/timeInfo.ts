/// <reference types="node" />

import { normalizeDate } from "../utils/formatDate.ts";
import type { TimeInfo } from "../types.ts";

/**
 * 生成时间信息部分的 frontmatter
 */
export const generateTimeInfo = (options: Partial<TimeInfo>, useDateTime: boolean = false): string => {
  const {
    date = new Date(),
    pubDate = new Date(),
  } = options;

  const dateStr = typeof date === "string" ? date : normalizeDate(date, useDateTime);
  const pubDateStr = typeof pubDate === "string" ? pubDate : normalizeDate(pubDate, useDateTime);

  let output = `date: ${dateStr}\n`;
  output += `pubDate: ${pubDateStr}\n`;

  return output;
};
