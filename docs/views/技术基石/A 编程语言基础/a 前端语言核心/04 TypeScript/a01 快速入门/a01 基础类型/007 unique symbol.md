# Unique Symbol

`unique symbol` 是 TypeScript 中的一种特殊符号类型，它确保每个 `unique symbol` 类型的值都是独一无二的，即使它们是通过相同的描述符创建的。这种特性使得 `unique symbol` 在需要绝对唯一性的地方非常有用，例如在定义接口或类型时作为属性键，以避免命名冲突。

## 定义和使用 Unique Symbol

在 TypeScript 中，`unique symbol` 不能直接通过 `Symbol()` 构造函数创建，而是通过类型系统中的 `symbol` 关键字来表示。`unique symbol` 主要用于类型声明中，以确保两个 `unique symbol` 类型的变量不会被视为相同，即使它们看起来具有相同的描述符。

```typescript
type MyUniqueSymbol = unique symbol;

const sym1: MyUniqueSymbol = Symbol("description");
const sym2: MyUniqueSymbol = Symbol("description");

// 即使描述符相同，sym1 和 sym2 仍然是不同的类型
```

需要注意的是，`unique symbol` 主要是 TypeScript 编译时的概念，在运行时 JavaScript 中所有 `symbol` 都是唯一的，因此 `unique symbol` 的独特性主要体现在静态类型检查上。

## 使用场景

`unique symbol` 最常见的用途之一是在定义接口或类型时，用作对象属性的键，以确保这些键是独一无二的，从而避免潜在的命名冲突。

```typescript
interface Resource {
  [id: unique symbol]: string;
}

const resourceId = Symbol("resourceId") as const;

const resource: Resource = {
  [resourceId]: "unique value",
};

// 试图使用不同的 symbol 作为同一个类型的键会导致编译错误
// const anotherResource: Resource = {
//     [Symbol("resourceId")]: "another value" // Error: Type 'symbol' is not assignable to type 'unique symbol'.
// };
```

## `unique symbol` 与普通 `symbol` 的区别

- **类型唯一性**：`unique symbol` 类型确保了两个 `unique symbol` 类型的变量不会被视为相同，而普通 `symbol` 类型则只保证值的唯一性。
- **编译时检查**：`unique symbol` 提供了更强的编译时类型安全，因为它们不仅基于值而且基于类型进行区分。

- **适用场景**：`unique symbol` 更适合用于类型定义和接口中，以确保属性键的唯一性和类型安全性；而普通 `symbol` 则广泛应用于对象属性键、枚举替代方案等场景。

## 示例：使用 `unique symbol` 定义接口

下面是一个更具体的例子，展示了如何使用 `unique symbol` 来定义一个接口，并确保其属性键是独一无二的。

```typescript
// 定义 unique symbol 类型
type MyUniqueSymbol = unique symbol;

// 创建 unique symbol 实例
const idKey = Symbol("id") as MyUniqueSymbol;
const nameKey = Symbol("name") as MyUniqueSymbol;

// 使用 unique symbol 作为接口属性键
interface User {
  [idKey]: number;
  [nameKey]: string;
}

// 创建符合接口的用户对象
const user: User = {
  [idKey]: 1,
  [nameKey]: "Alice",
};

// 尝试使用不同 symbol 作为同一个类型的键会导致编译错误
// const invalidUser: User = {
//     [Symbol("id")]: 2, // Error: Type 'symbol' is not assignable to type 'MyUniqueSymbol'.
//     [Symbol("name")]: "Bob" // Error: Type 'symbol' is not assignable to type 'MyUniqueSymbol'.
// };
```

在这个例子中，`idKey` 和 `nameKey` 是 `unique symbol` 类型的常量，它们被用作 `User` 接口的属性键。这确保了任何实现该接口的对象都必须使用这些特定的 `symbol` 作为键，从而避免了可能的命名冲突。

## 总结

`unique symbol` 是 TypeScript 提供的一个强大的工具，用于确保符号类型的绝对唯一性。它主要用于类型定义和接口中，以提供更高的类型安全性和避免命名冲突。理解 `unique symbol` 的工作原理及其适用场景，可以帮助你在编写代码时更加灵活和高效。
