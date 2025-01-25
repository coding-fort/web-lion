# express

Express 是一个简洁而灵活的 Node.js Web 应用框架，它提供了多种功能用于构建单页、多页以及混合型 web 应用。以下是对 Express 库的一些详细介绍：

## 核心特性

- **路由**：Express 提供了一个强大的路由系统，允许你根据 HTTP 方法（GET, POST 等）和 URL 来定义应用的路由。
- **中间件**：支持使用中间件来响应 HTTP 请求。在请求到达最终的路由处理函数之前或之后，可以执行各种操作，比如日志记录、解析请求体等。
- **模板引擎**：与多个模板引擎集成（如 Pug, EJS），允许生成动态 HTML 页面。
- **开发便利性**：提供诸如设置静态文件夹、快速 404 响应等功能，简化了日常开发任务。

## 安装与使用

通过 npm 可以轻松安装 Express 到你的项目中：

```bash
npm install express --save
```

创建一个简单的服务器示例：

```javascript
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

## 中间件

中间件函数能够访问请求对象 (`req`)、响应对象 (`res`)，并且能控制请求-响应循环中的执行流程。你可以装载中间件到应用级别或者路由器级别。

例如，使用 `express.static` 中间件来指定包含静态资源的目录：

```javascript
app.use(express.static("public"));
```

这会使得 `public` 目录下的所有文件都可以直接被访问。

## 路由

除了基本的路由功能外，Express 还支持路由参数、查询字符串解析等高级路由功能。可以通过如下方式定义路由参数：

```javascript
app.get("/users/:userId/books/:bookId", (req, res) => {
  res.send(req.params);
});
```

这将匹配类似 `/users/123/books/456` 的路径，并将 `userId` 和 `bookId` 作为键值对存入 `req.params` 对象中。

## 跨域

Express 默认情况下不支持跨域资源共享（CORS），但可以通过使用中间件来添加支持。

```bash
npm i cors
```

```javascript
const cors = require("cors");
app.use(cors());
```

## 错误处理

错误处理中间件通常需要四个参数，签名形式为 `(err, req, res, next)`。当运行时发生错误时，可以通过调用 `next()` 并传递错误实例给下一个错误处理中间件。

```javascript
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
```

Express 凭借其灵活性和丰富的功能集，成为了构建 Web 应用和服务端 API 的首选框架之一。无论你是刚开始学习 Node.js，还是寻找一种高效的方式来开发复杂的 Web 应用程序，Express 都是一个非常不错的选择。
