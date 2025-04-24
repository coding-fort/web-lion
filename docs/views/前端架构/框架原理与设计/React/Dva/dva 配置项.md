# dva 配置项

创建 `dva.js` 应用对象时，你可以通过传递一个配置对象来定制应用的行为。这个配置对象允许你指定多个选项，以满足不同的开发需求。以下是 `dva` 创建应用时可以配置的参数：

## 创建 dva 应用

```javascript
import dva from "dva";

const app = dva({
  // 配置项
});
```

## 可配置的参数

### 1. `history`

用于配置路由使用的 history 模式。通常情况下，你会使用 `createBrowserHistory` 或 `createHashHistory` 来创建一个 history 对象。

- **类型**：`Object`
- **默认值**：`createHashHistory()`

#### 示例

```javascript
import { createBrowserHistory } from "history";
import dva from "dva";

const app = dva({
  history: createBrowserHistory(),
});
```

### 2. `initialState`

设置应用的初始状态。这对于需要预加载或从服务器获取初始数据的应用非常有用。

- **类型**：`Object`
- **默认值**：`{}`

#### 示例

```javascript
const app = dva({
  initialState: {
    user: {
      name: "Guest",
    },
  },
});
```

### 3. `onError`

定义全局错误处理函数。当 action 执行过程中抛出异常时会调用此函数。

- **类型**：`Function(error, dispatch)`

#### 示例

```javascript
const app = dva({
  onError(error) {
    console.error("Global error:", error.message);
  },
});
```

### 4. `onAction`

注册一个中间件，该中间件会在每次 dispatch 动作之前被调用。你可以利用它来进行日志记录、权限检查等操作。

- **类型**：`Array<Function>` 或 `Function(action, dispatch, getState)`

#### 示例

```javascript
const app = dva({
  onAction: [loggerMiddleware], // 数组形式
});

// 或者
const app = dva({
  onAction(action) {
    console.log("Dispatched action:", action);
  },
});
```

### 5. `onReducer`

允许你在所有 reducers 之后执行自定义逻辑。这对于在每次 state 更新后执行某些操作很有帮助，比如持久化 state 到本地存储。

- **类型**：`Function(reducer)`

#### 示例

```javascript
const app = dva({
  onReducer(reducer) {
    return (state, action) => {
      const newState = reducer(state, action);
      localStorage.setItem("appState", JSON.stringify(newState));
      return newState;
    };
  },
});
```

### 6. `onEffect`

为所有 effects 注册一个中间件。这可以用来拦截所有的异步操作，进行统一的日志记录或者性能监控。

- **类型**：`Function(effect, { call, put })`

#### 示例

```javascript
const app = dva({
  onEffect(effect, { call, put }) {
    console.log("Effect called:", effect.toString());
    return effect(...arguments);
  },
});
```

### 7. `extraParameters`

允许你向所有模型的 `effects` 和 `reducers` 中注入额外的参数。这对于跨模型共享工具函数或服务非常有用。

- **类型**：`Object`

#### 示例

```javascript
const app = dva({
  extraParameters: {
    apiClient: new ApiClient(),
  },
});
```

然后，在你的模型中你可以这样使用：

```javascript
export default {
  namespace: "example",

  state: {},

  effects: {
    *fetchData({ payload }, { call, put, select, apiClient }) {
      const data = yield call(apiClient.fetchData, payload);
      yield put({ type: "save", payload: data });
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, data: payload };
    },
  },
};
```

## 总结

通过这些配置项，你可以灵活地定制 `dva.js` 应用的行为，以适应各种复杂的业务场景。根据实际需求选择合适的配置项，可以帮助你构建更加健壮和可维护的应用程序。
