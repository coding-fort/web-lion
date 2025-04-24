# computed 面试题

> 面试题：谈谈 computed 的机制，缓存了什么？为什么 computed 不支持异步？

响应式系统：

- track：进行依赖收集，建立数据和函数的映射关系
- trigger：触发更新，重新执行数据所映射的所有函数

computed 开发者使用：

```js
const state = reactive({
  a: 1,
  b: 2,
});

const sum = computed(() => {
  return state.a + state.b;
});
```

```js
const firstName = ref("John");
const lastName = ref("Doe");

const fullName = computed({
  get() {
    return firstName.value + " " + lastName.value;
  },
  set(newValue) {
    [firstName.value, lastName.value] = newValue.split(" ");
  },
});
```

computed 核心实现：

1. 参数归一化，统一成对象的形式
2. 返回一个存取器对象

```js
import { effect } from "./effect/effect.js";
import track from "./effect/track.js";
import trigger from "./effect/trigger.js";
import { TriggerOpTypes, TrackOpTypes } from "./utils.js";

// 参数归一化
function normalizeParameter(getterOrOptions) {
  // 代码略
}

/**
 *
 * @param {*} getterOrOptions 可能是函数，也可能是对象
 */
export function computed(getterOrOptions) {
  // 1. 参数归一化
  const { getter, setter } = normalizeParameter(getterOrOptions);

  // value 用于存储计算结果， dirty 负责控制从缓存中获取值还是重新计算新的值，dirty为true就代表要重新计算
  let value,
    dirty = true;

  // 让getter内部的响应式数据和getter建立映射关系
  // 回头getter内部的响应式数据发生变化后，重新执行getter
  const effectFn = effect(getter, {
    lazy: true,
    scheduler() {
      dirty = true;
      trigger(obj, TriggerOpTypes.SET, "value");
    },
  });

  // 2. 返回一个存取器对象
  const obj = {
    get value() {
      // 需要将 value 和渲染函数建立映射关系
      track(obj, TrackOpTypes.GET, "value");
      if (dirty) {
        value = effectFn();
        dirty = false;
      }
      return value;
    },
    set value(newValue) {
      setter(newValue);
    },
  };
  return obj;
}
```

## <bqp>面试题：谈谈 computed 的机制，缓存了什么？为什么 computed 不支持异步？</bqp>

> 参考答案：
>
> **谈谈 computed 的机制，缓存了什么？**
>
> 缓存的是上一次 getter 计算出来的值。
>
> **为什么 computed 不支持异步？**
>
> computed 属性在 Vue 中不支持异步操作的主要原因是设计上的理念和使用场景的考虑。**computed 属性的初衷是用于计算并缓存一个基于响应式依赖的同步计算结果**，当其依赖的响应式数据发生变化时，Vue 会自动重新计算 computed 的值，并将其缓存，以提高性能。
>
> computed 不支持异步的几个具体原因：
>
> 1. 缓存机制与同步计算：computed 属性的一个核心特性是缓存。当依赖的响应式数据没有变化时，computed 的计算结果会被缓存并直接返回，而不会重新执行计算。这种缓存机制是基于同步计算的，假如允许异步计算，那么在异步操作完成之前，computed 属性无法提供有效的返回值，这与它的同步缓存理念相违背。
> 2. 数据一致性：computed 属性通常用于模板中的绑定，它的计算结果需要在渲染期间是稳定且可用的。如果 computed 支持异步操作，渲染过程中的数据可能不一致，会导致模板渲染时无法确定使用什么数据，从而可能造成视图的闪烁或数据错误。
> 3. 调试与依赖追踪困难：如果 computed 属性是异步的，那么在调试和依赖追踪时就会变得非常复杂。异步操作的完成时间不确定，会使得依赖追踪的过程变得不直观，也难以预期。
>
> 如果需要进行异步操作，通常推荐使用 watch 来实现。
