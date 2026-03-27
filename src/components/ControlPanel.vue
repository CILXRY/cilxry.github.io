<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Moon, Sun, SunMoon, Palette, MessageSquare, Music, Keyboard, Languages } from 'lucide-vue-next';

// 控制中心状态
const isOpen = ref(true);
const activeButtons = ref<Set<string>>(new Set(['theme', 'comment']));

// 主题相关
const currentTheme = ref<'light' | 'dark' | 'auto'>('auto');
const themeColor = ref(275);

// 切换控制中心
const toggleControlPanel = () => {
  isOpen.value = !isOpen.value;
};

// 关闭控制中心
const closeControlPanel = () => {
  isOpen.value = false;
};

// 切换按钮状态
const toggleButton = (buttonId: string) => {
  if (activeButtons.value.has(buttonId)) {
    activeButtons.value.delete(buttonId);
  } else {
    activeButtons.value.add(buttonId);
  }
};

// 主题切换逻辑
const cycleTheme = () => {
  const themes: ('light' | 'dark' | 'auto')[] = ['auto', 'light', 'dark'];
  const currentIndex = themes.indexOf(currentTheme.value);
  currentTheme.value = themes[(currentIndex + 1) % themes.length];

  applyTheme(currentTheme.value);
};

// 应用主题
const applyTheme = (theme: string) => {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else if (theme === 'light') {
    html.classList.remove('dark');
  } else {
    // auto
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }
  localStorage.setItem('theme', theme);
};

// 获取主题图标
const getThemeIcon = () => {
  switch (currentTheme.value) {
    case 'light':
      return Sun;
    case 'dark':
      return Moon;
    default:
      return SunMoon;
  }
};

// 按钮配置
const buttons = [
  { id: 'theme', icon: Palette, label: '主题', color: 'orange' },
  { id: 'comment', icon: MessageSquare, label: '评论', color: 'orange' },
  { id: 'music', icon: Music, label: '音乐', color: 'black' },
  { id: 'keyboard', icon: Keyboard, label: '快捷键', color: 'black' },
  { id: 'language', icon: Languages, label: '语言', color: 'orange' },
];

// 点击外部关闭
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.control-panel-container')) {
    closeControlPanel();
  }
};

onMounted(() => {
  // 初始化主题
  const savedTheme = localStorage.getItem('theme') || 'auto';
  currentTheme.value = savedTheme as 'light' | 'dark' | 'auto';
  applyTheme(savedTheme);

  // 监听点击外部关闭
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <div class="control-panel-container relative">
    <!-- 控制中心主按钮 -->
    <button
      @click="toggleControlPanel"
      class="w-14 h-14 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700
             text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center
             active:scale-95 z-50 relative"
      aria-label="控制中心"
    >
      <Palette class="w-7 h-7" />
    </button>

    <!-- 控制面板弹窗 -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="transform scale-95 opacity-0 translate-y-2"
      enter-to-class="transform scale-100 opacity-100 translate-y-0"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="transform scale-100 opacity-100 translate-y-0"
      leave-to-class="transform scale-95 opacity-0 translate-y-2"
    >
      <div
        v-if="isOpen"
        class="relative bottom-20 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm
               rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50
               p-6 min-w-80 z-40"
      >
        <!-- 标题 -->
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">控制中心</h3>
          <button
            @click="closeControlPanel"
            class="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800
                   transition-colors flex items-center justify-center"
          >
            <span class="text-gray-500 dark:text-gray-400 text-xl">×</span>
          </button>
        </div>

        <!-- 主题控制区域 -->
        <div class="mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <div class="flex items-center gap-3 mb-3">
            <component :is="getThemeIcon()" class="w-5 h-5 text-orange-500" />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">主题模式</span>
            <span class="text-xs text-gray-500 dark:text-gray-500 ml-auto">
              {{ currentTheme === 'auto' ? '自动' : currentTheme === 'light' ? '浅色' : '深色' }}
            </span>
          </div>
          <button
            @click="cycleTheme"
            class="w-full py-2 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600
                   rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600
                   transition-colors"
          >
            点击切换主题
          </button>
        </div>

        <!-- 功能按钮网格 -->
        <div class="grid grid-cols-5 gap-3">
          <button
            v-for="btn in buttons"
            :key="btn.id"
            @click="toggleButton(btn.id)"
            :class="[
              'w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300',
              'active:scale-90 hover:scale-105',
              activeButtons.has(btn.id)
                ? btn.color === 'orange'
                  ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg'
                  : 'bg-gray-800 dark:bg-gray-700 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
            ]"
            :title="btn.label"
          >
            <component :is="btn.icon" class="w-6 h-6" />
          </button>
        </div>

        <!-- 底部说明 -->
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 dark:text-gray-500 text-center">
            橙色 - 已启用 · 黑色 - 已禁用
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.control-panel-container {
  position: relative;
}

/* 确保弹窗在移动端也能正常显示 */
@media (max-width: 640px) {
  .control-panel-container > div:last-child {
    right: -1rem;
    min-width: 300px;
  }
}
</style>
