# 004 WebSocket

WebSocket 是一种在单个 TCP 连接上进行全双工通信的协议。它使得客户端和服务器之间的数据交换变得更加简单，允许服务器主动向客户端推送数据。这种特性特别适合需要实时更新的应用场景，如在线游戏、即时通讯工具、股票交易平台等。

## 1. WebSocket 出现的原因

在 WebSocket 出现之前，Web 应用进行实时通信面临诸多挑战。传统的 HTTP 协议是一种无状态的请求 - 响应协议，主要用于客户端向服务器请求数据，服务器返回响应后连接即关闭。这意味着：

- **实时性差**：若要实现实时数据更新，如实时聊天、股票行情实时显示、在线游戏状态更新等场景，客户端需要不断地向服务器发送请求（轮询）来检查是否有新数据。这种方式会增加服务器负载和网络流量，因为很多时候请求可能得到的是没有新数据的响应。长轮询虽然在一定程度上改善了实时性，但本质上还是基于多次 HTTP 请求，仍存在效率问题。
- **双向通信困难**：HTTP 协议主要是客户端发起请求，服务器响应，很难实现服务器主动向客户端推送数据。而在许多现代 Web 应用中，服务器主动推送数据是非常必要的，例如即时通知、实时监控等功能。

## 2. WebSocket 解决的问题

- **实现全双工通信**：WebSocket 提供了一种全双工通信通道，在单个 TCP 连接上进行双向数据传输。这意味着客户端和服务器可以在任何时刻相互发送数据，无需像 HTTP 那样由客户端先发起请求。例如在实时聊天应用中，双方都能随时发送和接收消息，极大地提升了通信的实时性和效率。
- **降低开销**：与轮询和长轮询相比，WebSocket 一旦建立连接，就可以持续进行数据传输，避免了频繁创建和关闭 HTTP 连接带来的额外开销。这不仅减少了网络流量，还降低了服务器的负载，特别是在高并发的实时应用场景下，优势更为明显。
- **更好的实时性**：由于能够实时接收服务器推送的数据，Web 应用可以及时更新页面内容，为用户提供近乎实时的体验。比如在在线协作文档中，一个用户的编辑操作可以立即通过 WebSocket 通知到其他协作用户，使他们的页面实时更新。

## 3. WebSocket 的工作原理

1. **握手过程**：

   - WebSocket 通信始于一个 HTTP 请求。客户端发送一个特殊的 HTTP 请求到服务器，该请求包含了`Upgrade: websocket`和`Connection: Upgrade`头部字段，表明希望升级到 WebSocket 协议。
   - 如果服务器支持 WebSocket 协议，则会响应一个状态码为 101（Switching Protocols）的 HTTP 响应，表示同意升级，并完成握手过程。此时，初始的 HTTP 连接转变为 WebSocket 连接，双方可以开始通过这个连接双向传输数据了。

2. **数据帧格式**：

   - WebSocket 的数据帧包含多个部分，如 FIN 标志位（指示是否是最后一帧）、操作码（定义帧类型，比如文本、二进制或关闭连接等）、掩码（用于客户端到服务器的消息加密）、负载长度及实际数据等。
   - 这种帧结构确保了即使在网络不稳定的情况下也能可靠地传输数据。

3. **通信特点**：
   - **全双工通信**：与传统的 HTTP 请求/响应模式不同，WebSocket 允许客户端和服务器同时发送消息，无需等待对方响应。
   - **低延迟**：由于建立了一条持久连接，减少了频繁创建和销毁连接带来的开销，降低了延迟。
   - **高效性**：相比轮询等方式，WebSocket 更加节省带宽资源，因为它不需要重复发送 HTTP 头信息。

## 4. 应用场景

- **实时应用**：如聊天室、在线客服系统等，能够实现实时消息推送。
- **游戏开发**：特别是在多人在线游戏中，WebSocket 可以用来同步玩家的状态和动作。
- **金融交易**：对于需要快速响应市场变化的应用，如股票行情更新，WebSocket 提供了理想的解决方案。
- **社交网络**：帮助实现好友动态的即时更新等功能。

## 5. 优势与挑战

- **优势**：
  - 更好的用户体验：减少页面刷新次数，提供更流畅的交互体验。
  - 高效的数据传输：相较于长轮询等方法，WebSocket 能显著降低服务器负载并提高效率。
- **挑战**：
  - 兼容性问题：虽然大多数现代浏览器都支持 WebSocket，但在一些旧版本浏览器中可能需要考虑兼容性方案。
  - 安全考量：确保 WebSocket 连接的安全性同样重要，通常建议使用 wss://（WebSocket Secure）来加密通信。

## 6. 代码示例

以下是一个简单的使用 JavaScript 实现的 WebSocket 客户端和服务端示例。

**客户端代码（HTML + JavaScript）**：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF - 8" />
    <title>WebSocket Client</title>
  </head>

  <body>
    <input type="text" id="messageInput" placeholder="输入消息" />
    <button onclick="sendMessage()">发送</button>
    <ul id="messages"></ul>

    <script>
      const socket = new WebSocket("ws://localhost:8080");

      socket.onopen = function (event) {
        console.log("连接已建立");
      };

      socket.onmessage = function (event) {
        const messageItem = document.createElement("li");
        messageItem.textContent = "收到消息: " + event.data;
        document.getElementById("messages").appendChild(messageItem);
      };

      socket.onclose = function (event) {
        console.log("连接已关闭");
      };

      function sendMessage() {
        const message = document.getElementById("messageInput").value;
        socket.send(message);
        document.getElementById("messageInput").value = "";
      }
    </script>
  </body>
</html>
```

**服务端代码（使用 Node.js 和 ws 库）**：
首先需要安装 `ws` 库：`npm install ws`

```javascript
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("收到消息: %s", message);
    ws.send("你发送的消息是: " + message);
  });

  ws.send("欢迎连接到 WebSocket 服务器");
});
```

上述客户端代码创建了一个简单的界面，允许用户输入消息并发送给服务器，同时接收服务器返回的消息并显示。服务端代码使用 Node.js 和 `ws` 库搭建了一个 WebSocket 服务器，接收客户端发送的消息并回复。
