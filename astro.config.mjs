// Intro: https://docs.astro.build/zh-cn/reference/configuration-reference

import swup from "@swup/astro";
import vue from "@astrojs/vue";
import UnoCSS from "unocss/astro";
import sitemap from '@astrojs/sitemap';
import { defineConfig } from "astro/config";
import { SiteConfig } from "./src/config/CLIX.ts";

// Markdown Plugins
// Intro: https://docs.astro.build/zh-cn/guides/markdown-content/#markdown-%E6%8F%92%E4%BB%B6
import rehypeSlug from "rehype-slug";
import remarkBreaks from "remark-breaks";
import rehypeCallouts from "rehype-callouts";
import expressiveCode from "astro-expressive-code";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

export default defineConfig({
  site: SiteConfig.siteUrl,
  base: "/",
  trailingSlash: "ignore",
  integrations: [
    UnoCSS(),
    vue(),
    swup({
      theme: false,
      animationClass: "transition-",
      cache: true,
      smoothScrolling: true,
      debug: true,
    }),
    expressiveCode(),
    sitemap(),
  ],
  markdown: {
    remarkPlugins: [remarkBreaks],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        { behavior: "append", properties: { className: ["header-anchor"] } },
      ],
      rehypeCallouts,
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
