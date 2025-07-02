# createStore

`createStore` 是 Redux 中用于创建 store 的函数。这个 store 持有应用的整个状态树，并提供了一些方法来访问状态、分发（dispatch）actions 和注册监听器。在现代的 Redux 应用中，通常会结合 `configureStore`（来自 `@reduxjs/toolkit`）或使用增强器（enhancers）和中间件来配置更复杂的 store 设置。不过，理解 `createStore` 的基础用法仍然是非常重要的。

## 基本用法

最简单的 `createStore` 调用只需要传递一个 reducer 函数：

```javascript
import { createStore } from "redux";
import rootReducer from "./reducers"; // 导入你的根 reducer

const store = createStore(rootReducer);
```

这行代码创建了一个新的 Redux store，它使用 `rootReducer` 来管理应用程序的状态。

## 配置 Store

为了添加更多功能，如中间件或开发者工具支持，你可以使用 `applyMiddleware` 和 `compose` 函数来增强 `createStore` 的行为。

### 使用 applyMiddleware

`applyMiddleware` 允许你在 action 到达 reducer 之前处理它们，这对于异步逻辑（例如 `redux-thunk` 或 `redux-saga`）、日志记录（例如 `redux-logger`）等非常有用。

```javascript
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";
import rootReducer from "./reducers";

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger) // 应用多个中间件
);
```

### 使用 compose

`compose` 函数可以将多个 store 增强器组合在一起。例如，如果你想同时使用 Redux DevTools Extension 和其他增强器，可以这样做：

```javascript
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

// 检查浏览器是否安装了 Redux DevTools Extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
```

这段代码会在开发环境中自动启用 Redux DevTools，而在生产环境中则忽略它。

### 提供初始状态

如果你需要为 store 提供一个初始状态（例如从服务器端渲染获取的状态），可以通过第二个参数传递：

```javascript
const initialState = {
  counter: 5,
  todos: [
    { id: 1, text: "Learn about actions", completed: true },
    { id: 2, text: "Write my first action", completed: false },
  ],
};

const store = createStore(rootReducer, initialState);
```

## Store API

创建好 store 后，你可以使用以下方法与之交互：

1. **getState()**

   - 获取当前的状态树。
   - 返回值为最新的 state 对象。

   ```javascript
   const currentState = store.getState();
   ```

2. **dispatch(action)**

   - 发送一个 action 到 Store，触发状态更新。
   - 参数是一个 action 对象或返回 action 的函数（当使用像 `redux-thunk` 这样的中间件时）。

   ```javascript
   store.dispatch({ type: "INCREMENT" });
   ```

3. **subscribe(listener)**

   - 注册一个监听器函数，在每次状态变化后调用。
   - 返回一个取消订阅的函数。

   ```javascript
   const unsubscribe = store.subscribe(() => {
     console.log("State changed:", store.getState());
   });

   // 取消订阅
   unsubscribe();
   ```

4. **replaceReducer(nextReducer)**

   - 替换当前使用的 reducer 函数。
   - 主要用于热重载开发环境或动态加载模块。

   ```javascript
   store.replaceReducer(newReducer);
   ```

## 使用 Provider 组件 (React)

当你在 React 应用中使用 Redux 时，通常会结合 `react-redux` 库中的 `Provider` 组件来将 Store 提供给整个组件树。

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import store from "./store"; // 导入上面创建的 store

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

这样做的好处是，任何嵌套在 `<Provider>` 内部的组件都可以访问到 Redux Store，而无需显式地传递 Store 实例。

## 总结

`createStore` 是 Redux 应用程序的核心构建块之一，它负责初始化 store 并配置必要的中间件和增强器。通过正确地设置 `createStore`，你可以确保应用程序的状态管理既强大又灵活。
