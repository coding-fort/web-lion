# tsconfig 配置文件

`tsconfig.json` 文件是用来配置 TypeScript 编译器的。当你在一个项目中创建一个 `tsconfig.json` 文件时，TypeScript 编译器（`tsc`）会自动识别它，并使用其中定义的选项来编译你的代码。这个文件可以让你设置编译选项、指定包括或排除哪些文件，以及如何组织和输出编译后的 JavaScript 文件。
`tsconfig.json` 文件是 TypeScript 编译器的配置文件，它允许开发者指定编译选项以及定义项目的根文件。以下是根据功能区分的详细配置项列表。这些配置项可以被组织到几个主要的功能类别中：编译器选项、项目设置、路径映射和类型检查。

## 编译器选项（Compiler Options）

这些选项影响 TypeScript 编译器的行为，包括输出格式、模块解析等。

```json
{
  "compilerOptions": {
    "target": "es5", // 设置生成代码的目标版本 (es3, es5, es6/es2015, es2016, es2017, es2018, es2019, es2020, esnext)
    "module": "commonjs", // 指定模块代码生成方式 (none, commonjs, amd, system, umd, es6/es2015, es2020, esnext)
    "lib": ["dom", "es6"], // 指定库文件，例如 DOM, Web Worker, ES6 等
    "allowJs": true, // 允许编译 JavaScript 文件
    "checkJs": false, // 是否对 .js 文件进行类型检查
    "jsx": "react", // 指定 JSX 代码生成: 'preserve', 'react-native', 或 'react'
    "declaration": true, // 生成相应的 `.d.ts` 声明文件
    "declarationDir": "./types", // 指定输出 `.d.ts` 文件的目录
    "sourceMap": true, // 生成 source map 文件以调试
    "outDir": "./dist", // 指定输出目录
    "rootDir": "./src", // 指定输入文件的根目录
    "removeComments": true, // 移除生成文件中的注释
    "strict": true, // 启用所有严格类型检查选项
    "esModuleInterop": true, // 启用 CommonJS 和 ES 模块之间的互操作性
    "skipLibCheck": true, // 跳过对库文件的类型检查
    "forceConsistentCasingInFileNames": true // 强制文件名大小写一致性
  }
}
```

## 项目设置（Project Settings）

这些选项帮助定义项目结构和包含哪些文件。

```json
{
  "include": ["./src"], // 包含的文件或目录
  "exclude": ["node_modules"], // 排除的文件或目录
  "files": ["global.d.ts"] // 明确列出要包含的文件
}
```

## 路径映射（Path Mapping）

使用 `baseUrl` 和 `paths` 来自定义模块解析路径，这在大型项目中特别有用。

```json
{
  "compilerOptions": {
    "baseUrl": "./", // 解析非相对模块名称的基础目录
    "paths": {
      "@/*": ["src/*"] // 自定义路径别名
    }
  }
}
```

## 类型检查（Type Checking）

这些选项增强了 TypeScript 的类型系统，提供更严格的类型检查。

```json
{
  "compilerOptions": {
    "strict": true, // 启用所有严格类型检查选项
    "noImplicitAny": true, // 不允许隐式的 `any` 类型
    "strictNullChecks": true, // 启用严格的空值检查
    "noImplicitThis": true, // 不允许 `this` 隐式为 `any`
    "alwaysStrict": true, // 以严格模式解析代码
    "noUnusedLocals": true, // 报告未使用的局部变量
    "noUnusedParameters": true, // 报告未使用的参数
    "noFallthroughCasesInSwitch": true // 报告 switch 中的 fallthrough cases
  }
}
```

## 其他常用选项

还有一些其他的选项，它们可能不属于上述任何一个类别，但仍然非常重要：

```json
{
  "compilerOptions": {
    "incremental": true, // 启用增量编译
    "composite": true, // 启用项目引用
    "importHelpers": true, // 从 tslib 导入辅助函数
    "downlevelIteration": true // 为目标环境降级迭代语法
  }
}
```

请注意，`tsconfig.json` 文件中的某些选项可能会相互影响。例如，启用 `strict` 会自动开启多个严格类型的子选项。因此，在配置时应仔细考虑每个选项的作用及其与其他选项的关系。此外，不是所有的选项都适用于所有场景；选择适合你项目需求的选项是非常重要的。

## 创建 tsconfig.json 文件

你可以手动创建一个 `tsconfig.json` 文件并添加上述配置，或者你可以使用 `tsc` 命令行工具自动生成一个基础配置文件：

```bash
tsc --init
```

这会在当前目录下创建一个带有默认值的 `tsconfig.json` 文件。然后，你可以根据项目的需要修改这些默认值。

## 使用 tsconfig.json

一旦你有了 `tsconfig.json` 文件，你就可以在命令行中简单地运行 `tsc` 来编译整个项目，而不需要为每个文件单独调用编译器。TypeScript 编译器会读取 `tsconfig.json` 文件中的配置，并按照配置进行编译。

如果你使用的是现代编辑器，比如 Visual Studio Code，它会自动识别 `tsconfig.json` 文件，并提供智能感知和其他开发辅助功能。
