# 面试题：说一下 Vue3 相比 Vue2 有什么新的变化

# Vue3 整体变化

> 面试题：说一下 Vue3 相比 Vue2 有什么新的变化？

主要有这么几类变化：

1. 源码上的变化
2. 性能的变化
3. 语法 API 的变化
4. 引入 RFC

## 源码优化

**1. Monorepo**

Vue2 的源码是托管在 src 目录下面的，然后依据功能拆分出了：

- compiler：编译器
- core：和平台无关的通用运行时代码
- platforms：平台专有代码
- server：服务端渲染相关代码
- sfc：单文件组件解析相关代码
- shared：共享工具库代码

但是各个模块**无法单独抽离**出来下载安装，也无法针对单个模块进行发布。

Vue3 源码工程的搭建改为了 Monorepo 的形式，将模块拆分到了不同的包里面，每个包有各自的 API、类型定义以及测试。这样一类粒度更细，责任划分更加明确。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-08-21-073731.png" alt="image-20240821153730971" style="zoom:50%;" />

**2. Typescript**

- Vue1.x：纯 JS 开发，无类型系统
- Vue2.x：Flow.js，这是 Facebook 推出的类型系统
- Vue3.x：TypeScript

## 性能优化

**1. 源码体积缩小**

- 移除冷门功能：filter、inline-template 这些特性被去除掉了
- 生产环境采用 rollup 进行构建，利用 tree-shaking 减少用户代码打包的体积

**2. 数据劫持优化**

- Vue2.x：Object.defineProperty
- Vue3.x：Proxy

**3. 编译优化**

模板本质上是语法糖，最终会被编译器编译为渲染函数。

1. 静态提升
2. 预字符串化
3. 缓存事件处理函数
4. Block Tree
5. PatchFlag

**4. diff 算法优化**

- Vue2.x: 双端 diff 算法
- Vue3.x: 快速 diff 算法

## 语法 API 优化

**1. 优化逻辑组织**

- Vue2.x: OptionsAPI，逻辑代码按照 data、methods、computed、props 进行分类
- Vue3.x: OptionsAPI + CompositionAPI（推荐）
  - CompositionAPI 优点：查看一个功能的实现时候，不需要在文件跳来跳去；并且这种风格代码可复用的粒度更细

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-08-26-033538.jpg" alt="16028271652994" style="zoom:50%;" />

**2. 优化逻辑复用**

Vue2.x: 复用逻辑使用 mixin，但是 mixin 本身有一些缺点：

- 不清晰的数据来源
- 命名空间冲突
- 隐式的跨 mixin 交流

参阅 Vue 课程《细节补充 - 组合式函数》

**3. 其他变化**

Vue2

```js
import App from "./App.vue";
// 通过实例化 Vue 来创建应用
new Vue({
  el: "#app",
  components: { App },
  template: "<App/>",
});
// or
new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

思考 🤔：这种方式存在什么问题？

答案：这种方式缺点在于一个页面如果存在多个 Vue 应用，部分配置会影响所有的 Vue 应用

```vue
<!-- vue2 -->
<div id="app1"></div>
<div id="app2"></div>
<script>
   Vue.use(...); // 此代码会影响所有的vue应用
   Vue.mixin(...); // 此代码会影响所有的vue应用
   Vue.component(...); // 此代码会影响所有的vue应用

  new Vue({
     // 配置
   }).$mount("#app1")

   new Vue({
     // 配置
   }).$mount("#app2")
</script>
```

Vue3

```js
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");
```

这种方式就能很好的规避上面的问题：

```vue
<!-- vue3 -->
<div id="app1"></div>
<div id="app2"></div>
<script>
  createApp(根组件).use(...).mixin(...).component(...).mount("#app1")
   createApp(根组件).mount("#app2")
</script>
```

## <bqp>面试题：为什么 Vue3 中去掉了 Vue 构造函数？</bqp>

> 参考答案：
>
> Vue2 的全局构造函数带来了诸多问题：
>
> 1. 调用构造函数的静态方法会对所有 vue 应用生效，不利于隔离不同应用
> 2. Vue2 的构造函数集成了太多功能，不利于 tree shaking，Vue3 把这些功能使用普通函数导出，能够充分利用 tree shaking 优化打包体积
> 3. Vue2 没有把组件实例和 Vue 应用两个概念区分开，在 Vue2 中，通过 new Vue 创建的对象，既是一个 Vue 应用，同时又是一个特殊的 Vue 组件。Vue3 中，把两个概念区别开来，通过 createApp 创建的对象，是一个 Vue 应用，它内部提供的方法是针对整个应用的，而不再是一个特殊的组件。

## 引入 RFC

RFC 全称是 Request For Comments. 这是一种在软件开发和开源项目中常用的提案流程，用于收集社区对某个新功能、改动或标准的意见和建议。

RFC 是一种文档格式，它详细描述了某个特性或更改的提议，讨论其动机、设计选择、实现细节以及潜在的影响。在通过讨论和反馈达成共识后，RFC 会被采纳或拒绝。一份 RFC 主要的组成部分有：

1. 标题：简短描述提案的目的。
2. 摘要：简要说明提案的内容和动机。
3. 动机：解释为什么需要这个提案，解决了什么问题。
4. 详细设计：深入描述提案的设计和实现细节。
5. 潜在问题和替代方案：讨论可能存在的问题和可以考虑的替代方案。
6. 不兼容的变更：描述提案是否会引入不兼容的变更，以及这些变更的影响。

通过 RFC，Vue 核心团队能够更好地倾听用户的需求和建议，从而开发出更加符合社区期待的功能和特性。

## <bqp>面试题：说一下 Vue3 相比 Vue2 有什么新的变化？</bqp>

> 参考答案：
>
> Vue3 相比 Vue2 的整体变化，可以分为好几大类：
>
> 1. 源码优化
> 2. 性能优化
> 3. 语法 API 优化
> 4. 引入 RFC
>
> **源码优化**体现在使用 typescript 重构整个 Vue 源码，对冷门的功能进行了删除，并且整个源码的结构变为了使用 Monorepo 进行管理，这样粒度更细，不同的包可以独立测试发布。用户也可以单独引入某一个包使用，而不用必须引入 Vue.
>
> **性能上的优化**是整个 Vue3 最核心的变化，通过优化响应式、diff 算法、模板编译，Vue3 的性能相比 Vue2 有质的飞跃，基本上将性能这一块儿做到了极致。所以 Vue 的新项目建议都使用 Vue3 来搭建。
>
> 不过性能层面的优化，开发者无法直接的感知，开发者能够直接感知的，是**语法上的优化**，例如 Vue3 提出的 CompositionAPI，用于替代 Vue2 时期的 OptionsAPI. 这样能够让功能逻辑更加集中，无论是在阅读还是修改都更加方便。另外 CompositionAPI 让代码复用的粒度上更细，不需要再像以前一样使用 mixin 复用逻辑，而是推荐使用组合式函数来复用逻辑。
>
> 不过 Vue3 也不是完全废弃了 OptionsAPI，在 Vue3 中，OptionsAPI 成为了一种编码风格。
>
> 最后就是引入 RFC，尤雨溪和核心团队广泛采用了 RFC 的流程来处理新功能和重大更改。
