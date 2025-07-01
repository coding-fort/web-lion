# react-redux

`react-redux` 是官方推荐的用于将 Redux 与 React 应用程序集成的库。它提供了一种高效且简洁的方式来连接 React 组件和 Redux store，使得状态管理和组件之间的交互变得更加简单。以下是 `react-redux` 的核心概念、API 和使用方法：

## 核心概念

1. **Provider**：一个高阶组件（Higher-Order Component, HOC），它允许 React 组件树中的任何组件访问 Redux store。
2. **useSelector**：一个 Hook，用于从 Redux store 中选择部分状态并在组件中使用。
3. **useDispatch**：一个 Hook，用于获取 dispatch 方法以发送 actions。
4. **connect**（已逐步淘汰）：一种更传统的 HOC 方式来连接 React 组件和 Redux store。

## 安装 react-redux

首先，你需要安装 `react-redux` 和 `redux`：

```bash
npm install react-redux redux
```

## 使用 Provider 包裹应用

为了让整个应用程序能够访问 Redux store，你需要用 `Provider` 来包裹你的根组件，并传递 store 作为属性。

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createStore } from "redux";
import App from "./App";
import rootReducer from "./reducers"; // 你的根 reducer

// 创建 Redux store
const store = createStore(rootReducer);

// 渲染应用并提供 Redux store
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

## 使用 useSelector 和 useDispatch Hooks

`react-redux` 提供了两个主要的 Hooks 来简化与 Redux store 的交互：

### useSelector

`useSelector` Hook 用于从 Redux store 中选择特定的状态片段。它会在每次 state 变化时重新计算所选状态，并在必要时触发组件重新渲染。

```jsx
import React from "react";
import { useSelector } from "react-redux";

function CounterDisplay() {
  const count = useSelector((state) => state.counter); // 选择器函数

  return (
    <div>
      <p>Counter: {count}</p>
    </div>
  );
}

export default CounterDisplay;
```

### useDispatch

`useDispatch` Hook 返回 Redux store 的 `dispatch` 方法，你可以用它来分发 actions。

```jsx
import React from "react";
import { useDispatch } from "react-redux";
import { increment, decrement } from "./actions"; // 假设你已经定义了这些 action creators

function CounterControl() {
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

export default CounterControl;
```

## connect (传统方式)

虽然 `connect` 已经被新的 Hooks API 所取代，但在某些情况下仍然可能遇到或需要使用它。`connect` 是一个 HOC，它允许你将 React 组件与 Redux store 连接起来，从而可以访问 state 和 dispatch actions。

```jsx
import React from "react";
import { connect } from "react-redux";
import { increment, decrement } from "./actions";

function Counter({ count, increment, decrement }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

const mapStateToProps = (state) => ({
  count: state.counter,
});

const mapDispatchToProps = {
  increment,
  decrement,
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

在这个例子中，`mapStateToProps` 将 Redux store 中的状态映射到组件的 props，而 `mapDispatchToProps` 则将 action creators 映射为可以直接调用的方法。

## 与 redux 区别

`Redux` 和 `react-redux` 是两个不同的库，它们在功能和用途上有明显的区别。理解这两者之间的差异有助于更好地利用它们来构建高效的应用程序。

### Redux

**定义**：`Redux` 是一个用于管理应用程序状态的 JavaScript 库，它可以与任何视图层结合使用，但最常与 React 一起使用。它提供了一种集中管理和更新应用状态的方法。

**核心概念**：

- **Store**：保存整个应用的状态树。
- **Action**：描述发生了什么的对象，通常包含一个 `type` 字段和其他 payload 数据。
- **Reducer**：纯函数，接收当前状态和 action，并返回新的状态。
- **Middleware**：可以扩展 Redux 的能力，如处理异步操作、日志记录等。

**职责**：`Redux` 负责状态管理逻辑，包括如何创建 store、如何 dispatch actions、如何编写 reducers 等。

**安装**：

```bash
npm install redux
# 或者
yarn add redux
```

### react-redux

**定义**：`react-redux` 是专门为 React 设计的官方 Redux 绑定库。它的作用是将 React 组件与 Redux store 连接起来，使得组件可以访问 state 和 dispatch actions。

**核心功能**：

- **Provider**：允许整个应用树下的所有组件访问 Redux store。
- **connect**：高阶组件（HOC），用于将 React 组件连接到 Redux store。
- **Hooks (`useSelector` 和 `useDispatch`)**：使函数组件可以直接访问 Redux store。

**职责**：`react-redux` 主要关注于如何将 Redux store 与 React 组件集成，而不是管理状态本身。它提供了工具来简化从组件中读取 state 和 dispatch actions 的过程。

**安装**：

```bash
npm install react-redux
# 或者
yarn add react-redux
```

### 区别总结

| 特性             | Redux                                                              | react-redux                                 |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------------- |
| **主要职责**     | 管理应用状态，定义如何创建 store、dispatch actions 和编写 reducers | 将 React 组件与 Redux store 集成            |
| **核心概念**     | Store, Action, Reducer, Middleware                                 | Provider, connect, useSelector, useDispatch |
| **适用范围**     | 可以与任何视图层结合使用                                           | 专为 React 应用设计                         |
| **安装命令**     | `npm install redux`                                                | `npm install react-redux`                   |
| **状态访问方式** | 通过订阅 store 来手动获取最新状态                                  | 使用 Hooks 或 HOC 自动连接组件和 store      |
| **派发 Actions** | 手动调用 `store.dispatch(action)`                                  | 使用 `useDispatch` 或 `connect`             |

### 实际应用中的关系

在实际开发中，`Redux` 和 `react-redux` 通常是配合使用的。你使用 `Redux` 来设置和管理全局状态，而 `react-redux` 则帮助你在 React 组件中方便地访问这些状态和 dispatch actions。例如：

1. **创建 Store**：使用 `redux` 创建并配置 store。
2. **提供 Store**：使用 `react-redux` 的 `Provider` 组件将 store 提供给整个应用。
3. **连接组件**：使用 `react-redux` 的 `connect` 或 Hooks API 在组件中访问 state 和 dispatch actions。

### 示例代码

#### 创建 Store (Redux)

```javascript
import { createStore } from "redux";
import rootReducer from "./reducers";

const store = createStore(rootReducer);

export default store;
```

#### 提供 Store (react-redux)

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
```

#### 访问 State 和 Dispatch Actions (react-redux)

使用 `connect`：

```javascript
import React from "react";
import { connect } from "react-redux";
import { increment, decrement } from "./actions";

function Counter({ count, increment, decrement }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

const mapStateToProps = (state) => ({
  count: state.count,
});

const mapDispatchToProps = {
  increment,
  decrement,
};

export default connect(mapStateToProps, mapDispatchToProps)(Counter);
```

使用 Hooks：

```javascript
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { increment, decrement } from "./actions";

function Counter() {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>Increment</button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
}

export default Counter;
```

- **`Redux`**：专注于状态管理，定义了如何创建 store、dispatch actions 和编写 reducers。
- **`react-redux`**：专注于将 Redux store 与 React 组件集成，提供了便捷的方式让组件访问 state 和 dispatch actions。

## 总结

`react-redux` 提供了一套简单而强大的工具来管理 React 应用的状态。通过使用 `Provider`、`useSelector` 和 `useDispatch` Hooks，你可以轻松地将 Redux store 集成到你的 React 应用中，并保持代码的清晰性和可维护性。
