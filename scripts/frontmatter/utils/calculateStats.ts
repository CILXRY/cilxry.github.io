/// <reference types="node" />

/**
 * 计算字数和阅读时长
 * @param content 文章内容
 * @returns 字数和阅读时长（分钟）
 */
export const calculateReadingStats = (content: string) => {
  const cleanContent = content.trim();
  // 中文、英文、数字都算作字符，按中文习惯：字数 = 所有非空白字符数
  const wordCount = (cleanContent.match(/[^\s]/g) || []).length;
  // 阅读速度：中文约 300 字/分钟
  const readingTime = Math.ceil(wordCount / 300);
  return { wordCount, readingTime };
};
