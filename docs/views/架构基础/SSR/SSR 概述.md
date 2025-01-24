# Server-Side Rendering (SSR) 简介

Server-Side Rendering（服务器端渲染，简称 SSR）是一种在服务器上生成网页内容并在首次加载时直接发送给客户端的技术。与传统的单页应用程序（SPA, Single Page Application）不同，SSR 不是在客户端浏览器中通过 JavaScript 动态构建页面，而是在服务器端完成 HTML 的生成。这种方法可以提高首屏加载速度、改善 SEO（搜索引擎优化），并为用户提供更好的初始体验。

### 为什么使用 SSR？

1. **SEO 友好**：许多搜索引擎爬虫难以解析或执行大量的 JavaScript 来获取页面内容，因此预渲染的 HTML 更有利于被索引。
2. **更快的内容呈现**：用户无需等待所有 JavaScript 文件下载和解析就可以看到页面的主要内容，减少了白屏时间。
3. **减少客户端负担**：由于大部分工作已经在服务器端完成，客户端需要处理的数据量减少，提升了移动设备等性能较弱环境下的用户体验。

## Node.js 中实现 SSR

![SSR 流程](/assets/images/ssr/ssr.png)

Node.js 是一个非常适合实现 SSR 的平台，因为它允许你用 JavaScript 同时编写服务器端和客户端代码。以下是如何在 Node.js 中设置 SSR 的基本步骤：

### 1. 设置项目结构

首先，确保你的项目有清晰的文件夹结构，例如：

```
/project-root
  /client
    /components
    /pages
    app.js
  /server
    server.js
  package.json
```

### 2. 安装依赖项

根据你选择的框架或库安装必要的依赖。如果你打算使用 React 进行 SSR，可能需要安装 `react`, `react-dom`, 和 `express` 或其他 HTTP 框架。

```bash
npm install react react-dom express
```

### 3. 创建客户端应用

在 `/client/app.js` 中创建你的 React 应用程序：

```javascript
import React from "react";
import ReactDOM from "react-dom";

const App = () => <h1>Hello from SSR!</h1>;

if (typeof document !== "undefined") {
  ReactDOM.hydrate(<App />, document.getElementById("root"));
}

export default App;
```

注意这里的条件判断 `typeof document !== 'undefined'`，这确保了当代码在服务器端运行时不尝试访问 DOM API。

### 4. 实现服务器端渲染逻辑

在 `/server/server.js` 中设置 Express 服务器，并添加路由来处理请求：

```javascript
const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const App = require("../client/app").default;

const app = express();

app.get("*", (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR Example</title>
      </head>
      <body>
        <div id="root">${ReactDOMServer.renderToString(<App />)}</div>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;
  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
```

这段代码做了几件事：

- 使用 `ReactDOMServer.renderToString()` 将 React 组件转换为静态 HTML 字符串。
- 构建完整的 HTML 文档，包括 `<head>` 和 `<body>` 标签。
- 在响应中发送生成的 HTML 给客户端。
- 添加 `<script>` 标签以加载客户端 JavaScript 文件，用于后续交互。

### 5. 打包客户端代码

为了使客户端能够接管服务器端渲染的内容，你需要将客户端代码打包成一个可执行的 JavaScript 文件。你可以使用 Webpack、Parcel 或其他模块打包工具来完成这项任务。

### 6. 预取数据

对于动态内容，你可能需要在渲染之前从数据库或其他 API 获取数据。这可以通过异步函数实现，比如 `async/await` 或 Promises。然后将这些数据传递给组件作为 props。

```javascript
app.get("/", async (req, res) => {
  const data = await fetchDataFromAPI(); // 假设这是一个异步函数
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR with Data</title>
      </head>
      <body>
        <div id="root">${ReactDOMServer.renderToString(
          <App data={data} />
        )}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(data)};
        </script>
        <script src="/bundle.js"></script>
      </body>
    </html>
  `;
  res.send(html);
});
```

这里我们还向客户端暴露了一个全局变量 `window.__INITIAL_DATA__`，以便可以在客户端代码中访问预取的数据。

## 框架支持

虽然你可以手动实现 SSR，但现代前端框架如 Next.js、Nuxt.js 和 Gatsby 提供了更简便的方法来实现 SSR 和相关功能。这些框架通常内置了许多最佳实践，简化了开发流程，并提供了额外的功能，如自动代码分割、路由管理等。

### Next.js 示例

Next.js 是一个流行的 React SSR 框架，它极大地简化了 SSR 的配置过程。只需按照官方文档进行设置，你就可以快速启动一个具有 SSR 功能的应用程序。

```bash
npx create-next-app@latest my-ssr-app
cd my-ssr-app
npm run dev
```

接下来，你可以在 `pages/index.js` 中定义你的首页，并利用 Next.js 的 `getInitialProps` 方法来预取数据。

```javascript
// pages/index.js
import React from "react";

const HomePage = ({ data }) => (
  <div>
    <h1>Welcome to the Home Page</h1>
    <pre>{JSON.stringify(data, null, 2)}</pre>
  </div>
);

HomePage.getInitialProps = async () => {
  const response = await fetch("https://api.example.com/data");
  const data = await response.json();
  return { data };
};

export default HomePage;
```

## 总结

Server-Side Rendering（SSR）是提升 Web 应用性能和用户体验的重要技术之一。通过在 Node.js 中实现 SSR，你可以充分利用 JavaScript 生态系统的优势，同时享受 SSR 带来的诸多好处。如果你正在寻找一种更加高效的方式来构建复杂的 Web 应用，考虑采用 SSR 技术或基于 SSR 的框架可能是明智的选择。
