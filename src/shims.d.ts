// 为 Typescript 添加类型检查，避免“类型……上不存在属性 ts(2322)”的问题
// Reference: https://unocss.nodejs.cn/presets/attributify#typescript-support-jsxtsx

import type { AttributifyAttributes } from "@unocss/preset-attributify";

declare global {
  namespace astroHTML.JSX {
    interface HTMLAttributes extends AttributifyAttributes {}
  }
}
