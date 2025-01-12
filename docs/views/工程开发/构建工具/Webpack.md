# Webpack

<sucb>[Webpack](https://www.webpackjs.com/)</sucb>是一个开源的 JavaScript 模块打包器（module bundler），主要用于现代 Web 应用程序的开发。它的主要功能是<err>将各种资源（如 JavaScript 文件、CSS 样式表、图片等）和模块打包成一个或多个优化过的、生产环境可用的静态资源包</err>。Webpack 通过解析项目的依赖图谱，智能地分析和打包这些依赖，以生成最终的静态文件，这些文件可以被 Web 服务器直接提供给浏览器。

[参考：「前端工程化」之 Webpack 原理与实践（彻底搞懂吃透 Webpack）汪磊原版](https://www.bilibili.com/video/BV1kP41177wp?p=19&spm_id_from=pageDriver&vd_source=7ad8763982331e35cdf2ae4d2b70b1af)

### 主要特点

1. <sucb>模块打包</sucb>：Webpack 能够处理各种类型的模块，如 CommonJS、AMD、ES6 模块等，将它们打包成一个或多个文件。
2. <sucb>插件系统</sucb>：Webpack 拥有一个强大的插件系统，可以扩展其功能，如代码压缩、热模块替换（Hot Module Replacement, HMR）、资源优化等。
3. <sucb>Loaders</sucb>：Webpack 使用 Loaders 来预处理不同类型的文件，如 Babel loader 可以将 ES6 转换为浏览器可识别的 ES5 代码，CSS loader 可以处理 CSS 文件，File loader 可以处理图片和其他静态资源。
4. <sucb>入口和出口</sucb>：Webpack 允许定义一个或多个入口点，每个入口点将被解析成一个或多个输出文件（chunks），这些文件可以被浏览器加载和执行。
5. <sucb>代码分割</sucb>：Webpack 支持动态和静态的代码分割，可以将代码分成多个小文件，只在需要时加载，从而减少初始加载时间。
6. <sucb>热更新和开发服务器</sucb>：Webpack Dev Server 提供了实时重新加载和热模块替换的功能，当源代码发生变化时，可以自动更新浏览器中的内容，无需刷新页面。

### 基本流程

1. <sucb>安装 Webpack</sucb>：通过 npm 或 yarn 安装 Webpack 和相关 loader、plugins。
2. <sucb>配置 Webpack</sucb>：在项目根目录下创建一个 webpack.config.js 文件，定义入口、输出、loaders、plugins 等配置。
3. <sucb>运行 Webpack</sucb>：通过命令行运行 Webpack，生成打包后的文件。
4. <sucb>部署</sucb>：将生成的静态资源部署到 Web 服务器上。

## 1.基础篇：理解 Webpack 的基本概念与用法

### 1.1.安装 Webpack

首先确保你已经安装了 Node.js，然后使用 npm 或 yarn 全局或局部安装 Webpack。

```sh
#
npm install webpack webpack-cli
#
yarn global add webpack webpack-cli
```

执行打包

```json
// package.json
{
  "scripts": {
    "build": "webpack",
    "build": "webpack --config webpack.config.js",
    "build": "webpack --mode production",
    "build": "webpack --watch",
    // 将制定文件打包到指定文件（生产环境比开发环境多了压缩代码和代码混淆）
    "build": "webpack ./src/index.js -o ./dist/bundle.js --mode development"
  }
}
```

### 1.2.创建配置文件

了解 [<sucb>webpack.config.js</sucb>](../../软技能/面试题/Webpack%20相关/7_webpack配置.md) 的基本结构，包括 entry（入口）、output（输出）、module.rules（模块规则）等基本配置项。

```js
// webpack.config.js
const path = require("path");
module.exports = {
  // 入口文件
  entry: "./src/index.js",
  output: {
    // 输出文件名称
    filename: "bundle.js",
    // 输出路径，绝对路径
    path: path.resolve(__dirname, "dist"),
  },
  // 开发模式：development/production
  mode: "development",
};
```

> [1. 配置文件（webpack.config.js）：多入口和多出口](#_7-1-配置文件-webpack-config-js-多入口和多出口-返回)<br/>
>
> [2. 配置文件（webpack.config.js）：服务和热更新](#_7-2-配置文件-webpack-config-js-服务和热更新-返回)<br/>
>
> [3. 配置文件（webpack.config.js）：css 文件打包](#_7-3-配置文件-webpack-config-js-css-文件打包-返回)<br/>
>
> [4. 配置文件（webpack.config.js）：js 文件压缩、打包](#_7-4-配置文件-webpack-config-js-js-文件压缩、打包-返回)<br/>
>
> [5. 配置文件（webpack.config.js）：html 文件的发布](#_7-5-配置文件-webpack-config-js-html-文件的发布-返回)<br/>
>
> [6. 配置文件（webpack.config.js）：css 中图片处理](#_7-6-配置文件-webpack-config-js-css-中图片处理-返回)<br/>
>
> [7. 配置文件（webpack.config.js）：css 分离与图片路径处理](#_7-7-配置文件-webpack-config-js-css-分离与图片路径处理-返回)<br/>
>
> [8. 配置文件（webpack.config.js）：处理 html 中的图片](#_7-8-配置文件-webpack-config-js-处理-html-中的图片-返回)<br/>
>
> [9. 配置文件（webpack.config.js）：less 文件打包和分离](#_7-9-配置文件-webpack-config-js-less-文件打包和分离-返回)<br/>
>
> [10. 配置文件（webpack.config.js）：scss 文件打包和分离](#_7-10-配置文件-webpack-config-js-scss-文件打包和分离-返回)<br/>
>
> [11. 配置文件（webpack.config.js）：自动处理 css3 兼容性前缀](#_7-11-配置文件-webpack-config-js-自动处理-css3-兼容性前缀-返回)<br/>
>
> [12. 配置文件（webpack.config.js）：消除未使用的 css 样式](#_7-12-配置文件-webpack-config-js-消除未使用的-css-样式-返回)<br/>
>
> [13. 配置文件（webpack.config.js）：webpack 添加 babel 支持](#_7-13-配置文件-webpack-config-js-webpack-添加-babel-支持-返回)<br/>
>
> [14. 配置文件（webpack.config.js）：集中拷贝静态资源](#_7-14-配置文件-webpack-config-js-集中拷贝静态资源-返回)<br/>
>
> [15. 配置文件（webpack.config.js）：打包后调试](#_7-15-配置文件-webpack-config-js-打包后调试-返回)<br/>
>
> [16. 实战技巧：开发和生产并行设置](#_7-16-实战技巧-开发和生产并行设置-返回)<br/>
>
> [17. 实战技巧：webpack 模块化配置](#_7-17-实战技巧-webpack-模块化配置-返回)<br/>
>
> [18. 实战技巧：打包/引入第三方类库](#_7-18-实战技巧-打包-引入第三方类库-返回)<br/>
>
> [19. 实战技巧：webpack 自动打包](#_7-19-实战技巧-webpack-自动打包-返回)<br/>
>
> [20. 实战技巧：添加注释](#_7-20-实战技巧-添加注释-返回)<br/>
>
> [21. 实战技巧：webpack 优化（抽离第三方类库）](#_7-21-实战技巧-webpack-优化-抽离第三方类库-返回)<br/>

### 1.3.加载器（Loaders）

学习如何使用 Loaders 来预处理不同类型的文件，例如.js、.css、.json、图片文件等。

```js
// webpack.config.js
module.exports = {
  // loader 的配置
  module: {
    // 对某种格式的文件进行处理
    rules: [
      {
        test: /\.css$/, // 使用正则匹配css 结尾的文件
        use: [
          // 将js 的样式内容插入到style 标签里
          "style-loader",
          // 将css 文件转换成js 文件
          "css-loader",
        ], // 使用style-loader和css-loader来处理css文件，执行顺序从后往前执行css-loader->style-loader
      },
      // 对图片文件进行处理
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          // 使用file-loader来处理图片文件
          //   "file-loader",
          // ‘url-loader’ 可以将图片转换为 base64 格式，从而减少 HTTP 请求
          "url-loader",
        ],
        options: {
          // 限制图片大小，小于8k的图片转换为base64
          limit: 8192,
          // 关闭url-loader的es模块化解析
          esModule: true,
          // 图片输出的路径和名称
          name: "img/[name].[hash:8].[ext]",
        },
      },
      // 对html 文件进行处理
      {
        test: /\.html$/,
        use: [
          // 使用html-loader来处理html 文件
          "html-loader",
        ],
      },
    ],
  },
};
```

### 1.4.插件（Plugins）

了解 Webpack 的插件机制，以及一些常用的插件，如 HtmlWebpackPlugin、MiniCssExtractPlugin 等。

```js
// webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
module.exports = {
  // 插件的配置
  plugins: [
    new HtmlWebpackPlugin({
      // html 模版文件路径，并自动引入打包后的js 文件
      template: "./src/index.html",
    }),
  ],
};
```

## 2.进阶篇：编写可维护的 Webpack 构建配置

### 2.1.代码分割（Code Splitting）

学习如何使用 splitChunks 插件来实现动态导入和代码分割，以优化加载性能。

<sucb>代码分割（Code Splitting）</sucb>是 Webpack 的一个重要功能，它允许将应用程序的代码分割成较小的块，从而优化加载时间和性能。代码分割可以分为静态代码分割和动态代码分割两种。

#### 静态代码分割

静态代码分割是指在构建时根据一定的规则将代码分割成多个 chunk。Webpack 提供了多种方式进行静态代码分割，包括：

<prib>1. SplitChunks Plugin</prib>：这是 Webpack 4 引入的内置插件，用于自动分析项目依赖，将共享模块提取到单独的文件中。在<err>optimization.splitChunks</err>选项中配置。

```js
// webpack.config.js
module.exports = {
  // 代码分割的配置
  optimization: {
    splitChunks: {
      // 配置代码分割的规则
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
  },
};
```

<prib>2. 命名 Chunk 和提取公共代码</prib>：你可以指定 chunk 的名字，以便更好地控制和管理生成的文件。

#### 动态代码分割

动态代码分割（Dynamic Code Splitting）是指在运行时按需加载代码，而不是一开始就加载所有代码。Webpack 支持使用 import()语法进行动态导入，这可以实现懒加载和按需加载。

```js
// chunk-file.js
const button = document.querySelector(".load-more");
button.addEventListener("click", () => {
  import("./chunk-file.js").then((module) => {
    module.doSomething();
  });
});
// 不会在页面初始化时加载，而是在用户点击按钮时才加载，这样可以显著提高首次加载的速度。
```

确保你的 Webpack 配置正确地处理了动态导入。虽然 Webpack 默认支持动态导入，但是你可能需要确保没有其他配置阻止了这个行为。例如，确保没有错误的 optimization.splitChunks 配置，或者没有将所有模块打包到单个文件中的设置。

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    chunkFilename: "[name].chunk.js", // 这里配置了动态加载的chunk的名字格式
  },
  mode: "development",
  devtool: "inline-source-map",
  module: {
    rules: [
      // 其他loader规则
    ],
  },
};
```

<bqe>
确保你的构建目标环境支持 ES6 模块。大多数现代浏览器已经支持了 ES6 模块，但如果你的目标环境需要兼容旧版浏览器，你可能需要使用 Babel 或其他工具进行转换。
</bqe>

### 2.2.环境变量与模式（Mode）

了解 mode 配置项，以及如何在开发和生产环境中切换 Webpack 的行为。

Webpack 的 mode 配置项允许你声明构建的模式，这会影响最终的构建优化和资源的生成。Webpack 支持两种模式：development 和 production。这些模式不仅改变了 Webpack 的内部行为，还启用了或禁用了某些优化，从而影响构建过程和输出。

#### Mode 的影响

<prib>Production 模式</prib><br/>

- **启用优化**：在 production 模式下，Webpack 会启用各种优化，如代码压缩、Scope Hoisting、Tree Shaking 等，这些可以减小最终的 bundle 大小，提高加载速度。
- **设置环境变量**：Webpack 会自动设置 process.env.NODE_ENV 环境变量为 'production'，这对于库作者和框架（如 React）非常重要，因为它们可能基于这个变量来调整自己的行为。

<prib>Development 模式</prib><br/>

- **禁用优化**：在 development 模式下，Webpack 不会应用那些可能影响开发体验的优化，如代码压缩，以加快构建速度和调试过程。
- **设置环境变量**：同样地，Webpack 会自动设置 process.env.NODE_ENV 环境变量为 'development'。

#### 环境变量

除了 NODE_ENV，你还可以在 Webpack 配置中定义其他环境变量，这些变量可以在你的代码中使用，从而实现更灵活的开发和构建过程。这可以通过 DefinePlugin 或者 EnvironmentPlugin 来实现。

<prib>DefinePlugin</prib>

- DefinePlugin 可以在编译时定义全局常量，这些常量在编译后的代码中会被替换为具体的值，可以避免运行时的计算。

```js
const webpack = require("webpack");

module.exports = {
  //...
  plugins: [
    new webpack.DefinePlugin({
      "process.env.API_URL": JSON.stringify("http://localhost:3000"),
    }),
  ],
};
```

<prib>EnvironmentPlugin</prib>

- EnvironmentPlugin 用于读取环境变量，如果这些变量在编译时不存在，则会被删除。

```js
const webpack = require("webpack");

module.exports = {
  //...
  plugins: [new webpack.EnvironmentPlugin(["API_URL"])],
};
```

### 2.3.优化构建速度

探索如何优化 Webpack 的构建速度，比如使用缓存、并行构建等策略。

优化 Webpack 的构建速度是提高开发效率的关键。以下是几种可以显著提升 Webpack 构建速度的策略：

#### 1. 使用正确的 Mode

确保你的 Webpack 配置文件中的`mode`设置为`development`或`production`。这会自动应用一系列优化，例如在生产模式下进行代码压缩，在开发模式下则不压缩以便快速构建。

#### 2. 缓存

- **多步缓存**：使用`cache`选项来加速重复的构建。Webpack 5 引入了持久化缓存，可以跨多个构建保留模块的解析和转换结果。

```js
module.exports = {
  //...
  cache: {
    type: "persistent", // 使用持久化缓存
    cacheDirectory: "./node_modules/.cache/webpack", // 缓存文件的存放位置
    store: "pack", // 使用 pack 存储，适合多核 CPU 和多进程环境
  },
};
```

<bqe>
<b>注意</b>：持久化缓存需要 Node.js 8.0.0 或更高版本。<br/>
<b>注意</b>：为了保证缓存的一致性，可以使用 HashedModuleIdsPlugin 插件来生成稳定的模块 ID。<br/>
<b>注意</b>：为了充分利用多核 CPU 的优势，可以使用 cacheStore 选项配合 Type: 'pack'，这样可以并行处理多个模块。<br/>
<b>注意</b>：为了提高缓存命中率，可以使用 cacheDirectory 选项来指定缓存文件的存放位置。<br/>
<b>注意</b>：当你的项目结构或配置发生改变时，记得清理缓存，否则旧的缓存可能会影响到新的构建结果。你可以在项目中使用 npm run clean 或 yarn cache clean 等命令来清理缓存。<br/>
<b>注意</b>：在构建过程中，可以使用`--no-cache`选项来禁用缓存。<br/>
<b>注意</b>：如果你在不同的环境中使用相同的源代码，但构建配置有所不同，可能需要为每个环境配置独立的缓存目录，以免缓存冲突。<br/>
</bqe>

#### 3. [分割代码（Code Splitting）](#代码分割-code-splitting)

- **动态导入（Dynamic Imports）**：使用`import()`语法来异步加载代码，这样可以按需加载代码而不是一次性打包所有代码。
- **SplitChunksPlugin**：利用 Webpack 内置的插件来分割共享的模块到独立的 chunk 中，减少主 bundle 的大小。

#### 4. 优化 Loaders

- **减少 Loader 的数量**：尽可能减少 Loader 的使用，过多的 Loader 会增加构建时间。

- **配置优化**：检查是否有更新的 loader 版本或者替代方案，有时候新版本的 loader 或者替代 loader 可能更加高效。

- **并行处理**：使用`thread-loader`或`happy-pack`等插件来并行执行 Loader，尤其是对大文件进行处理时。

```js
// thread-loader: 利用多核 CPU 进行并行加载。例如，Babel Loader 和 TypeScript Loader 都可以从并行处理中获益。
// webpack.config.js
// module.exports.module.rules
{
  test: /\.js$/,
  use: [
    {
      loader: "thread-loader",
      options: {
        workers: 4, // 使用 4 个子进程
      },
    },
    {
      loader: "babel-loader",
    },
  ],
}
```

- **按需加载**：通过`cache-loader`插件缓存 Loader 的输出，避免重复处理相同模块。

```js
// - babel-loader 的 cacheDirectory 选项：开启缓存，对于未更改的文件不会重新编译。
// - cache-loader: 可以缓存任何 loader 的输出，减少重复计算。
// webpack.config.js
// module.exports.module.rules
{
  test: /\.js$/,
  use: [
    'cache-loader',
    'thread-loader',
    {
      loader: 'babel-loader',
      options: {
        cacheDirectory: true,
      },
    },
  ],
}
```

- **限制作用范围**：通过`exclude`和`include`选项来限定 Loader 作用的文件范围，避免不必要的文件处理。

```js
// webpack.config.js
// module.exports.module.rules
{
  test: /\.js$/,
  exclude: /node_modules/, // 排除 node_modules 目录下的文件
  use: 'babel-loader',
}
```

- **使用多阶段构建**：将复杂的构建过程拆分为多个步骤，使用不同的 loader 组合，可以在一定程度上提高构建效率。

- **使用 MiniCssExtractPlugin**：如果你在使用 `CSS Loader` 或 `Style Loader`，考虑使用 `MiniCssExtractPlugin` 将 CSS 提取到单独的文件中，而不是内联到 JavaScript 中，这样可以减少 JavaScript 文件的体积，并且提高页面加载速度。

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  //...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 代替 style-loader
          "css-loader",
        ],
      },
      {
        test: /\.s[ac]ss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css", // 输出文件名
      chunkFilename: "[id].css", // 异步 chunk 文件名
    }),
  ],
};
```

<bqe>
解析配置
<br/>MiniCssExtractPlugin.loader: 用于将 CSS 文件从 JS 文件中提取出来。
<br/>'css-loader': 用于解析 @import 和 url() 等 CSS 语法。
<br/>'sass-loader': 如果你使用 SCSS 或 SASS，还需要这个 loader 来处理它们。
<br/>
<br/>MiniCssExtractPlugin 的配置项：
<br/>filename: 定义生成的 CSS 文件名，[name] 代表模块的名称。
<br/>chunkFilename: 定义异步 chunk 的 CSS 文件名，[id] 代表 chunk 的 id。
</bqe>

<bqw>
注意
<br/>如果你在开发环境中使用 MiniCssExtractPlugin，可能需要额外的配置来实现热更新（HMR）。在开发模式下，通常会使用 style-loader 来直接注入样式到页面中，但在生产环境中，为了优化性能，我们会使用 MiniCssExtractPlugin 来生成独立的 CSS 文件。

</bqw>

- **避免使用 require.context**：`require.context` 虽然方便，但在构建时会生成大量的模块，从而降低构建速度。尽量使用动态导入或者更明确的导入方式。

#### 5. [使用 DllPlugin 和 DllReferencePlugin](#_7-22-优化构建速度-优化-loaders-使用-dllplugin-和-dllreferenceplugin-返回)

这两个插件可以用来预编译不变的依赖项，比如 React 和 Redux，然后在构建项目时引用这些预编译的 dll 文件，从而加速构建。

#### 6. Tree Shaking

确保你的代码和依赖都是 ES 模块格式，Webpack 会自动移除未使用的导出，减少最终输出的代码量。

#### 7. 开发服务器的优化

- **HMR（Hot Module Replacement）**：在开发环境中启用热更新，可以实现在代码改动后无需重新加载整个页面即可看到更改。
- **压缩**：虽然在开发环境下压缩会稍微增加构建时间，但考虑到网络传输速度的提升，总体上可以提高开发效率。

#### 8. 限制文件的读取

- **使用`exclude`和`include`选项**：在配置 Loader 时，合理使用`exclude`和`include`来限定 Loader 作用的文件范围。

#### 9. 监听文件变化

在开发模式下，使用`watch`模式监听文件变化，只对修改过的文件进行重新构建，而不是整个项目。

#### 10. 评估构建性能

使用`webpack-bundle-analyzer`插件来分析你的 bundle，找出哪些模块导致构建变慢，针对性地进行优化。

通过上述方法，你可以大幅度提升 Webpack 的构建速度，从而提高开发效率和团队生产力。不过需要注意的是，每个项目的具体需求不同，可能需要根据实际情况调整优化策略。

## 3.原理篇：深入理解 Webpack 的工作机制

### 3.1.[Webpack 的内部架构](#_7-23-webpack-的内部架构-返回)

深入研究 Webpack 的内部架构和工作流程，包括模块解析、依赖图构建等。

### 3.2.[自定义 Loader 和 Plugin](#_7-24-自定义-loader-和-plugin-返回)

尝试自己编写 Loader 和 Plugin，理解 Webpack 的可扩展性。

## 4.实践篇：应用 Webpack 解决实际问题

### 4.1.真实项目集成

在一个真实的项目中集成 Webpack，处理复杂依赖和多页面应用。

### 4.2.性能优化

针对生产环境进行打包优化，比如压缩、懒加载、长期缓存策略等。

## 5.深入篇：持续关注和学习

### 5.1.社区和文档

定期阅读 Webpack 的官方文档和社区文章，了解最新的特性和最佳实践。

### 5.2.版本升级

随着 Webpack 的版本迭代，学习新版本的特性，保持你的知识库更新。

### 5.3.问题解决

遇到问题时，学会使用错误信息和调试工具来定位和解决问题。

## 6.推荐资源

### 6.1.官方文档

Webpack 的官方文档是最权威的学习资源，应该作为学习的主要参考。

### 6.2.在线课程

可以查找一些高质量的在线课程，如 Udemy、Pluralsight 上的教程。

### 6.3.社区和论坛

加入 GitHub、Stack Overflow、Reddit 等社区，与其他开发者交流经验和技巧。

### 6.4.书籍

虽然市面上关于 Webpack 的书籍不多，但是一些高质量的电子书和教程仍然值得阅读。
遵循这个路线图，你可以系统地学习 Webpack，并逐渐成为一个 Webpack 专家。

## 7.备注

### 7.1.配置文件（webpack.config.js）：多入口和多出口 

```js
const path = require("path");
module.exports = {
  //入口文件的配置项
  entry: {
    entry: "./src/entry.js",
    // entry2: './src/entry2.js', /* 多入口 */
  },
  //出口文件的配置项
  output: {
    //输出的路径，用了Node语法
    path: path.resolve(__dirname, "dist"),
    //输出的文件名称
    filename: "bundle.js",
    // filename: '[name].js' /* 多出口 */
    // [name]的意思是根据入口文件的名称，打包成相同的名称，有几个入口文件，就可以打包出几个文件。
  },
  //模块：例如解读CSS,图片如何转换，压缩
  module: {},
  //插件，用于生产模版和各项功能
  plugins: [],
  //配置webpack开发服务功能
  devServer: {},
};
```

### 7.2.配置文件（webpack.config.js）：服务和热更新 

（1）安装**webpack-dev-server**
`npm i webpack-dev-server -D`

（2）配置命令语句（package.json）

```json
"script": {
    "server": "webpack-dev-server"
}
```

（3）配置 webpack（webpack.config.js）

```js
const path = require("path");
module.exports = {
  // ...
  devServer: {
    // contentBase:path.resolve(__dirname,'dist'), /* webpack 3.x.x */
    static: "./dist",
    /* webpack 4.x.x */
    host: "192.168.1.100",
    compress: true,
    port: 8080,
  }, //  配置webpack服务
};
```

（4）配置代理（webpack.config.js）

```js
module.exports = {
  // 其他配置...
  devServer: {
    // 代理配置
    proxy: {
      "/api": {
        target: "http://example.com", // 目标服务器地址
        changeOrigin: true, // 修改请求头中的host字段为target的地址
        pathRewrite: { "^/api": "" }, // 可选：重写路径
        secure: false, // 如果是https目标，则设置为true，默认false
        ws: true, // 支持WebSocket
      },
    },
    hot: true, // 热更新
    open: true, // 自动打开浏览器
  },
};
```

（5）启动
`npm run server`

### 7.3.配置文件（webpack.config.js）：css 文件打包 

（1）src 目录下创建 css 文件，并在入口文件（entry.js）中引入
`import css from './css/index.css'`

（2）安装 css 文件加载器依赖（style-loader\css-loader）
`npm i style-loader css-loader -D`

<bqe>
注意：<br/>
启动报错：<b>TypeError: this.getOptions is not a function</b> <br>
原因：style-loader 或 css-loader 与 webpack 版本不兼容导致，可适当降低 style-loader 及 css-loader 版本
</bqe>

（3）配置 webpack 加载器（webpack.config.js）

```js
const path = require("path");
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  // ...
};
```

（4）启动
`npm run server`

### 7.4.配置文件（webpack.config.js）：js 文件压缩、打包 

（1）安装缩小(压缩优化)js 文件插件**uglifyjs-webpack-plugin**
`npm i uglifyjs-webpack-plugin -D`

（2）webpack 配置（webpack.config.js）

```js
const uglify = require("uglifyjs-webpack-plugin");

module.exports = {
  //插件，用于生产模版和各项功能
  plugins: [new uglify()],
};
```

（3）启动
`npm run server`

### 7.5.配置文件（webpack.config.js）：html 文件的发布 

（1）安装依赖**html-webpack-plugin**
`npm i html-webpack-plugin -D`

（2）配置 webpack

```js
const htmlPlugin = require("html-webpack-plugin");

module.exports = {
  //插件，用于生产模版和各项功能
  plugins: [
    new htmlPlugin({
      minify: {
        removeAttributeQuotes: true,
      },
      hash: true,
      template: "./src/index.html",
    }),
  ],
};
```

（3）启动
`npm run server`

<bqe>
注意：
<br> 启动报错：TypeError: Cannot read property 'tap' of undefined
<br> 原因：html-webpack-plugin 版本不兼容
</bqe>

### 7.6.配置文件（webpack.config.js）：css 中图片处理 

（1）安装依赖
`npm i file-loader url-loader -D`

（2）配置 webpack

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(png|jpg|gif)/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 50000,
            },
          },
        ],
      },
    ],
  },
};
```

（3）启动
`npm run server`

### 7.7.配置文件（webpack.config.js）：css 分离与图片路径处理 

（1）安装依赖
`npm i extract-text-webpack-plugin -D`

（2）引入插件
`const extractTextPlugin = require("extract-text-webpack-plugin")`

（3） 配置

```js
onst extractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
    module: {
        rules: [{
                test: /\.css$/,
                // use: ['style-loader', 'css-loader']
                use: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|jpg|gif)/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 50000
                    }
                }]
            }
        ]
    },
    plugins: [
        new extractTextPlugin('/css/index.css') // 打包到该文件中，less/scss 文件同样合并到该文件
    ]
}
```

（4）配置公共路径

```js
var website = {
    publicPath: 'http://192.168.31.113:8080/'
}
module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js,
        publicPath: website.publicPath
    }
}
```

（5）启动
`webpack`

<bqe>
注意：
<br> 打包报错：TypeError: text.forEach is not a function
<br> 原因：css-loader 版本太高，降低版本
<br> 启动报错：Chunk.entrypoints: Use Chunks.groupsIterable and filter by instanceof Entrypoint instead
<br> 原因：extract-text-webpack-plugin 还不能支持 webpack4.0.0 以上的版本
<br> 解决：npm install –save-dev extract-text-webpack-plugin@next
</bqe>

### 7.8.配置文件（webpack.config.js）：处理 html 中的图片 

（1）安装依赖
`npm i html-withimg-loader -D`

（2）配置

```js
const htmlPlugin = require("html-webpack-plugin");
module.exports = {
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 50,
              outputPath: "images/", // 打包后的图片放到指定文件夹
            },
          },
        ],
      },
      {
        test: /\.(htm|html)$/i,
        use: ["html-withimg-loader"],
      },
    ],
  },
  //插件，用于生产模版和各项功能
  plugins: [
    new htmlPlugin({
      minify: false,
      // minify: {
      //     removeAttributeQuotes: true // 移除属性的引号
      // },
      hash: true,
      template: "./src/index.html",
    }),
    new extractTextPlugin("/css/index.css"),
  ],
};
```

（3）打包
`webpack`

<bqe>
注意：
<br> 启动报错：Error: html-webpack-plugin could not minify the generated output.
<br> 解决：（webpack.config.js）plugins 中对'html-webpack-plugin' 配置 **minify: false** 
<br>
</bqe>

### 7.9.配置文件（webpack.config.js）：less 文件打包和分离 

（1）安装依赖
`npm install less less-loader -S`

（2）配置

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
          },
        ],
      },
    ],
  },
};
```

（3） 分离 less

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.less$/,
        use: extractTextPlugin.extract({
          use: [
            {
              loader: "css-loader",
            },
            {
              loader: "less-loader",
            },
          ],
          fallback: "style-loader",
        }),
      },
    ],
  },
  plugins: [
    new extractTextPlugin("/css/index.css"), // 打包到该文件中，less/scss 文件同样合并到该文件
  ],
};
```

<bqe>
注意：
<br> 启动报错：TypeError: this.getOptions is not a function
<br> 原因：less-loader 版本过高
<br> 解决：推荐把 less-loader 版本降到@6
</bqe>

### 7.10.配置文件（webpack.config.js）：scss 文件打包和分离 

（1）安装依赖

> 注意：sass-loader 依赖 node-sass 所以需要先安装 node-sass

`npm i node-sass sass-loader -S`

<bre>
注意：
<br> - 安装 node-sass 报错： stack Error: Could not find any Python installation to use
<br> 原因：未安装依赖 python
<br> - 安装 python 后报错：gyp ERR! find VS msvs_version not set from command line or npm config
<br> 原因：python 版本过高，可以尝试将 python 版本降低到@2.7
</bre>

（2）配置

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
};
```

