# 共享 Store

在 Redux 中，多个 Action Creators 是**共用同一个 Store**的。Redux 的设计理念是应用程序应该有一个单一的 Store 来保存整个应用的状态树。这个 Store 被所有组件和 action creators 共享，以确保状态的一致性和可预测性。

## 单一 Store 的优势

1. **全局状态管理**：所有状态集中在一个地方，便于管理和调试。
2. **一致性**：由于只有一个 Store，所以不存在不同 Store 之间状态不一致的问题。
3. **简化逻辑**：不需要处理多个 Store 之间的同步或通信问题。
4. **易于扩展**：通过 `combineReducers` 可以轻松地将应用的状态划分为多个模块，同时保持单一 Store 的结构。

## 如何理解多个 Action Creators 共用一个 Store

即使你定义了多个不同的 action creators（例如 `addTodo`、`toggleTodo` 和 `fetchTodos`），它们都是为了操作同一个 Store 中的不同部分或执行不同类型的操作。每个 action creator 都会生成一个 action 对象，然后通过 `dispatch` 函数发送给 Store。Store 接收到 action 后，会调用相应的 reducer 来更新状态。

### 示例

假设我们有以下三个 action creators：

```javascript
// actions/todoActions.js
import { ADD_TODO, TOGGLE_TODO } from "./types";

export function addTodo(text) {
  return { type: ADD_TODO, payload: text };
}

export function toggleTodo(id) {
  return { type: TOGGLE_TODO, payload: id };
}

// actions/apiActions.js
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

尽管这些 action creators 定义在不同的文件中，并且可能作用于 Store 中的不同部分（如 `todos` 和 `api` 状态片段），但它们都是针对同一个 Store 操作的。你可以这样使用它们：

```javascript
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
import { addTodo, toggleTodo, fetchTodos } from "./actions";

const store = createStore(rootReducer, applyMiddleware(thunk));

store.dispatch(addTodo("Learn about actions"));
store.dispatch(toggleTodo(1));
store.dispatch(fetchTodos());
```

## 在 React 组件中共享 Store

当你在 React 应用中使用 `react-redux` 时，通常会结合 `Provider` 组件和 `useDispatch` Hook 或 `connect` 方法来让所有组件都能访问到同一个 Store。这意味着无论你在哪个组件中调用 action creator，它都会影响到相同的全局 Store。

```jsx
// App.js
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

// TodoControl.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { addTodo, toggleTodo } from "./actions/todoActions";

function TodoControl() {
  const dispatch = useDispatch();

  const handleAddTodo = () => {
    dispatch(addTodo("Learn about actions"));
  };

  const handleToggleTodo = (id) => {
    dispatch(toggleTodo(id));
  };

  return (
    <div>
      <button onClick={handleAddTodo}>Add Todo</button>
      {/* ... */}
    </div>
  );
}

export default TodoControl;
```

## 多个 Store 的情况

虽然理论上可以创建多个 Store 实例，但在实际开发中很少这样做，因为这会导致状态管理复杂化，难以维护。如果你的应用确实需要分割成多个独立的部分，并且每个部分都有自己独立的状态管理需求，考虑使用微前端架构或者模块化的 Redux 设计模式，而不是简单地创建多个 Redux Store。

## 总结

- 在 Redux 中，多个 Action Creators 是共用同一个 Store 的。
- 这种设计确保了状态的一致性和全局管理，简化了逻辑并提高了代码的可维护性。
- 使用 `react-redux` 的 `Provider` 和 `useDispatch` Hook 或 `connect` 方法可以让所有组件都访问到同一个 Store。
