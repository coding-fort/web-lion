# Vue 实例成员

Vue 实例成员是 Vue.js 框架中非常重要的概念，它们是在创建 Vue 实例时可以配置的选项以及实例创建后可用的属性和方法。理解这些成员有助于开发者更好地掌握如何构建和操作 Vue 应用程序。以下是 Vue 2 中常见的实例成员及其说明。

## 1.创建 Vue 实例

使用 `new Vue()` 可以创建一个新的 Vue 实例。你可以在其中定义各种选项来配置应用程序的行为。

```javascript
const vm = new Vue({
  // 选项...
});
```

## 2.常见的实例选项（Options）

在创建 Vue 实例时，你可以通过传递一个选项对象来初始化应用的各种行为。以下是一些常用的选项：

- **el**：字符串或 DOM 元素，指定挂载的目标元素。

  ```javascript
  el: "#app";
  ```

- **data**：包含组件状态的对象，必须是一个函数返回对象（为了确保每个实例拥有独立的状态副本）。

  ```javascript
  data() {
    return {
      message: 'Hello, World!'
    };
  }
  ```

- **methods**：定义在组件上可调用的方法集合。

  ```javascript
  methods: {
    greet() {
      alert(this.message);
    }
  }
  ```

- **computed**：计算属性，基于其他数据属性派生出来的值，并且会自动缓存结果直到依赖的数据发生变化。

  ```javascript
  computed: {
    reversedMessage() {
      return this.message.split('').reverse().join('');
    }
  }
  ```

- **watch**：监听器，用于响应特定数据属性的变化并执行相应的逻辑。

  ```javascript
  watch: {
    message(newVal, oldVal) {
      console.log(`message changed from ${oldVal} to ${newVal}`);
    }
  }
  ```

- **components**：局部注册的子组件。

  ```javascript
  components: {
    'my-component': MyComponent
  }
  ```

- **directives**：自定义指令。

  ```javascript
  directives: {
    focus: {
      inserted(el) {
        el.focus();
      }
    }
  }
  ```

- **filters**：全局或局部过滤器，用于文本格式化。

  ```javascript
  filters: {
    capitalize(value) {
      if (!value) return '';
      value = value.toString();
      return value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
  ```

- **mixins**：混入（mixin），一种分发 Vue 组件选项的方式。

  ```javascript
  mixins: [myMixin];
  ```

- **created/mounted/updated/destroyed** 等生命周期钩子：允许你在不同阶段执行代码。

  ```javascript
  created() {
    console.log('Instance has been created');
  },
  mounted() {
    console.log('Instance has been mounted');
  }
  ```

## 3.实例属性与方法

一旦 Vue 实例被创建，它将暴露一系列有用的属性和方法供开发者使用。这里列举了一些常见的实例成员：

- **$data**：访问组件的数据对象。

  ```javascript
  console.log(vm.$data.message);
  ```

- **$props**：访问传递给组件的 prop。

  ```javascript
  console.log(vm.$props.someProp);
  ```

- **$el**：访问当前挂载的 DOM 元素。

  ```javascript
  console.log(vm.$el);
  ```

- **$refs**：引用注册过的子组件或 DOM 元素。

  ```javascript
  console.log(vm.$refs.myChildComponent);
  ```

- **$emit**：触发事件。

  ```javascript
  vm.$emit("eventName", payload);
  ```

- **$on/$once**：监听事件（`$once` 只监听一次）。

  ```javascript
  vm.$on("eventName", callback);
  ```

- **$root**：访问根 Vue 实例。

  ```javascript
  console.log(vm.$root);
  ```

- **$parent/$children**：访问父实例或子实例。

  ```javascript
  console.log(vm.$parent);
  console.log(vm.$children);
  ```

- **$set/$delete**：改变响应式数据，确保变化能被检测到。

  ```javascript
  vm.$set(vm.items, "newItem", value);
  vm.$delete(vm.items, "oldItem");
  ```

- **$nextTick**：延迟回调执行，直到 DOM 更新完成。

  ```javascript
  vm.$nextTick(() => {
    // DOM 已更新
  });
  ```

- **$forceUpdate**：强制重新渲染组件（通常不需要手动调用）。

  ```javascript
  vm.$forceUpdate();
  ```

## 4.生命周期钩子

Vue 实例经历了一系列的生命周期阶段，每个阶段都有对应的钩子函数，允许开发者插入自己的逻辑。以下是主要的生命周期钩子：

- **beforeCreate**：实例刚刚被创建，但尚未开始初始化属性或事件。
- **created**：实例已完成数据观测、属性和方法初始化，但尚未挂载到 DOM。
- **beforeMount**：模板编译完成，但尚未挂载到实际 DOM 节点。
- **mounted**：实例已经挂载到 DOM 上，此时可以访问真实的 DOM。
- **beforeUpdate**：当数据变化导致视图需要更新时调用，但在 DOM 被更新之前。
- **updated**：视图更新完成后调用。
- **beforeDestroy**：实例即将销毁，但仍然完全可用。
- **destroyed**：实例已被销毁，所有绑定已解除，所有子实例也已被销毁。

## 总结

Vue 实例成员为开发者提供了丰富的工具来构建动态、交互式的 Web 应用程序。通过合理利用这些成员，你可以更高效地管理应用的状态、响应用户输入，并确保代码结构清晰有序。如果你有更多问题或需要进一步的帮助，请随时告诉我！
