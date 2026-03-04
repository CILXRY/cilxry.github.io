/// <reference types="node" />

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  generateFrontmatter,
  calculateReadingStats,
  formatDate,
  formatDateTime,
} from "./frontmatter.ts";
import fetch from "node-fetch";

// ==================== 配置区域 ====================
const CONFIG = {
  // 是否使用时间格式（包含时分秒），默认 false（仅日期）
  useDateTime: true,

  // 默认更新选项
  defaultOptions: {
    preserveTitle: true, // 保留原有标题
    preserveTags: true, // 保留原有标签
    preserveCategories: true, // 保留原有分类
    addReadingStats: true, // 添加字数和阅读时长统计
    preserveMtime: true, // 保留原修改时间（元数据修改不视为内容修改）
  },

  // DeepSeek API 配置（如需启用 AI 生成 description）
  deepseek: {
    enabled: false, // 是否启用 AI 生成 description
    apiKey: "", // 你的 DeepSeek API Key
    model: "deepseek-chat", // 模型名称
    maxContentLength: 2000, // 发送给 AI 的最大字符数（防止 token 超限）
  },
};
// ================================================

/**
 * 解析 Markdown 文件中的 frontmatter
 * @param content 文件内容
 * @returns frontmatter 对象和正文内容
 */
const parseFrontmatter = (content: string) => {
  // 尝试匹配标准 frontmatter 格式（--- 包裹）
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/m);
  if (!match) {
    return { frontmatter: null, body: content };
  }

  const frontmatterStr = match[1];
  const body = match[2];

  // 简单的 YAML 解析（针对我们的 frontmatter 格式）
  const frontmatter: Record<string, any> = {};
  const lines = frontmatterStr.split(/\r?\n/);

  for (const line of lines) {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) continue;

    const key = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim();

    // 处理数组格式，如 tags: ["", ""]
    if (value.startsWith("[") && value.endsWith("]")) {
      const arrayContent = value.slice(1, -1);
      if (arrayContent.trim() === "") {
        frontmatter[key] = [];
      } else {
        frontmatter[key] = arrayContent
          .split(",")
          .map((item) => item.trim().replace(/"/g, ""));
      }
    } else if (value === '""' || value === "''") {
      frontmatter[key] = "";
    } else if (!isNaN(Number(value))) {
      frontmatter[key] = Number(value);
    } else {
      frontmatter[key] = value.replace(/^"|"$/g, "");
    }
  }

  return { frontmatter, body };
};

/**
 * 使用 DeepSeek AI 生成文章描述
 * @param title 文章标题
 * @param content 文章内容
 * @returns 生成的描述或空字符串
 */
