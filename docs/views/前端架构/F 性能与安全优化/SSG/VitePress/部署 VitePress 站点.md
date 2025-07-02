# [部署 VitePress 站点](https://vitejs.cn/vitepress/en/)

以下指南基于一些前提：

- VitePress 站点位于项目的 `docs` 目录中。
- 你使用的是默认的生成输出目录 （`.vitepress/dist`）。
- VitePress 作为本地依赖项安装在项目中，并且你已在 `package.json` 中设置以下脚本：

```json
{
  "scripts": {
    "docs:build": "vitepress build docs",
    "docs:preview": "vitepress preview docs"
  }
}
```

## 本地构建与测试

1. 可以运行以下命令来构建文档：

```bash
npm run docs:build
```

2. 构建文档后，通过运行以下命令可以在本地预览它：

```bash
npm run docs:preview
```

`preview` 命令将启动一个本地静态 Web 服务 `http://localhost:4173`，该服务以 `.vitepress/dist` 作为源文件。这是检查生产版本在本地环境中是否正常的一种简单方法。

3. 可以通过传递 `--port` 作为参数来配置服务器的端口。

```json
{
  "scripts": {
    "docs:preview": "vitepress preview docs --port 8080"
  }
}
```

现在 `docs:preview` 方法将会在 `http://localhost:8080` 启动服务。

## 设定 public 根目录

默认情况下，我们假设站点将部署在域名 (`/`) 的根路径上。如果站点在子路径中提供服务，例如 `https://mywebsite.com/blog/`，则需要在 VitePress 配置中将 `base` 选项设置为 `'/blog/'`。

例：如果你使用的是 Github（或 GitLab）页面并部署到 `user.github.io/repo/`，请将 base 设置为 `/repo/`。

## GitHub Pages

1.在项目的 `.github/workflows` 目录中创建一个名为 `deploy.yml` 的文件，其中包含这样的内容：

```yaml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [main]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      # - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消注释
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm # 或 pnpm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: npm ci # 或 pnpm install / yarn install / bun install
      - name: Build with VitePress
        run: npm run docs:build # 或 pnpm docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

<bqw>
<prib>WARNING</prib><br/>
确保 <warnb>VitePress</warnb> 中的 base 选项配置正确。
</bqw>

2. 在存储库设置中的“Pages”菜单项下，选择“Build and deployment > Source > GitHub Actions”。

3. 将更改推送到 `main` 分支并等待 GitHub Action 工作流完成。你应该看到站点部署到 `https://<username>.github.io/[repository]/` 或 `https://<custom-domain>/`，这取决于你的设置。你的站点将在每次推送到 `main` 分支时自动部署。

## GitLab Pages

1. 如果你想部署到 `https://<username> .gitlab.io/<repository> /`，将 VitePress 配置中的 `outDir` 设置为 `../public`。将 `base` 选项配置为 `'/<repository>/'`。
2. 在项目的根目录中创建一个名为 `.gitlab-ci.yml` 的文件，其中包含以下内容。每当你更改内容时，这都会构建和部署你的站点：

```yaml
image: node:18
pages:
  cache:
    paths:
      - node_modules/
  script:
    # - apk add git # 如果你使用的是像 alpine 这样的小型 docker 镜像，并且启用了 lastUpdated，请取消注释
    - npm install
    - npm run docs:build
  artifacts:
    paths:
      - public
  only:
    - main
```
