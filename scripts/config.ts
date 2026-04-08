/// <reference types="node" />

/**
 * 脚本配置文件
 * 集中管理所有脚本的配置选项
 */

export const ScriptConfig = {
  /** Frontmatter 相关配置 */
  frontmatter: {
    useDateTime: true, // 是否使用时间格式（包含时分秒）
    useUUIDAsFileName: true, // 是否使用 UUID 作为文件名
  },

  /** 输出目录配置 */
  // 记得Windows路径是需要双反斜杠的，否则会报错
  paths: {
    // 博客文章输出目录
    outputDir: "C:\\Users\\cilxry\\Documents\\cilxry-markdown-pages\\posts",
    // 项目内文章目录
    projectBlogsDir: "src\\content\\blogs",
  },

  /** 命令行参数配置 */
  cli: {
    helpMessages: {
      new: '使用 <pnpm new "标题"> 的格式重试。',
      exi: '使用 <pnpm exi "文件路径"> 的格式重试。',
      exiBatch: '使用 <pnpm exi-batch "目录路径"> 的格式重试。',
    },
  },
} as const;

/**
 * Frontmatter 生成器配置
 */
export const FrontmatterConfig = {
  /** 默认值配置 */
  defaults: {
    description: "这是一个没有描述的文章",
    tags: [] as string[],
    category: "",
    author: "",
    draft: false,
    original: true,
  },

  /** 日期格式配置 */
  dateFormat: {
    useDateTime: true, // 默认使用时间格式（包含时分秒）
  },
} as const;
