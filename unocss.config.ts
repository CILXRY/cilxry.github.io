import { defineConfig, presetUno } from "unocss";
import { presetAttributify } from "@unocss/preset-attributify";

export default defineConfig({
  presets: [
    presetUno(), // 保留默认UnoCSS预设
    presetAttributify(), // 启用属性化模式
  ],
  theme: {
    fontFamily: {
      typicalFont: '"AiDianFengYaHei", sans-serif',
    },
  },
  shortcuts: {
    link: "text-inherit hover:bg-[--cp-300] hover:text-[--cp-800] transition-all decoration-[--cp-300]",
  },
});
