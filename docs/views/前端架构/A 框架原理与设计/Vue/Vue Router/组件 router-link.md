# 组件 router-link

`<router-link>` 是 Vue Router 提供的一个内置组件，用于在单页面应用（SPA）中创建导航链接。它替代了传统的 `<a>` 标签，通过编程方式改变路由，而无需重新加载整个页面。这不仅提高了用户体验，还增强了应用的性能。

## 1.`<router-link>` 的基本用法

最简单的使用方式是直接指定 `to` 属性来定义目标路径：

```html
<router-link to="/home">Go to Home</router-link>
```

这将生成一个带有正确 `href` 属性的 `<a>` 标签，默认情况下点击后会导航到 `/home` 路径。

## 2.动态链接

你也可以绑定 `to` 属性到 JavaScript 表达式或对象，以实现动态链接：

```html
<!-- 使用字符串 -->
<router-link :to="'/user/' + userId">User Profile</router-link>

<!-- 使用命名路由 -->
<router-link :to="{ name: 'user', params: { userId: 123 }}"
  >User Profile</router-link
>

<!-- 带查询参数 -->
<router-link :to="{ path: '/search', query: { q: 'vue' }}"
  >Search Results</router-link
>
```

## 3.自定义标签

默认情况下，`<router-link>` 渲染为 `<a>` 标签，但你可以通过 `tag` 属性更改渲染的元素类型：

```html
<!-- 渲染为 span -->
<router-link tag="span" to="/home">Go to Home</router-link>

<!-- 渲染为 button -->
<router-link tag="button" to="/home">Go to Home</router-link>
```

## 4.替换当前记录

如果你不想向浏览器的历史栈添加新记录，可以使用 `replace` 属性：

```html
<router-link :to="{ path: '/new-page' }" replace>New Page</router-link>
```

这样点击链接时，新的路径将会替换当前路径，而不是添加一个新的历史条目。

## 5.禁用链接

有时候你可能需要禁用链接的行为，比如在某些条件下不允许用户点击。可以通过设置 `disabled` 属性（当使用自定义标签时有效）或者简单地移除 `to` 属性来实现这一点。

```html
<!-- 使用 disabled 属性 (适用于自定义标签) -->
<router-link tag="button" to="/home" :disabled="isDisabled"
  >Go to Home</router-link
>

<!-- 移除 to 属性 -->
<router-link v-if="!isDisabled" to="/home">Go to Home</router-link>
<span v-else>Go to Home</span>
```

## 6.添加激活类名

为了方便样式化活动链接，`<router-link>` 会自动为匹配当前路径的链接添加 `.router-link-active` 类，并且如果它是精确匹配，则还会添加 `.router-link-exact-active` 类。

你可以自定义这些类名：

```html
<router-link active-class="active" exact-active-class="exact-active" to="/home"
  >Home</router-link
>
```

## 7.事件修饰符

你可以像处理普通事件一样对 `<router-link>` 使用事件修饰符，例如 `.prevent` 或 `.stop` 来阻止默认行为或冒泡：

```html
<router-link to="/home" @click.prevent="handleClick">Home</router-link>
```

## 8.示例

假设我们有一个包含多个页面的应用程序，其中每个页面都有自己的路由。我们可以使用 `<router-link>` 来创建导航菜单：

```html
<nav>
  <ul>
    <li><router-link to="/">Home</router-link></li>
    <li><router-link to="/about">About</router-link></li>
    <li><router-link to="/contact">Contact</router-link></li>
  </ul>
</nav>
```

在这个例子中，点击任何一个链接都会更新 URL 并显示相应的页面内容，而不会导致页面刷新。

通过以上介绍，你应该已经了解了如何有效地使用 `<router-link>` 来构建 SPA 中的导航系统。如果你有更多关于 Vue Router 或其他 Vue 特性的问题，请随时告诉我！
