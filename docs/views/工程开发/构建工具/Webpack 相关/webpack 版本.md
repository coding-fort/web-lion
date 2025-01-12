# webpack 版本

## 1.webpack4

## 2.webpack5

`Webpack 5` 是 Webpack 的一个重要版本更新，带来了许多新特性和性能改进，旨在进一步优化构建过程、减少打包体积并提高开发体验。

**Webpack 5** 是 Webpack 的一个重要版本更新，带来了许多新特性和性能改进，旨在进一步优化构建过程、减少打包体积并提高开发体验。以下是 Webpack 5 的一些关键特性和改进：

### 2.1. **持久化缓存 (Persistent Caching)**

- **增量构建加速**：Webpack 5 引入了持久化缓存机制，可以在磁盘上存储中间构建结果。这意味着在后续构建中，如果文件没有变化，Webpack 可以直接复用之前的缓存，极大加快了增量构建的速度。
- **跨机器共享**：缓存不仅限于本地使用，还可以通过网络或其他方式在不同机器之间共享，方便团队协作和 CI/CD 流程。

### 2.2. [**模块联邦 (Module Federation)**](/views/工程开发/模块化/模块联邦)

- **微前端架构支持**：这是一个强大的特性，允许不同的 Webpack 构建输出之间共享模块，从而实现微前端架构。它使得多个独立的应用或库可以在运行时动态地相互加载和共享代码，而无需提前打包在一起。

### 2.3. **树摇优化 (Tree Shaking) 增强**

- **更严格的副作用处理**：Webpack 5 更加严格地处理模块的副作用，确保只有真正需要的代码被包含在最终包中。开发者可以通过 `package.json` 中的 `"sideEffects"` 字段来指定哪些模块是无副作用的。

### 2.4. **资源提示 (Asset Modules)**

- **简化资源处理**：Webpack 5 引入了新的资源模块类型（如 `asset/resource`, `asset/inline`, 和 `asset/source`），取代了旧版中的 `file-loader` 和 `url-loader`。这些新的模块类型可以更直观地处理图片、字体等静态资源，并且提供了更好的默认行为。

### 2.5. **改进的依赖管理**

- **自动移除未使用的 Polyfills**：Webpack 5 可以智能检测并移除不必要的 polyfills，例如不再为现代浏览器添加对旧 JavaScript 特性的支持，从而减小打包体积。

- **更高效的 Node.js 内置模块模拟**：对于那些不适用于浏览器环境的 Node.js 内置模块（如 `fs`, `path`），Webpack 5 提供了更高效的模拟实现，减少了不必要的警告信息。

### 2.6. **更智能的包分析工具**

- **内置 Bundle Analyzer 支持**：虽然 Webpack 本身并不自带 bundle 分析工具，但 Webpack 5 对 `webpack-bundle-analyzer` 等插件的支持更加友好，帮助开发者更好地理解和优化打包结果。

### 2.7. **其他改进**

- **TypeScript 支持增强**：Webpack 5 对 TypeScript 的支持得到了加强，包括更好的类型推断和错误报告。
- **实验性特性**：引入了一些实验性特性，如 WebAssembly 模块联邦和异步规范解析等，为未来的功能扩展打下基础。

### 2.8. 配置示例

以下是一个简单的 Webpack 5 配置文件示例，展示了如何启用持久化缓存和资源模块：

```javascript
const path = require("path");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    filename: "bundle.[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true, // 自动清理输出目录
  },
  cache: {
    type: "filesystem", // 启用持久化缓存
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset/resource", // 使用新的资源模块类型，类似file-loader
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  experiments: {
    topLevelAwait: true, // 实验性特性：顶层 await
  },
};
```

<bws>1. 自动清理输出目录</bws>
<bws>2. topLevelAwait</bws>
<bws>3. 打包体积优化</bws>
<bws>4. 打包缓存开箱即用</bws>
<bws>5. 支持原生资源模块</bws>

### 2.9. 总结

Webpack 5 通过一系列的新特性和优化，显著提升了构建效率、降低了打包体积，并为现代 Web 开发提供了更多灵活性。特别是模块联邦和持久化缓存等功能，为构建复杂应用和微前端架构提供了强有力的支持。随着 Web 技术的发展，Webpack 5 继续引领着前端工程化的潮流，帮助开发者构建更快、更小、更可靠的 Web 应用。
