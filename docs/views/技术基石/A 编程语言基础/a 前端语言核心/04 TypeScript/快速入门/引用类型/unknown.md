# unknown

`unknown` 类型是 TypeScript 中引入的一种更为安全的类型，旨在处理未知类型的值。它与 `any` 类型相似，都可以表示任意类型的值，但 `unknown` 提供了更严格的类型检查，从而提高了代码的安全性和可靠性。

## `unknown` 类型的特点

1. **严格性**：与 `any` 不同，`unknown` 类型不允许直接对变量执行任何操作，除非你先通过类型保护（type guards）来确定其具体类型。这意味着你不能访问 `unknown` 类型对象的属性或调用方法，直到你证明它是某种特定类型。

2. **赋值限制**：你可以将任何类型的值赋给 `unknown` 类型的变量，但是反过来则不行——你不能将 `unknown` 类型的值直接赋给其他类型的变量，除非经过适当的类型检查。

   ```typescript
   let value: unknown = "Hello, world";
   let str: string;

   // 错误：Type 'unknown' is not assignable to type 'string'.
   // str = value;

   if (typeof value === "string") {
     // 正确：在类型保护的作用范围内，value 被视为 string 类型。
     str = value;
   }
   ```

3. **类型保护**：为了安全地使用 `unknown` 类型的值，你需要使用类型保护来验证它的实际类型。常见的类型保护方法包括 `typeof`、`instanceof` 和自定义的类型谓词函数。

   ```typescript
   function isString(value: unknown): value is string {
     return typeof value === "string";
   }

   if (isString(value)) {
     console.log(value.toUpperCase()); // 安全的操作
   }
   ```

4. **与其他类型的关系**：

   - `unknown` 是所有类型的超集，即任何类型都可以赋值给 `unknown` 类型。
   - `unknown` 本身不是任何类型的子集，除了 `any` 和 `unknown` 自身。这意味着你不能将 `unknown` 类型的值直接赋给其他类型的变量，除非进行了类型保护。

5. **增强的安全性**：由于 `unknown` 类型强制要求在使用前进行类型检查，它有效地防止了许多潜在的运行时错误，并确保你的代码更加健壮和可预测。

## 使用场景

`unknown` 类型非常适合用于以下场景：

- **外部输入**：当你从不受信任的来源（如用户输入、网络请求等）接收数据时，使用 `unknown` 可以确保你在处理这些数据之前对其进行适当的验证。

  ```typescript
  function processInput(input: unknown) {
    if (typeof input === "string") {
      console.log("Received a string:", input);
    } else if (Array.isArray(input)) {
      console.log("Received an array:", input);
    } else {
      console.log("Received something else.");
    }
  }
  ```

- **第三方库接口**：如果你正在与没有类型定义的第三方库或 API 进行交互，`unknown` 可以帮助你在不失去类型安全的情况下处理返回的数据。

  ```typescript
  async function fetchData(): Promise<unknown> {
    const response = await fetch("https://api.example.com/data");
    return await response.json();
  }

  fetchData().then((data) => {
    if (isUserData(data)) {
      console.log("User data received:", data);
    }
  });
  ```

- **泛型函数**：在编写泛型函数时，如果参数的类型不确定，可以使用 `unknown` 来代替 `any`，以确保类型安全。

  ```typescript
  function identity<T extends unknown>(arg: T): T {
    return arg;
  }
  ```

## `unknown` vs `any`

| 特性           | `any`                  | `unknown`                      |
| -------------- | ---------------------- | ------------------------------ |
| 类型检查       | 无                     | 严格                           |
| 属性/方法访问  | 允许任意访问           | 需要类型保护后才能访问         |
| 赋值给其他类型 | 直接赋值               | 需要类型保护                   |
| 适用场景       | 快速开发、遗留代码迁移 | 外部输入、API 交互、泛型函数等 |
| 安全性         | 较低                   | 较高                           |

## 总结

`unknown` 类型是 TypeScript 提供的一个强大的工具，它允许你在处理未知类型的值时保持类型安全性。通过强制使用类型保护，`unknown` 确保了只有在明确知道类型的情况下才能对值进行操作，这有助于减少运行时错误并提高代码的质量。遵循最佳实践，尽量使用 `unknown` 替代 `any`，可以在享受灵活性的同时保持代码的安全性和可靠性。
