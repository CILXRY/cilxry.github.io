# LayoutComponents 布局组件库

这里是可复用的页面布局组件集合，用于增强网站的交互体验和视觉效果。

## 📦 可用组件

### 1. BackToTop - 返回顶部按钮

滚动超过一定距离后显示在右下角的返回顶部按钮。

**使用方式：**
```astro
---
import BackToTop from "@/layouts/LayoutComponents/BackToTop.astro";
---

<BackToTop />
```

**特性：**
- 滚动超过 300px 自动显示
- 平滑滚动动画
- 移动端自适应位置

---

### 2. ReadingProgress - 阅读进度条

固定在页面顶部的阅读进度指示器。

**使用方式：**
```astro
---
import ReadingProgress from "@/layouts/LayoutComponents/ReadingProgress.astro";
---

<ReadingProgress />
```

**特性：**
- 实时计算滚动进度
- 渐变色进度条
- 性能优化，无感知更新

---

### 3. BreadcrumbNav - 面包屑导航

显示页面层级路径的导航组件。

**使用方式：**
```astro
---
import BreadcrumbNav from "@/layouts/LayoutComponents/BreadcrumbNav.astro";
---

<BreadcrumbNav
  items={[
    { label: "博客", href: "/blog" },
    { label: "Arch 的 boot 优化", href: "/blogs/arch-boot-optimization" }
  ]}
/>
```

**特性：**
- 支持自定义层级
- 首页图标快捷入口
- 当前页高亮显示

---

### 4. SocialLinks - 社交链接栏

统一的社交平台入口展示。

**使用方式：**
```astro
---
import SocialLinks from "@/layouts/LayoutComponents/SocialLinks.astro";
---

<SocialLinks
  links={[
    { name: "GitHub", url: "https://github.com/CILXRY", icon: "github" },
    { name: "Email", url: "mailto:cilxry@outlook.com", icon: "mail" },
    { name: "Twitter", url: "https://twitter.com/yourname", icon: "twitter" }
  ]}
  size="md"
/>
```

**支持的图标：** `github`, `mail`, `twitter`, `linkedin`

**尺寸选项：** `sm`, `md`, `lg`

---

### 5. AnnouncementBar - 公告提示栏

页面顶部的通知横幅，支持可关闭设计。

**使用方式：**
```astro
---
import AnnouncementBar from "@/layouts/LayoutComponents/AnnouncementBar.astro";
---

<AnnouncementBar
  message="🎉 欢迎来到我的个人网站！"
  type="info"
  dismissible={true}
  storageKey="welcome-announcement"
/>
```

**类型选项：** `info`, `success`, `warning`, `error`

**特性：**
- 本地存储记住关闭状态
- 优雅的关闭动画
- 响应式设计

---

### 6. TableOfContents - 页面内目录

自动提取 Markdown 标题生成悬浮导航。

**使用方式：**
```astro
---
import TableOfContents from "@/layouts/LayoutComponents/TableOfContents.astro";
---

<TableOfContents
  title="文章目录"
  maxDepth={3}
/>
```

**特性：**
- 自动扫描 h1-h4 标签
- 桌面端右侧悬浮
- 移动端抽屉式面板
- 平滑滚动定位

**注意：** 需要确保文章内容区域的标题有 `id` 属性（Astro 会自动为 Markdown 标题添加）

---

### 7. SidebarNav - 侧边栏导航

支持移动端抽屉式和桌面端固定布局的侧边栏。

**使用方式：**
```astro
---
import SidebarNav from "@/layouts/LayoutComponents/SidebarNav.astro";
---

<SidebarNav
  items={[
    { label: "首页", href: "/" },
    { label: "博客", href: "/blog" },
    { label: "碎碎念", href: "/echo" },
    { label: "起始页", href: "/startpage" }
  ]}
  position="left"
/>
```

**位置选项：** `left`, `right`

**特性：**
- 移动端手势开关
- 遮罩层点击关闭
- ESC 键快捷关闭
- 桌面端自动转为固定侧边栏

---

### 8. SearchBox - 搜索框组件

支持本地内容搜索的智能搜索框。

**使用方式：**
```astro
---
import SearchBox from "@/layouts/LayoutComponents/SearchBox.astro";
---

<SearchBox
  placeholder="搜索文章..."
  searchPath="/content/blogs/"
/>
```

**特性：**
- 防抖搜索优化
- 桌面端下拉结果
- 移动端全屏面板
- 点击外部自动关闭

**TODO:** 需要创建搜索索引文件 `/search-index.json` 来支持实际搜索功能

---

## 🔧 组合使用示例

### 博客文章页面布局

```astro
---
import BasePageFrame from "@/layouts/BasePageLayoutFrames/BasePageFrame.astro";
import ReadingProgress from "@/layouts/LayoutComponents/ReadingProgress.astro";
import BreadcrumbNav from "@/layouts/LayoutComponents/BreadcrumbNav.astro";
import TableOfContents from "@/layouts/LayoutComponents/TableOfContents.astro";
import BackToTop from "@/layouts/LayoutComponents/BackToTop.astro";
import SocialLinks from "@/layouts/LayoutComponents/SocialLinks.astro";
---

<BasePageFrame websiteTitle="文章标题">
  <ReadingProgress />
  
  <main class="flex gap-8">
    <!-- 主内容区 -->
    <article class="flex-1">
      <BreadcrumbNav items={[{ label: "博客", href: "/blog" }]} />
      
      <h1>文章标题</h1>
      
      <SocialLinks 
        links={[
          { name: "分享", url: window.location.href, icon: "mail" }
        ]} 
      />
      
      <slot />
    </article>
    
    <!-- 侧边目录 -->
    <TableOfContents />
  </main>
  
  <BackToTop />
</BasePageFrame>
```

### 首页布局

```astro
---
import BasePageFrame from "@/layouts/BasePageLayoutFrames/BasePageFrame.astro";
import AnnouncementBar from "@/layouts/LayoutComponents/AnnouncementBar.astro";
import SocialLinks from "@/layouts/LayoutComponents/SocialLinks.astro";
import BackToTop from "@/layouts/LayoutComponents/BackToTop.astro";
---

<BasePageFrame>
  <AnnouncementBar message="欢迎访问我的博客！" />
  
  <div class="flex justify-end mb-4">
    <SocialLinks />
  </div>
  
  <slot />
  
  <BackToTop />
</BasePageFrame>
```

---

## 🎨 样式定制

所有组件都使用 UnoCSS 原子化类名，可以通过以下方式定制：

1. **修改主题色：** 通过 CSS 变量 `--cp-*` 统一控制
2. **调整动画：** 修改组件内的 transition 类名
3. **改变尺寸：** 使用 UnoCSS 的响应式前缀（如 `md:`, `lg:`）

---

## 📝 注意事项

1. **客户端脚本：** 所有交互组件都包含 `<script>` 标签，Astro 会自动处理 hydration
2. **图标依赖：** 大部分组件使用 `@lucide/astro` 图标库
3. **响应式：** 所有组件都已适配移动端和桌面端
4. **无障碍性：** 组件包含适当的 ARIA 标签和键盘导航支持

---

## 🚀 未来计划

- [ ] 集成 Algolia DocSearch
- [ ] 添加更多主题预设
- [ ] 支持自定义动画效果
- [ ] 添加骨架屏加载状态
- [ ] 支持 PWA 离线访问

---

如有问题或建议，欢迎联系作者！📧
