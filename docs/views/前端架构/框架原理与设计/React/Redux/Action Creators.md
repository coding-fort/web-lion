# Action Creators

Action Creators 是 Redux 中用于生成 actions 的函数。它们接收一些参数，并返回一个 action 对象，这个对象至少包含一个 `type` 属性，用来描述发生了什么。通过定义 Action Creators，你可以将创建 action 的逻辑封装起来，使得代码更加模块化、可读和易于测试。

## 为什么使用 Action Creators？

1. **复用性**：可以多次调用同一个 action creator 来创建具有相同结构但不同数据的 actions。
2. **可维护性**：集中管理 action 创建逻辑，便于修改和扩展。
3. **易测试性**：由于 action creators 是纯函数，所以非常容易编写单元测试。
4. **简化异步逻辑**：当结合中间件（如 `redux-thunk` 或 `redux-saga`）时，action creators 可以处理复杂的异步操作。

## 定义 Action Creators

### 简单的 Action Creator

最简单的 action creator 接收参数并返回一个包含 `type` 和可能的 `payload` 的普通 JavaScript 对象：

```javascript
// actions/types.js
export const ADD_TODO = "ADD_TODO";

// actions/todoActions.js
import { ADD_TODO } from "./types";

export function addTodo(text) {
  return {
    type: ADD_TODO,
    payload: text,
  };
}
```

### 带默认值的 Action Creator

你可以为 action creator 的参数设置默认值，这样在没有提供特定参数时也能正常工作：

```javascript
export function increment(amount = 1) {
  return {
    type: "INCREMENT",
    payload: amount,
  };
}
```

### 异步 Action Creator (with Thunk)

为了处理异步逻辑，你可以使用 `redux-thunk` 或类似的中间件。Thunk action creators 返回一个函数，该函数接收 `dispatch` 和 `getState` 作为参数，允许你在其中执行异步操作：

```javascript
import axios from "axios";

export function fetchTodos() {
  return async (dispatch) => {
    dispatch({ type: "FETCH_TODOS_REQUEST" });

    try {
      const response = await axios.get("/api/todos");
      dispatch({ type: "FETCH_TODOS_SUCCESS", payload: response.data });
    } catch (error) {
      dispatch({ type: "FETCH_TODOS_FAILURE", payload: error, error: true });
    }
  };
}
```

## 使用 Action Creators

当你需要发送一个 action 时，通常会调用相应的 action creator 并将其结果传递给 `dispatch` 函数：

```javascript
store.dispatch(addTodo("Learn about actions"));
```

在 React 组件中，你可以结合 `useDispatch` Hook 或 `connect` 方法来访问 `dispatch`：

```jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addTodo } from "./actions/todoActions";

function TodoForm() {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    dispatch(addTodo(text));
    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Add Todo</button>
    </form>
  );
}

export default TodoForm;
```

## 测试 Action Creators

由于 action creators 是纯函数，因此很容易编写单元测试来验证它们的行为：

```javascript
import { addTodo, increment } from "./actions/todoActions";

test("addTodo action creator", () => {
  expect(addTodo("Learn about actions")).toEqual({
    type: "ADD_TODO",
    payload: "Learn about actions",
  });
});

test("increment action creator with default value", () => {
  expect(increment()).toEqual({ type: "INCREMENT", payload: 1 });
});

test("increment action creator with custom value", () => {
  expect(increment(5)).toEqual({ type: "INCREMENT", payload: 5 });
});
```

## 最佳实践

- **集中管理常量**：将所有 action 类型定义为常量，并放在一个单独的文件中（如 `constants.js` 或 `types.js`），这有助于避免拼写错误，并且方便重构。

  ```javascript
  // actions/types.js
  export const ADD_TODO = "ADD_TODO";
  export const TOGGLE_TODO = "TOGGLE_TODO";
  ```

- **遵循 Flux Standard Action (FSA)**：确保你的 actions 遵循 FSA 规范，这可以使你的 actions 更加标准化，易于理解和互操作。
- **处理错误**：对于可能会失败的操作（如 API 请求），应该考虑如何处理错误条件，并在 action 中携带错误信息（例如通过 `error` 字段）。

- **保持简单**：尽量让 action creators 保持简单明了。如果业务逻辑变得复杂，考虑将其拆分到独立的服务或辅助函数中。

## 总结

Action Creators 是 Redux 开发中的一个重要概念，它们帮助你组织和管理应用程序中的状态变化。通过定义清晰的 action creators，你可以确保应用程序的状态更新是可预测且易于追踪的。同时，结合中间件处理异步逻辑和其他复杂场景，可以让 Redux 应用程序更加健壮和灵活。
