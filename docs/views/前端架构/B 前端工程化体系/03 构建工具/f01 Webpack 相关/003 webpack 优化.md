# webpack 优化

Webpack 的优化策略可从 **构建性能**、**打包体积**、**运行时性能** 三个维度展开，以下是具体优化方案：

## 一、构建性能优化（加速编译过程）

### 1. **缓存机制**

```javascript
// webpack.config.js
module.exports = {
  // 启用持久化缓存（Webpack 5 内置）
  cache: {
    type: "filesystem", // 使用文件系统缓存
    cacheDirectory: path.resolve(__dirname, ".webpack_cache"),
  },

  // Babel 缓存
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true, // 启用 Babel 缓存
          },
        },
      },
    ],
  },
};
```

### 2. **并行处理**

```javascript
// 使用 thread-loader 并行处理
{
  test: /\.js$/,
  include: path.resolve('src'),
  use: [
    'thread-loader', // 必须放在其他 loader 之前
    'babel-loader'
  ]
}

// 配置 thread-loader 工作池
thread-loader: {
  workers: require('os').cpus().length - 1, // 保留一个 CPU 给系统
  workerParallelJobs: 50
}
```

### 3. **缩小构建范围**

```javascript
module: {
  noParse: /jquery|lodash/, // 不解析这些模块（需确保无依赖）

  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/, // 排除 node_modules
      use: 'babel-loader'
    }
  ]
},

resolve: {
  modules: [path.resolve(__dirname, 'src'), 'node_modules'], // 优先搜索 src 目录
  extensions: ['.js', '.json'], // 减少扩展名尝试次数
  symlinks: false // 不解析符号链接（提高解析速度）
}
```

### 4. **使用更快的 Loader**

- **Babel → swc/ESBuild**：
  ```javascript
  // 使用 swc-loader 替代 babel-loader
  {
    test: /\.js$/,
    use: {
      loader: 'swc-loader',
      options: {
        jsc: {
          parser: {
            syntax: 'ecmascript',
            jsx: true
          }
        }
      }
    }
  }
  ```

## 二、打包体积优化（减小输出文件大小）

### 1. **Tree-shaking 增强**

```javascript
// 确保使用 ESM 格式的依赖
optimization: {
  usedExports: true, // 标记未使用的导出
  sideEffects: true, // 识别副作用
  concatenateModules: true // 模块合并（Scope Hoisting）
}

// package.json 中标记无副作用的模块
{
  "name": "my-library",
  "sideEffects": false // 整个库无副作用
  // 或指定有副作用的文件
  // "sideEffects": ["./src/globals.css", "./src/*.js"]
}
```

### 2. **代码分割**

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    minSize: 20000,
    minRemainingSize: 0,
    minChunks: 1,
    maxAsyncRequests: 30,
    maxInitialRequests: 30,
    automaticNameDelimiter: '~',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      },
      common: {
        name: 'common',
        minChunks: 2,
        priority: -20,
        reuseExistingChunk: true
      }
    }
  }
}
```

### 3. **压缩与混淆**

```javascript
optimization: {
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true, // 删除 console
          drop_debugger: true, // 删除 debugger
          pure_funcs: ["console.log"], // 删除特定函数
        },
        mangle: true,
        format: {
          comments: false, // 移除注释
        },
      },
      extractComments: false, // 不提取注释到单独文件
    }),

    new CssMinimizerPlugin(), // 压缩 CSS
  ];
}
```

### 4. **图片与资源优化**

```javascript
// 使用 image-webpack-loader 压缩图片
{
  test: /\.(png|jpg|gif)$/i,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]',
        outputPath: 'images'
      }
    },
    {
      loader: 'image-webpack-loader',
      options: {
        mozjpeg: {
          progressive: true,
          quality: 65
        },
        optipng: {
          enabled: false
        },
        pngquant: {
          quality: [0.65, 0.90],
          speed: 4
        },
        gifsicle: {
          interlaced: false
        },
        webp: {
          quality: 75
        }
      }
    }
  ]
}
```

## 三、运行时性能优化（加速浏览器加载与执行）

### 1. **按需加载（懒加载）**

```javascript
// 动态导入组件
const loadComponent = async () => {
  const { MyComponent } = await import("./MyComponent");
  return MyComponent;
};

