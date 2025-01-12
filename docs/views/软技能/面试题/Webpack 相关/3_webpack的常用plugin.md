# 3_webpack 的常用 plugin

```md
`HtmlWebpackPlugin`：
自动生成 HTML 文件，并将打包后的 JavaScript 或 CSS 文件自动引入到 HTML 文件中。可配置参数包括模板文件、输出文件名、压缩选项等。

`MiniCssExtractPlugin`：
将 CSS 提取为单独的文件，并进行压缩和优化。通常与 CSS 相关的 loader 结合使用，如 style-loader、css-loader 等。

`CleanWebpackPlugin`：
在每次构建之前清理输出目录（如 dist 目录），避免旧文件的累积。通常用于生产环境构建。

`DefinePlugin`：
允许在编译时创建全局常量，可用于注入环境变量，例如配置开发环境和生产环境下的不同行为。

`CopyWebpackPlugin`：
将文件或目录复制到构建输出目录，常用于复制静态资源文件，如图片、字体等。

`OptimizeCssAssetsPlugin`：
用于优化和压缩 CSS 文件。通常与 MiniCssExtractPlugin 结合使用，用于生产环境构建。

`WebpackBundleAnalyzer`：
分析打包文件的大小和依赖关系，可视化构建结果，帮助优化代码和资源。

`ProvidePlugin`：
自动加载模块，而不必到处 import 或 require。可以将全局变量注入到每个模块中，如将 jQuery 注入到每个模块中，使其无需手动引入。

`CompressionWebpackPlugin`：
在构建过程中对资源文件进行 gzip 压缩，以减小文件体积，提高加载速度。

`HotModuleReplacementPlugin`：
启用模块热替换（HMR）功能，实现代码修改后的实时更新，提高开发效率。
```
