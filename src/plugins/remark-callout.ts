import type { Plugin } from "unified";
import type { Root, Content } from "mdast";

// 重新定义 Paragraph 类型以避免冲突
interface MdastParagraph {
  type: "paragraph";
  children: Content[];
}

/**
 * Remark 插件：解析 Markdown 中的 [type] 提示框语法
 * 支持类型：info, warn, warning, error, success, tip, note, danger
 *
 * 用法示例:
 * [info] 这是一条信息提示
 *
 * [warn] 这是一条警告信息
 * 可以跨越多行
 */
const remarkCallout: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, (node, index, parent) => {
      if (node.type !== "paragraph") return;

      const paragraph = node as MdastParagraph;
      const firstChild = paragraph.children?.[0];

      if (!firstChild || firstChild.type !== "text") return;

      const textNode = firstChild as TextNode;
      // 匹配 [type] 开头的内容
      const match = textNode.value.match(
        /^\[(info|warn|warning|error|success|tip|note|danger)\]\s*(.*)$/i,
      );

      if (!match) return;

      const [, type, content] = match;

      // 创建自定义 HTML 结构
      const calloutHtml = createCalloutHTML(type.toLowerCase(), content.trim());

      // 替换为 HTML 节点
      if (parent && index !== undefined) {
        const htmlNode = {
          type: "html",
          value: calloutHtml,
        };
        parent.children.splice(index, 1, htmlNode);
      }
    });
  };
};

/**
 * 创建 Callout HTML 字符串
 */
function createCalloutHTML(type: string, content: string): string {
  const titles: Record<string, { title: string; icon: string }> = {
    info: { title: "信息", icon: "ℹ️" },
    warn: { title: "警告", icon: "⚠️" },
    warning: { title: "警告", icon: "⚠️" },
    error: { title: "错误", icon: "❌" },
    success: { title: "成功", icon: "✅" },
    tip: { title: "技巧", icon: "💡" },
    note: { title: "注释", icon: "📝" },
    danger: { title: "危险", icon: "🚫" },
  };

  const config = titles[type] || titles.info;

  return `
<div class="callout callout-${type}" data-callout="${type}">
  <div class="callout-title">
    <span class="callout-icon">${config.icon}</span>
    <span class="callout-title-text">${config.title}</span>
  </div>
  <div class="callout-content">
    ${content}
  </div>
</div>`.trim();
}

// 辅助类型定义
interface TextNode {
  type: "text";
  value: string;
}

/**
 * 访问 AST 节点的辅助函数
 */
function visit(
  node: any,
  callback: (node: any, index?: number, parent?: any) => void,
): void {
  function visitNode(node: any, index?: number, parent?: any) {
    callback(node, index, parent);

    if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any, i: number) => {
        visitNode(child, i, node);
      });
    }
  }

  visitNode(node);
}

export default remarkCallout;
