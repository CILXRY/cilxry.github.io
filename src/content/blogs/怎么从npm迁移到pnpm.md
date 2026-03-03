---
title: 怎么从npm迁移到pnpm
date: 2/4/2026, 11:47:17 AM
pubDate: 2/4/2026, 11:47:17 AM
tags: [""]
categories:
description: 这是一个没有描述的文章
---

# 怎么从 npm 迁移到 pnpm

## 简单步骤

前提是安装了 pnpm

1. 删除 node_modules 文件夹和 package-lock.json 文件
   不要把 package.json 删了

2. 使用 pnpm 安装依赖
   `pnpm install`
   之后会生成 pnpm-lock.yaml，相当于 npm 的 package-local.json

3. 在 packageManager 添加字段

在 package.json 添加：

```json
{
  "packageManager": "pnpm@8.15.0"
}
```
