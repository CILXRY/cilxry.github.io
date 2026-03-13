# CILXRY's Website Intro

Hi there.

我是 CILXRY

随缘更新，反正没人看，我也不看

## 关于这个项目 | About the project

做一个网站，其实这只是一个我很无聊的选择。
~~如果我在我的网站上写了关于自述的文章且你看过的话~~
我看过很多大佬都有一个“个人网站”，是一个算是相对出酷的自我认同吧
当然也比较老气（我朋友的评价）

但有一个个人网站的话，
我就不用担心我的深夜emo、各种小记的东西写到哪
不用担心写到朋友圈然后有没有人看
不用担心发在别的平台会怎么怎么样
我不用担心这担心那，有了AI我也不需要被无所谓的旁人在意
（您点进来您算是贵人）

这里就算是我的自由区，无拘无束。

## 能帮到你吗

我深知这只是我本人用 Vibe Coding 做出来不三不四的产物，
如果说，这个框架能帮到你我当然很开心

### 你真的要用呀

谢谢谢谢，作为一个学生我真的十分感激
简单来讲，在clone代码到本地之后，修改[`src/config`](src/config/)

## 项目树

看这里：[ 项目树文档 ](docs/the-project-tree.md)

## 怎么在本地运行这个项目 | How to run this project local?

这个项目使用的是 `pnpm` 包管理器，因此需要用这些命令：

> 没有安装 pnpm ?
> 用 `npm install -g pnpm` 或者用系统的包管理器安装，比如 `sudo pacman -S pnpm`

第一次运行项目安装依赖：`pnpm i` 或者 `pnpm install`

其他的命令见对照表：

| 命令                     | 操作                                           |
| :----------------------- | :--------------------------------------------- |
| `pnpm dev`               | 在 `localhost:4000` 上运行开发                 |
| `pnpm build`             | 生成编译后的 HTML 到 `./dist/`                 |
| `pnpm preview`           | 在部署前本地预览样式                           |
| `pnpm dlx` / `pnpm exec` | Run one-off binaries (`pnpm dlx create-astro`) |
| `pnpm add <pkg>`         | 添加一个包                                     |
| `pnpm remove <pkg>`      | 删掉一个包                                     |

## Blog 的 Frontmatter 都是些什么东西 | What hell are there in every blog's frontmatter?

如下所示：

```yaml
---
title: 文章的标题
date: 2026-3-19 00:00 # 写文章的时间
pubDate: 2026-02-04 # 写的时间
tags: [" 标签 "]
categories: 分类
description: 文章描述
warning?: 文章内若有需要提醒的内容，可用这个字段描述提醒内容
---
```

## 那些我认为很好的所有 || 鸣谢

### 我自己 | Myself

- CILXRY，老己。

### 技术栈 | Tech Stack

- [Astro](https://astro.build) - MIT License - 强大的静态站点框架
- [Fuwari](https://github.com/saicaca/fuwari) - [MIT License](https://github.com/saicaca/fuwari?tab=MIT-1-ov-file#readme) - 一个十分漂亮的 Astro 模板
- [Qwen 千问 ](https://www.qianwen.com/) - 帮助我制作这个网站
- [IconFont](https://www.iconfont.cn/) - 一些图标

## 许可 | License

cilxry/cilxry.github.io 项目内容采用 GPLv3 开源。
这意味着你可以任意使用该项目代码，但若公开，请务必根据 LICENSE 规则公开源代码。

本项目所用到的开源项目和其开源协议在以上 鸣谢 部分有所标注，

以上。
