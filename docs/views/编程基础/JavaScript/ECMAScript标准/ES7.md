# ES7(ES2016)

ECMAScript 2016，通常被称为 ES7，是 JavaScript 标准的一个年度更新版本，于 2016 年正式发布。相对于 ES6（ECMAScript 2015），ES7 引入的新增特性相对较少，但依然有一些重要的改进，主要包括：

### 1. 指数运算符（Exponentiation Operator）

- 引入了指数运算符 `**`，用于快速计算幂次方。例如，`2 ** 3` 等价于 `Math.pow(2, 3)`，结果为 `8`。同时，还引入了 `Math.expm1` 和 `Math.log1p` 等数学函数。

### 2. Array.prototype.includes()

- 添加了 `includes()` 方法到数组原型上，用于判断一个数组是否包含特定的元素，类似于字符串的 `includes` 方法。例如，`[1, 2, 3].includes(2)` 返回 `true`。

### 3. Array.prototype.entries()，keys() 和 values()

- 引入了这三个数组实例方法，使得数组可以像 Map 或 Set 那样使用 `for...of` 循环进行迭代。`entries()` 返回数组的键值对迭代器，`keys()` 返回索引迭代器，`values()` 返回元素迭代器。

### 4. String.prototype.padStart() 和 padEnd()

- 这两个方法用于在字符串的开始或结束填充字符，直到达到指定的长度。例如，`'1'.padStart(3, '0')` 返回 `'001'`。

### 5. Object.values() 和 Object.entries()

- 这两个方法用于获取对象的所有值和键值对。`Object.values(obj)` 返回一个数组，包含了对象自身的所有可枚举属性的值；`Object.entries(obj)` 返回一个数组，包含了对象自身所有的 [key, value] 键值对。

### 6. Promise.prototype.finally()

- 虽然这个提议最初是在 ES7 阶段提出的，但实际上它没有被正式采纳到 ES7 标准中，而是后来在 ES2018 中被标准化。`finally` 方法允许在 promise 完成（无论成功还是失败）后执行一段代码，这在清理资源等场景下很有用。

ES7 的这些新增特性进一步增强了 JavaScript 的实用性，尤其是在数学运算、数组和字符串处理方面。然而，相比于 ES6 的大规模革新，ES7 的变化相对较小，更多的是对现有 API 的补充和完善。随着 ES 标准的每年更新，JavaScript 语言持续进化，为开发者提供了更多强大而便捷的工具。
