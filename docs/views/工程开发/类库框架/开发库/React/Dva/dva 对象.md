# dva 对象

在 `dva.js` 中，核心对象是 `app`，它提供了对整个应用的控制和配置。通过 `app` 对象，你可以加载模型（models）、路由、插件，并启动应用程序。此外，`app` 还提供了一些实用的方法来简化开发流程，如访问全局状态、派发动作等。

## 创建 dva 应用

首先，你需要创建一个 `dva` 实例：

```javascript
import dva from "dva";

// 1. 创建 dva 应用实例
const app = dva();

// 2. 加载模型
app.model(require("./models/example").default);

// 3. 启动应用
app.start("#root");
```

## 核心 API

### `app.model(model)`

用于加载模型到应用中。模型是 dva 中组织状态管理和数据交互逻辑的地方。

#### 示例：加载模型

```javascript
app.model(require("./models/example").default);
```

### `app.router()`

用于定义应用的路由配置。你可以使用 `react-router` 的 API 来设置路由规则。

#### 示例：定义路由

```javascript
import React from "react";
import { Router, Route } from "dva/router";
import Home from "./pages/Home";
import About from "./pages/About";

app.router(({ history }) => (
  <Router history={history}>
    <Route path="/" exact component={Home} />
    <Route path="/about" component={About} />
  </Router>
));
```

### `app.start(container)`

启动应用并渲染根组件。你需要传递一个 DOM 容器选择器或元素作为参数。

#### 示例：启动应用

```javascript
app.start("#root");
```

### `app.use(plugin)`

用于注册插件，以扩展应用的功能。插件可以修改默认行为、添加新功能等。

#### 示例：使用插件

```javascript
import createLoading from "dva-loading";

app.use(createLoading());
```

### `app._store`

获取 Redux store。虽然直接操作 store 不是推荐的做法，但在某些情况下可能需要访问 store。

#### 示例：访问 store

```javascript
const store = app._store;
```

### `app.dispatch(action)`

用于手动派发 action。通常你不需要直接调用这个方法，因为你可以通过 `connect` 或 Hooks 在组件内部派发 actions。

#### 示例：手动派发 action

```javascript
app.dispatch({ type: "example/increment" });
```

## 模型 (Model)

模型是 dva 的核心概念之一，用来组织状态管理的数据流。每个模型包含以下属性：

- **namespace**：命名空间，确保不同模型之间的状态不会冲突。
- **state**：当前的状态。
- **reducers**：纯函数，接收 action 并返回新的 state。
- **effects**：处理副作用（如异步操作）的函数，通常使用 `redux-saga`。
- **subscriptions**：监听某些事件并触发 effects 或 reducers。

#### 示例：创建模型

```javascript
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

## 使用 Hooks 访问 `app`

从 dva v2 开始，支持使用 React Hooks 来访问 `app` 和 dispatch actions，这使得函数组件可以直接与 dva 的数据流集成。

#### 示例：在函数组件中使用 Hooks

```javascript
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

## 总结

`dva.js` 的 `app` 对象是整个应用的核心，提供了加载模型、定义路由、启动应用等功能。通过理解 `app` 对象及其提供的 API，你可以更好地掌握如何构建和管理基于 dva 的 React 应用程序。
