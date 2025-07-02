# useDebugValue

`useDebugValue` 是 React 提供的一个 Hook，主要用于增强自定义 Hook 的调试体验。它允许你在 React DevTools 中为自定义 Hook 添加一个显示标签，从而更容易理解该 Hook 当前的状态或值。这对于开发和调试复杂的自定义 Hook 非常有用。

## `useDebugValue` 的基本用法

`useDebugValue` 接受两个参数：

1. **当前值**：你想要在 DevTools 中显示的值。
2. **格式化函数（可选）**：一个用于将值转换为更易读格式的函数，特别是在值是对象或复杂数据结构的情况下。

```jsx
useDebugValue(value, [formatFunction]);
```

## 示例代码

### 基本示例

假设我们有一个自定义 Hook 来跟踪用户的在线状态，并且我们想在 DevTools 中显示这个状态：

```jsx
import { useState, useEffect, useDebugValue } from "react";

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  }, [friendID]);

  // 在 DevTools 中显示友好的信息
  useDebugValue(isOnline ? "Online" : "Offline");

  return isOnline;
}
```

在这个例子中，当我们在 DevTools 中查看组件树时，可以看到每个使用了 `useFriendStatus` 的地方都附带了一个标签，指示该朋友当前是“Online”还是“Offline”。

### 使用格式化函数

如果你的 Hook 返回的是一个复杂的数据结构，你可以通过提供第二个参数来定制其显示方式：

```jsx
import { useState, useEffect, useDebugValue } from "react";

function useComplexState(initialState) {
  const [state, setState] = useState(initialState);

  useDebugValue(state, (state) => {
    if (typeof state === "object") {
      return JSON.stringify(state, null, 2); // 格式化对象为字符串
    }
    return state;
  });

  return [state, setState];
}

function ComplexComponent() {
  const [complexState, setComplexState] = useComplexState({
    count: 0,
    name: "Alice",
  });

  return (
    <div>
      <pre>{JSON.stringify(complexState, null, 2)}</pre>
      <button
        onClick={() =>
          setComplexState((prev) => ({ ...prev, count: prev.count + 1 }))
        }
      >
        Increment Count
      </button>
    </div>
  );
}
```

在这个例子中，`useDebugValue` 使用了一个格式化函数来将复杂的状态对象转换成易于阅读的 JSON 字符串，这使得在 DevTools 中查看状态变得更加直观。

## 注意事项

- **仅用于开发环境**：`useDebugValue` 只在开发环境中起作用，在生产构建中会被忽略，因此不会影响应用性能。
- **不影响逻辑**：它只是用来改善调试体验，不会对 Hook 的实际行为产生任何影响。
- **不要依赖于 `useDebugValue`**：因为它不是为了控制应用程序的行为而设计的，所以不应该在你的业务逻辑中依赖它。

## 总结

`useDebugValue` 是一个简单但强大的工具，可以帮助开发者更好地理解和调试自定义 Hook。通过为 Hook 提供有意义的标签，它简化了开发过程中的调试工作，尤其是在处理复杂状态或逻辑时。
