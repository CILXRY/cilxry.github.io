// 导入库
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// 生成 Frontmatter 需要的内容
const title = process.argv.slice(2).join(" ");
if (!title) {
  console.error('你没有提供标题哦，使用 <pnpm new "标题"> 的格式重试。');
  process.exit(1);
}
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
  .replace(/^-+|-+$/g, "");
const date = new Date().toISOString().split("T");

// Frontmatter 内容
const content = `---
title: ${title}
date: ${date}
pubDate: ${date}
tags: [""]
categories:
description: 这是一个没有描述的文章
---

`;

// 保存文件
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(
  __dirname,
  "..",
  "src",
  "content",
  "blog",
  `${slug}.md`,
);
fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, content);

console.log(`文章创建了哦：${slug} `);
