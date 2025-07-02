# SSR 环境搭建

搭建一个 Vue SSR（Server-Side Rendering）环境涉及多个步骤，包括设置项目结构、配置 Webpack 和其他构建工具、编写服务器端代码等。下面是一个详细的指南，帮助你在本地环境中搭建一个 Vue SSR 项目。

## 相关依赖

```bash
# webpack 相关: webpack webpack-cli webpack-dev-server webpack-merge
npm i webpack webpack-cli webpack-dev-server webpack-merge

# vue 相关: vue vue-loader vue-router vue-template-compiler vue-server-renderer
npm i vue@^2.7 vue-loader@^15 vue-router@^3.6 vue-template-compiler vue-server-renderer

# js 相关: babel-loader @babel/core @babel/preset-env
npm i babel-loader @babel/core @babel/preset-env

# css 相关: vue-style-loader css-loader
npm i vue-style-loader css-loader

# other 相关: express html-webpack-plugin
npm i express html-webpack-plugin
```

## 第一阶段，简易 Vue 环境搭建

## Vue 文件

### `main.js` 文件

```javascript
// src/main.js
import Vue from "vue";
import App from "./App.vue";

new Vue({
  render: (h) => h(App),
}).$mount("#app");
```

### `app.vue` 文件

```vue
<!-- src/app.vue -->
<template>
  <div>
    <Demo msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
  import Demo from "./components/Demo.vue";
  export default {
    name: "App",
    components: {
      Demo,
    },
  };
</script>
```

### 组件文件

```vue
<!-- src/components/Demo.vue -->
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
  export default {
    name: "HelloWorld",
    props: {
      msg: String,
    },
  };
</script>
```

## Webpack 文件

### `webpack.config.js` 文件

```javascript
// ./webpack.config.js
const { resolve } = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  // 入口文件
  entry: "./src/main.js",
  // 打包文件
  output: {
    filename: "bundle.js",
    path: resolve("./dist"),
  },
  // loader
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },

  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: resolve("./public/index.html"),
    }),
  ],
};
```

### `index.html` 文件

```html
<!-- ./public/index.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

### `package.json` 文件

```json
{
  "scripts": {
    "dev": "webpack-dev-server --open --mode development"
  }
}
```

### 初步启动

在项目根目录下运行以下命令启动开发服务器：

```bash
npm run dev
```

## 第二阶段，Vue 环境给服务端提供服务支持

## Vue 文件调整

### `main.js` 文件

```javascript
// src/main.js
import Vue from "vue";
import App from "./App.vue";

// 通过工厂模式，每次调用都会创建一个新vue 实例
export default function () {
  const app = new Vue({
    render: (h) => h(App),
  });
  return { app };
}
```

### `app.vue` 文件

```vue
<!-- src/app.vue -->
<template>
  <div id="app">
    <Demo msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
  import Demo from "./components/Demo.vue";
  export default {
    name: "App",
    components: {
      Demo,
    },
  };
</script>
```

## 入口文件

入口文件目录`src/entry`，分析为`client`和`server`。

### 服务端 `entry-server.js` 文件

```javascript
import createApp from "../main";
// 返回一个方法，方法中返回一个vue 实例
export default function () {
  const { app } = createApp();
  return app;
}
```

### 客户端 `entry-client.js` 文件

```javascript
import createApp from "../main";
//
createApp().app.$mount("#app");
```

## webpack 配置文件

根据服务端和客户端区分不同配置，配置目录`./webpack`。

### 基础配置 `webpack.base.js`

```js
// ./webpack.config.js
const { resolve } = require("path");
const { VueLoaderPlugin } = require("vue-loader");

module.exports = {
  // 打包文件
  output: {
    filename: "[name].bundle.js",
    path: resolve("./dist"),
    publicPath: "/",
  },
  // loader
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: "vue-loader",
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
    ],
  },

  plugins: [new VueLoaderPlugin()],
};
```

### 服务端配置 `webpack.server.js`

```js
// ./webpack.server.js
const baseConfig = require("./webpack.base");
const { merge } = require("webpack-merge");

module.exports = merge(baseConfig, {
  // 入口文件
  entry: {
    server: "./src/entry/entry-server.js",
  },
  // 打包规范
  output: {
    libraryTarget: "commonjs2",
  },
  target: "node",
});
```

### 客户端配置 `webpack.client.js`

```js
// ./webpack.client.js
const { resolve } = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const baseConfig = require("./webpack.base");
const { merge } = require("webpack-merge");

module.exports = merge(baseConfig, {
  // 入口文件
  entry: {
    client: "./src/entry/entry-client.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: resolve("./public/index.html"),
    }),
  ],
});
```

### `package.json` 文件

```json
{
  "scripts": {
    "dev": "webpack-dev-server --config ./webpack/webpack.client.js --open --mode development",
    "build:client": "webpack --config ./webpack/webpack.client.js --mode production",
    "build:server": "webpack --config ./webpack/webpack.server.js --mode production"
  }
}
```

## 服务端文件

### 主文件

```javascript
// ./server/server.js
const express = require("express");
const fs = require("fs");
const { createRender } = require("vue-server-renderer");
const { default: createApp } = require("../dist/server.bundle.js");

const app = express();
app.use(express.static(resolve("../dist")), {index: false});

