# applyMiddleware

`applyMiddleware` 是 Redux 提供的一个增强工具，用于在 `dispatch` 和 reducer 之间插入中间件（middleware）。中间件可以拦截每个 action，在它到达 reducer 之前进行处理。这使得你可以扩展 Redux 的功能，比如处理异步操作、日志记录、崩溃报告等。

## 中间件的作用

中间件的主要作用是：

- **修改 action**：可以在 action 发送到 reducer 之前对其进行修改。
- **执行副作用**：例如发起网络请求、保存数据到本地存储等。
- **记录日志**：可以用来调试应用程序，记录所有发生的 actions 和状态变化。
- **其他任务**：任何需要在 action 和 state 更新之间执行的任务。

常见的中间件包括：

- **redux-thunk**：允许你编写返回函数而不是普通对象的 action creators，从而支持异步逻辑。
- **redux-saga**：一个更强大的库，使用 Generator 函数来管理复杂的异步流程。
- **redux-logger**：用于打印每次 dispatch 的 action 和更新后的 state，方便调试。
- **redux-promise**：自动解析 Promise 类型的 actions。

## 使用 `applyMiddleware`

`applyMiddleware` 必须在创建 store 的时候通过 `createStore` 函数的第二个参数传递进去。它接收多个中间件作为参数，并将它们应用到 Redux 应用中。

### 安装中间件

首先确保安装了所需的中间件库。例如，如果你要使用 `redux-thunk` 和 `redux-logger`：

```bash
npm install redux-thunk redux-logger
```

### 创建 Store 并应用中间件

接下来，在创建 Redux Store 的时候使用 `applyMiddleware` 来添加中间件：

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import rootReducer from './reducers';

const store = createStore(
  rootReducer,
  applyMiddleware(thunk, logger) // 应用中间件
);
```

在这个例子中，我们同时应用了 `redux-thunk` 和 `redux-logger` 两个中间件。这意味着每当一个 action 被 dispatch 时，它会先经过 `thunk` 处理（如果是一个异步 action），然后是 `logger` 记录日志，最后才会到达 reducer。

## 中间件的工作原理

中间件本质上是一个或多个函数组成的链，这些函数依次处理每个 action。每个中间件都可以选择：

- **继续传递 action**：调用下一个中间件或者直接交给 reducer。
- **终止链条**：阻止 action 到达 reducer。
- **修改 action**：在传递给下一个中间件或 reducer 之前修改 action。
- **执行副作用**：如发起 API 请求、调度额外的 actions 等。

### 示例：自定义中间件

如果你想创建自己的中间件，它可以是一个返回函数的高阶函数。这个函数接收 `store` 的 `dispatch` 和 `getState` 方法，并返回一个新的 `dispatch` 方法。例如：

```javascript
const myCustomMiddleware = (storeAPI) => (next) => (action) => {
  console.log('This is my custom middleware');
  console.log('Current State:', storeAPI.getState());
  console.log('Action:', action);

  // 继续传递 action
  next(action);

  console.log('Next State:', storeAPI.getState());
};

// 应用自定义中间件
const store = createStore(
  rootReducer,
  applyMiddleware(myCustomMiddleware)
);
```

在这个自定义中间件中，我们在 action 到达 reducer 之前和之后都打印了当前的状态和 action 信息。这对于调试非常有用。

## 异步 Action 示例

结合 `redux-thunk`，你可以轻松地处理异步逻辑。以下是如何编写异步 action creator 的示例：

```javascript
import axios from 'axios';

export function fetchTodos() {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_TODOS_REQUEST' });

    try {
      const response = await axios.get('/api/todos');
      dispatch({ type: 'FETCH_TODOS_SUCCESS', payload: response.data });
    } catch (error) {
      dispatch({ type: 'FETCH_TODOS_FAILURE', payload: error, error: true });
    }
  };
}

// 在组件中使用
import React from 'react';
import { useDispatch } from 'react-redux';
import { fetchTodos } from './actions/todoActions';

function TodoControl() {
  const dispatch = useDispatch();

  const handleFetchTodos = () => {
    dispatch(fetchTodos());
  };

  return (
    <div>
      <button onClick={handleFetchTodos}>Fetch Todos</button>
    </div>
  );
}
```

在这个例子中，`fetchTodos` 是一个返回函数的 action creator，它内部执行了一个异步操作，并根据结果 dispatch 了不同的 actions。由于我们已经在创建 store 时应用了 `redux-thunk`，所以可以直接像普通 action creator 那样 dispatch 这个异步 action creator。

## 总结

`applyMiddleware` 是一个强大的工具，可以帮助你扩展 Redux 的功能，处理各种复杂的需求。通过合理地使用中间件，你可以简化异步逻辑、增强调试能力以及实现更多高级特性。