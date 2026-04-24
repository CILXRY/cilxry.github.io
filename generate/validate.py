'''
CILXRY 纪事小栈文章校验

本模块用于纪事小栈内的文章 Frontmatter 校验的修复。
依赖：当前暂无第三方依赖
作者：CILXRY
注释由 AI 生成
'''
from datetime import datetime
import ast
import os
import yaml
DisplayExactInfo: bool = False

SCHEMA = {
  "title": {"type": str, "required": True},
  "category": {"type": str, "required": False},
  "tags": {"type": list, "required": False},
  "creation": {"type": datetime, "required": True},
}

LOCATION= {
  "posts": "./posts",
  "memos": "./memos",
}

def get_folder_md_files(dir_path: str) -> list[str]:
  '''获取目录的Markdown文件

  根据提供的目录路径，获取该目录下所有Markdown文件的路径。

  Args:
    dir_path (str): 目录路径
  Returns:
    files (list[str]): 包含所有Markdown文件路径的列表
  '''
  files =[]

  for f in os.listdir(dir_path):
    if f.endswith(".md"):
      files.append(os.path.join(dir_path,f))
  return files

def read_markdown_file(fi: str) -> str:
  '''获取Markdown文件的Frontmatter

  根据提供的Markdown文件路径，获取该文件的Frontmatter内容。

  Args:
    fi (str): Markdown文件路径
  Returns:
    content (str): Markdown文件的内容
  '''
  if DisplayExactInfo:
    print(f"[INFO] 检查文件：{fi}")
  with open(fi, "r", encoding="utf-8") as f:
    content = f.read()
  return content

def get_frontmatter(content):
  '''获取Markdown文件的Frontmatter

  根据提供的Markdown文件内容，获取该文件的Frontmatter内容。

  Args:
    content (str): Markdown文件内容
  Returns:
    Markdown文件的Frontmatter内容
  '''
  beginfm = content.find("---")
  endfm = content.find("---", beginfm + 3)
  return content[beginfm + 4 : endfm - 1]


def convert_format(v: str) -> bool | str | list | tuple | datetime:
  '''转换字符串为Python数据类型

  根据提供的字符串，尝试将其转换为Python数据类型。

  支持的类型包括：
  - 字符串
  - 布尔值
  - 列表
  - 元组
  - 日期时间

  Args:
    v (str): 输入的字符串
  Returns:
    转换后的Python数据类型
  '''
  if v == "true":
    return True
  elif v == "false":
    return False
  elif "[" in v and "]" in v:
    try:
      result = ast.literal_eval(v)
      # 确保解析结果是列表或元组类型
      if isinstance(result, (list, tuple)):
        return result
    except (ValueError, SyntaxError):
      pass
    return v
  elif "T" in v and len(v) >= 19:
    try:
      return datetime.fromisoformat(v)
    except (ValueError, TypeError):
      pass
    return v
  else:
    return v


def parse_frontmatter(fm: str) -> dict[str, str]:
  '''解析Markdown文件的Frontmatter

  根据提供的Markdown文件的Frontmatter内容，解析出其中的键值对。

  Args:
    fm (str): Markdown文件的Frontmatter内容
  Returns:
    fmd (dict[str, str]): 包含所有键值对的字典
  '''

  fmd = {}
  ls = fm.split("\n")
  for item in ls:
    mark = item.find(":")
    if mark != -1:
      k = item[0:mark]
      v = convert_format(item[mark + 1 : :].strip(" ").strip('"'))
      fmd[k] = v
  return fmd

def extract_h1(content):
    for line in content.split("\n"):
        if line.startswith("# "):
            return line[2:].strip()
    return None

def autoFixFm(fmd, file_content, file_path):
    # title 缺失 → 从 H1 补
    if "title" not in fmd:
        h1 = extract_h1(file_content)
        if h1:
            fmd["title"] = h1
            print("[自动修复] title 从 H1 推断")

    # creation 缺失 → 用文件时间
    if "creation" not in fmd:
        fmd["creation"] = datetime.fromtimestamp(os.path.getctime(file_path))
        print("[自动修复] creation 使用文件创建时间")

    # tags 是字符串 → 转 list
    if "tags" in fmd and isinstance(fmd["tags"], str):
        fmd["tags"] = [t.strip() for t in fmd["tags"].split(",") if t.strip()]
        print("[自动修复] tags 从字符串转为列表")

    # 空字符串 → 删除
    for k in list(fmd.keys()):
        if isinstance(fmd[k], str) and not fmd[k].strip():
            del fmd[k]
            print(f"[自动修复] 删除空字段 {k}")

    return fmd


def check_frontmatter_filed(filedName: str, filedValue, rule: dict[str, str]) -> list[str]:
  '''检查Markdown文件的Frontmatter字段

  根据提供的字段名称、字段值和字段规则，检查该字段是否符合符合要求。

  Args:
    filedName (str): 字段名称
    filedValue (str): 字段值
    rule (dict[str, str]): 字段规则
  Returns:
    errors (list[str]): 包含所有错误信息的列表
  '''

  errors = []
  # 确定字段存不存在
  if filedValue is None:
    if rule.get("required"):
      errors.append(f" 缺少 {filedName}")
    return errors

  # 确定字段类型和规则是否相同
  if rule.get("type") != type(filedValue):
    errors.append(
      f"{filedName} 的类型不对，需要 {rule.get("type")} 类型，传入 {type(filedValue)} 类型 "
    )
    return errors

  # 根据字段类型确定值
  if rule.get("type") == str:
    if not filedValue.strip():
      errors.append(f" 为空 {filedName}")
  elif rule.get("type") == datetime:
    pass
  elif rule.get("type") == list:
    if len(filedValue) == 0:
      errors.append(f"{filedName} 不能为空列表 ")
  return errors


def check_frontmatter_content(fmd: dict[str, str], rules: dict[str, dict[str, str]]) -> list[str]:
  '''检查Markdown文件的Frontmatter

  根据提供的Markdown文件的Frontmatter内容和规则，检查该文件的Frontmatter是否符合要求。

  Args:
    fmd (dict[str, str]): 包含所有键值对的字典
    rules (dict[str, dict[str, str]]): 包含所有字段规则的字典
  Returns:
    errors (list[str]): 包含所有错误信息的列表
  '''
  errors = []
  for rule in rules.items():
    rule_name = rule[0]
    errors.extend(check_frontmatter_filed(rule_name, fmd.get(rule_name), rules[rule_name]))
  return errors


def checkFile(file_name: str):
  '''检查Markdown文件的Frontmatter

  根据提供的Markdown文件路径，检查该文件的Frontmatter是否符合要求。

  Args:
    file_name (str): Markdown文件路径
  '''
  for e in check_frontmatter_content(parse_frontmatter(get_frontmatter(read_markdown_file(file_name))), SCHEMA):
    print(e)

def checkDir(dir_path: str):
  '''检查目录下的所有Markdown文件的Frontmatter

  根据提供的目录路径，检查该目录下所有Markdown文件的Frontmatter是否符合要求。

  Args:
    dir_path (str): 目录路径
  '''
  for file in get_folder_md_files(dir_path=dir_path):
    print(f"\n")
    checkFile(file)

checkDir("c:\\users\\cilxry\\cilxry.github.io\\src\\content\\posts\\Tech")
