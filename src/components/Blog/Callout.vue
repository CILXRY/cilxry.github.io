<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  type: 'info' | 'warn' | 'warning' | 'error' | 'success' | 'tip' | 'note' | 'danger'
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: ''
})

// 映射类型到显示名称和图标
const config = computed(() => {
  const typeMap: Record<string, { title: string; icon: string }> = {
    info: { title: '信息', icon: 'ℹ️' },
    warn: { title: '警告', icon: '⚠️' },
    warning: { title: '警告', icon: '⚠️' },
    error: { title: '错误', icon: '❌' },
    success: { title: '成功', icon: '✅' },
    tip: { title: '技巧', icon: '💡' },
    note: { title: '注释', icon: '📝' },
    danger: { title: '危险', icon: '🚫' }
  }
  
  return typeMap[props.type] || typeMap.info
})

// 计算样式类名
const typeClass = computed(() => {
  const classMap: Record<string, string> = {
    info: 'callout-info',
    warn: 'callout-warn',
    warning: 'callout-warn',
    error: 'callout-error',
    success: 'callout-success',
    tip: 'callout-success',
    note: 'callout-note',
    danger: 'callout-danger'
  }
  return classMap[props.type] || 'callout-info'
})

const displayTitle = computed(() => {
  return props.title || config.value.title
})
</script>

<template>
  <div class="callout" :class="typeClass">
    <div v-if="displayTitle" class="callout-title">
      <span class="callout-icon">{{ config.icon }}</span>
      <span class="callout-title-text">{{ displayTitle }}</span>
    </div>
    <div class="callout-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.callout {
  margin: 1.5rem 0;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  border-left: 4px solid;
  background-color: var(--callout-bg);
  border-color: var(--callout-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.callout:hover {
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.callout-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--callout-title);
  font-size: 0.95rem;
}

.callout-icon {
  font-size: 1.1rem;
}

.callout-content {
  color: var(--callout-content);
  line-height: 1.7;
}

.callout-content :deep(p) {
  margin: 0.5rem 0;
}

.callout-content :deep(code) {
  background-color: rgba(125, 125, 125, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}

.callout-content :deep(pre) {
  background-color: rgba(0, 0, 0, 0.05);
  margin: 0.75rem 0;
}

/* Info - 蓝色 */
.callout-info {
  --callout-bg: oklch(97% 0.02 250);
  --callout-border: oklch(65% 0.15 250);
  --callout-title: oklch(45% 0.15 250);
  --callout-content: oklch(35% 0.1 250);
}

.dark .callout-info {
  --callout-bg: oklch(20% 0.05 250);
  --callout-border: oklch(55% 0.15 250);
  --callout-title: oklch(70% 0.1 250);
  --callout-content: oklch(80% 0.08 250);
}

/* Warn/Warning - 橙色 */
.callout-warn,
.callout-warning {
  --callout-bg: oklch(97% 0.03 75);
  --callout-border: oklch(70% 0.18 75);
  --callout-title: oklch(50% 0.18 75);
  --callout-content: oklch(40% 0.12 75);
}

.dark .callout-warn,
.dark .callout-warning {
  --callout-bg: oklch(22% 0.06 75);
  --callout-border: oklch(60% 0.18 75);
  --callout-title: oklch(75% 0.12 75);
  --callout-content: oklch(82% 0.1 75);
}

/* Error - 红色 */
.callout-error {
  --callout-bg: oklch(97% 0.02 25);
  --callout-border: oklch(65% 0.18 25);
  --callout-title: oklch(45% 0.18 25);
  --callout-content: oklch(35% 0.12 25);
}

.dark .callout-error {
  --callout-bg: oklch(20% 0.05 25);
  --callout-border: oklch(55% 0.18 25);
  --callout-title: oklch(70% 0.12 25);
  --callout-content: oklch(80% 0.1 25);
}

/* Success/Tip - 绿色 */
.callout-success,
.callout-tip {
  --callout-bg: oklch(97% 0.02 150);
  --callout-border: oklch(65% 0.15 150);
  --callout-title: oklch(45% 0.15 150);
  --callout-content: oklch(35% 0.1 150);
}

.dark .callout-success,
.dark .callout-tip {
  --callout-bg: oklch(20% 0.05 150);
  --callout-border: oklch(55% 0.15 150);
  --callout-title: oklch(70% 0.1 150);
  --callout-content: oklch(80% 0.08 150);
}

/* Note - 灰色 */
.callout-note {
  --callout-bg: oklch(97% 0.01 250);
  --callout-border: oklch(60% 0.08 250);
  --callout-title: oklch(45% 0.08 250);
  --callout-content: oklch(40% 0.06 250);
}

.dark .callout-note {
  --callout-bg: oklch(18% 0.03 250);
  --callout-border: oklch(50% 0.08 250);
  --callout-title: oklch(70% 0.06 250);
  --callout-content: oklch(80% 0.05 250);
}

/* Danger - 深红色 */
.callout-danger {
  --callout-bg: oklch(96% 0.03 355);
  --callout-border: oklch(55% 0.2 355);
  --callout-title: oklch(40% 0.2 355);
  --callout-content: oklch(30% 0.15 355);
}

.dark .callout-danger {
  --callout-bg: oklch(18% 0.06 355);
  --callout-border: oklch(50% 0.2 355);
  --callout-title: oklch(70% 0.15 355);
  --callout-content: oklch(78% 0.12 355);
}
</style>
