# net 模块

`net` 模块是 Node.js 提供的一个用于创建 TCP 服务器和客户端的核心模块。它允许开发者建立基于 TCP 协议的网络连接，适用于需要直接操作 TCP 流的应用场景，比如构建聊天服务器、代理服务器等。

## 创建 TCP 服务器

使用 `net.createServer()` 方法可以创建一个新的 TCP 服务器实例。这个方法接受一个监听函数作为参数，每当有新的连接时会触发该函数。

### 示例：创建一个简单的 TCP 回显服务器

```javascript
const net = require("net");

// 创建服务器
const server = net.createServer((socket) => {
  console.log("Client connected.");

  // 监听数据事件，当接收到数据时回显给客户端
  socket.on("data", (data) => {
    console.log(`Received: ${data}`);
    socket.write("Echo: " + data);
  });

  // 监听结束事件
  socket.on("end", () => {
    console.log("Client disconnected.");
  });

  // 发送欢迎信息给新连接的客户端
  socket.write("Welcome to the echo server!\n");
});

// 监听端口
server.listen(60300, () => {
  console.log("Server listening on port 60300");
});
```

## 创建 TCP 客户端

要创建一个 TCP 客户端，可以使用 `net.createConnection()` 或者 `new net.Socket()` 来建立与远程服务器的连接。

### 示例：创建一个简单的 TCP 客户端

```javascript
const net = require("net");

// 创建客户端并连接到服务器
const client = new net.Socket();
client.connect(60300, "127.0.0.1", () => {
  console.log("Connected to server!");
  client.write("Hello, server!");
});

// 监听数据事件
client.on("data", (data) => {
  console.log(`Received from server: ${data}`);
  client.destroy(); // 关闭连接
});

// 监听错误事件
client.on("error", (err) => {
  console.error(err);
});

// 监听关闭事件
client.on("close", () => {
  console.log("Connection closed");
});
```

## `scoket` 对象

在 Node.js 的 `net` 模块中，每当有新的客户端连接到服务器时，会创建一个新的 `Socket` 对象，并将其作为参数传递给监听函数或事件处理器。这个 `Socket` 对象代表了与特定客户端的双向通信通道。以下是关于如何获取和使用 `Socket` 对象的一些详细信息：

### 获取 Socket 对象

当你调用 `net.createServer()` 方法创建一个 TCP 服务器时，你可以为它提供一个回调函数来处理每次新的连接。这个回调函数会接收到一个 `Socket` 对象作为其第一个参数。

```javascript
const net = require("net");

// 创建服务器并为每个新连接设置处理程序
const server = net.createServer((socket) => {
  // 'socket' 是一个 Socket 对象，表示与客户端的连接

  console.log("Client connected.");

  // 监听数据事件，当接收到数据时回显给客户端
  socket.on("data", (data) => {
    console.log(`Received: ${data}`);
    socket.write("Echo: " + data);
  });

  // 监听结束事件
  socket.on("end", () => {
    console.log("Client disconnected.");
  });

  // 发送欢迎信息给新连接的客户端
  socket.write("Welcome to the echo server!\n");
});

server.listen(60300, () => {
  console.log("Server listening on port 60300");
});
```

### 使用 Socket 对象

`Socket` 对象提供了多种方法和事件来管理与客户端之间的通信。以下是一些常用的方法和事件：

#### 方法

- **`write(data[, encoding][, callback])`**:
  - 向客户端发送数据。
- **`end([data][, encoding])`**:
  - 发送完所有缓冲的数据后关闭连接。
- **`destroy()`**:
  - 立即销毁套接字，不再允许进一步通信。
- **`pause()`**:
  - 暂停从套接字读取数据（暂停触发 `'data'` 事件）。
- **`resume()`**:
  - 恢复从套接字读取数据（恢复触发 `'data'` 事件）。

#### 事件

- **`'data'`**:
  - 当从客户端接收到数据时触发。
- **`'end'`**:
  - 当对等方关闭连接时触发。
- **`'error'`**:
  - 当发生错误时触发。
- **`'close'`**:
  - 当套接字完全关闭时触发。

#### 属性

- **`remoteAddress`**:
  - 客户端的 IP 地址。
- **`remotePort`**:
  - 客户端的端口号。
- **`localAddress`**:
  - 服务器绑定的本地 IP 地址。
- **`localPort`**:
  - 服务器绑定的本地端口号。

### 示例：返回和操作 Socket 对象

如果你想在一个更复杂的场景中返回 `Socket` 对象，比如在一个类或模块中封装服务器逻辑，可以这样做：

```javascript
class EchoServer {
  constructor(port) {
    this.port = port;
    this.server = net.createServer(this.handleConnection.bind(this));
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`Server listening on port ${this.port}`);
    });
  }

  stop() {
    this.server.close(() => {
      console.log("Server closed.");
    });
  }

  handleConnection(socket) {
    // 将 socket 对象保存起来或者传递出去
    console.log(
      `New connection from ${socket.remoteAddress}:${socket.remotePort}`
    );

    // 设置事件监听器（流式传输）
    socket.on("data", (data) => {
      console.log(`Received: ${data.toString(`utf-8`)}`);
      socket.write("Echo: " + data.toString());
    });

    socket.on("end", () => {
      console.log("Client disconnected.");
    });

    // 返回 socket 对象以供其他地方使用
    return socket;
  }
}

// 使用 EchoServer 类
const echoServer = new EchoServer(60300);
echoServer.start();
```

在这个例子中，`handleConnection` 方法不仅处理了新的连接，还将 `Socket` 对象返回，这样你可以在需要的时候对其进行进一步的操作或存储。

## 常用 API

- **`net.createServer([options][, connectionListener])`**:

  - 创建一个新的 TCP 服务器。
  - 可选地传递一个监听函数来处理每个新连接。

- **`server.listen(port[, host][, backlog][, callback])`**:
  - 让服务器开始监听指定端口和主机地址上的连接请求。
- **`server.close([callback])`**:

  - 关闭服务器，停止接收新的连接，并在所有现有连接结束后调用回调函数（如果提供）。

- **`server.address()`**:

  - 返回服务器绑定的地址、端口和家族（IPv4 或 IPv6）。如果服务器未绑定，则返回 `null`。

- **`socket.write(data[, encoding][, callback])`**:

  - 向套接字写入数据。编码默认为 UTF8。

- **`socket.end([data][, encoding])`**:

  - 发送完所有缓冲的数据后关闭套接字。

- **`socket.destroy()`**:

  - 立即销毁套接字，不再允许进一步通信。

- **`socket.on('data', listener)`**:

  - 当从套接字接收到数据时触发。

- **`socket.on('end', listener)`**:

  - 当对等方关闭连接时触发。

- **`socket.on('error', listener)`**:

  - 当发生错误时触发。

- **`socket.on('close', listener)`**:
  - 当套接字完全关闭时触发。

## 使用场景

- **实时通信应用**：如即时通讯软件、在线游戏等。
- **代理服务**：转发来自客户端的请求到其他服务器。
- **物联网设备管理**：控制和监控 IoT 设备的状态。
- **自定义协议实现**：开发符合特定需求的网络协议。

通过 `net` 模块，你可以轻松地构建高效的 TCP 应用程序和服务。
