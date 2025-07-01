# dva-cli

`dva-cli` 是 `dva.js` 的命令行工具，旨在简化 dva.js 项目的创建和开发流程。它提供了多种功能来帮助开发者快速搭建项目结构、生成代码模板以及执行其他常见的开发任务。使用 `dva-cli` 可以显著提高开发效率，并确保遵循最佳实践。

## 主要功能

1. **项目初始化**：通过简单的命令快速创建一个新的 dva.js 项目。
2. **代码生成**：自动生成常用的代码模板，如模型（models）、页面（pages）、服务（services）等。
3. **插件管理**：支持安装和管理各种插件，扩展项目的功能。
4. **脚手架工具**：提供了一系列的脚手架工具来辅助开发，例如启动开发服务器、构建生产环境代码等。

## 安装 dva-cli

你可以通过 npm 或 yarn 全局安装 `dva-cli`：

```bash
npm install -g dva-cli
# 或者
yarn global add dva-cli
```

## 使用 dva-cli 创建新项目

### 创建新项目

使用 `dva new` 命令可以快速创建一个新的 dva.js 项目：

```bash
dva new my-app
cd my-app
npm start
```

这将：

- 创建一个基础的 dva.js 项目结构。
- 自动安装所需的依赖项。
- 启动开发服务器，默认情况下访问 `http://localhost:8000`。

### 项目结构

`dva-cli` 创建的新项目会有一个标准的目录结构，如下所示：

```
my-app/
├── config/            # 配置文件目录
├── mock/              # Mock 数据目录
├── public/            # 公共资源目录
├── src/
│   ├── assets/        # 资源文件目录
│   ├── components/    # 可复用组件目录
│   ├── layouts/       # 页面布局目录
│   ├── models/        # Dva model 文件目录
│   ├── pages/         # 页面组件目录
│   ├── services/      # API 请求服务目录
│   └── utils/         # 实用工具函数目录
├── .umirc.ts          # 主配置文件 (如果使用 Umi)
└── package.json       # 依赖管理文件
```

## 代码生成

`dva-cli` 提供了多个子命令来生成常用代码模板，帮助你更快速地开发应用。

### 生成模型（Model）

```bash
dva g model example
```

这将在 `src/models/` 目录下创建一个名为 `example.js` 的模型文件。

### 生成页面（Page）

```bash
dva g page home
```

这将在 `src/pages/` 目录下创建一个名为 `Home.jsx` 的页面文件，并在路由配置中添加相应的路由条目。

### 生成服务（Service）

```bash
dva g service api
```

这将在 `src/services/` 目录下创建一个名为 `api.js` 的服务文件，用于封装 API 请求逻辑。

## 插件管理

`dva-cli` 支持通过插件系统扩展其功能。你可以使用 `dva-cli` 来安装和管理这些插件。

### 安装插件

```bash
dva plugin install <plugin-name>
```

例如，安装 `dva-loading` 插件：

```bash
dva plugin install dva-loading
```

### 列出已安装插件

```bash
dva plugin list
```

## 开发命令

`dva-cli` 提供了一些常用的开发命令来帮助你启动开发服务器、构建生产环境代码等。

### 启动开发服务器

```bash
npm start
# 或者
yarn start
```

### 构建生产环境代码

```bash
npm run build
# 或者
yarn build
```

## 总结

`dva-cli` 是一个非常有用的工具，可以帮助开发者快速搭建 dva.js 项目，并通过代码生成等功能提高开发效率。它不仅简化了项目的初始化过程，还提供了丰富的命令来管理和扩展项目功能。如果你正在使用 `dva.js` 进行开发，强烈建议使用 `dva-cli` 来提升开发体验。
