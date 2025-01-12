# 组件和 Props

## 一、组件

组件是 React 的核心，组件可以理解为页面的组成部分，比如页面头部，页面底部，页面主体等。React 中组件分为函数组件和类组件。

### 1. 函数组件

函数组件是一个返回 React 元素的函数，函数组件的名称必须以大写字母开头。

```jsx
function MyComponent() {
  return <h1>Hello, world!</h1>;
}
```

### 2. 类组件

类组件是一个继承自 React.Component 的类，类组件的名称必须以大写字母开头。

```jsx
class MyComponent extends React.Component {
  render() {
    return <h1>Hello, world!</h1>;
  }
}
```

<bqe>
<errb>函数组件与类组件区别：</errb>
<br/>1. 函数组件更简洁，更易读。
<br/>2. 类组件可以访问组件的状态和生命周期方法。
<br/>3. 函数组件更适合函数式编程，类组件更适合面向对象编程。
<br/>4. 函数组件的性能更高，因为函数组件没有生命周期方法。
<br/>
</bqe>

### 3. 组件插槽

组件插槽（Slots）是 React 提供的一种用于组件内容传递的方式。组件插槽可以用于传递任意内容，包括文本、HTML、组件等。

```jsx
function MyComponent() {
  return (
    <div>
      <h1>Hello, world!</h1>
      <p>This is a paragraph.</p>
      {/* 组件预留空间 */}
      {this.props.children}
      {/* 组件插槽 */}
      <slot></slot>
    </div>
  );
}
ReactDOM.render(
  <MyComponent>
    <p>This is a slot content.</p>
  </MyComponent>,
  document.getElementById("root")
);
```

在上面的例子中，`MyComponent` 组件有一个插槽，可以在插槽中传递任意内容。
<errb>注意：</errb>插槽内容只能在组件的 JSX 中使用，不能在组件的 render 方法中使用。
<errb>插槽内容可以是任意类型，包括文本、HTML、组件等。</errb>
<errb>插槽内容可以包含多个元素，但只能有一个根元素。</errb>

### 4. 错误边界

错误边界（Error Boundaries）是 React 提供的一种用于捕获和处理组件渲染过程中的错误的机制。错误边界可以用于捕获组件渲染过程中的错误，并显示一个备用 UI，而不是让整个应用崩溃。

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志记录到错误报告服务
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

// 使用时，包住需要捕获错误的组件
<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>;
```

### 5. 高阶组件

高阶组件（Higher-Order Components，简称 HOC）是 React 提供的一种用于组件复用的机制。高阶组件是一个函数，接收一个组件作为参数，返回一个新的组件。高阶组件可以用于复用组件的逻辑，也可以用于增强组件的功能。

```jsx
function withExtraProps(WrappedComponent) {
  return function (props) {
    return <WrappedComponent {...props} extraProp="extra" />;
  };
}

class MyComponent extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

const MyComponentWithExtraProps = withExtraProps(MyComponent);

ReactDOM.render(
  <MyComponentWithExtraProps name="world" />,
  document.getElementById("root")
);
```

#### 带参数高阶组件

```jsx
function withExtraProps(extraProps) {
  return function (WrappedComponent) {
    return function (props) {
      return <WrappedComponent {...props} {...extraProps} />;
    };
  };
}

const MyComponentWithExtraProps = withExtraProps({ extraProp: "extra" })(
  MyComponent
);
```

## 二、Props

Props 是组件的属性，用于组件之间的数据传递。Props 是<errb>只读的</errb>，不能在组件内部修改。Props 可以通过组件的属性传递给子组件。

```jsx
// 函数组件
function MyComponent(props) {
  return <h1>Hello, {props.name}!</h1>;
}
// 类组件
class MyComponent extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

ReactDOM.render(<MyComponent name="world" />, document.getElementById("root"));
```

在上面的例子中，`MyComponent` 组件接收一个 `name` 属性，并将其显示在页面上。

## 三、PropTypes 类型检测

PropTypes 是 React 提供的一个用于类型检测的库，可以用于检测组件的 props 类型是否正确。PropTypes 可以在开发过程中帮助开发者发现错误。

```jsx
import PropTypes from "prop-types";

