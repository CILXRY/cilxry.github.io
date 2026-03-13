/// <reference types="node" />

import { CONFIG } from "../config.ts";
import { normalizeDate } from "../utils/formatDate.ts";
import type { DescriptionInfo } from "../types.ts";

/**
 * 生成简介信息部分的 frontmatter
 */
export const generateDescriptionInfo = (
  options: Partial<DescriptionInfo>,
): string => {
  const {
    description = CONFIG.DEFAULT_DESCRIPTION,
    descGenAuthor,
    descGenTime,
  } = options;

  let output = `description: ${description}\n`;

  // 可选字段：生成作者
  if (descGenAuthor) {
    output += `descGenAuthor: ${descGenAuthor}\n`;
  }

  // 可选字段：生成时间
  if (descGenTime) {
    const timeStr =
      typeof descGenTime === "string"
        ? descGenTime
        : normalizeDate(descGenTime);
    output += `descGenTime: ${timeStr}\n`;
  }

  return output;
};
