# vue-cli 构建 SSR

使用 Vue CLI 构建 SSR（服务端渲染）项目可以通过 `@vue/cli-plugin-ssr` 插件来简化这一过程。然而，截至我最后更新的知识（2024 年），Vue CLI 并没有直接内置的 SSR 插件支持。因此，构建一个 SSR 应用通常需要手动配置或使用社区提供的工具和指南。

不过，你可以通过以下步骤手动设置一个基于 Vue CLI 的 SSR 项目。这个过程包括创建 Vue 应用、配置 Webpack 以支持服务器端渲染以及编写必要的服务器代码。

## 步骤 1: 创建一个新的 Vue CLI 项目

如果你还没有一个 Vue CLI 项目，首先需要创建一个：

```bash
vue create my-ssr-project
cd my-ssr-project
```

选择你喜欢的默认配置或者手动选择特性。

## 步骤 2: 安装必要的依赖

你需要安装一些额外的库来支持 SSR：

```bash
npm install --save vue-server-renderer express vue@~3.6 vue-router@~3.6
npm install --save-dev cross-env
```

- `vue-server-renderer`: Vue.js 官方提供的用于服务器端渲染的支持库。
- `express`: 一个流行的 Node.js web 框架，我们将用它来搭建服务器。
- `cross-env`: 一个用于设置环境变量的库，在 Windows 和 Linux 上都能工作。

## 步骤 3: 配置 Webpack

在项目的根目录下创建或修改 `vue.config.js` 文件，添加针对服务器端的 Webpack 配置：

```javascript
const VueSSRClientPlugin = require("vue-server-renderer/client-plugin");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");
const TARGET_NODE = process.env.WEBPACK_TARGET === "node";
const target = TARGET_NODE ? "server" : "client";

module.exports = {
  configureWebpack: () => ({
    entry: {
      app: "./src/entry/entry-" + target + ".js",
    },
    target: TARGET_NODE ? "node" : "web",
    output: {
      libraryTarget: TARGET_NODE ? "commonjs2" : undefined,
    },
    plugins: [
      TARGET_NODE ? new VueSSRServerPlugin() : new VueSSRClientPlugin(),
    ],
  }),
  chainWebpack: (config) => {
    config.optimization.splitChunks(undefined);
  },
};
```

同时，你可能还需要为客户端配置单独的 Webpack 设置，这通常是在默认的 `vue.config.js` 中完成的。

## 步骤 4: 创建服务器入口文件

在 `src` 目录下创建一个 `entry-server.js` 文件作为服务器的入口点：

```javascript
import { createApp } from "./main";

export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    router.push(context.url);

    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      if (!matchedComponents.length) {
        return reject({ code: 404 });
      }

      resolve(app);
    }, reject);
  });
};
```

## 步骤 5: 创建服务器端逻辑

在项目根目录下创建一个 `server.js` 文件来启动你的 Express 服务器并进行 SSR 渲染：

```javascript
const express = require("express");
const fs = require("fs");
const path = require("path");
const { createBundleRenderer } = require("vue-server-renderer");
const serverBundle = require("./dist/server/vue-ssr-server-bundle.json");
const template = fs.readFileSync(
  path.resolve(__dirname, "./public/index.html"),
  "utf-8"
);
const clientManifest = require("./dist/client/vue-ssr-client-manifest.json");

const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false,
  template,
  clientManifest,
});

const server = express();

server.use("/dist", express.static(path.resolve(__dirname, "./dist/client")));

server.get("*", (req, res) => {
  const context = { url: req.url };

  renderer.renderToString(context, (err, html) => {
    if (err) {
      res.status(500).end("Internal Server Error");
      return;
    }
    res.end(html);
  });
});

server.listen(8080, () => {
  console.log("Server is listening on http://localhost:8080");
});
```

## 步骤 6: 编译与运行

你需要分别编译客户端和服务端的代码。可以使用 npm scripts 来简化这个过程：

```json
"scripts": {
  "build:client": "vue-cli-service build",
  "build:server": "cross-env NODE_ENV=production webpack --config build/webpack.server.config.js"
}
```

确保你有一个合适的 Webpack 配置文件 `webpack.server.config.js` 来处理服务端的打包。

最后，运行你的应用：

```bash
npm run build:client
npm run build:server
node server.js
```

现在，你应该能够访问 `http://localhost:8080` 查看你的 SSR 应用了。
