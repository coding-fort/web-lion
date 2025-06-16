# watch 面试题

> 面试题：watch 和 computed 的区别是什么？说一说各自的使用场景？

watch 的使用

```js
const count = ref('');
watch(count, async (newVal, oldVal)=>{})

watch(()=>{
  count...
}, (newVal, oldVal)=>{
  // ...
})
```

watch 核心实现

```js
import { effect, cleanup } from "./effect/effect.js";

// 遍历对象
function traverse(value, seen = new Set()) {
  // ...
}

/**
 * @param {*} source
 * @param {*} cb 要执行的回调函数
 * @param {*} options 选项对象
 * @returns
 */
export function watch(source, cb, options = {}) {
  // 1. 参数归一化，统一成一个函数
  let getter;
  if (typeof source === "function") {
    getter = source;
  } else {
    getter = () => traverse(source);
  }

  // 2. 保存新值和旧值
  let oldValue, newValue;

  const effectFn = effect(() => getter(), {
    lazy: true,
    scheduler: () => {
      newValue = effectFn();
      cb(newValue, oldValue);
      oldValue = newValue;
    },
  });

  oldValue = effectFn();

  return () => {
    cleanup(effectFn);
  };
}
```

## <bqp>面试题：watch 和 computed 的区别是什么？说一说各自的使用场景？</bqp>

> 参考答案：
>
> **computed**
>
> - 作用：用于创建计算属性，依赖于 Vue 的响应式系统来做数据追踪。当依赖的数据发生变化时，会自动重新计算。
> - 无副作用：计算属性内部的计算应当是没有副作用的，也就是说仅仅基于数据做二次计算。
> - 缓存：计算属性具备缓存机制，如果响应式数据没变，每次获取计算属性时，内部直接返回的是上一次计算值。
> - 用处：通常用于模板当中，以便在模板中显示二次计算后的结构。
> - 同步：计算属性的一个核心特性是缓存，而这种缓存机制是基于同步计算的，假如允许异步计算，那么在异步操作完成之前，计算属性无法提供有效的返回值，这与它的缓存设计理念相违背。
>
> **watch**
>
> - 作用：用于监听数据的变化，可以监听一个或者多个数据，当数据发生改变时，执行一些用户指定的操作。
> - 副作用：监听器中的回调函数可以执行副作用操作，例如发送网络请求、手动操作 DOM 等。
> - 无缓存：监听器中的回调函数执行结果不会被缓存，也没办法缓存，因为不知道用户究竟要执行什么操作，有可能是包含副作用的操作，有可能是不包含副作用的操作。
> - 用处：常用于响应式数据发生变化后，重新发送网络请求，或者修改 DOM 元素等场景。
> - 支持异步：在监听到响应式数据发生变化后，可以进行同步或者异步的操作。
