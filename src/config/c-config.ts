
// export const ENABLE_TRANSLATION = true; // 控制是否启用国际化，具体瞅瞅 `src/i18n` 这个文件夹

export const DEFAULT_PAGE = "blog"; // blog | about

/**
 * 首页配置
 * - showBlogCards: 是否在首页显示博客相关卡片
 * - showMusicCard: 是否显示音乐卡片（待实现）
 * - showStatsCard: 是否显示统计卡片（待实现）
 */
export const HOMEPAGE_CONFIG = {
  showBlogCards: true,
  showMusicCard: false,
  showStatsCard: false,
};

export const PersonalConfig = {
  name: "CILXRY",

};

export const SiteConfig = {
  author: PersonalConfig.name, // 影响的是底部 Copyright 和 Header 的信息，看不惯可以换
  uptime: "2026/03/29",
  title: "CILXRY 的纪事小栈",
  connectSymbol: " - ",
  websiteTitleStyle: "bct",
  defaultDescription: "CILXRY 的纪事小栈",
  FilingInfo: {
    filingStatus: true,
    icpFiling: "京ICP备 12345678 号",
    psbUrl: "http://www.beian.gov.cn",
    psbFiling: "京公网安备 11010802030000 号",
  },
};
