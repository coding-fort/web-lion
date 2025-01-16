# forwardRef

`React.forwardRef` 是 React 提供的一个高级特性，它允许你创建一个组件，该组件可以将其接收到的 `ref` 转发给子组件中的 DOM 元素或类组件。这对于需要直接操作 DOM 或访问子组件内部实例的情况非常有用。通常情况下，当使用函数式组件时，`ref` 不会自动传递下去，但 `forwardRef` 解决了这个问题。

## 使用场景

1. **访问 DOM 节点**：有时你需要直接操作 DOM 元素（例如，聚焦输入框、滚动到特定位置等），这时你可以通过 `forwardRef` 将 `ref` 传递给底层 DOM 元素。
2. **与 HOC 或其他包装组件一起工作**：当你使用高阶组件（HOC）或其他形式的组件包装时，`ref` 默认不会穿透这些包装层到达目标组件。`forwardRef` 可以帮助你在这种情况下保持 `ref` 的连通性。
3. **类组件和函数组件之间的互操作**：如果你有一个类组件并且希望从外部通过 `ref` 访问它的实例方法，而这个类组件又被一个函数组件包裹，那么你可以使用 `forwardRef` 来实现这一点。

## 基本用法

### 函数组件中转发 `ref`

```jsx
import React, { useRef, forwardRef } from "react";

// 定义一个接受 ref 的函数组件
const MyInput = forwardRef((props, ref) => (
  <input type="text" ref={ref} {...props} />
));

function App() {
  const inputEl = useRef(null);

  const onButtonClick = () => {
    // 直接操作 DOM 元素
    inputEl.current.focus();
  };

  return (
    <div>
      <MyInput ref={inputEl} placeholder="Type something..." />
      <button onClick={onButtonClick}>Focus the input</button>
    </div>
  );
}

export default App;
```

在这个例子中，我们定义了一个名为 `MyInput` 的函数组件，并使用 `forwardRef` 接受两个参数：`props` 和 `ref`。然后我们将 `ref` 传递给了 `<input>` 元素。在父组件 `App` 中，我们可以像往常一样使用 `useRef` 创建引用，并将其赋值给 `MyInput` 组件的 `ref` 属性。点击按钮后，`inputEl.current.focus()` 将使输入框获得焦点。

### 类组件中转发 `ref`

如果你正在处理的是一个类组件而不是函数组件，也可以使用 `forwardRef` 来确保 `ref` 能够正确地传递到类组件的实例上。

```jsx
import React, { useRef, forwardRef } from "react";

class InputComponent extends React.Component {
  focus = () => {
    this.inputElement.focus();
  };

  render() {
    return <input ref={(el) => (this.inputElement = el)} />;
  }
}

const ForwardedInput = forwardRef((props, ref) => (
  <InputComponent {...props} ref={ref} />
));

function App() {
  const inputEl = useRef(null);

  const onButtonClick = () => {
    inputEl.current.focus();
  };

  return (
    <div>
      <ForwardedInput ref={inputEl} placeholder="Type something..." />
      <button onClick={onButtonClick}>Focus the input</button>
    </div>
  );
}

export default App;
```

这里，`InputComponent` 是一个类组件，它有一个 `focus` 方法来手动调用输入框的 `focus` 方法。通过 `forwardRef` 包装 `InputComponent`，我们可以将 `ref` 传递给它，并且可以在父组件中通过 `inputEl.current` 调用 `focus` 方法。

## 结合 HOC 使用

当你使用高阶组件（HOC）时，`ref` 默认不会传递给被包装的组件。为了保证 `ref` 的连通性，你可以结合 `forwardRef` 和 HOC 使用：

```jsx
import React, { useRef, forwardRef } from "react";

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
  const inputEl = useRef(null);

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

在这个例子中，`withLogging` 是一个简单的 HOC，它记录每次渲染的信息。我们使用 `forwardRef` 来确保 `ref` 能够穿透 HOC 并最终传递给 `MyInput` 组件。

## 注意事项

- **不要滥用 `forwardRef`**：虽然 `forwardRef` 很有用，但它也增加了组件的复杂度。只在确实需要的时候才使用它。
- **避免不必要的重新渲染**：如果你只是想获取子组件的状态或执行某些副作用，考虑是否可以通过 props 回调或者 context API 来实现，这样可能会更高效。
- **命名约定**：按照惯例，使用 `forwardRef` 包装后的组件名称应以大写字母开头，并且最好能反映出它是经过 `forwardRef` 包装的，比如 `ForwardedComponentName`。

## 总结

`React.forwardRef` 是一个强大的工具，它解决了函数式组件无法接收 `ref` 的问题，并使得 `ref` 可以在组件层次结构中顺利传递。理解何时以及如何使用 `forwardRef` 对于构建高效的 React 应用程序至关重要。
