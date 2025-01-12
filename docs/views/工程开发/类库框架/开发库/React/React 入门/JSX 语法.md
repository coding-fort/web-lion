# JSX 语法

## 初识 React

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Example</title>

    <!-- 引入开发版本 -->
    <script
      crossorigin
      src="https://unpkg.com/react@18/umd/react.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"
    ></script>

    <!-- 或者引入生产版本 -->
    <!-- <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script> -->

    <!-- 引入Babel在线转换器（仅用于不支持ES6语法的浏览器） -->
    <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>
  </head>
  <body>
    <!-- 定义一个容器用于挂载React组件 -->
    <div id="root"></div>

    <!-- 在页面底部执行React代码 -->
    <script type="text/babel">
      // 你的React代码放在这里
      class Hello extends React.Component {
        render() {
          return <h1>Hello, world!</h1>;
        }
      }

      ReactDOM.render(<Hello />, document.getElementById("root"));
    </script>
  </body>
</html>
```

## 为什么使用 JSX

JSX 是 JavaScript 的语法扩展，它允许你在 JavaScript 代码中编写类似 HTML 的代码。React 使用 JSX 来描述 UI 的结构，使得代码更加直观和易于理解。
JSX 是 React 的核心特性之一，它使得 React 组件的编写更加直观和易于理解。通过使用 JSX，我们可以将 HTML 和 JavaScript 代码混合在一起，使得代码更加简洁和易于维护。

## JSX 语法规则

1. JSX 语法中，所有的 HTML 标签必须闭合，例如 `<div></div>` 或 `<img />`。
2. JSX 语法中，所有的属性必须使用引号包裹，例如 `class` 属性必须写成 `className`，因为 `class` 是 JavaScript 的保留字。
3. JSX 语法中，所有的组件必须以大写字母开头，例如 `<Hello />`。
4. JSX 语法中，所有的组件必须有一个根元素，例如 `<div><Hello /></div>`。

## JSX 语法示例

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
```

## 在脚手架中使用 JSX

在脚手架中，我们不需要手动引入 React 和 ReactDOM，因为它们已经包含在脚手架中。我们只需要在组件中编写 JSX 代码即可。例如：

```jsx
import React from "react";
import ReactDOM from "react-dom";

function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
```

## 元素渲染

React 元素是构成 React 应用的最小单位。元素描述了你在屏幕上看到的内容。

```jsx
const element = <h1>Hello, world</h1>;
```

### 嵌入

JSX 可以包含 JavaScript 表达式。在 JSX 语法中，我们可以在<errb>大括号 {}</errb> 中放置任何有效的 JavaScript 表达式。例如：

```jsx
function formatName(user) {
  return user.firstName + " " + user.lastName;
}

const user = { firstName: "Harper", lastName: "Perez" };

const element = <h1>Hello, {formatName(user)}!</h1>;
```

### 元素不可变性

React 元素是不可变的。当元素被创建之后，你不能改变其内容。如果你想要更新元素，你需要创建一个新的元素，并将其渲染到 DOM 中。例如：

```jsx
function tick() {
  const element = (
    <div>
      <h1>Hello, world!</h1>
      <h2>It is {new Date().toLocaleTimeString()}.</h2>
    </div>
  );
  ReactDOM.render(element, document.getElementById("root"));
}

setInterval(tick, 1000);
```

### 数组

JSX 允许我们将数组作为子元素。当数组作为子元素时，React 会对数组中的每个元素进行遍历，并将它们渲染到 DOM 中。例如：

```jsx
// map
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) => <li>{number}</li>);

  return <ul>{listItems}</ul>;
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById("root")
);
```

### 特殊属性名

在 JSX 中，我们使用 camelCase 命名属性，例如 `class` 属性必须写成 `className`，因为 `class` 是 JavaScript 的保留字。例如：

```jsx
const element = <div className="myDiv">Hello, world!</div>;
```

在 JSX 中，我们使用 `htmlFor` 替代 `for`，因为 `for` 是 JavaScript 的保留字。例如：

```jsx
<label htmlFor="username">Username</label>
```

## 条件渲染

在 React 中，我们可以使用条件渲染来根据不同的条件渲染不同的组件。例如：

```jsx
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}

function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}

ReactDOM.render(
  <Greeting isLoggedIn={false} />,
  document.getElementById("root")
);
```

## 内联样式

在 React 中，我们可以使用内联样式来为元素添加样式，使用<errb>双大括号{{}}</errb>。例如：

```jsx
const element = <div style={{ color: "red" }}>Hello, world!</div>;
```
