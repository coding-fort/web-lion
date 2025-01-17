# getUserConfirmation

`getUserConfirmation` 是 `React Router` 中用于自定义确认对话框的一个配置选项。它允许你替换默认的浏览器确认对话框，从而使用你自己设计的确认逻辑或界面。这在你需要提供更复杂的用户体验时特别有用，比如带有自定义样式、动画效果或者与其他应用程序状态集成的确认提示。

## 使用场景

- **表单数据保护**：当用户尝试离开含有未保存更改的页面时，展示一个美观且符合应用风格的确认对话框。
- **导航拦截**：在用户执行某些操作（如关闭标签页或刷新页面）之前，要求他们确认是否继续。
- **增强用户体验**：通过创建与应用程序视觉风格一致的确认提示，提供更加流畅和专业的用户体验。

## 配置 `getUserConfirmation`

在 `React Router` 的配置中，你可以通过传递一个函数给 `getUserConfirmation` 来指定自定义的确认逻辑。这个函数接收两个参数：

1. **message**: 一个字符串，表示要显示给用户的确认消息。
2. **callback**: 一个回调函数，应该在用户做出选择后调用。如果用户同意继续，则传递 `true` 给回调；否则传递 `false`。

### 示例：基本用法

```jsx
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";

// 自定义 getUserConfirmation 函数
const customConfirm = (message, callback) => {
  // 使用原生 confirm 对话框作为示例
  const ok = window.confirm(message);
  callback(ok);
};

// 创建 history 实例并配置 getUserConfirmation
const history = createBrowserHistory({ getUserConfirmation: customConfirm });

function App() {
  return <Router history={history}>{/* 应用程序路由 */}</Router>;
}

export default App;
```

在这个例子中，我们创建了一个自定义的 `customConfirm` 函数，并将其传递给了 `createBrowserHistory`。每当需要显示确认对话框时（例如由 `<Prompt>` 组件触发），都会调用这个函数而不是默认的浏览器确认对话框。

### 更复杂的确认逻辑

你可以进一步扩展这个逻辑来实现更复杂的行为，比如使用模态框组件代替原生的 `window.confirm`。

```jsx
import React, { useState } from "react";
import { createBrowserHistory } from "history";
import { Router } from "react-router-dom";

// 自定义 getUserConfirmation 函数
const customConfirm = (message, callback) => {
  // 使用 React 状态管理模态框
  const [showModal, setShowModal] = useState(false);

  // 模拟异步确认过程
  setTimeout(() => {
    setShowModal(true);
  }, 0);

  // 这里可以是你的模态框组件或其他 UI 实现
  if (showModal) {
    return (
      <div className="modal">
        <p>{message}</p>
        <button
          onClick={() => {
            setShowModal(false);
            callback(true);
          }}
        >
          OK
        </button>
        <button
          onClick={() => {
            setShowModal(false);
            callback(false);
          }}
        >
          Cancel
        </button>
      </div>
    );
  }

  // 初始状态下不显示模态框
  return null;
};

// 创建 history 实例并配置 getUserConfirmation
const history = createBrowserHistory({
  getUserConfirmation: (message, callback) => {
    // 在这里你可以启动一个 React 渲染周期，例如通过事件监听器或全局状态管理
    // 注意：此方法可能需要额外的工作来正确处理 React 渲染周期
    customConfirm(message, callback);
  },
});

function App() {
  return <Router history={history}>{/* 应用程序路由 */}</Router>;
}

export default App;
```

请注意，在上面的例子中，直接将 JSX 返回值从 `getUserConfirmation` 返回并不是有效的做法，因为这个函数是在同步环境中被调用的，而 React 需要一个渲染周期来更新 DOM。因此，如果你想要使用 React 组件来构建确认对话框，你可能需要结合其他技术，比如全局状态管理（如 Redux）、事件监听器或者其他方式来确保确认对话框能够在适当的时间显示出来。

## 替代方案（React Router v6）

在 `React Router v6` 中，由于不再支持 `<Prompt>` 组件，`getUserConfirmation` 的用法也发生了变化。如果你想实现类似的功能，通常会依赖于监听 `beforeunload` 事件或结合 `useEffect` 和 `useNavigate` 来手动控制导航行为。

### 使用 `beforeunload` 事件

```jsx
import React, { useEffect } from "react";

function BeforeUnloadPrompt({ when }) {
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = ""; // 必须设置 returnValue 才能触发默认提示
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when]);

  return null; // 此组件本身不需要渲染任何内容
}

export default BeforeUnloadPrompt;
```

### 结合 `useEffect` 和 `useNavigate`

```jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function CustomPrompt({ when, message }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!when) return;

    const unblock = navigate.block((tx) => {
      if (window.confirm(message)) {
        unblock(); // 解除阻止以允许导航
        navigate(tx.pathname, { replace: tx.action === "POP" });
      }
    });

    return unblock;
  }, [when, message, location, navigate]);

  return null;
}

export default CustomPrompt;
```

在这两个例子中，第一个展示了如何使用 `beforeunload` 事件来捕获窗口关闭或刷新的动作，而第二个则展示了如何阻止内部导航并在用户确认后允许其继续。

## 总结

`getUserConfirmation` 提供了一种灵活的方式来定制确认对话框的行为，使得你可以更好地融入应用程序的整体设计和用户体验。对于 `React Router v5`，你可以直接配置 `history` 对象中的 `getUserConfirmation` 属性；而对于 `v6`，你可能需要采用不同的策略，如监听 `beforeunload` 或者使用钩子来实现类似的导航拦截功能。
