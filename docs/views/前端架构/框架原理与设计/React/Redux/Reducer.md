# Reducer

在 Redux 中，**Reducer** 是一个纯函数，它接收当前的状态（`state`）和一个动作（`action`），然后返回新的状态。Reducer 的职责是定义应用程序状态如何响应各种 actions 并产生新的状态。它们是 Redux 应用程序的核心逻辑所在。

## 核心概念

1. **纯函数**：Reducer 必须是一个纯函数，这意味着：
   - 给定相同的输入，总是返回相同的输出。
   - 没有任何副作用（如 API 请求、路由跳转等）。
2. **不可变性**：永远不要直接修改传入的 `state` 对象。而是要创建一个新的对象来表示更新后的状态。
3. **初始状态**：Reducer 通常会有一个默认参数来设置初始状态，当 store 第一次被创建时使用。

## 基本结构

一个简单的 reducer 可能看起来像这样：

```javascript
const initialState = {
  count: 0,
};

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1,
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1,
      };
    default:
      return state;
  }
}
```

在这个例子中，`counterReducer` 接收两个参数：`state` 和 `action`。根据 `action.type` 的不同，它返回了一个新的状态对象。如果 `action.type` 不匹配任何已知的操作，则返回原始状态。

## 处理复杂状态

对于更复杂的应用程序，你可能需要管理多个状态片段。你可以通过组合多个 reducers 来实现这一点。Redux 提供了 `combineReducers` 工具函数来简化这个过程。

```javascript
import { combineReducers } from 'redux';
import todosReducer from './todosReducer';
import counterReducer from './counterReducer';

const rootReducer = combineReducers({
  todos: todosReducer,
  counter: counterReducer,
});

export default rootReducer;
```

这将创建一个新的根 reducer，它将所有子 reducers 的状态合并成一个单一的对象。例如，上面的例子会产生如下结构的状态树：

```json
{
  "todos": {...},
  "counter": {
    "count": 0
  }
}
```

## Best Practices

### 保持 Reducers 纯净

确保你的 reducers 不执行任何副作用，并且只依赖于传入的参数计算新状态。这使得 reducers 更容易测试和维护。

### 使用 Immutable 更新

尽量避免直接修改现有的状态对象。相反，应该使用浅拷贝或深拷贝技术来创建新的状态副本。JavaScript 提供了多种方式来做这件事，比如使用扩展运算符 (`...`) 或者专门的库如 `immer`。

```javascript
import produce from 'immer';

function todoApp(state = initialState, action) {
  return produce(state, draft => {
    switch (action.type) {
      case 'ADD_TODO':
        draft.todos.push({ id: action.id, text: action.text, completed: false });
        break;
      // 其他 cases...
      default:
        break;
    }
  });
}
```

### 拆分 Reducers

随着应用的增长，最好将不同的状态片段交给不同的 reducer 来管理。这样做不仅有助于组织代码，还可以提高性能，因为只有相关的 reducer 会在特定 action 被 dispatch 时重新计算。

### 默认 Case

始终为 reducer 添加一个 `default` 分支，以确保未知类型的 actions 不会意外地改变状态。

## 异常处理

虽然 reducers 应该尽可能简单并且不包含业务逻辑，但在某些情况下你可能需要处理异常情况。例如，当你从异步操作接收到错误时，可以通过适当的 action 类型来更新状态。

```javascript
case 'FETCH_USER_FAILURE':
  return {
    ...state,
    error: action.payload.error,
    loading: false,
  };
```

## 测试 Reducers

由于 reducers 是纯函数，因此它们非常容易测试。你可以编写单元测试来验证给定输入时 reducers 返回预期的结果。

```javascript
test('should handle INCREMENT', () => {
  expect(
    counterReducer({ count: 0 }, { type: 'INCREMENT' })
  ).toEqual({ count: 1 });
});
```

## 总结

Reducers 在 Redux 中扮演着至关重要的角色，它们定义了应用状态的变化规则。遵循最佳实践，保持 reducers 纯粹、可预测，并且易于测试，可以帮助你构建出高效且易于维护的应用程序。