<bqe>
注意：
<br/> - 启动报错：TypeError: this.getOptions is not a function
<br/> 原因：sass-loader 版本过高
<br/> 
<br/> - 启动报错：Node Sass version 7.0.1 is incompatible with ^4.0.0 || ^5.0.0 || ^6.0.0.
<br/> 原因：node-sass 版本过高，降低版本到@4
<br/> 
<br/> - 启动报错：Cannot find module 'node-sass'
<br/> 原因：低版本 node-sass 不兼容，可以使用 sass 来编译 scss 文件
<br/> 解决：卸载 node-sass，安装 sass，适配版本（sass，sass-loader@10）
</bqe>

（3）分离 scss

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: extractTextPlugin.extract({
          use: [
            {
              loader: "css-loader",
            },
            {
              loader: "sass-loader",
            },
          ],
          fallback: "style-loader",
        }),
      },
    ],
  },
  plugins: [
    new extractTextPlugin("/css/index.css"), // 打包到该文件中，less/scss 文件同样合并到该文件
  ],
};
```

### 7.11.配置文件（webpack.config.js）：自动处理 css3 兼容性前缀 

（1）安装依赖
`npm i postcss-loader autoprefixer -S`

（2）配置（./postcss.config.js）
这就是对 postCSS 一个简单的配置，引入了 autoprefixer 插件。让 postCSS 拥有添加前缀的能力，它会根据 can i use 来增加相应的 css3 属性前缀。

```js
module.exports = {
    plugins: {
        require('autoprefixer')
    }
}
```

（3）配置（webpack.config.js）

```js
onst extractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {

    module: {
        rules: [{
            test: /\.css$/,
            use: extractTextPlugin.extract({
                fallback: "style-loader",
                use: [{
                    loader: "css-loader",
                    options: {
                        importLoaders: 1
                    }
                }, 'postcss-loader']
            })
        }]
    }

}
```

<bqe>
注意：
<br/>> 启动报错：TypeError: this.getOptions is not a function
<br/> 原因：postcss-loader 或 autoprefixer 版本过高
<br/>> 启动报错： Error: PostCSS plugin autoprefixer requires PostCSS 8.
<br/> 原因：autoprefixer 版本过高，不兼容当前版本的 postcss-loader
<br/> 解决：npm i postcss-loader@4 autoprefixer@8 -S
</bqe>

### 7.12.配置文件（webpack.config.js）：消除未使用的 css 样式 

（1）安装依赖
`npm i purifycss-webpack purify-css -S`

（2）配置

```js
const path = require("path");
const glob = require("glob");
const purifyCssPlugin = require("purifycss-webpack");

