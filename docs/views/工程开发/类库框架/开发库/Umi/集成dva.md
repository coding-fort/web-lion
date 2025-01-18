# 集成 dva

在 `Umi.js` 3.x 及以上版本中，集成 `dva` 的方式与早期版本有所不同。`Umi.js` 3.x 及更高版本已经内置了对 `dva` 的支持，使得配置和使用更加简便。而对于 3.x 以下的版本，则需要手动安装并配置 `dva` 插件。

## Umi.js 3.x 及以上版本集成 dva

### 1. 创建带有 dva 的新项目

对于新的项目，你可以直接使用 `@umijs/create-umi` 工具创建一个包含 `dva` 支持的项目：

```bash
npx @umijs/create-umi my-app --template=dva
cd my-app
npm install
npm start
```

### 2. 在现有项目中启用 dva

如果你已经在使用 `Umi.js` 3.x 并想添加 `dva` 支持，通常不需要额外的插件配置，因为 `dva` 已经默认集成。你只需要确保你的依赖是最新的，并按照如下步骤操作：

#### 安装依赖（如果需要）

虽然 `dva` 默认集成，但有时可能需要确保 `dva` 和相关依赖是最新的：

```bash
npm install dva --save
```

#### 创建模型

在 `src/models/` 目录下创建模型文件。例如，创建一个用户模型 `user.js`：

```javascript
// src/models/user.js
import { queryUser } from "@/services/api"; // 假设有一个 API 服务来获取用户信息

export default {
  namespace: "user",

  state: {
    name: "",
    age: null,
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUser); // 调用 API 获取用户信息
      yield put({
        type: "save",
        payload: response.data,
      });
    },
  },

  subscriptions: {
    setup({ history }) {
      return history.listen(({ pathname }) => {
        if (pathname === "/profile") {
          // 当路径变为 /profile 时触发 fetch effect
        }
      });
    },
  },
};
```

#### 使用 `useModel` 或 `connect` 在组件中访问状态

在视图组件中，可以使用 `useModel` Hook 来访问模型中的状态和分发动作：

```jsx
// src/pages/Profile.jsx
import React, { useEffect } from "react";
import { useModel } from "umi";

export default function Profile() {
  const { initialState, loading, dispatch } = useModel("user");

  useEffect(() => {
    dispatch({
      type: "user/fetch", // 触发 user 模型中的 fetch effect
    });
  }, [dispatch]);

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {initialState?.name}</p>
      <p>Age: {initialState?.age}</p>
    </div>
  );
}
```

### 3. 配置路由

确保你的路由配置指向新的视图组件：

```javascript
// .umirc.js 或 config/config.js
export default {
  routes: [
    { path: "/", component: "home" },
    { path: "/profile", component: "Profile" },
  ],
};
```

## Umi.js 3.x 以下版本集成 dva

### 1. 安装依赖

首先，你需要安装 `dva` 和 `umi-plugin-dva` 插件：

```bash
npm install dva umi-plugin-dva --save
```

### 2. 修改配置文件

在 `.umirc.js` 或 `config/config.js` 文件中启用 `dva` 插件：

```javascript
export default {
  plugins: [
    "umi-plugin-dva", // 启用 dva 插件
  ],
  dva: {
    immer: true, // 如果你想要使用 immer 进行不可变更新
  },
};
```

### 3. 创建模型

#### 全局模型

在 `src/models/` 目录下创建模型文件，如 `user.js`：

```javascript
// src/models/user.js
import { queryUser } from "@/services/api"; // 假设有一个 API 服务来获取用户信息

export default {
  namespace: "user",

  state: {
    name: "",
    age: null,
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUser); // 调用 API 获取用户信息
      yield put({
        type: "save",
        payload: response.data,
      });
    },
  },

  subscriptions: {
    setup({ history }) {
      return history.listen(({ pathname }) => {
        if (pathname === "/profile") {
          // 当路径变为 /profile 时触发 fetch effect
        }
      });
    },
  },
};
```

#### 局部模型

对于局部模型，推荐将其放置在特定页面或模块的目录下，并通过动态加载的方式引入。这可以减少不必要的状态加载，提升应用性能。

##### 示例：为产品详情页创建局部模型

假设你有一个产品详情页（`ProductDetail.jsx`），它有自己的局部模型（`product.js`）。

1. **创建局部模型**

```javascript
// src/pages/products/product.js
export default {
  namespace: "productDetail",

  state: {
    id: null,
    name: "",
    description: "",
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(api.getProduct, payload.id); // 调用 API 获取产品信息
      yield put({
        type: "save",
        payload: response.data,
      });
    },
  },
};
```

2. **注册局部模型**

在视图组件中动态注册和卸载模型。你可以使用 `useEffect` 钩子来确保模型仅在组件挂载和卸载时进行相应的操作。

```jsx
// src/pages/products/ProductDetail.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector, useModel } from "umi";
import models from "./product";

export default function ProductDetail({ match }) {
  const dispatch = useDispatch();
  const { id } = match.params;
  const product = useSelector((state) => state.productDetail);

  useEffect(() => {
    // 动态注册局部模型
    dispatch({ type: "dynamic/registerModel", model: models });

    // 在组件卸载时卸载模型
    return () => {
      dispatch({ type: "dynamic/unregisterModel", model: models });
    };
  }, [dispatch]);

  useEffect(() => {
    // 当 id 变化时重新获取数据
    dispatch({
      type: "productDetail/fetch",
      payload: { id },
    });
  }, [id, dispatch]);

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
    </div>
  );
}
```

3. **配置路由**

确保你的路由配置指向新的视图组件：

```javascript
// .umirc.js 或 config/config.js
export default {
  routes: [
    { path: "/", component: "home" },
    { path: "/products/:id", component: "products/ProductDetail" },
  ],
};
```

### 4. 使用 `connect` 在组件中访问状态

在视图组件中，可以使用 `connect` 函数来连接到 `dva` store：

```jsx
// src/pages/Profile.jsx
import React, { useEffect } from "react";
import { connect } from "dva";

function Profile({ user, dispatch }) {
  useEffect(() => {
    dispatch({
      type: "user/fetch", // 触发 user 模型中的 fetch effect
    });
  }, [dispatch]);

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Age: {user.age}</p>
    </div>
  );
}

export default connect(({ user }) => ({ user }))(Profile);
```

### 5. 配置路由

确保你的路由配置指向新的视图组件：

```javascript
// .umirc.js 或 config/config.js
export default {
  routes: [
    { path: "/", component: "home" },
    { path: "/profile", component: "Profile" },
  ],
};
```

## 总结

- **Umi.js 3.x 及以上版本**：`dva` 已经内置，默认启用，无需额外配置插件。只需创建模型并在组件中使用 `useModel` 或 `connect` 即可。
- **Umi.js 3.x 以下版本**：需要手动安装 `dva` 和 `umi-plugin-dva` 插件，并在配置文件中启用插件。然后按照常规方式创建模型并在组件中使用 `connect`。

通过上述步骤，无论你使用的是哪个版本的 `Umi.js`，都可以成功集成 `dva`，并利用其强大的状态管理功能构建高效且易于维护的应用程序。
