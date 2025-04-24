# Vue-Router.md


Vue Router 是官方的路由管理器，它与 Vue.js 深度集成，用于构建单页面应用程序（SPA）。使用 Vue Router 可以轻松实现页面之间的导航而无需重新加载整个页面。以下是关于如何在 Vue 2 中设置和使用 Vue Router 的详细介绍。

## 1.安装 Vue Router

首先，你需要安装 Vue Router。可以通过 npm 或 yarn 来安装：

```bash
npm install vue-router@3 --save
```

或者

```bash
yarn add vue-router@3
```

请注意，我们指定了版本 `3`，因为这是兼容 Vue 2 的版本。对于 Vue 3，你应该使用 Vue Router 4。

## 2.创建路由配置

接下来，在你的项目中创建一个路由配置文件，通常命名为 `router.js` 或 `router/index.js`。这个文件将定义所有的路由规则。

### 示例：基本路由配置

```javascript
// router/index.js
import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import About from "../components/About.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
];

const router = new VueRouter({
  mode: "history", // 使用 HTML5 History 模式，默认是 hash 模式
  base: process.env.BASE_URL,
  routes,
});

export default router;
```

## 3.配置主应用文件

然后，在你的主应用文件（通常是 `main.js`）中引入并使用这个路由实例：

```javascript
// main.js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
```

## 4.在模板中使用 `<router-view>` 和 `<router-link>`

为了显示不同的页面内容，你需要在模板中使用 `<router-view>` 组件，它会根据当前的 URL 显示相应的组件。同时，可以使用 `<router-link>` 来生成带有正确链接的 `<a>` 标签，从而实现页面间的导航。

```html
<!-- App.vue -->
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
  export default {
    name: "App",
  };
</script>
```

## 5.动态路由匹配

你可以通过参数来动态地匹配路由，这非常适合处理类似详情页的情况。例如：

```javascript
{
  path: '/user/:id',
  name: 'User',
  component: User,
  props: true // 如果组件接收 props，则可以直接将路由参数作为 props 传递给组件
}
```

在组件内部，你可以通过 `$route.params` 访问这些参数：

```javascript
// User.vue
export default {
  props: ["id"],
  mounted() {
    console.log(this.id); // 输出从 URL 获取到的 ID
  },
};
```

## 6.嵌套路由

有时候你可能需要在一个页面内展示多个视图，这时可以使用嵌套路由。比如，在用户资料页面中包含头像、个人信息等子页面：

```javascript
{
  path: '/user/:id',
  component: User,
  children: [
    {
      path: '', // 默认子路径
      component: UserProfile
    },
    {
      path: 'posts',
      component: UserPosts
    }
  ]
}
```

## 7.导航守卫

Vue Router 提供了多种方式来拦截导航操作，称为“导航守卫”。它们可以帮助你在用户跳转之前或之后执行某些逻辑，如权限检查、加载指示器等。

- **全局前置守卫** (`beforeEach`)：每次路由切换前都会调用。
- **全局解析守卫** (`beforeResolve`)：在所有组件内守卫和异步路由组件被解析后，但在导航确认前调用。
- **全局后置钩子** (`afterEach`)：在路由切换完成后调用，不接受任何参数。
- **路由独享守卫** (`beforeEnter`)：特定路由的前置守卫。
- **组件内的守卫**：每个组件都可以定义自己的进入、更新和离开守卫。

### 示例：全局前置守卫

```javascript
router.beforeEach((to, from, next) => {
  // 这里可以添加一些逻辑，比如验证用户是否登录
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next({
        path: "/login",
        query: { redirect: to.fullPath },
      });
    } else {
      next();
    }
  } else {
    next(); // 确保一定要调用 next()
  }
});
```

## 总结

以上就是关于如何在 Vue 2 中使用 Vue Router 的简要介绍。通过正确的配置和使用路由功能，你可以轻松地为你的单页面应用程序添加多页面的支持。如果你有更多问题或需要进一步的帮助，请随时告诉我！
