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
  inserted: function (el, binding) {
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

### binding 对象

1. **`value`**:

   - **类型**: 任何 JavaScript 类型（如字符串、数字、布尔值、对象等）
   - **描述**: 指令所绑定的值，即在模板中指定的值。
   - **示例**: `<div v-my-directive="someValue"></div>` 中的 `someValue`。

2. **`oldValue`**:

   - **类型**: 任何 JavaScript 类型
   - **描述**: 指令绑定的前一个值，在组件更新周期内发生变化时可用。
   - **注意**: 仅在 `componentUpdated` 钩子中有效。

3. **`arg`**:

   - **类型**: 字符串
   - **描述**: 传递给指令的参数（argument），通过小写形式传递。
   - **示例**: `<div v-my-directive:foo></div>` 中的 `foo`。

4. **`modifiers`**:

   - **类型**: 对象
   - **描述**: 包含所有修饰符的名字作为键的对象，值为 `true`。
   - **示例**: `<div v-my-directive.foo.bar></div>` 会生成 `{ foo: true, bar: true }`。

5. **`name`**:

   - **类型**: 字符串
   - **描述**: 指令的名字（不包括 `v-` 前缀）。
   - **示例**: 对于 `v-my-directive`，`name` 将是 `'myDirective'`。

6. **`expression`**:

   - **类型**: 字符串
   - **描述**: 绑定表达式的字符串形式。
   - **示例**: `<div v-my-directive="message + '!'"></div>` 的 `expression` 是 `"message + '!'"`。

7. **`instance`**:

   - **类型**: Vue 组件实例
   - **描述**: 使用该指令的 Vue 组件实例。
   - **注意**: 在 Vue 3 中引入，在 Vue 2 中没有此属性。

8. **`dir`**:
   - **类型**: 对象
   - **描述**: 包含指令的注册信息，例如选项对象。
   - **注意**: 主要用于框架内部，在大多数情况下你不需要直接访问它。

## 3.指令修饰符

在 Vue 中，指令修饰符（Modifiers）是附加在指令后面的点符号 (`.`) 开头的特殊后缀，用于指示特殊的处理逻辑。它们可以改变指令的行为，提供更灵活的功能，而不需要额外的代码。Vue 的内置指令如 `v-on` 和 `v-bind` 都支持使用修饰符来调整其行为。

### 内置指令修饰符

#### `v-on` 事件修饰符

`v-on` 指令用于监听 DOM 事件，并可以在事件触发时执行回调函数。它支持多个修饰符来改变事件处理的行为：

- **`.stop`**：调用 `event.stopPropagation()`，阻止事件冒泡。
- **`.prevent`**：调用 `event.preventDefault()`，阻止默认行为。

- **`.capture`**：添加事件监听器时使用捕获模式。

- **`.self`**：只有当事件是从监听器绑定的元素本身触发时才触发回调。

- **`.once`**：只触发一次事件监听器。

- **`.passive`**：标记事件处理器为被动的，提高滚动等操作的性能，通常与触摸事件一起使用。

##### 示例

```html
<!-- 阻止链接跳转 -->
<a v-on:click.prevent="doSomething">Link</a>

<!-- 阻止点击事件继续传播 -->
<div v-on:click.stop="doThis"></div>

<!-- 提交表单时既阻止默认行为又阻止事件冒泡 -->
<form v-on:submit.prevent.stop="onSubmit"></form>

<!-- 使用捕获模式 -->
<div v-on:click.capture="doThis">...</div>

<!-- 只当事件由该元素自身触发时触发 -->
<div v-on:click.self="doThat">...</div>
```

#### `v-bind` 类和样式修饰符

`v-bind` 指令用于动态地绑定一个或多个属性，或者组件 props 到表达式。对于类和样式绑定，它还提供了特定的修饰符：

- **`.class`**：用于绑定 HTML `class` 属性，允许你根据条件添加/移除 CSS 类。

- **`.style`**：用于绑定 HTML `style` 属性，允许你动态设置内联样式。

##### 示例

```html
<!-- 动态绑定 class -->
<div v-bind:class="{ active: isActive }"></div>

<!-- 动态绑定 style -->
<div v-bind:style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

### 自定义指令修饰符

除了内置指令外，你还可以为自定义指令定义自己的修饰符。这允许你扩展指令的功能，以满足特定需求。

##### 示例

假设我们创建了一个自定义指令 `v-focus`，它可以让元素在插入 DOM 后自动获得焦点。我们可以添加一个 `.delayed` 修饰符，使得焦点获取延迟一段时间。

```javascript
// 注册自定义指令
Vue.directive('focus', {
  mounted(el, binding) {
    if (binding.modifiers.delayed) {
      setTimeout(() => {
        el.focus();
      }, 500);
    } else {
      el.focus();
    }
  }
});

// 使用自定义指令及其修饰符
<input v-focus />
<input v-focus.delayed />
```

在这个例子中，`v-focus.delayed` 会等待 500 毫秒后再让输入框获得焦点。

### 注意事项

- **组合使用修饰符**：你可以同时使用多个修饰符，按照书写顺序依次应用。例如，`@click.stop.prevent` 会先阻止默认行为，然后阻止事件冒泡。

- **修饰符的优先级**：某些修饰符可能会影响其他修饰符的效果。例如，`.passive` 修饰符不能与 `.prevent` 一起使用，因为它是用来优化性能的，不允许阻止默认行为。

- **兼容性问题**：确保你的浏览器支持所使用的事件修饰符。例如，`.passive` 是一个较新的特性，不是所有浏览器都完全支持。

## 总结

Vue 2 的指令系统是构建响应式 Web 应用程序的核心工具之一。通过理解和掌握这些指令，您可以更高效地操作 DOM 和管理数据流。无论是简单的条件渲染还是复杂的表单处理，内置指令都能大大简化开发流程。同时，自定义指令还为您提供了扩展框架功能的能力。如果您有更多问题或需要进一步的帮助，请随时告诉我！
