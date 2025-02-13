# Vue 生命周期

在 Vue 2 中，组件的生命周期涵盖了从创建到销毁的整个过程。Vue 提供了一系列的生命周期钩子（Lifecycle Hooks），允许开发者在特定的时间点执行自定义逻辑。这些钩子函数使得开发者可以在不同阶段对组件的行为进行控制和优化。以下是 Vue 2 组件完整的生命周期及其对应的钩子函数。

![](/assets/images/vue/lifecycle.png)

## 1.生命周期图解

Vue 2 的生命周期可以分为几个主要阶段：初始化、挂载、更新和销毁。每个阶段都有相应的钩子函数，如下所示：

### 初始化阶段

1. **`beforeCreate`**：

   - 在实例初始化之后，数据观测 (data observer) 和事件配置之前被调用。
   - 此时 `data` 和 `methods` 都还没有绑定，因此无法访问。

2. **`created`**：
   - 实例已完成数据观测、属性和方法的运算，但尚未开始挂载元素。
   - 可以在这个阶段访问 `data` 和 `methods`，并且可以执行异步操作或设置定时器。

### 挂载阶段

3. **`beforeMount`**：
   - 在挂载开始之前被调用：相关的 render 函数首次被调用。
   - 模板编译完成，虚拟 DOM 创建完毕，但尚未挂载到真实 DOM 上。
4. **`mounted`**：
   - 当组件挂载完成后调用，此时可以通过 `this.$el` 访问到真实的 DOM 元素。
   - 这里适合在组件挂载后立即执行的操作，如第三方插件初始化、获取窗口尺寸等。

### 更新阶段

5. **`beforeUpdate`**：

   - 数据更新时调用，发生在虚拟 DOM 打补丁之前。
   - 这里适合在更新之前访问现有的 DOM，例如获取滚动位置等。

6. **`updated`**：
   - 由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。
   - 注意避免在此钩子中进一步更改状态，因为这可能会导致无限循环更新。

### 销毁阶段

7. **`beforeDestroy`**（Vue 2）/ **`beforeUnmount`**（Vue 3）：

   - 实例即将被销毁之前调用。在这一步，实例仍然是完全可用的。
   - 通常用于清理计时器、取消网络请求或移除事件监听器。

8. **`destroyed`**（Vue 2）/ **`unmounted`**（Vue 3）：
   - Vue 实例销毁后调用。调用后，Vue 实例指示的所有东西都会解绑定，所有的事件监听器会被移除，所有的子实例也会被销毁。

### 其他钩子

9. **`activated` 和 `deactivated`**:

   - **触发时机**: 当组件被 `<keep-alive>` 缓存时，组件进入/离开缓存时分别调用。
   - **应用场景**:
     - 保存组件状态以便下次激活时恢复。
     - 执行特定于缓存组件的逻辑，如重新加载数据或清除计时器。

10. **`errorCaptured`**:
    - **触发时机**: 捕获来自后代组件的错误时调用。
    - **应用场景**:
      - 实现全局错误处理机制。
      - 决定是否继续冒泡该错误给更上层的祖先组件。

## 2.生命周期钩子的应用场景

- **`beforeCreate` 和 `created`**：适合做一些初始化工作，比如获取数据、设置定时器等。
- **`beforeMount` 和 `mounted`**：适合需要访问 DOM 或者与页面交互的情况，比如图表库的初始化、获取窗口尺寸等。
- **`beforeUpdate` 和 `updated`**：适合处理依赖于 DOM 的操作，比如动画效果、滚动位置恢复等。
- **`beforeDestroy` 和 `destroyed`**：适合清理工作，比如清除定时器、注销事件监听器、停止 WebSocket 连接等。

## 3.注意事项

- **避免在 `updated` 中改变状态**：因为在 `updated` 中改变状态可能会触发新的更新，从而导致无限循环。
- **异步操作的处理**：如果你在 `created` 或 `mounted` 中启动了异步操作（如 API 请求），记得考虑如何处理这些操作在组件卸载前是否已经完成的问题，防止内存泄漏。
- **避免复杂逻辑**：尽量不在生命周期钩子里放置过于复杂的业务逻辑，应该将它们分解成更小的函数，保持代码清晰易读。
- **考虑异步问题**：当涉及到异步操作（如 API 请求）时，请确保你了解它们何时完成以及如何处理潜在的竞争条件。
- **注意副作用**：某些生命周期钩子（如 `mounted` 和 `updated`）可能会引发副作用（如 DOM 操作），应当谨慎使用以防止性能问题。

## 总结

理解 Vue 2 的生命周期对于编写高效且可维护的代码至关重要。通过合理使用这些生命周期钩子，你可以确保你的应用在正确的时刻执行必要的逻辑，并有效地管理资源。如果你有更多问题或需要进一步的帮助，请随时告诉我！
