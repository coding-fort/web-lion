# redux-thunk（允许 dispatch 函数而不是 plain actions）

`redux-thunk` 是 Redux 中最常用的中间件之一，它允许你编写返回函数而不是普通对象的 action creators。这种 thunk 函数可以包含异步逻辑，并且可以根据需要延迟 dispatch actions。这使得处理像 API 请求这样的异步操作变得更加简单和直观。

## 安装

首先，你需要安装 `redux-thunk`：

```bash
npm install redux-thunk
```

## 配置 Store

接下来，你需要在创建 Redux store 时应用 `redux-thunk` 中间件。你可以使用 `applyMiddleware` 来做到这一点：

```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers'; // 导入你的根 reducer

const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // 应用 thunk 中间件
);
```

## 使用 Thunks

### 创建 Thunk Action Creators

Thunk action creator 返回一个函数，该函数接收 `dispatch` 和 `getState` 作为参数。这样就可以在这个函数内部调用 `dispatch` 来发送多个 actions 或者执行异步逻辑。

```javascript
// 异步 action creator
function fetchUser(id) {
  return function(dispatch) {
    dispatch({ type: 'FETCH_USER_REQUEST' }); // 发送请求开始的 action

    return fetch(`https://api.example.com/users/${id}`)
      .then(response => response.json())
      .then(user => {
        dispatch({ type: 'FETCH_USER_SUCCESS', payload: user }); // 发送成功获取用户的 action
      })
      .catch(error => {
        dispatch({ type: 'FETCH_USER_FAILURE', payload: error }); // 发送失败的 action
      });
  };
}
```

在这个例子中，`fetchUser` 是一个 thunk action creator，它在接收到用户 ID 后发起一个网络请求。根据请求的结果，它会分发不同的 actions 来更新状态。

### 在组件中使用 Thunks

当你有了 thunk action creator 后，可以在 React 组件中通过 `useDispatch` Hook 来调用它们：

```jsx
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchUser } from './actions'; // 假设你已经定义了这个 thunk action creator

function UserProfile({ userId }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser(userId)); // 分发 thunk action
  }, [dispatch, userId]);

  return <div>User profile component</div>;
}

export default UserProfile;
```

这里，我们在组件挂载或 `userId` 改变时调用了 `fetchUser` thunk action creator，以获取并展示用户信息。

## 处理异步逻辑

`redux-thunk` 的一大优势在于它可以轻松处理异步逻辑。除了上面提到的简单的 Promise 链式调用之外，你还可以结合其他库（如 `axios`）来简化 HTTP 请求，或者使用 `async/await` 语法让代码更加简洁易读。

```javascript
// 使用 async/await 的异步 action creator
function fetchUserAsync(id) {
  return async function(dispatch) {
    dispatch({ type: 'FETCH_USER_REQUEST' });

    try {
      const response = await fetch(`https://api.example.com/users/${id}`);
      const user = await response.json();
      dispatch({ type: 'FETCH_USER_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'FETCH_USER_FAILURE', payload: error });
    }
  };
}
```

这种方式不仅使代码更清晰，而且更容易调试和维护。

## 结合 useSelector 和 useDispatch

为了完整地演示如何在 React 组件中使用 `redux-thunk`，我们可以将 `useSelector` 和 `useDispatch` Hooks 结合起来，以确保我们的组件能够响应状态的变化并触发必要的副作用。

```jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAsync } from './actions';

function UserProfile({ userId }) {
  const dispatch = useDispatch();
  const { loading, error, user } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUserAsync(userId));
  }, [dispatch, userId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>{user.name}</h1>
      {/* 渲染更多用户信息 */}
    </div>
  );
}

export default UserProfile;
```

在这个例子中，我们使用了 `useSelector` 来选择当前的状态片段，并根据这些状态来决定渲染什么内容。同时，我们仍然使用 `useDispatch` 来分发 thunk action creator。

## 总结

`redux-thunk` 提供了一种非常灵活且易于理解的方式来处理 Redux 中的异步逻辑和其他复杂的 side effects。通过允许 action creators 返回函数，它扩展了 Redux 的功能，而不需要改变其核心设计原则。