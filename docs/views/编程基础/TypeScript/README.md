# TypeScript

在使用 VitePress 时，如果你倾向于使用 TypeScript 来配置你的网站设置，那么你需要确保项目中正确设置了 TypeScript，并且按照 TypeScript 的方式来定义配置。以下是如何使用 TypeScript 配置 VitePress 菜单的具体步骤。

### 步骤 1: 确保安装了必要的依赖

首先，确保你已经安装了 `@types/node` 和 `typescript`。如果还没有安装，可以通过 npm 或 yarn 安装：

```bash
npm install --save-dev typescript @types/node
# 或者使用 yarn
yarn add --dev typescript @types/node
```

### 步骤 2: 创建或编辑配置文件

创建或编辑 `.vitepress/config.ts` 文件。这是 VitePress 的 TypeScript 配置文件。

### 步骤 3: 导入并使用 `defineConfig`

VitePress 提供了一个帮助函数 `defineConfig`，它可以帮助你在 TypeScript 中定义配置而不需要手动指定类型。你可以从 `vitepress` 包中导入这个函数。

### 步骤 4: 编写配置代码

下面是一个完整的示例，展示了如何用 TypeScript 来配置 VitePress 的菜单：

```typescript
// .vitepress/config.ts
import { defineConfig } from "vitepress";

export default defineConfig({
  title: "我的文档", // 网站标题
  description: "这是我的个人技术文档网站", // 网站描述
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      { text: "指南", link: "/guide/" },
      { text: "API", link: "/api/" },
      { text: "关于", link: "/about/" },
    ],
    sidebar: {
      "/guide/": [
        {
          text: "基础",
          items: [
            { text: "入门", link: "/guide/getting-started" },
            { text: "安装", link: "/guide/installation" },
          ],
        },
        {
          text: "进阶",
          collapsed: true, // 默认折叠
          items: [
            { text: "高级用法", link: "/guide/advanced-usage" },
            { text: "最佳实践", link: "/guide/best-practices" },
          ],
        },
      ],
      "/api/": [
        {
          text: "API 参考",
          items: [
            { text: "API 概览", link: "/api/overview" },
            { text: "API 细节", link: "/api/details" },
          ],
        },
      ],
    },
  },
});
```

### 步骤 5: 使用自定义类型（可选）

如果你想为配置添加更具体的类型定义，可以扩展 VitePress 的默认类型。例如，如果你想要添加一个自定义字段到主题配置中，你可以这样做：

```typescript
// 在 .vitepress/config.ts 文件顶部添加类型声明
declare module "@vuepress/plugin-theme-data/lib/client" {
  interface ThemeData {
    customField?: string;
  }
}
```

然后你可以在 `themeConfig` 中使用 `customField`。

### 步骤 6: 重启开发服务器

保存更改后，请记得重新启动 VitePress 开发服务器以应用新的配置。

通过以上步骤，你应该能够成功地使用 TypeScript 来配置 VitePress 的菜单和其他设置。这不仅可以让配置更加类型安全，还可以利用 TypeScript 的智能感知和编译时检查来减少错误。