module.exports = {
  plugins: [
    new purifyCssPlugin({
      paths: glob.sync(path.join(__dirname, "src/*.html")), //src下所有的html
    }),
  ],
};
```

（3）打包

### 7.13.配置文件（webpack.config.js）：webpack 添加 babel 支持 

（1）安装依赖
`npm i babel-core babel-loader babel-preset-es2015 babel-preset-react -S`

<bqw>
说明：
<br> babel-core：核心功能
<br> babel-preset-es2015：解析 ES6
<br> babel-preset-react：解析 JSX
</bqw>

（2）配置

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["es2015", "react"],
          },
        },
        exclude: /node_modules/,
      },
    ],
  },
};
```

（3）打包

<bqe>
注意：
<br> 启动报错：If you'd like to use Babel 6.x ('babel-core'), you should install 'babel-loader@7'.
<br> 原因：babel-loader 版本太高，不适配
</bqe>

### 7.14.配置文件（webpack.config.js）：集中拷贝静态资源 

打包时保留这些静态资源（比如设计图、开发文档），直接打包到制定文件夹。
（1）安装依赖
`npm i copy-webpack-plugin -S`

（2）配置

```js
const copyWebpackPlugin = require("copy-webpack-plugin");
module.exports = {
  //插件，用于生产模版和各项功能
  plugins: [
    new copyWebpackPlugin({
      patterns: [
        {
          from: __dirname + "/src/public", //打包的静态资源目录地址
          to: "./public", //打包到dist下面的public
        },
      ],
    }),
  ],
};
```

