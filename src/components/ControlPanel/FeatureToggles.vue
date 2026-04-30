<script setup lang="ts">
import { ref } from "vue";
import {
  MessageSquare,
  Music,
  Keyboard,
  Languages,
} from "lucide-vue-next";

const activeButtons = ref<Set<string>>(new Set(["comment"]));

const toggleButton = (buttonId: string) => {
  if (activeButtons.value.has(buttonId)) {
    activeButtons.value.delete(buttonId);
  } else {
    activeButtons.value.add(buttonId);
  }
};

const buttons = [
  // { id: "comment", icon: MessageSquare, label: "评论" },
  // { id: "music", icon: Music, label: "音乐" },
  // { id: "keyboard", icon: Keyboard, label: "快捷键" },
  // { id: "language", icon: Languages, label: "语言" },
];

const isButtonActive = (id: string) => activeButtons.value.has(id);
</script>

<template>
  <div class="rounded-xl border l-border-default dark:d-border-default l-bg-secondary dark:d-bg-secondary p-5">
    <h4 class="text-sm font-medium ci-text-primary m-0 mb-4">功能开关</h4>

    <div class="grid grid-cols-5 gap-3">
      <button
        v-for="btn in buttons"
        :key="btn.id"
        @click="toggleButton(btn.id)"
        :class="[
          'w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90',
          isButtonActive(btn.id)
            ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/20'
            : 'l-bg-primary dark:d-bg-primary text-gray-400 dark:text-gray-500 border l-border-default dark:d-border-default',
        ]"
        :title="btn.label"
      >
        <component :is="btn.icon" class="w-6 h-6" />
      </button>
    </div>

    <p class="text-xs ci-text-tertiary text-center mt-3 mb-0">
      橙色 - 已启用 · 灰色 - 已禁用
    </p>
  </div>

  <div class="pt-4 border-t l-border-default dark:d-border-default">
    <h4 class="text-sm font-medium ci-text-primary m-0 mb-3">其他设置</h4>
    <p class="text-xs ci-text-tertiary m-0">
      更多功能敬请期待...
    </p>
  </div>
</template>
