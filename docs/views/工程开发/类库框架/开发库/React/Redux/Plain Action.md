# Plain Action

在 Redux 中，**plain action**（普通动作）是指一个简单的 JavaScript 对象，用于描述应用中发生的一个事件或操作。每个 plain action 至少包含一个 `type` 属性，它是一个字符串常量，用来标识该 action 的目的或含义。除此之外，action 还可以包含其他属性，如 `payload`、`meta` 和 `error`，这些属性携带了与 action 相关的额外信息。

## Plain Action 的结构

根据 Flux Standard Action (FSA) 规范，一个标准的 plain action 应该包含以下字段：

1. **`type`**：必需。一个字符串常量，表示这个 action 的类型。
2. **`payload`**：可选。包含了 action 的有效载荷数据。对于错误类型的 action，`payload` 应该是错误对象，并且此时 `error` 字段应该为 `true`。
3. **`meta`**：可选。用于存储任何类型的元数据，例如时间戳、来源等。
4. **`error`**：可选布尔值。如果 action 表示一个错误条件，则设置为 `true`。

一个符合 FSA 规范的 plain action 示例：

```javascript
{
  type: 'ADD_TODO',
  payload: {
    id: 1,
    text: 'Learn about actions'
  }
}
```

对于错误情况下的 action：

```javascript
{
  type: 'FETCH_USER_FAILURE',
  payload: new Error('Failed to fetch user'),
  error: true
}
```

## 创建 Plain Actions

通常你会定义一些 action creator 函数来生成这些 plain actions。Action creators 是返回 action 对象的函数，它们接收参数并使用这些参数构建出具体的 action。

### 简单的 Action Creator

```javascript
const ADD_TODO = "ADD_TODO";

function addTodo(text) {
  return {
    type: ADD_TODO,
    payload: { text },
  };
}

// 使用
store.dispatch(addTodo("Learn about actions"));
```

### 带 Payload 的 Action Creator

```javascript
const INCREMENT = "INCREMENT";

function increment(amount = 1) {
  return {
    type: INCREMENT,
    payload: amount,
  };
}

// 使用
store.dispatch(increment(5));
```

### 异步逻辑相关的 Action Creator

尽管 plain actions 本身不处理异步逻辑，但你可以结合中间件（如 `redux-thunk` 或 `redux-saga`）来创建返回函数而不是普通对象的 action creators，从而支持异步操作。

```javascript
import axios from "axios";

const FETCH_USER_REQUEST = "FETCH_USER_REQUEST";
const FETCH_USER_SUCCESS = "FETCH_USER_SUCCESS";
const FETCH_USER_FAILURE = "FETCH_USER_FAILURE";

function fetchUser(id) {
  return function (dispatch) {
    dispatch({ type: FETCH_USER_REQUEST });

    return axios
      .get(`https://api.example.com/users/${id}`)
      .then((response) => response.data)
      .then((user) => dispatch({ type: FETCH_USER_SUCCESS, payload: user }))
      .catch((error) =>
        dispatch({ type: FETCH_USER_FAILURE, payload: error, error: true })
      );
  };
}

// 使用
store.dispatch(fetchUser(1));
```

在这个例子中，`fetchUser` 是一个 thunk action creator，它内部执行了一个异步请求，并根据结果 dispatch 了多个 plain actions。

## Best Practices

- **使用常量定义 Type**：将 action 类型定义为常量有助于避免拼写错误，并使代码更易于维护和重构。

  ```javascript
  // actions/types.js
  export const ADD_TODO = "ADD_TODO";
  export const INCREMENT = "INCREMENT";
  ```

- **遵循 Flux Standard Action (FSA)**：确保你的 actions 遵循 FSA 规范，这可以使你的 actions 更加标准化，易于理解和互操作。
- **测试 Action Creators**：由于 action creators 是纯函数，因此它们非常容易测试。你可以编写单元测试来验证给定输入时 action creators 返回预期的结果。

  ```javascript
  import { addTodo, increment } from "./actions";

  test("addTodo action creator", () => {
    expect(addTodo("Learn about actions")).toEqual({
      type: "ADD_TODO",
      payload: { text: "Learn about actions" },
    });
  });

  test("increment action creator", () => {
    expect(increment(5)).toEqual({ type: "INCREMENT", payload: 5 });
  });
  ```

## 总结

Plain actions 在 Redux 中扮演着重要的角色，它们充当了视图层与业务逻辑之间的桥梁。通过定义清晰的 action 类型和 action creators，你可以确保应用程序的状态变化是可预测且易于追踪的。结合中间件处理异步逻辑和其他复杂场景，可以让 Redux 应用程序更加健壮和灵活。
