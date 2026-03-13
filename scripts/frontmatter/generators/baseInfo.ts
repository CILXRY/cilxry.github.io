/// <reference types="node" />

import { CONFIG } from "../config.ts";
import type { BaseInfo } from "../types.ts";

/**
 * 生成基础信息部分的 frontmatter
 */
export const generateBaseInfo = (options: Partial<BaseInfo>): string => {
  const {
    title,
    tags = CONFIG.DEFAULT_TAGS,
    category = CONFIG.DEFAULT_CATEGORY,
    author = CONFIG.DEFAULT_AUTHOR,
    draft = CONFIG.DEFAULT_DRAFT,
  } = options;

  let output = `title: "${title}"\n`;
  output += `tags: [${tags.map((tag) => `"${tag}"`).join(", ")}]\n`;
  output += `category: ${category}\n`;

  // 可选字段：仅在有值时添加
  if (author) {
    output += `author: ${author}\n`;
  }

  if (draft !== undefined && draft !== CONFIG.DEFAULT_DRAFT) {
    output += `draft: ${draft}\n`;
  }

  return output;
};
