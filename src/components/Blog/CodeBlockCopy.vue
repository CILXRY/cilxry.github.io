<script setup lang="ts">
/**
 * 代码块复制按钮功能
 * 为所有带有 .copy 类的按钮添加点击事件
 */

import { onMounted } from 'vue';

const setupCopyButtons = () => {
  // 查找所有复制按钮
  const copyButtons = document.querySelectorAll('.copy');
  
  copyButtons.forEach(button => {
    // 移除重复的事件监听器
    button.removeEventListener('click', handleCopy);
    // 添加点击事件
    button.addEventListener('click', handleCopy);
  });
};

const handleCopy = async (event: Event) => {
  const button = event.target as HTMLElement;
  const codeElement = button.closest('.language-')?.querySelector('code');
  
  if (!codeElement) return;
  
  const codeText = codeElement.textContent || '';
  
  try {
    // 使用 Clipboard API 复制
    await navigator.clipboard.writeText(codeText);
    
    // 添加已复制状态
    button.classList.add('copied');
    
    // 2 秒后移除已复制状态
    setTimeout(() => {
      button.classList.remove('copied');
    }, 2000);
  } catch (err) {
    console.error('复制失败:', err);
    
    // 降级方案：使用传统方法复制
    const textArea = document.createElement('textarea');
    textArea.value = codeText;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      button.classList.add('copied');
      setTimeout(() => {
        button.classList.remove('copied');
      }, 2000);
    } catch (fallbackErr) {
      console.error('降级复制也失败了:', fallbackErr);
    }
    
    document.body.removeChild(textArea);
  }
};

// 组件挂载时初始化
onMounted(() => {
  setupCopyButtons();
  
  // 监听页面切换事件（用于 SPA 路由）
  document.addEventListener('swup:pageView', setupCopyButtons);
});
</script>

<template>
  <!-- 这是一个功能性组件，不需要渲染任何内容 -->
  <div style="display: none;"></div>
</template>