<bqe>
注意：
<br> 打包报错： Invalid options object. Copy Plugin has been initialized using an options object that does not match the API schema.
<br> 原因：copyWebpackPlugin 配置错误
<br> 打包报错：TypeError: compilation.getCache is not a function
<br> 原因：copy-webpack-plugin 版本太高
</bqe>

### 7.15.配置文件（webpack.config.js）：打包后调试 

（1）配置 devtool

- source-map: 在一个单独文件中产生一个完整且功能完全的文件。这个文件具有最好的 source map, 但是它会减慢打包速度；
- cheap-module-source-map: 在一个单独的文件中产生一个不带列映射的 map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号）, 会对调试造成不便。
- eval-source-map: 使用 eval 打包源文件模块，在同一个文件中生产干净的完整版的 sourcemap，但是对打包后输出的 JS 文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定要不开启这个选项。
- cheap-module-eval-source-map: 这是在打包文件时最快的生产 source map 的方法，生产的 Source map 会和打包后的 JavaScript 文件同行显示，没有影射列，和 eval-source-map 选项具有相似的缺点。
  四种打包模式，有上到下打包速度越来越快，不过同时也具有越来越多的负面作用，较快的打包速度的后果就是对执行和调试有一定的影响。

个人意见是，如果大型项目可以使用 source-map，如果是中小型项目使用 eval-source-map 就完全可以应对，需要强调说明的是，source map 只适用于开发阶段，上线前记得修改这些调试设置。

