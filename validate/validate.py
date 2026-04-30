"""
CILXRY 纪事小栈文章校验

本模块用于纪事小栈内的文章 Frontmatter 校验的修复。
依赖：pip install pyyaml openai
作者：CILXRY
注释由 AI 生成
"""

import os
import yaml
import argparse
from openai import OpenAI
from openai.types.chat import ChatCompletionMessageParam
from datetime import datetime

DisplayExactInfo: bool = True

SCHEMA = {
    "title": {
        "type": str,
        "required": True,
        "prompt": "参考文章的 H1 和文章内容中作者语气生成一个合适的45字以内的标题",
    },
    "tags": {
        "type": list,
        "required": True,
        "prompt": "请根据文章内容生成一个合适的不超过7个的标签",
    },
    "category": {
        "type": str,
        "required": True,
        "prompt": "请根据文章内容生成一个合适的分类",
    },
    "author": {
        "type": str,
        "required": True,
    },
    "draft": {
        "type": bool,
        "required": True,
    },
    "creation": {"type": datetime, "required": True},
    "description": {
        "type": str,
        "required": True,
        "prompt": "根据这个文章生成一个简短的不超过50字的简介",
    },
    "descGenAuthor": {"type": str, "required": True},
    "descGenTime": {"type": datetime, "required": True},
    "references": {"type": list, "required": False},
}

LOCATION = {
    "posts": "./posts",
    "memos": "./memos",
}

client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com",
)

# region 读取文件


def get_folder_md_files(dir_path: str) -> list[str]:
    """获取目录的 Markdown 文件

    根据提供的目录路径，获取该目录下所有 Markdown 文件的路径。

    Args:
        dir_path (str): 目录路径
    Returns:
        files (list[str]): 包含所有 Markdown 文件路径的列表
    """
    files = []

    for f in os.listdir(dir_path):
        if f.endswith(".md"):
            files.append(os.path.join(dir_path, f))
    return files


def read_markdown_content(fi: str) -> list:
    """尝试读取文件 Frontmatter 和其内容

    根据提供的 Markdown 文件路径，获取该文件的 Frontmatter 和内容。

    Args:
        fi (str): Markdown 文件路径
    Returns:
        list: 包含 Markdown 文件内容和 Frontmatter 内容的列表
    """
    # 显示提示信息
    print(f"[INFO] 检查文件：{fi}")

    # 尝试读取文件内容，如果读取失败，返回的就只会是空列表
    try:
        with open(fi, "r", encoding="utf-8") as f:
            content = f.read()
    except FileNotFoundError:
        print(f"[ERROR] 文件不存在：{fi}")
        return []
    except PermissionError:
        print(f"[ERROR] 无权限读取文件：{fi}")
        return []
    except Exception as e:
        print(f"[ERROR] 读取文件时发生错误：{fi} - {e}")
        return []

    # 尝试解析 Frontmatter
    fm_content = {}
    fms, fme = 0, 0
    fms = content.startswith("---")
    try:
        if fms:
            fme = content.find("---", fms + 3)
            if fme != 0:
                fm_content = content[3:fme].strip()
                fm_content = yaml.safe_load(fm_content)
    except yaml.YAMLError as e:
        print(f"[ERROR] YAML 解析错误：{fi} - {e}")
        # YAML 解析失败时，创建一个空字典
        fm_content = {}

    # 当读取成功时，将正文和 Frontmatter 拆分开。

    article_content = content[fme + 3 : :]

    # 显示提示信息和返回结果
    if DisplayExactInfo:
        print(f"[INFO] 检查文件：{fi} Frontmatter 内容：\n {fm_content}")
    return [fm_content, article_content]


def read_markdown_metadata(fi: str) -> list:
    """获得文章的元数据

    Args:
        fi (file path): 文件输入路径

    Returns:
        metadata: 元数据
    """
    # 创建时间
    creation = os.path.getctime(fi)

    return [creation]


# endregion

# region 校验文件


