import { safeGetCollection } from "./safeCollection.ts";

// 1. 取所有非草稿的博客
const posts = await safeGetCollection("posts", ({ data }) => !data.draft);

// 2. 提取分类和标签
export const categories = [
  ...new Set(posts.map((post) => post.data.category).filter(Boolean)),
];
export const tags = [...new Set(posts.flatMap((post) => post.data.tags || []))];

// 3. 根据发布时间排序
export const sortedPosts = posts.sort(
  (a, b) => b.data.creation.valueOf() - a.data.creation.valueOf()
);
