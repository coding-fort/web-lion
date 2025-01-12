# ES9(ES2018)

ECMAScript 2018，通常被称为 ES9，是 JavaScript 的另一个年度版本，继续了每年一次的更新节奏。ES9 在 ES8 的基础上增加了几个新的语言特性，旨在提高代码的可读性、效率以及处理复杂数据结构的能力。以下是 ES9 中的一些关键新增特性：

### 1. Rest 和 Spread 属性（Rest/Spread Properties）

- Rest 属性允许你收集一个对象中的剩余属性，而 Spread 属性则允许你将一个对象的属性“展开”到另一个对象中。这在组合或克隆对象时非常有用。

### 2. Async Iterators 和 Async Generators

- ES9 正式引入了异步迭代器和生成器，这使得处理异步数据流变得更加容易。`async function *` 可以创建异步生成器，而 `for await...of` 循环可以用来迭代这些异步生成器。

### 3. Numeric separators

- 在数字字面量中可以使用下划线 `_` 作为分隔符，使大数更加可读。例如，你可以写 `1_000_000` 而不是 `1000000`。

### 4. RegExp Lookbehind Assertions

- 正则表达式现在支持 lookbehind 断言，这使得匹配模式前的文本成为可能，这对于复杂的字符串解析非常有用。

### 5. Symbol Description

- 你可以在 `Symbol()` 构造函数中传入描述字符串，该描述可以通过 `.description` 属性访问，这在调试和日志记录时很有帮助。

### 6. Object.fromEntries()

- 这个方法与 `Object.entries()` 相反，它接受一个键值对的数组并将其转换成一个对象。

### 7. String.trimStart() 和 String.trimEnd()

- 这两个方法分别从字符串的开始和结束去除空白字符，它们是 `String.trim()` 方法的补充。

### 8. Array.prototype.flat() 和 Array.prototype.flatMap()

- `flat()` 方法可以用来扁平化嵌套数组，而 `flatMap()` 结合了 `map()` 和 `flat()` 的功能，可以先映射每个元素然后扁平化结果。

### 9. Intl.ListFormat

- 提供了一种格式化列表的方式，这在国际化应用中非常有用。

ES9 的这些特性进一步丰富了 JavaScript 语言，使得开发者能够以更简洁、更直观的方式处理数据和控制流程。随着现代浏览器对这些特性的不断支持，开发者可以利用它们来编写更加健壮和高效的代码。
