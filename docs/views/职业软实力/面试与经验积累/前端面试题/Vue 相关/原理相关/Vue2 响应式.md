# Vue2 响应式

> 面试题：说一说 Vue3 响应式相较于 Vue2 是否有改变？如果有，那么说一下具体有哪些改变？

## 观察者模式

生活中的观察者模式：

假设顾客对新型号的手机感兴趣，但是目前商店还没到货，那么顾客及时如何买到新型号的手机？

1. 顾客每天去一趟商场 🙅
2. 商品到货后没所有顾客发出通知 🙅

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-03-22-074632.png" alt="image-20240322154631735" style="zoom:50%;" />

我们似乎遇到了一个矛盾：要么让顾客浪费时间检查产品是否到货，要么让商店浪费资源去通知没有需求的顾客。

解决方案：其实很简单，让有需求的顾客（watcher）主动订阅即可，之后商店（dep）只需要给订阅了用户发送通知。

## Vue2 响应式工作机制

1. data 中的数据会被 Vue 遍历生成 getter 和 setter，这样一来当访问或设置属性时，Vue 就有机会做一些别的事情。
2. 每个组件实例都对应一个 watcher 实例，它会在组件渲染的过程中把“接触”过的数据 property 记录为依赖。之后当依赖项的 setter 触发时，会通知 watcher，从而使它关联的组件重新渲染。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-01-074111.png" alt="image-20240901154111493" style="zoom:40%;" />

几个比较重要的点：

1. 劫持数据：通过 Object.defineProperty 方法来做数据劫持，生成 getter 和 setter 从而让获取/设置值的时候可以做一些其他的事情。
2. 发布者：记录依赖，也就是数据和 watcher 之间的映射关系
3. 观察者：watcher 会被发布者记录，数据发生变化的时候，发布者会会通知 watcher，之后 watcher 执行相应的处理

## 劫持数据

劫持数据对象，是 Observer 的工作，它的目标很简单，就是把一个普通的对象转换为响应式的对象

为了实现这一点，Observer 把对象的每个属性通过 Object.defineProperty 转换为带有 getter 和 setter 的属性，这样一来，当访问或设置属性时，Vue 就有机会做一些别的事情。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-01-052809.png" alt="20210226153448" style="zoom:67%;" />

Observer 是 Vue 内部的构造器，我们可以通过 Vue 提供的静态方法 Vue.observable( object ) 间接的使用该功能。

在组件生命周期中，这件事发生在 beforeCreate 之后，created 之前。

具体实现上，**它会递归遍历对象的所有属性，以完成深度的属性转换**。由于遍历时只能遍历到对象的当前属性，因此无法监测到将来动态增加或删除的属性，因此 Vue 提供了 $set 和 $delete 两个实例方法，让开发者通过这两个实例方法对已有响应式对象添加或删除属性。对于数组，Vue 会更改它的隐式原型，之所以这样做，是因为 Vue 需要监听那些可能改变数组内容的方法。

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-01-052949.png" alt="20210226154624" style="zoom:67%;" />

总之，Observer 的目标，就是要让一个对象，它属性的读取、赋值，内部数组的变化都要能够被 Vue 感知到。

## 发布者(商店)

发布者，也被称之为依赖管理器，对应英文 Dependency，简称 Dep.

其中最核心的两个功能：

- 能够添加观察者：当读取响应式对象的某个属性时，它会进行依赖收集
- 能够通知观察者：当改变某个属性时（商品发售了），它会派发更新（通知所有顾客）

<img src="https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-01-053233.png" alt="20210226155852" style="zoom:67%;" />

## 观察者

当依赖的数据发生变化时，发布者会通知每一个观察者，而观察者需要调用 update 来更新数据。

## scheduler

Vue2 内部实现中，还存在一个 Scheduler，因为 Dep 通知 watcher 之后，如果 watcher 执行重运行对应的函数，就有可能导致函数频繁运行，从而导致效率低下

试想，如果一个交给 watcher 的函数，它里面用到了属性 a、b、c、d，那么 a、b、c、d 属性都会记录依赖，于是下面的代码将触发 4 次更新：

```js
state.a = "new data";
state.b = "new data";
state.c = "new data";
state.d = "new data";
```

这样显然是不合适的，因此，watcher 收到派发更新的通知后，实际上不是立即执行对应函数，而是把自己交给一个叫调度器的东西

调度器维护一个执行队列，该**队列同一个 watcher 仅会存在一次，队列中的 watcher 不是立即执行，它会通过一个叫做 nextTick 的工具方法，把这些需要执行的 watcher 放入到事件循环的微队列中**，也就是说，当响应式数据变化时，render 函数的执行是**异步**的，并且在**微队列**中。

## Vue2 响应式整体流程

![20210226163936](https://xiejie-typora.oss-cn-chengdu.aliyuncs.com/2024-09-01-053804.png)

几个核心部件：

1. Observer：用于劫持数据对象，把对象的每个属性通过 Object.defineProperty 转换为带有 getter 和 setter 的属性
2. Dep(商店)：发布者，也被称之为依赖管理器
   - 能够添加观察者：当读取响应式对象的某个属性时，它会进行依赖收集
   - 能够通知观察者：当改变某个属性时，它会派发更新
3. Watcher（顾客）：负责具体的更新操作（可以理解为用户收到商场的邮件后，自身要做什么事情）
4. Scheduler：负责调度。
