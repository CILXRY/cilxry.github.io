import { defineConfig } from "astro/config";
import UnoCSS from "unocss/astro";
import vue from "@astrojs/vue";

export default defineConfig({
  site: "https://cilxry.github.io/",
  base: "/",
  integrations: [UnoCSS(), vue()],
});
