# useRef

`useRef` 是 React 提供的一个 Hook，它允许你在函数组件中创建一个可变的引用对象。这个引用对象在其 `.current` 属性上保存了一个值，并且这个值在组件的整个生命周期内保持不变。与状态（state）不同的是，使用 `ref` 更新 `.current` 的值不会触发组件重新渲染。这使得 `useRef` 成为管理那些不需要引起界面更新的数据的理想选择。

## 使用方法

### 基本语法

```jsx
import React, { useRef } from "react";

function MyComponent() {
  const myRef = useRef(initialValue);

  return <div>{/* 使用 ref */}</div>;
}
```

- **`const myRef = useRef(initialValue);`**：
  - **`initialValue`**：这是你希望 `ref` 在首次渲染时持有的初始值。之后，你可以通过 `myRef.current` 来访问或修改这个值。

### 访问 DOM 元素

`useRef` 最常见的用途之一是获取对 DOM 元素的直接引用，从而可以在不触发重新渲染的情况下操作这些元素。

```jsx
import React, { useRef } from "react";

function TextInputWithFocusButton() {
  const inputEl = useRef(null);

  const onButtonClick = () => {
    // `current` 指向已挂载到 DOM 上的文本输入元素
    inputEl.current.focus();
  };

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

在这个例子中，我们使用 `useRef` 创建了一个名为 `inputEl` 的引用对象，并将其赋值给 `<input>` 元素的 `ref` 属性。然后，我们可以通过调用 `inputEl.current.focus()` 来聚焦该输入框，而不需要触发组件的重新渲染。

### 保持组件内部数据

除了用于访问 DOM 节点外，`useRef` 还可以用来存储任何能在组件实例之间共享的数据。这对于保存计数器、定时器 ID 或者其他类型的临时状态非常有用。

```jsx
import React, { useEffect, useRef } from "react";

function Timer() {
  const intervalRef = useRef();

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      console.log("Ticking every second");
    }, 1000);

    // 清理定时器
    return () => clearInterval(intervalRef.current);
  }, []);

  return <div>Check the console for ticks.</div>;
}
```

在这个例子中，`intervalRef` 用来保存由 `setInterval` 返回的定时器 ID。这样做可以确保我们在组件卸载时正确地清理定时器，避免内存泄漏。

### 自定义 Hooks 中的 `useRef`

当你构建自定义 Hook 时，`useRef` 可以帮助你保留某些值而不触发重新渲染。例如，如果你想跟踪一个组件是否已经加载过数据，可以使用 `useRef`：

```jsx
import React, { useState, useEffect, useRef } from "react";

function useHasMounted() {
  const hasMountedRef = useRef(false);

  useEffect(() => {
    hasMountedRef.current = true;
  }, []);

  return hasMountedRef.current;
}

function DataFetchingComponent() {
  const [data, setData] = useState(null);
  const hasMounted = useHasMounted();

  useEffect(() => {
    if (hasMounted) {
      fetch("/api/data")
        .then((response) => response.json())
        .then(setData);
    }
  }, [hasMounted]);

  return data ? <pre>{JSON.stringify(data, null, 2)}</pre> : "Loading...";
}
```

在这个例子中，`useHasMounted` Hook 使用 `useRef` 来跟踪组件是否已经挂载。这有助于防止在初次渲染时发起不必要的数据请求。

## 注意事项

1. **不要将 `ref` 传递给函数组件**：`ref` 应该只传递给类组件或 DOM 元素。如果你尝试将 `ref` 直接传递给函数组件，React 将会忽略它。为了使函数组件能够接收 `ref`，你需要使用 `forwardRef`。

   ```jsx
   import React, { useRef, forwardRef } from "react";

   const CustomInput = forwardRef((props, ref) => (
     <input ref={ref} {...props} />
   ));

   function ParentComponent() {
     const inputRef = useRef(null);

     return <CustomInput ref={inputRef} />;
   }
   ```

2. **理解闭包的影响**：由于 `useRef` 的值在组件的整个生命周期内都保持不变，因此它可以捕获外部作用域中的变量。然而，这也意味着如果这些变量发生变化，`useRef` 内部的闭包可能不会反映最新的值。在这种情况下，你可能需要结合 `useEffect` 或其他机制来确保你总是使用最新值。

3. **性能优化**：虽然 `useRef` 不会触发重新渲染，但在某些情况下，频繁地更新 `ref.current` 仍然可能导致性能问题。确保你只在必要时更新引用值，并考虑是否有更高效的方式来实现相同的功能。

4. **与 `useCallback` 和 `useMemo` 结合使用**：有时候你可能想要缓存某些计算结果或者回调函数，但又不想因为它们的变化而触发重新渲染。这时可以考虑将 `useRef` 与 `useCallback` 或 `useMemo` 结合起来使用。

## 总结

`useRef` 是一个非常有用的 Hook，它提供了对 DOM 元素和组件内部数据的直接访问方式，同时不会触发不必要的重新渲染。合理使用 `useRef` 可以让你的代码更加简洁、易于维护，并且在某些场景下显著提高应用性能。
