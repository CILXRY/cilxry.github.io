/// <reference types="node" />

import { normalizeDate } from "@ut/formatDate.ts";
import type { TimeInfo } from "../types.ts";

/**
 * 生成时间信息部分的 frontmatter
 */
export const generateTimeInfo = (
  options: Partial<TimeInfo>,
  useDateTime: boolean = false
): string => {
  const { creation = new Date(), published: pubDate = new Date() } = options;

  const creationStr = typeof creation === "string" ? creation : normalizeDate(creation, useDateTime);
  const pubDateStr =
    typeof pubDate === "string" ? pubDate : normalizeDate(pubDate, useDateTime);

  let output = `creation: ${creationStr}\n`;
  output += `published: ${pubDateStr}\n`;

  return output;
};
