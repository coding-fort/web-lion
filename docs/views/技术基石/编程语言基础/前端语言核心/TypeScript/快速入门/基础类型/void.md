# Void 类型

`void` 类型在 TypeScript 中表示没有任何类型的值。它主要用于两个场景：函数的返回类型和声明一个没有初始值的变量（尽管这种用法较少见）。理解 `void` 的工作原理及其使用场景，可以帮助你编写更清晰和安全的代码。

## 函数的返回类型

当你定义一个不返回任何值的函数时，你可以将它的返回类型指定为 `void`。这表明该函数执行某些操作但不会返回任何有意义的结果。

```typescript
function logMessage(message: string): void {
  console.log(message);
}

logMessage("Hello, world!"); // 这个函数不会返回任何值
```

## 变量声明

虽然可以将 `void` 用于变量声明，但实际上这样做并不常见，因为这意味着这个变量不能持有任何实际的值，除了 `undefined`（在非严格模式下）或 `null`（如果启用了 `--strictNullChecks` 编译选项）。

```typescript
let unusable: void;
unusable = undefined; // 在非严格模式下允许
// unusable = null; // 如果启用了 --strictNullChecks，则不允许
```

## `void` 与 `undefined`

- **`void`**：通常用于函数返回类型，表示函数不返回任何值。
- **`undefined`**：表示变量已被声明但未赋值的状态，或者函数参数未传递的情况。

在某些情况下，`void` 和 `undefined` 可能看起来相似，但在语义上它们是不同的：

- `void` 表示“无”，即没有值。
- `undefined` 是 JavaScript 中的一个具体值，表示变量已声明但未赋值。

```ts
// 不会报错，因为undefined 是void 的子类
function fn(): void {
  return undefined;
}
// 会报错，不能将null 赋值给void
function fn(): void {
  return null;
}
```

## 空语句

`void` 关键字还可以作为运算符使用，后面接一个表达式，返回 `undefined` 并且强制表达式求值后忽略其结果。这种方式常用于立即执行函数表达式 (IIFE) 或确保某些副作用不会影响程序流。

```javascript
(void function () {
  console.log("This is an IIFE");
})();
```

## `never` vs `void`

TypeScript 中还有另一个类型 `never`，它与 `void` 类似但不同：

- **`void`**：表示函数没有返回值，或者变量没有持有任何实际的值。
- **`never`**：表示永远不会发生的情况，例如抛出异常的函数或无限循环的函数。

```typescript
function throwError(message: string): never {
  throw new Error(message);
}

function infiniteLoop(): never {
  while (true) {}
}
```

## 最佳实践

1. **使用 `void` 作为函数返回类型**：当函数不返回任何值时，显式地将其返回类型声明为 `void`，以提高代码的可读性和意图表达。

2. **避免将 `void` 用于变量声明**：除非有特殊需求，否则尽量不要将 `void` 用于变量声明，因为它几乎不允许变量持有任何实际的值。

3. **理解 `void` 和 `undefined` 的区别**：明确区分 `void` 和 `undefined` 的使用场景，以确保代码逻辑正确。

4. **考虑使用 `never`**：如果你有一个函数永远不会正常结束（如总是抛出异常），考虑使用 `never` 类型来更准确地描述这种情况。

## 总结

`void` 类型是 TypeScript 中用于表示“无”的一种方式，最常见于函数返回类型，表明函数不返回任何值。理解 `void` 的用途及其与其他类型的区别，可以帮助你在编写代码时更加精确地表达意图，并提高代码的质量。
