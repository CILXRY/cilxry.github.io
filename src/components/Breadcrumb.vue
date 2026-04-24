<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { House } from "lucide-vue-next";
import { ChevronRight } from "lucide-vue-next";
import { navLogo } from "@/config/NavBar-Items.ts";

const currentPath = ref("");
const isHomePage = ref(true);
const pathSegments = ref<string[]>([]);

const updatePath = () => {
  if (typeof window !== "undefined") {
    currentPath.value = window.location.pathname;
    isHomePage.value = currentPath.value === "/" || currentPath.value === "";
    pathSegments.value = currentPath.value.split("/").filter(Boolean);
  }
};

onMounted(async () => {
  await nextTick();
  updatePath();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === "attributes" && mutation.attributeName === "data-swup") {
        updatePath();
      }
    }
  });

  observer.observe(document.documentElement, {
    attributes: true,
  });

  document.addEventListener("swup:contentReplaced", updatePath);
  window.addEventListener("popstate", updatePath);

  (window as any).breadcrumbObserver = observer;
});

onUnmounted(() => {
  if (typeof window !== "undefined") {
    document.removeEventListener("swup:contentReplaced", updatePath);
    window.removeEventListener("popstate", updatePath);
    const observer = (window as any).breadcrumbObserver;
    if (observer) {
      observer.disconnect();
    }
  }
});
</script>

<template>
  <template v-if="isHomePage">
    <a
      class="text-2xl font-bold tracking-tight font-mono no-underline transition-all duration-200 hover:l-bg-secondary l-text-muted hover:l-text-muted transition-all transition-duration-400 b-rd-xl px-4 py-2"
      :href="navLogo.path"
    >
      {{ navLogo.key }}
    </a>
  </template>
  <template v-else>
    <div flex items-center gap-1 class="px-4 py-2">
      <a href="/" class="flex items-center gap-1 l-text-muted hover:l-text-default transition-all duration-200">
        <House :size="18" />
        <span hidden sm:inline>Home</span>
      </a>
      <template v-for="(segment, index) in pathSegments" :key="index">
        <div flex items-center gap-1>
          <ChevronRight :size="16" class="l-text-muted" />
          <a
            :href="`/${pathSegments.slice(0, index + 1).join('/')}`"
            class="capitalize l-text-muted hover:l-text-default transition-all duration-200"
          >
            {{ segment }}
          </a>
        </div>
      </template>
    </div>
  </template>
</template>
