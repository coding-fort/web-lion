# optimization 配置项

在 Webpack 中，`optimization` 配置项用于控制如何优化和分割输出的包。以下是一些常用的 `optimization` 配置选项及其用途：

## 1. splitChunks

这个配置项用于控制代码拆分的行为，可以用来提取公共模块或第三方库到单独的文件中。

```javascript
optimization: {
    splitChunks: {
        chunks: 'all', // 可以是 'all'、'async' 或 'initial'
        minSize: 20000, // 形成一个新代码块最小的体积（默认值为30000，在Webpack 5中）
        maxSize: 0, // 最大体积限制，超过该限制会尝试再次分割，默认为0表示不限制
        minChunks: 1, // 要被拆分出去的模块最少引用次数
        maxAsyncRequests: 30, // 按需加载时的最大并行请求数
        maxInitialRequests: 30, // 入口点处的最大并行请求数
        automaticNameDelimiter: '~', // 文件名的连接符
        name(module, chunks, cacheGroupKey) { // 给拆分出来的chunk命名
            return cacheGroupKey + '_' + chunks[0].name;
        },
        cacheGroups: { // 缓存组，可覆盖splitChunks中的其他选项
            vendors: {
                test: /[\\/]node_modules[\\/]/,
                priority: -10, // 权重，数值越大优先级越高
                name: 'vendors',
                chunks: 'all',
            },
            default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true, // 如果当前 chunk 包含已从主 bundle 中拆分出的模块，则它将被重用，而不是生成新的模块
            }
        }
    }
}
```

## 2. runtimeChunk

运行时代码也可以被分离出来，避免每次改动都影响整个入口文件的哈希值。

```javascript
optimization: {
    runtimeChunk: 'single', // 或者设置为 true 或 'multiple'
}
```

- `'single'` 表示所有入口共享一个运行时文件。
- `true` 或 `'multiple'` 则为每个入口创建一个新的运行时文件。

## 3. minimize 和 minimizer

控制是否压缩输出以及使用哪些插件进行压缩。

```javascript
optimization: {
    minimize: true, // 是否启用最小化
    minimizer: [
        // 使用 TerserPlugin 进行 JS 压缩
        new TerserWebpackPlugin({
            terserOptions: {
                parse: {
                    ecma: 8,
                },
                compress: {
                    ecma: 5,
                    warnings: false,
                    comparisons: false,
                    inline: 2,
                },
                mangle: {
                    safari10: true,
                },
                output: {
                    ecma: 5,
                    comments: false,
                    ascii_only: true,
                },
            },
            parallel: true,
            extractComments: false,
        }),
        // 还可以添加 CSS 压缩等其他的 minimizers
    ],
}
```

## 4. usedExports 和 sideEffects

这两个配置项与 Tree Shaking 相关，用于移除未使用的导出和副作用。

```javascript
optimization: {
    usedExports: true, // 标记用到的导出
    sideEffects: true, // 或者是一个数组，指定没有副作用的文件列表
}
```

以上就是一些常用的 Webpack `optimization` 配置，根据项目的具体需求调整这些配置可以帮助提高打包效率和最终应用的性能。
