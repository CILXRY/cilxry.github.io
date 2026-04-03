# Frontmatter 模块使用指南

这是关于文章的 Frontmatter的说明

## Frontmatter 有什么

### baseInfo

title: 标题 字符串 非可选
tags: 标签 非空字符串的列表 可选
category: 分类 字符串 可选
author: 作者 字符串
draft: 草稿状态 布尔

### [beta]contentInfo

warning: 文章的注意事项 字符串
reference: 引用链接 字符串

### descriptionInfo

description: 简介 字符串
descGenAuthor: 简介生成作者 字符串
descGenTime 生成简介的时间 时间

## stat

wordCount: 字数统计
readingTime: 阅读时长

## timeInfo

creation: 创建时间（第一次创建的时间）
published: 发布/修改时间（计划用于“文章发布于xxx时，修改与xxx”的提示）

## 📁 模块结构

```
scripts/frontmatter/
├── index.ts              # 主入口（推荐使用）
├── types.ts              # TypeScript 类型定义
├── config.ts             # 配置常量
├── utils/                # 工具函数
│   ├── formatDate.ts     # 日期格式化
│   └── calculateStats.ts# 阅读统计计算
└── generators/           # 各部分生成器
    ├── baseInfo.ts       # 基础信息 (title, tags, category, author, draft)
    ├── introInfo.ts      # 简介信息 (description, descGenAuthor, descGenTime)
    ├── timeInfo.ts       # 时间信息 (date, pubDate)
    ├── stats.ts          # 阅读统计 (wordCount, readingTime)
    └── contentInfo.ts    # 内容信息 (warning, original)
```

## 💡 使用方式

### 方式 1：从新模块导入（推荐）

```typescript
import { generateFrontmatter } from "./frontmatter/index.js";
import type { FrontmatterOptions } from "./frontmatter/types.js";

const options: Partial<FrontmatterOptions> = {
  title: "我的新文章",
  tags: ["Astro", "博客"],
  category: "技术",
  author: "CILXRY",
  draft: false,
  description: "这是一篇技术文章",
  descGenAuthor: "Manual",
  descGenTime: new Date(),
  date: new Date(),
  pubDate: new Date(),
  wordCount: 1500,
  readingTime: 5,
  warning: "本文包含剧透内容",
  original: true,
};

const frontmatter = generateFrontmatter(options, false); // false = 不使用时间格式
```

### 方式 2：从旧模块导入（向后兼容）

```typescript
// 仍然可以使用旧的导入方式，但会看到 deprecation 提示
import { generateFrontmatter } from "./frontmatter.ts";

const frontmatter = generateFrontmatter(
  {
    title: "我的新文章",
    tags: ["Astro", "博客"],
    categories: "技术", // ⚠️ 注意：旧版本使用复数形式
    date: new Date(),
    pubDate: new Date(),
    description: "这是一篇技术文章",
    wordCount: 1500,
    readingTime: 5,
  },
  false
);
```

### 方式 3：分模块使用（高级用法）

```typescript
import { generateBaseInfo } from "./frontmatter/generators/baseInfo.js";
import { generateTimeInfo } from "./frontmatter/generators/timeInfo.js";
import { generateIntroInfo } from "./frontmatter/generators/introInfo.js";

// 可以单独生成某一部分的 frontmatter
const baseInfo = generateBaseInfo({
  title: "我的文章",
  tags: ["测试"],
  category: "随笔",
});

const timeInfo = generateTimeInfo(
  {
    date: new Date(),
    pubDate: new Date(),
  },
  false
);

// 手动组合
let frontmatter = "---\n";
frontmatter += baseInfo;
frontmatter += timeInfo;
frontmatter += "---\n\n";
```

## 🔧 配置选项

所有配置常量都在 `config.ts` 中定义：

```typescript
import { CONFIG } from "./frontmatter/config.js";

console.log(CONFIG.DEFAULT_DESCRIPTION); // "这是一个没有描述的文章"
console.log(CONFIG.DEFAULT_AUTHOR); // ""
console.log(CONFIG.DEFAULT_DRAFT); // false
console.log(CONFIG.DEFAULT_ORIGINAL); // true
```

## 🛠️ 工具函数

### 日期格式化

```typescript
import {
  formatDate,
  formatDateTime,
  normalizeDate,
} from "./frontmatter/utils/formatDate.js";

const now = new Date();

// 仅日期：YYYY-MM-DD
console.log(formatDate(now)); // "2026-03-10"

// 完整时间：YYYY-MM-DD HH:mm:ss
console.log(formatDateTime(now)); // "2026-03-10 19:51:13"

// 智能格式化
console.log(normalizeDate(now, false)); // "2026-03-10"
console.log(normalizeDate(now, true)); // "2026-03-10 19:51:13"
console.log(normalizeDate("2026-03-10", true)); // "2026-03-10" (字符串直接返回)
```

### 阅读统计计算

```typescript
import { calculateReadingStats } from "./frontmatter/utils/calculateStats.js";

const content = "这是一段测试内容...";
const { wordCount, readingTime } = calculateReadingStats(content);

console.log(`字数：${wordCount}`); // 字数统计
console.log(`阅读时长：${readingTime}分钟`); // 向上取整的分钟数
```

## 📝 Frontmatter 输出示例

### 完整示例

```yaml
---
title: "如何在博客中使用提示框"
tags: ["Astro", "Markdown", "教程"]
category: 技术
author: CILXRY
draft: false
date: 2026-03-10 19:51:13
pubDate: 2026-03-10 19:51:13
description: 详细介绍如何在 Astro 博客中使用自定义提示框组件
descGenAuthor: Manual
descGenTime: 2026-03-10 19:51:13
wordCount: 2500
readingTime: 9
warning: 本文包含代码示例
original: true
---
```

### 最小化示例（仅必填字段）

```yaml
---
title: "无题"
tags: []
category:
date: 2026-03-10
pubDate: 2026-03-10
description: 这是一个没有描述的文章
---
```

## 🔄 迁移指南

### 从旧版本迁移

1. **修改导入路径**（可选，保持向后兼容）：

   ```typescript
   // 旧方式
   import { generateFrontmatter } from "./frontmatter.ts";

   // 新方式（推荐）
   import { generateFrontmatter } from "./frontmatter/index.js";
   ```

2. **更新字段名称**：
   - `categories` → `category`（单数）

3. **添加新字段**（可选）：
   ```typescript
   const options = {
     // ... 原有字段
     author: "你的名字",
     descGenAuthor: "Manual",
     original: true,
   };
   ```

## ⚙️ TypeScript 类型支持

所有类型都已导出，可以在你的脚本中使用：

```typescript
import type {
  FrontmatterOptions, // 完整选项
  PartialFrontmatterOptions, // 部分选项（用于更新）
  BaseInfo, // 基础信息类型
  IntroInfo, // 简介信息类型
  TimeInfo, // 时间信息类型
  ReadingStats, // 阅读统计类型
  ContentInfo, // 内容信息类型
} from "./frontmatter/types.js";
```

## 🎉 优势

1. **模块化** - 每个部分独立维护，易于理解和扩展
2. **类型安全** - 完整的 TypeScript 类型定义
3. **可配置** - 所有默认值集中在 config.ts
4. **可扩展** - 轻松添加新字段或自定义生成逻辑
5. **向后兼容** - 现有脚本无需修改即可继续使用
