# Vue 模板语法

Vue.js 的模板语法是其核心特性之一，它允许开发者以声明式的方式将数据绑定到 DOM 上，并且支持条件渲染、列表渲染、事件处理等丰富的功能。以下是 Vue 模板语法的详细介绍：

## 1. 插值（Interpolation）

使用双大括号 `{{ }}` 语法可以在文本中插入数据。

```html
<p>{{ message }}</p>
```

### 原始 HTML

如果需要插入原始 HTML 而不是转义后的文本，可以使用 `v-html` 指令：

```html
<p v-html="rawHtml"></p>
```

## 2. 指令（Directives）

指令是以 `v-` 开头的特殊属性，用于给元素添加特定的行为或逻辑。

### 条件渲染

- **`v-if`**：根据表达式的真假来决定是否渲染元素。
- **`v-else`** 和 **`v-else-if`**：配合 `v-if` 使用，提供分支逻辑。

```html
<div v-if="seen">现在你看到我了</div>
<div v-else>现在你看不到我</div>
```

### 列表渲染

- **`v-for`**：基于一个数组来渲染一个列表。

```html
<ul id="example-2">
  <li v-for="(item, index) in items" :key="index">{{ item.message }}</li>
</ul>
```

### 绑定属性

- **`v-bind`**：动态地绑定一个或多个属性，或者组件 prop 到表达式。

```html
<img v-bind:src="imageSrc" /> <a v-bind:href="url">链接</a>
```

简写形式为 `:`：

```html
<img :src="imageSrc" /> <a :href="url">链接</a>
```

### 事件处理

- **`v-on`**：监听 DOM 事件并触发相应的 JavaScript 方法。

```html
<button v-on:click="incrementCounter">点击我</button>
```

简写形式为 `@`：

```html
<button @click="incrementCounter">点击我</button>
```

## 3. 表单输入绑定

- **`v-model`**：创建双向数据绑定，适用于所有表单输入元素。

```html
<input v-model="message" placeholder="编辑我" />
<p>消息是: {{ message }}</p>
```

## 4. 组件化

Vue 支持自定义组件，可以通过 `<component>` 标签或注册全局/局部组件来复用代码。

```javascript
Vue.component("my-component", {
  template: "<div>A custom component!</div>",
});
```

然后在模板中使用：

```html
<my-component></my-component>
```

## 5. 过渡效果

- **`<transition>`**：为元素或组件的进入/离开过渡提供钩子和样式。

```html
<transition name="fade">
  <p v-if="show">hello</p>
</transition>
```

## 6. 计算属性与侦听器

- **计算属性**：基于其他数据属性计算得出的新属性，缓存结果直到依赖的数据发生变化。

```javascript
computed: {
  fullName() {
    return this.firstName + ' ' + this.lastName;
  }
}
```

- **侦听器**：当某些数据发生变化时执行回调函数。

```javascript
watch: {
  question(newQuestion, oldQuestion) {
    if (newQuestion.indexOf('?') > -1) {
      this.answer = '等待宇宙响应...';
    }
  }
}
```

## 7. 模板修饰符

- **`.prevent`**、**`.stop`** 等：修改事件行为，如阻止默认行为或停止事件冒泡。

```html
<form v-on:submit.prevent="onSubmit">
  <!-- ... -->
</form>
```

## 8. Slot 插槽

- **默认插槽**、**具名插槽** 和 **作用域插槽**：增强组件的灵活性，允许父组件向子组件传递内容。

```html
<!-- 子组件 -->
<template>
  <div>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>

<!-- 父组件 -->
<my-component>
  <template #default>
    <p>这是默认插槽的内容。</p>
  </template>
  <template #footer>
    <p>这是具名插槽的内容。</p>
  </template>
</my-component>
```

通过掌握这些模板语法，您可以更高效地构建 Vue 应用程序。每个概念都有助于简化复杂的逻辑，提高代码的可读性和可维护性。如果有任何具体问题或需要进一步的帮助，请随时告诉我！
