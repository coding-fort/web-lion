# class-transformer

`class-transformer` 是一个用于 TypeScript 和 JavaScript 的库，它提供了一组工具来将普通的 JavaScript 对象（通常称为 POJO 或 Plain Old JavaScript Object）转换为类实例，反之亦然。这对于序列化和反序列化对象、处理 API 响应或请求数据等场景非常有用。

## 1. **安装**

要使用 `class-transformer`，首先需要通过 npm 安装：

```bash
npm install class-transformer
```

## 2. **基本概念**

- **PlainToClass**：将普通对象转换为类实例。
- **ClassToPlain**：将类实例转换为普通对象。
- **Exclude** 和 **Expose**：用于控制哪些属性应该被序列化或反序列化。
- **Transform**：用于在转换过程中自定义属性的处理方式。

## 3. **主要功能**

### 3.1. 将普通对象转换为类实例

使用 `plainToClass` 方法可以将普通对象转换为类实例。这在从 API 获取数据并希望将其映射到 TypeScript 类时非常有用。

### 3.2. 将类实例转换为普通对象

使用 `classToPlain` 方法可以将类实例转换回普通对象。这在准备发送数据给 API 或存储时很有用。

### 3.3. 控制属性的序列化/反序列化

- 使用 `@Exclude()` 装饰器标记你不希望包含在序列化结果中的属性。
- 使用 `@Expose()` 装饰器显式指定你希望包含的属性。
- 使用 `@Transform()` 装饰器来自定义属性的转换逻辑。

## 4. **示例解析**

### 示例 1: 基本转换

```typescript
import { plainToClass, classToPlain } from "class-transformer";

class User {
  id: number;
  name: string;
  show(): void {
    return `User ${this.id} is ${this.name}`;
  }
}

const userPlain = { id: 1, name: "John Doe" };
const userInstance = plainToClass(User, userPlain);

console.log(userInstance); // 输出: User { id: 1, name: 'John Doe' }

const userPlainAgain = classToPlain(userInstance);
console.log(userPlainAgain); // 输出: { id: 1, name: 'John Doe' }
console.log(userInstance.show()); // 输出: User 1 is John Doe
```

在这个例子中，我们展示了如何使用 `plainToClass` 和 `classToPlain` 进行基本的对象和类实例之间的转换。

### 示例 2: 排除和暴露属性

```typescript
import { plainToClass, classToPlain, Exclude, Expose } from "class-transformer";

class User {
  @Expose()
  id: number;

  @Exclude()
  password: string;

  @Expose({ name: "username" })
  name: string;

  constructor(id: number, password: string, name: string) {
    this.id = id;
    this.password = password;
    this.name = name;
  }
}

const userPlain = { id: 1, password: "secret", name: "John Doe" };
const userInstance = plainToClass(User, userPlain, {
  excludeExtraneousValues: true,
});

console.log(userInstance); // 输出: User { id: 1, password: 'secret', name: 'John Doe' }

const userPlainAgain = classToPlain(userInstance);
console.log(userPlainAgain); // 输出: { id: 1, username: 'John Doe' }
```

在这个例子中，我们使用了 `@Exclude` 和 `@Expose` 装饰器来控制哪些属性应该被包含在最终的序列化结果中。`excludeExtraneousValues` 选项确保未定义的属性不会出现在结果对象中。

### 示例 3: 自定义转换逻辑

```typescript
import { plainToClass, classToPlain, Transform } from "class-transformer";

class Product {
  @Transform(({ value }) => value * 0.8)
  price: number;

  @Transform(({ value }) => new Date(value))
  createdAt: Date;

  constructor(price: number, createdAt: string) {
    this.price = price;
    this.createdAt = createdAt;
  }
}

const productPlain = { price: 100, createdAt: "2023-01-01" };
const productInstance = plainToClass(Product, productPlain);

console.log(productInstance); // 输出: Product { price: 80, createdAt: 2023-01-01T00:00:00.000Z }

const productPlainAgain = classToPlain(productInstance);
console.log(productPlainAgain); // 输出: { price: 80, createdAt: '2023-01-01T00:00:00.000Z' }
```

在这个例子中，我们使用了 `@Transform` 装饰器来自定义 `price` 和 `createdAt` 属性的转换逻辑。对于 `price`，我们将值减少了 20%；对于 `createdAt`，我们将字符串转换为了 `Date` 对象。

### 示例 4: 组合多个装饰器

```typescript
import {
  plainToClass,
  classToPlain,
  Type,
  Transform,
  Expose,
} from "class-transformer";

class Address {
  street: string;
  city: string;
}

class User {
  id: number;

  @Expose({ name: "full_name" })
  fullName: string;

  @Type(() => Address)
  address: Address;

  @Transform(({ value }) => (value ? value.toUpperCase() : null))
  preferredLanguage: string | null;

  constructor(
    id: number,
    fullName: string,
    address: Address,
    preferredLanguage: string | null
  ) {
    this.id = id;
    this.fullName = fullName;
    this.address = address;
    this.preferredLanguage = preferredLanguage;
  }
}

const userPlain = {
  id: 1,
  full_name: "John Doe",
  address: { street: "123 Main St", city: "Anytown" },
  preferred_language: "en",
};

const userInstance = plainToClass(User, userPlain, {
  excludeExtraneousValues: true,
});
console.log(userInstance); // 输出:
// User {
//   id: 1,
//   fullName: 'John Doe',
//   address: Address { street: '123 Main St', city: 'Anytown' },
//   preferredLanguage: 'EN'
// }

const userPlainAgain = classToPlain(userInstance);
console.log(userPlainAgain); // 输出:
// { id: 1, full_name: 'John Doe', address: { street: '123 Main St', city: 'Anytown' }, preferred_language: 'EN' }
```

在这个例子中，我们展示了如何组合使用多个装饰器来实现复杂的转换逻辑。`@Type` 装饰器指定了嵌套对象的类型，而 `@Transform` 装饰器则对 `preferredLanguage` 属性进行了大小写转换。

## 5. **注意事项**

- **性能影响**：频繁地进行对象和类实例之间的转换可能会对性能产生一定影响，特别是在大型项目中。应谨慎使用，并考虑缓存机制。
- **类型安全**：虽然 `class-transformer` 提供了强大的转换功能，但在某些情况下可能无法完全保证类型安全。确保测试你的代码以捕捉潜在的问题。
- **兼容性**：`class-transformer` 应该与大多数现代 JavaScript 环境兼容，但对于一些旧版浏览器或环境，可能需要额外的 polyfills 或者进行兼容性处理。

## 6. **总结**

`class-transformer` 是一个强大且灵活的库，能够简化对象和类实例之间的转换过程。它提供了多种装饰器和配置选项，使得你可以精确控制转换行为，从而更好地管理应用程序的数据流。
