# NuxtJS

Nuxt.js 是一个基于 Vue.js 的高级框架，旨在简化和加速通用应用的开发。它不仅支持服务端渲染（SSR），还允许你创建静态生成的应用程序，并且提供了许多开箱即用的功能来优化开发体验。

## 核心概念与特性

- **自动路由**: 通过文件系统自动生成路由配置，无需手动定义。
- **中间件**: 允许在页面渲染之前或之后执行逻辑，比如身份验证、日志记录等。
- **异步数据处理**: 使用 `asyncData` 和 `fetch` 方法，在服务器端或客户端获取数据。
- **Meta 标签管理**: 简化 SEO 相关的 meta 标签设置。
- **布局(Layouts)**: 定义多个布局，以便不同的页面可以共享相同的结构。
- **插件机制**: 支持集成第三方 Vue 插件，以扩展功能。
- **静态站点生成**: 可以将应用程序编译为静态 HTML 文件，适合内容型网站。

## 脚手架安装

要开始使用 Nuxt.js，首先需要安装 `create-nuxt-app` 工具：

```bash
npx create-nuxt-app <project-name>
```

或者使用 Yarn：

```bash
yarn create nuxt-app <project-name>
```

这个命令会引导你完成一系列选项的选择，包括项目名称、UI 框架、服务器框架等。

## 项目结构

典型的 Nuxt.js 项目结构如下：

```
- assets/       # 存放未编译的资源，如 SCSS 或 JavaScript
- components/   # Vue 组件
- layouts/      # 应用布局
- middleware/   # 中间件
- pages/        # 页面视图，根据此目录自动生成路由
- plugins/      # Vue 插件
- static/       # 静态文件，直接复制到输出目录
- store/        # Vuex 状态管理
- nuxt.config.js # Nuxt 配置文件
- package.json  # npm 包信息及脚本
```

## 配置文件详解

**nuxt.config.js**

这是项目的主配置文件，包含了几乎所有可定制的配置项。以下是一些关键配置：

- **head**: 设置 `<head>` 标签内的内容，例如标题、meta 标签等。

  ```javascript
  head: {
    title: 'My Application',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  }
  ```

- **loading**: 自定义加载指示器或禁用默认加载指示器。

- **modules**: 引入第三方模块以扩展功能，如 `@nuxtjs/axios`。

- **buildModules**: 开发环境使用的模块，不会包含在生产构建中。

- **build**: 自定义 Webpack 构建配置，允许对构建过程进行深度定制。

  ```javascript
  build: {
    extend(config, ctx) {
      // 修改 webpack config
    }
  }
  ```

## 进阶功能

- **API Routes**: 从 Nuxt 2.13 开始，你可以创建 API 路由，用于提供后端服务。
- **Content Module**: Nuxt Content 模块允许你把 Nuxt.js 当作一个 CMS 来使用，非常适合博客或文档类网站。
- **PWA 支持**: 通过简单的配置即可将你的应用转变为渐进式 Web 应用(PWA)。

Nuxt.js 提供了强大的工具集，使得开发者能够快速构建出高效、可维护的 Vue.js 应用程序。
