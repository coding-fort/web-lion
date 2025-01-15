# useContext

`useContext` 是 React 提供的一个 Hook，用于在函数组件中订阅 React 的上下文（Context）。它允许你访问由 `React.createContext` 创建的 Context 对象中的值，并且可以在不使用 props 传递的情况下，在组件树中共享这些值。这有助于减少“props drilling”的问题，即避免将 props 从父组件一层层向下传递到深层嵌套的子组件。

## 使用方法

### 基本语法

```jsx
import React, { useContext } from "react";
import { MyContext } from "./MyContext"; // 导入上下文对象

function MyComponent() {
  const contextValue = useContext(MyContext);

  return (
    <div>
      {/* 使用 contextValue */}
      <p>{contextValue.message}</p>
    </div>
  );
}
```

- **`useContext(MyContext)`**：通过传递上下文对象给 `useContext`，你可以获取该上下文中提供的最新值。每次上下文值发生变化时，所有使用 `useContext` 订阅该上下文的组件都会重新渲染。

### 创建和提供上下文

首先，你需要创建一个上下文对象并将其提供给需要它的组件。这通常是在应用程序的顶层完成的。

```jsx
// 创建上下文对象
const MyContext = React.createContext(defaultValue); // defaultValue 是可选的默认值

// 提供上下文值
function App() {
  return (
    <MyContext.Provider value={{ message: "Hello from Context!" }}>
      <MyComponent />
    </MyContext.Provider>
  );
}
```

- **`React.createContext(defaultValue)`**：创建一个新的上下文对象。`defaultValue` 参数是可选的，当没有任何匹配的 Provider 时，它将作为默认值。
- **`<MyContext.Provider>`**：这是一个 React 组件，它允许后代组件访问上下文中的值。`value` 属性是你希望提供给所有订阅了该上下文的组件的数据。

### 消费上下文

然后，在任何需要访问上下文值的函数组件中，你可以使用 `useContext` Hook 来订阅上下文。

```jsx
function MyComponent() {
  const { message } = useContext(MyContext);

  return (
    <div>
      <p>{message}</p>
    </div>
  );
}
```

## 注意事项

1. **性能优化**：每当上下文的值发生变化时，所有使用 `useContext` 的组件都会重新渲染。如果你的应用程序有大量组件依赖于同一个上下文，这可能会导致性能问题。为了缓解这个问题，可以考虑以下几种策略：

   - **细化上下文**：如果可能的话，尝试拆分大的上下文对象为多个小的上下文，这样只有真正需要更新的组件才会重新渲染。
   - **Memoization**：使用 `React.memo` 或 `useMemo` 等工具来记忆化组件或计算结果，从而避免不必要的重新渲染。
   - **Shallow comparison**：确保传递给 `<Context.Provider>` 的 `value` 只在确实发生变化时才更新。对于对象或数组类型的值，可以通过浅比较来确定是否真的发生了变化。

2. **避免直接修改上下文值**：上下文值应该是只读的。如果你需要更新上下文中的状态，请确保通过合适的状态管理机制（如 `useState` 或 `useReducer`）来进行，并且只在合适的时机（例如在事件处理程序中）触发更新。

3. **默认值**：当你创建上下文时，可以提供一个默认值。这个默认值将在没有匹配的 `Provider` 时被使用。这对于开发和测试阶段非常有用，因为它可以帮助你更早地发现潜在的问题。

4. **错误边界**：由于上下文的变化会触发所有订阅组件的重新渲染，因此在设置上下文值时要小心处理可能出现的错误，以防止崩溃整个应用。考虑使用错误边界来捕获和处理异常情况。

5. **类型检查**：如果你正在使用 TypeScript，确保为你的上下文对象指定正确的类型定义。这不仅可以帮助你在编写代码时获得更好的编辑器支持，还可以减少运行时错误的发生几率。

## 示例：带状态管理的上下文

下面是一个完整的例子，展示了如何结合 `useState` 和 `useContext` 来创建一个带有状态管理的上下文：

```jsx
import React, { createContext, useState, useContext } from "react";

// 定义上下文接口（TypeScript）
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

// 创建上下文，默认值为空对象
const ThemeContext =
  (createContext < ThemeContextType) | (undefined > undefined);

// 自定义 Hook 以简化对上下文的访问
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// 上下文提供者组件
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// 使用上下文的组件
function ThemedButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
      }}
    >
      Toggle Theme
    </button>
  );
}

// 应用程序根组件
function App() {
  return (
    <ThemeProvider>
      <ThemedButton />
    </ThemeProvider>
  );
}
```

在这个例子中，我们创建了一个名为 `ThemeContext` 的上下文，用于在应用程序中共享主题信息。我们还定义了一个自定义 Hook `useTheme`，它简化了对上下文的访问。最后，我们实现了一个 `ThemeProvider` 组件，它负责管理主题状态，并通过上下文向其子组件提供这些状态。

## 总结

`useContext` 提供了一种简单而强大的方式来管理和共享全局状态，同时避免了 props drilling 的问题。正确地使用它可以显著提高代码的可维护性和可读性。
