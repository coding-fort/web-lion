# 手写 bindActionCreators 源码

手写 `bindActionCreators` 的源码可以帮助你更好地理解它的工作原理。`bindActionCreators` 是一个辅助函数，用于将 action creators 绑定到 `dispatch` 函数上，这样你可以直接调用这些函数而不需要每次都手动传递 `dispatch`。

下面是一个简化版的 `bindActionCreators` 源码实现：

## 简化版 `bindActionCreators` 源码

```javascript
function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === "function") {
    // 如果传入的是单个 action creator，则直接绑定 dispatch
    return (...args) => dispatch(actionCreators(...args));
  }

  if (typeof actionCreators !== "object" || actionCreators === null) {
    throw new Error(
      "bindActionCreators expected an object or a function, instead received " +
        (actionCreators === null ? "null" : typeof actionCreators) +
        '. Did you write "bindActionCreators(ActionCreators, dispatch)" instead of "bindActionCreators(ActionCreators, dispatch)"?'
    );
  }

  const boundActionCreators = {};

  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === "function") {
      // 对每个 action creator 进行绑定
      boundActionCreators[key] = (...args) => dispatch(actionCreator(...args));
    }
  }

  return boundActionCreators;
}
```

## 解释

1. **处理单个 Action Creator**：

   - 如果 `actionCreators` 参数是一个函数（即单个 action creator），则直接返回一个新的函数，该函数在调用时会使用 `dispatch` 来派发由 `actionCreator` 创建的 action。

2. **检查参数类型**：

   - 如果 `actionCreators` 不是对象或函数，则抛出错误。这确保了传入的参数符合预期，并且可以捕获常见的错误用法。

3. **遍历并绑定多个 Action Creators**：

   - 如果 `actionCreators` 是一个对象，则遍历该对象中的所有属性。
   - 对于每个属性，如果它是函数（即 action creator），则创建一个新的函数，该函数在调用时会使用 `dispatch` 来派发由 `actionCreator` 创建的 action。
   - 将这些新的函数添加到 `boundActionCreators` 对象中。

4. **返回绑定后的 Action Creators**：
   - 最后返回 `boundActionCreators` 对象，其中包含了所有已经绑定到 `dispatch` 的 action creators。

## 使用示例

### 单个 Action Creator

```javascript
import { bindActionCreators } from './bindActionCreators'; // 假设你将上面的代码保存为 bindActionCreators.js
import { addTodo } from './actions';

const dispatch = /* 获取 dispatch 函数 */;

// 绑定单个 action creator
const boundAddTodo = bindActionCreators(addTodo, dispatch);

// 使用绑定后的 action creator
boundAddTodo('Learn about actions'); // 相当于 dispatch(addTodo('Learn about actions'))
```

### 多个 Action Creators

```javascript
import { bindActionCreators } from './bindActionCreators';
import * as todoActionCreators from './actions/todoActions';

const dispatch = /* 获取 dispatch 函数 */;

// 绑定多个 action creators
const boundActionCreators = bindActionCreators(todoActionCreators, dispatch);

// 使用绑定后的 action creators
boundActionCreators.addTodo('Learn about actions'); // 相当于 dispatch(addTodo('Learn about actions'))
boundActionCreators.toggleTodo(1); // 相当于 dispatch(toggleTodo(1))
```

## 总结

通过手写 `bindActionCreators`，你可以更深入地理解它的内部机制。这个实现虽然简单，但涵盖了 `bindActionCreators` 的核心功能：将 action creators 绑定到 `dispatch` 上，以便可以直接调用这些函数而不需要每次都手动传递 `dispatch`。
