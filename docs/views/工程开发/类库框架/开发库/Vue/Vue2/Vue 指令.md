# Vue 指令

Vue 2 提供了一套内置指令，用于简化 DOM 操作和数据绑定。这些指令以 `v-` 开头，并且可以直接在模板中使用，使得开发者可以轻松地实现各种功能，如条件渲染、列表渲染、事件监听等。此外，Vue 还允许用户创建自定义指令来扩展其功能。以下是关于 Vue 2 指令的详细介绍。

## 1.内置指令

### 条件渲染

1. **`v-if`**：根据表达式的真假值来决定是否渲染元素。

   ```html
   <div v-if="seen">现在你看到我了</div>
   ```

2. **`v-else`**：与 `v-if` 配合使用，提供“否则”的逻辑分支。

   ```html
   <div v-if="Math.random() > 0.5">大于 0.5</div>
   <div v-else>小于等于 0.5</div>
   ```

3. **`v-else-if`**：作为 `v-if` 的附加选项，允许更多的条件分支。

   ```html
   <div v-if="type === 'A'">A</div>
   <div v-else-if="type === 'B'">B</div>
   <div v-else>C</div>
   ```

4. **`v-show`**：无论初始条件如何，元素总是会被渲染并保留在 DOM 中；只是简单地切换 CSS 属性 `display` 来控制显示或隐藏。
   ```html
   <span v-show="ok">Hello!</span>
   ```

### 列表渲染

1. **`v-for`**：基于源数据多次渲染元素或模板块。
   ```html
   <ul id="example-2">
     <li v-for="(item, index) in items" :key="item.id">
       {{ index }} - {{ item.message }}
     </li>
   </ul>
   ```

### 属性绑定

1. **`v-bind`**：动态地绑定一个或多个属性，或组件 prop 到表达式。

   ```html
   <!-- 动态 class 绑定 -->
   <div :class="{ active: isActive }"></div>

   <!-- 动态 style 绑定 -->
   <div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>

   <!-- 动态属性绑定 -->
   <img v-bind:src="imageSrc" />
   ```

### 事件处理

1. **`v-on`**：监听 DOM 事件，并触发相应的 JavaScript 方法。

   ```html
   <!-- 监听点击事件 -->
   <button v-on:click="doSomething">Click me</button>

   <!-- 使用修饰符，例如阻止默认行为 -->
   <a v-on:click.prevent="doSomething">Link</a>
   ```

### 表单输入绑定

1. **`v-model`**：在表单 `<input>`、`<textarea>` 及 `<select>` 元素上创建双向数据绑定。

   ```html
   <!-- 文本框 -->
   <input v-model="message" />

   <!-- 复选框 -->
   <input type="checkbox" id="checkbox" v-model="checked" />
   <label for="checkbox">{{ checked }}</label>

   <!-- 单选按钮 -->
   <input type="radio" v-model="picked" value="A" /> A
   <input type="radio" v-model="picked" value="B" /> B

   <!-- 下拉菜单 -->
   <select v-model="selected">
     <option disabled value="">请选择</option>
     <option>A</option>
     <option>B</option>
     <option>C</option>
   </select>
   ```

### 其他常用指令

1. **`v-pre`**：跳过该元素及其子元素的编译过程。可以用来显示原始的 Mustache 标签。

   ```html
   <span v-pre>{{ this will not be compiled }}</span>
   ```

2. **`v-cloak`**：保持在元素上直到关联实例结束编译。通常与 CSS 规则一起使用，以隐藏未编译的 Mustache 标签直到视图准备好。

   ```css
   [v-cloak] {
     display: none;
   }
   ```

   ```html
   <div v-cloak>{{ message }}</div>
   ```

3. **`v-once`**：只渲染元素和组件一次。之后的重新渲染中，元素/组件及其所有的子节点将被视为静态内容并跳过。
   ```html
   <span v-once>This will never change: {{msg}}</span>
   ```

## 2.自定义指令

除了内置指令外，Vue 还支持注册全局或局部自定义指令。这为开发者提供了极大的灵活性，可以根据需要添加新的功能。

### 注册全局指令

```javascript
Vue.directive("focus", {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus();
  },
});
```

### 注册局部指令

```javascript
export default {
  directives: {
    focus: {
      inserted: function (el) {
        el.focus();
      },
    },
  },
};
```

### 自定义指令钩子

自定义指令拥有几个生命周期钩子函数：

- `bind`: 只调用一次，指令第一次绑定到元素时调用。
- `inserted`: 被绑定元素插入父节点时调用（仅保证父节点存在，但不一定已被插入文档中）。
- `update`: 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。
- `componentUpdated`: 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
- `unbind`: 只调用一次，指令与元素解绑时调用。

## 总结

Vue 2 的指令系统是构建响应式 Web 应用程序的核心工具之一。通过理解和掌握这些指令，您可以更高效地操作 DOM 和管理数据流。无论是简单的条件渲染还是复杂的表单处理，内置指令都能大大简化开发流程。同时，自定义指令还为您提供了扩展框架功能的能力。如果您有更多问题或需要进一步的帮助，请随时告诉我！
