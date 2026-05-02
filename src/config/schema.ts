import { z } from "astro/zod";

export const postsSchema = z.object({
  title: z.string().default("标题不见了呢"),
  tags: z.array(z.string().min(1).trim()).nullable(),
  category: z.string().nullable(),
  author: z.string().nullable(),
  draft: z.boolean(),
  description: z.string().default("描述被吃掉了啦"),
  descGenAuthor: z.string().optional().nullable(),
  descGenTime: z.coerce.date().optional(),
  wordCount: z.number().optional().nullable(),
  readingTime: z.number().optional().nullable(),
  creation: z.coerce.date().default(new Date(0)),
  published: z.coerce.date().default(new Date(0)),
  warning: z.string().optional().nullable(),
});
