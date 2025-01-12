# Redux

## Redux 是什么

Redux 是一个用于管理应用状态的库，它提供了一种可预测的状态管理方式，使得应用的状态变化更加可追踪和可预测。

<warnb>发布订阅设计模式</warnb>

<bqe>
<warnb>useContext 缺点：</warnb>
1. useContext 只能用于函数组件，不能用于类组件。
2. useContext 需要手动传递 context，如果 context 的值发生变化，需要手动更新 context。
3. useContext 需要手动订阅 context 的变化，如果 context 的值发生变化，需要手动更新组件。
4. 兄弟组件 之间共享状态，需要通过 props 逐层传递，增加了组件之间的耦合度。
</bqe>

<bqe>
<infob>Redux 优点：</infob>
1. Redux 提供了一个全局的 store，用于存储应用的状态。
2. Redux 的状态变化是可预测的，可以通过 Action 和 Reducer 来描述状态的变化。
3. Redux 的状态变化是可追踪的，可以通过 Redux DevTools 来查看状态的变化。
4. Redux 的状态变化是可测试的，可以通过编写测试用例来测试状态的变化。
</bqe>

<bqp>
<prib>Redux 在React 中扮演角色及引出问题</prib>
<br/>1. Redux 扮演统一管理状态的角色；
<br/>2. React 并不知道Redux 什么时候更新了数据，故需要<sucb>通过subscribe 订阅状态更新信息</sucb>
<br/>3. React 并不知道什么时候重新渲染视图，故需要<sucb>将Redux state 转换成React state</sucb>
</bqp>

## Redux 的核心概念

### Action

Action 是一个普通的 JavaScript 对象，它描述了发生了什么。Action 必须有一个 `type` 属性，用于描述 Action 的类型。Action 可以有其他属性，用于传递数据。

### Reducer

Reducer 是一个函数，它接收当前的 state 和一个 action，然后返回一个新的 state。Reducer 的作用是根据 Action 的类型，更新 state。

### Store

Store 是 Redux 的核心，它将 Action、Reducer 和 state 结合在一起。Store 提供了 `dispatch` 方法，用于分发 Action，以及 `getState` 方法，用于获取当前的 state。

### Provider

Provider 是一个 React 组件，它将 Store 传递给 React 组件树。这样，React 组件就可以通过 `connect` 方法连接到 Store，并获取 state 和 dispatch 方法。

## Redux 的使用

1. 安装 Redux

```bash
npm install redux
```

2. 创建 Action

```javascript
const ADD_TODO = "ADD_TODO";

function addTodo(text) {
  return {
    type: ADD_TODO,
    text,
  };
}
```

3. 创建 Reducer

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

4. 创建 Store

```javascript
import { createStore } from "redux";

const store = createStore(todos);
```

5. 使用 Provider 和 connect

```javascript
import { Provider } from "react-redux";
import { connect } from "react-redux";
import App from "./App";

const mapStateToProps = (state) => ({
  todos: state,
});

const AppContainer = connect(mapStateToProps)(App);

ReactDOM.render(
  <Provider store={store}>
    <AppContainer />
  </Provider>,
  document.getElementById("root")
);
```

## Redux 的优点

1. 可预测性：Redux 的状态变化是可预测的，因为每个状态变化都是由 Action 触发的，而 Action 是由 Reducer 确定的。
2. 可追踪性：Redux 的状态变化是可追踪的，因为每个状态变化都会被记录下来，可以通过日志查看状态的变化过程。
3. 可测试性：Redux 的状态变化是可测试的，因为每个状态变化都可以通过 Action 触发，可以通过测试来验证状态的变化是否符合预期。

## Redux 的缺点

1. 学习曲线：Redux 的概念和 API 相对复杂，需要一定的学习成本。
2. 性能问题：Redux 的状态变化是全局的，每次状态变化都会触发整个组件树的重新渲染，可能会导致性能问题。

## 总结

Redux 是一个用于管理应用状态的库，它提供了一种可预测的状态管理方式，使得应用的状态变化更加可追踪和可预测。Redux 的核心概念包括 Action、Reducer 和 Store，它们共同工作，使得应用的状态变化更加可控和可预测。

