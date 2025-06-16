# 001 基于 WebSocket 实现聊天室

为了演示如何使用 WebSocket，下面将给出一个简单的例子，包括客户端和服务器端的基本实现。这里我们假设你正在使用 Node.js 作为后端环境，并且前端页面是 HTML。

## 服务器端（Node.js）

首先，你需要安装`ws`这个 npm 包，它是一个流行的 WebSocket 库。

```bash
npm install ws
```

接下来，创建一个名为`server.js`的文件，并添加以下代码：

```javascript
const WebSocket = require("ws");

const server = new WebSocket.Server({ port: 8080 });

server.on("connection", (socket) => {
  console.log("A new client connected!");

  // 发送欢迎消息给客户端
  socket.send("Welcome to the WebSocket server!");

  // 监听来自客户端的消息
  socket.on("message", (message) => {
    console.log(`Received message: ${message}`);

    // 广播收到的消息给所有连接的客户端
    server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  // 当客户端断开连接时触发
  socket.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
```

这段代码设置了一个 WebSocket 服务器监听在`8080`端口上。每当有新的客户端连接时，服务器会发送一条欢迎信息，并且可以接收来自任何客户端的消息并将这条消息广播给所有其他已连接的客户端。

## 客户端（HTML + JavaScript）

创建一个 HTML 文件（例如`index.html`），并在其中加入如下代码来连接到上述 WebSocket 服务器并进行交互：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>WebSocket Example</title>
  </head>
  <body>
    <h1>WebSocket Chat Room</h1>
    <div id="messages"></div>
    <input
      type="text"
      id="messageInput"
      placeholder="Type your message here..."
    />
    <button onclick="sendMessage()">Send</button>

    <script>
      const ws = new WebSocket("ws://localhost:8080");

      ws.onopen = () => {
        console.log("Connected to the server");
        document.getElementById("messages").innerHTML +=
          "<p>Connected to the chat room.</p>";
      };

      ws.onmessage = (event) => {
        console.log(`Message from server: ${event.data}`);
        document.getElementById("messages").innerHTML += `<p>${event.data}</p>`;
      };

      ws.onclose = () => {
        console.log("Disconnected from the server");
        document.getElementById("messages").innerHTML +=
          "<p>Disconnected from the chat room.</p>";
      };

      function sendMessage() {
        const input = document.getElementById("messageInput");
        const message = input.value;
        if (message.trim()) {
          ws.send(message);
          input.value = ""; // 清空输入框
        }
      }
    </script>
  </body>
</html>
```

在这个 HTML 文件中，我们创建了一个简单的聊天界面，用户可以通过输入框发送消息到服务器，同时也能显示从服务器接收到的所有消息。

## 运行

确保你的 Node.js 服务已经启动，可以通过命令行运行`server.js`：

```bash
node server.js
```

然后打开浏览器访问`index.html`文件所在的位置，你应该能看到一个基本的聊天室应用，能够与服务器和其他客户端实时交流。
