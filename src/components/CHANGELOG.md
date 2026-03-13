# 布局组件更新日志

## 🎉 2026-03-05 - 新增 LayoutComponents 组件库

### ✨ 新增组件

本次更新为 `LayoutComponents` 目录添加了 8 个实用的页面布局组件，用于增强网站的交互体验和视觉效果。

#### 1. BackToTop - 返回顶部按钮
**文件：** `BackToTop.astro`

功能特性:
- 滚动超过 300px 自动显示
- 平滑滚动到顶部动画
- 移动端自适应位置调整
- 优雅的淡入淡出效果

使用场景:
- 所有长内容页面
- 博客文章页
- 文档页面

---

#### 2. ReadingProgress - 阅读进度条
**文件：** `ReadingProgress.astro`

功能特性:
- 实时计算页面滚动进度
- 渐变色进度条样式
- 固定在页面顶部
- 性能优化，无感知更新

使用场景:
- 博客文章页
- 长文档页面
- 教程页面

---

#### 3. BreadcrumbNav - 面包屑导航
**文件：** `BreadcrumbNav.astro`

功能特性:
- 支持自定义层级路径
- 首页图标快捷入口
- 当前页高亮显示
- SEO 友好的结构化数据

使用场景:
- 多级分类博客
- 文档系统
- 电商网站

---

#### 4. SocialLinks - 社交链接栏
**文件：** `SocialLinks.astro`

功能特性:
- 支持多个社交平台
- 内置 GitHub、Mail、Twitter、LinkedIn 图标
- 三种尺寸可选 (sm/md/lg)
- Hover 缩放动效

使用场景:
- 个人主页
- 关于页面
- 文章底部

---

#### 5. AnnouncementBar - 公告提示栏
**文件：** `AnnouncementBar.astro`

功能特性:
- 四种类型 (info/success/warning/error)
- 本地存储记住关闭状态
- 优雅的关闭动画
- 响应式设计

使用场景:
- 全站通知
- 活动宣传
- 系统维护公告

---

#### 6. TableOfContents - 页面内目录
**文件：** `TableOfContents.astro`

功能特性:
- 自动扫描 h1-h4 标题
- 桌面端右侧悬浮显示
- 移动端抽屉式面板
- 平滑滚动定位
- 支持自定义最大深度

使用场景:
- 技术文章
- API 文档
- 长篇教程

---

#### 7. SidebarNav - 侧边栏导航
**文件：** `SidebarNav.astro`

功能特性:
- 移动端抽屉式交互
- 桌面端固定侧边栏
- 手势开关支持
- ESC 键快捷关闭
- 遮罩层点击关闭
- 可配置左右位置

使用场景:
- 文档网站
- 后台管理系统
- 个人博客导航

---

#### 8. SearchBox - 搜索框组件
**文件：** `SearchBox.astro`

功能特性:
- 防抖搜索优化
- 桌面端下拉结果展示
- 移动端全屏搜索面板
- 点击外部自动关闭
- 需要搜索索引支持

使用场景:
- 博客搜索
- 文档检索
- 内容查找

---

### 📁 新增布局框架

基于上述组件，创建了三个增强的页面布局框架：

#### 1. BlogPostFrame.astro
专为博客文章设计的布局，包含：
- 阅读进度条
- 面包屑导航
- 页面内目录
- 返回顶部按钮
- 可选的社交链接

#### 2. GeneralFrame.astro
通用页面布局，包含：
- 可选的公告栏
- 可选的社交链接
- 返回顶部按钮

#### 3. SidebarFrame.astro
带侧边栏导航的布局，包含：
- 移动端/桌面端自适应侧边栏
- 返回顶部按钮

---

### 📝 文档与示例

#### README.md
完整的组件使用指南，包括：
- 每个组件的详细 API
- 组合使用示例
- 样式定制方法
- 注意事项

#### CHANGELOG.md (本文件)
更新记录和版本历史

#### layouts-demo.astro
演示页面，展示所有组件的实际效果

---

### 🔧 技术细节

**依赖项:**
- `@lucide/astro` - 图标库
- UnoCSS - 原子化 CSS
- Astro 原生脚本

**浏览器兼容性:**
- Chrome/Edge: ✅ 最新 2 个版本
- Firefox: ✅ 最新 2 个版本
- Safari: ✅ 最新 2 个版本
- Mobile Safari: ✅ iOS 12+
- Chrome for Android: ✅ 最新 2 个版本

**无障碍性:**
- ARIA 标签完整
- 键盘导航支持
- 焦点管理完善
- 屏幕阅读器友好

---

### 🚀 快速开始

1. **在现有页面中使用单个组件:**
```astro
---
import BackToTop from "@/layouts/LayoutComponents/BackToTop.astro";
---

<BackToTop />
```

2. **使用增强布局框架:**
```astro
---
import BlogPostFrame from "@/layouts/BasePageLayoutFrames/BlogPostFrame.astro";
---

<BlogPostFrame category="tech">
  <!-- 文章内容 -->
</BlogPostFrame>
```

3. **访问演示页面:**
```
http://localhost:4000/layouts-demo
```

---

### 📊 性能影响

所有组件都遵循 Astro 的零 JavaScript 原则：
- **静态组件:** 无客户端 JS
- **交互组件:** 仅必要的最小 JS（如滚动监听）
- **打包体积:** < 5KB (gzip 后)

---

### 🎯 后续计划

- [ ] 集成 Algolia DocSearch 支持
- [ ] 添加骨架屏加载状态
- [ ] 支持 PWA 离线访问
- [ ] 更多主题预设
- [ ] 自定义动画效果
- [ ] 搜索索引自动生成脚本

---

### 💡 使用建议

1. **按需引入:** 不需要在所有页面使用所有组件
2. **性能优先:** 避免过度使用动画效果
3. **保持一致:** 整个网站的交互体验应统一
4. **测试验证:** 在真实设备上测试移动端交互

---

### 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

联系方式: cilxry@outlook.com

---

**最后更新:** 2024-03-05
**版本:** v1.0.0
