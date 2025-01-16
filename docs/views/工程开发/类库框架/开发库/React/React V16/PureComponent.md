# PureComponent

`PureComponent` 是 React 提供的一个优化类组件的基类，它继承自 `Component` 并实现了浅比较（shallow comparison）的 `shouldComponentUpdate` 方法。通过使用 `PureComponent`，你可以减少不必要的重新渲染，从而提高应用程序的性能。

## 为什么需要 `PureComponent`？

在 React 中，默认情况下每当父组件重新渲染时，所有的子组件也会重新渲染。对于简单的组件来说，这种行为通常是可接受的，但对于复杂的或嵌套很深的组件树，这可能会导致性能问题。为了避免不必要的重新渲染，React 提供了 `PureComponent` 来自动执行浅比较，以决定是否需要更新组件。

## 浅比较的工作原理

`PureComponent` 的 `shouldComponentUpdate` 方法会自动进行浅比较，即它只会比较对象的第一层属性和原始值（如字符串、数字、布尔值等）。如果 `props` 或 `state` 在浅比较中没有变化，那么组件就不会重新渲染。

- **对于对象和数组**：浅比较不会递归地检查对象或数组内部的变化。因此，如果你的 `props` 或 `state` 包含复杂的数据结构（如嵌套的对象或数组），并且这些数据结构内部发生了变化，但外层引用保持不变，那么 `PureComponent` 将不会检测到这些变化，并可能阻止必要的重新渲染。
- **对于原始值**：对于字符串、数字、布尔值等原始类型，浅比较是有效的，因为这些类型的值本身就是不可变的。

## 使用 `PureComponent`

要使用 `PureComponent`，你只需要让你的类组件继承自 `React.PureComponent` 而不是 `React.Component`。这样，你的组件就会自动获得浅比较的行为。

```jsx
import React, { PureComponent } from "react";

class MyComponent extends PureComponent {
  render() {
    return <div>{this.props.message}</div>;
  }
}

export default MyComponent;
```

## `PureComponent` vs. `Component`

| 特性                             | `Component`              | `PureComponent`          |
| -------------------------------- | ------------------------ | ------------------------ |
| `shouldComponentUpdate` 默认实现 | 总是返回 `true`          | 实现了浅比较             |
| 对象/数组比较                    | 不适用                   | 只比较第一层属性         |
| 性能                             | 可能会有不必要的重新渲染 | 更高效，减少了不必要渲染 |

## 注意事项

1. **不要滥用 `PureComponent`**：

   - 虽然 `PureComponent` 可以提高性能，但它并不是万能的解决方案。你应该根据具体情况来判断是否需要使用它。对于那些频繁接收新 `props` 或 `state` 的组件，或者包含复杂数据结构的组件，你可能需要更细粒度的控制，这时可以考虑手动实现 `shouldComponentUpdate`。

2. **确保 `props` 和 `state` 的稳定性**：

   - 为了使 `PureComponent` 正常工作，你应该尽量保证传递给它的 `props` 和 `state` 的稳定性。这意味着避免不必要的对象和数组创建，例如，在每次渲染时都创建新的对象或数组作为 `props` 或 `state` 的一部分会导致浅比较失效，因为即使是相同内容的新对象或数组也会有不同的引用。

3. **深比较的需求**：

   - 如果你需要对 `props` 或 `state` 进行深比较（即递归地检查对象或数组的所有层级），那么 `PureComponent` 可能不适合你。在这种情况下，你可能需要自己实现 `shouldComponentUpdate`，或者使用第三方库来进行深比较。

4. **React.memo 和函数组件**：

   - 对于函数组件，React 提供了 `React.memo` 高阶组件，它提供了与 `PureComponent` 类似的功能。`React.memo` 会对函数组件的 `props` 进行浅比较，以决定是否跳过渲染。

5. **使用不可变对象**：第三方库 `immutable.js` 可以帮助开发者使用不可变对象，从而避免不必要的组件更新。

## 示例：正确使用 `PureComponent`

```jsx
import React, { PureComponent } from "react";

class CounterButton extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // PureComponent 自动实现了浅比较逻辑
    return true; // 由 PureComponent 决定
  }

  handleClick = () => {
    this.setState((prevState) => ({ count: prevState.count + 1 }));
  };

  render() {
    return (
      <button onClick={this.handleClick}>
        Clicked {this.state.count} times
      </button>
    );
  }
}

export default CounterButton;
```

在这个例子中，`CounterButton` 继承自 `PureComponent`，所以它会自动应用浅比较逻辑。如果你点击按钮，组件的状态发生变化，它将正常重新渲染；但如果 `props` 没有变化，它将不会重新渲染，即使父组件重新渲染了。

## 总结

`PureComponent` 是一种简单而有效的方式来优化 React 应用程序中的组件渲染。它通过自动实现浅比较的 `shouldComponentUpdate` 方法，减少了不必要的重新渲染，提高了性能。然而，使用 `PureComponent` 时需要注意 `props` 和 `state` 的稳定性，以及避免在需要深比较的情况下使用它。
