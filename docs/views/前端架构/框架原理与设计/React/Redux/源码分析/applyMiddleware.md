# 手写 applyMiddleware 源码

手写 `applyMiddleware` 的源码可以帮助你更深入地理解它是如何工作的。`applyMiddleware` 是 Redux 中用于应用中间件的工具，它允许你在 action 到达 reducer 之前对其进行处理。这使得你可以扩展 Redux 的功能，例如处理异步操作、日志记录等。

下面是一个简化版的 `applyMiddleware` 源码实现：

## 简化版 `applyMiddleware` 源码

```javascript
function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadedState, enhancer) => {
    const store = createStore(reducer, preloadedState, enhancer);

    // 创建一个包含中间件链的 dispatch 方法
    let dispatch = () => {
      throw new Error(
        "Dispatching while constructing your middleware is not allowed. " +
          "Other middleware would not be applied to this dispatch."
      );
    };

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args),
    };

    // 构建中间件链
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));

    // 应用中间件链到原始 dispatch 方法
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch,
    };
  };
}

// 辅助函数：compose 函数用于组合多个函数为一个函数
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce(
    (a, b) =>
      (...args) =>
        a(b(...args))
  );
}
```

## 解释

1. **`applyMiddleware` 函数**：

   - 接受多个中间件作为参数，并返回一个新的增强器（enhancer）。
   - 这个增强器本身是一个高阶函数，它接收 `createStore` 函数作为参数，并返回一个创建 Store 的新函数。
   - 在这个新函数中，首先调用原始的 `createStore` 来创建 Store 实例。

2. **构建中间件链**：

   - 创建一个 `middlewareAPI` 对象，提供对 `getState` 和 `dispatch` 的访问。
   - 使用 `map` 方法遍历传入的中间件数组，将每个中间件应用到 `middlewareAPI` 上，构建出中间件链。
   - 中间件是一个接受 `middlewareAPI` 作为参数的函数，返回一个新的函数，该函数接受下一个中间件或最终的 `dispatch` 函数作为参数。

3. **应用中间件链**：

   - 使用 `compose` 函数将所有中间件串联起来，形成一个完整的中间件链。
   - 将这个中间件链应用于原始的 `dispatch` 方法，生成新的 `dispatch` 方法。
   - 最后返回一个新的 Store 实例，其中包含了增强后的 `dispatch` 方法。

4. **`compose` 函数**：
   - `compose` 是一个辅助函数，用于将多个函数组合成一个单一的函数。它按照从右到左的顺序依次执行这些函数。

## 使用示例

### 定义中间件

```javascript
const logger = (storeAPI) => (next) => (action) => {
  console.log("dispatching", action);
  let result = next(action);
  console.log("next state", storeAPI.getState());
  return result;
};

const thunk = (storeAPI) => (next) => (action) =>
  typeof action === "function"
    ? action(storeAPI.dispatch, storeAPI.getState)
    : next(action);
```

### 创建 Store 并应用中间件

```javascript
import { createStore } from "./redux"; // 假设你有一个自定义的 createStore 实现
import rootReducer from "./reducers";
import { applyMiddleware } from "./applyMiddleware"; // 使用上面实现的 applyMiddleware

const store = createStore(rootReducer, applyMiddleware(logger, thunk));

store.dispatch({ type: "INCREMENT" });
// 输出:
// dispatching { type: 'INCREMENT' }
// next state { count: 1 }
```

## 总结

通过手写 `applyMiddleware`，你可以更深入地理解它的内部机制。这个实现虽然简化了某些细节，但涵盖了 `applyMiddleware` 的核心功能：构建和应用中间件链，以增强 Redux 的 `dispatch` 方法。
