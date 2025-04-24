# Vue Server-Side Rendering (SSR) 服务器端实现

Vue SSR 的核心思想是在服务器端生成完整的 HTML 文档，并将其发送给客户端。为了实现这一点，我们需要设置一个 Node.js 服务器，并配置它来处理 HTTP 请求和响应。

## 1. 设置项目结构

首先，确保你的项目有一个清晰的文件夹结构，专门用于服务器端渲染。例如：

```
/project-root
  /src
    App.vue
    main.js
    /entry
      entry-server.js  # 服务器端入口文件
      entry-client.js  # 客户端入口文件
  /server
    index.js         # Node.js 服务器代码
    index.ssr.html   # 服务器端渲染的 HTML 模板
  package.json
```

## 2. 安装依赖项

你需要安装 Vue 和 Vue Server Renderer，以及其他必要的库来构建和运行服务器。

```bash
npm install vue vue-server-renderer express
```

## 3. 创建服务器端入口文件 (`entry-server.js`)

服务器端入口文件是整个 SSR 流程的核心。它负责创建 Vue 应用实例、处理路由匹配、预取数据（如果需要），最后调用 `renderToString` 方法生成 HTML 字符串。

```javascript
// src/entry-server.js
import { createApp } from "./main";

export default (context) => {
  return new Promise((resolve, reject) => {
    const { app, router, store } = createApp();

    // 设置服务器端路由位置
    router.push(context.url);

    // 等待所有异步组件和钩子完成
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents();
      // 对匹配的组件预取数据
      if (matchedComponents.length) {
        Promise.all(
          matchedComponents.map((Component) => {
            if (Component.asyncData) {
              return Component.asyncData({
                store,
                route: router.currentRoute,
              });
            }
          })
        )
          .then(() => {
            // SSR 渲染应用程序
            resolve(app);
          })
          .catch(reject);
      } else {
        resolve(app);
      }
    }, reject);
  });
};
```

## 4. 配置 Webpack 构建

为了分别编译客户端和服务器端代码，通常会使用两个 Webpack 配置：一个用于客户端，另一个用于服务器端。服务器端构建会输出一个 JSON 文件，其中包含了可以被 `vue-server-renderer` 使用的信息。

- **`webpack.server.config.js`**:

```javascript
const path = require("path");
const VueSSRServerPlugin = require("vue-server-renderer/server-plugin");

module.exports = {
  target: "node",
  entry: "./src/entry-server.js",
  output: {
    path: path.resolve(__dirname, "../dist/server"),
    filename: "entry-server.js",
    libraryTarget: "commonjs2",
  },
  plugins: [new VueSSRServerPlugin()],
};
```

## 5. 设置 Node.js 服务器 (`server/server.js`)

接下来，设置一个简单的 Express 服务器来处理请求并渲染页面。这里我们将使用 `vue-server-renderer` 来创建一个渲染器，并通过它生成 HTML。

```javascript
const express = require("express");
const fs = require("fs");
const path = require("path");
const { createBundleRenderer } = require("vue-server-renderer");

// 加载服务器端构建产物
const serverBundle = require("../dist/server/vue-ssr-server-bundle.json");
const clientManifest = require("../dist/client/vue-ssr-client-manifest.json");

// 创建渲染器
const renderer = createBundleRenderer(serverBundle, {
  runInNewContext: false, // 推荐在生产环境中设置为 false
  template: fs.readFileSync(
    path.resolve(__dirname, "../public/index.ssr.html"),
    "utf-8"
  ),
  clientManifest,
});

const serve = (path, cache) =>
  express.static(path, { maxAge: cache && 1000 * 60 * 60 * 24 * 30 });

const app = express();

// 静态资源服务
app.use("/dist", serve(path.resolve(__dirname, "../dist/client"), true));
app.use("/public", serve(path.resolve(__dirname, "../public"), true));

app.get("*", async (req, res) => {
  const context = { url: req.url };

  try {
    const html = await renderer.renderToString(context);
    res.send(html);
  } catch (err) {
    res.status(500).send("Server Error");
    console.error(`Error during render : ${req.url}`);
    console.error(err.stack);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

## 6. 数据预取与上下文传递

为了确保服务器端渲染的内容是最新的，你可以在组件中定义 `asyncData` 方法来进行数据预取。这些方法会在服务器端渲染过程中被执行，并且它们返回的数据会被作为 props 传递给组件。

```javascript
// 组件中的 asyncData 方法
export default {
  async asyncData({ store, route }) {
    // 调用 Vuex action 来获取数据
    return store.dispatch("fetchItems", route.params.id);
  },
  // ...
};
```

然后，在服务器端入口文件中，我们等待所有 `asyncData` 方法完成后再进行渲染。

## 7. 处理全局状态或共享信息

有时你可能需要在多个请求之间共享某些信息，比如用户认证状态或全局配置。这可以通过上下文对象来实现。上下文对象是一个普通的 JavaScript 对象，它在整个请求生命周期内可用，并且可以传递给所有的组件。

```javascript
// 在服务器端入口文件中设置上下文对象
router.onReady(() => {
  const matchedComponents = router.getMatchedComponents();
  // 将上下文对象传递给组件
  const context = { url: req.url, user: getUserFromRequest(req) };

  // ...
});
```

## 8. 错误处理

在生产环境中，错误处理非常重要。你应该捕获所有可能发生的异常，并返回适当的 HTTP 状态码和消息。此外，还可以记录详细的错误日志以便调试。

```javascript
app.get("*", async (req, res) => {
  const context = { url: req.url };

  try {
    const html = await renderer.renderToString(context);
    res.send(html);
  } catch (err) {
    if (err.code === 404) {
      res.status(404).send("Page Not Found");
    } else {
      res.status(500).send("Server Error");
      console.error(`Error during render : ${req.url}`);
      console.error(err.stack);
    }
  }
});
```

## 总结

以上介绍了如何在服务器端实现 Vue SSR，包括创建服务器端入口文件、配置 Webpack 构建、设置 Node.js 服务器、处理数据预取以及上下文传递等内容。通过这种方式，你可以构建出高效的服务器端渲染应用，提升首屏加载速度和 SEO 表现。
