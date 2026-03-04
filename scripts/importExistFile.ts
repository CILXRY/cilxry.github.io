// Imports
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateFrontmatterFromFile, calculateReadingStats } from "./frontmatter.ts";

// ==================== 配置区域 ====================
const CONFIG = {
  // 是否使用时间格式（包含时分秒），默认 false（仅日期）
  useDateTime: false,
};
// ================================================

// Get the source file path from command line arguments
const sourceFilePath = process.argv[2];
if (!sourceFilePath) {
  console.error('你没有提供文件路径哦，使用 <pnpm exi "文件路径"> 的格式重试。');
  process.exit(1);
}

// Check if the source file exists
if (!fs.existsSync(sourceFilePath)) {
  console.error(`文件不存在：${sourceFilePath}`);
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

// Generate frontmatter using the unified function
const frontmatter = generateFrontmatterFromFile(
  sourceFilePath,
  baseName,
  birthtime,
  mtime,
  CONFIG.useDateTime,
);

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
console.log(`字数：${calculateReadingStats(content).wordCount}，预计阅读时长：${calculateReadingStats(content).readingTime} 分钟`);
