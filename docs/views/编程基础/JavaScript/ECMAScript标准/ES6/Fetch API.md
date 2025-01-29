# Fetch API

ES6 本身并没有直接引入`Fetch API`，但随着现代浏览器的发展，`Fetch API`成为了处理网络请求的现代方式，并且与 ES6 的新特性（如 Promises 和 async/await）配合使用，可以非常方便地进行异步数据获取。

## Fetch API 基础

`Fetch API` 提供了一个用于发起 HTTP 请求的接口。相比于传统的`XMLHttpRequest`，它更加简洁、灵活，返回一个`Promise`对象，使得异步代码更加直观易读。

### 发起 GET 请求

下面是一个简单的例子，展示了如何使用`fetch()`来发起一个 GET 请求并处理响应：

```javascript
fetch("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json(); // 解析JSON数据
  })
  .then((data) => console.log(data)) // 输出解析后的数据
  .catch((error) =>
    console.error("There was a problem with the fetch operation:", error)
  );
```

### 发起 POST 请求

使用`fetch()`发起 POST 请求时，需要提供第二个参数，即请求的配置对象，其中包含请求方法、请求头以及请求体等信息：

```javascript
fetch("https://jsonplaceholder.typicode.com/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "foo",
    body: "bar",
    userId: 1,
  }),
})
  .then((response) => response.json()) // 解析JSON数据
  .then((data) => console.log(data)) // 输出响应的数据
  .catch((error) => console.error("Error:", error)); // 错误处理
```

## 使用 async/await

结合 ES6 的`async`和`await`关键字，可以使异步代码看起来更像同步代码，提高可读性：

```javascript
async function postData(url = "", data = {}) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json(); // 解析 JSON
}

postData("https://jsonplaceholder.typicode.com/posts", {
  title: "foo",
  body: "bar",
  userId: 1,
})
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

或者将整个流程封装在一个异步函数中，以便于调用：

```javascript
async function example() {
  try {
    let response = await fetch("https://jsonplaceholder.typicode.com/posts/1");
    let data = await response.json();
    console.log(data);
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

example();
```

通过`Fetch API`及其与 ES6 新特性的结合使用，开发者能够以一种更加高效、清晰的方式处理各种网络请求，极大地简化了前端开发中的异步编程模型。
