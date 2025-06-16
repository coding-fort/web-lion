# `instanceof` 与 `in` 操作符

在 TypeScript 中，`instanceof` 和 `in` 是两种不同的操作符，它们用于不同的场景，但都可以作为类型保护的一部分来帮助缩小联合类型的范围。理解这两种操作符的区别及其使用场景对于编写安全且高效的 TypeScript 代码非常重要。

## `instanceof` 操作符（实例检查）

`instanceof` 操作符用于检查一个对象是否是某个构造函数（类）的实例。它通常用于确定对象是否属于特定的类或其子类。这在处理继承关系或需要区分不同类的对象时非常有用。

### 基本用法

```typescript
class Dog {
  bark() {
    console.log("Woof!");
  }
}

class Cat {
  meow() {
    console.log("Meow!");
  }
}

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark(); // TypeScript knows animal is Dog here
  } else {
    animal.meow(); // TypeScript knows animal is Cat here
  }
}
```

在这个例子中，`makeSound` 函数接受一个可能是 `Dog` 或 `Cat` 的参数。通过 `animal instanceof Dog` 的检查，TypeScript 编译器知道在这个分支中 `animal` 是 `Dog` 类型，因此可以安全地调用 `bark` 方法。同理，在 `else` 分支中，`animal` 被认为是 `Cat` 类型。

### 注意事项

- **原型链**：`instanceof` 检查基于对象的原型链。如果对象的原型链上包含指定的构造函数，则该检查返回 `true`。
- **跨上下文问题**：当使用 `instanceof` 检查来自不同执行上下文（如不同的框架或库）的对象时，可能会得到意外的结果。这是因为每个上下文都有自己的一套全局对象和内置构造函数。

## `in` 操作符（属性检查）

`in` 操作符用于检查对象是否具有某个属性。它可以作为类型保护的一部分，帮助缩小联合类型的范围。`in` 操作符不关心属性的值，只关心属性是否存在。

### 基本用法

```typescript
interface Bird {
  fly(): void;
}

interface Fish {
  swim(): void;
}

type Pet = Bird | Fish;

function move(pet: Pet) {
  if ("swim" in pet) {
    pet.swim(); // TypeScript knows pet is Fish here
  } else {
    pet.fly(); // TypeScript knows pet is Bird here
  }
}
```

在这个例子中，`move` 函数接受一个可能是 `Bird` 或 `Fish` 的参数。通过 `"swim" in pet` 的检查，TypeScript 编译器知道在这个分支中 `pet` 具有 `swim` 属性，因此可以安全地调用 `swim` 方法。同理，在 `else` 分支中，`pet` 被认为是 `Bird` 类型。

### 注意事项

- **属性存在性**：`in` 操作符只检查属性是否存在，而不考虑其值。即使属性的值是 `undefined` 或 `null`，只要属性名存在于对象上，`in` 检查就会返回 `true`。

- **符号属性**：`in` 操作符也可以用于检查 Symbol 类型的属性。

  ```typescript
  const id = Symbol("id");
  const obj = { [id]: "some value" };

  console.log(id in obj); // true
  ```

- **继承属性**：`in` 操作符还会检查对象原型链上的属性。

  ```typescript
  class Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
  }

  const animal = new Animal("Leo");

  console.log("name" in animal); // true, even though it's defined on the prototype
  ```

## `instanceof` 与 `in` 的对比

| 特性             | `instanceof`                               | `in`                         |
| ---------------- | ------------------------------------------ | ---------------------------- |
| **用途**         | 检查对象是否是某个类的实例                 | 检查对象是否具有某个属性     |
| **适用场景**     | 需要区分不同类的对象                       | 需要检查对象是否有特定属性   |
| **性能**         | 涉及原型链查找，可能较慢                   | 仅检查属性存在性，通常更快   |
| **跨上下文支持** | 可能有问题，因为每个上下文有自己的构造函数 | 不依赖于构造函数，因此更稳定 |
| **对继承的支持** | 支持，检查原型链上的构造函数               | 支持，检查原型链上的属性     |

## 总结

`instanceof` 和 `in` 操作符都是 TypeScript 中重要的类型保护工具，但它们适用于不同的场景：

- 使用 `instanceof` 来检查对象是否是某个类的实例，特别适合处理类和继承关系。
- 使用 `in` 来检查对象是否具有某个属性，适合用于联合类型中的属性存在性检查。

理解这些操作符的工作原理及其区别，可以帮助你在编写代码时做出更好的设计决策，确保类型安全的同时提高代码的可读性和维护性。
