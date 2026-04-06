import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "astro/zod";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const postsSchema = z.object({
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
  published: z.coerce.date().optional(),
  warning: z.string().optional().nullable(),
});

const memorySchema = z.object({
  pubDate: z.coerce.date().optional(),
});

const instructionsSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  pubDate: z.coerce.date().optional(),
  draft: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  wordCount: z.number().optional(),
  readingTime: z.number().optional(),
});

const outputDir = resolve(__dirname, "schemas");

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

const schemas = {
  posts: postsSchema,
  memory: memorySchema,
  instructions: instructionsSchema,
};

for (const [name, schema] of Object.entries(schemas)) {
  const jsonSchema = zodToJsonSchema(schema, {
    name: `${name}Frontmatter`,
    target: "jsonSchema7",
  });

  const outputPath = resolve(outputDir, `${name}.schema.json`);
  writeFileSync(outputPath, JSON.stringify(jsonSchema, null, 2));

  console.log(`✅ Generated: ${outputPath}`);
}

console.log("\n📦 All schemas exported to generate/schemas/");
