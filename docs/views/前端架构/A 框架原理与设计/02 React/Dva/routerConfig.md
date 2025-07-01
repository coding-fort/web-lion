# routerConfig

在 `dva.js` 中，路由配置（`routerConfig`）是用于定义应用中页面组件与 URL 之间的映射关系。`dva.js` 内置了对 `react-router-dom` 的支持，使得你可以轻松地设置和管理路由。你可以通过多种方式来配置路由，包括使用 `app.router()` 方法或直接在项目中定义路由配置文件。

## 使用 `app.router()`

这是最常见的方式，通过 `app.router()` 方法来定义路由。你可以在创建 dva 应用实例后调用此方法，并传递一个函数作为参数，该函数接收 `history` 和 `app` 对象作为参数，并返回 React Router 的配置。

### 示例：基本路由配置

```javascript
import React from "react";
import { Router, Route, Switch } from "dva/router";
import Home from "./pages/Home";
import About from "./pages/About";

function routerConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Router>
  );
}

export default routerConfig;
```

然后，在你的应用入口文件中，你可以像这样加载路由配置：

```javascript
import dva from "dva";
import createHistory from "history/createBrowserHistory";
import routerConfig from "./router.config";

// 创建 dva 应用实例
const app = dva({
  history: createHistory(),
});

// 加载模型和其他配置
app.model(require("./models/example").default);

// 定义路由
app.router(routerConfig);

// 启动应用
app.start("#root");
```

## 动态路由配置

对于大型应用，静态路由配置可能会变得难以维护。因此，`dva.js` 支持动态加载路由，这可以通过 `dva/dynamic` 来实现。它允许你按需加载页面组件，从而优化初始加载时间和整体性能。

### 示例：动态路由配置

```javascript
import React from "react";
import { Router, Route, Switch } from "dva/router";
import dynamic from "dva/dynamic";

const Home = dynamic(() => import("./pages/Home"));
const About = dynamic(() => import("./pages/About"));

function routerConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Router>
  );
}

export default routerConfig;
```

## 使用 `@dva/core` 和 Umi

如果你使用的是 `@dva/core` 或者 Umi 框架，路由配置可以更加简洁。Umi 默认集成了路由功能，并且支持约定式路由配置，即根据文件结构自动生成路由表。

### 示例：Umi 约定式路由

假设你有以下文件结构：

```
src/
├── pages/
│   ├── home.jsx
│   └── about.jsx
└── ...
```

Umi 会自动将这些页面转换为路由规则：

- `/` 对应 `src/pages/home.jsx`
- `/about` 对应 `src/pages/about.jsx`

## 配置文件形式的路由

除了在代码中定义路由外，你还可以选择使用配置文件来管理路由。这种方式特别适合团队协作开发，因为所有路由信息都集中在一个地方，便于维护和审查。

### 示例：配置文件形式的路由

创建一个 `router.config.js` 文件，定义所有的路由规则：

```javascript
// router.config.js
export default [
  {
    path: "/",
    component: "../layouts/BasicLayout",
    routes: [
      { path: "/", component: "../pages/Home" },
      { path: "/about", component: "../pages/About" },
    ],
  },
];
```

然后在应用入口文件中引入并使用这个配置文件：

```javascript
import dva from "dva";
import createHistory from "history/createBrowserHistory";
import routerConfig from "./router.config";

const app = dva({
  history: createHistory(),
});

app.model(require("./models/example").default);

app.router(({ history }) => {
  const BasicLayout = require("../layouts/BasicLayout").default;
  return <BasicLayout history={history} routes={routerConfig} />;
});

app.start("#root");
```

## 总结

- **`app.router()`** 是最常用的配置路由的方法，适用于大多数场景。
- **动态路由** 可以提高应用的性能，特别是在大型应用中。
- **Umi** 提供了更简洁的路由配置方式，特别是其约定式路由功能，非常适合快速开发。
- **配置文件形式的路由** 有助于团队协作，所有路由信息集中管理，便于维护。
