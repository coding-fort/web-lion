# Vue 监听属性

在 Vue 2 中，监听属性的变化主要通过 `watch` 选项来实现。`watch` 允许你定义一个回调函数，在指定的数据属性发生变化时执行该回调。此外，Vue 2 还提供了计算属性（Computed Properties）作为一种响应式依赖的替代方案，但它们主要用于派生数据而不是直接监听变化。下面是关于如何在 Vue 2 中使用 `watch` 监听属性变化的详细介绍。

## 1.使用 `watch` 选项

### 基本用法

你可以直接在组件的 `watch` 选项中监听某个数据属性，并提供一个处理函数作为它的值。每当这个属性发生变化时，Vue 就会调用这个处理函数。

```javascript
export default {
  data() {
    return {
      message: "Hello Vue!",
    };
  },
  watch: {
    message(newVal, oldVal) {
      console.log(`message changed from ${oldVal} to ${newVal}`);
    },
  },
};
```

在这个例子中，当 `message` 属性的值发生变化时，`watch` 回调会被触发，并打印出新旧值。

### 监听对象或数组中的深层嵌套属性

默认情况下，`watch` 只会监听顶层属性的变化。如果要监听对象或数组内部的变化，可以设置 `deep` 选项为 `true`：

```javascript
watch: {
  user: {
    handler(newVal, oldVal) {
      console.log('User object changed');
    },
    deep: true // 深度监听
  }
}
```

这使得即使对象或数组的内部属性发生变化，也会触发监听器。

### 立即执行监听器

有时你可能希望监听器在组件创建之初就立即执行一次。可以通过 `immediate` 选项来实现这一点：

```javascript
watch: {
  message: {
    handler(newVal) {
      console.log(`Message is now: ${newVal}`);
    },
    immediate: true // 创建后立即执行
  }
}
```

这样，监听器不仅会在属性变化时触发，还会在组件实例创建时立即触发一次。

### 同时监听多个属性

如果你想同时监听多个属性，可以在 `watch` 选项中添加多个键值对，每个键对应一个属性名，值为相应的处理函数。

```javascript
watch: {
  firstName(val) {
    console.log(`firstName changed to ${val}`);
  },
  lastName(val) {
    console.log(`lastName changed to ${val}`);
  }
}
```

或者，如果你想要在一个回调中处理多个属性的变化，可以使用组合方式：

```javascript
watch: {
  ...,
  multipleProperties: {
    handler() {
      // 在这里可以访问 this.firstName 和 this.lastName
      console.log(`Both firstName and lastName have been updated.`);
    },
    deep: true
  }
}
```

注意：这种方式需要你自己在回调中检查具体哪些属性发生了变化。

## 2.使用计算属性 (Computed Properties)

虽然计算属性主要用于派生数据，但在某些情况下，它们也可以用来间接地监听属性变化。例如：

```javascript
computed: {
  reversedMessage() {
    return this.message.split('').reverse().join('');
  }
}
```

每当 `message` 发生变化时，`reversedMessage` 也会自动重新计算并更新视图。然而，计算属性并不是为了监听而设计的，因此对于需要执行副作用操作的情况，还是应该优先考虑 `watch`。

## 3.注意事项

- **性能优化**：尽量避免不必要的复杂逻辑放在 `watch` 回调中，以防止影响性能。
- **异步任务**：如果你在 `watch` 回调中执行异步操作（如 API 请求），记得考虑取消未完成的任务，避免内存泄漏。
- **依赖关系**：确保所有依赖的数据都是响应式的，否则计算属性和 `watch` 可能无法正确工作。

## 总结

Vue 2 的 `watch` 选项是一个非常强大的工具，它允许你在属性变化时执行特定的操作或逻辑。通过合理配置 `deep` 和 `immediate` 选项，以及理解何时使用计算属性，你可以构建出更加模块化和高效的 Vue 应用程序。如果有更多问题或需要进一步的帮助，请随时告诉我！