def file_validate_frontmatter(frontmatter: dict, schema: dict) -> list[str]:
    """校验 Frontmatter

    必填检查 → 类型检查 → 空值检查 → 扩展规则
    不再拆分两个函数
    Args:
        frontmatter(dict): 字典
    """
    errors = []

    # 确保 frontmatter 是字典
    if not isinstance(frontmatter, dict):
        # 如果不是字典，返回所有必填字段的错误
        for field_name, rule in schema.items():
            if rule.get("required"):
                errors.append({field_name: "lost"})
        return errors

    for field_name, rule in schema.items():
        field_value = frontmatter.get(field_name)

        # 必填检查
        if field_value is None:
            if rule.get("required"):
                errors.append({field_name: "lost"})
            continue  # 没这个字段，后面不用查了

        # 类型检查
        expected_type = rule.get("type")
        if expected_type and type(field_value) is not expected_type:
            errors.append({field_name: "type"})
            continue  # 类型不对，后面也不用查了

        # 按类型做空值检查
        if isinstance(field_value, str) and not field_value.strip():
            errors.append({field_name: "empty_string"})
        elif isinstance(field_value, list) and len(field_value) == 0:
            errors.append({field_name: "empty_list"})

    return errors


def file_check(file_path: str):
    """检查 Markdown 文件的 Frontmatter

    根据提供的 Markdown 文件路径，检查该文件的 Frontmatter 是否符合要求，并执行补充。

    Args:
        file_name (str): Markdown 文件路径
    """
    # 读取文件内容和 Frontmatter
    content, fm = read_markdown_content(file_path)

    errors_dict = {}
    for error in file_validate_frontmatter(fm, SCHEMA):
        for field, error_type in error.items():
            errors_dict[field] = error_type


# endregion

# region 修复文件


def write_frontmatter():
    errors_dict = {}

    if errors_dict:
        print("[INFO] 执行 AI 辅助补充...")
        fm = ask_ai(errors_dict, fm, content)

        # 再次验证
        errors_dict = {}
        for error in file_validate_frontmatter(fm, SCHEMA):
            for field, error_type in error.items():
                errors_dict[field] = error_type

    # 保存更新后的 Frontmatter 到文件
    if fm:
        # 构建新的文件内容
        new_content = "---\n"
        for key, value in fm.items():
            if isinstance(value, datetime):
                # 格式化日期时间
                new_content += f"{key}: {value.isoformat()}\n"
            elif isinstance(value, list):
                # 格式化列表
                new_content += f"{key}:\n"
                for item in value:
                    new_content += f"  - {item}\n"
            else:
                # 其他类型，确保值是字符串且正确处理包含冒号的值
                value_str = str(value)
                # 如果值包含冒号或其他特殊字符，使用引号包围
                if any(char in value_str for char in [":", "#", "-", "@"]):
                    new_content += f"{key}: '{value_str}'\n"
                else:
                    new_content += f"{key}: {value_str}\n"
        new_content += "---\n"

        # 添加原文件内容（去掉旧的 Frontmatter）
        if content.startswith("---"):
            end_idx = content.find("---", 3)
            if end_idx != -1:
                new_content += content[end_idx + 3 :]
        else:
            new_content += content

        # 写入文件
        try:
            with open(file_name, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"[INFO] 文件已更新：{file_name}")
        except Exception as e:
            print(f"[ERROR] 写入文件失败：{e}")

    # 输出最终结果
    if not errors_dict:
        print("[INFO] Frontmatter 检查通过")
    else:
        print("[INFO] 仍有以下字段缺失：")
        for field, error_type in errors_dict.items():
            print(f"{field}: {error_type}")
    return


def extract_h1(content: str) -> str:
    """从 Markdown 内容中提取 H1 标题

    根据提供的 Markdown 内容，提取第一个 H1 标题。

    Args:
        content (str): Markdown 内容
    Returns:
        h1 (str): 第一个 H1 标题，如果不存在则返回 None
    """
    for line in content.split("\n"):
        if line.startswith("# "):
            return line[2:].strip()
    return ""


