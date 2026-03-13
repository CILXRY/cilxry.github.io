/// <reference types="node" />

import fs from "fs";
import { generateBaseInfo } from "./generators/baseInfo.ts";
import { generateDescriptionInfo } from "./generators/descriptionInfo.ts";
import { generateTimeInfo } from "./generators/timeInfo.ts";
import { generateReadingStats } from "./generators/stats.ts";
import { generateContentInfo } from "./generators/contentInfo.ts";
import { calculateReadingStats as calcStats } from "./utils/calculateStats.ts";
import type { FrontmatterOptions, PartialFrontmatterOptions } from "./types.ts";

/**
 * 生成完整的 Frontmatter 字符串
 * @param options frontmatter 配置选项
 * @param useDateTime 是否使用时间格式（包含时分秒），默认 false
 * @returns frontmatter 字符串
 */
export const generateFrontmatter = (
  options: PartialFrontmatterOptions,
  useDateTime: boolean = false,
): string => {
  // 构建各部分 frontmatter
  const baseInfo = generateBaseInfo(options);
  const timeInfo = generateTimeInfo(options, useDateTime);
  const introInfo = generateDescriptionInfo(options);
  const readingStats = generateReadingStats(options);
  const contentInfo = generateContentInfo(options);

  // 按照指定顺序组合：基础信息 → 时间信息 → 简介信息 → 阅读统计 → 内容信息
  let frontmatter = "---\n";
  frontmatter += baseInfo;
  frontmatter += timeInfo;
  frontmatter += introInfo;
  frontmatter += readingStats;
  frontmatter += contentInfo;
  frontmatter += "---\n\n";

  return frontmatter;
};

/**
 * 从文件读取内容并生成带统计信息的 frontmatter
 * @param filePath 文件路径
 * @param title 标题
 * @param date 创建日期（可选，默认使用文件创建时间）
 * @param pubDate 发布日期（可选，默认使用文件修改时间）
 * @param useDateTime 是否使用时间格式
 * @param category 分类（可选）
 * @returns frontmatter 字符串
 */
export const generateFrontmatterFromFile = (
  filePath: string,
  title: string,
  date?: Date,
  pubDate?: Date,
  useDateTime: boolean = false,
  category: string = "",
): string => {
  const content = fs.readFileSync(filePath, "utf-8");
  const stats = fs.statSync(filePath);

  // 使用提供的日期或文件统计信息
  const birthtime =
    date || (stats.birthtime.getTime() > 0 ? stats.birthtime : stats.mtime);
  const mtime = pubDate || stats.mtime;

  // 计算阅读统计
  const { wordCount, readingTime } = calcStats(content);

  return generateFrontmatter(
    {
      title,
      date: birthtime,
      pubDate: mtime,
      wordCount,
      readingTime,
      category,
    },
    useDateTime,
  );
};
