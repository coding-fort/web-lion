# ES8(ES2017)

ECMAScript 2017，通常被称为 ES8，是 JavaScript 语言标准的又一更新，发布于 2017 年。ES8 在 ES7 的基础上继续引入了一些新的特性和改进，虽然不像 ES6 那样带来革命性的变化，但这些新特性依然为 JavaScript 开发提供了更多的便利和灵活性。以下是 ES8 中的一些主要新增特性：

### 1. async/await

- `async/await` 是基于 Promise 的一种新的异步编程语法。`async` 关键字用于定义一个异步函数，而 `await` 关键字用于等待一个 Promise 的结果。这使得异步代码的编写更加接近于同步代码的风格，提高了代码的可读性和可维护性。

### 2. Object.getOwnPropertyDescriptors()

- 这个新方法返回一个对象，其中包含了目标对象所有自身属性的描述符。这在复制或迁移对象属性时非常有用。

### 3. String padding methods: padStart() and padEnd()

- ES7 实际上已经引入了这些方法，但在 ES8 中它们得到了进一步的标准化和确认。这些方法允许你在字符串的开头或结尾添加填充字符，直到达到指定的长度。

### 4. Trailing commas in function arguments and calls

- 允许在函数参数列表和调用中使用尾随逗号，这在编写多行参数列表时提高了代码的可读性，并且在添加或移除参数时减少了重构的工作量。

### 5. SharedArrayBuffer

- `SharedArrayBuffer` 是一个新的全局对象，它表示一个可以被多个 JavaScript 线程共享的固定大小的原始二进制数据缓冲区。结合 `Atomics` 对象，它支持原子操作，使得在 Web Workers 中进行高效共享内存操作成为可能。

### 6. CopyWithin, Fill, and FindIndex array methods

- 这些方法进一步扩展了数组的功能。`Array.prototype.copyWithin` 允许你复制数组的一部分到数组的另一部分，`Array.prototype.fill` 用于填充数组的一部分或全部元素为指定的静态值，`Array.prototype.findIndex` 则用于找到第一个满足提供的测试函数的数组元素的索引。

### 7. Async Iterators and Generators

- 虽然完整的异步迭代器和生成器的支持在 ES8 中没有完全实现，但 ES8 引入了必要的基础设施，包括 `@@asyncIterator` 符号，为未来的异步迭代打下了基础。

ES8 的这些特性不仅增强了 JavaScript 的语言功能，也反映了社区对更高效、更安全的异步编程和多线程支持的需求。随着这些特性的逐步标准化和浏览器的支持，JavaScript 的应用场景和能力得到了进一步的扩展。
