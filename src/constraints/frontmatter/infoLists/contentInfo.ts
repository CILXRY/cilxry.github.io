/// <reference types="node" />

import { CONFIG } from "@cfg/postsFrontmatter.ts";
import type { ContentInfo } from "../types.ts";

/**
 * 生成内容信息部分的 frontmatter
 */
export const generateContentInfo = (options: Partial<ContentInfo>): string => {
  const { warning = "", original = CONFIG.DEFAULT_ORIGINAL } = options;
  let output = `warning: ${warning}\n`;
  output += `original: ${original}\n`;

  return output;
};
