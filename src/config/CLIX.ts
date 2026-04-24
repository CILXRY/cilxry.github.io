// 这是一份 CLIX 的全局配置文件。
// 其实我原本是想着把这个配置文件放到根目录的 config 里的
// 想了想，纯属是增加复杂度。

// ====
// websiteWideConfig
// ====

export const PersonalConfig = {
  name: "CILXRY",
};

/**
 * 站点全局配置对象
 * 包含网站基本信息、作者信息、备案信息等核心配置
 */
export const SiteConfig = {
  /** 站点完整 URL 地址 */
  siteUrl: "https://cilxry.github.io/",

  /**
   * 作者名称
   * 影响网站底部 Copyright 和 Header 的作者信息显示
   * 引用自 PersonalConfig.name，也可改为 String 类型的名字
   */
  author: PersonalConfig.name,

  /** 站点上线时间，格式：YYYY/MM/DD */
  uptime: "2026/03/29",

  /** 网站主标题 */
  title: "CILXRY 的纪事小栈",

  /** 标题连接符号，用于分隔页面标题和网站标题 */
  connectSymbol: " - ",

  /** 网站标题样式配置 */
  websiteTitleStyle: "bct",

  /** 默认页面描述信息，用于 SEO 和社交分享 */
  defaultDescription: "CILXRY 的纪事小栈",

  /** ICP 备案相关信息配置 */
  FilingInfo: {
    /** 备案状态开关，true 表示启用备案信息显示 */
    filingStatus: true,

    /** ICP 备案号 */
    icpFiling: " 京ICP备 12345678 号",

    /** 公安备案官网 URL */
    psbUrl: "http://www.beian.gov.cn",

    /** 公网安备备案号 */
    psbFiling: "京公网安备 11010802030000 号",
  },
};

export const backendConfig = {
  // 其实 CLIX 在前端下就已经够用了
  // 我相信如果你需要用到后端的话
  // 那你一定对你的服务器做好安全措施了对吧
  // ！注意，打开后端是一个风险性操作！
  // ！尤其是对我这个写的十分不成熟的项目而言！
  ENABLE_BACKEND: false,
  // ！请你确定你要打开后端（二次确认）：
  ENSURE_TO_ENABLE_BACKEND: false,

  // 这是心跳地址，如果部署后端的话，如果你改了后端地址的话
  // 默认是 <服务器地址>:<端口号>/check
  // 返回："the clixback is still alive."
  BackendHeartBeatCheckAddr: "",
};
