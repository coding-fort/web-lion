# redux-promise（允许action 是Promise）

`redux-promise` 是一个中间件，用于处理 Redux 应用中的异步操作。它允许你直接 dispatch 一个 Promise，并在 Promise 完成时自动将结果作为 action 发送到 reducer。这使得你可以更简洁地管理异步逻辑，而不需要额外的中间件或复杂的回调函数。

## `redux-promise` 的工作原理

1. **拦截 Promise 类型的 actions**：当 `redux-promise` 中间件检测到 dispatch 的 action 是一个 Promise 时，它会拦截这个 action。
2. **等待 Promise 完成**：中间件会等待 Promise 完成（无论是 resolve 还是 reject）。
3. **dispatch 结果**：一旦 Promise 完成，中间件会根据 Promise 的状态 dispatch 新的 action：
   - 如果 Promise 被成功解决（resolved），则将解决值作为 payload dispatch 一个新的 action。
   - 如果 Promise 被拒绝（rejected），则可以 dispatch 一个带有错误信息的 action，或者根据你的需求进行其他处理。

## 安装和使用 `redux-promise`

### 安装

你可以通过 npm 或 yarn 来安装 `redux-promise`：

```bash
npm install redux-promise
# 或者
yarn add redux-promise
```

### 使用

在应用中使用 `redux-promise` 需要将其作为中间件添加到 Redux Store 中。以下是具体的步骤：

```javascript
import { createStore, applyMiddleware } from "redux";
import promiseMiddleware from "redux-promise";
import rootReducer from "./reducers";

// 创建 Store 并应用 redux-promise 中间件
const store = createStore(rootReducer, applyMiddleware(promiseMiddleware));

export default store;
```

## 示例代码

### Action Creators

假设我们有一个 API 请求返回一个 Promise：

```javascript
// 获取用户信息的异步 action creator
export function fetchUser(id) {
  return fetch(`/api/users/${id}`).then((response) => response.json());
}
```

在这个例子中，`fetchUser` 返回的是一个 Promise，而不是一个普通的 action 对象。

### Reducers

接下来，在 reducer 中处理这些异步 action：

```javascript
const initialState = {
  user: null,
  loading: false,
  error: null,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_USER_FULFILLED":
      return {
        ...state,
        user: action.payload,
        loading: false,
        error: null,
      };
    case "FETCH_USER_REJECTED":
      return {
        ...state,
        user: null,
        loading: false,
        error: action.payload || "Something went wrong",
      };
    default:
      return state;
  }
}

export default userReducer;
```

这里我们定义了两个新的 action 类型：`FETCH_USER_FULFILLED` 和 `FETCH_USER_REJECTED`，分别对应 Promise 成功和失败的情况。

### Dispatching Actions

最后，我们可以像往常一样 dispatch 异步 action：

```javascript
store.dispatch(fetchUser(1));
```

`redux-promise` 会自动处理这个 Promise，并根据其完成状态 dispatch 相应的 action。

## 注意事项

- **兼容性**：虽然 `redux-promise` 简化了异步操作的处理，但它已经被认为是一个较老的解决方案。现代应用更多地使用 `redux-thunk` 或 `redux-saga` 来处理更复杂的异步逻辑。
- **Promise 处理**：确保你的异步操作返回的是一个 Promise。如果不是，`redux-promise` 将不会对其进行特殊处理。

- **错误处理**：对于被拒绝的 Promise，`redux-promise` 默认情况下不会做任何特别处理。你需要确保在 reducer 中正确处理 `FETCH_USER_REJECTED` 类型的 action。

## 替代方案

随着 Redux 生态系统的不断发展，现在有更多选择来处理异步逻辑，比如：

- **`redux-thunk`**：提供了一个简单的解决方案，允许你在 action creators 中编写包含业务逻辑的函数，包括异步操作。
- **`redux-saga`**：提供了强大的副作用管理工具，基于 Generator 函数，支持更复杂的异步流程控制和错误处理。
- **`redux-toolkit`**：包含了 `createAsyncThunk` 方法，简化了异步逻辑的编写，并且推荐与 `RTK Query` 一起使用以构建数据获取层。

如果你的应用需要更复杂的功能或更好的性能优化，考虑使用上述替代方案之一。

## 总结

- **`redux-promise` 的作用**：简化 Redux 应用中异步操作的处理，允许直接 dispatch Promise。
- **使用方法**：通过 `applyMiddleware` 将 `redux-promise` 添加到 Redux Store 中，并在 action creators 中返回 Promise。
- **注意事项**：确保异步操作返回 Promise，并在 reducer 中正确处理不同类型的 action。
- **替代方案**：对于更复杂的需求，可以考虑使用 `redux-thunk`、`redux-saga` 或 `redux-toolkit`。
