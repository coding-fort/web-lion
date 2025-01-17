# Immutable Updates

在 Redux 中使用不可变更新（Immutable Updates）是确保状态管理一致性和避免意外副作用的关键实践。直接修改状态对象可能会导致难以追踪的 bug 和不一致的状态。为了保持 Redux 的不可变性原则，我们应该总是返回新的状态副本，而不是直接修改旧的状态。

## 不可变更新的重要性

- **预测性**：每次 state 变更都是基于前一个状态和 action 计算得出的新状态，这使得应用程序的行为更加可预测。
- **性能优化**：通过浅比较新旧状态，React 等框架可以跳过不必要的重新渲染。
- **调试容易**：不可变更新有助于更好地利用开发者工具（如 Redux DevTools），因为每个状态变更都清晰可见。

## 手动实现不可变更新

对于简单的状态结构，你可以使用 JavaScript 内置的方法来手动创建新的状态副本：

### 对象的浅拷贝

```javascript
const newState = {
  ...state,
  key: newValue,
};
```

### 数组的浅拷贝

```javascript
const newState = [...state, newItem];
```

然而，当涉及到嵌套对象或数组时，手动处理深层拷贝会变得复杂且容易出错。这时可以考虑使用专门的库来简化这一过程。

## 使用 `immer` 库简化不可变更新

`immer` 是一个非常流行的库，它允许你以“可变”的方式编写代码，但实际上它会在幕后自动产生不可变的状态更新。这大大简化了复杂的更新逻辑，并减少了出错的机会。

### 安装 `immer`

首先安装 `immer`：

```bash
npm install immer
```

### 使用 `produce` 函数

`immer` 提供了一个 `produce` 函数，它接收当前状态和一个“recipe”函数作为参数。在这个 recipe 函数内部，你可以像操作可变数据一样修改状态，而 `produce` 会负责生成一个新的不可变状态副本。

```javascript
import produce from "immer";

function todosReducer(state = [], action) {
  return produce(state, (draft) => {
    switch (action.type) {
      case "ADD_TODO":
        draft.push({ id: nextTodoId++, text: action.payload });
        break;
      case "TOGGLE_TODO":
        const todo = draft.find((t) => t.id === action.payload);
        if (todo) todo.completed = !todo.completed;
        break;
      default:
      // Nothing to do here
    }
  });
}
```

在这个例子中，我们用 `produce` 包裹了 reducer 的逻辑。这样即使我们在 `draft` 上进行了看似“可变”的操作（例如 `push` 和 `find` 后修改属性），实际上 `produce` 会确保返回的是一个全新的状态副本。

## 使用 `redux-immutable` 或其他不可变库

如果你想要强制所有状态都必须是不可变的数据结构，还可以考虑使用 `redux-immutable` 或者 Facebook 的 `immutable-js` 库。这些库提供了丰富的 API 来操作不可变的数据结构，但它们的学习曲线可能比 `immer` 更陡峭。

### 安装 `immutable-js`

```bash
npm install immutable
```

### 使用 `immutable-js`

```javascript
import { Map } from "immutable";

const initialState = Map({
  count: 0,
});

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "INCREMENT":
      return state.set("count", state.get("count") + 1);
    case "DECREMENT":
      return state.set("count", state.get("count") - 1);
    default:
      return state;
  }
}
```

虽然 `immutable-js` 提供了强大的不可变数据结构支持，但在现代 JavaScript 中，`immer` 由于其简洁性和易用性，已经成为更为流行的选择。

## 总结

不可变更新是 Redux 应用程序中保持状态一致性的重要手段。通过遵循不可变原则，我们可以构建出更加健壮、易于调试的应用。对于简单的情况，可以使用 JavaScript 内置的解构赋值等特性进行浅拷贝；而对于更复杂的状态结构，推荐使用 `immer` 这样的库来简化不可变更新的过程。
