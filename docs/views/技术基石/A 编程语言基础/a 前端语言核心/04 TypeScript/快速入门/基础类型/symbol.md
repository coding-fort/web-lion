# Symbol 类型

`Symbol` 是 JavaScript（ES6/ES2015 引入）和 TypeScript 中的一种基本数据类型，用于创建唯一的标识符。与 `string` 或 `number` 不同，每个 `Symbol` 值都是独一无二的，即使它们通过相同的描述符创建。这种特性使得 `Symbol` 在需要唯一性的地方非常有用，例如对象属性键、枚举替代方案或避免命名冲突。

## 创建 Symbol

你可以使用 `Symbol()` 函数来创建一个新的 `Symbol` 实例。这个函数可以接受一个可选的字符串参数作为描述符（description），但它不会影响 `Symbol` 的唯一性。

```typescript
const sym1 = Symbol();
const sym2 = Symbol("description");
```

## Symbol 的唯一性

即使两个 `Symbol` 使用相同的描述符创建，它们仍然是不同的值。

```typescript
const sym3 = Symbol("key");
const sym4 = Symbol("key");

console.log(sym3 === sym4); // false
```

## Symbol 作为对象属性键

`Symbol` 最常见的用途之一是作为对象属性的键。由于 `Symbol` 的唯一性，它可以有效避免属性名冲突问题。

```typescript
const obj = {};

const id = Symbol("id");
obj[id] = "12345";

console.log(obj[id]); // "12345"
```

## 全局 Symbol 注册表

如果你想创建可以在不同上下文中共享的 `Symbol`，可以使用全局 `Symbol` 注册表。这可以通过 `Symbol.for()` 方法实现，它会根据提供的键查找已存在的 `Symbol` 或创建一个新的。

```typescript
const sym5 = Symbol.for("sharedKey");
const sym6 = Symbol.for("sharedKey");

console.log(sym5 === sym6); // true
```

## 内置 Symbol

JavaScript 还定义了一些内置的 `Symbol`，这些 `Symbol` 用于特定的操作或行为。它们通常以 `Symbol.` 开头，并且在语言规范中有明确的用途。

- **Symbol.iterator**：用于定义对象的默认迭代器。

  ```typescript
  const myIterable = {
    [Symbol.iterator]() {
      let i = 0;
      return {
        next() {
          if (i < 3) {
            return { value: i++, done: false };
          } else {
            return { value: undefined, done: true };
          }
        },
      };
    },
  };

  for (let value of myIterable) {
    console.log(value); // 0, 1, 2
  }
  ```

- **Symbol.toPrimitive**：用于自定义对象到原始类型的转换。

- **Symbol.species**：用于指定构造函数创建派生对象时使用的构造函数。

- **Symbol.hasInstance**：用于自定义 `instanceof` 操作符的行为。

- **Symbol.isConcatSpreadable**：用于指示数组是否应该在 `concat` 操作中展开。

- **Symbol.unscopables**：用于指定哪些属性不应该出现在 `with` 语句的作用域中。

## Symbol 的不可枚举性

当 `Symbol` 用作对象属性键时，默认情况下它是不可枚举的。这意味着它不会出现在 `for...in` 循环或 `Object.keys()` 方法的结果中。不过，你可以使用 `Object.getOwnPropertySymbols()` 来获取对象上的所有 `Symbol` 属性。

```typescript
const obj = {
  [Symbol("a")]: "valueA",
  prop: "valueB",
};

for (let key in obj) {
  console.log(key); // 只输出 "prop"
}

console.log(Object.keys(obj)); // ["prop"]
console.log(Object.getOwnPropertySymbols(obj)); // [Symbol(a)]
```

## Symbol 的描述符

尽管 `Symbol` 的描述符不影响其唯一性，但它可以在调试或日志记录时提供有用的信息。你可以在创建 `Symbol` 时传递一个字符串作为描述符，然后使用 `Symbol.prototype.description` 获取它。

```typescript
const sym = Symbol("myDescription");

console.log(sym.description); // "myDescription"
```

## 总结

`Symbol` 类型为 JavaScript 和 TypeScript 提供了一种强大的工具，用于创建唯一标识符并解决命名冲突问题。理解如何创建和使用 `Symbol`，以及熟悉它的特性和内置符号，可以帮助你在编写代码时更加灵活和高效。
