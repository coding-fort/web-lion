# TS 模块解析策略

```ts
import moduleA from "./moduleA";

// 依次查找
// ./moduleA.ts
// ./moduleA.tsx
// ./moduleA.d.ts
// package.json 中的 "typings" 或 "types" 字段
// ./moduleA/index.ts
// ./moduleA/index.tsx
// ./moduleA/index.d.ts
// ./moduleA/package.json 中的 "typings" 或 "types" 字段
// ./moduleA.js
// ./moduleA.jsx
// ./moduleA/index.js
// ./moduleA/index.jsx
// ./moduleA.json
// ./moduleA/index.json
// ./moduleA.node.js
// ./moduleA/index.node.js
// ./moduleA.node
// ./moduleA/index.node
// ./moduleA.mjs
// ./moduleA/index.mjs
```

TypeScript 的模块解析策略决定了编译器如何定位和加载被导入的模块。TypeScript 支持两种主要的模块解析策略：`Node` 和 `Classic`。此外，TypeScript 还支持基于路径映射（path mapping）和类型根目录（type roots）的自定义模块解析。

## Node 模块解析策略

这是 TypeScript 默认采用的模块解析策略，它模仿了 Node.js 的模块解析行为。对于相对和非相对模块导入，遵循以下规则：

- **相对导入**：根据提供的相对于当前文件的路径来查找模块。
- **非相对导入**：首先在当前文件所在目录下的 `node_modules` 文件夹中查找模块。如果找不到，则逐级向上，在每个父目录的 `node_modules` 中查找，直到找到模块或到达文件系统的根目录。

## Classic 模块解析策略

这是一种较老的解析策略，不是默认选项。它的行为如下：

- **相对导入**：与 Node 策略相同，根据提供的路径进行查找。
- **非相对导入**：从当前文件所在目录开始，尝试查找全局安装的模块或声明文件，直到根目录为止。

## 自定义模块解析

TypeScript 允许通过配置文件 (`tsconfig.json`) 来定制模块解析行为，包括但不限于：

- **路径映射 (`paths`)**：允许你定义别名，以便更方便地引用项目中的模块，而不需要使用冗长的相对路径。
- **类型根目录 (`typeRoots`)**：指定查找 `.d.ts` 类型声明文件的位置。

## 配置

你可以通过 `tsconfig.json` 文件中的 `compilerOptions` 字段来设置这些选项：

```json
{
  "compilerOptions": {
    "moduleResolution": "node", // or "classic"
    "baseUrl": "./src", // 基础路径，用于解析非相对模块名称
    "paths": {
      "@/*": ["*"] // 路径映射，可以创建自己的模块路径别名
    },
    "typeRoots": [
      "./types", // 自定义类型定义的路径
      "./node_modules/@types" // 包含 npm 安装的类型定义
    ]
  }
}
```

确保你的项目结构和模块引用符合所选解析策略的要求，并且正确配置 `tsconfig.json`，以避免模块解析错误。如果你正在使用构建工具或模块打包工具（如 Webpack），它们也可能有自己的模块解析配置，需要确保这些配置与 TypeScript 的配置相兼容。

## 搭配 module 和 moduleResolution

### `module` 编译器选项

`module` 选项指定编译后的 JavaScript 文件中使用的模块系统。它影响了 TypeScript 如何将模块导入和导出转换为特定于环境的语法。以下是常见的 `module` 值：

- `none`: 不生成任何模块代码。
- `commonjs`: 使用 CommonJS 模块定义，适合 Node.js 环境。
- `amd`: 使用 AMD 模块定义，通常用于浏览器环境中，与 RequireJS 一起使用。
- `system`: 使用 SystemJS 模块加载器。
- `umd`: 通用模块定义，可以工作在 CommonJS 和 AMD 环境中，也可以直接在全局上下文中工作。
- `es6` 或 `es2015`: 使用 ES6 模块语法，这是现代 JavaScript 的标准。
- `es2020`, `es2022`, `esnext`: 支持更新的 ES 标准，包括动态 `import()` 表达式等特性。

### `moduleResolution` 编译器选项

如前所述，`moduleResolution` 选项指定了 TypeScript 解析模块的方式。它的值通常是 `node` 或 `classic`，其中 `node` 是默认且推荐的选择，因为它模仿了 Node.js 的模块解析行为，并且与大多数现代 JavaScript 环境兼容。

### 配对建议

当你配置 `tsconfig.json` 文件时，通常希望 `module` 和 `moduleResolution` 能够协调工作。以下是一些常见的配对示例：

#### 对于 Node.js 环境（后端）

```json
{
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node"
  }
}
```

#### 对于 Webpack 或其他打包工具（前端）

如果你正在使用像 Webpack 这样的打包工具，你可能会选择 `es6` 或 `es2015` 作为模块系统，因为这些打包工具支持 ES 模块语法。

```json
{
  "compilerOptions": {
    "module": "es6",
    "moduleResolution": "node"
  }
}
```

#### 对于 ES 模块（原生浏览器支持或 Deno）

如果你想编写可以直接在支持 ES 模块的环境中运行的代码（例如，现代浏览器或 Deno），你可以选择 `esnext` 并使用 `node` 模块解析策略。

```json
{
  "compilerOptions": {
    "module": "esnext",
    "moduleResolution": "node"
  }
}
```

### 注意事项

- 当你使用 `es6` 或更高版本的模块系统时，TypeScript 默认会启用 `--esModuleInterop` 选项，这使得 CommonJS 模块可以被当作 ES 模块来使用。
- 如果你在使用 `typeRoots` 或 `paths` 选项进行路径映射，则确保 `moduleResolution` 设置为 `node`，以保证这些自定义路径能够正确解析。

总之，选择合适的 `module` 和 `moduleResolution` 组合取决于你的目标环境和构建工具链。确保这两者相互兼容，并符合项目的实际需求。
