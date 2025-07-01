# <errb>React Router v5</errb>

`React Router v5` 是一个用于在 React 应用中管理路由的库，它允许开发者定义应用的不同页面或视图，并根据 URL 的变化来显示相应的组件。虽然 `React Router` 已经发布了第 6 版本，但许多项目仍在使用 `v5`，因为它提供了稳定的功能和广泛的社区支持。以下是关于 `React Router v5` 的一些关键概念和组件介绍。

## 主要组件

### 1. `<BrowserRouter>` (或 `<HashRouter>`, `<MemoryRouter>`)

这是最外层的路由容器组件，它为应用提供了一个路由环境。选择不同的路由器取决于你的需求：

- **`<BrowserRouter>`**：使用 HTML5 History API (`pushState`, `replaceState`) 来管理浏览器历史记录。
- **`<HashRouter>`**：使用 URL 的哈希部分 (`#`) 来模拟页面变化。
- **`<MemoryRouter>`**：将历史状态保存在内存中，适用于非浏览器环境。

```jsx
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
      </Switch>
    </Router>
  );
}
```

### 2. `<Route>`

`<Route>` 组件定义了 URL 模式和相应组件之间的映射关系。每个 `<Route>` 都有一个 `path` 属性来指定 URL 模式，以及一个 `component` 或 `render` 属性来指定要渲染的内容。`exact` 属性确保路径完全匹配时才渲染组件。

#### 动态路径参数

你可以通过在路径中添加冒号（`:paramName`）来定义动态路径参数，并在组件内部使用 `match.params` 获取这些参数。

```jsx
<Route path="/user/:id" component={User} />
```

#### 渲染属性

`<Route>` 提供了几种方式来控制如何渲染匹配的组件：

- **`component`**：直接传递一个组件类或函数组件。
- **`render`**：接收一个返回 JSX 的函数，可以访问 `match`, `location`, 和 `history`。
- **`children`**：总是渲染子元素，但是会传递 `match` 对象作为 props，这允许你基于是否匹配来做条件渲染。

### 3. `<Switch>`

`<Switch>` 是一个逻辑组件，它负责匹配当前 URL 并渲染第一个匹配的 `<Route>`。如果没有任何匹配，则不会渲染任何内容。`<Switch>` 确保只有一个路由被激活，避免了多个匹配的问题。

```jsx
<Switch>
  <Route path="/" exact component={Home} />
  <Route path="/about" component={About} />
  <Route path="/contact" component={Contact} />
</Switch>
```

### 4. `<Link>` 和 `<NavLink>`

这两个组件用于创建导航链接，使用户能够在不同页面之间切换而不刷新整个页面。

- **`<Link>`**：普通的导航链接。
- **`<NavLink>`**：带有激活样式（如 `activeClassName` 或 `style`）的导航链接。

```jsx
import { Link, NavLink } from "react-router-dom";

<nav>
  <ul>
    <li>
      <Link to="/">Home</Link>
    </li>
    <li>
      <NavLink to="/about" activeClassName="selected">
        About
      </NavLink>
    </li>
    <li>
      <NavLink to="/contact" activeClassName="selected">
        Contact
      </NavLink>
    </li>
  </ul>
</nav>;
```

### 5. 导航和重定向

- **`<Redirect>`**：用于实现编程式的导航或重定向。它可以替代旧版本中的手动设置 `window.location`。

```jsx
<Route path="/old-path" render={() => <Redirect to="/new-path" />} />
```

- **`withRouter` Higher-Order Component (HOC)**：用于将 `history`, `location`, 和 `match` 作为 props 注入到非路由组件中，使其能够执行编程式的导航操作。

```jsx
import { withRouter } from "react-router-dom";

function GoBackButton({ history }) {
  return <button onClick={() => history.goBack()}>Go Back</button>;
}

export default withRouter(GoBackButton);
```

## 示例代码

以下是一个完整的例子，展示了如何结合上述组件来构建一个简单的单页应用：

```jsx
import React from "react";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";

const Home = () => <h2>Home</h2>;
const About = () => <h2>About</h2>;
const Contact = () => <h2>Contact</h2>;
const User = ({ match }) => <h2>User Profile: {match.params.id}</h2>;

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>
            <li>
              <Link to="/user/123">User 123</Link>
            </li>
          </ul>
        </nav>

        {/* Render the appropriate component based on the current URL */}
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/user/:id" component={User} />
          <Route render={() => <h2>Not Found</h2>} /> {/* 404 页面 */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;
```

## 总结

`React Router v5` 提供了一套强大且灵活的 API 来处理单页应用中的路由管理。通过理解并正确使用这些路由组件，你可以轻松地构建出功能丰富、用户体验良好的应用程序。
