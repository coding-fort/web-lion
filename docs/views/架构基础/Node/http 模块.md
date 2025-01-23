# http 模块

`http` 模块是 Node.js 的核心模块之一，它提供了创建 HTTP 服务器和客户端的功能。通过这个模块，你可以轻松地构建 Web 应用程序、API 服务或与 HTTP/HTTPS 服务器进行交互的客户端。

<bwe><prib>http</prib> 模块建立在<prib>net</prib> 模块上构建的，它提供了许多高级功能，如请求和响应处理、路由、代理等。</bwe>

## 创建 HTTP 服务器

使用 `http.createServer()` 方法可以创建一个新的 HTTP 服务器实例。该方法接受一个回调函数作为参数，每当有新的请求到达时会触发该回调函数。

### 示例：创建一个简单的 HTTP 服务器

```javascript
const http = require("http");

// 创建服务器
const server = http.createServer((req, res) => {
  // 设置响应头
  res.writeHead(200, { "Content-Type": "text/plain" });

  // 发送响应数据
  res.end("Hello World\n");
});

// 监听端口
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
```

## 处理请求和响应

在上面的例子中，`req` 是一个 `IncomingMessage` 对象，代表了客户端的请求；`res` 是一个 `ServerResponse` 对象，用于构建并发送响应给客户端。

- **`req`（请求对象）**：

  - `req.url`：获取请求的 URL。
  - `req.method`：获取请求的方法（如 GET、POST 等）。
  - `req.headers`：获取请求头信息。
  - `req.on('data', callback)`：监听请求体中的数据。

- **`res`（响应对象）**：
  - `res.writeHead(statusCode[, statusMessage][, headers])`：设置响应状态码和响应头。
  - `res.write(chunk[, encoding])`：向响应体写入数据。
  - `res.end([data][, encoding])`：结束响应，并可选地传递最后的数据。

### 示例：处理不同的 HTTP 方法和路由

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    if (method === "GET") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h1>Home Page</h1>");
    } else {
      res.writeHead(405, { Allow: "GET" });
      res.end(`Method ${method} Not Allowed`);
    }
  } else if (url === "/about") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<h1>About Page</h1>");
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
```

## 创建 HTTP 客户端

要发起 HTTP 请求，可以使用 `http.request()` 或者更简洁的 `http.get()` 方法。

### 使用 `http.get()` 发起 GET 请求

```javascript
const http = require("http");

http
  .get("http://jsonplaceholder.typicode.com/posts/1", (resp) => {
    let data = "";

    // 接收数据
    resp.on("data", (chunk) => {
      data += chunk;
    });

    // 数据接收完毕
    resp.on("end", () => {
      console.log(JSON.parse(data));
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
  });
```

### 使用 `http.request()` 发起 POST 请求

```javascript
const http = require("http");

const postData = JSON.stringify({
  title: "foo",
  body: "bar",
  userId: 1,
});

const options = {
  hostname: "jsonplaceholder.typicode.com",
  path: "/posts",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(postData),
  },
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding("utf8");
  res.on("data", (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on("end", () => {
    console.log("No more data in response.");
  });
});

req.on("error", (e) => {
  console.error(`problem with request: ${e.message}`);
});

// 写入数据到请求体
req.write(postData);
req.end();
```

## 使用事件驱动模型

`http` 模块基于 Node.js 的事件驱动模型，因此你可以监听各种事件来处理请求的不同阶段。

- **`request`**：每当收到新请求时触发。
- **`response`**：当开始发送响应时触发。
- **`listening`**：当服务器开始监听连接时触发。
- **`close`**：当服务器关闭时触发。

## 总结

`http` 模块为 Node.js 提供了强大的 HTTP 功能，使开发者能够快速构建网络应用程序和服务。无论是创建服务器还是作为客户端发起请求，`http` 模块都提供了灵活且高效的接口。
