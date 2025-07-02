# React 副作用代码

在 React 中，**副作用代码**（side effect code）指的是那些与组件的渲染逻辑不直接相关的操作。这些操作可能包括但不限于数据获取、订阅或手动修改 DOM。由于副作用通常涉及到外部状态或资源，它们可能会导致不可预测的行为，如果在渲染过程中执行的话。因此，React 提供了专门的 API 来处理副作用，确保它们不会干扰正常的渲染流程。

## 什么是副作用？

副作用是指除了返回 JSX 之外的所有其他操作。以下是一些常见的副作用示例：

- **数据获取**：从服务器加载数据。
- **订阅**：监听某个事件源的变化。
- **计时器**：设置定时器或间隔函数。
- **DOM 操作**：直接操作 DOM 元素。
- **日志记录**：记录信息到控制台。
- **路由变化**：处理导航和路由更新。

## 处理副作用的方式

### 类组件中的生命周期方法

在类组件中，副作用通常通过特定的生命周期方法来处理，如 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount`。这些方法提供了在组件挂载、更新和卸载时执行副作用的机会。

```jsx
class DataFetching extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
  }

  componentDidMount() {
    // 组件挂载后执行副作用
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => this.setState({ data }));
  }

  render() {
    return <div>{this.state.data ? this.state.data : "Loading..."}</div>;
  }
}
```

### 函数组件中的 `useEffect` Hook

随着 React Hooks 的引入，函数组件也可以方便地处理副作用。`useEffect` Hook 是用于执行副作用的主要工具。它允许你在函数组件中模拟类组件的生命周期方法，并且可以更灵活地控制何时触发副作用。

```jsx
import React, { useState, useEffect } from "react";

function DataFetching() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 执行副作用
    let isMounted = true; // 防止内存泄漏

    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setData(data);
        }
      });

    return () => {
      // 清理副作用
      isMounted = false;
    };
  }, []); // 空数组表示仅在首次渲染时执行

  return <div>{data ? data : "Loading..."}</div>;
}

export default DataFetching;
```

在这个例子中：

- `useEffect` 在组件挂载后执行一次，模拟了 `componentDidMount` 的行为。
- 返回的清理函数会在组件卸载前调用，确保没有未完成的网络请求或其他需要清理的资源。
- 如果依赖项数组为空（`[]`），则 `useEffect` 只会在首次渲染时执行；如果有依赖项，则当这些依赖项发生变化时也会重新执行。

### 控制副作用的时机

你可以通过向 `useEffect` 提供一个依赖项数组来控制何时触发副作用。例如：

- **空数组 `[]`**：仅在首次渲染时执行。
- **包含某些状态或属性的数组**：只有当这些状态或属性发生变化时才执行。

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 变化时更新文档标题
```

## 副作用的最佳实践

1. **分离关注点**：将副作用代码与纯渲染逻辑分开，使组件更易于理解和维护。
2. **避免不必要的副作用**：只在确实需要的时候执行副作用，减少不必要的计算和网络请求。
3. **使用适当的 Hook**：根据你的需求选择合适的 Hook，比如 `useEffect`、`useLayoutEffect` 或者自定义 Hook。
4. **考虑清理逻辑**：确保为每个副作用提供相应的清理逻辑，以防止内存泄漏或其他潜在问题。
5. **理解同步 vs 异步**：知道哪些副作用是同步的（如 DOM 操作），哪些是异步的（如网络请求），并相应地处理它们。

## 示例：组合多个副作用

有时候你可能需要在一个组件中处理多个不同的副作用。你可以通过创建多个 `useEffect` 调用来实现这一点：

```jsx
import React, { useState, useEffect } from "react";

function MultiEffects() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState(null);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  }, [count]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        if (isMounted) {
          setData(data);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []); // 仅在首次渲染时执行

  return (
    <div>
      <p>{data ? data : "Loading..."}</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

export default MultiEffects;
```

在这个例子中：

- 第一个 `useEffect` 仅在 `count` 变化时更新文档标题。
- 第二个 `useEffect` 在组件挂载后执行一次，用于获取数据，并且有清理逻辑以防止内存泄漏。

## 总结

处理副作用是构建响应式和交互式用户界面的重要部分。通过合理地使用 React 提供的 API（如类组件的生命周期方法或函数组件的 `useEffect` Hook），你可以有效地管理副作用，确保应用程序既高效又可靠。
