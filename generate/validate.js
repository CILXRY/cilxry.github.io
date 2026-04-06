#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return null;

  const frontmatter = {};
  const lines = match[1].split("\n");
  let currentKey = null;
  let currentValue = "";
  let isArray = false;
  let inArray = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const kvMatch = line.match(/^(\w+):\s*(.*)$/);

    if (kvMatch && !inArray) {
      if (currentKey) {
        frontmatter[currentKey] = parseValue(currentValue, isArray);
      }
      currentKey = kvMatch[1];
      currentValue = kvMatch[2];
      isArray = currentValue.startsWith("[");
      
      if (isArray) {
        if (currentValue.endsWith("]")) {
          frontmatter[currentKey] = parseValue(currentValue, true);
          currentKey = null;
          isArray = false;
        } else {
          inArray = true;
        }
      }
    } else if (inArray) {
      currentValue += " " + line.trim();
      if (line.includes("]")) {
        frontmatter[currentKey] = parseValue(currentValue, true);
        currentKey = null;
        isArray = false;
        inArray = false;
      }
    }
  }

  if (currentKey && !inArray) {
    frontmatter[currentKey] = parseValue(currentValue, isArray);
  }

  return frontmatter;
}

function parseValue(value, isArray) {
  if (isArray) {
    const content = value.replace(/^\[|\]$/g, "");
    if (!content.trim()) return [];
    return content
      .split(",")
      .map((item) => item.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  value = value.trim().replace(/^["']|["']$/g, "");

  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null" || value === "") return null;
  if (/^\d+$/.test(value)) return parseInt(value, 10);
  if (/^\d+\.\d+$/.test(value)) return parseFloat(value);

  return value;
}

function resolveSchema(schema, rootSchema) {
  if (schema.$ref) {
    const refPath = schema.$ref.replace(/^#\/definitions\//, "");
    return rootSchema.definitions[refPath];
  }
  return schema;
}

function validateType(value, type, field) {
  const errors = [];

  if (value === undefined || value === null) {
    return errors;
  }

  switch (type) {
    case "string":
      if (typeof value !== "string") {
        errors.push(`字段 "${field}" 必须是字符串，当前类型: ${typeof value}`);
      }
      break;
    case "boolean":
      if (typeof value !== "boolean") {
        errors.push(`字段 "${field}" 必须是布尔值，当前类型: ${typeof value}`);
      }
      break;
    case "number":
      if (typeof value !== "number") {
        errors.push(`字段 "${field}" 必须是数字，当前类型: ${typeof value}`);
      }
      break;
    case "integer":
      if (!Number.isInteger(value)) {
        errors.push(`字段 "${field}" 必须是整数，当前值: ${value}`);
      }
      break;
    case "array":
      if (!Array.isArray(value)) {
        errors.push(`字段 "${field}" 必须是数组，当前类型: ${typeof value}`);
      }
      break;
    case "object":
      if (typeof value !== "object" || Array.isArray(value)) {
        errors.push(`字段 "${field}" 必须是对象`);
      }
      break;
  }

  return errors;
}

function validateFormat(value, format, field) {
  const errors = [];

  if (value === undefined || value === null) {
    return errors;
  }

  if (format === "date-time") {
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;
    if (typeof value === "string" && !dateRegex.test(value)) {
      errors.push(`字段 "${field}" 必须是有效的日期格式 (YYYY-MM-DD 或 YYYY-MM-DDTHH:mm:ss)`);
    }
  }

  return errors;
}

function validateArray(value, itemsSchema, field, rootSchema) {
  const errors = [];

  if (!Array.isArray(value)) {
    return errors;
  }

  const resolvedItems = resolveSchema(itemsSchema, rootSchema);

  for (let i = 0; i < value.length; i++) {
    const itemErrors = validateValue(value[i], resolvedItems, `${field}[${i}]`, rootSchema);
    errors.push(...itemErrors);
  }

  return errors;
}

function validateValue(value, schema, field, rootSchema) {
  const errors = [];
  const resolved = resolveSchema(schema, rootSchema);

  if (value === undefined || value === null) {
    return errors;
  }

  if (resolved.type) {
    errors.push(...validateType(value, resolved.type, field));
  }

  if (resolved.format) {
    errors.push(...validateFormat(value, resolved.format, field));
  }

  if (resolved.type === "array" && resolved.items) {
    errors.push(...validateArray(value, resolved.items, field, rootSchema));
  }

  if (resolved.type === "string" && resolved.minLength !== undefined) {
    if (typeof value === "string" && value.length < resolved.minLength) {
      errors.push(`字段 "${field}" 长度不能少于 ${resolved.minLength}`);
    }
  }

  if (resolved.type === "string" && resolved.maxLength !== undefined) {
    if (typeof value === "string" && value.length > resolved.maxLength) {
      errors.push(`字段 "${field}" 长度不能超过 ${resolved.maxLength}`);
    }
  }

  if (resolved.type === "number" && resolved.minimum !== undefined) {
    if (typeof value === "number" && value < resolved.minimum) {
      errors.push(`字段 "${field}" 不能小于 ${resolved.minimum}`);
    }
  }

  if (resolved.type === "number" && resolved.maximum !== undefined) {
    if (typeof value === "number" && value > resolved.maximum) {
      errors.push(`字段 "${field}" 不能大于 ${resolved.maximum}`);
    }
  }

  return errors;
}

function validateField(value, fieldSchema, field, rootSchema) {
  const errors = [];
  const resolved = resolveSchema(fieldSchema, rootSchema);

  if (resolved.anyOf) {
    const anyOfResults = resolved.anyOf.map((subSchema) => {
      const subResolved = resolveSchema(subSchema, rootSchema);
      
      if (subResolved.not !== undefined) {
        return { valid: true, errors: [] };
      }
      
      if (subResolved.type === "null") {
        if (value === null) {
          return { valid: true, errors: [] };
        }
        return { valid: false, errors: [`字段 "${field}" 不为 null`] };
      }
      
      const subErrors = validateValue(value, subResolved, field, rootSchema);
      return { valid: subErrors.length === 0, errors: subErrors };
    });

    const hasValid = anyOfResults.some(r => r.valid);
    
    if (!hasValid) {
      if (value !== undefined && value !== null) {
        errors.push(`字段 "${field}" 类型不匹配`);
      }
    }
  } else {
    errors.push(...validateValue(value, resolved, field, rootSchema));
  }

  return errors;
}

function validateFrontmatter(frontmatter, schema) {
  const errors = [];
  const rootSchema = schema;
  const mainSchema = resolveSchema(schema, rootSchema);

  if (mainSchema.required) {
    for (const field of mainSchema.required) {
      if (frontmatter[field] === undefined) {
        errors.push(`缺少必填字段: "${field}"`);
      }
    }
  }

  const properties = mainSchema.properties || {};

  for (const [field, fieldSchema] of Object.entries(properties)) {
    const value = frontmatter[field];
    
    if (value === undefined) {
      continue;
    }

    const fieldErrors = validateField(value, fieldSchema, field, rootSchema);
    errors.push(...fieldErrors);
  }

  if (mainSchema.additionalProperties === false) {
    const allowedFields = Object.keys(properties);
    const actualFields = Object.keys(frontmatter);
    const extraFields = actualFields.filter(f => !allowedFields.includes(f));
    
    for (const field of extraFields) {
      errors.push(`未知字段: "${field}"`);
    }
  }

  return errors;
}

function getAllMarkdownFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllMarkdownFiles(fullPath));
    } else if (entry.name.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log("用法: node validate.js <schema.json> <posts目录>");
    console.log("示例: node validate.js posts.schema.json ./posts");
    process.exit(1);
  }

  const [schemaPath, postsDir] = args;
  
  if (!fs.existsSync(schemaPath)) {
    console.log(`❌ Schema 文件不存在: ${schemaPath}`);
    process.exit(1);
  }
  
  if (!fs.existsSync(postsDir)) {
    console.log(`❌ 目录不存在: ${postsDir}`);
    process.exit(1);
  }

  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));
  const files = getAllMarkdownFiles(postsDir);

  if (files.length === 0) {
    console.log("⚠️  没有找到 Markdown 文件");
    process.exit(0);
  }

  console.log(`\n🔍 检查 ${files.length} 个文件...\n`);

  let errorCount = 0;
  let validCount = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8");
    const frontmatter = parseFrontmatter(content);

    if (!frontmatter) {
      console.log(`❌ ${path.relative(process.cwd(), file)}`);
      console.log("   └─ 未找到 Frontmatter（缺少 --- 分隔符）");
      errorCount++;
      continue;
    }

    const errors = validateFrontmatter(frontmatter, schema);

    if (errors.length > 0) {
      console.log(`❌ ${path.relative(process.cwd(), file)}`);
      errors.forEach((err) => console.log(`   └─ ${err}`));
      errorCount++;
    } else {
      console.log(`✅ ${path.relative(process.cwd(), file)}`);
      validCount++;
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log(`📊 统计: 共 ${files.length} 个文件`);
  console.log(`   ✅ 通过: ${validCount}`);
  console.log(`   ❌ 失败: ${errorCount}`);
  console.log("=".repeat(50));

  if (errorCount > 0) {
    process.exit(1);
  }
}

main();
