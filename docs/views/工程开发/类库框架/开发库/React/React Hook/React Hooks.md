# React Hooks

React Hooks 是 React 16.8 引入的一组功能，它们允许你在不编写类的情况下使用状态和其他 React 特性。Hooks 提供了一种更直接的方式来处理`函数组件`中的逻辑复用、副作用管理以及生命周期方法。通过 Hooks，你可以将多个相关逻辑片段组合在一起，并且代码更加简洁和易于理解。

## 类组件的麻烦

- **冗长的语法**：类组件需要更多的样板代码（boilerplate code），例如构造函数、`this` 绑定等。这使得代码更难阅读和维护。
- **`this` 上下文问题** ：类组件中必须正确处理 `this` 的上下文，尤其是在事件处理程序和其他方法中。如果忘记绑定 `this`，会导致 `this` 指向错误的对象或 `undefined`。
- **生命周期方法复杂**：类组件依赖于一系列特定的生命周期方法来管理副作用，如 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount`。这些方法不仅增加了学习曲线，还可能导致代码分散，难以跟踪。
- **状态管理复杂**：类组件的状态管理通过 `this.state` 和 `this.setState` 进行，这种方式有时会显得笨重，特别是在需要多个状态变量或复杂的更新逻辑时。
- **缺乏组合性**：类组件之间共享逻辑的能力不如函数组件那么直观。高阶组件（Higher-Order Components, HOC）和渲染属性（Render Props）模式虽然提供了某种形式的组合性，但它们增加了额外的抽象层，使得代码更难理解和调试。
- **与现代 JavaScript 特性的兼容性**：类组件在与一些现代 JavaScript 特性（如 TypeScript 或者解构赋值）结合使用时，可能会变得更加复杂。例如，在 TypeScript 中为类组件添加类型定义通常比为函数组件添加类型定义要繁琐得多。
- 

## 主要 Hooks

### [<b>useState</b>](./useState.md)

`useState` 是最常用的 Hook 之一，它让你可以在函数组件中添加状态（state）。每次调用 `useState` 都会返回当前状态和更新该状态的函数。

```jsx
import React, { useState } from "react";

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

### [<b>useEffect</b>](./useEffect.md)

`useEffect` 让你可以在函数组件中执行副作用操作，如数据获取、订阅或手动修改 DOM。它类似于类组件中的 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 的组合。

```jsx
import React, { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // 组件挂载时执行
    document.title = `You clicked ${count} times`;

    // 返回一个清理函数，在组件卸载或下一次 effect 执行前调用
    return () => {
      document.title = "Clean up";
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

### [<b>useContext</b>](./useContext.md)

`useContext` Hook 使你能够订阅 React 的上下文（Context）。你可以使用它来避免“props drilling”问题，即在多层嵌套组件之间传递 props。

```jsx
import React, { useContext } from "react";
import { ThemeContext } from "./theme-context";

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (
    <button style={{ background: theme.background }}>
      I am styled by theme context!
    </button>
  );
}
```

### [<b>useReducer</b>](./useReducer.md)

对于复杂的状态逻辑，`useReducer` 是一种替代 `useState` 的方式。它接收一个 reducer 函数，并返回当前状态和 dispatch 方法。

```jsx
import React, { useReducer } from "react";

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
}
```

### [<b>useCallback</b>](./useCallback.md) 和 [<b>useMemo</b>](./useMemo.md)

这两个 Hooks 用于优化性能。`useCallback` 返回一个记忆化的回调函数，而 `useMemo` 则返回一个记忆化的值。它们都可以防止不必要的重新渲染或计算。

```jsx
import React, { useCallback, useMemo } from "react";

function HeavyComponent({ value }) {
  // 使用 useMemo 来缓存昂贵的计算结果
  const memoizedValue = useMemo(() => computeExpensiveValue(value), [value]);

  // 使用 useCallback 来缓存回调函数
  const memoizedCallback = useCallback(() => doSomething(), []);

  return <div>{memoizedValue}</div>;
}
```

### [<b>useRef</b>](./useRef.md)

`useRef` 提供了一个可变的引用对象，其 `.current` 属性可以保存任何值。它可以用来访问 DOM 元素或者保持组件内部的数据，而不会触发重新渲染。

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

### [<b>useImperativeHandle</b>](./useImperativeHandle.md)

`useImperativeHandle` 可以自定义暴露给父组件的实例值。通常与 `ref` 一起使用，以控制子组件的行为。

```jsx
import React, { useRef, useImperativeHandle, forwardRef } from "react";

const FancyInput = forwardRef((props, ref) => {
  const inputRef = useRef();

  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    },
  }));

  return <input ref={inputRef} />;
});

function ParentComponent() {
  const inputRef = useRef();

  const focusTextInput = () => {
    inputRef.current.focus(); // 使用自定义的实例值
  };

  return (
    <>
      <FancyInput ref={inputRef} />
      <button onClick={focusTextInput}>Focus the input</button>
    </>
  );
}
```

## [自定义 Hooks](./自定义%20Hooks.md)

除了内置 Hooks 外，React 还鼓励开发者创建自己的自定义 Hooks 来提取逻辑并促进代码复用。例如，你可以创建一个 `useFetch` Hook 来简化数据获取逻辑。

```jsx
import { useState, useEffect } from "react";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [url]);

  return { data, loading, error };
}

function DataFetchingComponent() {
  const { data, loading, error } = useFetch("/api/data");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

## 总结

React Hooks 提供了强大的工具集，使得函数组件的功能更加丰富和灵活。通过学习和掌握这些 Hooks，你可以构建出更加模块化、易于维护且高效的 React 应用程序。
