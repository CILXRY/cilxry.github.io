import { z } from "astro/zod";
import type { FieldMeta } from "@tp/schemaMeta.types.ts";

export const postsSchema = z.object({
  title: z.string().default("标题不见了呢"),
  tags: z.array(z.string().min(1).trim()).nullable(),
  category: z.string().nullable().optional(),
  author: z.string().nullable().optional().default("CILXRY"),
  draft: z.boolean(),
  description: z.string().nullable().default("描述被吃掉了啦"),
  descGenAuthor: z.string().optional().nullable(),
  descGenTime: z.coerce.date().optional(),
  creation: z.coerce.date().default(new Date(0)),
  updated: z.coerce.date(),
  warning: z.string().optional().nullable(),
});

// 获取 Schema 的所有键
type PostKeys = keyof z.infer<typeof postsSchema>;

export const postsMeta: Record<PostKeys, FieldMeta> = {
  title: { type: "string", required: true },
  tags: { type: "list", required: true },
  category: { type: "string", required: false },
  author: { type: "string", required: false },
  draft: { type: "bool", required: true },
  description: { type: "string", required: false },
  descGenAuthor: { type: "string", required: false },
  descGenTime: { type: "datetime", required: false },
  creation: { type: "datetime", required: false },
  updated: { type: "datetime", required: false },
  warning: { type: "string", required: false },
};
