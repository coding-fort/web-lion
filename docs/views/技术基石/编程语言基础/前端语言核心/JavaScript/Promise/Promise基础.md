# Promise 基础

在 JavaScript 中，`Promise` 是一种用于处理异步操作的对象，它代表了一个异步操作的最终完成（或失败）及其结果值。`Promise` 提供了一种更清晰和可控的方式来处理异步代码，相比于传统的回调函数方式，它减少了“回调地狱”的问题。以下是 `Promise` 的基础概念和使用方法：

## Promise 状态

在 JavaScript 中，`Promise` 对象有三种状态（states），这些状态描述了异步操作的当前进展：

1. **Pending（进行中）**：这是 `Promise` 的初始状态。它表示异步操作尚未完成。当一个 `Promise` 被创建后，它会立即进入这个状态。

2. **Fulfilled（已成功）**：当异步操作成功完成时，`Promise` 会进入此状态。此时，`Promise` 的结果值是可用的，并且可以通过 `.then()` 方法访问到这个结果。

3. **Rejected（已失败）**：如果异步操作遇到错误或未能成功完成，则 `Promise` 将进入此状态。与成功状态类似，失败的状态也有一个相关联的原因或错误信息，这可以通过 `.catch()` 方法或者 `.then()` 方法的第二个参数来处理。

### 状态转换

- 从 `Pending` 状态开始，一个 `Promise` 只能转变成 `Fulfilled` 或者 `Rejected` 状态之一。
- 一旦 `Promise` 变为 `Fulfilled` 或 `Rejected`，它的状态就不可再改变，也就是说，`Promise` 的状态转换是单向且不可逆的。

### 使用示例

```javascript
let myPromise = new Promise(function (resolve, reject) {
  // 异步操作
  setTimeout(function () {
    let successful = true; // 假设这是一个异步操作的结果
    if (successful) {
      resolve("操作成功"); // Promise 进入 Fulfilled 状态
    } else {
      reject("操作失败"); // Promise 进入 Rejected 状态
    }
  }, 1000);
});

myPromise
  .then(function (result) {
    console.log(result); // 如果 Promise 成功，这里将输出 "操作成功"
  })
  .catch(function (error) {
    console.error(error); // 如果 Promise 失败，这里将输出 "操作失败"
  });
```

在这个例子中，`myPromise` 初始处于 `Pending` 状态。一秒后，根据 `successful` 变量的值，`Promise` 要么通过调用 `resolve` 函数转变为 `Fulfilled` 状态，要么通过调用 `reject` 函数转变为 `Rejected` 状态。随后，`.then()` 和 `.catch()` 方法分别用于处理这两种情况。

## 创建一个 Promise

你可以通过 `Promise` 构造函数来创建一个新的 `Promise` 对象。构造函数接受一个执行器函数作为参数，这个执行器函数本身又接受两个参数：`resolve` 和 `reject` 函数。

- `resolve(value)`：当异步操作成功时调用此函数，表示操作成功完成，并将 `value` 作为结果。
- `reject(error)`：当异步操作失败时调用此函数，表示操作失败，并将 `error` 作为失败原因。

```javascript
let myPromise = new Promise(function (resolve, reject) {
  // 异步操作
  setTimeout(function () {
    let success = true;
    if (success) {
      resolve("操作成功");
    } else {
      reject("操作失败");
    }
  }, 1000);
});
```

## 使用 then 方法处理结果

一旦你有了一个 `Promise` 对象，就可以使用 `.then()` 方法来添加处理程序，以处理当 `Promise` 被解决（resolved）或被拒绝（rejected）的情况。`.then(onFulfilled, onRejected)` 接受两个可选参数，分别是 `resolve` 和 `reject` 后的回调函数。

```javascript
myPromise.then(
  function (result) {
    console.log(result); // 输出 "操作成功"
  },
  function (error) {
    console.error(error); // 如果 promise 被拒绝，则输出错误信息
  }
);
```

## Catch 处理错误

除了使用 `then` 的第二个参数来处理错误之外，还可以使用 `.catch(onRejected)` 方法专门处理 `Promise` 被拒绝的情况。这使得错误处理更加直观和集中。

```javascript
myPromise
  .then(function (result) {
    console.log(result);
  })
  .catch(function (error) {
    console.error(error);
  });
```

## Promise 链

`Promise` 支持链式调用，这意味着你可以在一个 `.then()` 方法中返回另一个 `Promise` 或者任何类型的值，然后在下一个 `.then()` 中接收这个值。这样可以避免深层次嵌套，使代码更加扁平化。

```javascript
myPromise
  .then(function (result) {
    console.log(result);
    return "新的值";
  })
  .then(function (newValue) {
    console.log(newValue); // 输出 "新的值"
  })
  .catch(function (error) {
    console.error(error);
  });
```

## 其他静态方法

- **Promise.resolve(value)**：返回一个以给定值解析的 `Promise` 对象。如果传入的是一个 `Promise` 对象，则直接返回该对象；如果不是，则返回一个以该值为结果的新 `Promise` 对象。
- **Promise.reject(reason)**：返回一个已被拒绝的 `Promise` 对象。
- **Promise.all(iterable)**：接收一个 `Promise` 实例的数组（或其他可迭代对象），当所有 `Promise` 都被解决时才解决，并返回一个包含所有结果值的数组。如果有任何一个被拒绝，则立即拒绝。
- **Promise.race(iterable)**：与 `Promise.all` 类似，但它只等待第一个完成的 `Promise`，并以其结果作为最终结果。

理解 `Promise` 基础有助于编写更清晰、更易于维护的异步代码，尤其是在处理复杂的异步操作流时显得尤为重要。
