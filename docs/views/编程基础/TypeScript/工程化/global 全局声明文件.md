# global 全局声明文件

`global.d.ts` 文件用于在 TypeScript 项目中定义全局类型声明。它允许你为整个项目添加或扩展全局作用域中的类型，而不需要每次都导入这些类型。这对于定义全局变量、扩展现有库的接口（如 DOM 或 JavaScript 标准库）、或者为未提供类型声明的库创建声明特别有用。

## 使用场景

1. **扩展标准库**：你可以通过 `global.d.ts` 文件扩展现有的全局对象，比如 `Window`, `Document`, 或者内置的对象和函数。
2. **定义全局变量**：如果你的项目使用了一些全局变量（例如由脚本标签直接插入页面的第三方库），你可以在这里为它们添加类型声明。
3. **为无类型库添加声明**：如果某些库没有自带类型声明文件，你可以在这个文件中为它们创建声明。
4. **声明合并**：利用 TypeScript 的声明合并特性，可以在不破坏原有定义的情况下扩展现有类型的接口。

## 创建 `global.d.ts`

要创建一个 `global.d.ts` 文件，请遵循以下步骤：

1. 在你的项目根目录或 `src` 目录下创建一个新的文件，命名为 `global.d.ts`。
2. 确保你的 `tsconfig.json` 配置文件包含了这个文件，通常是通过 `include` 字段指定。

```json
{
  "include": ["src/**/*.ts", "global.d.ts"]
}
```

## 示例内容

### 扩展 Window 对象

假设你有一个全局变量 `myGlobalFunction` 被注入到浏览器环境中，可以通过如下方式在 `global.d.ts` 中为其添加类型声明：

```typescript
// global.d.ts

declare global {
  interface Window {
    myGlobalFunction: (param: string) => void;
  }
}

// 这样你就可以在任何地方使用 window.myGlobalFunction 而无需额外导入
```

### 定义全局变量

如果你想定义一个新的全局变量 `API_BASE_URL`，可以这样做：

```typescript
// global.d.ts

declare var API_BASE_URL: string;

// 现在你可以在项目的任何地方使用 API_BASE_URL
```

### 为未提供类型声明的库添加声明

如果你正在使用的某个库没有提供 `.d.ts` 文件，你可以直接在 `global.d.ts` 中为它创建类型声明：

```typescript
// global.d.ts

declare module "some-untyped-library" {
  export function someFunction(): void;
}
```

## 注意事项

- **避免过度使用**：尽量减少全局声明的数量，因为这可能会导致命名冲突，并且使得代码更难以理解和维护。
- **模块隔离**：尽可能将类型声明限制在模块内部，只在确实需要时才使用全局声明。
- **兼容性检查**：确保你添加的全局类型不会与现有类型发生冲突，尤其是在扩展标准库时。

## 结论

`global.d.ts` 是一种强大的工具，可以帮助你在 TypeScript 项目中管理全局类型。正确使用它可以提高代码的可读性和健壮性，但也要注意不要滥用，以免引入不必要的复杂性。
