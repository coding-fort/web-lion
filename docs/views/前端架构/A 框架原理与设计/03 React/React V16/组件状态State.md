# 组件状态 State

在 React 中，组件的状态（State）是一个对象，它存储了影响组件渲染的数据。状态是私有的，并且完全受控于组件本身。状态的变化会触发组件的重新渲染，使得用户界面能够响应用户的交互、服务器响应或任何其他变化。

## 状态的特点

- **私有性**：每个组件都有自己的状态，不能直接访问另一个组件的状态。
- **动态更新**：当状态改变时，React 会自动重新渲染组件以反映最新的状态。
- **不可变性**：状态应该是不可变的，即不应该直接修改状态对象，而是应该使用 `setState` 方法来更新状态。

## 定义和使用 State

### 类组件中的 State

在类组件中，你可以通过构造函数或者类属性初始化状态：

```jsx
import React, { Component } from "react";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 }; // 在构造函数中初始化状态
  }

  increment = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>Increment</button>
      </div>
    );
  }
}

export default Counter;
```

### 函数组件中的 State (Hooks)

从 React 16.8 开始，引入了 Hooks，允许你在不编写类的情况下使用状态和其他 React 特性。`useState` 是一个内置 Hook，用于添加状态到函数组件：

```jsx
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // 使用 useState 初始化状态

  const increment = () => {
    setCount((prevCount) => prevCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}

export default Counter;
```

## 更新 State

- **类组件**：使用 `this.setState()` 方法更新状态。这个方法接收一个新的状态对象作为参数，或者接收一个返回新状态对象的函数。推荐使用函数形式来确保状态更新基于前一个状态进行。

- **函数组件**：使用由 `useState` 返回的更新函数（如上面例子中的 `setCount`）。同样地，如果你需要基于当前状态计算新的状态值，可以传递一个函数给更新函数。

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

### 4.组件间传递

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

## 状态提升

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

## 注意事项

- **不要直接修改 state**：直接修改状态不会触发组件的重新渲染，这可能会导致难以调试的问题。始终使用 `setState` 或者对应的 Hook 更新函数来更新状态。
- **批量更新**：React 可能会批量处理多个 `setState` 调用以提高性能。因此，在某些情况下，你可能不会立即看到状态的更新结果。

- **异步性质**：`setState` 不是同步执行的，这意味着如果你尝试读取更新后的状态，它可能不会立刻反映出最新的值。为了确保获取到最新状态，请使用回调函数或 `useEffect`（对于函数组件）。

通过正确地管理组件的状态，你可以构建出响应式的用户界面，这些界面可以根据数据的变化而自动调整。如果你有关于状态管理的具体问题或需要进一步的帮助，请随时提问！
