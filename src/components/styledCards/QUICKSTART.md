# 🚀 侧边栏卡片快速使用指南

## 📍 将卡片添加到侧边栏

### 步骤 1: 导入组件

在你的 `SidebarNav.astro` 或其他 Astro 组件中：

```astro
---
import SidebarCard from './StyledCards/SidebarCard.astro';
---
```

### 步骤 2: 在 `<aside>` 中添加卡片容器

找到你的侧边栏容器（通常在 `SidebarNav.astro` 中的 `<aside>` 标签内），添加卡片容器：

```astro
<aside id="sidebar" class="...">
  <!-- 站点标题 -->
  <div class="mb-8 px-2">
    <h2 class="text-xl font-bold">CILXRY 的小站</h2>
  </div>

  <!-- ✨ 在这里添加卡片 -->
  <div class="cards-container mb-6">
    <!-- 卡片 1 -->
    <SidebarCard 
      title="🎉 欢迎来到我的小站"
      content="这里记录我的技术学习和生活点滴"
      icon="notification"
      gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    />

    <!-- 卡片 2 -->
    <SidebarCard 
      title="关于作者"
      content="热爱编程的开发者"
      icon="user"
      gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
      href="/about"
      clickable={true}
    />
  </div>

  <!-- 导航列表 -->
  <nav class="flex-1">...</nav>
</aside>
```

### 步骤 3: 添加样式支持（可选）

如果卡片没有正确显示间距，确保添加了容器样式：

```astro
<style>
  .cards-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
```

## 💡 常用场景示例

### 场景 1: 添加公告卡片

```astro
<SidebarCard 
  title="📢 网站公告"
  content="本站已全新改版，欢迎体验！"
  icon="notification"
  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
/>
```

### 场景 2: 添加个人简介卡片（可点击）

```astro
<SidebarCard 
  title="👤 关于作者"
  content="前端开发者 / 技术博主 / 开源爱好者"
  icon="user"
  gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  href="https://github.com/your-profile"
  clickable={true}
/>
```

### 场景 3: 添加精选文章卡片

```astro
<SidebarCard 
  title="⭐ 精选推荐"
  content="查看我的高质量技术文章"
  icon="star"
  gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
  href="/featured"
  clickable={true}
/>
```

### 场景 4: 添加心情随笔卡片

```astro
<SidebarCard 
  title="💝 心情记录"
  content="记录生活的美好瞬间"
  icon="heart"
  gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"
  href="/memory"
  clickable={true}
/>
```

### 场景 5: 自定义图标卡片

```astro
<SidebarCard 
  title="📚 技术栈"
  content="Astro · Vue · TypeScript · Node.js"
  customIconSvg='<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>'
  gradient="linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
/>
```

## 🎨 渐变色推荐

复制这些渐变色直接使用：

```ts
// 紫色梦幻
gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"

// 粉红浪漫
gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"

// 清新薄荷
gradient="linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"

// 温暖橙色
gradient="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)"

// 天空蓝调
gradient="linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"

// 优雅紫罗兰
gradient="linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"

// 青柠冰茶
gradient="linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)"

// 极光渐变
gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
```

## 🔧 完整示例代码

这是一个完整的 `SidebarNav.astro` 示例，包含多个卡片：

```astro
---
import SidebarCard from './StyledCards/SidebarCard.astro';

interface NavItem {
  label: string;
  href: string;
}

interface Props {
  items: NavItem[];
  position?: "left" | "right";
}

const { items = [], position = "left" } = Astro.props;
---

<div class="sidebar-nav">
  <!-- 移动端按钮等省略... -->

  <aside id="sidebar">
    <!-- 站点标题 -->
    <div class="mb-8 px-2">
      <h2 class="text-xl font-bold">CILXRY 的小站</h2>
    </div>

    <!-- 卡片区域 -->
    <div class="cards-container mb-6">
      <SidebarCard 
        title="🎉 欢迎光临"
        content="这是我的个人小站，记录技术与生活"
        icon="notification"
        gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      />

      <SidebarCard 
        title="👤 关于作者"
        content="前端开发者，热爱分享"
        icon="user"
        gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
        href="/about"
        clickable={true}
      />
    </div>

    <!-- 导航列表 -->
    <nav class="flex-1">
      <ul class="space-y-2">
        {items.map((item) => (
          <li>
            <a href={item.href}>{item.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
</div>

<style>
  .cards-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
</style>
```

## ⚠️ 注意事项

1. **卡片数量**：建议侧边栏放置 2-4 个卡片即可，避免过多影响导航功能
2. **内容长度**：`content` 内容建议控制在 50 字以内，保持简洁
3. **颜色搭配**：根据网站主题色选择合适的渐变色
4. **响应式**：卡片会自动适配移动端和桌面端，无需额外配置
5. **性能**：使用了 backdrop-filter 毛玻璃效果，现代浏览器支持良好

## 🎯 下一步

- 查看 [`README.md`](./README.md) 了解详细的 API 文档
- 参考 [`SidebarCardExamples.astro`](./SidebarCardExamples.astro) 查看更多示例
- 修改 [`SidebarCard.astro`](./SidebarCard.astro) 自定义样式和行为
