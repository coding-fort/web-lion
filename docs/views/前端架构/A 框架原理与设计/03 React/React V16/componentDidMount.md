# componentDidMount()

`componentDidMount` 是 React 类组件中的一个重要的生命周期方法，它在组件首次渲染到 DOM 后立即调用。这个方法是执行副作用（side effects）的理想场所，例如：

- 发起网络请求获取数据
- 订阅事件或消息
- 设置定时器
- 直接操作 DOM

## 方法签名

```jsx
componentDidMount();
```

这个方法没有任何参数，并且是在组件第一次挂载完成后调用的。

## 使用场景

### 发起网络请求

这是 `componentDidMount` 最常见的用途之一。你可以在组件挂载后立即发起网络请求来加载初始数据。

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    // 模拟发起网络请求
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => this.setState({ data }))
      .catch((error) => console.error("Error fetching data:", error));
  }

  render() {
    const { data } = this.state;
    return (
      <div>
        {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : "Loading..."}
      </div>
    );
  }
}
```

### 订阅事件

如果你需要订阅某些外部事件（如 WebSocket 消息、浏览器事件等），`componentDidMount` 是设置这些订阅的好地方。

```jsx
class MyComponent extends React.Component {
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    console.log("Window resized");
  };

  componentWillUnmount() {
    // 清除事件监听器
    window.removeEventListener("resize", this.handleResize);
  }

  render() {
    return <div>My Component</div>;
  }
}
```

### 设置定时器

如果你想在组件挂载后启动定时任务，可以使用 `setInterval` 或 `setTimeout`。

```jsx
class MyComponent extends React.Component {
  componentDidMount() {
    this.interval = setInterval(() => {
      console.log("This will run every second");
    }, 1000);
  }

  componentWillUnmount() {
    // 清除定时器
    clearInterval(this.interval);
  }

  render() {
    return <div>My Component</div>;
  }
}
```

## 注意事项

1. **清理副作用**：对于任何在 `componentDidMount` 中启动的副作用（如网络请求、事件监听器、定时器等），确保在组件卸载时通过 `componentWillUnmount` 进行清理，以避免内存泄漏或其他问题。

   ```jsx
   componentWillUnmount() {
     // 清理代码
   }
   ```

2. **异步操作**：虽然可以在 `componentDidMount` 中发起异步操作（如网络请求），但要注意处理错误情况，并考虑如何显示加载状态或错误信息给用户。

3. **不要直接修改 props**：`componentDidMount` 中不应该直接修改 props。如果需要根据 props 更新状态，请使用 `getDerivedStateFromProps` 或者更推荐的方式是让父组件负责管理状态并通过 props 传递给子组件。

4. **与严格模式兼容**：React 的严格模式会模拟挂载和卸载过程两次，以帮助开发者发现潜在的问题。因此，在 `componentDidMount` 中执行的操作应该是幂等的，即多次执行不会产生不同的结果。

## 函数组件中的替代方案

对于函数组件，你可以使用 `useEffect` Hook 来实现类似的功能。`useEffect` 提供了更灵活的方式来处理副作用，并且可以通过依赖项数组控制何时触发效果。

```jsx
import React, { useEffect, useState } from "react";

function MyComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 模拟发起网络请求
    fetch("/api/data")
      .then((response) => response.json())
      .then(setData)
      .catch((error) => console.error("Error fetching data:", error));

    // 返回一个清理函数（可选）
    return () => {
      // 清理逻辑
    };
  }, []); // 空数组表示仅在首次渲染后执行

  return (
    <div>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : "Loading..."}
    </div>
  );
}

export default MyComponent;
```
