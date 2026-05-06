import { zodToJsonSchema } from "zod-to-json-schema";
import { z } from "astro/zod";
import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { postsSchema } from "../src/config/schema.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(__dirname, "schemas");

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

function extractFields(schema: z.ZodObject<any>) {
  const shape = schema.shape as Record<string, z.ZodTypeAny>;
  const fields: Array<{ name: string; type: string; required: boolean }> = [];

  for (const [name, field] of Object.entries(shape)) {
    let inner = field;
    let isOptional = false;

    while (true) {
      const def = (inner as any)._def;
      if (def.typeName === "ZodDefault") {
        inner = def.innerType;
      } else if (def.typeName === "ZodOptional") {
        isOptional = true;
        inner = def.innerType;
      } else if (def.typeName === "ZodNullable") {
        inner = def.innerType;
      } else {
        break;
      }
    }

    const typeName = (inner as any)._def.typeName;
    const typeMap: Record<string, string> = {
      ZodString: "string",
      ZodArray: "list",
      ZodBoolean: "bool",
      ZodDate: "datetime",
      ZodNumber: "number",
    };

    fields.push({
      name,
      type: typeMap[typeName] || "string",
      required: !isOptional,
    });
  }

  return fields;
}

// Generate JSON Schema (for Astro / other consumers)
const jsonSchema = zodToJsonSchema(postsSchema as any, {
  name: "postsFrontmatter",
  target: "jsonSchema7",
}) as any;

writeFileSync(
  resolve(outputDir, "posts.schema.json"),
  JSON.stringify(jsonSchema, null, 2),
);
console.log("Generated: posts.schema.json");

// Generate simple field list (for Python validate.py)
const fields = extractFields(postsSchema);
writeFileSync(
  resolve(outputDir, "posts.fields.json"),
  JSON.stringify(fields, null, 2),
);
console.log("Generated: posts.fields.json");

console.log("\nAll schemas in validate/schemas/");
