/// <reference types="node" />

/**
 * 配置常量
 * 从统一配置文件导入
 */

import { FrontmatterConfig } from "../../scripts/config.ts";

export const CONFIG = {
  /** 默认描述占位符 */
  DEFAULT_DESCRIPTION: FrontmatterConfig.defaults.description,

  /** 默认标签（空数组） */
  DEFAULT_TAGS: FrontmatterConfig.defaults.tags,

  /** 默认分类 */
  DEFAULT_CATEGORY: FrontmatterConfig.defaults.category,

  /** 默认作者 */
  DEFAULT_AUTHOR: FrontmatterConfig.defaults.author,

  /** 默认是否草稿 */
  DEFAULT_DRAFT: FrontmatterConfig.defaults.draft,

  /** 默认原创标识 */
  DEFAULT_ORIGINAL: FrontmatterConfig.defaults.original,

  /** 日期格式配置 */
  DATE_FORMAT: {
    useDateTime: FrontmatterConfig.dateFormat.useDateTime,
  },
} as const;
