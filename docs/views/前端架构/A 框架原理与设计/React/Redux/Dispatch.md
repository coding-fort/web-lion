# Dispatch

`dispatch` 函数是 Redux 中的核心函数之一，用于将 action 发送到 store。通过 `dispatch`，你可以通知 store 有新的 action 需要处理，并触发 state 的更新。Redux Store 使用这个 action 来调用 reducer 函数，从而计算出新的 state。

## 核心概念

1. **发送 Action**：`dispatch` 接受一个 action 对象或返回 action 的函数（当使用中间件如 `redux-thunk` 或 `redux-saga` 时）作为参数。
2. **触发 State 更新**：每当调用 `dispatch` 并传递一个 action 后，store 会遍历所有注册的 reducers，并将 action 和当前 state 传递给它们，以计算新的 state。
3. **同步 vs 异步**：默认情况下，`dispatch` 是同步的，即它立即执行并返回结果。但是，通过使用中间件，你可以扩展 `dispatch` 的能力来支持异步逻辑。

## 基本用法

### 发送 Plain Action

```javascript
import { createStore } from "redux";
import rootReducer from "./reducers";

const store = createStore(rootReducer);

// 发送一个 plain action
store.dispatch({ type: "INCREMENT" });
```

在这个例子中，我们创建了一个 Redux store，并通过 `dispatch` 发送了一个简单的 `INCREMENT` action。这将导致 store 调用相应的 reducer 来处理该 action，并根据需要更新状态。

### 使用 Action Creator

通常你会定义 action creator 函数来生成这些 actions：

```javascript
function increment() {
  return { type: "INCREMENT" };
}

store.dispatch(increment());
```

这里，`increment` 是一个 action creator，它返回了一个包含 `type` 属性的对象。然后我们将这个 action creator 返回的结果传递给 `dispatch`。

## 处理异步逻辑

为了处理异步逻辑，比如 API 请求，你可以结合使用像 `redux-thunk` 这样的中间件。`redux-thunk` 允许你编写返回函数而不是普通对象的 action creators。这样就可以在函数内部执行异步操作，并根据结果 dispatch 一个或多个 actions。

### 安装 `redux-thunk`

首先安装 `redux-thunk`：

```bash
npm install redux-thunk
```

### 使用 `redux-thunk` 处理异步 Action

```javascript
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(thunk));

// Thunk Action Creator
function fetchUser(id) {
  return function (dispatch) {
    dispatch({ type: "FETCH_USER_REQUEST" });

    return axios
      .get(`https://api.example.com/users/${id}`)
      .then((response) => response.data)
      .then((user) => dispatch({ type: "FETCH_USER_SUCCESS", payload: user }))
      .catch((error) =>
        dispatch({ type: "FETCH_USER_FAILURE", payload: error, error: true })
      );
  };
}

// 使用
store.dispatch(fetchUser(1));
```

在这个例子中，`fetchUser` 是一个 thunk action creator，它返回了一个函数，这个函数接收 `dispatch` 作为参数。我们可以在这个函数内部执行异步操作，并根据 API 请求的结果 dispatch 相应的 actions。

## 在 React 组件中使用 `dispatch`

当你在 React 应用中使用 Redux 时，通常会结合 `react-redux` 库中的 `useDispatch` Hook 或者 `connect` 方法来访问 `dispatch` 函数。

### 使用 `useDispatch` Hook

```jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { increment, decrement } from "./actions";

function CounterControl() {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState(1);

  return (
    <div>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <button onClick={() => dispatch(increment(amount))}>Increment</button>
      <button onClick={() => dispatch(decrement(amount))}>Decrement</button>
    </div>
  );
}

export default CounterControl;
```

在这个组件中，我们使用了 `useDispatch` Hook 来获取 `dispatch` 函数，并将其绑定到按钮的点击事件上。当用户点击按钮时，相应的 action 将被 dispatch 到 store。

### 使用 `connect` 方法

对于类组件或更早版本的 React，可以使用 `connect` 方法来映射 dispatch 到 props：

```jsx
import React, { Component } from "react";
import { connect } from "react-redux";
import { increment, decrement } from "./actions";

class CounterControl extends Component {
  render() {
    return (
      <div>
        <button onClick={() => this.props.increment(1)}>Increment</button>
        <button onClick={() => this.props.decrement(1)}>Decrement</button>
      </div>
    );
  }
}

const mapDispatchToProps = {
  increment,
  decrement,
};

export default connect(null, mapDispatchToProps)(CounterControl);
```

## 总结

`dispatch` 是 Redux 中用于发送 actions 的关键函数。它可以同步地发送 plain actions，也可以通过中间件的支持来处理复杂的异步逻辑。理解如何正确地使用 `dispatch` 可以帮助你有效地管理应用程序的状态变化。
