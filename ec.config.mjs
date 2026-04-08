import { defineEcConfig } from "astro-expressive-code";
import { pluginLineNumbers } from "@expressive-code/plugin-line-numbers";
import { pluginLanguageBadge } from "expressive-code-language-badge";

export default defineEcConfig({
  plugins: [pluginLineNumbers(), pluginLanguageBadge()],
  styleOverrides: {
    codeFontFamily: "var(--font-list-coding)",
  },
});