在 Redux 中，`subscribe` 方法允许你监听 store 的状态变化。每当 store 发生更新时，你订阅的回调函数就会被调用。这对于在全局状态发生变化时执行某些操作非常有用，例如更新组件的 DOM，或者执行某些副作用。

`subscribe` 方法接收一个回调函数作为参数，这个函数会在每次 store 更新后被调用。返回值是一个取消订阅的函数，你可以调用这个函数来停止监听。

### 使用 `subscribe` 的基本步骤：

1. **创建 store**：首先，你需要创建一个 Redux store。

   ```javascript
   import { createStore } from "redux";
   import rootReducer from "./reducers";

   const store = createStore(rootReducer);
   ```

2. **定义订阅回调**：定义一个函数，该函数将在每次 store 更新时被调用。

   ```javascript
   const subscriptionCallback = () => {
     console.log("Store updated:", store.getState());
   };
   ```

3. **订阅 store**：使用 `store.subscribe()` 方法订阅你的回调。

   ```javascript
   const unsubscribe = store.subscribe(subscriptionCallback);
   ```

4. **取消订阅**：如果你想停止监听 store 的变化，你可以调用 `unsubscribe` 函数。

   ```javascript
   // 后续某个时刻...
   unsubscribe();
   ```

### 示例：

```javascript
import { createStore } from "redux";

const initialState = { counter: 0 };

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, counter: state.counter + 1 };
    case "DECREMENT":
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
};

const store = createStore(counterReducer);

const subscriptionCallback = () => {
  console.log("Counter value changed:", store.getState().counter);
};

const unsubscribe = store.subscribe(subscriptionCallback);

// 派发一个 action 来改变状态
store.dispatch({ type: "INCREMENT" });

// 取消订阅
unsubscribe();
```

在实际应用中，`subscribe` 方法通常与 React 组件结合使用，以便在 store 更新时重新渲染组件。然而，React 的 `useEffect` Hook 提供了更现代和简洁的方式来响应 store 的变化，因此在 React 应用中，你可能会更倾向于使用 `useEffect` 和 `react-redux` 库中的 `useSelector` 和 `useDispatch` Hooks 来处理状态更新和副作用，而不是直接在组件中使用 `subscribe`。

### Action

在 Redux 中，Action 是一个普通的 JavaScript 对象，它描述了发生了什么。Action 必须有一个 `type` 属性，用来表示 Action 的类型。Action 可以有其他属性，用来传递数据。

```javascript
const addTodo = (text) => ({
  type: "ADD_TODO",
  text,
});
```

#### 处理异步操作

在 Redux 中，处理异步操作通常需要使用中间件，例如 `redux-thunk`、`redux-promise`或 `redux-saga`。这些中间件允许你在 Action Creator 中执行异步操作，例如发送 AJAX 请求。

<bqs>
<h3>使用 Redux Thunk</h3>
<br/>1. 你需要在创建 store 的时候添加 Redux Thunk middleware。这通常在你的 store 配置文件中完成。

```js
// store/index.js
import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(thunk));
```

```js
// /action/**.js
// 编写带有 Thunk 的 Action Creators
export const fetchUsers = () => {
  return (dispatch) => {
    return fetch("https://api.example.com/users")
      .then((response) => response.json())
      .then((users) => {
        dispatch({ type: "FETCH_USERS_SUCCESS", payload: users });
      })
      .catch((error) => {
        dispatch({ type: "FETCH_USERS_FAILURE", payload: error });
      });
  };
};
```

</bqs>

<bqs>
<h3>使用 Redux Promise</h3>
<br/>1. 你需要在创建 store 的时候添加 Redux Promise middleware。这通常在你的 store 配置文件中完成。

```js
// store/index.js
import { createStore, applyMiddleware } from "redux";
import promise from "redux-promise";
import rootReducer from "./reducers";

const store = createStore(rootReducer, applyMiddleware(promise));
```

```js
// /action/**.js
// 编写带有 Promise 的 Action Creators
export const fetchUsers = () => {
  return fetch("https://api.example.com/users").then((users) => {
    return { type: "FETCH_USERS_SUCCESS", payload: users };
  });
};
```

</bqs>
