"""
CILXRY 纪事小栈文章校验

本模块用于纪事小栈内的文章 Frontmatter 校验和修复。
依赖：pip install pyyaml openai
Schema 由 exportSchema.ts 从 src/content/config.ts 动态生成。
"""

import os
import sys
import json
import re
import yaml
import argparse
from openai import OpenAI
from openai.types.chat import ChatCompletionMessageParam
from datetime import datetime, date

# ========== 配置 ==========

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

AI_PROMPTS = {
    "title": "参考文章的 H1 和文章内容中作者语气生成一个合适的45字以内的标题",
    "tags": "请根据文章内容生成一个合适的不超过7个的标签",
    "category": "请根据文章内容生成一个合适的分类",
    "description": "根据这个文章生成一个简短的不超过50字的简介",
}

AUTO_DEFAULTS = {
    "author": "CILXRY",
    "draft": False,
}

_client = None
_ai_available = None


def is_ai_available():
    global _ai_available
    if _ai_available is None:
        key = os.environ.get("DEEPSEEK_API_KEY")
        _ai_available = bool(key)
        if not _ai_available:
            print(f"{TC.Y}[WARN] DEEPSEEK_API_KEY 未设置，AI 修复不可用{TC.RST}")
    return _ai_available


def get_client():
    global _client
    if _client is None:
        _client = OpenAI(
            api_key=os.environ.get("DEEPSEEK_API_KEY", "sk-placeholder"),
            base_url="https://api.deepseek.com",
        )
    return _client

# ========== Schema 加载 ==========


def load_schema():
    path = os.path.join(BASE_DIR, "schemas", "posts.fields.json")
    with open(path, "r") as f:
        fields = json.load(f)

    type_map = {
        "string": str,
        "list": list,
        "bool": bool,
        "datetime": (datetime, str),
        "number": (int, float),
    }

    schema = {}
    for fdef in fields:
        schema[fdef["name"]] = {
            "type": type_map[fdef["type"]],
            "required": fdef["required"],
        }
    return schema


SCHEMA = load_schema()
SCHEMA_KEYS = set(SCHEMA.keys())

# ========== 终端输出 ==========


class TC:
    """Terminal colors — 无颜色终端自动降级"""

    _enabled = hasattr(sys.stdout, "isatty") and sys.stdout.isatty()

    R = "\033[91m" if _enabled else ""
    G = "\033[92m" if _enabled else ""
    Y = "\033[93m" if _enabled else ""
    B = "\033[94m" if _enabled else ""
    C = "\033[96m" if _enabled else ""
    BOLD = "\033[1m" if _enabled else ""
    DIM = "\033[2m" if _enabled else ""
    RST = "\033[0m" if _enabled else ""


def sep(title: str = ""):
    width = 60
    if title:
        line = "─" * 4 + f" {title} " + "─" * (width - len(title) - 6)
    else:
        line = "─" * width
    print(f"{TC.DIM}{line}{TC.RST}")


def status_icon(ok: bool) -> str:
    return f"{TC.G}✓{TC.RST}" if ok else f"{TC.R}✗{TC.RST}"


# ========== 工具函数 ==========


def parse_date(value):
    if isinstance(value, datetime):
        return value
    if isinstance(value, date):
        return datetime(value.year, value.month, value.day)
    if isinstance(value, str):
        value = value.strip()
        for fmt in (
            "%Y-%m-%dT%H:%M:%S",
            "%Y-%m-%d",
            "%Y-%m-%dT%H:%M:%S.%f",
            "%Y-%m-%dT%H:%M:%S%z",
        ):
            try:
                return datetime.strptime(value, fmt)
            except ValueError:
                continue
    return None


def count_words(text: str) -> int:
    cjk = len(re.findall(r"[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]", text))
    en = len(re.findall(r"[a-zA-Z]+", text))
    return cjk + en


def compute_reading_time(word_count: int) -> int:
    if word_count <= 0:
        return 0
    return max(1, round(word_count / 200))


def extract_h1(content: str) -> str:
    for line in content.split("\n"):
        stripped = line.strip()
        if stripped.startswith("# ") and not stripped.startswith("## "):
            return stripped[2:].strip()
    return ""


# ========== 读取文件 ==========


