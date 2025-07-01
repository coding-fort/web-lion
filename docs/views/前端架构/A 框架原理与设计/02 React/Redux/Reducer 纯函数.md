# Reducer 纯函数

Redux 中的 reducer 必须是一个纯函数，这是为了确保 Redux 应用的状态更新是可预测、一致且易于调试的。以下是纯函数的特点以及为什么这些特点对 Redux 至关重要：

## 纯函数的特点

1. **相同的输入总是产生相同的输出**：给定相同的参数，纯函数将始终返回相同的结果。这保证了在 Redux 中，对于特定的 action 和 state，reducer 将始终计算出相同的新状态。

2. **没有副作用**：纯函数不会引起任何外部变化（如修改全局变量、执行网络请求或直接操作 DOM）。这意味着 reducer 不会改变其接收的状态对象，而是返回一个全新的状态对象。

3. **不依赖外部状态或环境**：纯函数仅基于传入的参数进行计算，而不依赖于函数体之外的任何其他数据。这样可以避免意外的行为和难以追踪的错误。

## 为什么 Redux Reducer 需要是纯函数

### 1. 可预测性

由于纯函数总是根据相同的输入产生相同的输出，你可以确信每次 dispatch 相同的 action 时，都会得到相同的状态更新。这对于构建可靠的 UI 和测试代码非常重要。

### 2. 易于测试

纯函数非常容易编写单元测试。你只需提供固定的输入并验证输出是否符合预期，而无需担心函数内部的操作或外部状态的影响。例如：

```javascript
import todosReducer from "./reducers/todosReducer";

test("todosReducer handles ADD_TODO", () => {
  expect(
    todosReducer([], { type: "ADD_TODO", payload: "Learn about actions" })
  ).toEqual([{ text: "Learn about actions", completed: false }]);
});
```

### 3. 简化调试

当所有状态更新都通过纯函数实现时，调试变得更加简单。你可以轻松地回溯每个状态变更的历史记录，并理解应用程序是如何从一个状态过渡到另一个状态的。此外，像 `redux-devtools` 这样的工具可以有效地利用这一点来提供时间旅行调试功能。

### 4. 免除并发问题

因为纯函数不会修改传入的对象，所以它们是线程安全的。即使多个异步操作同时发生，也不会导致竞态条件或其他并发问题。这对于处理复杂的用户交互或后台任务尤其重要。

### 5. 支持不可变性

使用纯函数鼓励采用不可变的数据结构。在 Redux 中，这通常意味着创建新的状态副本而不是直接修改旧的状态。不可变性有助于防止意外的状态变更，并使得状态管理更加透明和可靠。

## 实践中的注意事项

- **不要直接修改传入的状态**：总是返回一个新的状态对象，而不是修改现有的对象。

  ```javascript
  function todosReducer(state = [], action) {
    switch (action.type) {
      case "ADD_TODO":
        return [...state, { text: action.payload, completed: false }];
      // ...
      default:
        return state;
    }
  }
  ```

- **使用辅助库**：为了简化不可变更新逻辑，可以考虑使用像 `immer` 这样的库，它允许你以更直观的方式编写不可变更新代码。

  ```javascript
  import produce from "immer";

  const todosReducer = produce((draft, action) => {
    switch (action.type) {
      case "ADD_TODO":
        draft.push({ text: action.payload, completed: false });
        break;
      // ...
    }
  }, []);
  ```

- **保持函数独立**：尽量让 reducer 函数只依赖于传入的参数，而不依赖外部变量或状态。

## 总结

Redux 的 reducer 是应用状态的核心管理者，它们必须是纯函数以确保状态更新的一致性和可靠性。通过遵循纯函数的原则，你可以构建出更容易理解和维护的应用程序，同时也为高效的测试和调试提供了坚实的基础。
