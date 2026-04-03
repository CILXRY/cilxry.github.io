<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {
  Moon,
  Sun,
  SunMoon,
  Palette,
  MessageSquare,
  Music,
  Keyboard,
  Languages,
  X,
} from "lucide-vue-next";
import { applyThemeColor } from "@/utils/CustomizationUtils/themeUtils.ts";

// 控制中心状态
const isOpen = ref(false);
const activeButtons = ref<Set<string>>(new Set(["theme", "comment"]));

// 主题相关
const currentTheme = ref<"light" | "dark" | "auto">("auto");
const themeColor = ref(275);

// 切换控制中心
const toggleControlPanel = () => {
  isOpen.value = !isOpen.value;
  // 打开时禁止 body 滚动
  if (!isOpen.value) {
    document.body.style.overflow = '';
  } else {
    document.body.style.overflow = 'hidden';
  }
};

// 关闭控制中心
const closeControlPanel = () => {
  isOpen.value = false;
  document.body.style.overflow = '';
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
  const themes: ("light" | "dark" | "auto")[] = ["auto", "light", "dark"];
  const currentIndex = themes.indexOf(currentTheme.value);
  currentTheme.value = themes[(currentIndex + 1) % themes.length];

  applyTheme(currentTheme.value);
};

// 主题色滑块事件
const handleThemeColorChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const color = parseInt(target.value);
  themeColor.value = color;
  applyThemeColor(color);
};

// 应用主题
const applyTheme = (theme: string) => {
  const html = document.documentElement;
  if (theme === "dark") {
    html.classList.add("dark");
  } else if (theme === "light") {
    html.classList.remove("dark");
  } else {
    // auto
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }
  localStorage.setItem("theme", theme);
};

// 获取主题图标
const getThemeIcon = () => {
  switch (currentTheme.value) {
    case "light":
      return Sun;
    case "dark":
      return Moon;
    default:
      return SunMoon;
  }
};

// 按钮配置
const buttons = [
  // { id: "theme", icon: Palette, label: "主题", color: "orange" },
  // { id: "comment", icon: MessageSquare, label: "评论", color: "orange" },
  // { id: "music", icon: Music, label: "音乐", color: "black" },
  // { id: "keyboard", icon: Keyboard, label: "快捷键", color: "black" },
  // { id: "language", icon: Languages, label: "语言", color: "orange" },
];

// 点击遮罩关闭
const handleBackdropClick = (event: MouseEvent) => {
  if ((event.target as HTMLElement).classList.contains('control-panel-backdrop')) {
    closeControlPanel();
  }
};

// ESC 键关闭
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeControlPanel();
  }
};

onMounted(() => {
  // 初始化主题
  const savedTheme = localStorage.getItem("theme") || "auto";
  currentTheme.value = savedTheme as "light" | "dark" | "auto";
  applyTheme(savedTheme);

  // 监听 ESC 键
  document.addEventListener("keydown", handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscKey);
  document.body.style.overflow = '';
});
</script>

<template>
  <div class="control-panel-container">
    <!-- 控制中心主按钮 -->
    <button
      @click="toggleControlPanel"
      class="w-12 h-12 p-0 border-none bg-transparent hover:bg-cp-50 dark:hover:bg-cp-900 transition-all b-rd-md active:scale-90 flex items-center justify-center"
      aria-label="控制中心"
    >
      <Palette class="w-6 h-6 text-gray-700 dark:text-gray-300" />
    </button>

    <!-- 遮罩层 -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        @click="handleBackdropClick"
        class="control-panel-backdrop fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      >
        <!-- 控制面板内容 -->
        <transition
          enter-active-class="transition-transform duration-300 ease-out"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition-transform duration-300 ease-in"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div
            v-if="isOpen"
            class="absolute right-0 top-0 h-full w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
          >
            <!-- 顶部标题栏 -->
            <div class="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm z-10">
              <h3 class="text-xl font-semibold text-gray-900 dark:text-gray-100">
                控制中心
              </h3>
              <button
                @click="closeControlPanel"
                class="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex items-center justify-center"
                aria-label="关闭"
              >
                <X class="w-6 h-6 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <!-- 内容区域 -->
            <div class="p-6 space-y-6">
              <!-- 主题控制区域 -->
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
                    <span class="text-base font-medium text-gray-700 dark:text-gray-300">主题色</span>
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

              <!-- 功能按钮网格 -->
              <div>
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                  功能开关
                </h4>
                <div class="grid grid-cols-5 gap-4">
                  <button
                    v-for="btn in buttons"
                    :key="btn.id"
                    @click="toggleButton(btn.id)"
                    :class="[
                      'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300',
                      'active:scale-90 hover:scale-105',
                      activeButtons.has(btn.id)
                        ? btn.color === 'orange'
                          ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg'
                          : 'bg-gray-800 dark:bg-gray-700 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500',
                    ]"
                    :title="btn.label"
                  >
                    <component :is="btn.icon" class="w-7 h-7" />
                  </button>
                </div>
                <p class="text-xs text-gray-500 dark:text-gray-500 text-center mt-3">
                  橙色 - 已启用 · 黑色 - 已禁用
                </p>
              </div>

              <!-- 其他设置区域（预留） -->
              <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  其他设置
                </h4>
                <p class="text-sm text-gray-500 dark:text-gray-500">
                  更多功能敬请期待...
                </p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.control-panel-container {
  position: relative;
  z-index: 100;
}

/* 确保弹窗内容可以滚动 */
.control-panel-backdrop > div:last-child {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

.control-panel-backdrop > div:last-child::-webkit-scrollbar {
  width: 6px;
}

.control-panel-backdrop > div:last-child::-webkit-scrollbar-track {
  background: transparent;
}

.control-panel-backdrop > div:last-child::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}

/* 主题色滑块样式 */
.theme-slider {
  -webkit-appearance: none;
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
  cursor: pointer;
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
  transform: scale(1.1);
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
  transform: scale(1.1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

/* 移动端适配 */
@media (max-width: 640px) {
  .control-panel-backdrop > div:last-child {
    max-width: 100%;
  }
}
</style>
