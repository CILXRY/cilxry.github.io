import { getCollection } from "astro:content";
import { encode } from "@ut/base62.ts";

const forceRenameFromUUID = false;

const allBlogs = await getCollection("blogs");
const blogAmount = allBlogs.length;

export function renameByOriginalName(title: string) {
  return title + ".md";
}

export function renameByBase62() {
  return encode(blogAmount + 1) + ".md";
}

export function renameByUUID() {
  return crypto.randomUUID() + ".md";
}

export function alert(type: "fromUUID") {
  if (type === "fromUUID") {
    console.warn(
      "当前正尝试从 UUID 重命名文章，因为 UUID 的全局唯一性，如果重命名，将导致你的外链被破坏性的无法找回，继续？"
    );
    if (forceRenameFromUUID) return;
    console.warn(
      '这是一条避免误操作的二次确认，请在配置文件中将 "forceRenameFromUUID" 一项调整为 true'
    );
  }
}
