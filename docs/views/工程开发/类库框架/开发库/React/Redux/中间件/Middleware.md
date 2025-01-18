# Middleware：增强 dispatch 函数

在 Redux 中，**中间件（Middleware）** 是一个强大的工具，它允许你在 action 被 dispatch 到 reducer 之前或之后执行额外的逻辑。中间件可以用来处理各种任务，如日志记录、异步操作、路由管理等。通过使用中间件，你可以增强 Redux 的功能，而不需要修改核心逻辑。

## 核心概念

1. **拦截 Action**：中间件可以在 action 被传递给 reducer 之前对其进行拦截和处理。
2. **扩展功能**：它可以添加新的行为，例如处理异步逻辑、批处理 actions 或者记录日志。
3. **链式调用**：多个中间件可以按顺序串联起来形成一条处理链，每个中间件都可以决定是否继续传递 action 给下一个中间件或者直接结束链条。

## 使用场景

- **异步逻辑**：处理 API 请求、WebSocket 连接等非同步任务。
- **日志记录**：记录每次 dispatch 的 action 和状态变化。
- **错误处理**：捕获并处理应用程序中的错误。
- **路由控制**：根据应用的状态改变路由。
- **批处理 actions**：将多个小的 actions 合并成一个较大的 batch action 来减少不必要的重新渲染。

## 常见的 Redux 中间件

### 1. `redux-thunk`

`redux-thunk` 是最常用的中间件之一，它允许你编写返回函数而不是普通对象的 action creators。这种 thunk 函数可以包含异步逻辑，并且可以根据需要延迟 dispatch actions。

```bash
npm install redux-thunk
```

然后配置你的 store：

```javascript
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(thunk));
```

使用示例：

```javascript
// 异步 action creator
function fetchUser(id) {
  return function (dispatch) {
    dispatch({ type: "FETCH_USER_REQUEST" });

    return fetch(`https://api.example.com/users/${id}`)
      .then((response) => response.json())
      .then((user) => dispatch({ type: "FETCH_USER_SUCCESS", payload: user }))
      .catch((error) =>
        dispatch({ type: "FETCH_USER_FAILURE", payload: error })
      );
  };
}
```

### 2. `redux-saga`

`redux-saga` 是另一个用于管理复杂异步逻辑的中间件，它使用 ES6 的生成器函数来实现更复杂的业务流程。相比 `redux-thunk`，它提供了更好的并发性和错误处理机制。

```bash
npm install redux-saga
```

配置 store：

```javascript
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware } from "redux";
import rootReducer from "./reducers";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);
```

使用示例：

```javascript
import { takeLatest, call, put } from "redux-saga/effects";

function* fetchUser(action) {
  try {
    const user = yield call(
      fetch,
      `https://api.example.com/users/${action.payload.id}`
    );
    const response = yield user.json();
    yield put({ type: "FETCH_USER_SUCCESS", payload: response });
  } catch (error) {
    yield put({ type: "FETCH_USER_FAILURE", payload: error });
  }
}

function* watchFetchUser() {
  yield takeLatest("FETCH_USER_REQUEST", fetchUser);
}

export default function* rootSaga() {
  yield [
    watchFetchUser(),
    // ... other watchers
  ];
}
```

### 3. `redux-logger`

`redux-logger` 是一个简单的中间件，用于记录 Redux store 的所有状态变化和分发的动作。这对于调试非常有帮助。

```bash
npm install redux-logger
```

配置 store：

```javascript
import { createStore, applyMiddleware } from "redux";
import logger from "redux-logger";
import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(logger));
```

### 4. 自定义中间件

你还可以创建自己的中间件来满足特定的需求。自定义中间件本质上是一个函数，它接收 `store.dispatch` 和 `store.getState` 作为参数，并返回一个新的 dispatch 方法。

```javascript
const myCustomMiddleware = (storeAPI) => (next) => (action) => {
  console.log("This action happened:", action);

  // Pass the action to the next middleware or reducer
  return next(action);
};

// 在创建 store 时应用自定义中间件
const store = createStore(rootReducer, applyMiddleware(myCustomMiddleware));
```

## 中间件的工作原理

每个中间件都遵循类似的签名：

```javascript
middleware =
  ({ dispatch, getState }) =>
  (next) =>
  (action) => {
    // 执行一些预处理逻辑

    const result = next(action); // 将 action 传递给下一个中间件或 reducer

    // 执行一些后处理逻辑

    return result;
  };
```

- `({ dispatch, getState })`：这是中间件工厂函数，它接收 store 的两个方法作为参数。
- `next`：这是一个指向下一个中间件或最终 reducer 的引用。如果你不调用 `next(action)`，那么 action 就不会被传递下去。
- `action`：这是从组件或其他地方发送过来的 action 对象。

## 总结

Redux 中间件是扩展 Redux 功能的强大工具，它使得我们可以轻松地添加额外的行为到我们的应用中。无论是处理异步逻辑、日志记录还是其他复杂任务，都有现成的中间件可供选择。对于更高级的需求，我们也可以构建自己的中间件来满足特定的应用场景。
