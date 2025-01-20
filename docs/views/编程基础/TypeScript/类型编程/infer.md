# `infer` 关键字

`infer` 是 TypeScript 中用于类型推断的关键字，它主要用于条件类型中，允许你在类型表达式中提取或推断出子类型。通过使用 `infer`，你可以从复杂类型（如函数签名、联合类型等）中提取特定的类型信息。

## 1. **基本概念**

`infer` 关键字通常与条件类型一起使用，它的语法如下：

```typescript
type ConditionalType<T> = T extends U ? infer R : Y;
```

- `T` 是一个泛型参数。
- `U` 是一个用于比较的类型。
- `infer R` 表示从 `T` 中推断出的类型。
- `Y` 是基于条件的结果类型。

`infer` 的主要用途是从复杂的类型结构中提取子类型，并将其用作新的类型定义的一部分。

## 2. **示例解析**

### 示例 1: 提取函数返回值类型

```typescript
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type FuncReturn1 = GetReturnType<() => string>; // string
type FuncReturn2 = GetReturnType<(a: number) => boolean>; // boolean
type FuncReturn3 = GetReturnType<string>; // never
```

在这个例子中，`GetReturnType` 可以从函数签名中提取出返回值类型。如果传入的不是函数类型，则结果为 `never`。

### 示例 2: 提取 Promise 包裹的类型

```typescript
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;

type Result1 = UnwrapPromise<Promise<string>>; // string
type Result2 = UnwrapPromise<number>; // number
type Result3 = UnwrapPromise<Promise<string> | number>; // string | number
```

在这个例子中，`UnwrapPromise` 可以从 `Promise` 中提取出包裹的类型。如果传入的是联合类型，则条件类型被分配到每个成员，结果为 `string | number`。

### 示例 3: 提取数组元素类型

```typescript
type ElementType<T> = T extends (infer E)[] ? E : T;

type Element1 = ElementType<string[]>; // string
type Element2 = ElementType<number>; // number
type Element3 = ElementType<[string, number]>; // [string, number]
```

在这个例子中，`ElementType` 可以从数组类型中提取出元素类型。对于非数组类型，直接返回原类型。

### 示例 4: 复杂类型的推断

```typescript
type ExtractFirstArgument<T> = T extends (arg: infer A, ...args: any[]) => any
  ? A
  : never;

type FirstArg1 = ExtractFirstArgument<(arg: string, b: number) => void>; // string
type FirstArg2 = ExtractFirstArgument<(arg: number) => void>; // number
type FirstArg3 = ExtractFirstArgument<() => void>; // never
```

在这个例子中，`ExtractFirstArgument` 可以从函数签名中提取出第一个参数的类型。如果没有参数，则结果为 `never`。

## 3. **注意事项**

- **只能在条件类型中使用**：`infer` 只能在条件类型（即 `extends` 关键字后的条件分支）中使用，不能单独出现在其他地方。
- **推断多个类型**：你可以在同一个条件类型中使用多个 `infer` 关键字来推断多个类型。

  ```typescript
  type ExtractArguments<T> = T extends (arg1: infer A, arg2: infer B) => any
    ? [A, B]
    : never;

  type Args = ExtractArguments<(a: string, b: number) => void>; // [string, number]
  ```

- **阻止分配行为**：如果你不希望条件类型对联合类型进行分配，可以在条件类型的左侧使用括号来阻止分配行为。

  ```typescript
  type NotDistributive<T> = [T] extends [(infer U)[]] ? U : T;

  type Result = NotDistributive<string | string[]>; // string | string[]
  ```

- **复杂性管理**：虽然 `infer` 非常强大，但在实际开发中应尽量保持类型定义的简洁性和可读性，避免过度复杂的嵌套条件。

- **性能考虑**：复杂的条件类型可能会增加编译时间，对于大型项目应权衡其对编译时间和复杂度的影响。

- **类型安全**：确保推断逻辑不会破坏类型的安全性，特别是在处理联合类型和交叉类型时。

## 4. **总结**

`infer` 关键字是 TypeScript 中一种非常强大的工具，它使得你可以从复杂类型结构中提取特定的类型信息。通过合理使用 `infer` 和条件类型，你可以编写出更加灵活且类型安全的代码。
