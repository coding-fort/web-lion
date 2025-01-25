# Nuxt 路由

Nuxt.js 的路由系统是其核心特性之一，它基于文件系统的自动路由机制，这使得路由配置变得极为简单和直观。你只需按照特定的目录结构创建 Vue 组件，Nuxt.js 就会自动生成相应的路由配置。下面详细介绍 Nuxt.js 的路由系统。

## 自动路由

在 Nuxt.js 中，路由是通过 `pages` 目录下的文件结构自动生成的。每个 `.vue` 文件都会被视为一个页面，并根据其在目录中的位置生成对应的路由路径。

### 基本路由

假设你的项目结构如下：

```
pages/
--| index.vue
--| about.vue
```

这将自动生成以下路由配置：

- `/` 对应 `index.vue`
- `/about` 对应 `about.vue`

### 动态路由

要创建动态路由，可以在文件名中使用下划线 `_` 作为前缀。例如：

```
pages/
--| _id.vue
```

这样就会生成一条类似 `/id` 的动态路由，其中 `id` 是参数化的部分。你可以通过 `$route.params.id` 来访问这个动态参数。

对于嵌套路由，可以创建一个下划线命名的目录来表示动态部分：

```
pages/
--| users/
-----| _id.vue
-----| index.vue
```

这将生成如下路由：

- `/users/:id` 对应 `users/_id.vue`
- `/users` 对应 `users/index.vue`

### 嵌套路由

为了定义嵌套路由，可以在 `pages` 目录下创建子目录。比如：

```
pages/
--| parent/
-----| child.vue
```

这将生成 `/parent/child` 路径。如果需要在父级页面中显示子页面的内容，你需要在父组件中使用 `<nuxt-child/>` 元素。

## 导航

Nuxt 提供了多种导航方式：

- **`<nuxt-link>`**: 这是一个内置组件，用于声明式导航到不同的路由。它的使用方法类似于 Vue 的 `<router-link>`。

  ```html
  <nuxt-link to="/about">About</nuxt-link>
  ```

- **编程式导航**: 使用 `this.$router` 对象进行编程式导航，与 Vue Router 的 API 类似。

  ```javascript
  methods: {
    navigateToAbout() {
      this.$router.push('/about')
    }
  }
  ```

## 路由中间件

Nuxt.js 支持路由中间件，允许你在路由切换过程中执行代码。可以在 `middleware/` 目录下创建中间件文件，并在页面组件中通过 `middleware` 属性指定要使用的中间件。

例如，创建一个名为 `auth.js` 的中间件：

```javascript
export default function ({ store, redirect }) {
  // 如果用户未登录，则重定向至登录页面
  if (!store.state.authenticated) {
    return redirect("/login");
  }
}
```

然后，在页面组件中使用：

```javascript
export default {
  middleware: "auth",
};
```

Nuxt.js 的路由系统以其简洁性和灵活性著称，大大简化了 Vue 应用的开发流程，特别是对于那些需要服务端渲染或静态站点生成的应用而言。通过合理利用这些特性，可以快速构建出功能丰富且性能优异的应用程序。