app.get("*", async async (req, res) => {
  try {
    // 1. 创建vue 实例
    const app = createApp();
    // 2. 创建渲染器
    const renderer = createRender({
      template: fs.readFileSync("./index.ssr.html", "utf-8"), // 模板文件
    });
    // 3. 利用渲染器将vue 实例转换成html 字符串
    const html = await renderer.renderToString(app);
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### 模板文件

```html
<!-- ./server/index.ssr.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!--vue-ssr-outlet-->
    <script src="/dist/client.bundle.js"></script>
  </body>
</html>
```

### 打包文件

```bash
npm run build:client && npm run build:server
```

### 启动服务

```bash
npm run dev
```

## 第三阶段，优化执行

## 服务端文件

### 主文件

```javascript
// ./server/server.js
const express = require("express");
const fs = require("fs");
const { createBundleRender } = require("vue-server-renderer");
const serverBundle = require("../dist/vue-ssr-server-bundle.json");
const clientManifest = require("../dist/vue-ssr-client-manifest.json");

const app = express();
app.use(express.static(resolve("../dist")), {index: false});

app.get("*", (req, res) => {
  try {
    // 1. 创建渲染器
    const renderer = createBundleRender(serverBundle, {
      template: fs.readFileSync("./index.ssr.html", "utf-8"), // 模板文件
    }, clientManifest);
    // 2. 利用渲染器将vue 实例转换成html 字符串
    const html = await renderer.renderToString();
    res.send(html);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

### 模板文件

```html
<!-- ./server/index.ssr.html -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <!--vue-ssr-outlet-->
  </body>
</html>
```

## Webpack 配置文件

### `webpack.server.js` 文件

```js
// ./webpack.server.js
const { resolve } = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueSSRBundleRendererPlugin = require("vue-server-renderer/server-plugin");

const baseConfig = require("./webpack.base");
const merge = require("webpack-merge");

module.exports = merge(baseConfig, {
  // 入口文件
  entry: {
    server: "./src/entry/entry-server.js",
  },
  // 打包规范
  output: {
    libraryTarget: "commonjs2",
  },
  target: "node",
  plugins: [
    new VueSSRBundleRendererPlugin(), //
  ],
});
```

### `webpack.client.js` 文件

```js
// ./webpack.client.js
const { resolve } = require("path");
const { VueLoaderPlugin } = require("vue-loader");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const VueSSRBundleRendererPlugin = require("vue-server-renderer/client-plugin");

const baseConfig = require("./webpack.base");
const merge = require("webpack-merge");

module.exports = merge(baseConfig, {
  // 入口文件
  entry: {
    client: "./src/entry/entry-client.js",
  },
  plugins: [
    new VueSSRBundleRendererPlugin(), //
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: resolve("./public/index.html"),
    }),
  ],
});
```

### 打包文件

```bash
npm run build:client && npm run build:server
```

### 启动服务

```bash
npm run dev
```

## <err>* 需重新打包的情况</err>

根据你提供的文件列表，我们可以区分哪些文件的修改需要重新打包，哪些不需要。这主要取决于文件在构建和运行时的角色。以下是详细的说明：

### 需要重新打包的文件

这些文件通常包含应用程序的核心逻辑、组件定义或配置信息，它们的变化会影响最终的构建产物。

1. **`/src/components/Home.vue`**
   - **原因**：这是一个 Vue 单文件组件（SFC），其内容会被编译成 JavaScript 和 CSS，并且可能会被服务端和客户端代码使用。任何对这个文件的修改都需要重新打包以确保更改生效。
2. **`/src/App.vue`**

   - **原因**：这是应用的根组件，所有其他组件都是在这个组件内渲染的。它的变化同样会影响到整个应用的结构和样式，因此需要重新打包。

3. **`/src/main.js`**

   - **原因**：这是创建 Vue 应用实例的地方，包含了初始化逻辑和插件安装等。任何改动都会影响到应用的启动方式，所以也需要重新打包。

4. **`/src/router.js`**

   - **原因**：路由配置文件决定了应用中不同路径对应的组件和行为。如果路由规则发生变化，必须重新打包以更新路由映射。

5. **`/src/entry/server-entry.js` 和 `/src/entry/client-entry.js`**
   - **原因**：这两个入口文件分别用于服务端和客户端渲染。它们定义了如何初始化应用和服务端渲染逻辑。任何修改都需要重新打包，以确保新的逻辑能够正确执行。

### 不需要重新打包的文件

这些文件通常是配置文件或与构建过程无关的文件，它们可以在不重新打包的情况下进行调整。

1. **`/server.js`**
   - **原因**：这是 Node.js 服务器的主文件，它负责设置 Express 服务器并监听请求。因为它是直接由 Node.js 运行的，而不是通过 Webpack 或其他构建工具处理的，所以它的修改不需要重新打包。你可以直接重启 Node.js 服务器来应用更改。

### 备注

- **需要重新打包的文件**：涉及 Vue 组件、应用初始化逻辑、路由配置以及服务端和客户端入口文件的修改。这些文件的更改会影响构建后的输出文件，因此需要重新打包。
- **不需要重新打包的文件**：主要是服务器配置文件（如 `server.js`）。由于它们是直接由 Node.js 解释执行的，因此可以直接修改并重启服务器来应用更改，无需重新打包。

## 进阶优化

- **代码分割**：利用动态导入 (`import()`) 来分割代码，只加载当前页面所需的模块。
- **缓存策略**：对于静态资源和 API 响应实施合理的缓存策略，减少重复请求。
- **错误处理**：确保在生产环境中捕获并记录所有的异常信息。
- **性能监控**：集成如 Lighthouse 或 WebPageTest 等工具来持续监控和改进应用性能。

## 总结

通过上述步骤，你应该能够成功地搭建一个 Vue SSR 项目，实现服务器端渲染的功能。
