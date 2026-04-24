<template>
  <div class="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
    <div class="flex items-center gap-3 mb-4">
      <component :is="getThemeIcon()" class="w-6 h-6 text-orange-500" />
      <span class="text-base font-medium text-gray-700 dark:text-gray-300"
        >主题模式</span
      >
      <span class="text-sm text-gray-500 dark:text-gray-500 ml-auto">
        {{
          currentTheme === "auto"
            ? "自动"
            : currentTheme === "light"
              ? "浅色"
              : "深色"
        }}
      </span>
    </div>
    <button
      @click="cycleTheme"
      class="w-full py-3 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium mb-4"
    >
      点击切换主题
    </button>

    <!-- 主题色滑块 -->
    <div class="mt-6">
      <div class="flex items-center gap-3 mb-4">
        <Palette class="w-6 h-6 text-orange-500" />
        <span class="text-base font-medium text-gray-700 dark:text-gray-300"
          >主题色</span
        >
        <span class="text-sm text-gray-500 dark:text-gray-500 ml-auto">Color</span>
      </div>
      <input
        type="range"
        name="theme"
        id="theme-slider"
        min="0"
        max="360"
        step="2"
        v-model="themeColor"
        @input="handleThemeColorChange"
        class="theme-slider w-full h-5 b-rd-1 mt-2"
      />
    </div>
  </div>
</template>

<script setup>
import { useTheme } from "@ut/CustomizationUtils/themeUtils.ts";
const { currentTheme, toggleTheme } = useTheme();
</script>
