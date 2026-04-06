#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return { frontmatter: {}, body: content, hasFrontmatter: false };

  const frontmatter = {};
  const lines = match[1].split("\n");
  let currentKey = null;
  let currentValue = "";
  let isArray = false;
  let inArray = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);

    if (kvMatch && !inArray) {
      if (currentKey) {
        frontmatter[currentKey] = parseValue(currentValue, isArray);
      }
      currentKey = kvMatch[1];
      currentValue = kvMatch[2];
      isArray = currentValue.startsWith("[");

      if (isArray) {
        if (currentValue.endsWith("]")) {
          frontmatter[currentKey] = parseValue(currentValue, true);
          currentKey = null;
          isArray = false;
        } else {
          inArray = true;
        }
      }
    } else if (inArray) {
      currentValue += " " + line.trim();
      if (line.includes("]")) {
        frontmatter[currentKey] = parseValue(currentValue, true);
        currentKey = null;
        isArray = false;
        inArray = false;
      }
    }
  }

  if (currentKey && !inArray) {
    frontmatter[currentKey] = parseValue(currentValue, isArray);
  }

  const bodyStart = match[0].length;
  const body = content.slice(bodyStart);

  return { frontmatter, body, hasFrontmatter: true };
}

function parseValue(value, isArray) {
  if (isArray) {
    const content = value.replace(/^\[|\]$/g, "");
    if (!content.trim()) return [];
    return content
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  value = value.trim().replace(/^["']|["']$/g, "");

  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "") return null;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value);

  return value;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

function getFileTimes(filePath) {
  const stats = fs.statSync(filePath);
  const birthtime = stats.birthtime;
  const mtime = stats.mtime;
  const creation = birthtime < mtime ? birthtime : mtime;
  return {
    creation: formatDate(creation),
    published: formatDate(mtime),
  };
}

function titleFromFilename(filename) {
  let title = filename.replace(/\.md$/, "");
  title = title.replace(/[#@$%^&*!~`|\\<>?"']/g, "");
  title = title.replace(/[-_]+/g, " ");
  title = title.replace(/\s+/g, " ").trim();
  return title || "Untitled";
}

function stringifyFrontmatter(frontmatter) {
  const lines = [];

  const order = [
    "title",
    "tags",
    "category",
    "author",
    "draft",
    "description",
    "descGenAuthor",
    "descGenTime",
    "wordCount",
    "readingTime",
    "creation",
    "published",
    "warning",
  ];

  for (const key of order) {
    if (frontmatter[key] !== undefined) {
      lines.push(stringifyValue(key, frontmatter[key]));
    }
  }

  for (const key of Object.keys(frontmatter)) {
    if (!order.includes(key)) {
      lines.push(stringifyValue(key, frontmatter[key]));
    }
  }

  return lines.join("\n");
}

function stringifyValue(key, value) {
  if (value === null) {
    return `${key}: null`;
  }
  if (value === undefined) {
    return `${key}: null`;
  }
  if (typeof value === "boolean") {
    return `${key}: ${value}`;
  }
  if (typeof value === "number") {
    return `${key}: ${value}`;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return `${key}: []`;
    }
    const items = value.map((item) => `"${item}"`).join(", ");
    return `${key}: [${items}]`;
  }
  if (typeof value === "string") {
    if (value.includes(":") || value.includes("#") || value.includes("\n")) {
      return `${key}: "${value}"`;
    }
    return `${key}: ${value}`;
  }
  return `${key}: ${value}`;
}

function fixFrontmatter(filePath, schema) {
  const content = fs.readFileSync(filePath, "utf-8");
  const { frontmatter, body, hasFrontmatter } = parseFrontmatter(content);
  const fileTimes = getFileTimes(filePath);
  const filename = path.basename(filePath);

  const fixed = { ...frontmatter };
  const changes = [];

  if (!fixed.title) {
    fixed.title = titleFromFilename(filename);
    changes.push(`title: "${fixed.title}" (从文件名生成)`);
  }

  if (!fixed.creation) {
    fixed.creation = fileTimes.creation;
    changes.push(`creation: ${fixed.creation} (从文件时间生成)`);
  }

  if (!fixed.published) {
    fixed.published = fileTimes.published;
    changes.push(`published: ${fixed.published} (从文件时间生成)`);
  }

  if (fixed.draft === undefined) {
    fixed.draft = false;
    changes.push(`draft: false (默认值)`);
  }

  if (fixed.tags === undefined) {
    fixed.tags = null;
    changes.push(`tags: null (默认值)`);
  }

  if (fixed.category === undefined) {
    fixed.category = null;
    changes.push(`category: null (默认值)`);
  }

  if (fixed.author === undefined) {
    fixed.author = null;
    changes.push(`author: null (默认值)`);
  }

  if (fixed.description === undefined) {
    fixed.description = null;
    changes.push(`description: null (默认值)`);
  }

  if (changes.length === 0) {
    return { changed: false, changes: [] };
  }

  const newFrontmatterStr = stringifyFrontmatter(fixed);
  const newContent = `---\n${newFrontmatterStr}\n---${body}`;

  fs.writeFileSync(filePath, newContent, "utf-8");

  return { changed: true, changes };
}

function getAllMarkdownFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 1) {
    console.log("用法: node fix.js <posts目录>");
    console.log("示例: node fix.js ./posts");
    process.exit(1);
  }

  const postsDir = args[0];

  if (!fs.existsSync(postsDir)) {
    console.log(`❌ 目录不存在: ${postsDir}`);
    process.exit(1);
  }

  const files = getAllMarkdownFiles(postsDir);

  if (files.length === 0) {
    console.log("⚠️  没有找到 Markdown 文件");
    process.exit(0);
  }

  console.log(`\n🔧 修复 ${files.length} 个文件...\n`);

  let fixedCount = 0;
  let unchangedCount = 0;

  for (const file of files) {
    const result = fixFrontmatter(file);

    if (result.changed) {
      console.log(`✏️  ${path.relative(process.cwd(), file)}`);
      result.changes.forEach((change) => console.log(`   + ${change}`));
      fixedCount++;
    } else {
      unchangedCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`📊 统计: 共 ${files.length} 个文件`);
  console.log(`   ✏️  已修复: ${fixedCount}`);
  console.log(`   ✅ 无需修改: ${unchangedCount}`);
  console.log("=".repeat(50));
}

main();
