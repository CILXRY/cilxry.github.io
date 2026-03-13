// Intro: https://docs.astro.build/zh-cn/reference/configuration-reference
import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import vue from "@astrojs/vue";
import swup from "@swup/astro";
import remarkCallout from "./src/plugins/remark-callout.ts";

export default defineConfig({
  site: "https://cilxry.github.io/",
  base: "/",
  trailingSlash: "ignore",
  integrations: [
    UnoCSS(), 
    vue(), 
    swup(),
  ],
  markdown: {
    remarkPlugins: [remarkCallout],
    shikiConfig: {
      themes: {
        light: "one-light",
        dark: "one-dark-pro",
      },
    },
  },
  devToolbar: {
    enabled: false,
    placement: "bottom-right",
  },
});
