# Reflect Metadata

`reflect-metadata` 是一个用于 TypeScript 和 JavaScript 的库，它提供了一种机制来定义和读取元数据（Metadata），这些元数据可以附加到类、方法、属性或参数上。通过使用 `reflect-metadata`，开发者可以在运行时访问这些元数据，从而实现更复杂的反射功能。这对于依赖注入（Dependency Injection）、ORM 框架、AOP（面向切面编程）等场景非常有用。

## 1. **安装**

要使用 `reflect-metadata`，首先需要通过 npm 安装：

```bash
npm install reflect-metadata
```

此外，还需要在 TypeScript 编译选项中启用 `experimentalDecorators` 和 `emitDecoratorMetadata`：

```json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 2. **基本概念**

- **元数据**：附加到目标对象上的任意键值对。
- **反射**：一种在运行时检查或“自省”程序结构的能力。
- **装饰器**：用于修改或增强类、方法、属性或参数的行为。

`reflect-metadata` 提供了几个静态方法来操作元数据：

- `Reflect.defineMetadata(key, metadata, target[, propertyKey])`：定义元数据。
- `Reflect.getMetadata(key, target[, propertyKey])`：获取元数据。
- `Reflect.hasMetadata(key, target[, propertyKey])`：检查是否存在特定的元数据。
- `Reflect.deleteMetadata(key, target[, propertyKey])`：删除元数据。
- `Reflect.getOwnMetadata(key, target[, propertyKey])`：获取自己的元数据（不包括继承的元数据）。
- `Reflect.getMetadataKeys(target[, propertyKey])`：获取所有元数据键。
- `Reflect.getOwnMetadataKeys(target[, propertyKey])`：获取自己的所有元数据键。

## 3. **示例解析**

### 示例 1: 基本元数据操作

```typescript
import "reflect-metadata";

class Example {
  @Reflect.metadata("description", "This is a sample method")
  sampleMethod() {}
}

const example = new Example();
console.log(
  Reflect.getMetadata("description", Example.prototype, "sampleMethod")
);
// 输出: This is a sample method
```

在这个例子中，我们使用 `@Reflect.metadata` 装饰器为 `sampleMethod` 方法添加了一个描述性元数据。然后，我们在实例化 `Example` 类后，使用 `Reflect.getMetadata` 方法读取该元数据。

### 示例 2: 参数元数据

```typescript
import "reflect-metadata";

function logParameter(
  target: any,
  propertyKey: string,
  parameterIndex: number
) {
  const existingParameters =
    Reflect.getMetadata("design:paramtypes", target, propertyKey) || [];
  console.log(
    `Parameter at index ${parameterIndex} of method ${propertyKey} is of type ${existingParameters[parameterIndex].name}`
  );
}

class Calculator {
  add(@logParameter a: number, @logParameter b: number): number {
    return a + b;
  }
}

const calculator = new Calculator();
calculator.add(1, 2);
// 输出:
// Parameter at index 0 of method add is of type Number
// Parameter at index 1 of method add is of type Number
```

在这个例子中，我们使用 `logParameter` 装饰器来记录每个参数的类型。`Reflect.getMetadata('design:paramtypes', target, propertyKey)` 可以用来获取方法参数的类型信息。

### 示例 3: 依赖注入

```typescript
import "reflect-metadata";

const DI_TOKENS = {
  Logger: "Logger",
};

function inject(token: string) {
  return function (target: any, propertyKey: string, parameterIndex: number) {
    const existingParams =
      Reflect.getMetadata("design:paramtypes", target, propertyKey) || [];
    const paramsWithTokens =
      Reflect.getMetadata("__param_tokens__", target, propertyKey) || {};
    paramsWithTokens[parameterIndex] = token;
    Reflect.defineMetadata(
      "__param_tokens__",
      paramsWithTokens,
      target,
      propertyKey
    );
  };
}

class Logger {
  log(message: string) {
    console.log(`Logging: ${message}`);
  }
}

class Service {
  constructor(@inject(DI_TOKENS.Logger) private logger: Logger) {}

  performOperation() {
    this.logger.log("Operation performed");
  }
}

// 模拟依赖注入容器
function resolveDependencies(target: any) {
  const constructor = target.constructor;
  const paramTokens =
    Reflect.getMetadata("__param_tokens__", constructor) || {};
  const resolvedParams = Object.keys(paramTokens).map((key) => {
    const token = paramTokens[key];
    switch (token) {
      case DI_TOKENS.Logger:
        return new Logger();
      // 其他依赖项...
      default:
        throw new Error(`Unknown dependency token: ${token}`);
    }
  });
  return new constructor(...resolvedParams);
}

const service = resolveDependencies(Service);
service.performOperation(); // 输出: Logging: Operation performed
```

在这个例子中，我们使用 `inject` 装饰器来标记构造函数参数，并通过 `resolveDependencies` 函数模拟依赖注入容器。`resolveDependencies` 函数根据存储的依赖项令牌创建适当的依赖项并传递给构造函数。

### 示例 4: 使用上下文参数（TypeScript 5.0+）

```typescript
import "reflect-metadata";

function logAccessor(
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor,
  context: ClassAccessorDecoratorContext
) {
  Reflect.defineMetadata("context", context, target, propertyKey);
  console.log(`Decorating accessor ${propertyKey} in class ${context.name}`);
}

class Example {
  private _value: string;

  @logAccessor
  get value() {
    return this._value;
  }

  @logAccessor
  set value(newValue: string) {
    this._value = newValue;
  }
}

const example = new Example();
console.log(Reflect.getMetadata("context", Example.prototype, "value"));
```

在这个例子中，`logAccessor` 装饰器接收 `target`、`propertyKey`、`descriptor` 和 `context` 参数。`context` 提供了关于装饰器调用上下文的额外信息，如类名和修饰符。我们还展示了如何将 `context` 存储为元数据并稍后检索它。

## 4. **注意事项**

- **编译选项**：确保在 `tsconfig.json` 中启用了 `experimentalDecorators` 和 `emitDecoratorMetadata`，以便正确生成元数据。
- **性能影响**：频繁地使用元数据可能会对性能产生一定影响，特别是在大型项目中。应谨慎使用，并考虑缓存机制。
- **浏览器支持**：某些旧版浏览器可能不完全支持 `reflect-metadata` 所需的功能。对于这些环境，可能需要使用 polyfills 或者进行兼容性处理。

## 5. **总结**

`reflect-metadata` 是 TypeScript 和 JavaScript 中非常有用的工具，允许你在运行时定义和访问元数据。这为依赖注入、AOP 等高级功能提供了基础。理解 `reflect-metadata` 的工作原理及其提供的 API，可以帮助你构建更加灵活和可扩展的应用程序。
