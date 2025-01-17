# useParams

`useParams` 是 `React Router` 提供的一个 Hook，用于在函数组件中获取 URL 中的动态参数。这些参数通常定义在路由路径模式中的占位符（例如 `/users/:id` 中的 `:id`）。通过 `useParams`，你可以轻松访问并使用这些参数来控制组件的行为或展示特定内容。

## useParams 的返回值

`useParams` 返回一个对象，该对象包含了所有匹配到的 URL 参数。每个键对应于路径模式中的占位符名称，而对应的值则是从 URL 中提取的实际参数值。

### 示例：返回的对象结构

假设你有一个路径模式为 `/users/:userId/posts/:postId`，并且当前 URL 是 `/users/123/posts/456`，那么 `useParams` 将返回如下对象：

```js
{
  userId: "123",
  postId: "456"
}
```

## 使用场景

- **显示特定资源**：根据 URL 参数加载和显示特定的数据，如用户资料、文章详情等。
- **构建嵌套路由**：利用父级路由中的参数来决定渲染哪些子路由。
- **表单预填充**：使用 URL 参数预先填充表单字段，比如编辑现有条目的页面。

## 示例代码

### 简单示例

```jsx
import React from "react";
import { useParams } from "react-router-dom";

function UserProfile() {
  const { userId } = useParams();

  return (
    <div>
      <h1>User Profile</h1>
      <p>User ID: {userId}</p>
    </div>
  );
}

export default UserProfile;
```

在这个例子中，`UserProfile` 组件会根据 URL 中的 `userId` 参数显示不同的用户信息。

### 结合 API 请求

通常你会结合 API 请求来获取与参数相关的数据。下面是一个更完整的例子，展示了如何在组件挂载时根据 `userId` 参数发起请求，并在接收到响应后更新状态。

```jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function UserProfile() {
  const [user, setUser] = useState(null);
  const { userId } = useParams();

  useEffect(() => {
    // 模拟 API 请求
    fetchUser(userId).then(setUser).catch(console.error);
  }, [userId]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{user.name}'s Profile</h1>
      <p>Email: {user.email}</p>
      {/* 更多用户信息 */}
    </div>
  );
}

// 模拟 API 请求函数
async function fetchUser(id) {
  // 实际应用中应替换为真实的 API 调用
  return new Promise((resolve) =>
    setTimeout(
      () => resolve({ id, name: `User ${id}`, email: `user${id}@example.com` }),
      1000
    )
  );
}

export default UserProfile;
```

### 嵌套路由中的应用

在嵌套路由的情况下，父级路由可以使用 `useParams` 来传递参数给子路由，或者根据参数决定渲染的内容。

```jsx
import React from "react";
import { Routes, Route, useParams } from "react-router-dom";
import UserProfile from "./UserProfile";
import UserPosts from "./UserPosts";

function UserLayout() {
  const { userId } = useParams();

  return (
    <div>
      <h2>User {userId}</h2>
      <nav>
        <ul>
          <li>
            <a href={`/users/${userId}/profile`}>Profile</a>
          </li>
          <li>
            <a href={`/users/${userId}/posts`}>Posts</a>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="profile" element={<UserProfile />} />
        <Route path="posts" element={<UserPosts />} />
      </Routes>
    </div>
  );
}

export default UserLayout;
```

在这个例子中，`UserLayout` 组件会根据 URL 中的 `userId` 参数来决定渲染哪个子路由。

## 注意事项

- **性能优化**：`useParams` 只会在 URL 参数发生变化时触发重新渲染，因此它不会导致不必要的性能问题。但是，请确保不要在不需要的地方频繁调用它。
- **类型安全**：如果你使用 TypeScript，可以通过定义接口或类型别名来为 `useParams` 的返回值指定预期的参数形状，从而提高代码的类型安全性。
- **默认值处理**：考虑到某些情况下 URL 参数可能不存在或为空字符串，最好添加适当的错误处理逻辑以避免潜在的问题。

## 总结

`useParams` 是一个简单但强大的工具，它使得开发者能够轻松地访问和操作 URL 中的动态参数。通过理解并正确利用这个 Hook，你可以实现更加灵活和动态的应用程序路由逻辑。
