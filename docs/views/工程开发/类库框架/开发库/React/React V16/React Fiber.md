# React Fiber

React Fiber 是 React 16 引入的一项重大内部架构改进，它重新设计了 React 的协调（Reconciliation）算法和渲染引擎。Fiber 架构使得 React 能够更好地处理复杂的用户界面，并提供了诸如时间切片（time slicing）、暂停工作、优先级调度等功能，从而提升了应用程序的响应性和性能。

## 什么是 React Fiber？

React Fiber 是 React 内部用于表示组件树的数据结构，以及管理这些组件生命周期的新协调引擎。每个 Fiber 节点代表一个组件实例及其属性，包括它的子组件。通过这种新的数据结构，React 可以更高效地管理和更新虚拟 DOM 树。

## 主要特点

### 1. **增量渲染（Incremental Rendering）**

- **时间切片（Time Slicing）**：Fiber 允许 React 将渲染任务分解成小块，可以在浏览器空闲时执行这些小块任务。这意味着即使有大量 UI 更新，React 也可以在必要时暂停渲染，允许浏览器处理其他高优先级的任务（如用户输入），从而保持页面的流畅性。

### 2. **优先级调度（Priority Scheduling）**

- **任务优先级**：Fiber 引入了不同级别的任务优先级，例如用户输入通常被认为是高优先级任务，而后台数据获取则可能是低优先级任务。React 可以根据任务的紧急程度来决定何时处理它们，确保用户体验不受影响。

### 3. **暂停和恢复工作（Suspense and Resumption）**

- **暂停能力**：Fiber 支持暂停正在进行的工作，稍后继续从断点处恢复。这特别适用于异步渲染场景，比如当等待数据加载完成时，React 可以先渲染已有的内容，然后在数据到达后再更新剩余部分。

### 4. **更好的调试支持**

- **详细的 Fiber 树信息**：由于每个 Fiber 节点都包含了丰富的元数据，开发者可以更容易地跟踪组件的状态变化和渲染路径，这对于调试复杂的应用程序非常有用。

## Fiber 节点结构

每个 Fiber 节点包含了许多关于组件的信息，帮助 React 管理组件的生命周期、状态和渲染逻辑。以下是 Fiber 节点中的一些关键属性：

- **`type`**：描述了这个节点代表的是什么类型的组件（如函数组件、类组件或宿主组件）。
- **`key`**：对于列表中的元素，`key` 是一个特殊的字符串属性，用来标识每个列表项。
- **`props`**：包含传递给组件的所有属性，包括 `children`。
- **`stateNode`**：对于宿主组件，这是实际的 DOM 节点；对于类组件，这是组件实例；对于函数组件，它是 `null`。
- **`child`、`sibling`、`return`**：定义了 Fiber 树的结构，允许 React 遍历整个树形结构。
- **`effectTag`**：表示该节点需要执行的操作类型，例如插入、更新或删除。
- **`alternate`**：指向在上一次渲染中对应的节点，使 React 能够比较新旧树之间的差异。
- **`memoizedProps` 和 `pendingProps`**：分别存储当前渲染周期和下一个渲染周期的属性。
- **`memoizedState`**：存储组件的最新状态。
- **`updateQueue`**：包含所有待处理的状态更新。

## 协调过程

协调是 React 比较新旧虚拟 DOM 树的过程，目的是找出最小的变化集，以便尽可能少地更新真实 DOM。在 Fiber 架构下，协调过程变得更加灵活和高效：

1. **创建 Fiber 树**：每当组件的状态或属性发生变化时，React 会基于最新的状态生成一个新的 Fiber 树。
2. **遍历 Fiber 树**：React 会递归地遍历新旧两棵树，找到不同之处并记录下来。
3. **构建效果列表**：根据找到的不同之处，React 会构建一个副作用列表，其中包含了所有需要应用的效果（如 DOM 更新）。
4. **提交阶段**：最后，React 会应用所有之前计算好的 DOM 更新。

## 性能优化

利用 Fiber 架构，你可以采取以下几种优化措施来提升应用程序的性能：

- **减少不必要的重新渲染**：使用 `React.memo`、`useMemo`、`useCallback` 或者 `PureComponent` 来避免组件在没有实际变化的情况下重新渲染。
- **懒加载组件**：使用 `React.lazy` 和 `Suspense` 来按需加载组件，减少初始加载时间。
- **合理使用 Keys**：为列表项提供稳定的 `key` 属性，有助于 React 更有效地管理列表中的元素。
- **避免深层嵌套**：尽量保持组件层次结构扁平化，以减少 Diffing 的复杂度。
- **使用 Web Workers 或 OffscreenCanvas**：对于计算密集型任务，考虑将它们移到 Web Worker 中运行，或者使用 OffscreenCanvas 来处理复杂的图形渲染，以减轻主线程的压力。

## 示例：理解 Fiber 工作原理

假设我们有一个简单的计数器应用：

```jsx
import React, { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>你点击了 {count} 次</p>
      <button onClick={() => setCount(count + 1)}>点我</button>
    </div>
  );
}
```

在这个例子中：

- 当 `Counter` 组件首次渲染时，React 会创建一个 Fiber 树，其中包含 `<div>`、`<p>` 和 `<button>` 的 Fiber 节点。
- 每次点击按钮时，`setCount` 触发状态更新，React 会重新渲染 `Counter` 组件，并比较新旧 Fiber 树之间的差异。
- 如果发现 `<p>` 的文本内容发生了变化，React 会更新相应的 DOM 节点，但不会重绘整个页面。
- 由于 Fiber 架构的支持，React 可以在必要时暂停渲染任务，允许浏览器处理其他高优先级的任务（如用户输入），从而保持页面的流畅性。

## 总结

React Fiber 是一项重要的内部架构改进，它通过引入新的协调引擎和数据结构，使得 React 能够更高效地管理和更新复杂的用户界面。理解 Fiber 的工作原理可以帮助开发者更好地优化应用程序性能，以及调试复杂的 UI 行为。
