# Nuxt 布局

在 Nuxt.js 中，布局(Layouts)是一个非常重要的概念，它允许你定义页面的公共结构，比如导航栏、页脚等。通过使用布局，你可以避免在每个页面组件中重复编写相同的代码，提高代码复用性和维护性。

## 基本概念

- **默认布局**: 如果你不为某个页面指定特定的布局，Nuxt.js 会自动应用 `layouts/default.vue` 作为该页面的布局。
- **自定义布局**: 你可以创建多个布局，并根据需要为不同的页面分配不同的布局。

## 创建和使用布局

### 创建布局

要在你的 Nuxt.js 项目中使用布局，首先需要在 `layouts` 目录下创建一个 `.vue` 文件。例如，创建一个默认布局：

```bash
touch layouts/default.vue
```

然后，在 `default.vue` 中定义你的布局：

```html
<template>
  <div>
    <header>
      <!-- 导航栏 -->
    </header>
    <nuxt />
    <footer>
      <!-- 页脚 -->
    </footer>
  </div>
</template>

<script>
  export default {
    // 可以在此添加逻辑
  };
</script>

<style scoped>
  /* 样式 */
</style>
```

`<nuxt />` 是一个特殊的 Nuxt.js 组件，用于显示当前页面的内容。

### 使用自定义布局

如果你想要为某些页面使用不同于默认的布局，可以在 `layouts` 目录下创建一个新的布局文件，比如 `blog.vue`：

```html
<template>
  <div>
    <h1>博客页面布局</h1>
    <nuxt />
  </div>
</template>
```

然后，在你需要使用这个布局的页面组件中，通过 `layout` 属性来指定使用的布局：

```javascript
export default {
  layout: "blog",
  // 页面组件逻辑
};
```

## 嵌套布局

有时候，你可能希望在一个布局内部再嵌套另一个布局。虽然 Nuxt.js 并没有直接支持嵌套路由的概念，但你可以通过组合多个 `<nuxt-child />` 组件来实现类似的效果。

例如，假设你有如下目录结构：

```
layouts/
--| default.vue
--| admin.vue
pages/
--| index.vue
--| admin/
----| index.vue
```

你可以在 `admin.vue` 布局中使用 `<nuxt-child />` 来渲染 `admin/index.vue` 页面的内容：

```html
<template>
  <div>
    <h1>Admin Layout</h1>
    <nuxt-child />
  </div>
</template>
```

并在 `admin/index.vue` 中指定使用 `admin` 布局：

```javascript
export default {
  layout: "admin",
};
```

## 动态布局

Nuxt.js 还支持动态设置布局。这意味着你可以基于某些条件（如路由参数或用户权限）来决定使用哪个布局。你可以通过返回一个字符串来动态选择布局：

```javascript
export default {
  computed: {
    layout() {
      return this.$route.query.admin ? "admin" : "default";
    },
  },
};
```

这种方式使得布局的选择更加灵活，可以根据不同的情况展示不同的界面结构。

## 总结

通过合理地利用布局，可以使你的 Nuxt.js 应用程序更加模块化和易于维护。无论是简单的网站还是复杂的应用，布局都是组织和管理页面结构的强大工具。掌握如何创建、使用以及动态切换布局，对于构建高效、可扩展的应用至关重要。
