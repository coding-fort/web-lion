# CommonJS 模块查找策略

CommonJS (CJS) 模块查找策略是 Node.js 环境中模块解析的核心机制。它定义了如何根据模块标识符（module identifier）定位并加载模块文件。以下是 CommonJS 模块查找策略的详细步骤：

## 1. 内置模块优先

Node.js 首先检查请求的模块是否为内置模块，如 `fs`, `path`, `http` 等。如果是，则直接加载这些核心模块，而不会进行文件系统搜索。

## 2. 文件模块解析

对于非内置模块，Node.js 会按照以下顺序尝试解析模块路径：

### a. 绝对路径

如果模块路径以 `/` 开始，Node.js 将其视为绝对路径，并直接在文件系统中查找该位置。

### b. 相对路径

如果模块路径以 `./` 或 `../` 开始，Node.js 会将其解析为相对于当前模块的位置。例如，如果你在一个位于 `/home/user/project/app.js` 的文件中导入 `./lib/module.js`，那么 Node.js 会在 `/home/user/project/lib/module.js` 查找这个文件。

以`require('./module')`为例：

- 查找同名文件：目录下 `module.js`、`module.json`、`module.node`、`module.cjs` 等文件。
- 查找同名文件夹：目录下 `module/index.js`、`module/index.json`、`module/index.node` 等文件。
- 查找目录下是否存在`package.json` 文件，并读取 `package.json` 中的 `"main"` 字段，以确定包的入口点文件。

### c. 模块标识符（无路径前缀）

如果模块名不包含路径前缀（即没有 `./`、`../` 或 `/`），Node.js 会认为这是一个命名模块，并在 `node_modules` 文件夹中查找。Node.js 会从当前模块所在的目录开始，在其 `node_modules` 子目录中查找，如果找不到，就会递归地向上一级目录的 `node_modules` 中查找，直到根目录为止。

## 3. 模块扩展名解析

当查找文件模块时，如果没有提供扩展名，Node.js 会按以下顺序尝试添加不同的扩展名来查找文件：

- `.cjs`：CommonJS 模块。
- `.js`：JavaScript 文件。
- `.json`：JSON 文件。
- `.node`：编译后的 C/C++ 扩展。

此外，如果上述文件都不存在，Node.js 还会尝试查找 `<module>/index.<ext>`，其中 `<ext>` 是上面列出的可能扩展名之一。

## 4. `node_modules` 包解析

在 `node_modules` 中查找模块时，Node.js 会遵循如下规则：

- 如果模块是一个包（package），Node.js 会读取该包的 `package.json` 文件。
- 它会查找 `package.json` 文件中的 `"main"` 字段，以确定包的入口点文件。如果 `"main"` 字段未指定，默认情况下会查找 `index.js` 作为默认入口点。

## 5. 缓存机制

一旦模块被成功解析和加载，Node.js 会将模块缓存在内存中。这意味着同一模块在同一进程中只会被求值一次，后续引用时会直接使用缓存的版本。

## 6. 自定义解析逻辑

虽然 Node.js 提供了一套默认的模块解析逻辑，但你也可以通过构建工具或自定义加载器来改变这种行为。例如，Webpack 和其他打包工具允许你配置别名、路径映射等，以简化模块引用。
