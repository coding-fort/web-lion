# Vue3 响应式

> 面试题：说一说 Vue3 响应式相较于 Vue2 是否有改变？如果有，那么说一下具体有哪些改变？

## 1. 数据拦截

首当其冲的就是数据拦截的变化：

- Vue2: 使用 Object.defineProperty 进行拦截
- Vue3: 使用 Proxy + Object.defineProperty 进行拦截

**两者的共同点**

- 都可以针对对象成员拦截
- 都可以实现深度拦截

**两者的差异点**

- 拦截的广度
  - Object.defineProperty 是针对对象特定**属性**的**读写**操作进行拦截，这意味着之后新增加/删除的属性是侦测不到的
  - Proxy 则是针对**一整个对象**的多种操作，包括属性的读取、赋值、属性的删除、属性描述符的获取和设置、原型的查看、函数调用等行为能够进行拦截。
- 性能上的区别：在大多数场景下，Proxy 比 Object.defineProperty 效率更高，拦截方式更加灵活。

## 2. 响应式数据

创建响应式数据上面的变化：

- Vue2: 通过 data 来创建响应式数据
- Vue3: 通过 ref、reactvie 等方法来创建响应式数据
  - ref：使用 Object.defineProperty + Proxy 方式
  - reactive：使用 Proxy 方式

**对应源码**

```js
class RefImpl<T> {
  private _value: T
  private _rawValue: T

  public dep?: Dep = undefined
  public readonly __v_isRef = true

  constructor(
    value: T,
    public readonly __v_isShallow: boolean,
  ) {
    this._rawValue = __v_isShallow ? value : toRaw(value)
    // 有可能是原始值，有可能是 reactive 返回的 proxy
    this._value = __v_isShallow ? value : toReactive(value)
  }

  get value() {
    // 收集依赖 略
    return this._value
  }

  set value(newVal) {
    // 略
  }
}

// 判断是否是对象，是对象就用 reactive 来处理，否则返回原始值
export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value) : value
```

```js
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
  // ...

  // 创建 Proxy 代理对象
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}

export function reactive(target: object) {
  // ...

  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
```

## 3. 依赖收集

依赖收集上面的变化：

- Vue2：Watcher + Dep

  - 每个响应式属性都有一个 Dep 实例，用于做依赖收集，内部包含了一个数组，存储依赖这个属性的所有 watcher
  - 当属性值发生变化，dep 就会通知所有的 watcher 去做更新操作

- Vue3：WeakMap + Map + Set
  - Vue3 的依赖收集粒度更细
  - WeakMap 键对应的是响应式对象，值是一个 Map，这个 Map 的键是该对象的属性，值是一个 Set，Set 里面存储了所有依赖于这个属性的 effect 函数

总结起来，Vue3 相比 Vue2 的依赖追踪粒度更细，Vue2 依赖收集收集的是具体的 Watcher（组件），Vue3 依赖收集收集的是对应的副作用函数。

## <bqp>面试题：说一说 Vue3 响应式相较于 Vue2 是否有改变？如果有，那么说一下具体有哪些改变？</bqp>

> 参考答案：
>
> 相比较 Vue2，Vue3 在响应式的实现方面有这么一些方面的改变：
>
> 1. 数据拦截从 Object.defineProperty 改为了 Proxy + Object.defineProperty 的拦截方式，其中
>    - ref：使用 ObjectdefineProperty + Proxy 方式
>    - reactive：使用 Proxy 方式
> 2. 创建响应式数据在语法层面有了变化：
>    - Vue2: 通过 data 来创建响应式数据
>    - Vue3: 通过 ref、reactvie 等方法来创建响应式数据
> 3. 依赖收集上面的变化
>    - Vue2：Watcher + Dep
>    - Vue3：WeakMap + Map + Set
>    - 这种实现方式可以实现更细粒度的依赖追踪和更新控制
