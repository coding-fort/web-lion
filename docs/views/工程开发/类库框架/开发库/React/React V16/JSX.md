# JSX

JSX（JavaScript XML）是一种类似于 XML 或 HTML 的语法扩展，它允许你在 JavaScript 中编写类似 HTML 的代码。JSX 最初是由 React 推广的，但请注意，JSX 并不是 React 独有的，也可以与其他库或框架一起使用。以下是关于 JSX 的一些关键点：

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

## 语法特点

- **元素**：在 JSX 中创建的每一个标签都是一个 React 元素。你可以使用自定义组件名作为标签，这将被解析为相应的 React 组件实例。
- **属性**：你可以像在 HTML 中一样为元素添加属性。但是要注意，某些属性名称遵循 camelCase 命名约定，例如`className`用于 CSS 类名，因为`class`是 JavaScript 中的保留字。

- **表达式**：你可以在花括号`{}`内嵌入任何有效的 JavaScript 表达式，包括变量、函数调用、算术运算等。

- **子元素**：你可以直接在标签内部放置子元素，这些子元素可以是文本字符串、其他 JSX 元素或者空格。

- **注释**：JSX 中的注释也必须包含在花括号内，例如`{/* 这是一个注释 */}`。

- **防止代码攻击**：自动编码，使用 `dangerouslySetInnerHTML` 属性来渲染 `HTML` 字符串。

## 编译过程

JSX 不是浏览器原生支持的语法，因此需要通过编译工具（如 Babel）将其转换成普通的 JavaScript 代码。在编译过程中，JSX 会被转换成`React.createElement()`方法调用，这是 React 用来创建元素的底层 API。

## JSX vs HTML

虽然看起来很相似，但 JSX 和 HTML 有几个重要的区别：

- **类名**：由于`class`是 JavaScript 的关键字，所以在 JSX 中你需要使用`className`来指定 HTML 元素的 CSS 类。

- **事件处理**：事件处理器使用驼峰命名法，并且它们传递的是合成事件对象，而不是原始 DOM 事件。例如，`onClick`而不是`onclick`。

- **样式**：如果你想要内联样式，那么样式对象的键应该使用驼峰命名法，并且值应该是数字或字符串。例如，`style=\{\{ color: 'blue', fontSize: 14 \}\}`。

- **布尔属性**：在 HTML 中，布尔属性的存在即代表`true`，而在 JSX 中，你需要显式地设置为`true`或`false`。

## 为什么使用 JSX？

- **直观**：对于许多开发者来说，JSX 更直观，因为它结合了模板语言的优点与 JavaScript 的功能。

- **类型检查**：当使用 `TypeScript` 时，JSX 提供了更好的类型安全性和错误检测。

- **性能优化**：JSX 使得 React 能够实现一些性能优化，比如批处理更新。

- **开发体验**：与传统的模板语言相比，JSX 通常提供更好的开发体验，因为它允许在同一文件中组合标记、逻辑和样式。

总之，JSX 是编写 React 组件的一种非常方便的方式，它简化了 UI 描述，同时保持了 JavaScript 的强大功能。如果你刚开始学习 React，理解 JSX 的基本概念是非常有帮助的。

## JSX 语法规则

JSX（JavaScript XML）是一种语法扩展，它允许你在 JavaScript 文件中编写类似 HTML 的代码。尽管 JSX 看起来像 HTML，但它实际上被编译成普通的 JavaScript 函数调用，通常通过 Babel 编译器转换为 `React.createElement()` 调用。以下是 JSX 的一些主要语法规则：

### 1. 基本结构

- **元素**：JSX 元素可以是自定义组件或原生 DOM 标签。它们以标签形式表示，并且可以包含属性和子元素。

```jsx
const element = <h1>Hello, world!</h1>;
```

### 2. 属性

- **属性命名**：使用驼峰命名法（CamelCase），例如 `className` 代替 `class`、`htmlFor` 代替 `for`， 因为 `class`、`for` 是 JavaScript 的保留关键字。