```js
module.exports = {
  devtool: "eval-source-map", // 打包调试
  entry: {
    /*...*/
  },
};
```

### 7.16.实战技巧：开发和生产并行设置 

（1）安装生产环境的依赖包
`npm i --production`

（2）配置生产环境和开发环境并行

```json
// package.json
{
  "scripts": {
    "dev": "set type=dev&webpack",
    "prod": "set type=prod&webpack"
  }
}
```

```js
// webpack.config.js
if (process.env.type == "prod") {
  var website = {
    publicPath: "http://www.baidu.com/",
  };
} else {
  var website = {
    publicPath: "http://192.168.1.1:8080/",
  };
}
```

### 7.17.实战技巧：webpack 模块化配置 

（1）模块配置（./webpack_config/entry_webpack.js）

```js
const entry = {};
entry.path = {
  entry: "./src/entry.js",
};
module.exports = entry;
```

（2）引入（./webpack.config.js）

```js
const entry = require('./webpack_config/entry_webpack.js')
module.exports = {
    entry.entry.path,
    output: /*...*/
}
```

### 7.18.实战技巧：打包/引入第三方类库 

（1）entry.js 入口文件引入

（2）webpack 全局配置

```js
const webpack = require("webpack");

module.exports = {
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery", // 需提前安装jquery 依赖
    }),
  ],
};
```

