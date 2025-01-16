# useEffect

`useEffect` 是 React 中一个非常重要的 Hook，它允许你在函数组件中执行副作用操作。所谓“副作用”，指的是那些与渲染本身无关的操作，比如数据获取、订阅或手动修改 DOM 等。`useEffect` 提供了一种集中管理这些副作用的方式，并且可以替代类组件中的生命周期方法如 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount`。

## 使用方法

### 基本语法

```jsx
import React, { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  // 类似于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 执行副作用的代码
    document.title = `You clicked ${count} times`;

    // 返回一个清理函数 (可选)
    return () => {
      // 清理副作用的代码
      console.log("Cleanup");
    };
  }, [count]); // 只有当 count 发生变化时才重新执行 effect

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

- **依赖数组**：`useEffect` 的第二个参数是一个依赖项数组。如果省略这个数组，则每次渲染后都会执行副作用；如果提供了一个空数组 (`[]`)，则只会在首次渲染（类似于 `componentDidMount`）和卸载时（类似于 `componentWillUnmount`）执行副作用；如果提供了具体的依赖项，则只有在这些依赖项发生变化时才会重新执行副作用。
- **返回值**：`useEffect` 中返回的函数是用于清理副作用的，类似于 `componentWillUnmount` 或者在更新前清理之前的副作用。这对于取消网络请求、移除事件监听器等非常重要，以避免内存泄漏或其他问题。

### 没有依赖项的效果

如果你希望某个副作用只在组件挂载和卸载时执行，而不关心任何状态或属性的变化，你可以传递一个空数组作为依赖项：

```jsx
useEffect(() => {
  // 组件挂载时执行
  console.log("Component mounted");

  return () => {
    // 组件卸载时执行
    console.log("Component will unmount");
  };
}, []); // 空数组表示仅在首次渲染后执行
```

### 具有依赖项的效果

当你的副作用依赖于某些 props 或 state 时，你可以将它们作为依赖项传递给 `useEffect`，这样每当这些依赖项发生变化时，副作用就会重新运行：

```jsx
useEffect(() => {
  // 当 userId 发生变化时重新加载数据
  fetchUserData(userId);
}, [userId]); // 依赖于 userId
```

## 注意事项

1. **不要在循环、条件或嵌套函数中调用 Hooks**：确保所有对 `useEffect` 和其他 Hooks 的调用都在组件的顶层，以保持每次渲染时的顺序一致。
2. **依赖项数组要准确**：确保你提供的依赖项数组包含了所有影响副作用逻辑的变量。如果遗漏了必要的依赖项，可能会导致副作用不按预期工作。同时，尽量避免不必要的依赖项，因为这会导致副作用过于频繁地执行。
3. **副作用的顺序**：`useEffect` 的执行顺序是在所有的 DOM 更新之后。这意味着你可以安全地读取最新的 DOM 节点来执行副作用。
4. **清理副作用**：对于每个新的副作用执行，React 会先调用之前的清理函数（如果有）。因此，确保你的清理逻辑是幂等的，即多次调用不会产生不同的结果。

## 性能优化

有时你可能不想让 `useEffect` 在每次渲染后都执行，即使它的依赖项发生了变化。为了实现这一点，你可以使用 `useMemo` 或 `useCallback` 来记忆化计算结果或回调函数，从而减少不必要的副作用执行。

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

## 异步操作

处理异步操作时，需要注意的是 `useEffect` 内部不能直接返回一个 Promise，因为它期望的是一个同步的清理函数或者 undefined。如果你需要在 `useEffect` 中处理异步逻辑，应该创建一个异步函数并在 `useEffect` 内部调用它：

```jsx
useEffect(() => {
  async function fetchData() {
    const result = await fetchDataFromServer();
    setData(result);
  }

  fetchData();

  return () => {
    // 清理逻辑（如果有的话）
  };
}, []);
```

## 总结

通过理解 `useEffect` 的工作原理及其最佳实践，你可以更好地决定何时以及如何使用它来管理函数组件的副作用逻辑。`useEffect` 是构建动态和响应式用户界面的重要工具，正确地使用它可以显著提升应用程序的性能和可靠性。
