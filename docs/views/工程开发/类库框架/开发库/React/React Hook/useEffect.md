# useEffect：处理副作用

`useEffect` 是 React 中一个非常重要的 Hook，它允许你在函数组件中执行副作用操作。所谓“副作用”，指的是那些与渲染本身无关的操作，比如数据获取、订阅或手动修改 DOM 等。`useEffect` 提供了一种集中管理这些副作用的方式，并且可以替代类组件中的生命周期方法如 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount`。

## `useEffect` 的执行时机

`useEffect` 会在每次渲染完成后同步执行，即在浏览器绘制（paint）之前。具体来说：

1. **初次渲染**：当组件首次挂载到 DOM 后，React 会立即执行所有没有依赖项或者依赖项为空数组 (`[]`) 的 `useEffect`。
2. **后续更新**：每当组件重新渲染，并且 `useEffect` 的依赖项发生变化时，React 会先清理前一次的副作用（如果有），然后再执行新的副作用。

## `useEffect` 的不同执行情况

根据你提供的依赖项，`useEffect` 的执行行为会有所不同：

### 1. 空依赖项数组 `[]`

```jsx
useEffect(() => {
  // 仅在组件首次挂载时执行
  return () => {
    // 组件卸载时清理副作用
  };
}, []); // 空数组表示仅在首次挂载时执行
```

- **执行时机**：仅在组件首次挂载时执行。
- **清理时机**：仅在组件卸载时执行清理函数。

### 2. 有依赖项

```jsx
useEffect(() => {
  // 当 dependency 发生变化时执行
  return () => {
    // 清理副作用
  };
}, [dependency]); // 依赖项列表
```

- **执行时机**：在组件首次挂载以及每次指定的依赖项发生变化后执行。
- **清理时机**：在依赖项变化导致新的 `useEffect` 执行之前，先执行上一次的清理函数。

### 3. 无依赖项

```jsx
useEffect(() => {
  // 每次渲染后都执行
  return () => {
    // 清理副作用
  };
});
```

- **执行时机**：每次组件重新渲染后都会执行。
- **清理时机**：在每次重新渲染之前执行清理函数。

## 性能优化

有时你可能不想让 `useEffect` 在每次渲染后都执行，即使它的依赖项发生了变化。为了实现这一点，你可以使用 `useMemo` 或 `useCallback` 来记忆化计算结果或回调函数，从而减少不必要的副作用执行。

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

const memoizedCallback = useCallback(() => doSomething(a, b), [a, b]);
```

## 异步操作

处理异步操作时，需要注意的是 `useEffect` 内部不能直接返回一个 Promise，因为它期望的是一个同步的清理函数或者 undefined。如果你需要在 `useEffect` 中处理异步逻辑，应该创建一个异步函数并在 `useEffect` 内部调用它：

```jsx
useEffect(() => {
  async function fetchData() {
    const result = await fetchDataFromServer();
    setData(result);
  }

  fetchData();

  return () => {
    // 清理逻辑（如果有的话）
  };
}, []);
```

## 实例

### 示例 1：首次渲染时加载数据

这是最常见的情况之一，在组件首次挂载时从服务器获取数据。

```jsx
import React, { useState, useEffect } from "react";

function DataFetching() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // 模拟 API 请求
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // 空数组表示仅在首次渲染时执行

  return (
    <div>
      {data ? (
        <ul>
          {data.map((item) => (
            <li key={item.id}>{item.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default DataFetching;
```

在这个例子中：

- `useEffect` 在组件首次挂载时执行一次。
- 使用空数组 `[]` 作为依赖项，确保副作用只会在组件挂载时触发。
- `fetch` 函数用于模拟 API 请求，并将响应的数据保存到组件的状态中。

### 示例 2：监听状态变化并执行副作用

有时你可能需要在某些状态发生变化时执行特定的副作用。例如，当用户选择不同的选项卡时，你需要根据选择的内容加载相应数据。

```jsx
import React, { useState, useEffect } from "react";

function TabbedContent() {
  const [selectedTab, setSelectedTab] = useState("tab1");
  const [content, setContent] = useState(null);

  useEffect(() => {
    // 根据 selectedTab 加载不同内容
    if (selectedTab === "tab1") {
      fetch("/api/tab1-content")
        .then((response) => response.json())
        .then((data) => setContent(data));
    } else if (selectedTab === "tab2") {
      fetch("/api/tab2-content")
        .then((response) => response.json())
        .then((data) => setContent(data));
    }
  }, [selectedTab]); // 当 selectedTab 变化时触发

  return (
    <div>
      <button onClick={() => setSelectedTab("tab1")}>Tab 1</button>
      <button onClick={() => setSelectedTab("tab2")}>Tab 2</button>

      <div>{content ? content : "Loading..."}</div>
    </div>
  );
}

export default TabbedContent;
```

在这个例子中：

- `useEffect` 的依赖项是 `selectedTab`，因此每当这个状态改变时，都会重新执行副作用以加载新的内容。
- 这种方式可以让你轻松地实现基于状态变化的动态内容加载。

