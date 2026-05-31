---
name: deploy-github
description: 将项目部署到 GitHub Pages。处理国内网络环境下的 SSH 推送、Vite 项目 base path 配置、gh-pages 分支部署。
trigger: 用户要求部署到 GitHub、上传到 GitHub、发布到 GitHub Pages、推送到 GitHub 时触发。
---

# deploy-github Skill

## 环境约束

- **国内网络**，GitHub HTTPS (443) 被墙，**只能用 SSH**
- VPN: 极连云（TUN 模式），push 前确认 VPN 已开启
- SSH key 已配置：`~/.ssh/id_ed25519`，已添加到 GitHub (<your-github-username>)
- **绝对禁止使用 HTTPS remote**

## 检查清单（部署前逐项确认）

1. `git remote -v` 必须是 `git@github.com:<your-github-username>/<repo>.git`（SSH 格式）
2. VPN 已开启
3. 项目已构建，dist 目录存在
4. 若为新项目，GitHub 上仓库已创建
5. Vite 项目 `vite.config.js` 已设置 `base: '/<repo-name>/'`

## 首次部署流程

```bash
# 1. 初始化 git（若尚未 init）
cd <项目根目录>
git init
git add -A
git commit -m "init"

# 2. 配置 SSH remote + 推送源码
git remote add origin git@github.com:<your-github-username>/<repo-name>.git
git branch -M main
git push -u origin main

# 3. 构建
npm --prefix . run build
# 或: npm run build

# 4. 推送构建产物到 gh-pages 分支
TMPDIR="/tmp/gh-pages-deploy"
rm -rf "$TMPDIR" && mkdir -p "$TMPDIR"
cp -r dist/* "$TMPDIR/"
git -C "$TMPDIR" init
git -C "$TMPDIR" checkout -b gh-pages
git -C "$TMPDIR" add -A
git -C "$TMPDIR" commit -m "deploy"
git -C "$TMPDIR" remote add origin git@github.com:<your-github-username>/<repo-name>.git
git -C "$TMPDIR" push -f origin gh-pages
```

## 更新部署流程

```bash
# 1. 提交 + 推送源码
git add -A
git commit -m "<描述改动>"
git push

# 2. 构建
npm run build

# 3. 推送 gh-pages
TMPDIR="/tmp/gh-pages-deploy"
rm -rf "$TMPDIR" && mkdir -p "$TMPDIR"
cp -r dist/* "$TMPDIR/"
git -C "$TMPDIR" init
git -C "$TMPDIR" checkout -b gh-pages
git -C "$TMPDIR" add -A
git -C "$TMPDIR" commit -m "deploy"
git -C "$TMPDIR" remote add origin git@github.com:<your-github-username>/<repo-name>.git
git -C "$TMPDIR" push -f origin gh-pages
```

## 部署后

提醒用户去 `https://github.com/<your-github-username>/<repo-name>/settings/pages` 设置：
- Source: **Deploy from a branch**
- Branch: **gh-pages**, `/(root)`

网站地址：`https://<your-github-username>.github.io/<repo-name>/`

## 常见问题

| 问题 | 原因 | 解决 |
|------|------|------|
| `Host key verification failed` | GitHub 不在 known_hosts | `ssh-keyscan github.com >> ~/.ssh/known_hosts` |
| `Permission denied (publickey)` | SSH key 未添加或 VPN 未开 | 确认 VPN 开启，检查 `~/.ssh/id_ed25519.pub` 是否在 GitHub |
| `Couldn't connect to server` | HTTPS remote 或网络不通 | 改用 SSH remote，开 VPN |
| 部署后资源 404 | Vite base path 未设置 | `vite.config.js` 加 `base: '/<repo-name>/'` |
