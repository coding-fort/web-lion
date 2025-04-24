# Symbol

在 ES6（ECMAScript 2015）中，`Symbol` 是一种新的基本数据类型（primitive type）。`Symbol` 的主要用途是生成唯一的标识符，通常用于对象属性的键，从而避免命名冲突，并且可以用于创建私有成员的概念。以下是关于 `Symbol` 类型的主要特点和用法：

## 创建 Symbol

可以通过调用 `Symbol()` 函数来创建一个新的 symbol 值。每次调用 `Symbol()` 都会产生一个全新的、独一无二的值。

```javascript
let sym1 = Symbol();
let sym2 = Symbol("key"); // 可选的字符串描述，主要用于调试
console.log(sym1 !== sym2); // 输出: true，因为每个symbol都是唯一的
```

注意，尽管带有相同描述的 symbol 在比较时看起来相似，但它们并不相等，因为每一个 symbol 都是唯一的。

## 使用 Symbol 作为对象属性的键

由于 symbol 是唯一的，它们非常适合用来作为对象的属性名，以避免属性名冲突的问题。

```javascript
let sym = Symbol();
let obj = {};

obj[sym] = "value";
console.log(obj[sym]); // 输出: value
```

此外，你还可以使用 `Object.defineProperty()` 或者直接在对象字面量中通过计算属性名的方式定义 symbol 属性。

```javascript
let sym = Symbol("description");
let obj = {
  [sym]: "another value",
};
console.log(obj[sym]); // 输出: another value
```

## 内置 Symbol

ES6 还引入了一些预定义的系统 symbol，它们代表了内部语言行为，可以被用于定制一些默认的操作。例如：

- `Symbol.iterator`：指定对象的默认迭代器。`for...of` 循环会使用这个方法。
- `Symbol.toPrimitive`：定义对象转换为原始类型的规则。
- `Symbol.toStringTag`：用于定制对象的 `toString()` 方法返回的结果。

例如，实现自定义对象的迭代功能：

```javascript
let iterable = {
  [Symbol.iterator]() {
    let step = 0;
    return {
      next() {
        if (step < 3) {
          return { value: step++, done: false };
        }
        return { value: undefined, done: true };
      },
    };
  },
};

for (let n of iterable) {
  console.log(n); // 输出: 0, 1, 2
}
```

## Symbol.for() 和 Symbol.keyFor()

- `Symbol.for()`：接受一个字符串参数，如果存在与该字符串匹配的全局 symbol，则返回它；否则创建一个新的全局 symbol 并将其注册到全局 symbol 注册表中。

  ```javascript
  let s1 = Symbol.for("shared");
  let s2 = Symbol.for("shared");
  console.log(s1 === s2); // 输出: true
  ```

- `Symbol.keyFor()`：检索给定 symbol 的键，该 symbol 必须是通过 `Symbol.for()` 创建的。

  ```javascript
  let sym = Symbol.for("findme");
  console.log(Symbol.keyFor(sym)); // 输出: findme
  ```

这些特性使得 `Symbol` 成为了 JavaScript 中处理唯一性以及定制对象行为的强大工具。
