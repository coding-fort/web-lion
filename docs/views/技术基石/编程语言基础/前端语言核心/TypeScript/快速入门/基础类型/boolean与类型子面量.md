# Boolean 类型与类型字面量（Type Literals）

在 TypeScript 中，`boolean` 类型表示逻辑值 `true` 和 `false`。而类型字面量（type literals）允许你定义特定的、有限集合的值作为类型。虽然 `boolean` 是一个内置的基本类型，但你可以通过类型字面量来创建更具体的布尔相关的类型。

## Boolean 类型

`boolean` 类型是最基本的逻辑类型之一，用于表示真 (`true`) 或假 (`false`) 的值。它广泛应用于条件判断和逻辑运算中。

```typescript
let isActive: boolean = true;
let isDisabled: boolean = false;
```

## 布尔类型的字面量类型

TypeScript 允许你使用布尔字面量 `true` 和 `false` 作为类型。这可以用来创建更严格的类型约束，确保变量只能持有特定的布尔值。

```typescript
let flag: true = true; // 只能是 true
let active: false = false; // 只能是 false
```

这种做法通常不常见，因为大多数情况下我们希望 `boolean` 类型的变量能够接受 `true` 或 `false` 两个值。但是，在某些场景下，使用布尔字面量类型可以帮助表达更加明确的意图或实现更严格的类型检查。

## 联合类型中的布尔字面量

你可以将布尔字面量与其他类型组合成联合类型，以创建更复杂的类型定义。例如，你可以定义一个函数参数，它既可以是字符串 `"on"` 或 `"off"`，也可以是布尔值 `true` 或 `false`。

```typescript
function toggleState(state: "on" | "off" | true | false) {
  if (state === true || state === "on") {
    console.log("Turning on");
  } else {
    console.log("Turning off");
  }
}

toggleState(true); // OK
toggleState("on"); // OK
toggleState(false); // OK
toggleState("off"); // OK
toggleState("unknown"); // Error: Argument of type '"unknown"' is not assignable to parameter of type '"on" | "off" | boolean'.
```

## 使用布尔字面量增强类型安全性

当你需要非常明确地指定某个值必须为 `true` 或 `false` 时，布尔字面量类型可以提供额外的安全性和清晰度。例如，在配置对象中，你可能希望某些标志位只能设置为 `true` 或 `false`，而不是任意的布尔表达式结果。

```typescript
interface Config {
  debugMode: true | false;
  logLevel: "info" | "warn" | "error";
}

const config: Config = {
  debugMode: true, // OK
  logLevel: "info",
};

config.debugMode = Math.random() > 0.5; // Error: Type 'boolean' is not assignable to type 'false | true'.
```

在这个例子中，`debugMode` 字段被限制为只能是 `true` 或 `false`，而不是任意的布尔表达式。这有助于防止意外地将复杂的布尔逻辑赋值给配置项，从而提高了代码的安全性和可预测性。

## 总结

- **`boolean` 类型**：表示逻辑值 `true` 和 `false`。
- **布尔字面量类型**：可以是 `true` 或 `false`，用于创建更严格的类型约束。
- **联合类型中的布尔字面量**：可以与其他类型组合，创建更灵活且安全的类型定义。
- **增强类型安全性**：通过限制字段只能取特定的布尔值，提高代码的健壮性和可维护性。

通过合理使用布尔字面量类型，你可以编写出更安全、更具表达力的 TypeScript 代码。
