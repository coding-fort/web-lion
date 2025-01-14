# Vue $slots

在 Vue 2 中，`$slots` 是一个用于访问组件内部插槽（slot）内容的对象。它允许父组件向子组件传递内容，并且让子组件能够灵活地决定如何渲染这些内容。通过 `$slots`，你可以获取到传递给具名或默认插槽的内容，这对于创建可复用和高度定制化的组件非常有用。

## 1.插槽的基本概念

Vue 的插槽机制使得父组件可以将任意 HTML 或者其他组件作为“内容”插入到子组件的特定位置。这种设计打破了传统的父子组件之间的单向数据流限制，增加了组件间的交互性。

- **默认插槽**：当没有指定 `name` 属性时，默认情况下所有内容都会被放入默认插槽。
- **具名插槽**：使用 `name` 属性来定义多个不同名称的插槽，从而可以在子组件中精确控制每个部分的内容。

- **作用域插槽**：允许子组件将数据传递回父组件，以便父组件可以根据这些数据生成动态内容。

## 2.使用 `$slots`

### 1. 默认插槽

在子组件中，可以通过 `$slots.default` 访问默认插槽的内容。这通常用于自定义组件模板中的占位符。

```html
<!-- ChildComponent.vue -->
<template>
  <div class="child-component">
    <h2>Child Component</h2>
    <div v-if="$slots.default">
      <!-- 渲染默认插槽的内容 -->
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ChildComponent",
  };
</script>
```

父组件中使用：

```html
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component>
      <p>This is the content of the default slot.</p>
    </child-component>
  </div>
</template>

<script>
  import ChildComponent from "./ChildComponent.vue";

  export default {
    components: {
      ChildComponent,
    },
  };
</script>
```

### 2. 具名插槽

对于具名插槽，你可以在子组件中通过对应的 `name` 来访问其内容。例如：

```html
<!-- ChildComponent.vue -->
<template>
  <div class="child-component">
    <header>
      <slot name="header"></slot>
    </header>
    <main>
      <slot></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script>
  export default {
    name: "ChildComponent",
  };
</script>
```

父组件中使用：

```html
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component>
      <template #header>
        <h1>Here might be a page title</h1>
      </template>

      <p>A paragraph for the main content.</p>

      <template #footer>
        <p>Here's some contact info</p>
      </template>
    </child-component>
  </div>
</template>

<script>
  import ChildComponent from "./ChildComponent.vue";

  export default {
    components: {
      ChildComponent,
    },
  };
</script>
```

注意：在 Vue 2 中，具名插槽的语法使用 `v-slot` 指令，但在实际编写时，通常会简化为 `<template #slotName>` 形式。

### 3. 作用域插槽

作用域插槽允许子组件将数据暴露给父组件，这样父组件可以根据这些数据来构建更复杂的逻辑或样式。

```html
<!-- ChildComponent.vue -->
<template>
  <div class="child-component">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <slot :item="item" :index="index"></slot>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: "ChildComponent",
    data() {
      return {
        items: ["Apple", "Banana", "Cherry"],
      };
    },
  };
</script>
```

父组件中使用：

```html
<!-- ParentComponent.vue -->
<template>
  <div>
    <child-component>
      <template #default="{ item, index }">
        <strong>{{ index + 1 }}. {{ item }}</strong>
      </template>
    </child-component>
  </div>
</template>

<script>
  import ChildComponent from "./ChildComponent.vue";

  export default {
    components: {
      ChildComponent,
    },
  };
</script>
```

在这个例子中，`ChildComponent` 将 `items` 数组中的每一项以及它们的索引传递给了父组件，父组件则可以根据这些信息来自定义显示格式。

## 3.使用 `$slots` 对象

虽然上面的例子展示了如何直接在模板中使用插槽，但有时你也可能需要在 JavaScript 中访问插槽内容。这时就可以使用 `$slots` 对象了。`$slots` 是一个包含 VNodes 的对象，其中键是插槽的名称，值是一个 VNode 数组。

```javascript
mounted() {
  console.log(this.$slots); // 打印所有插槽的内容
  console.log(this.$slots.default); // 打印默认插槽的内容
  console.log(this.$slots.header); // 打印名为 "header" 的插槽内容
}
```

## 4.注意事项

- **避免过度依赖**：尽管插槽提供了极大的灵活性，但过多地使用它们可能会使组件变得难以理解和维护。因此，请确保只在必要时使用插槽，并保持清晰的设计模式。
- **性能考虑**：如果插槽内容非常复杂或者包含大量 DOM 元素，那么频繁更新这些内容可能会影响性能。在这种情况下，考虑优化渲染逻辑或使用虚拟列表等技术来提高效率。

- **与 scoped slots 结合使用**：作用域插槽不仅增强了组件间的通信能力，还提高了代码的可读性和重用性。合理利用它可以创建更加模块化和强大的组件系统。

通过理解并熟练掌握 Vue 2 中的插槽机制及其相关属性如 `$slots`，你可以创建出更加灵活、可配置且易于维护的组件。如果你有更多关于 Vue 2 或其他 Vue 特性的问题，请随时告诉我！
