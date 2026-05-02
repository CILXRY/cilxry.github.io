<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Moon, Sun, SunMoon, Palette } from "lucide-vue-next";
import {
  useTheme,
  applyThemeColor,
} from "@/utils/CustomizationUtils/themeUtils.ts";

const { currentTheme, toggleTheme } = useTheme();

const themeColor = ref(275);

const themeIcon = computed(() => {
  switch (currentTheme.value) {
    case "light":
      return Sun;
    case "dark":
      return Moon;
    default:
      return SunMoon;
  }
});

const themeLabel = computed(() => {
  switch (currentTheme.value) {
    case "light":
      return "浅色";
    case "dark":
      return "深色";
    default:
      return "自动";
  }
});

const handleThemeColorChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const color = parseInt(target.value);
  themeColor.value = color;
  applyThemeColor(color);
};

onMounted(() => {
  const saved = localStorage.getItem("ThemeColor");
  if (saved) themeColor.value = parseInt(saved);
});
</script>

<template>
  <div class="p-5 rounded-xl border l-border-default dark:d-border-default l-bg-secondary dark:d-bg-secondary">
    <div class="flex items-center gap-3 mb-4">
      <component :is="themeIcon" class="w-5 h-5 flex-shrink-0 text-secondary" />
      <span class="text-sm font-medium text-primary">主题模式</span>
      <span class="text-xs text-tertiary ml-auto px-2 py-0.5 rounded-full l-bg-tertiary dark:d-bg-tertiary">{{ themeLabel }}</span>
    </div>

    <button
      @click="toggleTheme"
      class="w-full py-2.5 px-4 rounded-lg text-sm font-medium text-secondary l-bg-primary dark:d-bg-primary border l-border-default dark:d-border-default hover:l-bg-tertiary dark:hover:d-bg-tertiary transition-colors"
    >
      点击切换主题
    </button>

    <div class="mt-5 pt-5 border-t l-border-default dark:d-border-default">
      <div class="flex items-center gap-3 mb-4">
        <Palette class="w-5 h-5 flex-shrink-0 text-secondary" />
        <span class="text-sm font-medium text-primary">主题色</span>
        <span class="text-xs text-tertiary ml-auto">Color</span>
      </div>
      <input
        type="range"
        min="0"
        max="360"
        step="2"
        :value="themeColor"
        @input="handleThemeColorChange"
        class="w-full h-2 b-rd-1 cursor-pointer theme-slider"
      />
      <div class="flex justify-between mt-1.5">
        <span class="text-xs text-tertiary">0°</span>
        <span class="text-xs text-tertiary">360°</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-slider {
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(
    to right,
    oklch(0.77 0.11 0),
    oklch(0.77 0.11 60),
    oklch(0.77 0.11 120),
    oklch(0.77 0.11 180),
    oklch(0.77 0.11 240),
    oklch(0.77 0.11 300),
    oklch(0.77 0.11 360)
  );
}

.theme-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.theme-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.theme-slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: all 0.2s;
}

.theme-slider::-moz-range-thumb:hover {
  transform: scale(1.15);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}
</style>
