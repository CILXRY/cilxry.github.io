# GitHub Actions 自动部署到服务器

## 概述

当 Push 或 PR 到 `dev` 分支时，自动构建并部署到服务器。

## 配置步骤

### 1. 生成 SSH 密钥

```bash
# 在本地生成SSH密钥（不要设置密码phrase）
ssh-keygen -t ed25519 -C "github-actions-deploy" -f github_actions_key
```

### 2. 将公钥添加到服务器

```bash
# 将公钥添加到服务器的 ~/.ssh/authorized_keys
cat github_actions_key.pub | ssh -p 22 ubuntu@192.168.1.100 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 3. 在 GitHub 仓库中添加 Secrets

进入 `Settings > Secrets and variables > Actions`，添加以下 Secrets：

| Secret 名称 | 值 |
|-----------|-----|
| `SERVER_HOST` | `192.168.1.100` |
| `SERVER_USER` | `ubuntu` |
| `SERVER_PATH` | `/opt/ciiayy/site/dev` |
| `SSH_PRIVATE_KEY` | 私钥内容（`github_actions_key` 文件的全部内容） |

### 4. 验证部署

推送到 dev 分支：

```bash
git checkout dev
git add .
git commit -m "feat: add deploy workflow"
git push origin dev
```

然后在 GitHub 仓库的 Actions 标签页中查看部署状态。

## 工作流程

1. **构建阶段**：安装依赖，运行 `pnpm build`
2. **部署阶段**：通过 SSH + rsync 将 `dist/` 目录同步到服务器

## 注意事项

- 确保服务器的 SSH 配置允许公钥认证
- 服务器目标目录需要有写入权限
- 部署时会先删除远程目录中的旧文件（`--delete` 参数）