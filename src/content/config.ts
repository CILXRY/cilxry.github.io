import { defineCollection } from "astro:content";
import remarkCallout from "@/plugins/remark-callout.ts";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/posts",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    tags: z.array(z.string().min(1).trim()).optional().nullable(),
    category: z.string().optional().nullable(),
    author: z.string().optional().nullable(),
    draft: z.boolean().optional(),
    description: z.string().optional(),
    descGenAuthor: z.string().optional().nullable(),
    descGenTime: z.coerce.date().optional(),
    wordCount: z.number().optional().nullable(),
    readingTime: z.number().optional().nullable(),
    creation: z.coerce.date(),
    published: z.coerce.date(),
    warning: z.string().optional().nullable(),
    // original: z.string().optional(),
  }),
});

const memory = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/memorys",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    pubDate: z.coerce.date().optional(),
  }),
});

const instructions = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/instructions",
    generateId: ({ entry }) => entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date().optional(),
    draft: z.boolean().optional(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    wordCount: z.number().optional(),
    readingTime: z.number().optional(),
  }),
});

export const collections = { posts, memory, instructions };

// 导出 remark 插件供 markdown 配置使用
export { remarkCallout };
