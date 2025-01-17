# Redux 核心概念

Redux 是一个用于 JavaScript 应用的状态管理库，最初是为 React 应用设计的，但也可以与其他视图库或框架一起使用。它帮助开发者通过集中管理和维护应用的状态来构建可预测的数据流和一致的应用行为。以下是 Redux 的核心概念：

## 1. 单一数据源（Single Source of Truth）

- **概念**：整个应用的状态被存储在一个单一的对象树中，这个对象树被称为“store”。所有的状态变更都必须通过唯一的方式进行。
- **优点**：简化了状态管理，使得调试和跟踪状态变化更加容易。

## 2. 状态是只读的（State is Read-Only）

- **概念**：你永远不能直接修改 state。每当需要改变状态时，必须显式地触发一个动作（action），然后由 reducer 函数处理这个动作并返回新的状态。
- **好处**：确保所有状态的变化都是可追踪的，并且可以很容易地回溯到之前的状态。

## 3. 使用纯函数改变状态（Changes are Made with Pure Functions）

- **概念**：状态的更新是由叫做 reducers 的纯函数完成的。Reducer 接收当前状态和一个 action，根据 action 类型计算出新状态，并返回它。
- **特性**：
  - Reducers 必须是纯函数，即相同的输入总是产生相同的输出，且没有任何副作用（如 API 请求、路由跳转等）。
  - Reducers 只能基于传入的参数计算结果，不应依赖外部变量或随机数生成器等非确定性因素。

## 核心组件

### Store

- **作用**：保存应用的整个状态树。它是全局唯一的，意味着每个应用只有一个 store。
- **方法**：
  - `getState()`：获取当前状态。
  - `dispatch(action)`：分发一个 action 给 reducer 处理。
  - `subscribe(listener)`：添加一个监听器，在每次状态更改后调用。

### Action

- **定义**：Action 是一个普通 JavaScript 对象，用来描述发生了什么事件。它至少包含一个 `type` 属性，标识该 action 的类型。通常还会携带额外的 payload 数据。

```javascript
const ADD_TODO = 'ADD_TODO';
{
  type: ADD_TODO,
  text: 'Build my first Redux app'
}
```

### Reducer

- **定义**：Reducer 是一个纯函数 `(state, action) => newState`，接收旧的状态和一个 action，返回新的状态。对于未处理的动作类型，默认返回原始状态。

```javascript
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false,
        },
      ];
    default:
      return state;
  }
}
```

### Middleware

- **定义**：中间件是用来增强 store 的功能的插件系统。它们可以在 action 被 dispatch 后但在到达 reducer 之前执行一些操作，例如日志记录、异步逻辑处理等。
- **例子**：常见的中间件包括 `redux-thunk`（允许 dispatch 函数而不是 plain actions）、`redux-saga`（用于管理复杂的异步流程）以及 `redux-logger`（用于打印 actions 和状态变化）。

## 工作流程

1. **Dispatch an Action**：当用户与 UI 交互或者程序内部发生某些事件时，会创建一个新的 action 并通过 `store.dispatch()` 发送到 store。
2. **Store Calls the Reducer Function**：Store 收到 action 后，将当前状态和 action 传递给根 reducer 函数。
3. **State is Updated**：Root reducer 根据接收到的 action 和当前状态计算出新的状态。
4. **UI Updates**：Store 中的状态发生变化后，会通知所有订阅它的组件重新渲染。

## 结合 React 使用

在 React 中，通常会结合 `react-redux` 库来连接 Redux store 和 React 组件。这可以通过以下几种方式实现：

- **Provider**：包裹整个应用，提供对 Redux store 的访问。
- **useSelector**：从 Redux store 中选择部分状态并在组件中使用。
- **useDispatch**：获取 dispatch 方法以发送 actions。
- **connect**（已逐步淘汰）：一种更传统的 HOC 方式来连接 React 组件和 Redux store。

## 总结

Redux 提供了一套简洁而强大的工具集来管理应用程序的状态。通过遵循其三大原则——单一数据源、状态不可变性和纯函数式的状态转换——开发者可以获得更好的可预测性和更容易维护的应用架构。
