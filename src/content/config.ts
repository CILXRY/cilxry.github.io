import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string().default("标题不见了呢"),
    tags: z.array(z.string().min(1).trim()).optional().nullable(),
    category: z.string().optional().nullable(),
    author: z.string().optional().nullable(),
    draft: z.boolean().optional(),
    description: z.string().default("描述被吃掉了啦"),
    descGenAuthor: z.string().optional().nullable(),
    descGenTime: z.coerce.date().optional(),
    wordCount: z.number().optional().nullable(),
    readingTime: z.number().optional().nullable(),
    creation: z.coerce.date().default(new Date(0)),
    published: z.coerce.date().default(new Date(0)),
    warning: z.string().optional().nullable(),
    // original: z.string().optional(),
  }),
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
