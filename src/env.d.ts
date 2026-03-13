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
  // 扩展MetaHTMLAttributes以支持Open Graph的property属性
  interface MetaHTMLAttributes<T> {
    property?: string;
  }
  // 扩展HtmlHTMLAttributes以支持children属性
  interface HtmlHTMLAttributes<T> {
    children?: any;
  }
  interface ButtonHTMLAttributes<T> {
    children?: any;
  }
  interface LiHTMLAttributes<T> {
    children?: any;
  }
}
