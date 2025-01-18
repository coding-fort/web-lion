# 手写 createStore 源码

手写一个简单的 `createStore` 实现可以帮助你更好地理解 Redux 的工作原理。下面是一个简化版的 `createStore` 源码，它实现了 Redux Store 的基本功能：管理状态、处理 actions 和订阅状态变化。

## 简化版 `createStore` 源码

```javascript
function createStore(reducer, preloadedState) {
  // 如果第二个参数是函数，则认为这是 enhancer，需要应用增强器模式
  if (typeof preloadedState === "function") {
    throw new Error("Enhancers are not supported in this simplified version.");
  }

  let currentState = preloadedState;
  let currentListeners = [];
  let nextListeners = currentListeners;
  let isDispatching = false;

  function getState() {
    return currentState;
  }

  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error("Expected the listener to be a function.");
    }

    nextListeners = [...currentListeners, listener];
    return function unsubscribe() {
      nextListeners = nextListeners.filter((l) => l !== listener);
    };
  }

  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(
        "Actions must be plain objects. Use custom middleware for async actions."
      );
    }

    if (typeof action.type === "undefined") {
      throw new Error(
        'Actions may not have an undefined "type" property. Have you misspelled a constant?'
      );
    }

    try {
      isDispatching = true;
      currentState = reducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    currentListeners = nextListeners;
    for (let i = 0; i < currentListeners.length; i++) {
      const listener = currentListeners[i];
      listener();
    }

    return action;
  }

  // 初始化 Store 状态
  dispatch({ type: "@@redux/INIT" });

  return {
    dispatch,
    subscribe,
    getState,
  };
}

// 辅助函数：检查是否为纯对象
function isPlainObject(obj) {
  if (typeof obj !== "object" || obj === null) return false;

  const proto = Object.getPrototypeOf(obj);
  return proto === null || proto === Object.prototype;
}
```

## 解释

1. **初始化**：

   - `currentState` 保存当前的状态。
   - `currentListeners` 是一个数组，用来保存所有的监听器（即订阅者）。
   - `nextListeners` 是 `currentListeners` 的副本，用于在 `subscribe` 和 `unsubscribe` 时更新监听器列表，以避免在遍历过程中修改原始数组。
   - `isDispatching` 是一个标志位，防止在 `dispatch` 过程中再次调用 `dispatch`，从而避免无限循环。

2. **`getState` 方法**：

   - 返回当前的状态。

3. **`subscribe` 方法**：

   - 接受一个监听器函数作为参数，并将其添加到 `nextListeners` 中。
   - 返回一个取消订阅的函数，当调用这个函数时会从 `nextListeners` 中移除对应的监听器。

4. **`dispatch` 方法**：

   - 接受一个 action 对象作为参数，并对其进行基本验证。
   - 调用传入的 reducer 函数来计算新的状态。
   - 更新 `currentState` 并通知所有监听器状态已改变。
   - 返回派发的 action。

5. **初始化**：

   - 在创建 Store 后立即 dispatch 一个特殊的初始化 action (`@@redux/INIT`) 来确保 reducer 至少被调用一次，从而设置初始状态。

6. **辅助函数**：
   - `isPlainObject` 用于检查传入的 action 是否为普通对象，这是为了确保用户不会意外地传递非对象类型的值作为 action。

## 扩展功能

上面的实现是一个非常基础的版本，只涵盖了 Redux Store 的核心功能。实际的 Redux 库还包括了许多额外的功能和优化，例如：

- **中间件支持**：通过 `applyMiddleware` 增强 `dispatch` 功能，允许处理异步逻辑等。
- **组合 Reducer**：通过 `combineReducers` 支持将多个 reducer 组合成一个。
- **增强器（Enhancers）**：如 `compose` 和 `applyMiddleware`，可以用来扩展 Redux 的能力。
- **性能优化**：更高效的监听器管理，以及对不可变数据结构的支持。

如果你想要一个完整的 Redux 实现，建议查看 [Redux 的官方源码](https://github.com/reduxjs/redux)，那里包含了所有这些高级特性和优化。

## 总结

通过手写 `createStore`，你可以深入了解 Redux 的内部机制。尽管这里提供的实现是一个简化的版本，但它已经足以让你理解 Redux Store 的基本工作流程。
