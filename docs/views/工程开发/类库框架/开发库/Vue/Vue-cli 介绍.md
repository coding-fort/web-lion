# Vue-cli 介绍

`vue-cli`（Vue Command Line Interface）是 Vue.js 的官方命令行工具，用于快速搭建和管理 Vue.js 项目。它提供了脚手架功能来创建新的 Vue 项目，并且支持插件系统以扩展其功能。`vue-cli` 是一个非常强大且灵活的工具，适合各种规模的应用程序开发。

## 安装 Vue CLI

首先，确保你已经安装了 Node.js 和 npm。然后可以通过 npm 全局安装 `@vue/cli`：

```bash
npm install -g @vue/cli
```

如果你之前安装过旧版本的 `vue-cli`（如 `vue-cli` 2.x），建议先卸载旧版本：

```bash
npm uninstall vue-cli -g
```

## 创建新项目

使用 `vue create` 命令可以快速创建一个新的 Vue 项目。这将引导你完成一系列配置选项，例如选择预设、手动选择特性等。

```bash
vue create my-project
```

在提示中，你可以选择默认预设或手动选择特性，比如：

- Babel
- TypeScript
- Progressive Web App (PWA) support
- Router
- Vuex
- CSS Pre-processors
- Linter / Formatter
- Unit Testing
- E2E Testing

对于简单的项目，可以直接选择默认预设；而对于更复杂的项目，可以选择手动配置来满足特定需求。

## 使用图形界面创建项目

Vue CLI 还提供了一个图形用户界面 (GUI)，使得创建和管理项目更加直观。你可以通过以下命令启动 GUI：

```bash
vue ui
```

这将在默认浏览器中打开一个 Web 界面，允许你浏览现有项目、创建新项目、运行构建任务等。

## 添加和管理插件

Vue CLI 支持丰富的插件生态系统，这些插件可以帮助你添加额外的功能或自定义工作流。要安装一个插件，可以使用 `vue add` 命令：

```bash
cd my-project
vue add <plugin-name>
```

例如，如果你想添加 Vue Router 插件：

```bash
vue add router
```

同样地，你可以移除不再需要的插件：

```bash
vue remove <plugin-name>
```

## 开发服务器

创建好项目后，进入项目目录并启动开发服务器：

```bash
cd my-project
npm run serve
```

这会启动一个热重载的本地开发服务器，默认监听地址为 `http://localhost:8080`。你可以根据需要修改端口号和其他配置项。

## 构建项目

当你的应用开发完成并且准备部署时，可以使用以下命令进行构建：

```bash
npm run build
```

这会在项目的 `dist/` 目录下生成优化后的静态资源文件，可以直接上传到任何静态文件托管服务上。

## 配置与定制

Vue CLI 提供了多种方式来自定义项目的配置：

- **`vue.config.js`**：在项目根目录下创建一个 `vue.config.js` 文件，可以在这里覆盖默认配置。

  ```javascript
  module.exports = {
    publicPath: "./",
    outputDir: "dist",
    assetsDir: "static",
    lintOnSave: process.env.NODE_ENV !== "production",
    // 更多配置...
  };
  ```

- **环境变量**：通过 `.env`, `.env.development`, `.env.production` 等文件设置环境变量。所有以 `VUE_APP_` 开头的变量都可以在应用程序中访问。

- **Babel, ESLint, PostCSS 等配置**：可以在各自的配置文件中进行详细设置，如 `.babelrc`, `.eslintrc.js`, `postcss.config.js`。

## 使用模板

虽然 Vue CLI 3+ 已经废弃了传统的基于模板的项目创建方式，但仍然可以通过插件来实现类似的功能。例如，使用 `@vue/cli-init` 可以从 GitHub 上拉取特定仓库作为模板：

```bash
vue init webpack my-project
```

不过推荐直接使用 `vue create` 来创建新项目，因为它提供了更现代化的工作流和支持。

## 升级 Vue CLI

为了保持最新版本，可以定期升级 `@vue/cli`：

```bash
npm update -g @vue/cli
```

同时，也可以更新项目中的 Vue CLI 插件和服务：

```bash
vue upgrade
```

## 总结

`vue-cli` 是一个非常强大且易于使用的工具，它简化了 Vue.js 项目的创建和管理工作。通过内置的脚手架功能、丰富的插件生态以及灵活的配置选项，开发者可以快速构建出高质量的应用程序。如果你还有更多关于 `vue-cli` 的具体问题或需要进一步的帮助，请随时告诉我！
