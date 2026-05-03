<script setup lang="ts">
import { useControlPanel } from "./ControlPanel/useControlPanel.ts";
import ControlPanelButton from "./ControlPanel/ControlPanelButton.vue";
import ControlPanelPanel from "./ControlPanel/ControlPanelPanel.vue";
import ThemeSection from "./ControlPanel/ThemeSection.vue";
import FeatureToggles from "./ControlPanel/FeatureToggles.vue";

const { isOpen, panelVisible, toggle, close } = useControlPanel();
</script>

<template>
  <div class="relative z-100">
    <ControlPanelButton :onClick="toggle" />

    <Transition
      enter-active-class="transition-opacity duration-250"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-250"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ControlPanelPanel
        v-if="isOpen"
        :panelVisible="panelVisible"
        :onClose="close"
      >
        <ThemeSection />
        <FeatureToggles />
      </ControlPanelPanel>
    </Transition>
  </div>
</template>
