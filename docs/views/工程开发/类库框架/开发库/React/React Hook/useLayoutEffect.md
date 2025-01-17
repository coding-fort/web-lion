# useLayoutEffect：同步DOM操作

`useLayoutEffect` 是 React 中的一个 Hook，它的行为与 `useEffect` 类似，但有一个关键的区别：它在所有的 DOM mutations 之后同步执行，但在浏览器绘制（paint）之前。这意味着 `useLayoutEffect` 可以读取和安全地修改 DOM 而不会导致视觉上的闪烁或布局抖动。这使得它非常适合用于需要立即反映到屏幕上的 DOM 操作，例如测量布局、动画或手动 DOM 操作。

## `useLayoutEffect` vs `useEffect`

- **执行时机**：

  - `useEffect`：在浏览器绘制之后异步执行。
  - `useLayoutEffect`：在浏览器绘制之前同步执行。

- **适用场景**：
  - `useEffect`：适合大多数副作用操作，如数据获取、订阅事件等，这些操作不需要立即更新到屏幕上。
  - `useLayoutEffect`：适用于那些需要在浏览器绘制前同步完成的 DOM 操作，以避免视觉上的不一致或性能问题。

## 使用 `useLayoutEffect` 的注意事项

1. **性能影响**：由于 `useLayoutEffect` 在渲染阶段同步执行，它可能会阻塞页面的首次渲染和后续更新，从而对性能产生负面影响。因此，应该谨慎使用，仅限于确实需要同步执行的场景。
2. **避免不必要的 DOM 操作**：尽量减少在 `useLayoutEffect` 内部进行昂贵的 DOM 操作，因为它们会延迟页面的可见性时间（Time To Interactive, TTI），进而影响用户体验。

3. **替代方案**：如果你发现 `useLayoutEffect` 对性能有显著影响，考虑是否可以使用 `useEffect` 或其他方法来实现相同的功能。例如，对于动画效果，你可以使用 CSS 动画或 Web Animations API 来代替 JavaScript 动画。

## 示例代码

下面是一些使用 `useLayoutEffect` 的例子，展示了它在不同场景下的应用：

### 测量 DOM 元素

当你需要根据 DOM 元素的实际尺寸或位置来进行调整时，`useLayoutEffect` 是一个合适的选择，因为它确保了你在浏览器绘制之前获得了最新的布局信息。

```jsx
import React, { useRef, useLayoutEffect } from "react";

function MeasureExample() {
  const ref = useRef(null);
  const [height, setHeight] = React.useState(0);

  useLayoutEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height);
    }
  }, []);

  return (
    <div>
      <h1 ref={ref}>Hello, world</h1>
      <p>The above header is {Math.round(height)}px tall.</p>
    </div>
  );
}
```

在这个例子中，`useLayoutEffect` 确保了我们在浏览器绘制之前获取到了 `h1` 元素的高度，并将其设置为组件的状态。

### 执行动画

如果你需要在组件挂载后立即启动一个动画，并且这个动画依赖于 DOM 的当前状态，那么 `useLayoutEffect` 可以确保动画从正确的位置开始。

```jsx
import React, { useRef, useLayoutEffect } from "react";

function AnimateOnMount() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.style.transition = "transform 0.5s ease-in-out";
      ref.current.style.transform = "translateY(-100%)";

      // 立即触发重排，确保 transform 应用
      ref.current.offsetWidth; // 强制重新计算样式

      ref.current.style.transform = "translateY(0)";
    }
  }, []);

  return <div ref={ref} style={{ height: "100px", backgroundColor: "blue" }} />;
}
```

在这个例子中，我们使用 `useLayoutEffect` 来确保动画从元素的初始位置平滑过渡到最终位置，而不会出现跳变。

### 阻止滚动

有时你可能需要在某些情况下阻止页面滚动，比如当模态框打开时。`useLayoutEffect` 可以确保你在浏览器绘制之前锁定滚动，从而避免任何视觉上的不一致。

```jsx
import React, { useState, useLayoutEffect } from "react";

function Modal({ isOpen }) {
  const [isLocked, setIsLocked] = useState(false);

  useLayoutEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsLocked(true);
    } else {
      document.body.style.overflow = "";
      setIsLocked(false);
    }
  }, [isOpen]);

  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>{/* 模态框内容 */}</div>
  );
}
```

在这个例子中，`useLayoutEffect` 确保了当我们打开模态框时，页面滚动被立即阻止，从而提供更好的用户体验。

## 总结

`useLayoutEffect` 是一个强大的工具，尤其适用于需要同步执行的 DOM 操作。然而，由于它会影响性能，应该只在确实必要的时候使用。大多数情况下，`useEffect` 已经足够满足需求，但对于那些必须在浏览器绘制之前完成的操作，`useLayoutEffect` 提供了一个可靠的解决方案。
