/// <reference types="node" />

/**
 * @deprecated 请使用 `import { generateFrontmatter, generateFrontmatterFromFile } from "./frontmatter/index.js"`
 *
 * 为了保持向后兼容，此文件现在仅作为导出代理。
 * 新的 frontmatter 模块已拆分为：
 * - scripts/frontmatter/types.ts - 类型定义
 * - scripts/frontmatter/config.ts - 配置常量
 * - scripts/frontmatter/utils/ - 工具函数
 * - scripts/frontmatter/generators/ - 各部分生成器
 * - scripts/frontmatter/index.ts - 主入口
 */

export {
  generateFrontmatter,
  generateFrontmatterFromFile,
} from "./frontmatter/index.ts";

export type {
  FrontmatterOptions,
  PartialFrontmatterOptions,
  BaseInfo,
  DescriptionInfo,
  TimeInfo,
  ReadingStats,
  ContentInfo,
} from "./frontmatter/types.ts";

export { CONFIG } from "./frontmatter/config.ts";

export {
  formatDate,
  formatDateTime,
  normalizeDate,
} from "./frontmatter/utils/formatDate.ts";

export { calculateReadingStats } from "./frontmatter/utils/calculateStats.ts";
