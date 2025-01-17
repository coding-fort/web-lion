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

## 总结

`react-redux` 提供了一套简单而强大的工具来管理 React 应用的状态。通过使用 `Provider`、`useSelector` 和 `useDispatch` Hooks，你可以轻松地将 Redux store 集成到你的 React 应用中，并保持代码的清晰性和可维护性。
