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

export function applyThemeColor(oklch: number) {
  const color = oklchToHex(oklch);
  // console.log(color)

  document.documentElement.style.setProperty("--primary", color);
  document.documentElement.style.setProperty("--primary-h", oklch.toString());
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
    const save = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (save && THEMES.includes(save)) {
      currentTheme.value = save;
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
