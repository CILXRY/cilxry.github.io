/// <reference types="astro/client" />

declare namespace astroHTML.JSX {
  interface HTMLAttributes<T> {
    [key: string]: any;
  }
  interface AnchorHTMLAttributes<T> {
    [key: string]: any;
  }
  interface InputHTMLAttributes<T> {
    [key: string]: any;
  }
  // 扩展 MetaHTMLAttributes 以支持 Open Graph 的 property 属性
  interface MetaHTMLAttributes<T> {
    property?: string;
  }
  // 扩展 HtmlHTMLAttributes 以支持 children 属性
  interface HtmlHTMLAttributes<T> {
    children?: any;
  }
  interface ButtonHTMLAttributes<T> {
    children?: any;
  }
  interface LiHTMLAttributes<T> {
    children?: any;
  }
  // 扩展 ImgHTMLAttributes 以支持 class 属性
  interface ImgHTMLAttributes<T> {
    class?: string;
  }
  // 扩展 SVGAttributes 以支持 class 和其他属性
  interface SVGAttributes<T> {
    class?: string;
    'stroke-linecap'?: string;
    'stroke-linejoin'?: string;
    'stroke-width'?: string;
  }
}
