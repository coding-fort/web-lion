# <sucb>[React 16.3+ 加入]</sucb> getSnapshotBeforeUpdate(prevProps, prevState)

`getSnapshotBeforeUpdate` 是 React 类组件中的一个生命周期方法，它在最近一次渲染输出（提交到 DOM）之前立即调用。这个方法允许你在 DOM 更新前获取一些信息（如滚动位置），并在 `componentDidUpdate` 中使用这些信息来执行某些操作。这是为了确保你可以在更新发生前后捕获 DOM 的状态，并做出相应的响应。

<bwp>
<errb> getSnapshotBeforeUpdate </errb>方法是在 <errb> React 16.3 </errb>版本中加入的‌‌。<br/>
1. 这个方法的主要作用是在组件更新之前获取DOM的状态，以便在<errb> componentDidUpdate </errb>方法中使用。<br/>
2. 与<errb> componentDidUpdate </errb> 结合使用，替代了旧的 <errb> componentWillUpdate </errb>生命周期函数
</bwp>

## 方法签名

```jsx
getSnapshotBeforeUpdate(prevProps, prevState);
```

- **`prevProps`**：更新前的 props。
- **`prevState`**：更新前的状态。

这个方法应该返回一个值（可以是任何类型），该值作为第三个参数传递给 `componentDidUpdate`。

## 使用场景

### 捕获滚动位置

当你有一个长列表或可滚动的内容区域时，可能希望在内容更新后保持用户的滚动位置不变。你可以使用 `getSnapshotBeforeUpdate` 来保存当前的滚动位置，并在 `componentDidUpdate` 中恢复它。

```jsx
class ScrollingList extends React.Component {
  constructor(props) {
    super(props);
    this.listRef = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 在更新之前保存滚动位置
    return this.listRef.current.scrollHeight - this.listRef.current.scrollTop;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 在更新之后恢复滚动位置
    if (snapshot !== null) {
      this.listRef.current.scrollTop =
        this.listRef.current.scrollHeight - snapshot;
    }
  }

  render() {
    return <ul ref={this.listRef}>{/* 渲染列表项 */}</ul>;
  }
}
```

### 捕获输入焦点或选择范围

如果你有一个文本编辑器或其他需要维护用户输入焦点或选择范围的组件，可以在 `getSnapshotBeforeUpdate` 中保存这些信息，并在 `componentDidUpdate` 中恢复它们。

```jsx
class TextEditor extends React.Component {
  constructor(props) {
    super(props);
    this.textInput = React.createRef();
  }

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // 在更新之前保存光标位置
    return this.textInput.current.selectionStart;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // 在更新之后恢复光标位置
    if (snapshot !== null) {
      this.textInput.current.setSelectionRange(snapshot, snapshot);
    }
  }

  render() {
    return <input ref={this.textInput} />;
  }
}
```

## 注意事项

1. **与严格模式兼容**：`getSnapshotBeforeUpdate` 和 `componentDidUpdate` 的组合在 React 的严格模式下不会被调用两次，这有助于避免不必要的副作用。
2. **不要修改 state 或 props**：在这个方法中不应该直接修改组件的状态或属性，因为这可能会导致意外的行为。
3. **必须配合 `componentDidUpdate` 使用**：`getSnapshotBeforeUpdate` 返回的快照值只能通过 `componentDidUpdate` 访问，因此这两个方法通常一起使用。

## 函数组件中的替代方案

对于函数组件，React 提供了 `useEffect` Hook 来处理副作用，但它没有直接等价于 `getSnapshotBeforeUpdate` 的 API。然而，你可以结合 `useRef` 和 `useEffect` 来实现类似的功能。

```jsx
import React, { useEffect, useRef } from "react";

function ScrollingList({ items }) {
  const listRef = useRef(null);
  const prevItemsCount = useRef(items.length);

  useEffect(() => {
    const scrollPosition =
      listRef.current.scrollHeight - listRef.current.scrollTop;

    // 当 items 发生变化时，恢复滚动位置
    if (items.length !== prevItemsCount.current) {
      prevItemsCount.current = items.length;
      listRef.current.scrollTop = listRef.current.scrollHeight - scrollPosition;
    }
  }, [items]);

  return (
    <ul ref={listRef}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default ScrollingList;
```

在这个例子中，我们使用 `useRef` 来跟踪之前的 items 数量，并在 `useEffect` 中根据新的 items 长度调整滚动位置。

## 总结

`getSnapshotBeforeUpdate` 提供了一种机制，在 DOM 更新提交之前捕获某些信息，并在更新完成后使用这些信息。这对于需要精确控制 DOM 状态的应用程序非常有用。尽管它是类组件特有的生命周期方法，但通过适当的 Hook 组合，你也可以在函数组件中实现类似的行为。
