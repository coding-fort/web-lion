# Flux

Flux 是 Facebook 推出的一种应用架构模式，主要用于构建用户界面（UI），特别是与 React 框架一起使用。它不是一种库或框架，而是一种设计理念，旨在解决复杂 UI 应用中的数据流管理问题。Flux 通过单向数据流来简化状态管理和组件之间的交互。

## Flux 的核心概念

1. **单向数据流**：

   - 在 Flux 架构中，所有的数据都遵循一个单一的方向流动：从派发器（Dispatcher）到存储（Store），再到视图（View），最后再由视图触发动作（Action）。这种单向的数据流有助于减少应用程序中的副作用和不可预测性。

2. **四大组成部分**：

   - **Action（动作）**：
     - Actions 是用于描述发生了什么的对象，通常包含一个类型字段和其他必要的信息。它们是改变应用状态的唯一途径。
   - **Dispatcher（派发器）**：
     - Dispatcher 是中心枢纽，负责接收所有 Actions，并将这些 Actions 分发给各个 Store。它确保了 Actions 按照正确的顺序被处理。
   - **Store（存储）**：
     - Stores 负责管理应用的状态。它们监听来自 Dispatcher 的 Actions，并根据接收到的 Action 类型更新内部状态。Store 还提供注册回调函数的方法，以便在状态发生变化时通知 Views。
   - **View（视图）**：
     - Views 是用户看到并与之互动的界面部分。在 Flux 中，Views 通常是 React 组件。当 Store 的状态变化时，Views 会重新渲染以反映最新的数据。同时，Views 可以触发新的 Actions 来响应用户的操作。

3. **Action Creator（动作创建者）**：
   - 虽然不是 Flux 的官方组成部分，但 Action Creators 是一个常见的实践。它们是用来创建并分发 Actions 的辅助函数，使得 Actions 的创建更加模块化和可维护。

## Flux 数据流的工作流程

1. 用户与 View 进行交互，例如点击按钮。
2. View 触发一个 Action，这个 Action 包含有关发生了什么的信息。
3. Action 被发送到 Dispatcher。
4. Dispatcher 将 Action 广播给所有已注册的 Store。
5. Store 接收到 Action 后，根据 Action 的类型更新其内部状态。
6. Store 状态更新后，通知相关的 View 发生了变化。
7. View 重新渲染，显示最新的数据给用户。

## Flux vs Redux

尽管 Flux 和 Redux 都基于单向数据流的概念，但它们有一些关键区别：

- **单一 Store vs 多个 Store**：Redux 推崇使用单一的全局 Store 来保存整个应用的状态，而 Flux 允许多个独立的 Store 存在。
- **中间件支持**：Redux 内置了对中间件的支持，方便扩展功能（如异步操作、日志记录等），而 Flux 需要额外实现这些特性。
- **社区和生态系统**：Redux 拥有更广泛的社区支持和丰富的插件生态系统，这使得它成为了更为流行的解决方案。

## 结论

Flux 提供了一种结构化的思考方式来组织大型前端应用的状态管理，尤其是那些使用 React 构建的应用。虽然 Facebook 已经不再积极推广 Flux，转而推荐使用 Relay 或其他工具，但 Flux 的思想仍然影响着现代 JavaScript 应用程序的设计，包括 Redux、MobX 等状态管理库的发展。
