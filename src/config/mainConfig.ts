// 这是一篇最基本的网站配置，

export const PersonalConfig = {
  name: "CILXRY", // 你的名字。
  description: "许愿 如所愿 皆所愿",
};

export const SiteConfig = {
  author: PersonalConfig.name, // 影响的是底部 Copyright 和 Header 的信息，看不惯可以换
  uptime: "2026/03/29",
  title: "CILXRY 的纪事小栈",
  connectSymbol: " - ",
  websiteTitleStyle: "bct", // 怎么样都想不到这是“Base Connect Title”
  defaultDescription: "CILXRY 的纪事小栈",
  avatarLink: "https://avatar.cilxry.cc",
  viewportRecmmend: false,
  FilingInfo: {
    filingStatus: false,
    icpFiling: "京ICP备 12345678 号",
    psbUrl: "http://www.beian.gov.cn",
    psbFiling: "京公网安备 11010802030000 号",
  },
  umamiTrackingSrc: "https://umami.cilxry.cc/ciumami.js",
  websiteID: "164c37f9-5a70-428b-9f5d-81f680dae480"
};
