# tsconfig 配置文件

`tsconfig.json` 文件是用来配置 TypeScript 编译器的。当你在一个项目中创建一个 `tsconfig.json` 文件时，TypeScript 编译器（`tsc`）会自动识别它，并使用其中定义的选项来编译你的代码。这个文件可以让你设置编译选项、指定包括或排除哪些文件，以及如何组织和输出编译后的 JavaScript 文件。

下面是一个典型的 `tsconfig.json` 文件结构及其常用字段：

```json
{
  "compilerOptions": {
    "target": "ES6", // 设置编译后JavaScript的目标版本，如 ES3, ES5, ES6/ES2015, ES2016, ES2017, ES2018, ES2019, ES2020, ES2021, ES2022, 或 ESNext
    "module": "commonjs", // 指定模块代码生成的类型，如 none, commonjs, amd, system, umd, es6/es2015, es2020, es2022, 或 ESNext
    "strict": true, // 启用所有严格的类型检查选项
    "esModuleInterop": true, // 允许从 CommonJS 和 AMD 模块导入 ES 模块
    "skipLibCheck": true, // 跳过声明文件的类型检查
    "forceConsistentCasingInFileNames": true, // 强制文件名大小写一致性
    "outDir": "./dist", // 指定编译输出目录
    "rootDir": "./src", // 指定存放输入文件的根目录
    "sourceMap": true, // 生成对应的 .map 文件，用于调试
    "declaration": true, // 生成相应的 .d.ts 声明文件
    "moduleResolution": "node", // 指定模块解析策略，如 node 或 classic
    "typeRoots": ["./custom-types", "./node_modules/@types"] // 指定类型声明文件的根目录，用于查找类型声明文件
  },
  "include": [
    "src/**/*" // 包含的文件模式，支持通配符
  ],
  "exclude": [
    "node_modules", // 排除的文件夹
    "build",
    "scripts",
    "dist"
  ]
}
```

## 配置项

`tsconfig.json` 文件中的配置项可以分为几大类：编译选项 (`compilerOptions`)、包含文件模式 (`include`) 和排除文件模式 (`exclude`)。以下是对这些配置项更详细的解释：

### 编译选项 (`compilerOptions`)

这是 `tsconfig.json` 中最重要的部分，它包含了影响 TypeScript 编译行为的多个设置。这里是一些常用的 `compilerOptions` 配置项：

- **target**: 指定编译后 JavaScript 的 ECMAScript 版本（例如，ES3, ES5, ES6/ES2015, ES2016, ES2017, ES2018, ES2019, ES2020, ES2021, ES2022, 或 ESNext）。
- **module**: 指定模块代码生成的类型（例如，none, commonjs, amd, system, umd, es6/es2015, es2020, es2022, 或 ESNext）。

- **strict**: 启用所有严格类型检查选项，包括 `noImplicitAny`, `noImplicitThis`, `alwaysStrict` 等等。

- **esModuleInterop**: 允许从 CommonJS 和 AMD 模块导入 ES 模块，以兼容旧版本的模块系统。

- **skipLibCheck**: 跳过声明文件（.d.ts）的类型检查，通常用于加快编译速度。

- **forceConsistentCasingInFileNames**: 强制文件名大小写一致性，避免在区分大小写的文件系统上出现问题。

- **outDir**: 指定编译输出目录，即编译后的 JavaScript 文件存放的位置。

- **rootDir**: 指定存放输入文件的根目录，帮助组织项目结构。

- **sourceMap**: 生成对应的 .map 文件，方便调试。

- **declaration**: 生成相应的 .d.ts 声明文件，有助于库开发和分发。

- **moduleResolution**: 指定模块解析策略（如 node 或 classic），影响如何查找模块。

- **removeComments**: 在编译过程中移除源代码中的注释。

- **noEmitOnError**: 如果有编译错误，则不输出任何文件。

- **incremental**: 启用增量编译，仅重新编译上次编译以来更改过的文件。

- **composite**: 启用项目引用的支持，允许将多个项目组合在一起进行编译。

- **baseUrl**: 设置解析非相对模块名称的基础目录。

- **paths**: 使用路径映射来替代模块名的一部分。

- **typeRoots**: 指定类型声明文件的根目录，用于查找类型声明文件。

### 包含文件模式 (`include`)

`include` 字段指定要包含在编译中的文件或文件夹模式。默认情况下，TypeScript 会包含当前目录及其子目录下的所有 `.ts`, `.tsx`, 和 `.d.ts` 文件。你可以使用通配符来指定需要包含的文件模式，例如：

```json
"include": ["src/**/*"]
```

这表示包括 `src` 目录下所有的文件。

### 排除文件模式 (`exclude`)

`exclude` 字段用来指定哪些文件或文件夹应该被排除在编译之外。默认情况下，`node_modules`, `bower_components`, 和 `jspm_packages` 文件夹会被自动排除。你可以添加额外的排除规则，比如：

```json
"exclude": ["node_modules", "build", "scripts", "dist"]
```

这表示排除 `node_modules`, `build`, `scripts`, 和 `dist` 目录下的所有文件。

### 其他

除了上述提到的主要配置项，`tsconfig.json` 还支持许多其他配置项，具体取决于你的项目需求。你可以在 [TypeScript 官方文档](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) 中找到完整的配置列表及详细说明。此外，随着 TypeScript 的不断更新，可能会引入新的配置项，所以保持对官方文档的关注总是个好主意。

## 创建 tsconfig.json 文件

你可以手动创建一个 `tsconfig.json` 文件并添加上述配置，或者你可以使用 `tsc` 命令行工具自动生成一个基础配置文件：

```bash
tsc --init
```

这会在当前目录下创建一个带有默认值的 `tsconfig.json` 文件。然后，你可以根据项目的需要修改这些默认值。

## 使用 tsconfig.json

一旦你有了 `tsconfig.json` 文件，你就可以在命令行中简单地运行 `tsc` 来编译整个项目，而不需要为每个文件单独调用编译器。TypeScript 编译器会读取 `tsconfig.json` 文件中的配置，并按照配置进行编译。

如果你使用的是现代编辑器，比如 Visual Studio Code，它会自动识别 `tsconfig.json` 文件，并提供智能感知和其他开发辅助功能。
