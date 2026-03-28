// Intro: https://docs.astro.build/zh-cn/reference/configuration-reference

import UnoCSS from "unocss/astro";
import swup from "@swup/astro";
import vue from "@astrojs/vue";
import { defineConfig } from "astro/config";

// Markdown Plugins
// Intro: https://docs.astro.build/zh-cn/guides/markdown-content/#markdown-%E6%8F%92%E4%BB%B6
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import remarkCallout from "./src/plugins/remark-callout.ts";
import expressiveCode from "astro-expressive-code";

export default defineConfig({
  site: "https://cilxry.github.io/",
  base: "/",
  trailingSlash: "ignore",
  integrations: [UnoCSS(), vue(), swup(), expressiveCode()],
  markdown: {
    remarkPlugins: [remarkCallout, remarkBreaks],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        { behavior: "append", properties: { className: ["header-anchor"] } },
      ],
    ],
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
