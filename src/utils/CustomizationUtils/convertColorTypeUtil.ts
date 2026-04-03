import { formatHex, rgb } from "culori";

// RGB 颜色转 16 进制 RGB 颜色
export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// 16 进制 RGB 颜色转 RGB 颜色
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let r = parseInt(hex.substring(1, 3), 16);
  let g = parseInt(hex.substring(3, 5), 16);
  let b = parseInt(hex.substring(5, 7), 16);
  return { r, g, b };
}

// HSL 颜色转 RGB 颜色
export function hslToRgb(
  h: number,
  s = 80,
  l = 50,
): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;
  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    let hue2rgb = function hue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// OKLCH 转十六进制 RGB
export function oklchToHex(
  color: number,
  brightness = 0.77,
  chroma = 0.11,
): string {
  let oklch = `oklch(${brightness} ${chroma} ${color})`;
  const colorRgb = rgb(oklch);
  return formatHex(colorRgb) || "#f00";
}

export function rgbToHsl(
  r: number,
  g: number,
  b: number,
): { h: number; s: number; l: number } {
  ((r /= 255), (g /= 255), (b /= 255));
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h, s, l };
}

export function hexToHsl(color: string): { h: number; s: number; l: number } {
  const rgbDec = hexToRgb(color);
  return rgbToHsl(rgbDec.r, rgbDec.g, rgbDec.b);
}
