# State 管理

## 一、State 定义

```jsx
class Data extends Component {
    constructor(props) {
        super(props);
        // 响应式数据，只能组件内使用，访问：this.state.**
        this.state = {
            count: 0
        };
    }
    // 非响应式数据，只能组件内使用，访问：this.**
    num = 100;
    // 简写方式
    state = {
        count: 0;
    }
}
```

## 二、State 更新

### 1.异步修改-对象语法

```jsx
// 异步更新，state.coutn = 0
this.setState({ count: this.state.count + 5 });
console.lot(this.state.count); // 0
```

### 2.异步修改-函数方式

```jsx
// 通过回掉函数可以获取异步值，state.coutn = 5
this.setState({ count: this.state.count + 5 }, () => {
  console.log(this.state.count); // 5
});
```

<bqe>
<errb>注意：</errb>
<br/>1. 当遇到宏任务（<sucb>setInterval、setTimeout</sucb>）和微任务（<sucb>Promise</sucb>），会变成同步。
<br/>2. 出于性能考虑，React 会把多个setState 调用合并成一个调用，并取最后一次。
</bqe>

### 3. 同步修改

```jsx
// 同步修改
this.setState((prevState, props) => ({
  count: prevState.count + 5,
}));
```

## 三、State 传递

```jsx
// 父组件
class Parent extends Component {
  state = {
    count: 0,
  };
  render() {
    return <Child count={this.state.count} />;
  }
}
// 子组件
class Child extends Component {
  render() {
    return <div>{this.props.count}</div>;
  }
}
```

## 四、State 修改

```jsx
// 父组件
class Parent extends Component {
  state = {
    count: 0,
  };
  render() {
    return (
      <Child
        count={this.state.count}
        onClick={() => this.setState({ count: this.state.count + 1 })}
      />
    );
  }
}
// 子组件
class Child extends Component {
  render() {
    return <div onClick={this.props.onClick}>{this.props.count}</div>;
  }
}
```

## 五、State 传递与修改结合

```jsx
// 父组件
class Parent extends Component {
  state = {
    count: 0,
  };
  render() {
    return <Child count={this.state.count} onAdd={this.onAdd} />;
  }
  onAdd = () => {
    this.setState({ count: this.state.count + 1 });
  };
}
// 子组件
class Child extends Component {
  render() {
    return <div onClick={this.props.onAdd}>{this.props.count}</div>;
  }
}
```

## 六、状态提升

当多个组件需要反映相同的变化数据时，建议将共享状态提升到它们共同的父组件中去。
<bqp>
<prib>优点：</prib>
<br/>1. <b>避免重复状态</b>：状态提升可以防止在多个组件中重复声明相同的状态，这有助于保持代码的清晰和可维护性。
<br/>2. <b>统一状态管理</b>：所有的状态变更都在一个地方处理，这使得状态的追踪和调试变得更加容易。
<br/>3. <b>组件复用性</b>：子组件不再需要关心状态的管理，这使得它们更加纯粹和易于复用。
</bqp>
<bqp>
<prib>步骤：</prib>
<br/>1. <b>识别共享状态</b>：首先，你需要确定哪些状态是多个组件共享的。如果两个或多个组件需要访问和改变同一个数据，那么这个数据应该被提升。
<br/>2. <b>创建状态</b>：在共同的父组件中创建状态。可以使用 useState Hook（对于函数组件）或者 this.state（对于类组件）来定义状态。
<br/>3. <b>传递状态</b>：将状态作为 props 传递给需要它的子组件。这样，子组件就可以通过 props 访问这个状态值。
<br/>4. <b>提供更新机制</b>：为了允许子组件修改状态，你需要在父组件中创建一个更新状态的方法，并将其作为 prop 传递给子组件。子组件可以通过调用这个方法来触发状态的更新。
</bqp>

## 七、Context

React Context API 是 React 提供的一种在组件树中传递数据的机制，它允许你在不使用 prop-drilling（逐层传递 props）的情况下，向下传递数据和回调函数。Context 主要用于解决深层次嵌套组件间的状态共享问题，以及跨组件传递回调函数的情况。

### Context API 的主要组成部分：

1. **`React.createContext`**：这是一个工厂函数，用于创建一个新的 Context 对象。这个对象拥有一个 `Consumer` 和一个 `Provider`。

2. **`Provider`**：这是一个 React 组件，它接收一个名为 `value` 的 prop，用来向下传递数据。所有 `Provider` 的子组件都可以访问这个 `value`。

3. **`Consumer`**：这是一个 React 组件，它接收一个函数作为子组件，这个函数将在渲染时接收来自最近的 `Provider` 的 `value`。`Consumer` 允许你订阅 Context 的变化。

4. **`useContext` Hook**：这是 React 16.8 引入的一个 Hook，用于在函数组件中消费 Context。它接受一个 Context 对象并返回当前组件树中最近的 `Provider` 提供的值。

### 使用 Context 的示例：

首先，创建一个 Context：

```jsx
import React, { createContext } from "react";

const ThemeContext = createContext();
```

然后，在顶层组件中使用 `Provider`：

```jsx
import React, { useContext } from "react";
import ThemeContext from "./ThemeContext";

function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Toolbar />
    </ThemeContext.Provider>
  );
}
```

在需要使用这个 Context 的组件中，你可以使用 `Consumer` 或者 `useContext` Hook：

使用 `Consumer`：

```jsx
function Toolbar(props) {
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <div>
          <ThemedButton theme={theme} />
        </div>
      )}
    </ThemeContext.Consumer>
  );
}
```

使用 `useContext` Hook：

```jsx
function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button
      style={{
        background: theme === "dark" ? "black" : "white",
        color: theme === "dark" ? "white" : "black",
      }}
    >
      I am styled by context!
    </button>
  );
}
```

### Context 的注意事项：

- **性能考虑**：由于 Context 的工作原理，如果 `Provider` 的 `value` 发生变化，所有使用这个 Context 的下游组件都会重新渲染。因此，如果你的 Context 包含大量的数据或者频繁变化，需要谨慎使用，考虑性能优化，比如使用 `React.memo` 或者 `useMemo`。

- **层级限制**：Context 只能在它被创建的函数作用域内使用，不能在不同的文件或者模块中共享同一个 Context 对象。

- **命名冲突**：在组件树的不同部分使用相同名称的 Context 可能会导致意外的行为，因为 React 会认为它们是同一个 Context。

Context API 是 React 中一个强大的特性，它极大地简化了状态管理和回调函数的传递，但同时也需要合理使用以避免潜在的性能问题。
