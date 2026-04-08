// Intro: https://docs.astro.build/zh-cn/reference/configuration-reference

import swup from "@swup/astro";
import vue from "@astrojs/vue";
import svelte from "@astrojs/svelte";
import UnoCSS from "unocss/astro";
import { defineConfig } from "astro/config";
import { SiteConfig } from "./src/config/CLIX.ts";

// Markdown Plugins
// Intro: https://docs.astro.build/zh-cn/guides/markdown-content/#markdown-%E6%8F%92%E4%BB%B6
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import expressiveCode from "astro-expressive-code";
import remarkCallout from "./src/plugins/remark-callout.ts";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default defineConfig({
  site: SiteConfig.siteUrl,
  base: "/",
  trailingSlash: "ignore",
  integrations: [
    UnoCSS(),
    vue(),
    svelte(),
    swup({
      theme: false,
      animationClass: 'transition-',
      cache: true,
      smoothScrolling: true,
      debug: true,
    }),
    expressiveCode(),
  ],
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