def get_folder_md_files(dir_path: str) -> list:
    files = []
    try:
        for f in sorted(os.listdir(dir_path)):
            if f.endswith(".md"):
                files.append(os.path.join(dir_path, f))
    except FileNotFoundError:
        print(f"{TC.R}[ERROR] 目录不存在：{dir_path}{TC.RST}")
    return files


def read_markdown_content(file_path: str):
    """返回 (frontmatter_dict, article_text)"""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            raw = f.read()
    except FileNotFoundError:
        print(f"{TC.R}[ERROR] 文件不存在：{file_path}{TC.RST}")
        return {}, ""
    except Exception as e:
        print(f"{TC.R}[ERROR] 读取失败：{file_path} - {e}{TC.RST}")
        return {}, ""

    fm = {}
    body = raw

    if raw.startswith("---"):
        end = raw.find("---", 3)
        if end != -1:
            try:
                fm = yaml.safe_load(raw[3:end]) or {}
            except yaml.YAMLError as e:
                print(f"{TC.R}[ERROR] YAML 解析错误：{file_path} - {e}{TC.RST}")
                fm = {}
            body = raw[end + 3 :]

    return fm, body


# ========== 校验 ==========


def file_validate_frontmatter(fm: dict, schema: dict):
    errors = []

    if not isinstance(fm, dict):
        for name, rule in schema.items():
            if rule["required"]:
                errors.append({"field": name, "error": "missing"})
        return errors

    for name, rule in schema.items():
        value = fm.get(name)

        if value is None:
            if rule["required"]:
                errors.append({"field": name, "error": "missing"})
            continue

        expected = rule["type"]

        if expected == datetime or expected == (datetime, str):
            if not isinstance(value, (datetime, date, str)):
                errors.append({"field": name, "error": "type"})
            elif isinstance(value, str) and parse_date(value) is None:
                errors.append({"field": name, "error": "type"})
            continue

        if expected == (int, float):
            if not isinstance(value, (int, float)):
                errors.append({"field": name, "error": "type"})
            continue

        if not isinstance(value, expected):
            errors.append({"field": name, "error": "type"})
            continue

        if isinstance(value, str) and not value.strip():
            errors.append({"field": name, "error": "empty"})
        elif isinstance(value, list) and len(value) == 0:
            errors.append({"field": name, "error": "empty"})

    return errors


def check_extra_fields(fm: dict, schema_keys: set) -> list:
    """检出 schema 之外的额外字段"""
    extras = []
    for key in fm:
        if key not in schema_keys:
            extras.append(key)
    return extras


# ========== 修复 ==========


