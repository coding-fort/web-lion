# dva.js

`dva.js` 是一个基于 `redux`、`redux-saga` 和 `react-router` 的轻量级前端框架，由蚂蚁金服团队开发。它旨在简化 React 应用的开发过程，提供了一套开箱即用的最佳实践，使得开发者可以更专注于业务逻辑的实现。`dva.js` 通过集成这些库，提供了一个更加简洁和高效的开发体验。

## dva.js 的主要特点

1. **数据流方案**：内置了类似 Redux 的数据流机制，并使用 `redux-saga` 来处理副作用（如异步操作），提供了比传统 Redux 更简洁的 API。
2. **路由管理**：集成了 `react-router`，支持动态路由配置，简化了页面导航和 URL 管理。
3. **自动加载模型**：支持按需加载模型，优化了应用的初始加载时间。
4. **国际化支持**：内置 i18n 支持，方便进行多语言开发。
5. **热更新**：支持 Webpack 的热模块替换 (HMR)，提高了开发效率。
6. **插件系统**：拥有丰富的插件生态，可以通过安装插件扩展功能。
7. **TypeScript 支持**：良好的 TypeScript 集成，提供更严格的类型检查和支持。
8. **CLI 工具**：提供了命令行工具 `dva-cli`，用于快速创建项目和生成代码。

## 安装和使用 dva.js

### 创建新项目

你可以通过 `dva-cli` 快速创建一个新的 dva.js 项目：

```bash
npm install -g dva-cli
dva new my-app
cd my-app
npm start
```

这将创建一个基础的 dva.js 项目结构，并启动开发服务器。

### 项目结构

一个典型的 dva.js 项目结构如下：

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

## 核心概念

### Model

`dva.js` 中的核心概念是 `Model`，它是用来组织状态（state）、视图（view）和数据交互逻辑的地方。每个 `model` 包含以下属性：

- **namespace**：命名空间，用于区分不同的 model。
- **state**：当前的状态。
- **reducers**：纯函数，接收 action 并返回新的 state。
- **effects**：处理副作用（如异步操作）的函数，通常使用 `redux-saga`。
- **subscriptions**：监听某些事件并触发 effects 或 reducers。

#### 示例：创建一个简单的模型

```javascript
// src/models/example.js
export default {
  namespace: "example",

  state: {
    count: 0,
  },

  reducers: {
    increment(state) {
      return { ...state, count: state.count + 1 };
    },
    decrement(state) {
      return { ...state, count: state.count - 1 };
    },
  },

  effects: {
    *incrementAsync(action, { call, put }) {
      yield call(delay, 1000); // 模拟异步请求
      yield put({ type: "increment" });
    },
  },

  subscriptions: {
    setup({ history }) {
      // 监听 URL 变化或其他事件
    },
  },
};

function delay(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
```

### Router

`dva.js` 使用 `react-router` 进行路由管理，你可以在 `src/router.js` 中定义路由配置。

#### 示例：定义路由

```javascript
// src/router.js
import React from "react";
import dynamic from "dva/dynamic";

const Home = dynamic(() => import("./pages/Home"));
const About = dynamic(() => import("./pages/About"));

export default function Router({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </Router>
  );
}
```

### Service

`service` 用于封装 API 请求逻辑，使你的模型更加清晰和可维护。

#### 示例：创建一个 service

```javascript
// src/services/api.js
export async function fetchUser(id) {
  const response = await fetch(`/api/user/${id}`);
  return await response.json();
}
```

## 使用 Hooks

从 dva v2 开始，dva 支持使用 React Hooks 来访问 store 和 dispatch actions，这使得函数组件可以直接与 dva 的数据流集成。

#### 示例：在函数组件中使用 Hooks

```javascript
// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "dva";
import styles from "./Home.module.css";

function Home() {
  const dispatch = useDispatch();
  const count = useSelector((state) => state.example.count);

  useEffect(() => {
    dispatch({ type: "example/incrementAsync" });
  }, [dispatch]);

  return (
    <div className={styles.home}>
      <p>Count: {count}</p>
      <button onClick={() => dispatch({ type: "example/increment" })}>
        Increment
      </button>
      <button onClick={() => dispatch({ type: "example/decrement" })}>
        Decrement
      </button>
    </div>
  );
}

export default Home;
```

## 插件

dva 提供了丰富的插件来扩展其功能。你可以通过 `app.use()` 方法添加插件，或者直接安装官方或第三方插件。

#### 示例：添加插件

```javascript
// src/index.js
import dva from "dva";
import createLoading from "dva-loading";

const app = dva();

// 添加插件
app.use(createLoading());

// 加载模型
app.model(require("./models/example").default);

// 启动应用
app.start("#root");
```

## 总结

`dva.js` 是一个强大的前端框架，特别适合构建复杂的 React 应用程序。它不仅简化了状态管理和异步操作的处理，还提供了便捷的路由管理和国际化支持。如果你正在寻找一种现代化的方式来构建 React 应用，`dva.js` 是一个非常好的选择。
