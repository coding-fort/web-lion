# 手写 combineReducers 源码

手写 `combineReducers` 的源码可以帮助你更好地理解它的工作原理。`combineReducers` 是一个辅助函数，用于将多个 reducer 函数组合成一个单一的根 reducer。这使得你可以将应用的状态树分割成多个独立的模块，每个模块有自己的 reducer，但仍然可以通过一个统一的接口来管理整个状态。

下面是一个简化版的 `combineReducers` 源码实现：

## 简化版 `combineReducers` 源码

```javascript
function combineReducers(reducers) {
  // 检查 reducers 是否为对象且不为空
  if (
    typeof reducers !== "object" ||
    reducers === null ||
    Array.isArray(reducers)
  ) {
    throw new Error(
      "Expected the reducers to be an object with several reducer functions as properties."
    );
  }

  const reducerKeys = Object.keys(reducers);
  if (reducerKeys.length === 0) {
    return () => ({});
  }

  // 验证所有的值都是函数
  for (const key of reducerKeys) {
    if (typeof reducers[key] !== "function") {
      throw new Error(`Reducer "${key}" is not a function.`);
    }
  }

  return function combination(state = {}, action) {
    let hasChanged = false;
    const nextState = {};

    for (const key of reducerKeys) {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);

      nextState[key] = nextStateForKey;

      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}
```

## 解释

1. **参数验证**：

   - 首先检查传入的 `reducers` 是否为对象且不为空，并且不是数组。如果不是，则抛出错误。
   - 如果 `reducers` 对象为空，则返回一个总是返回空对象的 reducer 函数。

2. **获取 Reducer 键名**：

   - 使用 `Object.keys` 获取所有 reducer 的键名，并存储在 `reducerKeys` 中。

3. **验证每个 Reducer**：

   - 遍历 `reducerKeys`，确保每个键对应的值都是函数。如果不是，则抛出错误。

4. **创建组合后的 Reducer**：

   - 返回一个新的 reducer 函数（称为 `combination`），该函数接收两个参数：当前状态 `state` 和 action。
   - 初始化 `hasChanged` 标志位为 `false`，用于跟踪是否有任何子状态发生了变化。
   - 创建一个新的 `nextState` 对象来保存更新后的状态。

5. **遍历并调用每个 Reducer**：

   - 对于每个键，获取对应的 reducer 函数、上一次的状态和新的状态。
   - 将新的状态赋值给 `nextState` 对应的键。
   - 如果新旧状态不同，则设置 `hasChanged` 为 `true`。

6. **返回更新后的状态**：
   - 如果 `hasChanged` 为 `true`，则返回 `nextState`；否则返回原始的 `state`。这样做可以避免不必要的状态复制，有助于提高性能。

## 使用示例

### 定义多个 Reducers

```javascript
function todosReducer(state = [], action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { text: action.payload, completed: false }];
    default:
      return state;
  }
}

function counterReducer(state = 0, action) {
  switch (action.type) {
    case "INCREMENT":
      return state + 1;
    case "DECREMENT":
      return state - 1;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  todos: todosReducer,
  counter: counterReducer,
});
```

### 使用组合后的 Reducer

```javascript
import { createStore } from "redux";
import rootReducer from "./rootReducer";

const store = createStore(rootReducer);

console.log(store.getState());
// 输出: { todos: [], counter: 0 }

store.dispatch({ type: "ADD_TODO", payload: "Learn about actions" });
console.log(store.getState());
// 输出: { todos: [{ text: 'Learn about actions', completed: false }], counter: 0 }

store.dispatch({ type: "INCREMENT" });
console.log(store.getState());
// 输出: { todos: [{ text: 'Learn about actions', completed: false }], counter: 1 }
```

## 总结

通过手写 `combineReducers`，你可以更深入地理解它是如何工作的。这个实现虽然简化了某些细节，但涵盖了 `combineReducers` 的核心功能：将多个 reducer 组合成一个单一的根 reducer，以便集中管理应用的状态。
