# Null 与 Undefined

在 TypeScript 中，`null` 和 `undefined` 是两种特殊的值，它们各自有不同的含义和使用场景。TypeScript 提供了严格的类型检查机制，特别是在启用了 `strictNullChecks` 编译选项的情况下，这有助于开发者更好地处理这两种值，减少潜在的错误。

## 启用严格空值检查 (`strictNullChecks`)

当启用了 `strictNullChecks` 时，TypeScript 会将 `null` 和 `undefined` 视为独立的类型，并且不允许它们被隐式地赋给其他类型的变量，除非这些类型明确包含了 `null` 或 `undefined`。这有助于捕获更多潜在的运行时错误。

```json
{
  "compilerOptions": {
    "strictNullChecks": true
  }
}
```

## Null 类型

- **定义**：`null` 表示一个显式的空值或对象的空引用。
- **类型**：`null` 的类型是 `null`。

- **用途**：
  - 显式地将变量设置为空值。
  - 在 API 或函数返回值中表示“没有结果”。

```typescript
let user: { name: string } | null = null;
user = { name: "Alice" };
```

- **特点**：通常用于表示有意缺席的值，即你希望某个变量或属性明确地表示它没有值。

## Undefined 类型

- **定义**：`undefined` 表示变量已经被声明，但还没有被赋值；或者对象属性、数组元素等不存在时的默认值。

- **类型**：`undefined` 的类型是 `undefined`。

- **用途**：
  - 表示变量声明后未赋值的状态。
  - 表示函数参数未传递时的默认状态。
  - 表示对象属性或数组索引不存在时的默认值。

```typescript
let message: string | undefined;
console.log(message); // 输出: undefined

function greet(name?: string) {
  console.log("Hello, " + (name || "Guest"));
}
greet(); // 输出: Hello, Guest
```

- **特点**：通常用于表示未初始化或缺失的值，即变量已经存在但尚未赋予具体值。

## 主要区别

| 特性           | `null`                     | `undefined`                  |
| -------------- | -------------------------- | ---------------------------- |
| 定义           | 显式赋值，表示有意缺席的值 | 变量已声明但未赋值，默认状态 |
| 类型           | `null`                     | `undefined`                  |
| 用途           | 对象不存在或显式设置为空   | 变量未赋值或参数未传递       |
| 默认值         | 不是默认值                 | 是变量声明后的默认值         |
| 是否可显式赋值 | 可以显式赋值               | 通常不显式赋值               |

## 处理 `null` 和 `undefined`

1. **联合类型**：当变量可能包含 `null` 或 `undefined` 时，可以使用联合类型来明确指出这一点。

   ```typescript
   let optionalString: string | null | undefined;
   ```

2. **可选参数和属性**：对于函数参数或对象属性，你可以使用问号（`?`）来标记它们为可选的，这意味着它们可以是 `undefined`。

   ```typescript
   function logMessage(message?: string) {
     console.log(message || "No message provided");
   }

   interface User {
     name: string;
     age?: number; // 可选属性
   }
   ```

3. **非空断言操作符**：如果你确定某个值不是 `null` 或 `undefined`，可以使用非空断言操作符（`!`）来告诉编译器忽略这些可能性。

   ```typescript
   function processUser(user: User | null) {
     if (user) {
       console.log(user!.name); // 非空断言
     }
   }
   ```

4. **类型保护**：使用条件语句或自定义类型谓词来缩小变量的类型范围，确保安全地访问其属性或方法。

   ```typescript
   function printName(obj: { name?: string }) {
     if (obj.name !== undefined && obj.name !== null) {
       console.log(obj.name.toUpperCase());
     }
   }
   ```

5. **默认参数值**：为函数参数提供默认值，以避免 `undefined` 导致的问题。

   ```typescript
   function greet(name: string = "Guest") {
     console.log(`Hello, ${name}`);
   }
   ```

6. **解构赋值中的默认值**：当你从对象或数组解构时，可以为解构的变量提供默认值。

   ```typescript
   const { a = 10, b = 5 } = { a: 20 }; // a 将是 20，b 将是 5
   ```

## 最佳实践

- **明确意图**：尽量使用 `null` 来表示有意缺席的值，而使用 `undefined` 来表示变量尚未赋值或函数参数未传递的情况。这有助于提高代码的可读性和维护性。
- **启用严格模式**：在 `tsconfig.json` 中启用 `strictNullChecks` 选项，这样可以在编译时捕获更多潜在的问题，并确保你明确处理了 `null` 和 `undefined` 的情况。

- **避免隐式转换**：不要依赖 `null` 和 `undefined` 的隐式转换行为，例如在条件判断中直接使用它们。最好显式检查这些值，以避免意外的行为。

- **处理 API 返回值**：当从 API 获取数据时，考虑返回值可能是 `null` 或 `undefined`，并适当地处理这些情况，以避免运行时错误。

## 总结

`null` 和 `undefined` 在 TypeScript 中有着不同的语义和使用场景。理解它们的区别，并遵循最佳实践，可以帮助你编写更清晰、更安全的代码。
