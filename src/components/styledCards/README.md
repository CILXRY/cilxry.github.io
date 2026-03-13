# SidebarCard - 侧边栏卡片组件

一个美观、通用的侧边栏卡片组件，可用于展示公告、简介、统计信息等内容。

## 🎯 功能特性

- ✨ 支持自定义标题和内容
- 🎨 可配置渐变背景颜色
- 🔘 多种预设图标（用户、星星、爱心、信息、通知）
- 🎭 支持自定义 SVG 图标
- 🔗 可选的点击跳转功能
- 📱 响应式设计，适配移动端和桌面端
- 🌓 自动适配亮色/暗色模式
- 💫 优雅的 hover 动画效果

## 📦 安装使用

### 基本用法

```astro
import SidebarCard from './StyledCards/SidebarCard.astro';

<SidebarCard 
  title="欢迎来到我的小站"
  content="这里记录我的技术学习和生活点滴"
  icon="notification"
/>
```

### Props 参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `title` | `string` | `'卡片标题'` | 卡片标题 |
| `content` | `string` | `'卡片内容'` | 卡片正文内容 |
| `icon` | `'user' \| 'star' \| 'heart' \| 'info' \| 'notification' \| 'custom'` | `'info'` | 预设图标类型 |
| `customIconSvg` | `string` | `undefined` | 自定义 SVG 图标字符串 |
| `gradient` | `string` | `'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'` | 背景渐变色 |
| `href` | `string` | `'#'` | 点击跳转链接（仅在 clickable=true 时使用） |
| `clickable` | `boolean` | `false` | 是否启用点击模式 |

## 💡 使用示例

### 1. 公告卡片

```astro
<SidebarCard 
  title="🎉 公告通知"
  content="网站全新改版，欢迎关注！"
  icon="notification"
  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
/>
```

### 2. 个人简介卡片（可点击）

```astro
<SidebarCard 
  title="关于作者"
  content="热爱编程的开发者，喜欢分享技术知识"
  icon="user"
  gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  href="/about"
  clickable={true}
/>
```

### 3. 自定义图标卡片

```astro
<SidebarCard 
  title="技术栈"
  content="TypeScript · Astro · Vue · Node.js"
  customIconSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  gradient="linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
/>
```

### 4. 在侧边栏中添加多个卡片

```astro
---
import SidebarCard from './StyledCards/SidebarCard.astro';
---

<aside class="sidebar">
  <!-- 卡片区域 -->
  <div class="cards-container">
    <SidebarCard 
      title="💝 心情记录"
      content="记录生活中的美好瞬间"
      icon="heart"
      gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
      href="/memory"
      clickable={true}
    />

    <SidebarCard 
      title="⭐ 精选文章"
      content="查看技术教程和心得分享"
      icon="star"
      gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
      href="/featured"
      clickable={true}
    />

    <SidebarCard 
      title="💡 小提示"
      content="网站持续更新中..."
      icon="info"
      gradient="linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
    />
  </div>

  <!-- 导航列表等其他内容 -->
</aside>
```

## 🎨 预设图标

- `user` - 用户图标（关于作者）
- `star` - 星星图标（精选推荐）
- `heart` - 爱心图标（心情记录）
- `info` - 信息图标（提示说明）
- `notification` - 通知图标（公告消息）
- `custom` - 自定义图标（需提供 `customIconSvg`）

## 🌈 渐变色推荐

以下是一些好看的渐变色组合：

```ts
// 紫色梦幻
'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

// 粉红浪漫
'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'

// 清新薄荷
'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'

// 温暖橙色
'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'

// 天空蓝调
'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)'

// 优雅紫罗兰
'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)'
```

## 📝 注意事项

1. **图标优先级**：当同时设置 `icon` 和 `customIconSvg` 时，`customIconSvg` 优先
2. **点击模式**：设置 `clickable={true}` 后会显示"了解更多"链接和箭头图标
3. **颜色适配**：组件会自动根据系统主题切换亮色/暗色模式的样式
4. **性能优化**：使用 backdrop-filter 实现毛玻璃效果，现代浏览器支持良好

## 📂 文件结构

```
src/components/StyledCards/
├── SidebarCard.astro              # 核心组件
├── SidebarCardExamples.astro      # 使用示例
└── README.md                      # 本文档
```

## 🔗 相关组件

- [`SidebarNav.astro`](../Sidebar/SidebarNav.astro) - 侧边栏导航组件
- [`AnnouncementBar.astro`](../AnnouncementBar.astro) - 顶部公告栏组件
