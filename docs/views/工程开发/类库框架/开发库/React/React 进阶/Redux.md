### Redux 概述

Redux 是一个用于管理应用状态的库，特别适用于复杂的单页应用程序。它提供了一个集中式存储（Store）来保存整个应用的状态，以及一系列规则来描述如何修改这些状态，确保状态管理的可预测性和可追踪性。

### Redux 核心概念

- **Action**: 描述了发生了什么，是一个普通的 JavaScript 对象，必须包含一个 `type` 字段。
- **Reducer**: 接收当前状态和一个 action，返回新的状态。它是纯函数，没有副作用。
- **Store**: 结合了 Action 和 Reducer，提供了 `dispatch` 方法来分发 Action，以及 `getState` 方法来获取当前状态。
- **Provider**: React 组件，用于将 Store 注入到 React 组件树中。

### 使用 Redux 的基本步骤

1. **安装 Redux**：

   ```bash
   npm install redux
   ```

2. **创建 Action**：

   ```javascript
   const ADD_TODO = "ADD_TODO";

   function addTodo(text) {
     return {
       type: ADD_TODO,
       text,
     };
   }
   ```

3. **创建 Reducer**：

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

4. **创建 Store**：

   ```javascript
   import { createStore } from "redux";

   const store = createStore(todos);
   ```

5. **使用 Provider 和 connect**：

   ```bash
   npm install react-redux
   ```

   ```javascript
   import { Provider } from "react-redux";
   import { connect } from "react-redux";
   import App from "./App";

   const mapStateToProps = (state) => ({
     todos: state,
   });
   const mapDispatchToProps = (dispatch) => ({
     onAddTodo: (text) => dispatch(addTodo(text)), // Action
   });
   // 另一种写法
   const mapDispatchToProps = {
     onAddTodo: addTodo,
   };

   // 使用 connect 将组件与 Redux Store 连接起来
   // connect 函数接受两个参数：mapStateToProps 和 mapDispatchToProps
   // mapStateToProps 函数将 Redux Store 的状态映射到组件的 props
   // mapDispatchToProps 函数将 dispatch 方法映射到组件的 props
   // connect 函数返回一个新的组件，该组件将 Redux Store 的状态和 dispatch 方法作为 props 传递给 App 组件
   // Provider 组件将 Redux Store 注入到 React 组件树中
   const AppContainer = connect(mapStateToProps, mapDispatchToProps)(App);
   /*
    export default function App(props){
        // 通过props 可以获取注入state和action
        const { todos, onAddTodo } = props;
        return (
            <div></div>
        )
    }
    */
   // App
   ReactDOM.render(
     <Provider store={store}>
       <AppContainer />
     </Provider>,
     document.getElementById("root")
   );
   ```

### Redux 的优缺点

**优点**：

- **可预测性**：状态变化由 Action 触发，Action 由 Reducer 确定。
- **可追踪性**：状态变化被记录，便于调试和日志记录。
- **可测试性**：状态变化可被 Action 触发，易于编写测试用例。

**缺点**：

- **学习曲线**：概念和 API 较复杂，需要一定时间学习。
- **性能问题**：全局状态变化可能触发不必要的组件重新渲染。

### 订阅 Store 更新

`subscribe` 方法允许你监听 store 的状态变化。当 store 更新时，你订阅的回调函数会被调用。

```javascript
const store = createStore(rootReducer);
const subscriptionCallback = () => {
  console.log("Store updated:", store.getState());
};
const unsubscribe = store.subscribe(subscriptionCallback);
// 取消订阅
// unsubscribe();
```

### 处理异步操作

在 Redux 中处理异步操作通常需要使用中间件，如 redux-thunk、redux-promise 或 redux-saga。

#### 使用 Redux Thunk

1. **添加 Redux Thunk middleware**：

   ```javascript
   import { createStore, applyMiddleware } from "redux";
   import thunk from "redux-thunk";
   import rootReducer from "./reducers";

   const store = createStore(rootReducer, applyMiddleware(thunk));
   ```

2. **编写带有 Thunk 的 Action Creators**：
   ```javascript
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

#### 使用 Redux Promise

1. **添加 Redux Promise middleware**：

   ```javascript
   import { createStore, applyMiddleware } from "redux";
   import promise from "redux-promise";

   const store = createStore(rootReducer, applyMiddleware(promise));
   ```

2. **编写带有 Promise 的 Action Creators**：
   ```javascript
   export const fetchUsers = () => {
     return fetch("https://api.example.com/users").then((users) => {
       return { type: "FETCH_USERS_SUCCESS", payload: users };
     });
   };
   ```