// React 路由懒加载示例
const HomePage = React.lazy(() => import("./pages/HomePage"));

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Route path="/" component={HomePage} />
    </React.Suspense>
  );
}
```

### 2. **预加载与预取**

```javascript
// 使用 preload-webpack-plugin
const PreloadWebpackPlugin = require("preload-webpack-plugin");

plugins: [
  new PreloadWebpackPlugin({
    rel: "preload",
    include: "initial", // 预加载初始资源
    fileBlacklist: [/\.map$/, /hot-update\.js$/],
  }),

  new PreloadWebpackPlugin({
    rel: "prefetch",
    include: "asyncChunks", // 预取下一页面可能需要的资源
  }),
];
```

### 3. **CDN 加载外部资源**

```javascript
// 配置 externals
externals: {
  react: 'React',
  'react-dom': 'ReactDOM',
  'axios': 'axios'
}

// 在 HTML 中引入 CDN 资源
<script src="https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
```

## 四、高级优化技巧

### 1. **自定义构建流程**

```javascript
// 使用 Webpack 构建钩子
class MyPlugin {
  apply(compiler) {
    // 编译开始时执行
    compiler.hooks.compile.tap("MyPlugin", (compilation) => {
      console.log("编译开始...");
    });

    // 编译完成后执行
    compiler.hooks.done.tap("MyPlugin", (stats) => {
      console.log("编译完成!");
    });
  }
}

// 在配置中使用
plugins: [new MyPlugin()];
```

### 2. **分析与监控**

```javascript
// 使用 webpack-bundle-analyzer 分析包体积
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

plugins: [
  new BundleAnalyzerPlugin({
    analyzerMode: "static", // 生成静态 HTML 文件
    openAnalyzer: process.env.ANALYZE === "true", // 通过环境变量控制是否打开
  }),
];
```

### 3. **开发环境优化**

```javascript
// 开发环境配置
devServer: {
  compress: true, // 启用 gzip 压缩
  hot: true, // 启用 HMR
  client: {
    overlay: {
      errors: true,
      warnings: false
    }
  },
  historyApiFallback: true, // 支持单页应用路由
  static: {
    directory: path.join(__dirname, 'public'),
    watch: true
  }
},

// 使用更快的 source map
devtool: 'eval-cheap-module-source-map' // 开发环境推荐
```

## 五、常见问题解决方案

1. **构建速度慢**：

   - 启用缓存（`cache: { type: 'filesystem' }`）
   - 使用 `thread-loader` 并行处理
   - 排除不必要的文件（`exclude: /node_modules/`）

2. **包体积过大**：

   - 检查未使用的依赖（通过 `webpack-bundle-analyzer`）
   - 确保 Tree-shaking 生效（使用 ESM、标记 `sideEffects`）
   - 分割 vendor chunk，使用 CDN 加载外部资源

3. **HMR 不生效**：

   - 确保 `devServer.hot: true`
   - 使用框架官方 HMR 插件（如 `react-refresh`）
   - 避免全局状态管理库干扰 HMR

4. **内存溢出**：
   - 增加 Node.js 内存限制：`NODE_OPTIONS=--max-old-space-size=8192 webpack`
   - 减少并行处理的 worker 数量

## 六、优化策略总结

| 优化维度       | 关键技术                                                                                |
| -------------- | --------------------------------------------------------------------------------------- |
| **构建性能**   | 1. 持久化缓存<br>2. 并行处理（thread-loader）<br>3. 缩小构建范围<br>4. 使用 swc/ESBuild |
| **打包体积**   | 1. Tree-shaking<br>2. 代码分割<br>3. 压缩与混淆<br>4. 图片优化<br>5. CDN 加载外部资源   |
| **运行时性能** | 1. 按需加载<br>2. 预加载/预取<br>3. 资源优先级优化<br>4. 懒加载策略                     |

通过以上策略，Webpack 项目可实现 **开发体验流畅** 和 **生产包体积极致优化** 的双重目标。建议使用 `webpack-bundle-analyzer` 定期分析打包结果，针对性地优化关键模块。
