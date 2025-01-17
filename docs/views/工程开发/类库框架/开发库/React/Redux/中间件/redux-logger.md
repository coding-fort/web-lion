# redux-logger（打印 actions 和状态变化）

`redux-logger` 是一个非常有用的 Redux 中间件，它允许你记录 Redux store 的所有状态变化和分发的动作。这对于调试应用程序、理解数据流以及追踪 bug 非常有帮助。通过 `redux-logger`，你可以直观地看到每次 action 被 dispatch 时的状态变更，从而更容易找出问题所在。

## 安装

首先，你需要安装 `redux-logger`：

```bash
npm install redux-logger
```

## 配置 Store

接下来，你需要在创建 Redux store 时应用 `redux-logger` 中间件。你可以使用 `applyMiddleware` 来做到这一点，并确保 `redux-logger` 是最后一个应用的中间件，以便它可以记录所有的 actions 和状态变化。

```javascript
import { createStore, applyMiddleware, compose } from "redux";
import logger from "redux-logger";
import rootReducer from "./reducers"; // 导入你的根 reducer

// 创建 store 并应用 logger middleware
const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(logger)
    // 如果你还想使用其他中间件，可以在这里添加它们
  )
);
```

> **注意**：如果你已经在使用像 `redux-devtools-extension` 这样的开发者工具，请确保不要同时启用 `redux-logger` 和 DevTools 的日志功能，以避免重复的日志输出。

## 使用 `redux-logger`

一旦配置完成，`redux-logger` 就会自动开始记录每次 dispatch 的 action 和相应状态的变化。默认情况下，它会在控制台中打印出以下信息：

- **prev state**（前一状态）：在 action 被处理之前的 Redux store 状态。
- **action**：被 dispatch 的 action 对象。
- **next state**（下一个状态）：在 action 被处理之后的 Redux store 状态。

### 自定义配置

`redux-logger` 提供了一些选项来自定义其行为。例如，你可以选择只记录某些类型的 actions，或者限制日志的深度。这可以通过传递一个配置对象给 `createLogger` 函数来实现。

```javascript
import { createStore, applyMiddleware, compose } from "redux";
import createLogger from "redux-logger";
import rootReducer from "./reducers";

const logger = createLogger({
  collapsed: true, // 默认折叠日志条目
  diff: true, // 显示状态差异
  duration: true, // 记录每个 action 的执行时间
  // 只记录特定类型的 actions
  predicate: (getState, action) => {
    return action.type !== "IGNORED_ACTION_TYPE";
  },
  // 设置日志的最大深度
  level: "info",
  logErrors: true,
  // 更多配置项...
});

const store = createStore(rootReducer, compose(applyMiddleware(logger)));
```

### 示例输出

当 `redux-logger` 被触发时，它通常会在浏览器的开发者工具控制台中产生类似如下的输出：

```
action @ 18:20:45.678
FETCH_USER_REQUEST {}
state @ 18:20:45.680
{ user: null, loading: true }
action @ 18:20:45.890
FETCH_USER_SUCCESS { payload: { id: 1, name: "John Doe" } }
state @ 18:20:45.892
{ user: { id: 1, name: "John Doe" }, loading: false }
```

## 注意事项

1. **生产环境**：在生产环境中部署应用时，建议禁用 `redux-logger` 或者设置条件仅在开发环境中启用它，以避免不必要的性能开销和安全风险。

   ```javascript
   const middleware =
     process.env.NODE_ENV === "production"
       ? applyMiddleware()
       : applyMiddleware(logger);
   ```

2. **性能影响**：虽然 `redux-logger` 对大多数应用来说不会造成显著的性能问题，但在高频率 dispatch 场景下可能会有一定影响。对于性能敏感的应用，考虑优化日志策略或完全移除 logger。

3. **与其他调试工具结合**：如果你已经在使用 Redux DevTools Extension 或类似的工具，那么可能不需要再使用 `redux-logger`，因为这些工具已经提供了相似的功能并且更加强大。

## 总结

`redux-logger` 是一个简单而强大的工具，可以帮助你在开发过程中更好地理解和调试 Redux 应用的状态管理。通过简单的配置，你可以轻松地跟踪每一个状态变化，并且可以根据需要调整日志的详细程度。
