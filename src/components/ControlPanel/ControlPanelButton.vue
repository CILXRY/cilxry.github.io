<script setup lang="ts">
import { Palette } from "lucide-vue-next";

defineProps<{
  onClick: () => void;
}>();
</script>

<template>
  <button
    @click="onClick"
    class="w-11 h-11 p-0 border-none bg-transparent hover:bg-[--cp-50] dark:hover:bg-[--cp-800] transition-all b-rd-lg active:scale-90 flex items-center justify-center"
    aria-label="控制中心"
    text-colord hover:text-secondary
  >
    <Palette class="w-5.5 h-5.5" />
  </button>
</template>
