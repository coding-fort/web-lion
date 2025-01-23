# EventEmitter：Node 事件管理通用机制

`EventEmitter` 是 Node.js 中一个非常重要的类，它提供了事件驱动编程的核心功能。通过 `EventEmitter`，你可以轻松地创建和管理自定义事件，监听这些事件的发生，并在事件触发时执行相应的回调函数。这使得代码更加模块化、解耦合，并且易于维护。

## EventEmitter 的基本用法

`EventEmitter` 是 `events` 模块的一部分，因此你需要先引入该模块才能使用它。

```javascript
const EventEmitter = require("events");
```

### 创建 EventEmitter 实例

你可以直接从 `EventEmitter` 类创建一个新的实例：

```javascript
const myEmitter = new EventEmitter();
```

### 发布/订阅模式

`EventEmitter` 支持发布-订阅模式，即你可以在某个对象上注册（订阅）多个事件监听器，并在适当的时候发布（触发）这些事件。

#### 监听事件

使用 `.on()` 或 `.addListener()` 方法来监听特定的事件。每当指定的事件被触发时，对应的回调函数就会被执行。

```javascript
myEmitter.on("greet", () => {
  console.log("Hello, world!");
});
```

#### 触发事件

使用 `.emit()` 方法来触发（发布）一个事件。你可以传递任意数量的参数给监听器。

```javascript
myEmitter.emit("greet");
```

## 常用 API

以下是 `EventEmitter` 类的一些常用方法和属性：

### 方法

- **`.on(event, listener)`**：
  - 添加一个监听器到名为 `event` 的事件队列中。
- **`.off(event, listener)`**：
  - 从名为 `event` 的事件队列中移除一个监听器。
- **`.once(event, listener)`**：
  - 添加一个仅触发一次的监听器。当这个监听器第一次被调用后，它将自动移除自己。
- **`.removeListener(event, listener)`**：
  - 移除指定的监听器。如果存在多个相同的监听器，则只移除第一个匹配项。
- **`.removeAllListeners([event])`**：
  - 移除所有监听器。如果不指定 `event` 参数，则移除所有类型的监听器。
- **`.listeners(event)`**：
  - 返回一个数组，包含与指定 `event` 关联的所有监听器。
- **`.emit(event[, ...args])`**：
  - 触发名为 `event` 的事件，同时可以传递任意数量的参数给监听器。

### 属性

- **`.eventNames()`**：
  - 返回一个列表，包含所有已注册的事件名称。
- **`.listenerCount(eventName)`**：
  - 返回指定 `eventName` 的监听器数量。（注意：在较新的 Node.js 版本中，推荐使用 `.getMaxListeners()` 和 `.setMaxListeners()` 来替代此方法）

## 示例代码

下面的例子展示了如何使用 `EventEmitter` 来实现简单的事件处理：

```javascript
const EventEmitter = require("events");

// 创建一个 EventEmitter 实例
const myEmitter = new EventEmitter();

// 定义一个事件监听器
myEmitter.on("userCreated", (user) => {
  console.log(`User created: ${user.name}`);
});

// 使用 once() 方法添加一次性监听器
myEmitter.once("firstTimeLogin", (user) => {
  console.log(`Welcome first-time user: ${user.name}`);
});

// 触发事件并传递参数
myEmitter.emit("userCreated", { name: "Alice" });
myEmitter.emit("firstTimeLogin", { name: "Bob" });

// 再次触发 firstTimeLogin 不会触发任何效果，因为它是一次性的
myEmitter.emit("firstTimeLogin", { name: "Charlie" });
```

输出结果：

```
User created: Alice
Welcome first-time user: Bob
User created: Charlie
```

## 最佳实践

