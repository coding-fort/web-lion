# Context

React 的 `Context` API 提供了一种在组件树中传递数据的方式，而无需手动将 props 一层层传递下去。这在处理诸如主题、用户认证状态、语言设置等全局数据时非常有用。使用 `Context` 可以避免“props drilling”问题，即不需要通过多个嵌套组件逐层传递 props。

## 创建和使用 Context

### 1. 创建 Context

首先，你需要创建一个 `Context` 对象。这个对象包含两个重要的部分：`Provider` 和 `Consumer`（或者 `useContext` Hook）。

```jsx
import React, { createContext } from "react";

// 创建一个 Context 对象
const MyContext = createContext();

export default MyContext;
```

### 2. 使用 Provider 提供数据

`Provider` 组件允许你为整个子树提供上下文值。所有消费该上下文的后代组件都将接收最新的上下文值。

```jsx
import React, { useState } from "react";
import MyContext from "./MyContext";

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <MyContext.Provider value={{ theme, setTheme }}>
      <div className={`app ${theme}`}>
        <ThemeToggler />
        <Content />
      </div>
    </MyContext.Provider>
  );
}

export default App;
```

在这个例子中，`App` 组件使用 `MyContext.Provider` 来为它的所有子组件提供 `theme` 和 `setTheme` 函数。

### 3. 使用 Consumer 消费数据（已弃用）

在 React 16.8 引入 Hooks 之前，`Consumer` 是消费上下文的主要方式。它是一个高阶组件，允许你在函数式组件或类组件中访问上下文值。

```jsx
import React from "react";
import MyContext from "./MyContext";

function Content() {
  return (
    <MyContext.Consumer>
      {({ theme }) => (
        <p>This is the content and the current theme is: {theme}</p>
      )}
    </MyContext.Consumer>
  );
}

export default Content;
```

然而，`Consumer` 已经被官方标记为不推荐使用，取而代之的是更简洁的 `useContext` Hook。

### 4. 使用 `useContext` Hook 消费数据

从 React 16.8 开始，引入了 Hooks，其中包括 `useContext`。这个 Hook 提供了一种更加简洁的方式来消费上下文。

```jsx
import React, { useContext } from "react";
import MyContext from "./MyContext";

function Content() {
  const { theme } = useContext(MyContext);

  return <p>This is the content and the current theme is: {theme}</p>;
}

export default Content;
```

### 5. 使用 `useContext` 在类组件中消费数据

虽然 `useContext` 主要用于函数式组件，但你也可以结合 `React.createContext` 和 `React.Component` 类来在类组件中消费上下文。

```jsx
import React, { Component } from "react";
import MyContext from "./MyContext";

class ThemeDisplay extends Component {
  static contextType = MyContext;

  render() {
    const { theme } = this.context;
    return <p>The current theme is: {theme}</p>;
  }
}

export default ThemeDisplay;
```

## 更新上下文中的值

你可以通过 `Provider` 提供的方法（如上面例子中的 `setTheme`）来更新上下文中的值。确保这些方法能够正确地触发重新渲染，以便消费者组件可以接收到最新的上下文值。

```jsx
import React, { useContext } from "react";
import MyContext from "./MyContext";

function ThemeToggler() {
  const { theme, setTheme } = useContext(MyContext);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <button onClick={toggleTheme}>
      Toggle {theme === "light" ? "Dark" : "Light"} Theme
    </button>
  );
}

export default ThemeToggler;
```

## 注意事项

- **性能考虑**：每次 `Provider` 的 `value` 发生变化时，所有订阅该上下文的组件都会重新渲染。因此，应该谨慎管理上下文的变化，以避免不必要的性能开销。
- **默认值**：当没有 `Provider` 包裹时，`Context` 将返回其创建时提供的默认值。确保为你的 `Context` 设置合理的默认值。
- **组合多个 Context**：如果你有多个独立的上下文，最好分别创建它们，而不是试图将所有东西塞进一个大的 `Context` 中。这有助于保持代码的清晰性和可维护性。

## 总结

`Context` API 是 React 中一种强大的工具，它提供了在组件树中传递数据的一种简便方式。理解如何创建和使用 `Context`，以及如何在函数式组件和类组件中消费上下文数据，对于构建高效且易于维护的应用程序非常重要。
