import { SiteConfig } from "@cfg/c-config.ts";

export function siteTitle(currentTitle: string = "") {
  if (currentTitle == "") {
    return SiteConfig.title;
  } else {
    return `${currentTitle}${SiteConfig.connectSymbol}${SiteConfig.title}`;
  }
}
