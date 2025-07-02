# connect-history-api-fallback

`connect-history-api-fallback` 是一个用于 Node.js/Express 应用的中间件，旨在解决使用 HTML5 History API 时出现的问题。当构建单页应用（SPA）时，比如使用 React、Vue 或 Angular 等框架，通常会利用 HTML5 的 History API 来实现路由。然而，直接访问这些应用中的深层链接（例如 `/dashboard`) 时，如果服务器没有正确配置，可能会返回 404 错误，因为服务器端并没有这些路径的实际文件。

## 主要功能

`connect-history-api-fallback` 中间件的作用就是在接收到针对不存在资源的请求时，不是直接返回 404 响应，而是将请求重定向到指定的入口 HTML 文件（如 `index.html`），这样前端路由就可以接管并正确显示对应的页面。

## 使用场景

- 当你正在开发一个使用 HTML5 History API 实现前端路由的单页应用，并且需要在浏览器中直接通过 URL 访问应用的不同部分。
- 在生产环境中部署单页应用时，确保所有对非静态资源的请求都能被正确处理。

## 安装与配置

首先，你需要安装这个中间件：

```bash
npm install connect-history-api-fallback --save
```

然后，在你的 Express 应用中使用它：

```javascript
const express = require("express");
const history = require("connect-history-api-fallback");

const app = express();

// 使用中间件
app.use(history());

// 静态文件服务
app.use(express.static("public"));

app.listen(3000, () => {
  console.log("服务器运行在 http://localhost:3000");
});
```

在这个例子中，任何指向不存在的路径的 GET 请求都会被重定向到 `index.html` 文件，使得前端路由可以处理该请求。

## 配置选项

`connect-history-api-fallback` 提供了一些可选参数来定制其行为，例如忽略某些特定的文件扩展名、自定义重写规则等。你可以根据项目需求调整这些设置以满足不同的应用场景。
