# ref

在 React 中，`ref` 是一个特殊的属性，它允许你直接访问 DOM 元素或 React 组件实例。这与通过 props 和 state 来管理数据流的方式不同，`ref` 提供了一种更直接的方式来操作底层元素或组件的行为。React 提供了几种创建和使用 `ref` 的方式，包括 `React.createRef()`、回调函数形式的 `ref` 以及 `React.forwardRef`。

## 创建 Ref

### 使用 `React.createRef`

这是 React 提供的一种创建 `ref` 的方法，适用于类组件。你需要在构造函数中初始化 `ref`，然后将其赋值给需要引用的 DOM 元素或子组件。

```jsx
import React, { Component } from "react";

class MyComponent extends Component {
  constructor(props) {
    super(props);
    // 创建 ref
    this.myRef = React.createRef();
  }

  componentDidMount() {
    // 访问 ref
    console.log(this.myRef.current); // 输出: <input> DOM 节点
  }

  render() {
    return (
      <div>
        <input type="text" ref={this.myRef} />
      </div>
    );
  }
}

export default MyComponent;
```

### 使用回调函数形式的 `ref`

对于函数式组件，或者当你想要更灵活地控制 `ref` 的分配时，可以使用回调函数形式的 `ref`。这种方式允许你在 `ref` 被设置或更新时执行自定义逻辑。

```jsx
import React, { useState, useEffect } from "react";

function MyComponent() {
  const [inputEl, setInputEl] = useState(null);

  useEffect(() => {
    if (inputEl) {
      console.log(inputEl); // 输出: <input> DOM 节点
    }
  }, [inputEl]);

  return (
    <div>
      <input type="text" ref={(el) => setInputEl(el)} />
    </div>
  );
}

export default MyComponent;
```

- <errb>组件挂载时</errb>：当组件首次渲染并且 `ref` 被赋值给一个 DOM 元素或组件实例时，React 会调用这个函数，并传入实际的 DOM 元素或组件实例作为参数。
- <errb>组件更新时</errb>：如果 `ref` 对应的元素或组件实例发生变化（例如，由于键值变化导致重新创建），React 会再次调用这个函数，并传入新的 DOM 元素或组件实例。
- <errb>组件卸载时</errb>：当组件卸载时，React 会再次调用这个函数，但这次它的参数是 `null`，表示对应的 DOM 节点或组件实例已经被移除。

### 使用 `useRef` Hook

从 React 16.8 开始，引入了 Hooks，其中包括 `useRef`。这个 Hook 可以用来创建 `ref`，并且可以在函数式组件中替代 `React.createRef()` 和回调函数形式的 `ref`。

```jsx
import React, { useRef, useEffect } from "react";

function MyComponent() {
  const inputEl = useRef(null);

  useEffect(() => {
    // 直接访问 ref
    console.log(inputEl.current); // 输出: <input> DOM 节点
  }, []);

  const focusInput = () => {
    inputEl.current.focus(); // 手动聚焦输入框
  };

  return (
    <div>
      <input type="text" ref={inputEl} />
      <button onClick={focusInput}>Focus the input</button>
    </div>
  );
}

export default MyComponent;
```

## 使用场景

- **访问 DOM 节点**：你可以使用 `ref` 来获取对 DOM 元素的直接引用，例如用于手动聚焦输入框、滚动到特定位置等。
- **管理子组件的生命周期**：如果你有一个类组件，并且希望从外部通过 `ref` 访问它的实例方法，那么你可以使用 `forwardRef` 来实现这一点。
- **动画**：某些情况下，你可能需要直接操作 DOM 来实现动画效果，这时 `ref` 就派上用场了。
- **集成第三方库**：有些第三方库（如地图 API 或者视频播放器）可能需要直接访问 DOM 节点来初始化或配置它们的功能。

## 注意事项

- **避免过度使用 `ref`**：尽量减少对 `ref` 的依赖，因为它们绕过了 React 的声明式数据流，可能会使代码难以理解和维护。优先考虑使用状态管理和事件处理来构建交互。
- **不要将 `ref` 作为 prop 传递**：`ref` 不应该作为常规 prop 传递给子组件，除非你确实需要使用 `forwardRef` 来转发 `ref`。
- **确保 `ref` 的唯一性**：每个 `ref` 应该是唯一的，不要重复使用同一个 `ref` 对象来引用不同的元素。

## 结合 HOC 和 `forwardRef`

当使用高阶组件（HOC）或其他形式的组件包装时，默认情况下 `ref` 不会穿透这些包装层到达目标组件。为了保证 `ref` 的连通性，你可以结合 `forwardRef` 和 HOC 使用：

```jsx
import React, { forwardRef } from "react";

// 定义 HOC
function withLogging(WrappedComponent) {
  return forwardRef((props, ref) => {
    console.log("Rendering WrappedComponent");
    return <WrappedComponent {...props} ref={ref} />;
  });
}

// 定义函数组件并应用 HOC
const MyInput = forwardRef((props, ref) => (
  <input type="text" ref={ref} {...props} />
));

const EnhancedInput = withLogging(MyInput);

function App() {
  const inputEl = React.useRef(null);

  const onButtonClick = () => {
    inputEl.current.focus();
  };

  return (
    <div>
      <EnhancedInput ref={inputEl} placeholder="Type something..." />
      <button onClick={onButtonClick}>Focus the input</button>
    </div>
  );
}

export default App;
```

在这个例子中，`withLogging` 是一个简单的 HOC，它记录每次渲染的信息。我们使用 `forwardRef` 包装 `MyInput` 组件，以确保 `ref` 能够穿透 HOC 并最终传递给 `MyInput` 组件。

## 总结

`ref` 是 React 中一种强大的工具，它提供了直接访问 DOM 元素或组件实例的能力。理解何时以及如何使用 `ref` 对于构建高效的 React 应用程序至关重要。尽管 `ref` 非常有用，但应谨慎使用，以保持应用程序的可预测性和可维护性。
