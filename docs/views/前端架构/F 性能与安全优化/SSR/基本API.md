# 基本 API

在 Node.js 环境中实现 SSR 时，通常会使用一些核心 API 来处理服务器端渲染逻辑。这些 API 包括但不限于：

## 1. `ReactDOMServer.renderToString`

这是 React 提供的一个静态方法，用于将 React 组件转换为 HTML 字符串。该字符串可以被直接插入到页面中，作为初始加载的内容。

```javascript
import { renderToString } from "react-dom/server";
import App from "./App";

const html = renderToString(<App />);
```

## 2. `ReactDOM.hydrateRoot` 或 `ReactDOM.hydrate`（React 18 之前）

当客户端 JavaScript 加载完成后，需要“水合”（hydrate）由服务器生成的静态 HTML，以便它可以变成交互式的 React 应用程序。这一步骤确保了客户端和服务器端的状态一致。

- **React 18 及之后**:

  ```javascript
  import { hydrateRoot } from "react-dom/client";
  import App from "./App";

  hydrateRoot(document.getElementById("root"), <App />);
  ```

- **React 17 及之前**:

  ```javascript
  import { hydrate } from "react-dom";
  import App from "./App";

  hydrate(<App />, document.getElementById("root"));
  ```

## 3. Express 或其他 HTTP 框架

为了设置 HTTP 服务器并处理请求，你可以使用像 Express 这样的框架。以下是一个简单的例子：

```javascript
const express = require("express");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const App = require("./client/App").default;

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
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
  res.send(html);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
```

## 4. 数据预取与上下文传递

为了在渲染前获取数据，你可以在服务器端执行异步操作并将结果作为 props 传递给组件。此外，还可以利用上下文对象来共享全局状态或配置。

```javascript
// 在服务器端
app.get("/", async (req, res) => {
  const data = await fetchDataFromAPI();
  const context = {};
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>SSR with Data</title>
      </head>
      <body>
        <div id="root">${ReactDOMServer.renderToString(
          <App data={data} context={context} />
        )}</div>
        <script>
          window.__INITIAL_DATA__ = ${JSON.stringify(data)};
        </script>
        <script src="/static/bundle.js"></script>
      </body>
    </html>
  `;
  res.send(html);
});
```

## 5. 路由匹配

如果你的应用有多个页面，你需要根据 URL 匹配相应的路由并渲染正确的组件。这可以通过检查 `req.url` 并选择性地调用不同的渲染函数来完成。

```javascript
if (req.url === "/") {
  // 渲染首页
} else if (req.url === "/about") {
  // 渲染关于页
} else {
  // 404 页面
}
```

或者使用更高级的路由库如 `react-router` 的服务器端渲染支持。

## 6. Next.js 特定 API

如果您选择了 Next.js 这样的框架，它提供了更加简便的方法来进行 SSR 和相关功能。例如：

- **getInitialProps**: 用于在页面级别获取初始数据。

  ```javascript
  static async getInitialProps({ req }) {
    const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
    return { userAgent };
  }
  ```

- **getServerSideProps**: 类似于 `getInitialProps`，但在 Next.js 9.3+ 中推荐使用。

  ```javascript
  export async function getServerSideProps(context) {
    return {
      props: {
        data: await fetchData(),
      },
    };
  }
  ```

- **API Routes**: 创建 API 端点，可以直接处理 HTTP 请求而无需编写额外的 Express 代码。

## 总结

上述列出的是在 Node.js 中实现 SSR 所需的一些基本 API 和概念。根据所选框架的不同，具体的实现细节可能会有所变化。对于大多数现代前端应用来说，Next.js 是一个非常流行的选择，因为它内置了许多优化特性，简化了 SSR 的开发过程。
