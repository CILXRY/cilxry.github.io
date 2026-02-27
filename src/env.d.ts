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
}
