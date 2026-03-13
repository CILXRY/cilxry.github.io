<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

// SWUP 实例引用
let swupInstance: any = null

// 初始化 SWUP
onMounted(() => {
  // 动态导入 SWUP（避免 SSR 问题）
  import('swup').then((module) => {
    const Swup = module.default
    
    if (!Swup) {
      console.error('❌ SWUP 默认导出不存在')
      return
    }
    
    swupInstance = new Swup({
      containers: ['#swup-transitions'],
      cache: true,
      preload: true,
      animateHistoryBrowsing: true,
    })
    
    console.log('✅ SWUP 已初始化', swupInstance)
    
    // SWUP v4 使用 hooks.on() 而不是 on()
    if (swupInstance.hooks && typeof swupInstance.hooks.on === 'function') {
      console.log('📋 使用 hooks API')
      
      swupInstance.hooks.on('transition:start', () => {
        console.log('🚀 页面过渡开始')
      })
      
      swupInstance.hooks.on('transition:end', () => {
        console.log('✅ 页面过渡结束')
      })
      
      swupInstance.hooks.on('page:load', () => {
        console.log('📄 页面已加载')
      })
    } else if (typeof swupInstance.on === 'function') {
      console.log('📋 使用传统 on API')
      
      swupInstance.on('transitionStart', () => {
        console.log('🚀 页面过渡开始')
      })
      
      swupInstance.on('transitionEnd', () => {
        console.log('✅ 页面过渡结束')
      })
      
      swupInstance.on('pageLoaded', () => {
        console.log('📄 页面已加载')
      })
    } else {
      console.warn('⚠️ SWUP 不支持事件监听')
    }
  }).catch(err => {
    console.error('❌ SWUP 加载失败:', err)
  })
})

// 销毁 SWUP 实例
onUnmounted(() => {
  if (swupInstance) {
    swupInstance.destroy()
    console.log('🗑️ SWUP 已销毁')
  }
})
</script>

<template>
  <!-- 这是一个功能组件，不需要渲染任何内容 -->
  <div class="swup-transition-wrapper" style="display: none;"></div>
</template>

<style scoped>
/* 隐藏包装器 */
.swup-transition-wrapper {
  display: none;
}
</style>
