# `keyof` 操作符

`keyof` 是 TypeScript 中的一个非常有用的操作符，它允许你从一个类型中提取出所有键（属性名）的联合类型。这个操作符在创建健壮和灵活的类型系统时特别有用，尤其是在处理对象字面量、映射类型以及类型查询时。

## 基本用法

`keyof` 操作符可以用来获取类型的键，并返回这些键作为联合类型。例如：

```typescript
interface Person {
  name: string;
  age: number;
  address: string;
}

type PersonKeys = keyof Person; // "name" | "age" | "address"
```

在这个例子中，`keyof Person` 返回了一个由 `Person` 接口的所有键组成的联合类型 `"name" | "age" | "address"`。

## 使用场景

### 1. **确保键存在于对象中**

当你需要确保某个键是对象的一部分时，`keyof` 可以帮助你创建一个类型保护或进行类型检查。

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
// K extends keyof T 表示泛型参数 K 必须是 keyof T 联合类型中的一个成员。
const person = { name: "Alice", age: 25 };

console.log(getProperty(person, "name")); // OK, returns "Alice"
console.log(getProperty(person, "unknown")); // Error, "unknown" is not a valid key of person
```

在这个例子中，`getProperty` 函数接受一个对象和一个键，并返回该键对应的值。使用 `keyof` 确保了传入的键确实是对象的一部分。

### 2. **映射类型**

`keyof` 经常与映射类型一起使用，以创建新的类型，其中新类型的键基于现有类型的键。

```typescript
type PartialPerson = {
  [P in keyof Person]?: Person[P];
};

const partialPerson: PartialPerson = {
  name: "Bob",
  // age and address are optional here
};
```

在这个例子中，`PartialPerson` 类型中的所有键都是可选的，因为它们是从 `Person` 接口中提取出来的，并且被标记为可选（通过 `?`）。

### 3. **类型推断和泛型**

`keyof` 可以与泛型结合使用，以便根据传入的对象动态地确定键的类型。

```typescript
function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result: Pick<T, K> = {} as Pick<T, K>;
  keys.forEach((key) => {
    result[key] = obj[key];
  });
  return result;
}

const picked = pick(person, ["name", "age"]); // { name: string, age: number }
```

在这个例子中，`pick` 函数接受一个对象和一个键数组，并返回一个新的对象，其中只包含指定的键及其对应的值。`keyof` 和泛型一起工作，确保了键的类型安全。

### 4. **索引签名**

你可以使用 `keyof` 来定义具有特定键类型的索引签名。

```typescript
type StringIndexedObject = {
  [key in keyof any]: string;
};

const stringObj: StringIndexedObject = {
  prop1: "value1",
  prop2: "value2",
};
```

虽然这个例子有些特殊，但它展示了如何使用 `keyof` 来创建索引签名。

## 注意事项

- **联合类型的键**：当使用 `keyof` 在联合类型上时，结果将是所有类型的键的交集。这意味着只有共同的键会被包括进来。

  ```typescript
  type A = { a: string; common: boolean };
  type B = { b: number; common: boolean };

  type CommonKeys = keyof (A & B); // "common"
  ```

- **内置类型的键**：对于原始类型如 `string`、`number` 等，`keyof` 将返回它们的属性和方法名。

  ```typescript
  type StringKeys = keyof string; // "charAt" | "charCodeAt" | ...
  ```

## 总结

`keyof` 是 TypeScript 中一个强大且灵活的操作符，它使得开发者能够更方便地操作和查询类型系统的键。无论是用于类型保护、映射类型还是与其他高级类型特性结合使用，`keyof` 都是一个不可或缺的工具。
