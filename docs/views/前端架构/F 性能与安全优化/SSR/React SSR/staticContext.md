# staticContext

`staticContext` 是在使用 React Router 进行服务端渲染（SSR, Server-Side Rendering）时的一个特殊属性，主要用于传递静态上下文信息。它通常与 `StaticRouter` 一起使用，以便在服务器端处理路由时共享数据或状态。

## 使用场景

当你在服务端渲染应用时，可能需要在不同组件之间共享某些数据或状态，例如页面的元数据（如标题、描述等），或者你需要知道哪个路由被匹配到了以便进行重定向等操作。这时，你可以通过 `staticContext` 来实现这些需求。

## 示例说明

假设你正在构建一个支持 SSR 的 React 应用，并希望在服务端渲染过程中根据访问的路径设置页面标题。你可以通过 `staticContext` 实现这一点。

### 1. 配置服务端渲染

首先，在服务端，你需要配置 `StaticRouter` 并传入 `context` 对象：

```javascript
// server.js
import express from "express";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App";
import path from "path";

const server = express();

server.get("*", (req, res) => {
  const context = {};
  const appHtml = ReactDOMServer.renderToString(
    <StaticRouter location={req.url} context={context}>
      <App />
    </StaticRouter>
  );

  if (context.url) {
    // 如果存在url属性，则表示发生了重定向
    res.redirect(301, context.url);
  } else {
    const filePath = path.resolve("./build/index.html");
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Internal Server Error");
      } else {
        res.send(appHtml);
      }
    });
  }
});

server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
```

在这个例子中，我们创建了一个简单的 Express 服务器，并且对于所有的 GET 请求，我们都使用 `StaticRouter` 来渲染应用。注意这里的 `context` 对象，它将作为 `staticContext` 属性传递给路由中的所有组件。

### 2. 在组件中使用 `staticContext`

接下来，在你的 React 组件中，可以通过 `staticContext` 设置一些值：

```javascript
// NotFound.jsx
import React from "react";

function NotFound(props) {
  if (props.staticContext) {
    props.staticContext.status = 404;
  }

  return (
    <div>
      <h1>Page Not Found</h1>
    </div>
  );
}

export default NotFound;
```

在这个例子中，当 `NotFound` 组件被渲染时，如果存在 `staticContext`，则会向其中添加一个 `status` 属性，这可以用于在服务端设置 HTTP 状态码。

### 3. 在服务端处理 `staticContext`

回到你的服务端逻辑，你可以检查 `context` 对象来决定如何响应请求：

```javascript
// server.js (修改后的部分)
if (context.url) {
  res.redirect(301, context.url);
} else if (context.status === 404) {
  res.status(404).send("<h1>Page Not Found</h1>");
} else {
  // 原有的HTML发送逻辑...
}
```

通过这种方式，你可以利用 `staticContext` 在服务端渲染期间动态地设置 HTTP 状态码或其他任何你需要的信息。

## 总结

- `staticContext` 主要用于服务端渲染期间，允许你在路由组件间共享数据。
- 它通常与 `StaticRouter` 结合使用，以在服务端处理路由和重定向。
- 可以用来设置 HTTP 状态码、页面元数据等。

确保仅在服务端渲染时使用 `staticContext`，因为客户端渲染时该属性并不存在。如果你的应用同时支持客户端和服务端渲染，请确保对 `staticContext` 的使用进行了适当的条件判断。