- **避免过多监听器**：每个事件默认最多允许 10 个监听器。如果你需要更多的监听器，请使用 `.setMaxListeners(n)` 方法调整限制。然而，通常情况下应该尽量减少监听器的数量以保持代码简洁。
- **清理不再使用的监听器**：当不再需要某个监听器时，记得使用 `.removeListener()` 或 `.removeAllListeners()` 方法将其移除，以防止内存泄漏。
- **使用一次性的监听器**：对于只需要响应一次的事件，使用 `.once()` 方法可以简化代码逻辑并确保不会重复触发。

- **错误处理**：为 `error` 事件设置监听器非常重要，因为如果没有监听器，未捕获的 `error` 事件会导致程序崩溃。你可以使用 `.on('error', callback)` 来处理这类事件。

```javascript
myEmitter.on("error", (err) => {
  console.error("Error occurred:", err.message);
});
```

## 扩展 EventEmitter

你可以继承 `EventEmitter` 类来自定义自己的事件发射器。这在构建复杂的模块或库时特别有用。

```javascript
class MyEmitter extends EventEmitter {
  constructor() {
    super();
    // 初始化代码...
  }

  triggerCustomEvent() {
    this.emit("customEvent", "some data");
  }
}

const myEmitterInstance = new MyEmitter();
myEmitterInstance.on("customEvent", (data) => {
  console.log(`Custom event triggered with data: ${data}`);
});

myEmitterInstance.triggerCustomEvent();
```

## 示例代码：使用 EventEmitter 实现 HTTP 事件监听

```javascript
const http = require("http");
const { EventEmitter } = require("events");

// 创建一个自定义的 EventEmitter 类
class HttpServerEvents extends EventEmitter {}

// 创建一个新的 EventEmitter 实例
const serverEvents = new HttpServerEvents();

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  // 触发 'request' 事件，传递 req 和 res 对象
  serverEvents.emit("request", req, res);
});

// 监听 'request' 事件
serverEvents.on("request", (req, res) => {
  console.log(`Received request for ${req.url}`);

  // 发送响应
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Hello World\n");
});

// 监听 'connection' 事件（可选）
server.on("connection", (socket) => {
  serverEvents.emit("connection", socket);
});

// 监听 'connection' 事件
serverEvents.on("connection", (socket) => {
  console.log("New connection established.");
});

// 监听 'close' 事件（当服务器关闭时触发）
server.on("close", () => {
  serverEvents.emit("close");
});

// 监听 'close' 事件
serverEvents.on("close", () => {
  console.log("HTTP server closed.");
});

// 开始监听端口
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`HTTP server is listening on port ${PORT}`);
});
```

### 解释

1. **创建自定义的 EventEmitter**：

   - 我们创建了一个名为 `HttpServerEvents` 的类，它继承自 `EventEmitter`。这使得我们可以为 HTTP 服务器添加自定义事件。

2. **创建 HTTP 服务器**：

   - 使用 `http.createServer()` 方法创建一个新的 HTTP 服务器实例。
   - 在服务器回调中，我们不直接处理请求，而是触发 `request` 事件，并将 `req` 和 `res` 对象作为参数传递给监听器。

3. **监听 'request' 事件**：

   - 使用 `serverEvents.on('request', callback)` 来监听 `request` 事件。每当有新的 HTTP 请求到达时，这个回调函数就会被执行。

4. **其他事件监听**：

   - 除了 `request` 事件外，还可以监听其他 HTTP 服务器事件，如 `connection`（新连接建立）和 `close`（服务器关闭）。这些事件可以直接在 `http.Server` 实例上监听，也可以通过自定义的 `EventEmitter` 来管理。

5. **启动服务器**：
   - 最后，调用 `server.listen()` 方法让服务器开始监听指定的端口。

## 总结

`EventEmitter` 是 Node.js 中用于实现事件驱动编程的基础工具。它提供了一套简单而强大的 API 来创建和管理自定义事件，使得代码结构更加清晰、解耦合。掌握 `EventEmitter` 的使用对于编写高效、可扩展的应用程序至关重要。
