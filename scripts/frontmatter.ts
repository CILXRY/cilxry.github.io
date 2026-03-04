/// <reference types="node" />

import fs from "fs";

/**
 * 格式化日期为 YYYY-MM-DD 格式
 */
export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * 格式化日期时间为 YYYY-MM-DD HH:mm:ss 格式
 */
export const formatDateTime = (date: Date): string => {
  const datePart = formatDate(date);
  const timePart = date.toTimeString().split(" ")[0];
  return `${datePart} ${timePart}`;
};

/**
 * 计算字数和阅读时长
 * @param content 文章内容
 * @returns 字数和阅读时长（分钟）
 */
export const calculateReadingStats = (content: string) => {
  const cleanContent = content.trim();
  // 中文、英文、数字都算作字符，按中文习惯：字数 = 所有非空白字符数
  const wordCount = (cleanContent.match(/[^\s]/g) || []).length;
  // 阅读速度：中文约 300 字/分钟
  const readingTime = Math.ceil(wordCount / 300);
  return { wordCount, readingTime };
};

/**
 * 生成 Frontmatter 字符串
 * @param options frontmatter 配置选项
 * @param useDateTime 是否使用时间格式（包含时分秒），默认 false
 * @returns frontmatter 字符串
 */
export const generateFrontmatter = (options: {
  title: string;
  date?: string | Date;
  pubDate?: string | Date;
  tags?: string[];
  categories?: string;
  description?: string;
  wordCount?: number;
  readingTime?: number;
}, useDateTime: boolean = false): string => {
  const {
    title,
    date = new Date(),
    pubDate = new Date(),
    tags = [""],
    categories = "",
    description = "这是一个没有描述的文章",
    wordCount,
    readingTime,
  } = options;

  // 处理日期格式
  const dateStr = typeof date === "string" ? date : (useDateTime ? formatDateTime(date) : formatDate(date));
  const pubDateStr = typeof pubDate === "string" ? pubDate : (useDateTime ? formatDateTime(pubDate) : formatDate(pubDate));

  // 构建基础 frontmatter
  let frontmatter = `---
title: "${title}"
date: ${dateStr}
pubDate: ${pubDateStr}
tags: [${tags.map((tag) => `"${tag}"`).join(", ")}]
categories: ${categories}
description: ${description}
`;

  // 如果提供了字数统计，添加到 frontmatter
  if (wordCount !== undefined) {
    frontmatter += `wordCount: ${wordCount}\n`;
  }
  if (readingTime !== undefined) {
    frontmatter += `readingTime: ${readingTime}\n`;
  }

  frontmatter += `---

`;

  return frontmatter;
};

/**
 * 从文件读取内容并生成带统计信息的 frontmatter
 * @param filePath 文件路径
 * @param title 标题
 * @param date 创建日期（可选，默认使用文件创建时间）
 * @param pubDate 发布日期（可选，默认使用文件修改时间）
 * @param useDateTime 是否使用时间格式
 * @returns frontmatter 字符串
 */
export const generateFrontmatterFromFile = (
  filePath: string,
  title: string,
  date?: Date,
  pubDate?: Date,
  useDateTime: boolean = false,
): string => {
  const content = fs.readFileSync(filePath, "utf-8");
  const stats = fs.statSync(filePath);

  // 使用提供的日期或文件统计信息
  const birthtime =
    date || (stats.birthtime.getTime() > 0 ? stats.birthtime : stats.mtime);
  const mtime = pubDate || stats.mtime;

  // 计算阅读统计
  const { wordCount, readingTime } = calculateReadingStats(content);

  return generateFrontmatter({
    title,
    date: birthtime,
    pubDate: mtime,
    wordCount,
    readingTime,
  }, useDateTime);
};
