# ES5

ECMAScript 5（简称 ES5）是 JavaScript 的一个版本标准，发布于 2009 年 12 月。ES5 是在 ECMAScript 3 标准基础上的重大升级，它引入了一系列新特性，改进了语言的严谨性和功能性，同时增强了对旧版代码的兼容性。以下是一些 ES5 的关键特性：

### 1. 严格模式（Strict Mode）

- 通过在脚本或函数顶部使用 `"use strict";` 开启严格模式，可以消除 JavaScript 语言的一些不合理部分，减少一些常见的编码错误，提高代码的严谨性。

### 2. 函数参数默认值

- 虽然 ES5 本身并没有直接支持函数参数的默认值，但是可以通过在函数体内检查参数是否为 `undefined` 来实现类似的功能。ES6 正式引入了此特性。

### 3. 数组方法的增强

- 引入了多个实用的数组方法，如 `forEach`, `map`, `filter`, `reduce`, `every`, `some`, `indexOf`, `lastIndexOf` 等，这些方法简化了数组的处理和遍历逻辑。

### 4. JSON 对象的方法

- 引入了 `JSON.stringify` 和 `JSON.parse` 方法，用于序列化和解析 JSON 数据，使得与服务器端的数据交换更加方便。

### 5. Object 对象的增强

- 引入了 `Object.create`, `Object.defineProperty`, `Object.getOwnPropertyDescriptor`, `Object.getOwnPropertyNames`, `Object.keys` 等方法，提供了更强大的对象操作能力。

### 6. 类型检测的改进

- `typeof null` 返回 `"object"` 而不是 `"null"`，这是为了与早期版本的 JavaScript 保持一致。
- `Array.isArray` 方法的引入，提供了一种更可靠的方式来检测一个值是否为数组。

### 7. 变量提升的限制

- 在严格模式下，变量提升（hoisting）的行为受到限制，未声明的变量会抛出错误，这有助于避免一些常见的编程错误。

### 8. 函数表达式的名称

- 函数表达式现在可以有名称，这在递归调用和错误栈跟踪中非常有用。

### 9. 删除操作符的改进

- `delete` 操作符现在可以删除数组元素的引用，但不会改变数组的长度。

### 10. 数值和字符串的改进

- 引入了 `Number.isFinite`, `Number.isNaN`, `String.trim` 等方法，增强了对数值和字符串的操作。

ES5 的推出标志着 JavaScript 向更现代、更强大的编程语言迈出了一大步，它为后续版本（如 ES6 和更高版本）奠定了基础。尽管如此，由于历史原因和向后兼容性的考虑，ES5 仍然保留了一些早期 JavaScript 的特性和行为。
