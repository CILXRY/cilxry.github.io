import { ref, nextTick, onMounted, onUnmounted } from "vue";

export function useControlPanel() {
  const isOpen = ref(false);
  const panelVisible = ref(false);

  const open = () => {
    isOpen.value = true;
    document.body.style.overflow = "hidden";
    nextTick(() => {
      panelVisible.value = true;
    });
  };

  const close = () => {
    panelVisible.value = false;
    setTimeout(() => {
      isOpen.value = false;
      document.body.style.overflow = "";
    }, 250);
  };

  const toggle = () => {
    if (isOpen.value) {
      close();
    } else {
      open();
    }
  };

  const handleEscKey = (event: KeyboardEvent) => {
    if (event.key === "Escape" && isOpen.value) {
      close();
    }
  };

  onMounted(() => {
    document.addEventListener("keydown", handleEscKey);
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", handleEscKey);
    document.body.style.overflow = "";
  });

  return {
    isOpen,
    panelVisible,
    toggle,
    close,
  };
}
