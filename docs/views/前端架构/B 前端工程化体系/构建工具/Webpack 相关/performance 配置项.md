# performance 配置项

在 Webpack 中，`performance` 配置项用于设置构建性能的提示和限制条件，帮助开发者控制打包输出文件的大小，避免生成过大的资源文件影响页面加载性能。以下是 `performance` 配置项的一些常用设置及其说明：

## 基本配置

```javascript
module.exports = {
  // 其他配置...
  performance: {
    hints: "warning", // 或者 'error'、false。设置为 'warning' 会在超过限制时发出警告；'error' 则会抛出错误；false 则关闭提示。
    maxEntrypointSize: 400000, // 入口起点的最大体积（单位：字节）。默认值是 250000（即 250kb）。
    maxAssetSize: 100000, // 单个资源文件的最大体积（单位：字节）。默认值是 250000（即 250kb）。
    assetFilter(assetFilename) {
      // 可选函数，用于控制哪些文件需要考虑性能提示。
      return assetFilename.endsWith(".js") || assetFilename.endsWith(".css");
    },
  },
};
```

## 参数解释

- **hints**:

  - `'warning'`: 当资源大小超过设定的限制时，Webpack 将发出警告。
  - `'error'`: 超过限制时不仅发出警告，还会导致 Webpack 构建失败。
  - `false`: 关闭此功能，不进行任何提示或错误抛出。

- **maxEntrypointSize**:

  - 定义了一个入口点（entry point）的最大体积。如果一个入口点的所有资源加起来超过了这个限制，就会触发上面设置的 `hints` 行为。

- **maxAssetSize**:

  - 控制单个输出资源文件的最大尺寸。如果某个单独的资源文件（如 JavaScript 或 CSS 文件）超过了这个大小，则会触发 `hints` 设置的行为。

- **assetFilter**:
  - 这是一个可选的函数，接收资源文件名作为参数，返回一个布尔值来决定是否对该文件应用性能限制检查。例如，你可能只关心 JavaScript 和 CSS 文件的大小，而不关心图片或其他类型的资源文件。

通过合理配置 `performance` 选项，可以帮助确保你的项目不会因为过大而影响用户的加载体验。需要注意的是，这些设置应该根据项目的具体需求和目标用户群体的特点来进行调整。例如，如果你的应用主要面向移动网络用户，那么可能需要更加严格的限制以保证较快的加载速度。
