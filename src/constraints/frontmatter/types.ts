/// <reference types="node" />

/**
 * Frontmatter 类型定义
 */

/** 基础信息字段 */
export interface BaseInfo {
  title: string;
  tags: string[];
  category: string;
  author?: string;
  draft?: boolean;
}

/** 简介信息字段 */
export interface DescriptionInfo {
  description: string;
  descGenAuthor?: string; // description 生成者（AI/手动）
  descGenTime?: string | Date; // description 生成时间
}

/** 时间信息字段 */
export interface TimeInfo {
  creation: string | Date;
  published: string | Date;
}

/** 阅读统计字段 */
export interface ReadingStats {
  wordCount?: number;
  readingTime?: number;
}

/** 内容信息字段 */
export interface ContentInfo {
  warning?: string; // 内容警告
  original?: boolean; // 原创标识
}

/** 完整的 Frontmatter 配置选项 */
export interface FrontmatterOptions
  extends BaseInfo, DescriptionInfo, TimeInfo, ReadingStats, ContentInfo {}

/** 部分字段的 Frontmatter 配置（用于更新场景） */
export type PartialFrontmatterOptions = Partial<FrontmatterOptions>;
