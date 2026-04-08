# 项目树

这是 cilxry.github.io 的完整项目树，
这个项目介绍了 cilxry.github.io 的整个项目结构

画表技术不怎么样，请见谅

```
|ROOT
|
|src
|docs
|scripts
```

## src

整个项目核心目录
在 `tsconfig.json` 里定义了这个路径为 `@`

（不要问为什么有的是单数有的是复数，取决于我的想法）

### components

路径：`@cp`

项目的单组件资源，我觉得网站是类似于搭积木捡起来、拼拼图拼起来的那样
所有的单个积木都存在这个文件夹下
有的时候我会分类一下，文件夹基本就是其作用域或者其大体类别

- `Typer` 一个打字机动画
- `Sidebar` 侧边栏相关的内容
- `StyledCard` 网页内所有卡片样式
- `ThemeSwitch` 主题切换功能的组件
- `Sleepy` 一个状态监测的工具（但是没开始用）

- `Blog` 博客页面内用到的组件
- `HyperLinks` 友链页面内用到的组件

- `Others` 其他的我不知道怎么分类

### config

> 家人们觉得我的网站能有火的那一天吗 hhh

路径：`@/config`

存放着网站的配置文件，
我很尽量试图让网站特别客制化了

比如：

- `Hyperlinks-Items.ts` 友链页面的链接内容
- `Intro-Items.ts` Intro 页内的内容
- `NavBar-Items.ts` 导航栏的链接内容

### content

路径：`@/content`

页面内的内容资源

- `blogs` 博客页面
- `instructions` 指引页（一般作为内嵌不单独作为页面）
- `memory` 心情日记，朋友圈

### assets

路径：`@/assets`

一些资源文件

### i18n

路径：`@/i18n`

做了个半吊子的国际化
wow，国际化嘞
（最后当然是以放弃结束）

### layouts

路径：`@basePageLayout`

页面布局文件，
如果说 `component` 是单块拼图的话
那 `layout` 就是拼成 `page` 的框架了

### pages

各个子页面

### style

样式表

### utils

工具组件

## docs

存放这样的文档

## scripts

存放 nodejs 的脚本文件
