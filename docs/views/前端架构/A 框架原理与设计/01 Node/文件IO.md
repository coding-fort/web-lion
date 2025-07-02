# 文件 I/O

在 Node.js 中，文件 I/O（输入/输出）操作是通过内置的 `fs` 模块来实现的。这个模块提供了对文件系统的访问，允许你读取、写入、更新和删除文件以及管理目录等。以下是关于如何使用 `fs` 模块进行文件 I/O 操作的详细介绍。

## 异步 vs 同步

`fs` 模块中的大多数方法都有异步和同步两个版本。异步方法以非阻塞的方式执行，并且通常接受一个回调函数作为最后一个参数；而同步方法则会阻塞当前线程直到操作完成。

- **异步**：推荐用于生产环境，因为它不会阻塞事件循环。
- **同步**：适用于脚本或初始化阶段，在这些情况下短暂的阻塞是可以接受的。

## 读取文件

### 异步读取文件

```javascript
const fs = require("fs");

fs.readFile("example.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});
```

### 同步读取文件

```javascript
const fs = require("fs");

try {
  const data = fs.readFileSync("example.txt", "utf8");
  console.log(data);
} catch (err) {
  console.error(err);
}
```

## 写入文件

### 异步写入文件

```javascript
const fs = require("fs");

fs.writeFile("message.txt", "Hello Node.js", (err) => {
  if (err) throw err;
  console.log("The file has been saved!");
});
```

### 同步写入文件

```javascript
const fs = require("fs");

try {
  fs.writeFileSync("message.txt", "Hello Node.js");
  console.log("The file has been saved!");
} catch (err) {
  console.error(err);
}
```

## 判断目录是否存在

### 同步判断目录是否存在

```javascript
const fs = require("fs");
const path = require("path");

fs.exists(path.join(__dirname, "test"), (exists) => {});
```

### 异步判断目录是否存在

```javascript
const fs = require("fs");
const path = require("path");

try {
  let isExists = fs.existsSync(path.join(__dirname, "test"));
} catch (err) {
  console.error(err);
}
```

## 创建目录

### 异步创建目录

```javascript
const fs = require("fs");
const path = require("path");

fs.mkdir(path.join(__dirname, "test"), { recursive: true }, (err) => {
  if (err) throw err;
  console.log("Directory created...");
});
```

### 同步创建目录

```javascript
const fs = require("fs");
const path = require("path");

try {
  fs.mkdirSync(path.join(__dirname, "test"), { recursive: true });
  console.log("Directory created...");
} catch (err) {
  console.error(err);
}
```

## 删除文件或目录

### 异步删除文件

```javascript
const fs = require("fs");

fs.unlink("message.txt", (err) => {
  if (err) throw err;
  console.log("File deleted...");
});
```

### 异步删除目录（递归）

```javascript
const fs = require("fs");
const path = require("path");

fs.rmdir(path.join(__dirname, "test"), { recursive: true }, (err) => {
  if (err) throw err;
  console.log("Directory removed...");
});
```

### 同步删除文件

```javascript
const fs = require("fs");

try {
  fs.unlinkSync("message.txt");
  console.log("File deleted...");
} catch (err) {
  console.error(err);
}
```

## `promises`

Node.js 的 `fs` 模块提供了 `promises` 对象，它提供了异步操作的 `Promise` 版本。这使你可以使用 `async`/`await` 语法来编写更简洁的代码。

```javascript
const fs = require("fs").promises;
async function test() {
  let content = await fs.readFile("example.txt", "utf8");
}
```

## 流式操作

对于大文件或者需要高效处理的数据，可以使用流（Stream）。Node.js 提供了两种主要类型的流：

- **可读流（Readable Streams）**：从源中读取数据。
- **可写流（Writable Streams）**：将数据写入目的地。

例如，你可以用流来复制文件：

```javascript
const fs = require("fs");

// 创建读取流
const readStream = fs.createReadStream("source-file.txt");

// 创建写入流
const writeStream = fs.createWriteStream("destination-file.txt");

// 将读取流管道到写入流
readStream.pipe(writeStream);

console.log("File is being copied...");
```

## 文件信息

要获取文件的状态或元数据，可以使用 `fs.stat()` 或其同步版本 `fs.statSync()`。

```javascript
const fs = require("fs");

fs.stat("example.txt", (err, stats) => {
  if (err) throw err;

  console.log(`Is a file: ${stats.isFile()}`);
  console.log(`Is a directory: ${stats.isDirectory()}`);
  console.log(`Size in bytes: ${stats.size}`);
  console.log(`Last modified: ${stats.mtime}`);
});
```

## 总结

Node.js 的 `fs` 模块为文件 I/O 操作提供了一个强大的接口，支持多种方式来处理文件系统。无论是简单的读写操作还是更复杂的流式处理，`fs` 都能满足你的需求。
