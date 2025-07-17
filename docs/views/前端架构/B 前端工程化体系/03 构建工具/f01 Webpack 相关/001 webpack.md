# Webpack

Webpack 是当前前端生态中最主流的模块打包工具，适用于从简单单页应用到复杂企业级项目的各种场景。以下从核心概念、配置、优化策略到生态插件，系统梳理其核心知识点：

## 一、核心概念（理解 Webpack 的基础）

### 1. **模块（Module）**

- **定义**：Webpack 中一切皆模块（JS、CSS、图片、字体等），每个模块都有独立作用域，通过 `import/require` 声明依赖。
- **与传统脚本的区别**：传统 HTML 通过 `<script>` 按顺序加载多个 JS 文件（全局作用域，依赖管理混乱）；Webpack 按依赖关系打包，避免全局变量污染。

### 2. **入口（Entry）**

- **作用**：告诉 Webpack 从哪个文件开始构建依赖图（Dependency Graph）。
- **单入口**（SPA 常用）：
  ```javascript
  entry: "./src/index.js";
  ```
- **多入口**（多页应用 MPA）：
  ```javascript
  entry: {
    home: './src/home.js',
    about: './src/about.js'
  }
  ```

### 3. **输出（Output）**

- **作用**：定义打包后的文件存放位置和命名规则。
- **示例**：
  ```javascript
  output: {
    path: path.resolve(__dirname, 'dist'), // 输出目录
    filename: '[name].[contenthash].js',   // 文件名（[name] 为入口名称，[contenthash] 为内容哈希）
    publicPath: '/'                        // 资源引用的公共路径（如 CDN 前缀）
  }
  ```

### 4. **Loader**

- **作用**：处理非 JS 模块（如 CSS、图片、TS），将其转换为 Webpack 能识别的模块。
- **执行顺序**：从右到左、从下到上执行（如 `use: ['style-loader', 'css-loader']` 先执行 `css-loader`）。
- **常见 Loader**：
  - **CSS 处理**：`css-loader`（解析 CSS 中的 `@import` 和 `url()`）、`style-loader`（将 CSS 注入 DOM）、`sass-loader`（编译 SCSS/SASS）。
  - **图片处理**：`file-loader`（复制文件并返回路径）、`url-loader`（小文件转 Base64，减少请求）、`image-webpack-loader`（压缩图片）。
  - **JS 转译**：`babel-loader`（将 ES6+ 转为向后兼容的 JS）、`ts-loader`（编译 TypeScript）。
- **配置示例**：
  ```javascript
  module: {
    rules: [
      {
        test: /\.css$/, // 匹配 .css 文件
        use: ["style-loader", "css-loader"], // 从右到左执行
      },
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ];
  }
  ```

### 5. **Plugin（插件）**

- **作用**：扩展 Webpack 功能（如代码压缩、生成 HTML、分割 CSS 等），在构建过程的特定生命周期执行。
- **常见 Plugin**：
  - **HtmlWebpackPlugin**：生成 HTML 文件并自动注入打包后的 JS/CSS。
  - **MiniCssExtractPlugin**：将 CSS 提取为独立文件（替代 `style-loader`），用于生产环境。
  - **TerserPlugin**：压缩 JS 代码（Webpack 5 内置）。
  - **CleanWebpackPlugin**：每次构建前清空输出目录。
  - **DefinePlugin**：定义环境变量（如区分开发/生产环境）。
- **配置示例**：
  ```javascript
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html", // 基于模板生成 HTML
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
    }),
  ];
  ```

### 6. **模式（Mode）**

- **作用**：预设不同环境的配置（开发/生产），自动启用相应优化。
- **可选值**：
  - `development`：启用 `NamedChunksPlugin` 和 `NamedModulesPlugin`（便于调试）。
  - `production`：默认启用代码压缩（TerserPlugin）、Tree-shaking、Scope Hoisting 等优化。
- **配置**：
  ```javascript
  mode: "production"; // 或 'development'
  ```

## 二、高级特性

### 1. **Tree-shaking**

- **定义**：消除未使用的代码（Dead Code Elimination），仅保留被引用的模块。
- **条件**：
  - 使用 ES6 模块语法（`import/export`），而非 CommonJS（`require`）。
  - 生产模式（`mode: 'production'`）或手动配置 `optimization.usedExports: true`。
- **示例**：

  ```javascript
  // utils.js
  export const add = (a, b) => a + b;
  export const subtract = (a, b) => a - b;

  // index.js
  import { add } from "./utils.js"; // 仅引用 add，subtract 会被 Tree-shaking
  ```

### 2. **代码分割（Code Splitting）**

- **作用**：将代码拆分为多个较小的 bundle，按需加载（如懒加载路由），减少首屏加载时间。
- **实现方式**：
  - **入口起点分割**（多入口）：
    ```javascript
    entry: {
      main: './src/index.js',
      vendor: './src/vendor.js' // 单独打包第三方库
    }
    ```
  - **动态导入（推荐）**：使用 `import()` 语法（ES6 动态导入）：
    ```javascript
    // 路由懒加载
    const loadComponent = () => import("./Component.js");
    ```
  - **SplitChunksPlugin**（Webpack 5 内置）：自动分割公共依赖：
    ```javascript
    optimization: {
      splitChunks: {
        chunks: "all"; // 分割所有类型的 chunks（async、initial、all）
      }
    }
    ```

### 3. **懒加载（Lazy Loading）**

- **场景**：非首屏必需的模块（如弹窗、复杂组件）在需要时再加载。
- **示例**（React 组件懒加载）：

  ```javascript
  const Modal = React.lazy(() => import("./Modal.js"));

  function App() {
    return (
      <div>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Modal />
        </React.Suspense>
      </div>
    );
  }
  ```

