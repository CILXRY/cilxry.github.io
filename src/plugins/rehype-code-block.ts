import type { Plugin } from "unified";
import type { Root, Element, ElementContent } from "hast";

/**
 * Rehype 插件：为 Shiki 代码块添加增强功能
 * - 语言标签 (显示编程语言)
 * - 复制按钮 (一键复制代码)
 * - 行号 (显示代码行号)
 *
 * 该插件在 Shiki 处理后的 HTML 上运行
 */
const rehypeCodeBlock: Plugin<[], Root> = () => {
  return (tree: Root) => {
    // 遍历所有节点
    visit(tree, (node, index, parent) => {
      // 查找 pre 标签 (Shiki 生成的代码块)
      if (node.type !== "element" || node.tagName !== "pre") return;

      const preNode = node as Element;

      // 检查是否包含 code 标签
      const codeNode = preNode.children?.find(
        (child: ElementContent): child is Element =>
          child.type === "element" && child.tagName === "code",
      );

      if (!codeNode) return;

      // 从 code 标签的 class 中提取语言
      const codeClasses = (codeNode.properties?.className as string[]) || [];
      const languageClass = codeClasses.find((cls) =>
        cls.startsWith("language-"),
      );
      const language = languageClass
        ? languageClass.replace("language-", "")
        : "text";

      // 获取代码文本内容
      const codeText = extractText(codeNode);
      const lines = codeText.split("\n");
      const lineCount = lines.length;

      // 生成行号 HTML
      const lineNumbersHtml = lines
        .map((_, i) => `<span class="line-number">${i + 1}</span>`)
        .join("");

      // 创建增强结构的子节点
      const enhancedChildren: ElementContent[] = [
        // 语言标签
        {
          type: "element",
          tagName: "div",
          properties: { className: ["lang"] },
          children: [{ type: "text", value: language.toUpperCase() }],
        },
        // 复制按钮
        {
          type: "element",
          tagName: "button",
          properties: {
            className: ["copy"],
            "data-code": codeText,
          },
          children: [],
        },
        // 行号容器
        {
          type: "element",
          tagName: "div",
          properties: {
            className: ["line-numbers-wrapper"],
            innerHTML: lineNumbersHtml,
          },
          children: [],
        },
        // 原始的 pre 标签 (包含 code)
        preNode,
      ];

      // 创建新的容器 div
      const containerNode: Element = {
        type: "element",
        tagName: "div",
        properties: {
          className: [`language-${language}`],
        },
        children: enhancedChildren,
      };

      // 替换原 pre 节点
      if (parent && index !== undefined) {
        parent.children[index] = containerNode;
      }
    });
  };
};

/**
 * 从 AST 节点中提取纯文本
 */
function extractText(node: ElementContent): string {
  if (node.type === "text") {
    return node.value;
  }

  if (node.type === "element" && node.children) {
    return node.children.map(extractText).join("");
  }

  return "";
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

export default rehypeCodeBlock;
