# Action

在 Redux 中，**Action** 是一个普通的 JavaScript 对象，用于描述发生了什么。它是从应用程序发送到 Store 的唯一方式，告知 Store 应该如何改变状态。每个 action 至少需要有一个 `type` 属性，它是一个字符串常量，用来标识发生的事件类型。此外，action 还可以包含其他信息（如 payload），这些信息会传递给 reducer 以帮助它们决定如何更新状态。

## 核心概念

1. **Type**: 每个 action 都必须有一个 `type` 属性，表示这个 action 的目的或含义。通常使用字符串常量来定义 action 类型，以便于维护和避免拼写错误。
2. **Payload**: 可选属性，用于携带额外的数据，比如用户输入、API 响应等。
3. **Meta**: 可选属性，用于提供有关 action 的元数据，例如时间戳、来源等。
4. **Error**: 可选布尔值，用于指示该 action 是否代表一个错误条件。

## 创建 Action

### 简单的 Action

最简单的 action 只包含一个 `type` 字段：

```javascript
const INCREMENT = "INCREMENT";

// Action Creator 函数
function increment() {
  return { type: INCREMENT };
}

store.dispatch(increment());
```

### 带 Payload 的 Action

当需要向 reducer 传递额外的信息时，可以在 action 中添加 `payload` 属性：

```javascript
const ADD_TODO = "ADD_TODO";

// Action Creator 函数
function addTodo(text) {
  return {
    type: ADD_TODO,
    payload: {
      id: nextTodoId++,
      text,
    },
  };
}

store.dispatch(addTodo("Learn about actions"));
```

### 异步 Action (with Thunk)

如果你需要处理异步逻辑，可以使用中间件如 `redux-thunk` 来创建返回函数而不是普通对象的 action creators。这种 thunk 函数可以在内部执行异步操作，并根据结果 dispatch 多个 actions：

```javascript
import axios from "axios";

const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";
const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";

// Thunk Action Creator
function fetchUser(id) {
  return function (dispatch) {
    dispatch({ type: FETCH_USER_REQUEST });

    return axios
      .get(`https://api.example.com/users/${id}`)
      .then((response) => response.data)
      .then((user) => dispatch({ type: FETCH_USER_SUCCESS, payload: user }))
      .catch((error) =>
        dispatch({ type: FETCH_USER_FAILURE, payload: error, error: true })
      );
  };
}

store.dispatch(fetchUser(1));
```

## 使用 Action Creators

为了简化代码并提高可读性，通常会定义 action creator 函数来生成 actions。这些函数接收参数并返回相应的 action 对象。这不仅使代码更简洁，还便于测试和复用。

```javascript
// 定义常量
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";

// Action Creators
export function increment(amount = 1) {
  return { type: INCREMENT, payload: amount };
}

export function decrement(amount = 1) {
  return { type: DECREMENT, payload: amount };
}
```

然后你可以在组件中通过 `useDispatch` Hook 或者 `connect` 方法轻松地调用这些 action creators：

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

## Best Practices

### 使用常量定义 Type

为 action 类型定义常量有助于避免拼写错误，并且使得重构更加容易。你可以将所有 action 类型集中在一个文件中管理：

```javascript
// actions/types.js
export const INCREMENT = "INCREMENT";
export const DECREMENT = "DECREMENT";
```

然后在你的 action creators 文件中导入这些常量：

```javascript
import { INCREMENT, DECREMENT } from "./types";

export function increment(amount = 1) {
  return { type: INCREMENT, payload: amount };
}

export function decrement(amount = 1) {
  return { type: DECREMENT, payload: amount };
}
```

### 使用 Flux Standard Action (FSA)

Flux Standard Action 是一种约定，它规定了 action 的结构，确保所有的 action 都遵循一致的形式。一个 FSA 包括：

- `type`：必需的字符串常量。
- `payload`：可选的有效载荷，不能是 `undefined`。如果表示错误，则放在 `error` 字段。
- `error`：可选布尔值，仅当 action 表示错误时设置为 `true`。
- `meta`：可选字段，用于存储任何类型的元数据。

遵循 FSA 规范可以使你的 actions 更加标准化，易于理解和互操作。

### 测试 Action Creators

由于 action creators 是纯函数，因此它们非常容易测试。你可以编写单元测试来验证给定输入时 action creators 返回预期的结果。

```javascript
import { increment, decrement } from "./actions";

test("increment action creator", () => {
  expect(increment(5)).toEqual({ type: "INCREMENT", payload: 5 });
});

test("decrement action creator", () => {
  expect(decrement(2)).toEqual({ type: "DECREMENT", payload: 2 });
});
```

## 总结

Actions 在 Redux 中扮演着重要的角色，它们充当了视图层与业务逻辑之间的桥梁。通过定义清晰的 action 类型和 action creators，你可以确保应用程序的状态变化是可预测且易于追踪的。结合中间件处理异步逻辑和其他复杂场景，可以让 Redux 应用程序更加健壮和灵活。
