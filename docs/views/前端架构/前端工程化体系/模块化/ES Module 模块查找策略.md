# ES Module 模块查找策略

ES 模块（ESM）的模块查找策略在 Node.js 和浏览器环境中有所不同，但它们都遵循 ECMAScript 规范中定义的基本原则。以下是 ES 模块在 Node.js 中的查找策略详细说明：

## 1. 明确的文件扩展名

- **`.mjs`**：这是明确标识 ES 模块的推荐扩展名。无论 `package.json` 中的 `"type"` 字段设置为何值，`.mjs` 文件总是被解析为 ES 模块。
- **`.js`**：当 `package.json` 中设置了 `"type": "module"`，所有 `.js` 文件默认被视为 ES 模块。否则，默认情况下它们是 CommonJS 模块。

<bwe>在 ESM 中，导入模块时必须指定<sucb>文件的完整路径和扩展名（.js、.mjs）</sucb>。ESM 不直接支持将一个目录作为导入路径的方式。</bwe>
<bwe>如果希望通过 ESM 导入一个目录下的模块，你需要指定目录中具体文件的路径，包括扩展名（如<suc>import {fn} from './lib/index.js'</suc>）</bwe>

## 2. 包类型声明

- **`"type": "module"`**：如果 `package.json` 文件中有这个字段，并且其值为 `"module"`，那么该包中的所有 `.js` 文件将被视为 ES 模块。
- **无 `"type"` 字段或 `"type": "commonjs"`**：在这种情况下，`.js` 文件默认被视为 CommonJS 模块。

## 3. URL 和路径解析

- **绝对路径**：以 `/` 开始的路径被视为相对于根目录的路径。
- **相对路径**：以 `./` 或 `../` 开始的路径是相对于当前模块的位置。
- **命名模块**：不带路径前缀的模块名（例如 `lodash`），Node.js 会在 `node_modules` 目录中查找这些模块。

## 4. 在 `node_modules` 中查找

对于命名模块（即没有路径前缀的模块），Node.js 会按照以下步骤在 `node_modules` 中查找：

- 从当前模块所在的目录开始，在其 `node_modules` 子目录中查找。
- 如果找不到，则递归地向上一级目录的 `node_modules` 中查找，直到根目录为止。
- 查找时，Node.js 会读取 `package.json` 文件中的 `"main"` 字段来确定入口点。如果没有指定 `"main"` 字段，默认情况下它会查找 `index.js` 或 `index.mjs` 作为默认入口点。

## 5. ES 模块与 CommonJS 模块互操作性

- **CommonJS 模块导入到 ES 模块**：可以通过动态 `import()` 函数加载 CommonJS 模块。注意，静态 `import` 语句不能直接导入 CommonJS 模块。
- **ES 模块导出给 CommonJS 模块**：CommonJS 模块可以使用 `require()` 加载 ES 模块，但是需要注意的是，ES 模块默认导出的对象结构与 CommonJS 的 `module.exports` 不同。

## 6. 缓存机制

一旦 ES 模块被成功解析和加载，Node.js 也会将它们缓存在内存中。这意味着同一模块在同一进程中只会被求值一次，后续引用时会直接使用缓存的版本。

## 7. 动态导入

ES 模块支持动态导入语法 (`import()`)，这允许你在运行时有条件地加载模块。这对于按需加载模块非常有用，有助于优化性能和减少初始加载时间。

## 8. 命名空间对象

当一个 ES 模块被加载时，它会返回一个命名空间对象，其中包含了所有通过 `export` 导出的绑定。这个命名空间对象是一个只读视图，任何尝试修改它的尝试都会导致错误。

## 总结

ES 模块查找策略确保了模块化代码的一致性和可预测性，同时提供了灵活性和强大的功能，如动态导入和更好的互操作性。理解这些规则可以帮助开发者更有效地组织代码，确保模块能够正确加载，并优化依赖关系管理。