def write_frontmatter(file_path: str, fm: dict, content: str, errors: list):
    """AI 补充缺失字段，计算统计信息，回写文件"""

    changed = False

    # 先把 updated 的值复制给 published（保留 updated 不删）
    if "updated" in fm and "published" not in fm:
        fm["published"] = fm["updated"]

    # ---- 修复 missing 错误 ----
    for err in errors:
        if err["error"] != "missing":
            continue
        name = err["field"]

        if name == "creation":
            fm["creation"] = datetime.fromtimestamp(os.path.getctime(file_path))
            print(f"  {TC.G}[FIX] creation ← 文件创建时间{TC.RST}")
            changed = True

        elif name == "published":
            if "updated" in fm and "published" not in fm:
                fm["published"] = fm["updated"]
            elif "creation" in fm and "published" not in fm:
                fm["published"] = fm["creation"]
                print(f"  {TC.G}[FIX] published ← creation{TC.RST}")
                changed = True

        elif name in AUTO_DEFAULTS:
            fm[name] = AUTO_DEFAULTS[name]
            print(f"  {TC.G}[FIX] {name} ← 默认值{TC.RST}")
            changed = True

        elif name in AI_PROMPTS:
            if not is_ai_available():
                print(f"  {TC.Y}[SKIP] {name} 需 AI 但未配置 API Key{TC.RST}")
                continue
            try:
                ai = ask_ai_generation(str(content), name, get_client())
                if ai:
                    # list 类型：按分隔符拆成数组
                    if SCHEMA.get(name, {}).get("type") == list:
                        parts = re.split(r"[,，、\s]+", ai)
                        fm[name] = [p for p in parts if p]
                        print(f"  {TC.C}[AI] {name} ← AI 生成 (拆为 list){TC.RST}")
                    else:
                        fm[name] = ai
                        print(f"  {TC.C}[AI] {name} ← AI 生成{TC.RST}")
                    changed = True
            except Exception as exc:
                print(f"  {TC.R}[ERROR] AI 补充 {name} 失败：{exc}{TC.RST}")

        elif name in SCHEMA:
            sname = SCHEMA[name]["type"]
            if sname == str or sname == (datetime, str):
                fm[name] = ""
            elif sname == bool:
                fm[name] = False
            elif sname == list:
                fm[name] = []
            elif sname == (int, float):
                fm[name] = 0
            print(f"  {TC.Y}[WARN] {name} 无法自动填充，设为空值{TC.RST}")
            changed = True

    # ---- 修复 type 错误 ----
    for err in errors:
        if err["error"] != "type":
            continue
        name = err["field"]
        val = fm.get(name)
        rule = SCHEMA.get(name)
        if not rule:
            continue

        expected = rule["type"]

        if expected == list and isinstance(val, str):
            fm[name] = [t.strip() for t in val.split(",") if t.strip()]
            print(f"  {TC.G}[FIX] {name} str → list{TC.RST}")
            changed = True

        elif expected in (str, (datetime, str)) and isinstance(val, list):
            fm[name] = ", ".join(str(v) for v in val)
            print(f"  {TC.G}[FIX] {name} list → str{TC.RST}")
            changed = True

        elif (expected == datetime or expected == (datetime, str)) and isinstance(
            val, (datetime, date, str)
        ):
            dt = parse_date(val)
            if dt:
                fm[name] = dt.isoformat()
                print(f"  {TC.G}[FIX] {name} 日期格式规范化{TC.RST}")
                changed = True

    # ---- 统计：wordCount / readingTime ----
    if "wordCount" not in fm or fm.get("wordCount") is None:
        wc = count_words(content)
        fm["wordCount"] = wc
        print(f"  {TC.G}[STAT] wordCount ← {wc}{TC.RST}")
        changed = True

    if "readingTime" not in fm or fm.get("readingTime") is None:
        wc = fm.get("wordCount", count_words(content))
        rt = compute_reading_time(wc)
        fm["readingTime"] = rt
        print(f"  {TC.G}[STAT] readingTime ← {rt} min{TC.RST}")
        changed = True

    if not changed:
        return 0

    # ----- 构建新文件内容 -----
    lines = ["---"]
    for key, value in fm.items():
        if isinstance(value, (datetime, date)):
            lines.append(f"{key}: {value.isoformat()}")
        elif isinstance(value, list):
            lines.append(f"{key}:")
            for item in value:
                lines.append(f"  - {item}")
        elif isinstance(value, bool):
            lines.append(f"{key}: {'true' if value else 'false'}")
        elif isinstance(value, (int, float)):
            lines.append(f"{key}: {value}")
        else:
            val_str = str(value)
            if any(c in val_str for c in (":", "#", "@", "[", "]", "{", "}", "|")):
                lines.append(f'{key}: "{val_str}"')
            else:
                lines.append(f"{key}: {val_str}")
    lines.append("---")

    if content.startswith("---"):
        end = content.find("---", 3)
        if end != -1:
            lines.append(content[end + 3 :].lstrip("\n"))
    else:
        lines.append(content)

    new_content = "\n".join(lines) + "\n"

    try:
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"  {TC.G}[SAVED] 文件已更新{TC.RST}")
        return 1
    except Exception as e:
        print(f"  {TC.R}[ERROR] 写入失败：{e}{TC.RST}")
        return 0


def ask_ai_generation(article: str, field_name: str, ai_client: OpenAI) -> str:
    prompt = AI_PROMPTS.get(field_name)
    if not prompt:
        return ""

    messages: list[ChatCompletionMessageParam] = [
        {
            "role": "system",
            "content": "你是专业的Markdown文档分析工具，负责根据文档内容补充缺失的Frontmatter字段。请根据用户给出的文档的整体内容，生成准确的字段值。注意，你只需要根据用户需要生成内容即可，不需要任何额外提示性信息。",
        },
        {"role": "user", "content": f"文章内容：{article}"},
        {"role": "user", "content": prompt},
    ]

    response = ai_client.chat.completions.create(
        model="deepseek-v4-flash",
        messages=messages,
        stream=False,
        extra_body={"thinking": {"type": "disabled"}},
    )

    result = response.choices[0].message.content
    if not result:
        return ""

    result = result.strip()

    # 去掉外层引号
    if (result.startswith('"') and result.endswith('"')) or \
       (result.startswith("'") and result.endswith("'")):
        result = result[1:-1]

    # 去掉 AI 误加的字段名前缀，如 "title: xxx" 或 "title：xxx"
    for prefix in (f"{field_name}: ", f"{field_name}：", f"{field_name}:", f"{field_name}："):
        if result.startswith(prefix):
            result = result[len(prefix):].strip()
            break

    # 再次去掉可能新形成的引号
    if (result.startswith('"') and result.endswith('"')) or \
       (result.startswith("'") and result.endswith("'")):
        result = result[1:-1]

    return result.strip()


