# Portals

React Portals 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点中的方法。这在需要将某些元素（如模态框、提示框、菜单等）渲染到特定位置时非常有用，而这些位置可能不在当前组件树的层级结构中。通过使用 Portals，你可以将这些元素渲染到文档的任何部分，同时保持它们在 React 组件层次中的逻辑关系。

## 为什么需要 Portals？

1. **脱离现有 DOM 结构**：有时候你希望某个组件的 DOM 节点出现在页面上的另一个位置，而不是按照组件树的层级结构进行渲染。例如，模态框通常应该覆盖整个屏幕，而不是仅仅局限于其父组件所在的区域。

2. **解决样式和布局问题**：有时，由于 CSS 样式的作用范围或 z-index 等属性的影响，你需要将某些元素放在特定的 DOM 层级中以确保正确的样式和布局行为。

3. **优化性能**：通过将某些频繁更新的组件移到更顶层的位置，可以减少不必要的重绘和回流，从而提高应用程序的性能。

## 使用 Portals 的基本语法

要创建一个 Portal，你可以使用 `ReactDOM.createPortal` 方法。这个方法接收两个参数：

- **要渲染的 React 子元素**：这是你想要渲染的内容。
- **DOM 节点**：这是你希望将内容渲染到的目标 DOM 节点。

```jsx
import React from "react";
import ReactDOM from "react-dom";

function Modal({ children }) {
  // 创建一个 div 并将其附加到 body 上
  const el = document.createElement("div");
  document.body.appendChild(el);

  // 渲染 Portal
  return ReactDOM.createPortal(
    <div className="modal">{children}</div>,
    el // 目标 DOM 节点
  );
}

export default Modal;
```

## 示例：使用 Portals 创建模态框

假设我们有一个简单的应用，其中包含一个按钮，点击按钮会弹出一个模态框。我们将使用 Portal 来将模态框渲染到文档的 `<body>` 元素中，而不是它原本的父组件内。

```jsx
import React, { useState } from "react";
import ReactDOM from "react-dom";

// 模态框组件
function Modal({ onClose, children }) {
  // 获取现有的 modal-root 或创建一个新的
  const modalRoot =
    document.getElementById("modal-root") ||
    (() => {
      const div = document.createElement("div");
      div.id = "modal-root";
      document.body.appendChild(div);
      return div;
    })();

  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        {children}
        <button onClick={onClose}>关闭</button>
      </div>
    </div>,
    modalRoot // 目标 DOM 节点
  );
}

// 主应用组件
function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>打开模态框</button>

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <p>这是一个模态框。</p>
        </Modal>
      )}
    </div>
  );
}

export default App;

// 在 HTML 文件中确保有如下代码：
// <div id="root"></div>
// <div id="modal-root"></div>
```

在这个例子中：

- 我们定义了一个 `Modal` 组件，它使用 `ReactDOM.createPortal` 将模态框的内容渲染到 `#modal-root` 元素中。
- `App` 组件包含了打开和关闭模态框的逻辑。
- 当用户点击“打开模态框”按钮时，模态框会在页面上显示，并且它实际上被渲染到了 `<body>` 中的 `#modal-root` 元素里，而不是在 `App` 组件的内部。

## 注意事项

1. **事件冒泡**：尽管 Portal 内部的元素被渲染到了不同的 DOM 树中，但事件仍然会正常冒泡到父组件（按`React` 虚拟 DOM 冒泡）。这意味着如果你在 Portal 内部添加了一个点击事件监听器，该事件仍然会冒泡到最外层的祖先组件。

2. **样式作用域**：由于 Portal 内部的元素可能会被渲染到页面的不同部分，因此需要注意 CSS 样式的全局作用域。确保你的样式不会意外地影响到其他不相关的部分。

3. **生命周期管理**：当使用 Portals 时，React 会正确地处理组件的挂载和卸载生命周期。例如，在上面的例子中，当 `isModalOpen` 变为 `false` 时，模态框组件会被正确地卸载。

4. **清理工作**：如果在 Portal 内部动态创建了 DOM 节点（如前面例子中的 `el`），请确保在组件卸载时清理这些节点，以避免内存泄漏。

5. **辅助功能 (a11y)**：当使用 Portals 创建模态框或其他交互元素时，请务必考虑辅助功能。确保键盘导航和屏幕阅读器能够正确地与这些元素交互。

## 总结

Portals 是 React 提供的一种强大工具，用于将子节点渲染到位于父组件之外的 DOM 节点中。它们可以帮助你解决样式和布局的问题，优化性能，并使你的应用程序更加灵活。通过理解和合理使用 Portals，你可以构建出更复杂且用户友好的界面。