### 7.19.实战技巧：webpack 自动打包 

（1）配置（webpack.config.js）

```js
module.exports = {
  entry: "....",
  devServer: {},
  watchOptions: {
    poll: 1000, // 监测修改时间（ms）
    aggregateTimeout: 500, // 防止重复按键
    ignored: /node_modules/, // 不监测
  },
};
```

（2）打包
`webpack --watch `

### 7.20.实战技巧：添加注释 

（1）配置（webpack.config.js）

```js
module.exports = {
  entry: "....",
  devServer: {},
  plugins: [new webpack.BannerPlugin("*** 版权所有！")],
  watchOptions: {
    poll: 1000, // 监测修改时间（ms）
    aggregateTimeout: 500, // 防止重复按键
    ignored: /node_modules/, // 不监测
  },
};
```

### 7.21.实战技巧：webpack 优化（抽离第三方类库） 

（1）配置：抽离 jquery，vue

```js
module.exports = {
  entry: {
    entry: "./src/entry.js",
    jquery: "jquery",
    vue: "vue",
  },
};
```

（2）配置：引入

```js
module.exports = {
  plugins: [
    // webpack 4 之前版本
    new webpack.optimize.CommonsChunkPlugin({
      name: ["jquery", "vue"], // 对应入口文件中配置
      filename: "assets/js/[name].js", // 抽离位置
      minChunks: 2, // 抽离文件数量
    }),
  ],
  // webpack 4 之后版本
  optimization: {
    runtimeChunk: {
      name: "manifest",
    },
    splitChunks: {
      maxInitialRequests: 10, // 入口点的最大并行请求数
      cacheGroups: {
        common: {
          name: "common",
        },
      },
    },
  },
};
```

