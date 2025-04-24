# async 与 await

`async` 和 `await` 是 JavaScript 中用于简化异步代码处理的关键字，它们建立在 `Promise` 的基础上，但提供了更加直观和简洁的语法来处理异步操作。这使得异步代码看起来更像同步代码，从而提高了代码的可读性和维护性。

## 基础概念

- **`async` 函数**：使用 `async` 关键字声明的函数会自动返回一个 `Promise`。如果该函数返回一个值，则 `Promise` 会被解决（resolved）为该值；如果函数抛出错误，则 `Promise` 会被拒绝（rejected）。
- **`await` 表达式**：只能在 `async` 函数内部使用。它可以使异步函数暂停执行，直到等待的 `Promise` 被解决（resolved 或 rejected）。`await` 关键字的作用是等待一个 `Promise` 完成，并提取其结果作为表达式的值。

## 使用示例

### 基本用法

```javascript
async function fetchData() {
  let response = await fetch("https://api.example.com/data");
  let data = await response.json();
  console.log(data);
}

fetchData();
```

在这个例子中，`fetchData` 函数是一个异步函数，它首先等待从指定 URL 获取数据的请求完成，然后解析响应体为 JSON 格式的数据。这里使用了两次 `await`，分别等待两个异步操作完成。

### 错误处理

可以使用 `try...catch` 语句来捕获异步操作中的错误：

```javascript
async function fetchData() {
  try {
    let response = await fetch("https://api.example.com/data");
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Error:", error);
  }
}

fetchData();
```

这样，当任何被 `await` 的 `Promise` 被拒绝时，控制流就会跳转到 `catch` 块中，允许你优雅地处理错误。

### 并行执行

虽然 `await` 会使每个异步调用依次执行，但是你可以通过 `Promise.all` 来并行执行多个异步操作：

```javascript
async function fetchParallel() {
  let [data1, data2] = await Promise.all([
    fetch("https://api.example.com/data1").then((response) => response.json()),
    fetch("https://api.example.com/data2").then((response) => response.json()),
  ]);
  console.log(data1, data2);
}

fetchParallel();
```

这种方法不仅能够并行执行多个异步任务，还能以数组的形式接收所有任务的结果。

`async` 和 `await` 提供了一种更加直接的方式来编写异步代码，减少了回调地狱的问题，使得代码逻辑更加清晰易懂。对于需要处理复杂异步流程的应用来说，这些特性极大地提升了开发效率和代码质量。
