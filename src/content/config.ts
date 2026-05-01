import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { postsSchema } from "./schema.ts";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: postsSchema,
});

// const memory = defineCollection({
//   loader: glob({
//     pattern: "**/*.md",
//     base: "./src/content/memorys",
//     generateId: ({ entry }) => entry.replace(/\.md$/, ""),
//   }),
//   schema: z.object({
//     pubDate: z.coerce.date().optional(),
//   }),
// });

export const collections = { posts, };
