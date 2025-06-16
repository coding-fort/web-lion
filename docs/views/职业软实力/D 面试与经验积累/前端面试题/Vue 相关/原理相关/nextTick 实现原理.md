# nextTick 实现原理

> 面试题：Vue 的 nextTick 是如何实现的？

```vue
<template>
  <div>
    <p>{{ count }}</p>
    <button @click="increment">增加计数</button>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const count = ref(0);

  const increment = () => {
    for (let i = 1; i <= 1000; i++) {
      count.value = i;
    }
  };
</script>
```

思考 🤔：点击按钮后，页面会渲染几次？

答案：只会渲染一次，同步代码中多次对响应式数据做了修改，多次修改会被**合并**为一次，之后根据最终的修改结果**异步**的去更新 DOM.

思考 🤔：倘若不合并，并且同步的去修改 DOM，会有什么样的问题？

答案：如果不进行合并，并且数据一变就同步更新 DOM，会导致频繁的重绘和重排，这非常耗费性能。

思考 🤔：异步更新会带来问题

答案：无法及时获取到更新后的 DOM 值

原因：因为获取 DOM 数据是同步代码，DOM 的更新是异步的，同步代码会先于异步代码执行。

解决方案：将获取 DOM 数据的同步任务包装成一个微任务，浏览器在完成一次渲染后，就会立即执行微任务。

当前我们自己的解决方案：

```js
const increment = () => {
  count.value++;

  Promise.resolve().then(() => {
    console.log("最新的数据：", count.value);
    console.log("通过DOM拿textContent数据：", counterRef.value.textContent);
    console.log(
      "通过DOM拿textContent数据：",
      document.getElementById("counter").textContent
    );
    console.log("通过DOM拿innerHTML数据：", counterRef.value.innerHTML);
    console.log(
      "通过DOM拿innerHTML数据：",
      document.getElementById("counter").innerHTML
    );
  });
};
```

nextTick 帮我们做的就是上面的事情，将一个任务包装成一个微任务。

```js
const increment = () => {
  count.value++;

  nextTick(() => {
    console.log("最新的数据：", count.value);
    console.log("通过DOM拿textContent数据：", counterRef.value.textContent);
    console.log(
      "通过DOM拿textContent数据：",
      document.getElementById("counter").textContent
    );
    console.log("通过DOM拿innerHTML数据：", counterRef.value.innerHTML);
    console.log(
      "通过DOM拿innerHTML数据：",
      document.getElementById("counter").innerHTML
    );
  });
};
```

nextTick 返回的是一个 Promise

```js
const increment = async () => {
  count.value++;

  await nextTick();
  console.log("最新的数据：", count.value);
  console.log("通过DOM拿textContent数据：", counterRef.value.textContent);
  console.log(
    "通过DOM拿textContent数据：",
    document.getElementById("counter").textContent
  );
  console.log("通过DOM拿innerHTML数据：", counterRef.value.innerHTML);
  console.log(
    "通过DOM拿innerHTML数据：",
    document.getElementById("counter").innerHTML
  );
};
```

\$nextTick，首先这是一个方法，是 Vue 组件实例的方法，用于 OptionsAPI 风格的。

```js
export default {
  data() {
    return {
      count: 1,
      counterRef: null,
    };
  },
  methods: {
    increment() {
      this.count++;
      this.$nextTick(() => {
        // 在下一个 DOM 更新循环后执行的回调函数
        console.log("最新数据为:", this.count);
        console.log("拿到的DOM:", document.getElementById("counter"));
        console.log("拿到的DOM:", this.$refs.counterRef);
        console.log(
          "通过DOM拿数据:",
          document.getElementById("counter").textContent
        );
        console.log(
          "通过DOM拿数据:",
          document.getElementById("counter").innerHTML
        );
        console.log("通过DOM拿数据:", this.$refs.counterRef.textContent);
        console.log("通过DOM拿数据:", this.$refs.counterRef.innerHTML);
      });
    },
  },
};
```

[nextTick 源码](https://github.com/vuejs/core/blob/main/packages/runtime-core/src/scheduler.ts)

```js
// 创建一个已经解析的 Promise 对象，这个 Promise 会立即被解决，
// 用于创建一个微任务（microtask）。
const resolvedPromise = /*#__PURE__*/ Promise.resolve() as Promise<any>

// 一个全局变量，用于跟踪当前的刷新 Promise。
// 初始状态为 null，表示当前没有刷新任务。
let currentFlushPromise: Promise<void> | null = null

// queueFlush 函数负责将刷新任务（flushJobs）放入微任务队列。
// 这是 Vue 的异步更新机制的核心部分，用于优化性能。
function queueFlush() {
  // 检查是否已经在刷新（isFlushing）或者刷新任务是否已被挂起（isFlushPending）。
  if (!isFlushing && !isFlushPending) {
    // 设置 isFlushPending 为 true，表示刷新任务已被挂起，正在等待执行。
    isFlushPending = true
    // 将 currentFlushPromise 设置为 resolvedPromise.then(flushJobs)
    // 这将创建一个微任务，当 resolvedPromise 被解决时，执行 flushJobs 函数。
    currentFlushPromise = resolvedPromise.then(flushJobs)
  }
}

// nextTick 函数用于在下一个 DOM 更新循环之后执行一个回调函数。
// 它返回一个 Promise，这个 Promise 会在 DOM 更新完成后解决。
export function nextTick<T = void, R = void>(
  this: T,
  fn?: (this: T) => R,  // 可选的回调函数，在 DOM 更新之后执行
): Promise<Awaited<R>> {
  // 如果 currentFlushPromise 不为 null，使用它；否则使用 resolvedPromise。
  // 这样可以确保在 DOM 更新之后再执行回调。
  const p = currentFlushPromise || resolvedPromise

  // 如果传入了回调函数 fn，返回一个新的 Promise，在 p 解决之后执行 fn。
  // 使用 this 绑定来确保回调函数的上下文正确。
  return fn ? p.then(this ? fn.bind(this) : fn) : p
  // 如果没有传入回调函数 fn，直接返回 Promise p，这样外部代码可以使用 await 等待 DOM 更新完成。
}
```

## <bqp>面试题：Vue 的 nextTick 是如何实现的？</bqp>

> 参考答案：
>
> nextTick 的本质将回调函数包装为一个微任务放入到微任务队列，这样浏览器在完成渲染任务后会优先执行微任务。
>
> nextTick 在 Vue2 和 Vue3 里的实现有一些不同：
>
> 1.  Vue2 为了兼容旧浏览器，会根据不同的环境选择不同包装策略：
>
> - 优先使用 Promise，因为它是现代浏览器中最有效的微任务实现。
>
> - 如果不支持 Promise，则使用 MutationObserver，这是另一种微任务机制。
>
> - 在 IE 环境下，使用 setImmediate，这是一种表现接近微任务的宏任务。
>
> - 最后是 setTimeout(fn, 0) 作为兜底方案，这是一个宏任务，但会在下一个事件循环中尽快执行。
>
> 2.  Vue3 则是只考虑现代浏览器环境，直接使用 Promise 来实现微任务的包装，这样做的好处在于代码更加简洁，性能更高，因为不需要处理多种环境的兼容性问题。
>
> 整体来讲，Vue3 的 nextTick 实现更加简洁和高效，是基于现代浏览器环境的优化版本，而 Vue2 则为了兼容性考虑，实现层面存在更多的兼容性代码。