### 4. **缓存（Caching）**

- **作用**：通过文件名哈希（如 `[contenthash]`），让浏览器缓存未修改的文件，提升二次加载速度。
- **配置**：
  ```javascript
  output: {
    filename: "[name].[contenthash].js"; // 内容变化时哈希值才会变
  }
  ```
- **配合插件**：`CachePlugin`（Webpack 5 内置）进一步优化构建缓存。

## 三、性能优化策略

### 1. **开发环境优化**

- **HMR（热模块替换）**：修改代码后仅更新变化的模块，而非刷新整个页面。
  ```javascript
  devServer: {
    hot: true; // 启用 HMR
  }
  ```
- **增量构建**：使用 `cache` 配置缓存构建结果：
  ```javascript
  cache: {
    type: "filesystem"; // 使用文件系统缓存
  }
  ```
- **并行处理**：使用 `thread-loader` 将耗时任务（如 Babel 转译）分配给 worker 池：
  ```javascript
  {
    test: /\.js$/,
    use: [
      'thread-loader', // 必须放在其他 loader 之前
      'babel-loader'
    ]
  }
  ```

### 2. **生产环境优化**

- **代码压缩**：
  ```javascript
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 删除 console.log
          },
        },
      }),
    ];
  }
  ```
- **CSS 压缩与分割**：
  ```javascript
  plugins: [
    new MiniCssExtractPlugin(),
    new CssMinimizerPlugin(), // 压缩 CSS
  ];
  ```
- **图片优化**：
  ```javascript
  {
    test: /\.(png|jpg|gif)$/i,
    use: [
      {
        loader: 'url-loader',
        options: {
          limit: 8192, // 小于 8KB 的图片转 Base64
          name: '[name].[contenthash].[ext]'
        }
      },
      'image-webpack-loader' // 压缩图片
    ]
  }
  ```

## 四、常见配置示例

### 1. **基础配置（单页应用）**

```javascript
// webpack.config.js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[contenthash].js",
    clean: true, // 每次构建前清空 dist 目录
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
    new MiniCssExtractPlugin(),
  ],
  mode: "production",
};
```

### 2. **开发环境配置（热更新、source map）**

```javascript
// webpack.dev.js
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.config.js");

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    hot: true,
    open: true,
  },
});
```

### 3. **生产环境配置（压缩、分割）**

```javascript
// webpack.prod.js
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.config.js");
const TerserPlugin = require("terser-webpack-plugin");
const CssMinimizerPlugin = require("css-minimizer-plugin");

module.exports = merge(baseConfig, {
  mode: "production",
  optimization: {
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    splitChunks: {
      chunks: "all",
    },
  },
});
```

## 五、生态与常用插件

### 1. **常用 Loader**

- `babel-loader`：转译 ES6+ 代码。
- `ts-loader`/`awesome-typescript-loader`：编译 TypeScript。
- `style-loader`/`css-loader`/`sass-loader`：处理 CSS/SCSS。
- `file-loader`/`url-loader`/`asset modules`（Webpack 5 内置）：处理文件/图片。
- `html-loader`：处理 HTML 中的 `src` 引用。

### 2. **常用 Plugin**

- `HtmlWebpackPlugin`：生成 HTML 文件。
- `MiniCssExtractPlugin`：提取 CSS 为独立文件。
- `CleanWebpackPlugin`：清理构建目录。
- `DefinePlugin`：定义环境变量。
- `CopyWebpackPlugin`：复制静态文件。
- `BundleAnalyzerPlugin`：分析打包体积（可视化依赖图）。

### 3. **集成框架**

- **React**：通过 `@babel/preset-react` 支持 JSX。
- **Vue**：使用 `vue-loader` 和 `vue-template-compiler`。
- **TypeScript**：通过 `ts-loader` 或 `babel-loader`（需 `@babel/preset-typescript`）。

## 六、常见问题与解决方案

1. **打包速度慢**：

   - 启用缓存（`cache: { type: 'filesystem' }`）。
   - 使用 `thread-loader` 并行处理。
   - 排除不必要的文件（如 `node_modules`）。

2. **体积过大**：

   - 启用 Tree-shaking（使用 ES6 模块、生产模式）。
   - 代码分割（`splitChunks`）。
   - 压缩图片（`image-webpack-loader`）。
   - 使用 `BundleAnalyzerPlugin` 分析依赖。

3. **HMR 不生效**：

   - 确保 `devServer.hot: true`。
   - 使用框架官方 HMR 插件（如 `react-refresh`、`vue-loader` 内置 HMR）。

4. **生产环境 CSS 未分离**：
   - 使用 `MiniCssExtractPlugin` 替代 `style-loader`。
   - 确保在生产配置中引入该插件。

## 七、Webpack 5 新特性

- **内置模块联邦（Module Federation）**：跨应用共享代码（如微前端）。
- **资源模块（Asset Modules）**：替代 `file-loader`/`url-loader`，内置 `asset/resource`、`asset/inline` 等类型。
- **持久缓存**：默认启用文件系统缓存，加速二次构建。
- **更好的 Tree-shaking**：改进对 CommonJS 模块的分析。
- **移除 Node.js polyfill**：需手动引入（如 `process`、`Buffer`）。

## 总结

Webpack 的核心在于通过 **Loader 处理模块**、**Plugin 扩展功能**、**配置优化构建**，掌握其核心概念（入口、输出、Loader、Plugin）和高级特性（Tree-shaking、代码分割）是高效使用的关键。实际项目中需根据场景灵活配置，平衡开发体验与生产性能。
