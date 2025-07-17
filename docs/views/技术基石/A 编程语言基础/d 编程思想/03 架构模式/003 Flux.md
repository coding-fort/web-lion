# Flux

**Flux** 是一种由 Facebook 开发的前端应用架构模式，用于管理应用的数据流。它遵循单向数据流原则，主要解决了大型应用中数据流向复杂、状态管理困难的问题，尤其适用于 React 应用（但也可用于其他框架）。

## 核心概念

Flux 架构的核心由四个部分组成：

1. **视图层（View）**

   - 通常是 React 组件，负责渲染 UI。
   - 监听 Store 变化并更新界面。

2. **动作（Action）**

   - 描述发生了什么的对象，包含 `type`（动作类型）和可选的 `payload`（数据）。
   - 例如：`{ type: 'ADD_TODO', payload: { text: '学习 Flux' } }`。

3. **分发器（Dispatcher）**

   - 全局单例，负责接收所有 Action 并将其分发给所有注册的 Store 回调。
   - 确保 Action 按顺序处理，避免数据竞争。

4. **存储（Store）**
   - 管理应用的状态（State）和逻辑。
   - 响应 Dispatcher 传来的 Action，更新自身状态，并通知 View。

## 单向数据流

Flux 的核心是**单向数据流**，流程如下：

1. **用户交互**：在 View 中触发 Action（如点击按钮）。
2. **Action 创建**：通过 Action Creator 函数创建 Action。
3. **Action 分发**：Dispatcher 将 Action 发送给所有 Store。
4. **Store 更新**：Store 处理 Action 并更新状态。
5. **View 更新**：Store 通知 View 状态已变更，View 重新渲染。

```
用户交互 → Action → Dispatcher → Store → View
                ↑                   ↓
                └───────────────────┘
```

## 与 MVC 的区别

| **特性**       | **MVC**               | **Flux**               |
| -------------- | --------------------- | ---------------------- |
| **数据流**     | 双向（复杂循环）      | 单向（严格顺序）       |
| **数据所有权** | 多个 Model 可共享数据 | 单一 Store 管理状态    |
| **更新逻辑**   | Model 直接更新自身    | Store 通过 Action 更新 |
| **复杂度控制** | 适用于中小型应用      | 更适合大型复杂应用     |

## 示例实现

以下是一个简化的 Flux 示例（使用 JavaScript 和 React）：

### 1. **定义 Action Types**

```javascript
// actions/TodoActionTypes.js
export const ADD_TODO = "ADD_TODO";
export const REMOVE_TODO = "REMOVE_TODO";
```

### 2. **创建 Action Creators**

```javascript
// actions/TodoActions.js
import { Dispatcher } from "flux";
const dispatcher = new Dispatcher();

export const addTodo = (text) => {
  dispatcher.dispatch({
    type: ADD_TODO,
    payload: { text },
  });
};

export const removeTodo = (id) => {
  dispatcher.dispatch({
    type: REMOVE_TODO,
    payload: { id },
  });
};
```

### 3. **定义 Store**

```javascript
// stores/TodoStore.js
import { EventEmitter } from "events";
import dispatcher from "../dispatcher";
import { ADD_TODO, REMOVE_TODO } from "../actions/TodoActionTypes";

class TodoStore extends EventEmitter {
  constructor() {
    super();
    this.todos = [];
  }

  getAll() {
    return this.todos;
  }

  handleActions(action) {
    switch (action.type) {
      case ADD_TODO:
        this.todos.push({
          id: Date.now(),
          text: action.payload.text,
        });
        this.emit("change");
        break;
      case REMOVE_TODO:
        this.todos = this.todos.filter((todo) => todo.id !== action.payload.id);
        this.emit("change");
        break;
    }
  }
}

const todoStore = new TodoStore();
dispatcher.register(todoStore.handleActions.bind(todoStore));
export default todoStore;
```

### 4. **创建 React 视图组件**

```javascript
// components/TodoList.js
import React, { useEffect, useState } from "react";
import todoStore from "../stores/TodoStore";
import { addTodo, removeTodo } from "../actions/TodoActions";

const TodoList = () => {
  const [todos, setTodos] = useState(todoStore.getAll());

  useEffect(() => {
    const handleChange = () => {
      setTodos(todoStore.getAll());
    };
    todoStore.on("change", handleChange);
    return () => todoStore.removeListener("change", handleChange);
  }, []);

  const handleAdd = (e) => {
    if (e.key === "Enter") {
      addTodo(e.target.value);
      e.target.value = "";
    }
  };

  return (
    <div>
      <input onKeyPress={handleAdd} placeholder="添加待办事项" />
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>删除</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
```

## Flux 的变体

- **Redux**：最流行的 Flux 实现，简化了 Dispatcher，使用纯函数 Reducer 管理状态，支持时间旅行调试。
- **MobX**：使用可观察状态和自动响应式更新，代码更简洁。
- **Vuex**：Vue.js 的状态管理模式，灵感来源于 Flux。

## 适用场景

- 大型单页应用（SPA），状态管理复杂。
- 多人协作开发的项目，需要明确的数据流规范。
- 需要时间旅行调试、撤销/重做等功能的应用。

## 总结

Flux 通过单向数据流和集中式状态管理，解决了大型前端应用中的数据流向混乱问题。虽然其原始实现相对繁琐，但 Redux 等变体已成为现代前端开发的主流选择，尤其在 React 生态中广泛应用。
