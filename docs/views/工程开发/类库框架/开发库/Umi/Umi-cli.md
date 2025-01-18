# Umi 脚手架

`Umi.js` 脚手架（scaffolding）是 `Umi.js` 提供的一个强大的工具，用于快速创建和初始化项目结构。它不仅简化了项目的初始设置过程，还提供了一系列的命令来帮助开发者进行日常开发任务，如启动开发服务器、构建生产版本等。以下是关于如何使用 `Umi.js` 脚手架的详细介绍。

## 安装 Umi.js

首先，你需要确保已经安装了 Node.js 和 npm。然后可以通过以下命令全局安装 `@umijs/create-umi` 工具：

```bash
npm install -g @umijs/create-umi
```

> 注意：如果你更倾向于使用 npx 来避免全局安装，可以在每次创建新项目时使用 `npx @umijs/create-umi`。

## 创建新项目

使用 `@umijs/create-umi` 工具可以快速创建一个新的 `Umi.js` 项目。你可以选择不同的模板来初始化项目，这些模板包含了不同功能的预配置，例如集成 `dva` 或者使用 TypeScript。

### 使用默认模板创建项目

```bash
npx @umijs/create-umi my-app
cd my-app
npm start
```

这将创建一个基于默认模板的新项目，并启动开发服务器。

### 使用特定模板创建项目

如果你想使用带有特定功能的模板（例如包含 `dva` 的模板），可以在创建项目时指定 `--template` 参数：

```bash
npx @umijs/create-umi my-app --template=dva
cd my-app
npm start
```

常见的模板包括：

- `default`：默认模板，适合大多数 Web 应用。
- `dva`：包含 `dva` 数据流方案，适合需要状态管理的应用。
- `typescript`：支持 TypeScript 的模板。
- `block`：基于 `Block` 系统的模板，方便组件化开发。

## 项目结构

一旦你创建了一个新项目，`Umi.js` 会为你生成一个基本的文件和目录结构。典型的项目结构如下：

```
my-app/
├── config/                  # 配置文件夹
│   └── config.ts            # 主配置文件
├── mock/                    # Mock 数据文件夹
├── pages/                   # 页面组件文件夹
│   └── index.jsx            # 默认首页组件
├── public/                  # 静态资源文件夹
│   └── favicon.ico          # 网站图标
├── src/                     # 源代码文件夹
│   ├── assets/              # 静态资源（图片、字体等）
│   ├── components/          # 可复用的 UI 组件
│   ├── layouts/             # 布局组件
│   ├── models/              # dva 模型文件夹
│   ├── services/            # API 服务文件夹
│   ├── utils/               # 实用工具函数
│   └── global.less          # 全局样式文件
├── .umirc.js                # 项目配置文件（可选）
└── package.json             # 依赖管理和脚本命令
```

## 开发命令

`Umi.js` 提供了一套标准的 npm 脚本来简化开发流程。这些命令通常定义在 `package.json` 文件中，可以直接通过 `npm run <command>` 来执行。

### 启动开发服务器

```bash
npm start
```

这将在本地启动一个热重载的开发服务器，默认监听端口 8000。

### 构建生产版本

```bash
npm run build
```

这将根据配置编译项目为生产环境优化后的静态资源文件，输出到 `dist` 目录下。

### 运行测试

如果项目中有测试文件（通常以 `.test.js` 结尾），你可以使用以下命令来运行测试：

```bash
npm test
```

### 清理缓存

有时你可能需要清理 Webpack 缓存或清除临时文件。可以使用以下命令：

```bash
npm run clean
```

## 插件与扩展

`Umi.js` 支持丰富的插件生态系统，允许你通过安装和配置插件来扩展框架的功能。例如，`umi-plugin-react` 提供了许多 React 相关的优化选项，如按需加载、路由懒加载等。

### 添加插件

你可以在 `.umirc.js` 或 `config/config.js` 文件中添加插件：

```javascript
export default {
  plugins: [
    [
      "umi-plugin-react",
      {
        antd: true,
        dva: true,
        dynamicImport: { loadingComponent: "./components/PageLoading" },
      },
    ],
  ],
};
```

### 安装插件

```bash
npm install umi-plugin-react --save-dev
```

## 总结

`Umi.js` 脚手架提供了便捷的工具链来帮助开发者快速搭建和管理现代 Web 应用程序。从创建新项目到配置开发环境，再到日常开发任务的自动化，`Umi.js` 都有着出色的支持。通过合理利用其提供的约定和工具，你可以显著提高开发效率并构建出高质量的应用。