```jsx
const element = <div className="greeting">Hello, world!</div>;
```

- **布尔属性**：在 JSX 中，布尔属性必须显式设置为 `true` 或 `false`，而不仅仅是存在与否。

```jsx
<input disabled={true} />
```

### 3. 表达式

- **嵌入表达式**：可以在花括号 `{}` 内嵌入任何有效的 JavaScript 表达式，包括变量、函数调用等。

```jsx
const name = "Josh Perez";
const element = <h1>Hello, {name}</h1>;
```

- **条件渲染**：可以使用逻辑运算符来决定是否渲染某个元素。

```jsx
const isLoggedIn = true;
const element = (
  <div>
    The user is <b>{isLoggedIn ? "currently" : "not"}</b> logged in.
  </div>
);
```

- **不会产生输出的情况**：`{}`、`[]`、`null`、`undefined` 和 `false` 不会被 React 渲染为 HTML。

- **普通对象不可作为表达式**

```jsx
// 普通对象 person 不可作为表达式
const person = {
  name: "John Doe",
};
const element = <div>{person}</div>; // 普通对象无法放置，报错
// 数组对象
const person = [1，2，3, null];
const element = <div>{person}</div>; // 数组对象可以放置，输出：1 2 3，null 不会被渲染
```·

- **渲染 HTML 字符串**：使用 `dangerouslySetInnerHTML` 属性来渲染 HTML 字符串。

```jsx
// 注意：使用 dangerouslySetInnerHTML 时，需要确保输入的 HTML 是安全的，否则可能会导致 XSS 攻击。
const element = <div dangerouslySetInnerHTML={{ __html: "<b>Hello!</b>" }} />;
```

<bwe>关键属性：\_\_html</bwe>

### 4. 列表渲染

- **映射数组**：你可以使用 `.map()` 方法遍历数组并创建多个元素。

```jsx
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) => (
  <li key={number.toString()}>{number}</li>
));
```

- **键（Keys）**：每个列表项应该有一个唯一的 `key` 属性，帮助 React 识别哪些元素发生了变化、添加或删除。

```jsx
<li key={uniqueId}>...</li>
```

### 5. 样式

- **内联样式**：可以通过对象传递样式，注意属性名采用驼峰命名法。

```jsx
const divStyle = {
  color: "blue",
  backgroundColor: "lightgray",
};

const element = <div style={divStyle}>Styled div</div>;
// 外层花括号表示表达式，内层花括号表示对象
const element = <div style={{ color: "blue" }}>Styled div</div>;
```

### 6. 注释

- **注释**：JSX 中的注释也必须包含在花括号内。

```jsx
const element = (
  <div>
    {/* 这是一个注释 */}
    <p>This is a paragraph.</p>
  </div>
);
```

### 7. 自定义组件

- **首字母大写**：自定义组件名称必须以大写字母开头，以便与 DOM 标签区分开来。

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const element = <Welcome name="Sara" />;
```

### 8. JSX 返回值

- **单个根元素**：JSX 表达式必须返回一个单一的根元素。如果需要返回多个兄弟元素，可以使用 `<></>`（Fragment）来包裹它们。

```jsx
const element = (
  <>
    <h1>Title</h1>
    <p>Paragraph one</p>
    <p>Paragraph two</p>
  </>
);
```

### 9. JSX 不是必需的

虽然 JSX 提供了更直观的方式编写 UI 结构，但它并不是 React 的必要组成部分。你也可以直接使用 `React.createElement()` 来构建元素树，但 JSX 更加简洁易读。

```jsx
// 使用 JSX
const element = <h1>Hello, world</h1>;

// 不使用 JSX
const element = React.createElement("h1", null, "Hello, world");
```

### 10.元素不可变

在 React 中，元素是不可变的。一旦创建了元素，就不能修改其属性。如果需要修改元素，必须创建一个新的元素。

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

### 嵌入表达式

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
