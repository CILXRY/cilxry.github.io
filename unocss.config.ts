import { defineConfig, presetTypography } from "unocss";
import { presetAttributify } from "@unocss/preset-attributify";
import { presetWind3 } from "@unocss/preset-wind3";
import presetTagify from "@unocss/preset-tagify";
import { unSRule } from "./src/styles/unStandard.ts";

export default defineConfig({
  presets: [
    presetWind3(), // 默认 UnoCSS 预设
    presetAttributify() as any, // 属性化模式
    presetTypography(), // 单标签
    presetTagify(), // 标签化预设
  ],
  shortcuts: {
    link: "text-inherit hover:bg-[--cp-300] hover:text-[--cp-800] transition-all decoration-[--cp-300]",
  },
  theme: {
    fontFamily: {
      typicalFont: '"AiDianFengYaHei", sans-serif',
    },
  },
  rules: unSRule,
});
