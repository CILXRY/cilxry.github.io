/// <reference types="node" />

// 导入库
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateFrontmatter, formatDate } from "./frontmatter.ts";

// ==================== 配置区域 ====================
const CONFIG = {
  // 是否使用时间格式（包含时分秒），默认 false（仅日期）
  useDateTime: false,
};
// ================================================

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
const now = new Date();

// 使用统一的 frontmatter 生成函数
const content = generateFrontmatter({
  title,
  date: now,
  pubDate: now,
}, CONFIG.useDateTime);

// 保存文件
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(
  __dirname,
  "..",
  "src",
  "content",
  "blogs",
  `${slug}.md`,
);
fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, content);

console.log(`文章创建了哦：${slug} `);
