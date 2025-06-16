# beforeunload

`beforeunload` 是一个浏览器事件，当窗口、标签页或文档即将卸载时触发。这个事件在以下几种情况下会被触发：

- 用户关闭浏览器窗口或标签页。
- 用户导航到新的页面（点击链接、提交表单等）。
- 用户刷新页面。
- JavaScript 代码调用了 `window.location.href`、`window.assign()` 或者 `window.reload()` 方法。

## 使用场景

- **防止数据丢失**：如果你的应用程序中有未保存的数据，可以在用户尝试离开页面时提示他们保存更改。
- **确认导航**：询问用户是否真的要离开当前页面，特别是在执行某些关键操作之前。
- **清理资源**：确保在页面卸载之前正确地清理资源，例如停止定时器、取消网络请求等。

## 实现 `beforeunload` 事件监听

你可以通过添加事件监听器来监听 `beforeunload` 事件，并返回一个字符串作为消息以显示给用户的确认对话框。然而，现代浏览器对这个消息的自定义能力有一定的限制，通常会忽略你设置的具体文本，而是显示一个默认的消息。

### 示例代码

```jsx
import React, { useEffect } from "react";

function BeforeUnloadPrompt({ when, message }) {
  useEffect(() => {
    if (!when) return;

    const handleBeforeUnload = (event) => {
      // 设置 returnValue 属性是必需的，即使它可能不会被使用
      event.preventDefault();
      event.returnValue = ""; // 返回任意字符串都会触发浏览器的默认提示
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [when, message]);

  return null; // 此组件本身不需要渲染任何内容
}

export default BeforeUnloadPrompt;
```

在这个例子中，`BeforeUnloadPrompt` 组件会在 `when` 为 `true` 时添加 `beforeunload` 事件监听器，并在组件卸载或 `when` 变为 `false` 时移除监听器。

## 注意事项

1. **浏览器行为**：

   - 现代浏览器已经限制了开发者对 `beforeunload` 对话框消息的控制。大多数浏览器会忽略你提供的 `message` 参数，转而显示自己的默认文本。
   - 某些浏览器可能会完全阻止 `beforeunload` 弹出框，特别是对于那些没有用户交互就试图触发它的脚本。

2. **性能优化**：

   - 只有在确实需要的时候才添加 `beforeunload` 监听器，避免不必要的开销。
   - 在不再需要时及时移除监听器，以防止内存泄漏。

3. **用户体验**：

   - 过度使用 `beforeunload` 可能会导致糟糕的用户体验，因为它会打断用户的正常操作流程。
   - 确保你的应用只在真正有必要的情况下才拦截用户的导航意图，并且提供的消息清晰明确。

4. **异步操作**：

   - `beforeunload` 事件处理函数必须同步完成，不能包含异步操作（如 AJAX 请求）。这是因为浏览器不允许延迟页面卸载过程。

5. **移动端支持**：

   - 部分移动浏览器对 `beforeunload` 的支持有限，或者根本不支持。

6. **替代方案**：
   - 如果你需要更复杂的逻辑来决定是否允许用户离开页面，可以考虑结合其他技术，如模态框组件和路由守卫（对于单页应用程序）。

## 结合 `React Router`

对于单页应用程序（SPA），除了全局的 `beforeunload` 事件外，你还可以利用 `React Router` 提供的工具来实现更细粒度的导航拦截。例如，在 `React Router v6` 中，你可以使用 `useNavigate` 和 `useEffect` 来阻止内部导航并在用户确认后允许其继续。

### 示例：阻止内部导航

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

这段代码展示了如何在用户尝试离开当前页面时显示确认对话框。如果用户选择继续，则解除阻止并允许导航；否则保持在当前页面。

## 总结

`beforeunload` 事件是一个有用的工具，可以帮助你在用户离开页面之前进行最后的确认或清理工作。尽管它有一些局限性，但在适当的场景下仍然可以提供重要的功能。
