# connected-react-router

`connected-react-router` 是一个用于将 `react-router` 的路由状态与 Redux store 集成的库。它使得你可以在 Redux store 中保存和管理应用的路由信息，从而允许你在整个应用程序中更方便地访问和操作路由状态。这对于需要在多个地方同步路由状态、处理复杂的导航逻辑或实现时间旅行调试等功能的应用非常有用。

## 主要特性

- **同步路由状态**：将 `react-router` 的路由状态（如路径、查询参数等）保存到 Redux store 中。
- **统一的状态管理**：使路由状态成为全局状态的一部分，便于跨组件共享和操作。
- **兼容性好**：支持 `react-router-dom` 和 `react-router-native`，适用于 Web 和 React Native 应用。
- **易于集成**：可以轻松地集成到现有的 dva.js 或 Redux 应用中。

## 安装

你可以通过 npm 或 yarn 安装 `connected-react-router`：

```bash
npm install connected-react-router react-router-dom
# 或者
yarn add connected-react-router react-router-dom
```

## 使用步骤

### 1. 创建 History 对象

首先，你需要创建一个 `history` 对象，这个对象将被传递给 `connected-react-router` 和 `react-router`。

```javascript
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();
```

### 2. 配置 Store

接下来，你需要配置 Redux store 并使用 `connected-react-router` 提供的 reducer 来扩展你的根 reducer。

```javascript
import { createStore, combineReducers } from "redux";
import { connectRouter, routerMiddleware } from "connected-react-router";
import { history } from "./path/to/history"; // 引入之前创建的 history 对象
import exampleReducer from "./reducers/example"; // 假设这是你自己的 reducer

const rootReducer = combineReducers({
  router: connectRouter(history),
  example: exampleReducer,
});

const store = createStore(
  rootReducer,
  applyMiddleware(routerMiddleware(history))
);
```

如果你使用的是 `dva.js`，你可以这样配置：

```javascript
import dva from "dva";
import createHistory from "history/createBrowserHistory";
import "connected-react-router";

const history = createHistory();

const app = dva({
  history,
});

// 加载模型和其他配置
app.model(require("./models/example").default);

// 启动应用
app.start("#root");
```

### 3. 包装 Router 组件

然后，你需要用 `ConnectedRouter` 替换 `BrowserRouter` 或 `HashRouter`。这一步确保了所有的路由变化都会同步到 Redux store。

```javascript
import React from "react";
import { ConnectedRouter } from "connected-react-router";
import { Route, Switch } from "react-router-dom";
import { history } from "./path/to/history"; // 引入之前创建的 history 对象
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
  return (
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/about" component={About} />
      </Switch>
    </ConnectedRouter>
  );
}

export default App;
```

### 4. 访问路由状态

现在，你可以在任何连接到 Redux store 的组件中访问路由状态。例如，使用 `useSelector` Hook：

```javascript
import React from "react";
import { useSelector } from "react-redux";

function LocationDisplay() {
  const location = useSelector((state) => state.router.location);

  return <div>Current Path: {location.pathname}</div>;
}

export default LocationDisplay;
```

或者使用 `connect` HOC：

```javascript
import React from "react";
import { connect } from "react-redux";

function LocationDisplay({ location }) {
  return <div>Current Path: {location.pathname}</div>;
}

const mapStateToProps = (state) => ({
  location: state.router.location,
});

export default connect(mapStateToProps)(LocationDisplay);
```

## 派发导航动作

`connected-react-router` 还提供了几个辅助函数来派发导航动作，如 `push`、`replace` 和 `goBack` 等。你可以直接导入并使用它们：

```javascript
import { push } from "connected-react-router";

// 在组件中使用 useDispatch
import { useDispatch } from "react-redux";

function MyComponent() {
  const dispatch = useDispatch();

  const handleNavigate = () => {
    dispatch(push("/new-path"));
  };

  return <button onClick={handleNavigate}>Go to New Path</button>;
}
```

## 总结

`connected-react-router` 是一个强大的工具，它可以将 `react-router` 的路由状态与 Redux store 集成，从而简化路由状态的管理和操作。对于需要精细控制路由行为或实现复杂导航逻辑的应用来说，这是一个非常好的选择。
