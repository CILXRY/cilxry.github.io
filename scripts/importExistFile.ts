// Imports
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the source file path from command line arguments
const sourceFilePath = process.argv[2];
if (!sourceFilePath) {
  console.error('你没有提供文件路径哦，使用 <pnpm exi "文件路径"> 的格式重试。');
  process.exit(1);
}

// Check if the source file exists
if (!fs.existsSync(sourceFilePath)) {
  console.error(`文件不存在: ${sourceFilePath}`);
  process.exit(1);
}

// Read the source file content
const content = fs.readFileSync(sourceFilePath, "utf-8");

// Since there's no frontmatter, generate slug from filename only
const baseName = path.basename(sourceFilePath, path.extname(sourceFilePath));
let slug = baseName
  .toLowerCase()
  .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
  .replace(/^-+|-+$/g, "");

// Ensure slug is not empty
if (!slug) {
  console.error("无法从文件名生成有效的 slug，请使用非空文件名。");
  process.exit(1);
}

// Get file stats for timestamps
const stats = fs.statSync(sourceFilePath);
const birthtime = stats.birthtime.getTime() > 0 ? stats.birthtime : stats.mtime;
const mtime = stats.mtime;

// Format date as YYYY-MM-DD (like in post.ts)
const formatDate = (date: Date) => date.toISOString().split("T")[0];

// === 新增：计算字数和阅读时长 ===
const cleanContent = content.trim();
// 中文、英文、数字都算作字符，按中文习惯：字数 = 所有非空白字符数
const wordCount = (cleanContent.match(/[^\s]/g) || []).length;
// 阅读速度：中文约 300 字/分钟，英文约 200 词/分钟，此处统一按 300 字/分钟估算
const readingTime = Math.ceil(wordCount / 300);

// Generate frontmatter using date (create time) and pubDate (modify time)
const frontmatter = `---
title: "${baseName}"
date: ${formatDate(birthtime)}
pubDate: ${formatDate(mtime)}
tags: [""]
categories:
description: 这是一个没有描述的文章
wordCount: ${wordCount}
readingTime: ${readingTime}
---

`;

// Combine frontmatter and original content
const newContent = frontmatter + content.trimStart();

// Save File
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destFilePath = path.join(
  __dirname,
  "..",
  "src",
  "content",
  "blog",
  `${slug}.md`,
);

// Create directory if not exists
fs.mkdirSync(path.dirname(destFilePath), { recursive: true });

// Write the content with frontmatter to destination
fs.writeFileSync(destFilePath, newContent);

// Preserve original file timestamps (atime and mtime) on the file system level
fs.utimesSync(destFilePath, birthtime, mtime);

console.log(`文件已添加到博客目录：${slug}.md`);
console.log(`字数: ${wordCount}，预计阅读时长: ${readingTime} 分钟`);