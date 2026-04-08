// 预定义好看渐变色盘
const GRADIENTS = [
  "linear-gradient(315deg, #ffbc00, #ff0058)",
  "linear-gradient(315deg, #03a9f4, #ff0058)",
  "linear-gradient(315deg, #4dff03, #00d0ff)",
  "linear-gradient(315deg, #9c27b0, #e91e63)",
  "linear-gradient(315deg, #00b0ff, #aa00ff)",
  "linear-gradient(315deg, #ff9e2c, #ff1e00)",
  "linear-gradient(315deg, #0cebeb, #20e3b2)",
  "linear-gradient(315deg, #fbab7e, #f7ce68)",
  "linear-gradient(315deg, #654ea3, #da98b4)",
  "linear-gradient(315deg, #2193b0, #6dd5ed)",
];

// Fisher-Yates 洗牌算法
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// 为一组卡片分配颜色（无重复优先）
export function assignGradients(cardCount: number): string[] {
  if (cardCount === 0) return [];

  const shuffled = shuffle(GRADIENTS);
  const result: string[] = [];

  for (let i = 0; i < cardCount; i++) {
    result.push(shuffled[i % shuffled.length]);
  }

  return result;
}
