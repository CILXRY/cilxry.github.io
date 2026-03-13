/// <reference types="node" />

/**
 * 配置常量
 */

export const CONFIG = {
  /** 默认描述占位符 */
  DEFAULT_DESCRIPTION: "这是一个没有描述的文章",

  /** 默认标签（空数组） */
  DEFAULT_TAGS: [],

  /** 默认分类 */
  DEFAULT_CATEGORY: "",

  /** 默认作者 */
  DEFAULT_AUTHOR: "",

  /** 默认是否草稿 */
  DEFAULT_DRAFT: false,

  /** 默认原创标识 */
  DEFAULT_ORIGINAL: true,

  /** 日期格式配置 */
  DATE_FORMAT: {
    useDateTime: true, // 默认使用时间格式（包含时分秒）
  },
} as const;
