# React Hooks

Hook 是 React 16.8 的新特性，它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

<h2>没有破坏性改动</h2>

Hook 不能取代 class，这只是一个**可选的**功能。

Hook 为函数组件引入了状态和其他 React 特性，但并不打算取代 class 组件。

- **更少的代码**
- **更好的逻辑复用**
- **更好的状态管理**

<h2>Hook 规则</h2>

- 只能在函数最外层调用 Hook，不要在循环、条件判断或者子函数中调用。
- 只能在 React 函数组件中调用 Hook。
- 不要在普通的 JavaScript 函数中调用 Hook。

## useState

- useState 是一个 Hook，它让我们在函数组件中添加 state 状态。

```jsx
import React, { useState } from "react";

function Example() {
  // 声明一个新的状态变量，我们将其称为 “count”
  // count：初始化一个状态
  // setCount：更新状态的方法，相当于setState({})
  // useState：赋值
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## useEffect

- useEffect Hook 的设计初衷是为了使副作用操作更易于添加、更易于理解。事实上，在 React 的 class 组件中，副作用操作经常被添加到 componentDidMount 和 componentDidUpdate 生命周期方法中。现在我们可以使用 useEffect Hook 将它们合并为一个更易管理的 Hook。
- useEffect 相当于 componentDidMount、componentDidUpdate 和 componentWillUnmount 这三个生命周期函数的组合。

<bqe>
<prib>useLayoutEffect</prib>
<br/>useLayoutEffect 与 useEffect 的区别在于 useLayoutEffect 会在所有 DOM 变更之后同步调用 effect。可以使用它来读取 DOM 布局并同步触发重渲染。在大多数情况下，你应该使用 useEffect 而不是 useLayoutEffect，因为 useLayoutEffect 会导致阻塞浏览器渲染，使用它要小心。
</bqe>

<bqe>
<b>为什么将3个生命周期行数写成一个？</b>
<br/> 1. 可以多个useEffect 同时存在，并且都会执行；
<br/> 2. 从代码角度来说，更好拆分业务代码；
</bqe>

```jsx
import React, { useState, useEffect } from "react";

function Example() {
  const [count, setCount] = useState(0);

  // 相当于 componentDidMount 和 componentDidUpdate:
  useEffect(() => {
    // 使用浏览器的 API 更新页面标题
    document.title = `You clicked ${count} times`;
    // return 相当于 componentWillUnmount
    return () => {
      console.log("相当于componentWillUnmount");
    };
  }, [count]);
  // 仅在 count 更改时更新
  // count：依赖的值，当count改变时，useEffect 会重新执行
  // [] 如果不传第二个参数，则每次渲染都会执行；当为空数组情况，相当于componentDidMount；

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## useContext

```jsx
import React, { useContext } from "react";

const MyContext = React.createContext();

function MyComponent() {
  const context = useContext(MyContext);
  // ...
}
```

## useReducer

- useReducer 是 useState 的替代方案，它适用于 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等情况。
- useReducer 可以通过 reducer 将多个子值合并成一个 state，然后通过 action 来操作 state。

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

## useCallback

- useCallback 返回一个 memoized（记忆的）回调函数。
- 针对函数。
- 它仅在其依赖项改变时才会更新 memoized 回调函数。这种优化有助于避免在每次渲染时都创建新的回调函数。

```jsx
import React, { useState, useCallback } from "react";

function ParentComponent() {
  const [count, setCount] = useState(0);

  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]);

  return <ChildComponent onClick={increment} />;
}
```

## useMemo

- useMemo 返回一个 memoized（记忆的）值。
- 针对对象。
- 它仅在其依赖项改变时才会重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。
- 等同 Vue 中`computed`。

```jsx
import React, { useState, useMemo } from "react";

function ParentComponent() {
  const [count, setCount] = useState(0);

  const memoizedValue = useMemo(() => computeExpensiveValue(count), [count]);

  return <ChildComponent value={memoizedValue} />;
}
```

## useRef

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

## useImperativeHandle

```jsx
import React, { useRef, useImperativeHandle } from "react";

function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
export default FancyInput;
```

## 自定义 Hook

- 自定义 Hook 是一个函数，其名称以 “use” 开头，函数内部可以调用其他的 Hook。
- 自定义 Hook 是一种重用状态逻辑的机制。

```jsx
import { useState, useEffect } from "react";

function useCustomHook() {
  const [state, setState] = useState(0);

  useEffect(() => {
    // do something
  }, [state]);

  return [state, setState];
}

function MyComponent() {
  const [state, setState] = useCustomHook();
  // ...
}
```

## Router Hook

- `useHistory`：返回一个 history 对象，可以用来导航到不同的页面。
- `useParams`：返回当前 URL 的参数对象。

## Redux Hook

- `useSelector`：返回 Redux store 中的状态。
- `useDispatch`：返回 Redux store 中的 dispatch 函数。
- `useStore`：返回 Redux store 对象。
