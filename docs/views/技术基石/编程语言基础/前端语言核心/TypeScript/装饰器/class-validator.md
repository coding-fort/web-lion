# class-validator

`class-validator` 是一个用于 TypeScript 和 JavaScript 的库，它提供了一组工具来验证对象的属性是否符合预定义的规则。这个库可以与 `class-transformer` 结合使用，以便在将普通对象转换为类实例时自动进行验证。这对于确保 API 请求、表单提交等数据的有效性非常有用。

## 1. **安装**

要使用 `class-validator`，首先需要通过 npm 安装：

```bash
npm install class-validator class-transformer
```

`class-transformer` 虽然不是必须的，但通常与 `class-validator` 一起使用以实现对象转换和验证的功能。

## 2. **基本概念**

- **装饰器**：用于定义验证规则。
- **验证函数**：如 `validate`，用于执行验证并返回结果。
- **自定义验证器**：允许你创建自己的验证逻辑。
- **分组验证**：可以在不同的场景下应用不同的验证规则。

## 3. **主要功能**

### 3.1. 使用内置验证器

`class-validator` 提供了大量的内置验证器，可以直接通过装饰器应用于类属性上。

### 3.2. 自定义验证逻辑

可以通过创建自定义验证器或使用 `@Validate` 装饰器来自定义验证逻辑。

### 3.3. 分组验证

可以为不同场景（如创建、更新）定义不同的验证规则。

### 3.4. 异步验证

支持异步验证，对于依赖外部资源（如数据库查询）的验证非常有用。

## 4. **示例解析**

### 示例 1: 基本验证

```typescript
import { plainToClass } from "class-transformer";
import { IsEmail, Length, validateOrReject } from "class-validator";

class User {
  @IsEmail()
  email: string;

  @Length(6, 20)
  password: string;
}

async function main() {
  const userPlain = { email: "john.doe@example.com", password: "password" };
  const user = plainToClass(User, userPlain);

  try {
    await validateOrReject(user);
    console.log("User is valid");
  } catch (errors) {
    console.log("Validation failed:", errors);
  }
}

main();
```

在这个例子中，我们定义了一个 `User` 类，并为其属性添加了验证规则。然后我们创建了一个普通的用户对象，并使用 `plainToClass` 将其转换为 `User` 类实例。最后，我们使用 `validateOrReject` 对用户实例进行了验证。

### 示例 2: 自定义验证器

```typescript
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "isStrongPassword", async: false })
class StrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string, args: ValidationArguments) {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(
      password
    ); // 包含数字、大小写字母和特殊字符，长度至少8个字符
  }

  defaultMessage(args: ValidationArguments) {
    return "Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character, with a minimum length of 8 characters.";
  }
}

class User {
  @IsEmail()
  email: string;

  @StrongPasswordConstraint()
  password: string;
}

async function main() {
  const userPlain = { email: "john.doe@example.com", password: "WeakPass" };
  const user = plainToClass(User, userPlain);

  try {
    await validateOrReject(user);
    console.log("User is valid");
  } catch (errors) {
    console.log("Validation failed:", errors);
  }
}

main();
```

在这个例子中，我们创建了一个名为 `StrongPasswordConstraint` 的自定义验证器，并将其应用于 `User` 类的 `password` 属性。这确保了密码遵循特定的复杂度要求。

### 示例 3: 分组验证

```typescript
import { plainToClass, Exclude } from "class-transformer";
import { IsEmail, Length, ValidateIf, Groups } from "class-validator";

class User {
  @IsEmail({ groups: ["create"] })
  email: string;

  @Length(6, 20, { groups: ["create", "update"] })
  password: string;

  @Exclude()
  @ValidateIf((object, value) => value !== undefined, { groups: ["update"] })
  oldPassword?: string;
}

async function main() {
  const userCreatePlain = {
    email: "john.doe@example.com",
    password: "password",
  };
  const userUpdatePlain = {
    id: 1,
    password: "newpassword",
    oldPassword: "oldpassword",
  };

  const userCreate = plainToClass(User, userCreatePlain);
  const userUpdate = plainToClass(User, userUpdatePlain);

  try {
    await validateOrReject(userCreate, { groups: ["create"] });
    console.log("User creation data is valid");

    await validateOrReject(userUpdate, { groups: ["update"] });
    console.log("User update data is valid");
  } catch (errors) {
    console.log("Validation failed:", errors);
  }
}

main();
```

在这个例子中，我们使用了 `groups` 参数来指定不同的验证规则集。这样可以根据不同的操作（如创建用户或更新用户信息）应用适当的验证规则。

### 示例 4: 异步验证

```typescript
import { plainToClass } from "class-transformer";
import { IsEmail, ValidatePromise, validateOrReject } from "class-validator";

class User {
  @IsEmail()
  email: string;

  @ValidatePromise(async (value: string) => {
    // 模拟异步数据库检查
    return new Promise((resolve, reject) =>
      setTimeout(
        () => (value === "unique@example.com" ? resolve(true) : reject()),
        1000
      )
    );
  })
  uniqueEmail: string;
}

async function main() {
  const userPlain = {
    email: "john.doe@example.com",
    uniqueEmail: "not.unique@example.com",
  };
  const user = plainToClass(User, userPlain);

  try {
    await validateOrReject(user);
    console.log("User is valid");
  } catch (errors) {
    console.log("Validation failed:", errors);
  }
}

main();
```

在这个例子中，我们展示了如何使用 `@ValidatePromise` 进行异步验证。这里模拟了一个异步数据库检查来验证电子邮件地址的唯一性。

## 5. **注意事项**

- **性能影响**：频繁地进行验证可能会对性能产生一定影响，特别是在大型项目中。应谨慎使用，并考虑缓存机制。
- **类型安全**：虽然 `class-validator` 提供了强大的验证功能，但在某些情况下可能无法完全保证类型安全。确保测试你的代码以捕捉潜在的问题。
- **兼容性**：`class-validator` 应该与大多数现代 JavaScript 环境兼容，但对于一些旧版浏览器或环境，可能需要额外的 polyfills 或者进行兼容性处理。

## 6. **总结**

`class-validator` 是一个强大且灵活的库，能够简化对象属性的验证过程。它提供了多种内置验证器、自定义验证逻辑的支持以及分组验证和异步验证等功能，使得你可以精确控制验证行为，从而更好地管理应用程序的数据完整性。
