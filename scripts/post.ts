// Imports
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Generate Frontmatter Variables
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

// Frontmatter Content
const content = `---
title: "${title}"
date: ${date}
---

`;

// Save File
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
