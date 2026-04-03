// 62 个字符，打乱了
const CHARS = "Ll5gfWpoa0sQe6JBGzn9DPXkr3OhIdStjZxiw1C7Eu2HcqRy8VNbATKFUvmMY4";

export function encode(num: number): string {
  if (num === 0) return CHARS[0];
  let encoded = "";
  while (num > 0) {
    encoded = CHARS[num % CHARS.length] + encoded;
    num = Math.floor(num / CHARS.length);
  }
  return encoded;
}

export function decode(str: string): number {
  let decoded = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const index = CHARS.indexOf(char);
    if (index === -1) {
      throw new Error(`Invalid character in Base62 string: ${char}`);
    }
    decoded = decoded * CHARS.length + index;
  }
  return decoded;
}
