# CILXRY's Website Intro

Hi there.

我是 CILXRY

随缘更新，反正没人看，我也不看

## 项目树

```
|root
|-- docs/    # 暂时只放了英文的readme
|-- public/  # 公共文件，字体和图标
|-- scripts/ # nodejs 用到的脚本文件
|- src/
|-- assets/  # 静态资源
|-- components/  # 单组件资源
|-- content/ # 内容资源
|--- blog/   # 文章
|-- layouts/ # 布局
|--- LayoutComponents/ # 布局组件
|-- pages/ # 页面文件
|-- style/ # 样式表
|-- utils/ # 工具组件
```

## 怎么在本地运行这个项目 | How to run this project local?

这个项目使用的是 `pnpm` 包管理器，因此需要用这些命令：

> 没有安装 pnpm ?
> 用 `npm install -g pnpm` 或者用系统的包管理器安装，比如 `sudo pacman -S pnpm`

第一次运行项目安装依赖：`pnpm i` 或者 `pnpm install`

其他的命令见对照表：

| 命令                     | 操作                                           |
| :----------------------- | :--------------------------------------------- |
| `pnpm dev`               | Starts local dev server at `localhost:4321`    |
| `pnpm build`             | Build your production site to `./dist/`        |
| `pnpm preview`           | Preview your build locally, before deploying   |
| `pnpm dlx` / `pnpm exec` | Run one-off binaries (`pnpm dlx create-astro`) |
| `pnpm add <pkg>`         | Add a dependency                               |
| `pnpm remove <pkg>`      | Remove a dependency                            |

## Blog 的 Frontmatter 都是些什么东西 | What hell are there in every blog's frontmatter?

如下所示：

```yaml
---
title: 文章的标题
date: 2026-3-19 00:00 # 写文章的时间
pubDate: 2026-02-04 # 写的时间
tags: ["标签"]
categories: 分类
description: 文章描述
warning?: 文章内若有需要提醒的内容，可用这个字段描述提醒内容
---
```

## 那些我认为很好的所有 || 鸣谢

- CILXRY，老己。
- [Astro](https://astro.build) - MIT License - 强大的静态站点框架

## 许可 | License

cilxry/cilxry.github.io 项目内容采用 GPLv3 开源。
这意味着你可以任意使用该项目代码，但若公开，请务必根据 LICENSE 规则公开源代码。

本项目所用到的开源项目和其开源协议在以上 鸣谢 部分有所标注，

以上。
