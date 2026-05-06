import { PersonalConfig } from "../mainConfig.ts";
import type { SiteConfig } from "@/types/config.types.ts";

export const siteConfig: SiteConfig = {
  lang: "zh_CN",

  // author: Footer Copyright, Header 和 默认的文章作者
  // 默认值: PersonalConfig.name // 同 PersonalConfig 定义的 name
  author: PersonalConfig.name,

  // uptime: 网站上线的时间
  uptime: new Date("2026/01/01"),

  // title: 网站名
  // 默认值: `${PersonalConfig.name} 的纪事小栈`
  title: `${PersonalConfig.name} 的纪事小栈`,

  // connectSymbol: 标题内容连接符
  // 默认值: " - "
  connectSymbol: " - ",

  // websiteTitleStyle: 网站标题的表现形式，在非首页的网站标题表现形式
  // 可选值：
  // "pathConnectTitle": 默认值，把路径和网站名用标题内容连接符连起来，类如："友链 - CILXRY 的纪事小栈"
  websiteTitleStyle: "pathConnectTitle",

  // defaultDescription: 默认的网站描述，在未指定description会用到的值
  // 默认值: `${PersonalConfig.name} 的纪事小栈的页面`
  defaultDescription: `${PersonalConfig.name} 的纪事小栈的页面`,

  // avatarLink: 头像链接
  // 默认值：new URL("//public/favicon.ico")
  avatarLink: new URL("//public/favicon.ico"),

  // viewportRecommend: 推荐视口设置/不违反 WCAG 的建议设置
  // true: 不会违反 WCAG 建议，设置用户可缩放，最大倍数为 3.0，但可能导致误放大行为
  // false: 违反 WCAG 建议，设置用户禁止缩放，最大倍数为 1.0，但尽可能不会导致误放大行为
  viewportRecommend: false,

  // filingInfo: 备案信息
  FilingInfo: {
    filingStatus: false,
    icpFiling: "京ICP备 12345678 号",
    psbUrl: new URL("http://www.beian.gov.cn"),
    psbFiling: "京公网安备 11010802030000 号",
  },

  umamiTrackingSrc: new URL("https://umami.cilxry.cc/ciumami.js"),
  websiteID: "164c37f9-5a70-428b-9f5d-81f680dae480",
  siteUrl: undefined
};

