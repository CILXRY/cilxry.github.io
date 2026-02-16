<!-- src/components/MyVue.vue -->
<template>
  <Transition name="fade">
    <div v-if="show">这是动态内容</div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';
const show = ref(true);
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>