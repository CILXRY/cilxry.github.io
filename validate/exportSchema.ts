import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
// 直接导入元数据，而不是 Schema
import { postsMeta } from "../src/config/schema.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(__dirname, "schemas");

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// 将元数据转换为数组格式
const fields = Object.entries(postsMeta).map(([name, meta]) => ({
  name,
  type: (meta as any).type,
  required: (meta as any).required,
}));

writeFileSync(
  resolve(outputDir, "posts.fields.json"),
  JSON.stringify(fields, null, 2)
);

console.log("Generated: posts.fields.json");
console.log("Fields:", fields.length);

process.exit(0);