# ========== 主逻辑 ==========


def file_check(file_path: str, check_only: bool = False, warn_extra: bool = False):
    short = os.path.basename(file_path)
    print(f"\n{TC.BOLD}{short}{TC.RST}")

    fm, content = read_markdown_content(file_path)

    if not fm:
        print(f"  {TC.Y}⚠ Frontmatter 不存在或解析失败{TC.RST}")

    # 校验
    errors = file_validate_frontmatter(fm, SCHEMA)

    # 额外字段检查
    extra_fields = check_extra_fields(fm, SCHEMA_KEYS)
    if extra_fields and warn_extra:
        for ef in extra_fields:
            print(f"  {TC.Y}[WARN] 额外字段 '{ef}'（不在 schema 中）{TC.RST}")

    # 报告错误
    if not errors:
        print(f"  {status_icon(True)} Frontmatter 合规")
        return {"status": "ok", "fixed": 0}
    else:
        print(f"  {status_icon(False)} {len(errors)} 个问题：")
        for e in errors:
            print(f"     · {e['field']}: {e['error']}")

        if check_only:
            return {"status": "issues", "fixed": 0}

        # 修复
        print(f"  {TC.B}[>>] 开始修复...{TC.RST}")
        fixed = write_frontmatter(file_path, fm, content, errors)
        return {"status": "issues", "fixed": fixed}


def checkDir(dir_path: str, check_only: bool = False, warn_extra: bool = False):
    files = get_folder_md_files(dir_path)
    if not files:
        print(f"{TC.Y}[WARN] 目录下没有 Markdown 文件{TC.RST}")
        return

    print(f"\n{TC.BOLD}校验目录：{dir_path}{TC.RST}")
    print(f"模式：{'仅检查' if check_only else '检查并修复'} | 文件数：{len(files)}")
    sep()

    summary = {"ok": 0, "issues": 0, "fixed": 0}
    for f in files:
        result = file_check(f, check_only=check_only, warn_extra=warn_extra)
        if result["status"] == "ok":
            summary["ok"] += 1
        else:
            summary["issues"] += 1
        summary["fixed"] += result["fixed"]

    sep("结果")
    total = len(files)
    print(
        f"  {TC.G}通过: {summary['ok']}{TC.RST}  "
        f"{TC.R}问题: {summary['issues']}{TC.RST}  "
        f"{TC.C}修复: {summary['fixed']}{TC.RST}  "
        f"共 {total} 个文件"
    )
    sep()
    print()


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="CILXRY 纪事小栈文章校验",
        epilog="Schema 由 exportSchema.ts 从 src/content/config.ts 动态生成。",
    )
    parser.add_argument("path", help="需要检测的目录")
    parser.add_argument(
        "-c", "--check", "--check-only", action="store_true", help="仅检查，不进行修复"
    )
    parser.add_argument("-r", "--repair", action="store_true", help="直接修复")
    parser.add_argument(
        "-cr", "--checkrepair", action="store_true", help="先检查后修复"
    )
    parser.add_argument(
        "-w",
        "--warn-extra",
        action="store_true",
        help="报告 schema 之外的额外字段（警告，不删除）",
    )
    return parser.parse_args()


def main():
    args = parse_arguments()

    if args.check:
        checkDir(args.path, check_only=True, warn_extra=args.warn_extra)

    if args.repair:
        checkDir(args.path, check_only=False, warn_extra=args.warn_extra)

    if args.checkrepair:
        checkDir(args.path, check_only=True, warn_extra=args.warn_extra)
        sep()
        checkDir(args.path, check_only=False, warn_extra=args.warn_extra)


if __name__ == "__main__":
    main()
