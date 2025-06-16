# useMemo

`useMemo` 是 React 提供的一个 Hook，它用于记忆化（memoization）计算结果。通过 `useMemo`，你可以避免在每次渲染时都重新计算昂贵的计算结果，从而优化性能。这特别适用于那些依赖于复杂计算、DOM 操作或者其他资源密集型任务的结果，并且这些结果不会经常改变的情况。

## 使用方法

### 基本语法

```jsx
import React, { useMemo } from "react";

function MyComponent({ a, b }) {
  // 只有当 a 或 b 发生变化时才重新计算 expensiveComputation 的结果
  const memoizedValue = useMemo(() => expensiveComputation(a, b), [a, b]);

  return <div>{memoizedValue}</div>;
}

function expensiveComputation(a, b) {
  console.log("Calculating...");
  // 模拟一个耗时的计算过程
  let result = 0;
  for (let i = 0; i < 1e9; i++) {
    result += a + b;
  }
  return result;
}
```

- **`useMemo(fn, deps)`**：
  - **`fn`**：要记忆化的计算函数。
  - **`deps`**：依赖项数组，类似于 `useEffect` 和 `useCallback` 的第二个参数。只有当这些依赖项发生变化时，`useMemo` 才会执行提供的函数并返回新的值；否则，它将返回之前记忆化的版本。

### 为什么需要 `useMemo`

在某些情况下，组件可能会频繁地重新渲染，即使它的输入 props 或状态没有实际的变化。如果组件内部存在昂贵的计算逻辑，每次都重新计算会导致不必要的性能开销。使用 `useMemo` 可以确保只有在依赖项发生变化时才进行计算，从而节省资源和提高应用性能。

### 示例：记忆化昂贵计算

```jsx
import React, { useState, useMemo } from "react";

function HeavyComponent({ items }) {
  // 记忆化对 items 数组的排序操作
  const sortedItems = useMemo(() => {
    console.log("Sorting items...");
    return [...items].sort((a, b) => a - b);
  }, [items]);

  return (
    <ul>
      {sortedItems.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function App() {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([1, 3, 2]);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment count</button>
      <HeavyComponent items={items} />
      <button onClick={() => setItems([4, 5, 6])}>Change items</button>
    </div>
  );
}
```

在这个例子中，`HeavyComponent` 组件中的 `sortedItems` 只有在 `items` 发生变化时才会重新计算。点击“Increment count”按钮不会触发 `sortedItems` 的重新计算，因为 `items` 没有变化。

## 注意事项

1. **不要过度使用 `useMemo`**：虽然它可以减少不必要的计算，但如果你不必要地记忆化每个计算结果，反而可能增加内存占用并降低性能。因此，只对那些确实会导致性能问题的计算使用 `useMemo`。
2. **依赖项管理**：确保传递给 `useMemo` 的依赖项数组是最小且准确的。如果依赖项过多或不正确，可能导致记忆化失效或者引入难以调试的问题。
3. **理解闭包的影响**：记住，`useMemo` 返回的计算函数仍然存在于父组件的作用域中，这意味着它可以访问父组件的所有变量。如果你担心闭包带来的潜在问题，确保你只捕获那些真正需要的变量。
4. **与 `useCallback` 区别**：`useMemo` 主要用于记忆化计算结果，而 `useCallback` 则是用于记忆化回调函数。虽然它们都可以帮助优化性能，但在不同场景下应该选择合适的 Hook 来使用。
5. **考虑初始渲染的成本**：`useMemo` 在首次渲染时仍然会执行计算，所以如果计算非常昂贵，考虑是否可以在首次渲染前完成这个计算，例如通过懒加载或异步加载的方式。

## 性能优化技巧

- **细化依赖项**：尽量减少 `useMemo` 的依赖项数量，只包含那些确实会影响计算结果的状态或属性。
- **稳定 Props**：如果你知道某些 props 不会改变，或者它们的变化不会影响计算结果，考虑将这些 props 移出记忆化的计算之外。

- **组合 Hooks**：根据具体情况，灵活运用 `useMemo`、`useCallback` 和 `React.memo`，找到最佳的性能平衡点。

## 示例：结合 `React.memo` 使用

`useMemo` 经常与 `React.memo` 一起使用来进一步优化子组件的渲染行为。下面是一个结合了 `useMemo` 和 `React.memo` 的例子：

```jsx
import React, { useState, useMemo, memo } from "react";

const ExpensiveChild = memo(({ data }) => {
  console.log("ExpensiveChild rendered");
  return <div>{data}</div>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // 记忆化文本转换结果
  const upperCaseText = useMemo(() => text.toUpperCase(), [text]);

  return (
    <div>
      <p>Count: {count}</p>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={() => setCount(count + 1)}>Increment count</button>
      <ExpensiveChild data={upperCaseText} />
    </div>
  );
}
```

在这个例子中，`ExpensiveChild` 组件被标记为 `memo`，这意味着它只会在其接收的 props 发生变化时重新渲染。由于 `upperCaseText` 是由 `useMemo` 记忆化的，所以除非 `text` 发生变化，否则 `ExpensiveChild` 不会因为接收到新 props 而重新渲染。

## 总结

`useMemo` 是一个非常有用的 Hook，它可以帮助你在构建复杂的应用程序时提高性能和可维护性。通过记忆化计算结果，你可以有效地控制昂贵计算的执行时机，避免不必要的重复计算。然而，就像所有优化工具一样，应该谨慎使用，确保它确实解决了实际存在的性能瓶颈。
