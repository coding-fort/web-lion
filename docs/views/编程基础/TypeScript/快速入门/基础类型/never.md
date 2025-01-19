# Never 类型

`never` 类型是 TypeScript 中的一个特殊类型，表示那些永不存在的值的类型。它通常用于表示永远不可能发生的情况，例如永远不会返回的函数（因为总是抛出异常或进入无限循环）或者排除了所有可能情况后的条件语句。

## 使用场景

1. **不会返回的函数**：如果一个函数总是抛出异常或进入无限循环而永远不会正常结束，它的返回类型可以是 `never`。

   ```typescript
   function throwError(message: string): never {
     throw new Error(message);
   }
   function fn() {
     throwError(); // 由于返回值为never，所以函数不会停止，导致后续代码不会执行
     let str = "hello"; // 提示警告：检测到无法访问的代码。
   }

   // 同样效果
   function infiniteLoop(): never {
     while (true) {}
   }
   ```

2. **排除所有情况后的条件语句**：在使用类型保护和控制流分析时，`never` 类型可以帮助确保你已经处理了所有可能的情况。

   ```typescript
   function example(value: string | number) {
     if (typeof value === "string") {
       // 处理字符串的情况
     } else if (typeof value === "number") {
       // 处理数字的情况
     } else {
       // 这里的 value 类型为 never，因为已经涵盖了所有可能的情况
       // 如果后面value 添加了其他类型，这里会报错，不能将类型“boolean”分配给类型“never”。
       let _neverCheck: never = value;
       throw new TypeError("Invalid value type");
     }
   }
   ```

3. **泛型中的约束**：你可以使用 `never` 来确保某些类型的参数永远不会被传递给泛型函数。

   ```typescript
   function fail<T extends never>(x: T): void {
     // 由于 T 是 never，这个函数实际上不能被调用
   }
   ```

## `never` 与其它类型的区别

- **`void`**：`void` 表示没有返回值，而 `never` 表示永远不会返回。

  - 函数声明为 `void` 表明它不返回任何有意义的值，但仍然会结束执行。
  - 函数声明为 `never` 表明它永远不会结束正常执行，因此也不会返回任何值。

- **`undefined` 和 `null`**：这些是具体的值，而 `never` 表示没有任何可能的值。

- **`any`**：`any` 可以表示任何类型的值，而 `never` 则相反，它表示没有值。

## 特性

- **子类型**：`never` 是所有类型的子类型，这意味着它可以赋值给任何其他类型，但是没有任何实际的值可以赋给 `never` 类型的变量。

- **类型保护**：当 TypeScript 的控制流分析确定某个分支无法到达时，它会将该分支的类型推断为 `never`。

- **严格模式下的好处**：在启用了 `strictNullChecks` 编译选项的情况下，`never` 类型特别有用，因为它可以帮助捕捉那些理论上不应该发生的代码路径。

## 示例

```typescript
// 不会返回的函数
function error(message: string): never {
  throw new Error(message);
}

// 排除所有情况后的条件语句
function processValue(x: string | number) {
  if (typeof x === "string") {
    console.log("It's a string!");
  } else if (typeof x === "number") {
    console.log("It's a number!");
  } else {
    // 此处 x 的类型会被推断为 never
    x; // Type 'never' has no properties in common with type '{}'.
  }
}

// 泛型中的约束
function rejectAll<T extends never>(arg: T): void {
  // 因为 T 是 never，所以这个函数实际上不能被调用
}
```

## 总结

`never` 类型是 TypeScript 提供的一种强大工具，用于表达那些理论上不应该发生的情况。它不仅有助于提高代码的安全性和可读性，还可以帮助开发者发现潜在的逻辑错误。理解 `never` 的工作原理及其应用场景，可以使你的 TypeScript 代码更加健壮和清晰。
