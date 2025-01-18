# Umi.js

`Umi.js` 是一个由蚂蚁金服推出的企业级 react 应用框架，旨在简化前端开发流程，提供开箱即用的配置和丰富的插件生态系统。它基于 `React` 和 `dva`（一个基于 `redux`、`redux-saga` 和 `dva-loading` 的数据流方案），并且支持按需加载、路由配置、国际化、代理等特性，使得开发者可以专注于业务逻辑的实现。

## Umi.js 的主要特点

1. **开箱即用**：提供了许多预配置的功能，如热更新、代码分割、CSS Modules 等，减少了手动配置的时间。
2. **路由系统**：内置强大的路由功能，支持静态路由和动态路由，以及页面级懒加载。
3. **插件机制**：通过插件系统扩展功能，社区提供了大量的官方和第三方插件，涵盖了从开发到部署的各种需求。
4. **多页应用支持**：除了单页应用（SPA），也支持多页应用（MPA）的开发。
5. **国际化**：内置对 i18n 的支持，方便进行多语言开发。
6. **API Proxy**：内置了代理服务器，便于在开发环境中模拟 API 请求。
7. **构建优化**：内置 Tree Shaking、Code Splitting 等优化措施，提高打包效率和性能。
8. **TypeScript 支持**：良好的 TypeScript 集成，提供更严格的类型检查和支持。

## 安装和使用 Umi.js

### 创建新项目

你可以通过 `umi` CLI 快速创建一个新的 Umi.js 项目：

```bash
npm install -g umi
umi create my-app
cd my-app
npm start
```

这将创建一个基础的 Umi.js 项目结构，并启动开发服务器。

### 项目结构

一个典型的 Umi.js 项目结构如下：

```
my-app/
├── config/            # 配置文件目录
├── mock/              # Mock 数据目录
├── pages/             # 页面组件目录
│   ├── .umi/          # 编译输出目录 (自动生成)
│   └── index.jsx      # 首页组件
├── public/            # 公共资源目录
├── src/               # 源代码目录
│   ├── assets/        # 资源文件目录
│   ├── components/    # 可复用组件目录
│   └── models/        # Dva model 文件目录
├── .umirc.ts          # 主配置文件
└── package.json       # 依赖管理文件
```

### 配置

Umi.js 提供了一个灵活的配置系统，默认情况下可以通过 `.umirc.ts` 或 `config/config.ts` 文件来进行配置。以下是一些常用的配置项：

- **`routes`**：定义应用的路由配置。
- **`proxy`**：设置 API 代理。
- **`plugins`**：添加插件。
- **`theme`**：定制主题样式。
- **`exportStatic`**：配置静态化输出。

例如，配置一个简单的路由：

```typescript
// .umirc.ts
export default {
  routes: [
    { path: "/", component: "index" },
    { path: "/users", component: "users" },
    { path: "/users/:id", component: "userDetail" },
  ],
};
```

### 插件

Umi.js 的插件机制非常强大，允许你轻松地扩展功能。你可以安装官方或第三方插件，或者自己编写插件来满足特定需求。

例如，安装并使用 `umi-plugin-react` 插件：

```bash
npm install umi-plugin-react --save
```

然后在配置文件中启用它：

```typescript
export default {
  plugins: [
    [
      "umi-plugin-react",
      {
        antd: true, // 使用 Ant Design
        dva: true, // 使用 Dva.js
        dynamicImport: {}, // 按需加载
        title: "My App",
        dll: false,
        pwa: false,
        hd: false,
      },
    ],
  ],
};
```

## 示例：使用 Umi.js 创建一个多语言应用

### 添加国际化支持

首先，在 `package.json` 中添加 `umi-plugin-react` 并启用 i18n：

```json
{
  "dependencies": {
    "umi-plugin-react": "^1.0.0"
  }
}
```

然后在 `.umirc.ts` 中配置：

```typescript
export default {
  plugins: [
    [
      "umi-plugin-react",
      {
        locale: {
          enable: true,
          default: "en-US",
          baseNavigator: true,
        },
      },
    ],
  ],
};
```

### 创建翻译文件

在 `locales` 目录下创建不同语言的翻译文件：

```
locales/
├── en-US.ts
└── zh-CN.ts
```

例如，`en-US.ts` 文件内容：

```typescript
export default {
  "menu.home": "Home",
  "menu.users": "Users",
};
```

### 使用翻译

在组件中使用 `useIntl` hook 或者 `FormattedMessage` 组件来显示翻译后的文本：

```jsx
import React from "react";
import { useIntl } from "umi";

const HomePage = () => {
  const intl = useIntl();
  return (
    <div>
      <h1>{intl.formatMessage({ id: "menu.home" })}</h1>
    </div>
  );
};

export default HomePage;
```

## 总结

`Umi.js` 是一个功能丰富且易于使用的 React 应用框架，特别适合企业级应用开发。它不仅提供了开箱即用的配置，还拥有强大的插件生态，帮助开发者快速搭建高效的应用程序。如果你正在寻找一种现代化的方式来构建 React 应用，`Umi.js` 是一个非常好的选择。
