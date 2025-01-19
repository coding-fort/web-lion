# `typeof` 操作符详解

在 TypeScript 和 JavaScript 中，`typeof` 操作符有两种不同的用法：一种是在运行时用于检查值的类型，另一种是在编译时用于获取类型的类型。理解这两种用法的区别和它们的具体应用场景非常重要。

## 1. **运行时的 `typeof`**

这是 JavaScript 中传统的 `typeof` 操作符，它用于在运行时确定一个值的类型，并返回一个表示该类型的字符串。它可以识别以下几种基本类型：

- `"number"`
- `"string"`
- `"boolean"`
- `"object"`（包括对象、数组、null）
- `"function"`
- `"undefined"`
- `"symbol"`（ES6 引入）
- `"bigint"`（ES2020 引入）

### 示例

```javascript
console.log(typeof 42); // "number"
console.log(typeof "hello"); // "string"
console.log(typeof true); // "boolean"
console.log(typeof {}); // "object"
console.log(typeof null); // "object" (这是一个历史遗留问题)
console.log(typeof function () {}); // "function"
console.log(typeof undefined); // "undefined"
console.log(typeof Symbol()); // "symbol"
console.log(typeof 123n); // "bigint"
```

## 2. **编译时的 `typeof`**

在 TypeScript 中，`typeof` 操作符也可以用于在编译时获取变量或属性的类型，而不需要实际的值。这种用法可以帮助你创建更精确的类型定义，特别是在处理复杂对象或函数时非常有用。

### 获取变量的类型

你可以使用 `typeof` 来获取一个已声明变量的类型：

```typescript
const message = "Hello, world!";
type MessageType = typeof message; // string
```

在这个例子中，`MessageType` 的类型是 `string`，因为它基于 `message` 变量的类型推断而来。

### 获取对象属性的类型

你还可以使用 `typeof` 结合索引访问类型来获取对象属性的类型：

```typescript
const config = {
  host: "localhost",
  port: 8080,
  debug: true,
};

type HostType = (typeof config)["host"]; // string
type PortType = (typeof config)["port"]; // number
type DebugType = (typeof config)["debug"]; // boolean
```

在这个例子中，`HostType`、`PortType` 和 `DebugType` 分别是 `string`、`number` 和 `boolean` 类型。

### 获取函数的参数或返回值类型

`typeof` 还可以用于获取函数的参数或返回值类型：

```typescript
function add(a: number, b: number): number {
  return a + b;
}

type AddFunction = typeof add; // (a: number, b: number) => number
type AddParameters = Parameters<typeof add>; // [number, number]
type AddReturnType = ReturnType<typeof add>; // number
```

在这个例子中：

- `AddFunction` 是 `add` 函数的完整类型。
- `AddParameters` 是 `add` 函数的参数类型，以元组形式表示。
- `AddReturnType` 是 `add` 函数的返回值类型。

## 应用场景

`typeof` 在编译时的用法特别适用于以下场景：

- **提取现有类型的子类型**：当你有一个复杂的对象或接口，并希望从中提取特定部分的类型时，`typeof` 非常有用。
- **创建工具类型**：结合 `typeof` 和其他高级类型操作（如映射类型、条件类型等），可以创建强大的工具类型来简化代码。

- **增强类型安全性**：通过使用 `typeof` 确保新创建的类型与现有结构保持一致，从而提高代码的安全性和可维护性。

## 注意事项

虽然 `typeof` 是一个非常有用的工具，但在某些情况下需要注意其行为：

- **`typeof null` 返回 `"object"`**：这是一个历史遗留问题，JavaScript 的设计者承认这是一个错误，但为了向后兼容，这个行为一直保留了下来。
- **`typeof` 对未初始化的变量**：如果变量尚未初始化，`typeof` 将返回 `"undefined"`。

- **`typeof` 对函数**：在 ES5 环境下，所有函数的 `typeof` 都会返回 `"function"`，即使它们实际上是箭头函数或类方法。

## 总结

`typeof` 操作符在 TypeScript 和 JavaScript 中有着重要的作用，既可以在运行时用于检查值的类型，又可以在编译时用于获取类型的类型。理解这两种用法及其具体应用场景，可以帮助你编写更加安全和灵活的代码。
