import type { Rule } from "unocss";
export const unSRule: Rule[] = [
  // ========================================
  // 主色配置
  // ========================================
  // 主色相 (Hue): 0.1 (紫色调)
  // 浅色模式主色亮度 (Lightness): 0.8
  // 深色模式主色亮度 (Lightness): 0.6
  // 主色彩度 (Chroma): 0.11

  // ========================================
  // 文字颜色
  // ========================================
  [
    /^ci-text-(primary|secondary|tertiary|muted|colord)$/,
    ([, type]) => {
      const priority = {
        primary: "text-primary",
        secondary: "text-secondary",
        tertiary: "text-tertiary",
        colord:"text-colord"
      }[type];
      return {
        color: `var(--${priority})`,
      };
    },
  ],


  // ========================================
  // 浅色主题 - 背景颜色
  // ========================================
  [
    /^l-bg-(primary|secondary|tertiary|elevated)$/,
    ([, type]) => {
      const colors = {
        primary: "oklch(0.98 0.02 var(--primary-h))",
        secondary: "oklch(0.95 0.03 var(--primary-h))",
        tertiary: "oklch(0.92 0.04 var(--primary-h))",
        elevated: "oklch(1 0 0)",
      }[type];
      return { "background-color": colors };
    },
  ],

  // ========================================
  // 浅色主题 - 主色按钮/交互元素
  // ========================================
  [
    /^l-primary-(default|hover|active|light|dark)$/,
    ([, type]) => {
      const calculations = {
        default: "var(--primary-l-light)",
        hover: "calc(var(--primary-l-light) - 0.05)",
        active: "calc(var(--primary-l-light) - 0.1)",
        light: "calc(var(--primary-l-light) + 0.15)",
        dark: "calc(var(--primary-l-light) - 0.15)",
      }[type];
      return {
        "background-color": `oklch(${calculations} var(--primary-c) var(--primary-h))`,
        color: type === "default" ? "#fff" : "inherit",
      };
    },
  ],

  // ========================================
  // 浅色主题 - 边框颜色
  // ========================================
  [
    /^l-border-(default|hover|focus)$/,
    ([, type]) => {
      const colors = {
        default: "oklch(0.85 0.03 var(--primary-h))",
        hover: "oklch(0.75 0.05 var(--primary-h))",
        focus: "oklch(var(--primary-l-light) var(--primary-c) var(--primary-h))",
      }[type];
      return { "border-color": colors };
    },
  ],

  // ========================================
  // 浅色主题 - 阴影颜色
  // ========================================
  [
    /^l-shadow-(sm|md|lg)$/,
    ([, size]) => {
      const shadows = {
        sm: "oklch(0.9 0.02 var(--primary-h) / 0.1)",
        md: "oklch(0.9 0.02 var(--primary-h) / 0.15)",
        lg: "oklch(0.9 0.02 var(--primary-h) / 0.2)",
      }[size];
      return { "box-shadow": `0 4px 6px -1px ${shadows}` };
    },
  ],

  // ========================================
  // 浅色主题 - 链接颜色
  // ========================================
  [
    /^l-link-(default|hover|visited)$/,
    ([, type]) => {
      const calculations = {
        default: "var(--primary-l-light)",
        hover: "calc(var(--primary-l-light) - 0.08)",
        visited: "calc(var(--primary-l-light) - 0.12)",
      }[type];
      return {
        color: `oklch(${calculations} var(--primary-c) var(--primary-h))`,
      };
    },
  ],

  // ========================================
  // 浅色主题 - 状态颜色
  // ========================================
  ["light-success", { color: "oklch(0.7 0.12 150)" }],
  ["light-warning", { color: "oklch(0.75 0.15 75)" }],
  ["light-error", { color: "oklch(0.65 0.18 25)" }],
  ["light-info", { color: "oklch(0.7 0.1 240)" }],

  // ========================================
  // 深色主题 - 文字颜色
  // ========================================
  [
    /^d-text-(primary|secondary|tertiary|muted)$/,
    ([, type]) => {
      const lightness = {
        primary: "0.95",
        secondary: "0.85",
        tertiary: "0.7",
        muted: "0.6",
      }[type];
      return {
        color: `oklch(${lightness} 0.0${type === "primary" ? "2" : type === "secondary" ? "3" : "4"} var(--primary-h))`,
      };
    },
  ],

  // ========================================
  // 深色主题 - 标题颜色
  // ========================================
  [
    /^d-heading-(h[1-4])$/,
    ([, level]) => {
      const configs = {
        h1: ["0.98", "0.02"],
        h2: ["0.95", "0.02"],
        h3: ["0.92", "0.03"],
        h4: ["0.9", "0.03"],
      }[level];
      return { color: `oklch(${configs[0]} ${configs[1]} var(--primary-h))` };
    },
  ],

  // ========================================
  // 深色主题 - 背景颜色
  // ========================================
  [
    /^d-bg-(primary|secondary|tertiary|elevated)$/,
    ([, type]) => {
      const colors = {
        primary: "oklch(0.15 0.03 var(--primary-h))",
        secondary: "oklch(0.18 0.04 var(--primary-h))",
        tertiary: "oklch(0.22 0.05 var(--primary-h))",
        elevated: "oklch(0.25 0.05 var(--primary-h))",
      }[type];
      return { "background-color": colors };
    },
  ],

  // ========================================
  // 深色主题 - 主色按钮/交互元素
  // ========================================
  [
    /^d-primary-(default|hover|active|light|dark)$/,
    ([, type]) => {
      const calculations = {
        default: "var(--primary-l-dark)",
        hover: "calc(var(--primary-l-dark) + 0.08)",
        active: "calc(var(--primary-l-dark) + 0.12)",
        light: "calc(var(--primary-l-dark) - 0.15)",
        dark: "calc(var(--primary-l-dark) + 0.15)",
      }[type];
      return {
        "background-color": `oklch(${calculations} var(--primary-c) var(--primary-h))`,
        color: type === "default" ? "#fff" : "inherit",
      };
    },
  ],

  // ========================================
  // 深色主题 - 边框颜色
  // ========================================
  [
    /^d-border-(default|hover|focus)$/,
    ([, type]) => {
      const colors = {
        default: "oklch(0.3 0.05 var(--primary-h))",
        hover: "oklch(0.4 0.06 var(--primary-h))",
        focus: "oklch(var(--primary-l-dark) var(--primary-c) var(--primary-h))",
      }[type];
      return { "border-color": colors };
    },
  ],

  // ========================================
  // 深色主题 - 阴影颜色
  // ========================================
  [
    /^d-shadow-(sm|md|lg)$/,
    ([, size]) => {
      const shadows = {
        sm: "oklch(0.1 0.03 var(--primary-h) / 0.3)",
        md: "oklch(0.1 0.03 var(--primary-h) / 0.4)",
        lg: "oklch(0.1 0.03 var(--primary-h) / 0.5)",
      }[size];
      return { "box-shadow": `0 4px 6px -1px ${shadows}` };
    },
  ],

  // ========================================
  // 深色主题 - 链接颜色
  // ========================================
  [
    /^d-link-(default|hover|visited)$/,
    ([, type]) => {
      const calculations = {
        default: "calc(var(--primary-l-dark) + 0.15)",
        hover: "calc(var(--primary-l-dark) + 0.2)",
        visited: "calc(var(--primary-l-dark) + 0.1)",
      }[type];
      return {
        color: `oklch(${calculations} var(--primary-c) var(--primary-h))`,
      };
    },
  ],

  // ========================================
  // 深色主题 - 状态颜色
  // ========================================
  ["dark-success", { color: "oklch(0.65 0.12 150)" }],
  ["dark-warning", { color: "oklch(0.7 0.15 75)" }],
  ["dark-error", { color: "oklch(0.6 0.18 25)" }],
  ["dark-info", { color: "oklch(0.65 0.1 240)" }],
];
