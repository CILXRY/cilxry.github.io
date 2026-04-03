// Imports
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  generateFrontmatterFromFile,
} from "../frontmatter.ts";
import { calculateReadingStats } from "../frontmatter/utils/calculateStats.ts";
import { ScriptConfig } from "../config.ts";

// Get the source directory path from command line arguments
const sourceDirPath = process.argv[2];
if (!sourceDirPath) {
  console.error(
    `你没有提供目录路径哦，${ScriptConfig.cli.helpMessages.exiBatch}`
  );
  process.exit(1);
}

// Get optional category from command line arguments
const category = process.argv[3] || "";

// Check if the source directory exists
if (!fs.existsSync(sourceDirPath)) {
  console.error(`目录不存在：${sourceDirPath}`);
  process.exit(1);
}

// Find all .md files in the directory
const mdFiles = fs
  .readdirSync(sourceDirPath)
  .filter((file) => file.toLowerCase().endsWith(".md"))
  .map((file) => path.join(sourceDirPath, file));

if (mdFiles.length === 0) {
  console.error(`在目录中没有找到 Markdown 文件：${sourceDirPath}`);
  process.exit(1);
}

console.log(`找到 ${mdFiles.length} 个 Markdown 文件，开始批量导入...\n`);

// Process each file
let successCount = 0;
let errorCount = 0;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseOutputDir =
  ScriptConfig.paths.outputDir || path.join(__dirname, "..", ScriptConfig.paths.projectBlogsDir);

// Determine output directory based on category
const outputDir = category
  ? path.join(baseOutputDir, category)
  : baseOutputDir;

// Create output directory if not exists (including category subdirectory)
fs.mkdirSync(outputDir, { recursive: true });

for (const sourceFilePath of mdFiles) {
  try {
    // Read the source file content
    const content = fs.readFileSync(sourceFilePath, "utf-8");

    // Generate slug from filename
    const baseName = path.basename(sourceFilePath, path.extname(sourceFilePath));
    let slug = baseName
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Ensure slug is not empty
    if (!slug) {
      console.warn(`⚠️  跳过文件：${baseName} - 无法从文件名生成有效的 slug`);
      errorCount++;
      continue;
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
      category
    );

    // Combine frontmatter and original content
    const newContent = frontmatter + content.trimStart();

    // Generate filename based on configuration
    const filename = ScriptConfig.frontmatter.useUUIDAsFileName
      ? `${crypto.randomUUID()}.md`
      : `${slug}.md`;

    const destFilePath = path.join(outputDir, filename);

    // Write the content with frontmatter to destination
    fs.writeFileSync(destFilePath, newContent);

    // Preserve original file timestamps
    fs.utimesSync(destFilePath, birthtime, mtime);

    console.log(
      `✅ ${filename} - 字数：${calculateReadingStats(content).wordCount}，阅读时长：${calculateReadingStats(content).readingTime} 分钟`
    );
    successCount++;
  } catch (error) {
    console.error(
      `❌ 处理文件失败：${path.basename(sourceFilePath)} - ${error instanceof Error ? error.message : error}`
    );
    errorCount++;
  }
}

console.log("\n===========================================");
console.log(`批量导入完成！`);
console.log(`成功：${successCount} 个文件`);
console.log(`失败：${errorCount} 个文件`);
if (category) {
  console.log(`分类：${category}`);
}
console.log(`输出目录：${outputDir}`);
console.log("===========================================");
