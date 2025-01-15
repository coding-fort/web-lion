# <sucb>[React 16+ 加入]</sucb> componentDidCatch(error, errorInfo)

`componentDidCatch` 是 React 类组件中的一个生命周期方法，它在后代组件抛出错误后被调用。这个方法是错误边界（error boundaries）的一部分，用于捕获发生在其子组件树中的 JavaScript 错误，并且可以记录这些错误或显示回退的用户界面（UI）。与 `getDerivedStateFromError` 一起使用时，它可以提供一种优雅的方式处理和响应应用程序中的未捕获错误。

## 方法签名

```jsx
componentDidCatch(error, errorInfo);
```

- **`error`**：捕获到的错误对象。
- **`errorInfo`**：包含组件堆栈信息的对象，有助于调试错误来源。

## 使用场景

### 记录错误信息

你可以利用 `componentDidCatch` 来捕获并记录错误信息，例如发送错误日志到服务器或者使用第三方服务进行错误跟踪。

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 以便下一次渲染可以显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 你可以将错误报告给服务器
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

在这个例子中，当子组件抛出错误时，`getDerivedStateFromError` 会更新状态以改变 UI，而 `componentDidCatch` 则负责记录错误信息。

### 显示回退 UI

除了记录错误外，你还可以在 `componentDidCatch` 中执行其他逻辑，比如显示一个友好的错误消息或回退界面。虽然通常这种逻辑是在 `render` 方法中根据状态变化来实现的，但 `componentDidCatch` 可以用来触发任何必要的副作用。

```jsx
componentDidCatch(error, errorInfo) {
  // 更新日志或分析工具
  logErrorToMyService(error, errorInfo);

  // 如果需要立即更新 UI，可以通过 setState 强制重新渲染
  this.setState({ hasError: true });
}
```

## 注意事项

1. **仅适用于类组件**：`componentDidCatch` 只能在类组件中使用。如果你使用的是函数组件，请考虑使用 `React.ErrorBoundary` 组件或者自定义 Hook 来实现类似的功能。
2. **不能捕获事件处理器中的错误**：错误边界不会捕获事件处理器、异步代码（如 `setTimeout` 或 `requestAnimationFrame`）、服务器端渲染过程中发生的错误，以及原生浏览器事件处理程序中的错误。
3. **避免在错误边界内再次引发错误**：确保在 `componentDidCatch` 中处理好所有可能的情况，不要再次引发新的错误，否则会导致难以调试的问题。
4. **幂等性**：尽量使 `componentDidCatch` 的操作是幂等的，即多次调用不会产生不同的结果。这有助于应对严格模式下的双重调用情况。

## 函数组件中的替代方案

对于函数组件，React 提供了内置的 `ErrorBoundary` 组件，也可以通过创建高阶组件（Higher Order Component, HOC）或自定义 Hook 来实现类似的错误边界功能。

### 使用 `React.ErrorBoundary`

```jsx
import { ErrorBoundary } from "react";

function MyComponent() {
  return (
    <ErrorBoundary fallback={<h1>Something went wrong.</h1>}>
      {/* 子组件 */}
    </ErrorBoundary>
  );
}
```

### 创建自定义 Hook

```jsx
import React, { useState, useEffect } from "react";

function useErrorHandler(defaultFallbackUI) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (error, errorInfo) => {
      console.error("Error caught by hook:", error, errorInfo);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleError);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleError);
    };
  }, []);

  if (hasError) {
    return defaultFallbackUI;
  }

  return null;
}

function MyComponent() {
  const errorUI = useErrorHandler(<h1>Something went wrong.</h1>);

  if (errorUI) {
    return errorUI;
  }

  // 正常渲染逻辑...
}
```

## 总结

通过理解 `componentDidCatch` 的工作原理及其最佳实践，你可以更好地决定何时以及如何使用它来管理组件的错误边界逻辑。确保在应用程序中正确地处理错误是构建健壮和用户友好型 React 应用程序的重要部分。
