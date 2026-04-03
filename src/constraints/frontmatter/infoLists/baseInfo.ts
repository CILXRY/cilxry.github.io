/// <reference types="node" />

import { CONFIG } from "@cfg/postsFrontmatter.ts";
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

  let output = `title: "${title}"
`;
  output += `tags: [${tags.map((tag) => `"${tag}"`).join(", ")}]
`;
  output += `category: ${category}
`;
  output += `author: ${author}
`;
  output += `draft: ${draft}
`;

  return output;
};