### 示例 3：设置和清理定时器

有时候你可能需要在组件内设置定时器或其他异步任务，并确保在组件卸载时正确清理这些任务，以避免内存泄漏。

```jsx
import React, { useState, useEffect } from "react";

function Timer() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 1000);

    // 清理定时器
    return () => clearInterval(interval);
  }, []); // 空数组表示仅在首次渲染时执行

  return (
    <div>
      <p>Seconds: {seconds}</p>
    </div>
  );
}

export default Timer;
```

在这个例子中：

- `useEffect` 设置了一个每秒递增计数器的定时器。
- 返回一个清理函数，在组件卸载前清除定时器，防止内存泄漏。
- 使用空数组 `[]` 确保定时器只会在组件挂载时启动一次。

### 示例 4：监听浏览器窗口大小变化

你可以使用 `useEffect` 来监听浏览器窗口的尺寸变化，并根据这些变化调整组件的行为或样式。

```jsx
import React, { useState, useEffect } from "react";

function ResponsiveComponent() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    // 清理事件监听器
    return () => window.removeEventListener("resize", handleResize);
  }, []); // 空数组表示仅在首次渲染时添加监听器

  return (
    <div>
      <p>
        Window size: {windowSize.width} x {windowSize.height}
      </p>
    </div>
  );
}

export default ResponsiveComponent;
```

在这个例子中：

- `useEffect` 添加了一个 `resize` 事件监听器，用于检测窗口大小的变化。
- 返回一个清理函数，在组件卸载前移除事件监听器，确保没有内存泄漏。
- 使用空数组 `[]` 确保事件监听器只会在组件挂载时添加一次。

### 示例 5：集成第三方库（如 Lodash 的防抖）

当你使用第三方库时，`useEffect` 可以帮助你管理这些库的初始化和销毁逻辑。

```jsx
import React, { useState, useEffect } from "react";
import debounce from "lodash/debounce";

function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  useEffect(() => {
    const search = async (q) => {
      const response = await fetch(`/api/search?q=${q}`);
      const data = await response.json();
      setResults(data);
    };

    const debouncedSearch = debounce(search, 300);

    // 监听 query 的变化
    if (query) {
      debouncedSearch(query);
    } else {
      setResults([]);
    }

    // 清理防抖函数
    return () => debouncedSearch.cancel();
  }, [query]); // 依赖项为 query

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul>
        {results.map((result) => (
          <li key={result.id}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default SearchInput;
```

在这个例子中：

- `useEffect` 集成了 Lodash 的 `debounce` 函数，用于延迟搜索请求，减少不必要的 API 调用。
- 每当 `query` 发生变化时，都会调用防抖后的搜索函数。
- 返回一个清理函数，在组件卸载前取消防抖函数，确保不会执行未完成的搜索请求。
- 依赖项为 `query`，确保每次查询变化时都会重新执行副作用。

## 注意事项

1. **不要在循环、条件或嵌套函数中调用 Hooks**：确保所有对 `useEffect` 和其他 Hooks 的调用都在组件的顶层，以保持每次渲染时的顺序一致。
2. **依赖项数组要准确**：确保你提供的依赖项数组包含了所有影响副作用逻辑的变量。如果遗漏了必要的依赖项，可能会导致副作用不按预期工作。同时，尽量避免不必要的依赖项，因为这会导致副作用过于频繁地执行。
3. **副作用的顺序**：`useEffect` 的执行顺序是在所有的 DOM 更新之后。这意味着你可以安全地读取最新的 DOM 节点来执行副作用。
4. **清理副作用**：对于每个新的副作用执行，React 会先调用之前的清理函数（如果有）。因此，确保你的清理逻辑是幂等的，即多次调用不会产生不同的结果。
5. **与类组件钩子区别**：`useEffect` 和类组件的钩子（如 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount`）在某些情况下有相似的功能，但存在一些差异。
   - `componentDidMount` 和 `componentDidUpdate`：更改了真实 DOM，但用户不会看到任何变化。
   - `useEffect`：更新了真实 DOM，用户会看到变化。
6. 副作用函数中，如果使用了函数上下文的变量，由于闭包的影响，会导致副作用函数中的变量不会实时变化。
7. 副作用函数在每次注册时，会覆盖掉之前的副作用函数，因此尽量保持副作用函数的稳定，否则控制起来比较负载。
8. **同步执行**：虽然 `useEffect` 在渲染之后执行，但它仍然是同步的，这意味着它会在浏览器绘制之前完成。因此，如果你的副作用是异步的（例如网络请求），它不会阻塞页面的绘制。
9. **清理副作用**：如果 `useEffect` 返回了一个函数，这个函数会在下一次渲染前作为清理逻辑执行，确保旧的副作用被正确清除。

## 总结

通过理解 `useEffect` 的工作原理及其最佳实践，你可以更好地决定何时以及如何使用它来管理函数组件的副作用逻辑。`useEffect` 是构建动态和响应式用户界面的重要工具，正确地使用它可以显著提升应用程序的性能和可靠性。