const generateDescriptionWithAI = async (
  title: string,
  content: string,
): Promise<string> => {
  if (!CONFIG.deepseek.enabled || !CONFIG.deepseek.apiKey) {
    return "";
  }

  try {
    // 截取部分内容避免 token 超限
    const truncatedContent = content.slice(0, CONFIG.deepseek.maxContentLength);

    const response = await fetch(
      "https://api.deepseek.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${CONFIG.deepseek.apiKey}`,
        },
        body: JSON.stringify({
          model: CONFIG.deepseek.model,
          messages: [
            {
              role: "system",
              content:
                "你是一个专业的博客文章摘要生成器。请为给定的文章标题和内容生成一段简洁的描述（100-200 字），突出文章核心内容和价值。只返回描述文本，不要其他内容。",
            },
            {
              role: "user",
              content: `标题：${title}\n\n内容：${truncatedContent}`,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`API 请求失败：${response.status}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: string;
        };
      }>;
    };
    const generatedDesc = data.choices?.[0]?.message?.content?.trim() || "";

    console.log(`🤖 AI 生成描述：${generatedDesc.slice(0, 50)}...`);
    return generatedDesc;
  } catch (error) {
    console.error(`⚠️  AI 生成描述失败：${(error as Error).message}`);
    return "";
  }
};

/**
 * 更新单个文件的 frontmatter
 * @param filePath 文件路径
 * @param options 更新选项
 */
const updateFileFrontmatter = async (
  filePath: string,
  options: {
    preserveTitle?: boolean;
    preserveTags?: boolean;
    preserveCategories?: boolean;
    addReadingStats?: boolean;
    preserveMtime?: boolean;
    aiDescription?: boolean;
  } = {}
): Promise<boolean> => {
  const mergedOptions = { ...CONFIG.defaultOptions, ...options };
  const {
    preserveTitle,
    preserveTags,
    preserveCategories,
    addReadingStats,
    preserveMtime,
    aiDescription,
  } = mergedOptions;

  const content = fs.readFileSync(filePath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(content);

  // 如果没有 frontmatter，则创建新的
  if (!frontmatter) {
    console.log(`📝 ${path.basename(filePath)} 没有 frontmatter，正在创建...`);
    
    const stats = fs.statSync(filePath);
    const originalMtime = stats.mtime;
    const birthtime = stats.birthtime.getTime() > 0 ? stats.birthtime : stats.mtime;
    const title = path.basename(filePath, ".md");
    
    // 计算阅读统计
    const readingStats = addReadingStats ? calculateReadingStats(body) : { wordCount: 0, readingTime: 0 };
    
    // 构建 frontmatter 选项
    const newFrontmatterOptions: any = {
      title,
      date: CONFIG.useDateTime ? formatDateTime(birthtime) : formatDate(birthtime),
      pubDate: CONFIG.useDateTime ? formatDateTime(stats.mtime) : formatDate(stats.mtime),
      tags: [""],
      categories: "",
      description: "这是一个没有描述的文章",
    };
    
    if (addReadingStats) {
      newFrontmatterOptions.wordCount = readingStats.wordCount;
      newFrontmatterOptions.readingTime = readingStats.readingTime;
    }
    
    // 生成并写入新 frontmatter
    const newFrontmatter = generateFrontmatter(newFrontmatterOptions, CONFIG.useDateTime);
    const newContent = newFrontmatter + body.trimStart();
    fs.writeFileSync(filePath, newContent, "utf-8");
    
    // 保留原修改时间
    if (preserveMtime) {
      fs.utimesSync(filePath, originalMtime, originalMtime);
      console.log(`🕒 已保留原修改时间`);
    }
    
    return true;
  }

  // 获取文件统计信息
  const stats = fs.statSync(filePath);
  const originalMtime = stats.mtime;
  const birthtime = stats.birthtime.getTime() > 0 ? stats.birthtime : stats.mtime;

  // 保留原有的标题、标签和分类
  const title = preserveTitle && frontmatter.title ? frontmatter.title : path.basename(filePath, ".md");
  const tags = preserveTags && frontmatter.tags ? frontmatter.tags : [""];
  const categories = preserveCategories && frontmatter.categories ? frontmatter.categories : "";
  
  // 判断是否需要 AI 生成 description（为空或使用默认文本时）
  const needsAiDescription = aiDescription && 
    (!frontmatter.description || frontmatter.description === "这是一个没有描述的文章");
  
  // 如果启用 AI 生成描述且当前没有有效描述，则生成新描述
  let description = frontmatter.description || "这是一个没有描述的文章";
  if (needsAiDescription) {
    const aiDesc = await generateDescriptionWithAI(title, body);
    if (aiDesc) {
      description = aiDesc;
    }
  }

  // 构建新的 frontmatter 选项
  const newFrontmatterOptions: any = {
    title,
    date: frontmatter.date || (CONFIG.useDateTime ? formatDateTime(birthtime) : formatDate(birthtime)),
    pubDate: frontmatter.pubDate || (CONFIG.useDateTime ? formatDateTime(stats.mtime) : formatDate(stats.mtime)),
    tags,
    categories,
    description,
  };

  // 添加阅读统计
  if (addReadingStats) {
    const { wordCount, readingTime } = calculateReadingStats(body);
    newFrontmatterOptions.wordCount = wordCount;
    newFrontmatterOptions.readingTime = readingTime;
  }

  // 生成新的 frontmatter
  const newFrontmatter = generateFrontmatter(newFrontmatterOptions, CONFIG.useDateTime);

  // 写回文件
  const newContent = newFrontmatter + body.trimStart();
  fs.writeFileSync(filePath, newContent, "utf-8");

  // 如果需要保留原修改时间
  if (preserveMtime) {
    fs.utimesSync(filePath, originalMtime, originalMtime);
    console.log(`🕒 已保留原修改时间`);
  }

  return true;
};

/**
 * 批量更新 blogs 目录下所有 Markdown 文件的 frontmatter
 * @param blogsDir blogs 目录路径
 * @param options 更新选项
 */
const updateAllFrontmatter = async (
  blogsDir: string,
  options: {
    preserveTitle?: boolean;
    preserveTags?: boolean;
    preserveCategories?: boolean;
    addReadingStats?: boolean;
    preserveMtime?: boolean;
    aiDescription?: boolean;
  } = {},
) => {
  // 获取所有 .md 文件
  const files = fs.readdirSync(blogsDir).filter((file) => file.endsWith(".md"));

  if (files.length === 0) {
    console.log("📂 blogs 目录中没有 Markdown 文件");
    return;
  }

  console.log(`📝 开始更新 ${files.length} 个文件的 frontmatter...\n`);

  let successCount = 0;
  let skipCount = 0;

  for (const file of files) {
    const filePath = path.join(blogsDir, file);

    try {
      const updated = await updateFileFrontmatter(filePath, options);
      if (updated) {
        console.log(`✅ ${file}`);
        successCount++;
      } else {
        skipCount++;
      }
    } catch (error) {
      console.error(`❌ ${file} 更新失败：${(error as Error).message}`);
    }
  }

  console.log(
    `\n✨ 完成！成功更新 ${successCount} 个文件，跳过 ${skipCount} 个文件`,
  );
};

// 主程序入口
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const blogsDir = path.join(__dirname, "..", "src", "content", "blogs");

// 检查目录是否存在
if (!fs.existsSync(blogsDir)) {
  console.error(`❌ blogs 目录不存在：${blogsDir}`);
  process.exit(1);
}

// 检查命令行参数，判断是更新单个文件还是全部文件
const args = process.argv.slice(2);
const targetFile = args[0];

if (targetFile) {
  // 更新单个文件
  const filePath = path.isAbsolute(targetFile)
    ? targetFile
    : path.join(blogsDir, targetFile);

  if (!fs.existsSync(filePath)) {
    console.error(`❌ 文件不存在：${filePath}`);
    process.exit(1);
  }

  console.log(`📝 开始更新单个文件：${path.basename(filePath)}\n`);

  updateFileFrontmatter(filePath, {
    ...CONFIG.defaultOptions,
    aiDescription: CONFIG.deepseek.enabled,
  })
    .then((updated: boolean) => {
      if (updated) {
        console.log(`\n✨ 文件更新完成：${path.basename(filePath)}`);
      } else {
        console.log(`\n⚠️  文件跳过：${path.basename(filePath)}`);
      }
    })
    .catch((error: Error) => {
      console.error(`❌ 更新失败：${error.message}`);
      process.exit(1);
    });
} else {
  // 批量更新所有文件
  updateAllFrontmatter(blogsDir, {
    ...CONFIG.defaultOptions,
    aiDescription: CONFIG.deepseek.enabled,
  }).then(() => {
    console.log("\n💡 提示：");
    console.log("   - 使用 pnpm run update-frontmatter 来运行此脚本");
    console.log("   - 使用 pnpm run update-frontmatter <文件名> 更新单个文件");
    console.log("   - 在脚本顶部 CONFIG 对象中修改配置");
  });
}

console.log("\n💡 提示：可以使用 pnpm run update-frontmatter 来运行此脚本");