（3）打包
`webpack`

<bqe>
注意：
<br> 打包报错： Error: webpack.optimize. CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead.
<br> 原因：webpack4 移除了 CommonsChunkPlugin
</bqe>

### 7.22.优化构建速度-优化 Loaders：使用 DllPlugin 和 DllReferencePlugin <rt>[返回](#_5-使用-dllplugin-和-dllreferenceplugin)</rt>

Webpack 的 `DllPlugin` 和 `DllReferencePlugin` 是一组强大的工具，用于预编译和重用代码库，特别适用于那些不经常更改的依赖项，如 React 或者 lodash 这样的大型库。通过使用这些插件，你可以显著提高构建速度，并且减少每次构建时需要重复执行的工作量。

<h3>DllPlugin - 创建动态链接库 (Dynamic Link Library)</h3>

`DllPlugin` 被用来创建一个动态链接库，它可以包含多个包的编译结果。这个 DLL 文件可以被多次引用，而不需要重新编译。

#### 如何使用 DllPlugin:

1. **创建 DLL 构建配置** (`webpack.dll.config.js`):

```javascript
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: {
    vendor: ["react", "react-dom"], // 你要打包成 DLL 的依赖项
  },
  output: {
    library: "[name]_library", // 导出的全局变量名称
    filename: "[name]-manifest.json", // manifest 文件
    path: path.resolve(__dirname, "dll"), // DLL 文件输出路径
  },
  plugins: [
    new webpack.DllPlugin({
      name: "[name]_library", // 必须与 output.library 相同
      path: path.join(__dirname, "dll", "[name]-manifest.json"), // manifest 文件的完整路径
    }),
  ],
};
```

2. **运行 DLL 构建**:

```sh
webpack --config webpack.dll.config.js
```

这将生成两个文件：一个是 `vendor-manifest.json`，它包含了编译后的模块映射；另一个是 `vendor.js`，包含了打包好的依赖库。

<h3>DllReferencePlugin - 引用动态链接库</h3>

`DllReferencePlugin` 被用来在你的主应用中引用之前创建的 DLL 文件。这样，你的应用就不会再次编译相同的依赖项，而是直接使用已经编译好的 DLL 文件。

#### 如何使用 DllReferencePlugin:

1. **修改你的主要 Webpack 配置** (`webpack.common.config.js`):

```javascript
const path = require("path");
const webpack = require("webpack");

module.exports = {
  //...
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, "dll", "vendor-manifest.json"), // 指向你的 manifest 文件
    }),
  ],
  externals: {
    // 这里定义了哪些依赖项应该被外部化，使用与 DllPlugin 相同的名字
    vendor_library: "vendor_library",
  },
};
```

2. **在你的源代码中引用 DLL 库**:

你必须在你的代码中使用 `require` 或 `import` 来声明这些库，尽管它们不会被实际地添加到构建产物中，因为它们已经被外部化了。

