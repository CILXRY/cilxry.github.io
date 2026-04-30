import { oklchToHex } from "./convertColorTypeUtil.ts";
import { ref, watch, onMounted } from "vue";

const THEMES = ["light", "dark", "auto"] as const;
type Theme = (typeof THEMES)[number];

const STORAGE_KEY = "user-theme";

export function getContrastYIQ(rgbHex: string): boolean {
  rgbHex = rgbHex.replace("#", "");
  const r = parseInt(rgbHex.substring(0, 2), 16);
  const g = parseInt(rgbHex.substring(2, 4), 16);
  const b = parseInt(rgbHex.substring(4, 6), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128;
}

// 应用主题色
export function applyThemeColor(oklch: number) {
  document.documentElement.style.setProperty("--primary", oklchToHex(oklch));
  document.documentElement.style.setProperty("--primary-h", oklch.toString());
  localStorage.setItem("ThemeColor", oklch.toString());
}

export function useTheme() {
  const currentTheme = ref<Theme>("light");

  const toggleTheme = () => {
    const cur = THEMES.indexOf(currentTheme.value);
    const next = (cur + 1) % THEMES.length;
    currentTheme.value = THEMES[next];
  };

  const applyTheme = (theme: Theme) => {
    document.documentElement.className = `${theme}`;
  };

  onMounted(() => {
    const saveTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;

    if (saveTheme && THEMES.includes(saveTheme)) {
      currentTheme.value = saveTheme;
    }

    applyTheme(currentTheme.value);
  });

  watch(currentTheme, (newTheme) => {
    localStorage.setItem(STORAGE_KEY, newTheme);
    applyTheme(newTheme);
  });

  return {
    currentTheme,
    toggleTheme,
  };
}

export function applyThemeWhileStartup() {
  const saveTheme = localStorage.getItem(STORAGE_KEY) as Theme | null;
  const saveColor = localStorage.getItem("ThemeColor") as string;
  if (saveColor) applyThemeColor(Number(saveColor));
}
