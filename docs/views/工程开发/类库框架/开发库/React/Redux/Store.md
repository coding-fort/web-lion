# Store
在 Redux 中，**Store** 是应用程序状态（state）的唯一数据源。它负责持有应用的状态、允许访问状态、允许状态更新以及注册和注销监听器。Redux Store 是整个 Redux 应用程序的核心，所有对状态的读取和修改都必须通过 Store 来进行。

## 核心概念

1. **单一 Store**：Redux 推荐使用单个 store 来管理整个应用程序的状态。这有助于简化状态管理和确保状态的一致性。
2. **不可变性**：Store 中的状态是只读的，不能直接修改。所有的状态变更都必须通过分发（dispatch）actions 来触发，并由 reducers 处理这些 actions 以生成新的状态。
3. **纯函数 Reducers**：Reducer 函数是纯函数，它们接收当前状态和 action，然后返回新的状态对象。Reducer 不会改变原始状态，而是返回一个全新的状态副本。
4. **中间件**：可以增强 Store 的功能，例如处理异步逻辑（如 `redux-thunk` 或 `redux-saga`）、日志记录（如 `redux-logger`）等。

## 创建 Store

要创建一个 Redux Store，你需要使用 `createStore` 函数，并传入一个 reducer 函数作为参数。如果需要，还可以传递初始状态和其他增强器（如中间件）。

```javascript
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './reducers'; // 导入你的根 reducer
import thunk from 'redux-thunk'; // 如果你打算使用 redux-thunk

const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // 应用中间件
);
```

如果你有多个 reducers，可以使用 `combineReducers` 将它们组合成一个根 reducer：

```javascript
import { createStore, combineReducers, applyMiddleware } from 'redux';
import todosReducer from './todosReducer';
import counterReducer from './counterReducer';

const rootReducer = combineReducers({
  todos: todosReducer,
  counter: counterReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(thunk)
);
```

## Store API

Redux Store 提供了几个关键的方法来与之交互：

1. **getState()**
   - 获取当前的状态树。
   - 返回值为最新的 state 对象。
   
   ```javascript
   const currentState = store.getState();
   ```

2. **dispatch(action)**
   - 发送一个 action 到 Store，触发状态更新。
   - 参数是一个 action 对象或返回 action 的函数（当使用像 `redux-thunk` 这样的中间件时）。
   
   ```javascript
   store.dispatch({ type: 'INCREMENT' });
   ```

3. **subscribe(listener)**
   - 注册一个监听器函数，在每次状态变化后调用。
   - 返回一个取消订阅的函数。
   
   ```javascript
   const unsubscribe = store.subscribe(() => {
     console.log('State changed:', store.getState());
   });

   // 取消订阅
   unsubscribe();
   ```

4. **replaceReducer(nextReducer)**
   - 替换当前使用的 reducer 函数。
   - 主要用于热重载开发环境或动态加载模块。
   
   ```javascript
   store.replaceReducer(newReducer);
   ```

## 使用 Provider 组件 (React)

当你在 React 应用中使用 Redux 时，通常会结合 `react-redux` 库中的 `Provider` 组件来将 Store 提供给整个组件树。

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import store from './store'; // 导入上面创建的 store

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

这样做的好处是，任何嵌套在 `<Provider>` 内部的组件都可以访问到 Redux Store，而无需显式地传递 Store 实例。

## 配置 DevTools

为了方便调试，你可以集成 Redux DevTools Extension。这个工具可以帮助你追踪每个 action 和对应的状态变化，回滚到之前的状态，甚至可以在时间线上进行“旅行”。

```javascript
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './reducers';

// 检查浏览器是否安装了 Redux DevTools Extension
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);
```

这段代码会在开发环境中自动启用 Redux DevTools，而在生产环境中则忽略它。

## 总结

Redux Store 是 Redux 应用程序的核心，它集中管理应用程序的状态，确保状态的单一来源和一致性。通过使用 `createStore`、`dispatch`、`subscribe` 等方法，你可以有效地控制和响应应用程序的状态变化。此外，结合中间件和开发者工具，可以使状态管理更加灵活和强大。