```javascript
// 在你的应用代码中
import React from "vendor_library";
import ReactDOM from "vendor_library";

ReactDOM.render(<React.Component />, document.getElementById("root"));
```

通过这种方式，你就可以利用 `DllPlugin` 和 `DllReferencePlugin` 来优化构建流程，避免对频繁变化的代码进行不必要的重复编译。

### 7.23.Webpack 的内部架构 <rt>[返回](#webpack-的内部架构)</rt>

Webpack 的内部架构相当复杂且强大，它由多个核心概念和组件组成，这些组件协同工作以完成模块打包和优化任务。以下是 Webpack 内部架构的一些关键组成部分：

#### 1. 模块(Module)

模块是 Webpack 的核心概念之一，它可以是任何资源，如 JavaScript 文件、CSS 文件、图片等。每个模块都表示一个可独立编译的单元，模块可以相互依赖，形成依赖图。

#### 2. 缓存(Cache)

Webpack 使用缓存机制来存储和重用中间编译结果，这可以显著加快构建速度。在多次构建之间，如果模块或其依赖没有改变，Webpack 将从缓存中读取模块的编译结果，而不是重新编译。

#### 3. 解析(Resolve)

解析是 Webpack 确定模块依赖关系的过程。当 Webpack 遇到一个模块引用时，它会解析该引用，查找实际的模块文件，然后继续解析该模块的依赖。这个过程会递归进行，直到构建完整的依赖图。

#### 4. 加载器(Loader)

加载器是 Webpack 的一大特色，它们允许 Webpack 处理各种类型的文件。加载器接收一个资源作为输入，并输出一个模块，这个模块可以被其他模块所依赖。加载器可以串联使用，形成一条加载链。

#### 5. 插件(Plugin)

插件是在特定时机被调用的函数，它们可以修改 Webpack 的行为，如优化输出、添加文件、修改模块等。插件在整个编译生命周期的各个阶段都有机会介入，提供高度的灵活性和扩展性。

#### 6. 优化(Optimization)

Webpack 提供了多种优化选项，如模块树摇动(Tree shaking)、代码分割(Code splitting)、模块合并(Module concatenation)等，这些优化可以显著减小程序包的大小，提高加载速度和性能。

#### 7. 编译(Compilation)

编译是 Webpack 将所有模块和依赖打包成一个或多个输出文件的过程。在编译过程中，Webpack 会执行所有加载器和插件，处理模块依赖，进行代码转换和优化，最后生成输出文件。

#### 8. 输出(Output)

输出是编译的最终结果，即 Webpack 生成的静态资源文件，如 JavaScript、CSS、图片等。输出配置决定了这些文件的名称、路径和格式。

#### 9. 执行环境(Execution Context)

Webpack 在执行模块代码时会创建一个沙箱环境，这个环境包含了模块的导出和导入逻辑，以及运行时代码，如模块注册和解析逻辑。

Webpack 的内部架构设计得非常灵活和可扩展，通过组合不同的加载器和插件，可以处理几乎任何类型的资源和依赖，同时提供了丰富的优化选项，以适应不同的开发和生产需求。

### 7.24.自定义 Loader 和 Plugin <rt>[返回](#自定义-loader-和-plugin)</rt>

Webpack 的强大之处在于它的高度可定制性和可扩展性，主要通过自定义 Loader 和 Plugin 实现。下面我将分别介绍如何自定义 Loader 和 Plugin。

#### 自定义 Loader

Loader 是在模块被包含到 bundle 中之前对模块进行预处理的工具。你可以编写自己的 Loader 来处理特定类型的文件。Loader 可以是同步的也可以是异步的。以下是一个简单的自定义 Loader 示例，用于将所有字符串转换为大写：

```javascript
// upper-case-loader.js
module.exports = function (source) {
  // source 是当前 loader 正在处理的模块的源代码
  return source.toUpperCase();
};
```

为了使 Loader 能够被 Webpack 识别，你需要在 `webpack.config.js` 中的 `module.rules` 配置中引用它：

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/, // 匹配 .txt 文件
        use: "upper-case-loader", // 使用上面定义的 loader
      },
    ],
  },
};
```

如果你的 Loader 需要异步操作，例如读取文件或网络请求，可以使用异步 Loader：

```javascript
// async-upper-case-loader.js
module.exports = function (source) {
  const callback = this.async(); // 创建异步回调函数
  setTimeout(() => {
    callback(null, source.toUpperCase());
  }, 100);
};
```

<bqe>
<b>如果你的 Webpack 配置中已经包含了处理 .txt 文件的规则，但 .txt 文件仍然没有被打包</b>
<br/>1. 确保你的 .txt 文件确实位于项目中，并且在你的 index.js 或其他入口文件中被导入或引用。如果没有导入，Webpack 不会知道需要处理这个文件。
<br/>2. 检查是否有其他的配置（如 ignore 规则）意外地忽略了 .txt 文件。
</bqe>

#### 自定义 Plugin

Plugin 是在编译过程中的特定时刻被调用的函数，用于修改编译结果。Plugin 更加灵活，可以访问到整个编译过程的信息。以下是一个简单的 Plugin 示例，用于在输出目录中创建一个文件：

```javascript
// my-plugin.js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync("MyPlugin", (compilation, callback) => {
      // compilation 是当前编译实例
      // 可以访问到所有模块、资产和其他信息
      compilation.assets["my-file.txt"] = {
        source: () => "Hello, World!",
        size: () => 13,
      };
      callback();
    });
  }
}

module.exports = MyPlugin;
```

在 `webpack.config.js` 中使用 Plugin：

```javascript
const MyPlugin = require("./my-plugin");

module.exports = {
  plugins: [new MyPlugin()],
};
```

自定义 Loader 和 Plugin 允许你根据项目需求定制 Webpack 的行为，从而处理复杂的文件类型或实现特定的优化策略。记住，Loader 和 Plugin 都是 Node.js 函数，因此你可以使用所有 Node.js API 和 npm 生态系统中的任何库。