function MyComponent(props) {
  return <h1>Hello, {props.name}!</h1>;
}

MyComponent.propTypes = {
  name: PropTypes.string.isRequired,
};
```

在上面的例子中，`MyComponent` 组件的 `name` 属性必须是一个字符串，并且是必需的。如果 `name` 属性的类型不是字符串，或者 `name` 属性没有传递，React 会给出警告。

### 1. PropTypes 其他类型检测：

```jsx
PropTypes.array; // 数组
PropTypes.bool; // 布尔值
PropTypes.func; // 函数
PropTypes.number; // 数字
PropTypes.object; // 对象
PropTypes.string; // 字符串
PropTypes.symbol; // 符号
PropTypes.node; // 节点
PropTypes.element; // 元素
PropTypes.elementType; // 元素类型
PropTypes.instanceOf(构造函数); // 实例
PropTypes.oneOf(数组); // 数组中的一个
PropTypes.oneOfType(数组); // 数组中的一个或多个
PropTypes.arrayOf(PropTypes.类型); // 数组中的每个元素都是指定类型
PropTypes.objectOf(PropTypes.类型); // 对象中的每个值都是指定类型
PropTypes.shape(对象); // 对象的每个属性都是指定类型
PropTypes.exact(对象); // 对象的每个属性都是指定类型，并且不能有其他属性
```

### 2. PropTypes 默认值：

```jsx
MyComponent.defaultProps = {
  name: "world",
};
```

在上面的例子中，如果 `MyComponent` 组件的 `name` 属性没有传递，那么 `name` 属性的默认值就是 `"world"`。

### 3. PropTypes 组合类型：

```jsx
PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
```

在上面的例子中，`MyComponent` 组件的 `name` 属性可以是字符串或者数字。

## 四、Refs

Refs 是 React 提供的一个用于访问 DOM 元素或者组件实例的属性。Refs 可以通过 `React.createRef()` 创建，然后通过 `ref` 属性将其绑定到组件上。

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {
    console.log(this.myRef.current); // 输出 DOM 元素
  }

  render() {
    return <div ref={this.myRef}>Hello, world!</div>;
  }
}
```

在上面的例子中，`MyComponent` 组件的 `myRef` 属性是一个 `React.createRef()` 创建的 Ref 对象，然后通过 `ref` 属性将其绑定到 `div` 元素上。在 `componentDidMount` 生命周期方法中，可以通过 `this.myRef.current` 访问 `div` 元素。

### 1. Refs 与类组件：

在类组件中，可以通过 `this.refs` 访问 Ref 对象。

```jsx
class MyComponent extends React.Component {
  render() {
    return <div ref="myRef">Hello, world!</div>;
  }
}

// 在类组件中，可以通过 this.refs 访问 Ref 对象
console.log(this.refs.myRef);
```

### 2. Refs 与函数组件：

在函数组件中，可以通过 `useRef` Hook 访问 Ref 对象。

```jsx
import React, { useRef } from "react";
function MyComponent() {
  const myRef = useRef();
  console.log(myRef.current); // 输出 DOM 元素
  return <div ref={myRef}>Hello, world!</div>;
}
```

### 3. Refs 传递

Refs 不能通过 props 传递给子组件。如果需要将 Ref 传递给子组件，可以通过 `React.forwardRef` 实现。

```jsx
// 组件定义变更成React.forwardRef形式，而不是extends React.Components
const MyComponent = React.forwardRef((props, ref) => {
  return <div ref={ref}>Hello, world!</div>;
});

// 在父组件中，可以通过 ref 属性将 Ref 传递给子组件
const myRef = React.createRef();
<MyComponent ref={myRef} />;
```

在上面的例子中，`MyComponent` 组件通过 `React.forwardRef` 将 Ref 传递给了 `div` 元素。在父组件中，可以通过 `ref` 属性将 Ref 传递给 `MyComponent` 组件。
