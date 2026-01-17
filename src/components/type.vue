<template>
  <p>👋 <span>{{ currentText }}</span></p>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 配置内容
const messages = [
  "Hi There.",
  "I'm CILXRY!",
  "From Shanghai, China",
  "Welcome to my site!"
]

const currentText = ref('')
let currentIndex = 0
let isErasing = false
let timer = null

onMounted(() => {
  startTyping()
})

onUnmounted(() => {
  if (timer) clearTimeout(timer)
})

function startTyping() {
  const text = messages[currentIndex]

  if (isErasing) {
    // 删除模式：逐字减少
    currentText.value = text.slice(0, currentText.value.length - 1)
    if (currentText.value === '') {
      isErasing = false
      currentIndex = (currentIndex + 1) % messages.length
      timer = setTimeout(startTyping, 500) // 切换后稍作停顿
    } else {
      timer = setTimeout(startTyping, 40) // 删除速度
    }
  } else {
    // 打字模式：逐字增加
    currentText.value = text.slice(0, currentText.value.length + 1)
    if (currentText.value === text) {
      isErasing = true
      timer = setTimeout(startTyping, 1800) // 打完后停顿
    } else {
      timer = setTimeout(startTyping, 90) // 打字速度
    }
  }
}
</script>