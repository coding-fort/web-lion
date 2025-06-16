# 内置组件 keep-alive

`<keep-alive>` 是 Vue.js 提供的一个内置组件，用于优化应用性能，特别是在涉及频繁切换的视图或组件时。它能够缓存组件实例而不是销毁它们，从而在组件重新显示时避免重新渲染和初始化，提高了用户体验和性能。以下是 `<keep-alive>` 的详细说明、用法及一些最佳实践。

## 1.`<keep-alive>` 的作用

- **缓存组件实例**：当包裹的动态组件因为路由变化或其他原因被切换时，`<keep-alive>` 会将这些组件保留在内存中而不销毁。这使得当用户再次导航到该组件时，可以立即从缓存中恢复，而无需重新创建。
- **减少重复渲染**：对于那些需要大量计算或数据获取的组件，使用 `<keep-alive>` 可以显著减少不必要的渲染开销，提升应用响应速度。

## 2.使用场景

- **动态组件之间频繁切换**：例如，标签页（tab）之间的切换，如果每个标签页包含相同的组件，使用 `<keep-alive>` 可以提高性能。
- **需要保持组件状态**：如表单输入、滚动位置等，避免用户每次返回组件时都要重新输入或调整。
- **懒加载组件**：结合 `v-if` 和 `v-show`，可以在首次访问时加载组件，并在后续访问中快速显示。

## 3.基本用法

你可以将任何动态组件（如通过 `v-if` 或者 `router-view` 切换的组件）包裹在 `<keep-alive>` 标签内，来启用缓存功能：

```html
<keep-alive>
  <component :is="currentComponent"></component>
</keep-alive>
```

或者在 Vue Router 中使用：

```html
<keep-alive>
  <router-view></router-view>
</keep-alive>
```

## 4.属性

`<keep-alive>` 支持几个属性来控制其行为：

- **`include`** - 字符串或正则表达式；只有名称匹配的组件会被缓存。可以是逗号分隔的字符串、正则表达式或数组。

  ```html
  <keep-alive include="a,b">
    <!-- ... -->
  </keep-alive>
  ```

- **`exclude`** - 字符串或正则表达式；任何名称匹配的组件都不会被缓存。同样可以是逗号分隔的字符串、正则表达式或数组。

  ```html
  <keep-alive exclude="c,d">
    <!-- ... -->
  </keep-alive>
  ```

- **`max`** - 数字，定义最多可以缓存多少个组件实例。超过这个数量时，最早缓存的组件将被移除。

  ```html
  <keep-alive :max="10">
    <!-- ... -->
  </keep-alive>
  ```

## 5.生命周期钩子

当组件被 `<keep-alive>` 缓存时，它的生命周期会发生一些变化：

- **`activated`**：每当组件被激活（即成为可见状态）时调用。
- **`deactivated`**：每当组件被停用（即变为不可见状态）时调用。

这两个钩子允许你在组件进入或离开缓存时执行特定逻辑，比如清理定时器或订阅，确保资源不会泄漏。

```javascript
export default {
  activated() {
    console.log("Component is now active");
  },
  deactivated() {
    console.log("Component is now inactive");
  },
};
```

## 6.注意事项

- **内存管理**：虽然 `<keep-alive>` 提高了性能，但它也会增加内存占用，因为组件实例不会被销毁。因此，在选择哪些组件应该被缓存时要谨慎考虑。
- **与 `v-if` 和 `v-show` 的区别**：`<keep-alive>` 主要针对的是动态组件的缓存，而 `v-if` 和 `v-show` 控制元素是否渲染到 DOM 或仅设置样式为 `display: none`。如果只是简单地隐藏和显示内容，使用 `v-show` 可能更合适。
- **路由组件缓存**：当使用 `<keep-alive>` 包裹 `<router-view>` 时，记得根据实际需求配置 `include` 和 `exclude`，以避免不必要的组件缓存。

## 7.示例

假设我们有一个简单的应用，其中有两个页面（Home 和 About），并且我们希望缓存 Home 页面的状态：

```html
<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import Home from "./components/Home.vue";
  import About from "./components/About.vue";

  export default {
    components: {
      Home,
      About,
    },
  };
</script>
```

在这个例子中，当我们从 Home 导航到 About 再返回 Home 时，Home 组件的状态将会被保留，包括任何用户输入的数据或滚动位置等。

通过理解 `<keep-alive>` 的工作原理及其提供的选项，你可以有效地利用它来增强应用程序的性能和用户体验。如果你有更多关于 `<keep-alive>` 或其他 Vue 特性的问题，请随时告诉我！
