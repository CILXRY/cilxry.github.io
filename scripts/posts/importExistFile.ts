// Imports
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { generateFrontmatterFromFile } from "../frontmatter.ts";
import { calculateReadingStats } from "../frontmatter/utils/calculateStats.ts";
import { ScriptConfig } from "./config.ts";

// Get the source file path from command line arguments
const sourceFilePath = process.argv[2];
if (!sourceFilePath) {
  console.error(`你没有提供文件路径哦，${ScriptConfig.cli.helpMessages.exi}`);
  process.exit(1);
}

// Get optional category from command line arguments
const category = process.argv[3] || "";

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
  ScriptConfig.frontmatter.useDateTime,
  category,
);

// Combine frontmatter and original content
const newContent = frontmatter + content.trimStart();

// Save File
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate filename based on configuration
const filename = ScriptConfig.frontmatter.useUUIDAsFileName
  ? `${crypto.randomUUID()}.md`
  : `${slug}.md`;

// Determine output path based on category
const baseOutputDir = ScriptConfig.paths.outputDir || path.join(__dirname, "..", ScriptConfig.paths.projectBlogsDir);
const destDir = category
  ? path.join(baseOutputDir, category)
  : baseOutputDir;
const destFilePath = path.join(destDir, filename);

// Create directory if not exists (including category subdirectory)
fs.mkdirSync(destDir, { recursive: true });

// Write the content with frontmatter to destination
fs.writeFileSync(destFilePath, newContent);

// Preserve original file timestamps (atime and mtime) on the file system level
fs.utimesSync(destFilePath, birthtime, mtime);

console.log(`文件已添加到博客目录：${filename}`);
console.log(`字数：${calculateReadingStats(content).wordCount}，预计阅读时长：${calculateReadingStats(content).readingTime} 分钟`);
if (category) {
  console.log(`分类：${category}`);
}
