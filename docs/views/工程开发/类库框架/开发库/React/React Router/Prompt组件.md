# <errb>Prompt 组件</errb>

`<Prompt>` 是 `React Router v5` 提供的一个组件，用于在用户尝试离开当前页面时显示确认对话框。它允许开发者控制用户是否可以导航离开当前页面，并提供一个自定义的消息来询问用户是否真的要离开。这对于防止用户意外丢失未保存的数据非常有用。

## `<Prompt>` 的属性

- **when** (布尔值)：指定是否应该激活提示。只有当此属性为 `true` 时，才会显示确认对话框。
- **message** (字符串或函数)：定义显示给用户的提示消息。可以是一个静态字符串，也可以是一个返回字符串的函数。如果使用函数，它将接收两个参数：
  - **location**: 用户正试图导航到的位置对象。
  - **action**: 导航动作 (`PUSH`, `REPLACE`, 或 `POP`)。

## 使用场景

- **表单数据保护**：当你有一个包含未保存更改的表单时，可以在用户尝试离开页面时提醒他们保存更改。
- **未完成任务提醒**：如果你的应用程序中有某些任务需要完成，可以提醒用户在离开之前完成这些任务。

## 示例代码

### 简单示例

```jsx
import React, { useState } from "react";
import { Prompt } from "react-router-dom";

function FormWithPrompt() {
  const [isBlocking, setIsBlocking] = useState(false);

  return (
    <form>
      <input
        type="text"
        placeholder="Enter some data"
        onChange={(e) => setIsBlocking(e.target.value.length > 0)}
      />
      <Prompt
        when={isBlocking}
        message="Are you sure you want to leave? You have unsaved changes."
      />
    </form>
  );
}

export default FormWithPrompt;
```

在这个例子中，只要输入框中有内容（即 `isBlocking` 为 `true`），用户尝试离开页面时就会看到确认对话框。

### 动态消息示例

你可以根据用户的导航意图动态地生成不同的消息：

```jsx
import React, { useState } from "react";
import { Prompt } from "react-router-dom";

function FormWithDynamicPrompt() {
  const [isBlocking, setIsBlocking] = useState(false);
  const [formData, setFormData] = useState("");

  const handleInputChange = (e) => {
    setFormData(e.target.value);
    setIsBlocking(e.target.value.length > 0);
  };

  const getMessage = (location, action) => {
    if (action === "POP") {
      return "You're leaving this page. Are you sure?";
    }
    return `You have unsaved changes. Do you really want to ${action.toLowerCase()} to "${
      location.pathname
    }"?`;
  };

  return (
    <form>
      <input
        type="text"
        value={formData}
        onChange={handleInputChange}
        placeholder="Enter some data"
      />
      <Prompt when={isBlocking} message={getMessage} />
    </form>
  );
}

export default FormWithDynamicPrompt;
```

在这个例子中，`getMessage` 函数会根据用户的导航动作和目标位置生成不同的提示信息。

## 注意事项

- **兼容性**：`<Prompt>` 组件仅适用于 `React Router v5` 及更早版本。在 `v6` 中已被移除，因此如果你正在使用 `v6`，则需要寻找替代方案来实现类似的功能。
- **用户体验**：虽然 `<Prompt>` 对于防止数据丢失很有用，但频繁或不恰当地使用它可能会导致不良的用户体验。确保只在必要时启用，并且提供的消息清晰明确。
- **浏览器行为**：并非所有浏览器都支持阻止导航的行为，而且一些浏览器可能会有不同的默认处理方式。测试时要注意这一点。

## 替代方案（React Router v6）

由于 `React Router v6` 不再支持 `<Prompt>` 组件，你可以通过监听 `window` 的 `beforeunload` 事件来实现类似的功能。这种方法适用于整个应用程序级别的拦截，而不仅仅是特定的路由。

```jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BeforeUnloadPrompt({ when }) {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!when) return;

    const handleWindowBeforeUnload = (event) => {
      event.preventDefault(); // 标准做法是设置 returnValue 属性
      event.returnValue = ""; // 返回任意字符串都会触发浏览器的默认提示
    };

    const handleNavigate = () => {
      if (window.confirm("Are you sure you want to leave?")) {
        return true;
      }
      return false;
    };

    window.addEventListener("beforeunload", handleWindowBeforeUnload);
    navigate.listen((to, from) => !handleNavigate() && navigate(from));

    return () => {
      window.removeEventListener("beforeunload", handleWindowBeforeUnload);
      navigate.listen(null); // 清除监听器
    };
  }, [when, location, navigate]);

  return null; // 这个组件本身不需要渲染任何东西
}

// 在你的表单组件中使用
function FormComponent() {
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <>
      <BeforeUnloadPrompt when={hasChanges} />
      {/* 表单内容 */}
    </>
  );
}

export default FormComponent;
```

这段代码展示了如何在 `React Router v6` 中实现类似的导航拦截逻辑。请注意，直接修改浏览器的 `beforeunload` 消息文本的能力已经被大多数现代浏览器所限制，所以你可能无法完全自定义提示框中的文字。

## 总结

`<Prompt>` 是一个方便的工具，可以帮助你在用户尝试离开页面时提供确认对话框。对于 `React Router v5`，它是一个内置组件；而对于 `v6`，你需要采用其他方法来实现相同的效果。无论哪种方式，都应该谨慎使用以确保良好的用户体验。