def auto_l1_fix(errors, fm, file_content, file_path):
    # 其实我在想既然lost，为什么不是用ai来补充呢。

    # title 缺失 → 从 H1 补
    if "title" in errors and errors["title"] == "lost":
        h1 = extract_h1(file_content)
        if h1:
            fm["title"] = h1
            print("[AUTO_FIX] title 从 H1 推断 ")

    # creation 缺失 → 用文件时间
    if "creation" in errors and errors["creation"] == "lost":
        fm["creation"] = datetime.fromtimestamp(os.path.getctime(file_path))
        print("[AUTO_FIX] creation 使用文件创建时间 ")

    # tags 是字符串 → 转 list
    if "tags" in fm and isinstance(fm["tags"], str):
        fm["tags"] = [t.strip() for t in fm["tags"].split(",") if t.strip()]
        print("[AUTO_FIX] tags 从字符串转为列表 ")

    # category 缺失 → 从文件路径或内容推断
    if "category" in errors and errors["category"] == "lost":
        # 尝试从文件路径推断
        file_name = os.path.basename(file_path)
        if file_name.startswith("T"):
            fm["category"] = "技术"
            print("[AUTO_FIX] category 从文件命名推断为技术 ")
        elif file_name.startswith("M"):
            fm["category"] = "随笔"
            print("[AUTO_FIX] category 从文件命名推断为随笔 ")

    # author 缺失 → 设置默认值
    if "author" in errors and errors["author"] == "lost":
        fm["author"] = "CILXRY"
        print("[AUTO_FIX] author 设置默认值")

    # draft 缺失 → 设置默认值为 False
    if "draft" in errors and errors["draft"] == "lost":
        fm["draft"] = False
        print("[AUTO_FIX] draft 设置默认值为 False ")

    # description 缺失 → 从内容中提取摘要
    if "description" in errors and errors["description"] == "lost":
        # 提取内容中的第一段非空文本作为摘要
        content_lines = file_content.split("\n")
        summary = ""
        for line in content_lines:
            line = line.strip()
            if line and not line.startswith("#") and not line.startswith("---"):
                summary = line
                break
        if summary:
            fm["description"] = summary
            print("[AUTO_FIX] description 从内容中提取摘要 ")

    # descGenAuthor 缺失 → 设置默认值
    if "descGenAuthor" in errors and errors["descGenAuthor"] == "lost":
        fm["descGenAuthor"] = "Auto"
        print("[AUTO_FIX] descGenAuthor 设置默认值为 Auto ")

    # descGenTime 缺失 → 设置为当前时间（字符串类型）
    if "descGenTime" in errors and errors["descGenTime"] == "lost":
        fm["descGenTime"] = datetime.now().isoformat()
        print("[AUTO_FIX] descGenTime 设置为当前时间 ")

    # references 缺失 → 从内容中的链接提取
    if "references" in errors and errors["references"] == "lost":
        import re

        # 提取内容中的所有链接
        links = re.findall(r"\[([^\]]+)\]\(([^\)]+)\)", file_content)
        if links:
            fm["references"] = [link[1] for link in links]
            print("[AUTO_FIX] references 从内容中的链接提取 ")

    # 空字符串 → 删除
    for k in list(fm.keys()):
        if isinstance(fm[k], str) and not fm[k].strip():
            del fm[k]
            print(f"[AUTO_FIX] 删除空字段 {k}")

    return fm


def ask_ai_generation(article, want, client: OpenAI):
    messages: list[ChatCompletionMessageParam] = [
        {
            "role": "system",
            "content": "你是专业的Markdown文档分析工具，负责根据文档内容补充缺失的Frontmatter字段。请根据用户给出的文档的整体内容，生成准确的字段值。",
        },
        {"role": "user", "content": f"文章内容：{article}"},
        {"role": "user", "content": f"{SCHEMA.get(want, {}).get('prompt')}"},
    ]

    response = client.chat.completions.create(
        model="deepseek-v4-flash",
        messages=messages,
        stream=False,
        extra_body={"thinking": {"type": "disabled"}},
    )

    responseContent = (
        response.choices[0].message.content.strip()
        if response.choices[0].message.content
        else "AI returns None"
    )
    return responseContent


# endregion

# region 主入口


def checkDir(dir_path: str):
    """检查目录下的所有 Markdown 文件的 Frontmatter

    根据提供的目录路径，检查该目录下所有 Markdown 文件的 Frontmatter 是否符合要求。

    Args:
        dir_path (str): 目录路径
    """
    for file in get_folder_md_files(dir_path=dir_path):
        print("\n")
        file_check(file)


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="CILXRY 纪事小栈文章校验", epilog="CILXRY"
    )

    parser.add_argument("path", help="需要检测的目录")
    parser.add_argument(
        "-c", "--check", "--check-only", action="store_true", help="仅检查，不进行修复"
    )
    parser.add_argument("-r", "--repair", action="store_true", help="使用AI进行修复")
    parser.add_argument(
        "-cr", "--checkrepair", action="store_true", help="就是执行-c之后执行-r"
    )

    return parser.parse_args()


def main():
    args = parse_arguments()

    if args.check or args.checkrepair:
        checkDir(args.path)

    if args.repair or args.checkrepair:
        checkDir(args.path)


if __name__ == "__main__":
    main()


# checkDir("cilxry-markdown-pages\\posts")
