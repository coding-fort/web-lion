# Vue 数据劫持

## 1.数据劫持的工作原理

1. **初始化响应式数据**：

   - 当 Vue 实例创建时，会调用 `initState` 方法初始化状态（包括 `data`、`props`、`methods` 等），其中最重要的是对 `data` 的处理。
   - 对于 `data` 中的对象，Vue 会递归地遍历其所有属性，并使用 `Object.defineProperty()` 来定义 getter 和 setter。

2. **使用 `Object.defineProperty()` 拦截属性访问和修改**：

   - Getter：每当读取一个属性时，getter 会被触发，这时可以执行一些操作，比如收集依赖（即哪些 watcher 监听了这个属性的变化）。
   - Setter：当设置一个属性的新值时，setter 会被触发，这将通知所有依赖该属性的 watcher 执行它们的回调函数，从而更新视图。

3. **依赖收集与派发更新**：

   - 在组件渲染过程中，当访问到某个响应式的属性时，Vue 会自动将其添加为当前渲染 watcher 的依赖。
   - 如果之后该属性发生变化，setter 将被触发，进而通知相关的 watcher 重新计算，最终导致视图更新。

4. **数组的特殊处理**：

   - 由于原生 JavaScript 数组的方法不会触发 setter，Vue 2 针对数组做了特别处理，重写了部分常用方法（如 `push`、`pop`、`shift`、`unshift`、`splice`、`sort` 和 `reverse`），以确保这些操作也能触发视图更新。

5. **新增属性的响应性问题**：

   - 使用 `Object.defineProperty()` 定义的属性是固定的，直接在对象上添加新属性不会使其变为响应式的。因此，Vue 提供了 `$set` 方法来安全地向响应式对象中添加新的属性。

6. **性能优化**：
   - 为了避免不必要的开销，Vue 只会在首次渲染时收集依赖，在后续更新中只关注实际变化的部分。

## 2.示例代码

```javascript
// 简化的响应式数据劫持示例
function observe(data) {
  if (!data || typeof data !== "object") {
    return;
  }

  Object.keys(data).forEach((key) => {
    defineReactive(data, key, data[key]);
  });
}

function defineReactive(obj, key, val) {
  const dep = new Dep(); // 假设 Dep 是用来管理依赖的类

  observe(val); // 递归观察子属性

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        // 如果有正在监听的 watcher
        dep.addSub(Dep.target);
      }
      return val;
    },
    set(newVal) {
      if (newVal === val) {
        return;
      }
      observe(newVal); // 新值也应该是响应式的
      val = newVal;
      dep.notify(); // 通知所有订阅者
    },
  });
}

// 使用
const data = { message: "Hello Vue" };
observe(data);

// 模拟 watcher
class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm;
    this.expOrFn = expOrFn;
    this.cb = cb;
    Dep.target = this;
    this.get();
    Dep.target = null;
  }

  get() {
    this.value = this.vm[this.expOrFn];
  }

  update() {
    const oldValue = this.value;
    this.get();
    this.cb.call(this.vm, this.value, oldValue);
  }
}

// 创建 watcher 并绑定到 data.message 上
new Watcher(data, "message", function (newValue, oldValue) {
  console.log(`message changed from ${oldValue} to ${newValue}`);
});

// 修改 data.message 触发 watcher
data.message = "Hello World!";
```

## 注意事项

- **兼容性限制**：`Object.defineProperty()` 并不是所有浏览器都支持，尤其是在 IE8 及以下版本。不过，对于现代 Web 开发来说，这不是一个问题。
- **性能影响**：虽然 Vue 已经做了很多优化，但大量复杂的嵌套对象仍然可能带来性能瓶颈。因此，在设计数据结构时应尽量保持简洁。
- **数组变更检测**：如前所述，Vue 对数组进行了特殊处理，但并不是所有的数组方法都能被侦测到。对于不支持的方法，建议使用 Vue 提供的变异方法或 `$set`。

总之，Vue 2 的数据劫持机制结合了 JavaScript 的特性，提供了一个强大且灵活的响应式框架。理解这一机制有助于更好地掌握 Vue 的内部工作原理，并编写出更高效的代码。如果您有更多问题或需要进一步的帮助，请随时告诉我！
