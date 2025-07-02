# 使用 Redux

使用 Redux 可以帮助你更有效地管理应用的状态，尤其是在处理复杂的嵌套路由和数据流时。

## 1. 安装依赖

安装 Redux 及其相关库：

```bash
npm install redux react-redux
```

## 2. 配置 Redux Store

创建一个 Redux store，并定义 slice 来管理文章数据的状态。这里是一个简单的示例：

### actions

```javascript
// src/store/actions/counter.js
export const actionTypes = {
  INCREMENT: "INCREMENT",
  DECREMENT: "DECREMENT",
};

export function increment() {
  return {
    type: actionTypes.INCREMENT,
  };
}

export function decrement() {
  return {
    type: actionTypes.DECREMENT,
  };
}
```

### reducers

```javascript
// src/store/reducers/counter.js
import { actionTypes } from "../actions/counter";

export default function counter(state = 0, action) {
  switch (action.type) {
    case actionTypes.INCREMENT:
      return state + 1;
    case actionTypes.DECREMENT:
      return state - 1;
    default:
      return state;
  }
}
```

```js
// src/store/reducers/index.js
import counter from "./counter";
import { combineReducers } from "redux";

export default combineReducers({
  counter,
});
```

- **combineReducers**：合并多个 reducer，返回一个根 reducer

### store

```js
// src/store/index.js
import { createStore } from "redux";
import reducer from "./reducers";

let store;

store = createStore(reducer);

export default store;
```

- **createStore(reducer)**：创建 Redux Store。

## 3. 在应用中提供 Redux Store

在你的主应用文件（如`index.js`或`App.js`）中，使用`Provider`将 Redux store 提供给整个应用。

### 客户端

```javascript
import React from "react";
import RouteApp from "@/routes/routeApp";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/store";

export default () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <RouteApp />
      </BrowserRouter>
    </Provider>
  );
};
```

- **Provider store**： 在根组件中包裹 `Provider` 组件，并将 `store` 作为属性传递给 `Provider` 组件。

### 服务端

```jsx
import React from "react";
import RouteApp from "@/routes/routeApp";
import { StaticRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "@/store/index.js";

export default ({ location, context }) => {
  return (
    <Provider store={store}>
      <StaticRouter location={location} context={context}>
        <RouteApp />
      </StaticRouter>
    </Provider>
  );
};
```

- **Provider store**： 在根组件中包裹 `Provider` 组件，并将 `store` 作为属性传递给 `Provider` 组件。

## 4. 在组件中使用 Redux

### `Counter`

```jsx
// src/pages/Counter/index.jsx
import React from "react";
import { actionTypes } from "@/store/actions/counter";
import { connect } from "react-redux";

function Counter({ number, onIncrement, onDecrement }) {
  return (
    <div>
      <h1>Store</h1>
      <button onClick={onDecrement}> 减 </button>
      <strong>{number}</strong>
      <button onClick={onIncrement}> 加 </button>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    number: state.counter,
  };
}

function mapReducerToProps(dispatch) {
  return {
    onIncrement: () => dispatch({ type: actionTypes.INCREMENT }),
    onDecrement: () => dispatch({ type: actionTypes.DECREMENT }),
  };
}

export default connect(mapStateToProps, mapReducerToProps)(Counter);
```

- **mapStateToProps**：将 state 映射到组件的 props 中，即把 state 中的数据映射到组件的 props 中。
- **mapReducerToProps**：将 reducer 映射到组件的 props 中，即把 reducer 中的方法映射到组件的 props 中。
- **connect**：将 state 和 reducer 映射到组件的 props 中，并返回一个新的组件。

在 React 中，使用 Redux 时，通常会使用 connect 函数来连接组件和 Redux 的 store。connect 函数接收两个参数：mapStateToProps 和 mapDispatchToProps。
