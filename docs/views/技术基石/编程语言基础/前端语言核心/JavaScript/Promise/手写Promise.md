# 手写 Promise

手写一个简化版的 `Promise`，可以帮助我们更好地理解其内部工作机制，尤其是状态的变化。下面是一个基本的 `Promise` 实现，展示了如何管理 `Pending`、`Fulfilled` 和 `Rejected` 这三种状态的变化。

## 核心代码

### 简化版 Promise 实现

```javascript
class SimplePromise {
  constructor(executor) {
    // 初始化状态为 Pending
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    // 成功处理函数
    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled"; // 更新状态为 Fulfilled
        this.value = value; // 保存成功值
        // 执行所有成功的回调
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    // 失败处理函数
    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected"; // 更新状态为 Rejected
        this.reason = reason; // 保存失败原因
        // 执行所有失败的回调
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err); // 如果执行器函数抛出错误，则直接拒绝这个 promise
    }
  }

  then(onFulfilled, onRejected) {
    if (this.state === "fulfilled") {
      onFulfilled(this.value);
    }
    if (this.state === "rejected") {
      onRejected(this.reason);
    }

    if (this.state === "pending") {
      // 如果当前状态是 pending，则将回调函数存储起来，等到状态改变时再调用
      this.onFulfilledCallbacks.push(() => onFulfilled(this.value));
      this.onRejectedCallbacks.push(() => onRejected(this.reason));
    }
  }
}

// 测试代码
let p = new SimplePromise((resolve, reject) => {
  setTimeout(() => {
    resolve("成功");
    // 或者 reject('失败');
  }, 1000);
});

p.then(
  (result) => {
    console.log(result); // 输出: 成功
  },
  (error) => {
    console.error(error);
  }
);
```

### 关键点说明

- **状态管理**：`SimplePromise` 类维护了三个状态：`pending`、`fulfilled` 和 `rejected`。初始状态总是 `pending`。
- **resolve 和 reject 函数**：这两个函数由构造函数接收的执行器（executor）提供，用于从外部改变 `Promise` 的状态和结果值或失败原因。

- **then 方法**：`.then()` 方法允许你指定在 `Promise` 被解决（resolved）或被拒绝（rejected）时应执行的操作。如果 `Promise` 已经处于 `fulfilled` 或 `rejected` 状态，则立即执行相应的回调；如果还在 `pending` 状态，则将回调函数存入队列，等待状态变更后再执行。

请注意，这是一个非常简化的实现，真正的 `Promise` 规范要求更复杂的功能，比如链式调用的支持、异常捕获等。此外，还需要考虑更多的边界情况和异步处理逻辑。尽管如此，上述实现已经足够展示 `Promise` 的核心概念和状态变化机制。

## `catch` 与`finnally` 方法

在 JavaScript 的 `Promise` 中，`catch` 方法是用于捕获和处理 `Promise` 被拒绝（rejected）的情况的便捷方式。它实际上是对 `.then(null, onRejected)` 的语法糖，专门用来处理错误或者异常情况。使用 `catch` 可以使代码更加清晰易读，并且有助于集中处理错误。

`finally` 是 JavaScript 中 `Promise` 的一个方法，它提供了一种无论 `Promise` 最终是成功（fulfilled）还是失败（rejected），都能执行一段代码的方式。这意味着，无论异步操作的结果如何，`finally` 方法中的回调函数都会被执行。这对于执行清理工作非常有用，例如关闭文件、断开网络连接等。

```js
class SimplePromise {
  /* ... */
  // 手动实现的.catch方法
  catch(onRejected) {
    return this.then(null, onRejected);
  }
  finally(callback) {
    return this.then(
      (value) => SimplePromise.resolve(callback()).then(() => value),
      (reason) =>
        SimplePromise.resolve(callback()).then(() => {
          throw reason;
        })
    );
  }
}
```

## `Promise.resolve` 与 `Promise.reject` 方法

在 JavaScript 中，`Promise.resolve` 和 `Promise.reject` 是 `Promise` 类的两个静态方法，它们提供了快速创建已解决（fulfilled）或已拒绝（rejected）状态的 `Promise` 的方式。

- **`Promise.resolve(value)`**：返回一个以给定值解析的 `Promise` 对象。如果该值是一个 `Promise`，则直接返回这个 `Promise`；如果不是，则返回一个以该值为结果的新 `Promise` 对象。
- **`Promise.reject(reason)`**：返回一个已经因给出的原因被拒绝的 `Promise` 对象。

这两个方法简化了创建特定状态 `Promise` 的过程，并且可以在需要时立即返回一个确定状态的 `Promise`。

### 手写实现

```javascript
class SimplePromise {
  /* ... */
  static resolve(value) {
    // 如果传入的是一个Promise对象，则直接返回它
    if (value instanceof SimplePromise) return value;

    // 创建一个新的Promise并立即resolve
    return new SimplePromise((resolve) => resolve(value));
  }
  static reject(reason) {
    // 创建一个新的Promise并立即reject
    return new SimplePromise((resolve, reject) => reject(reason));
  }
}
```

### 关键点说明

- **`Promise.resolve`**：首先检查传入的值是否已经是 `Promise` 类型。如果是，则直接返回这个 `Promise`。如果不是，则创建一个新的 `Promise` 并立即使用传入的值来调用 `resolve` 函数。
- **`Promise.reject`**：创建一个新的 `Promise` 并立即使用传入的原因来调用 `reject` 函数。这将导致新创建的 `Promise` 进入被拒绝的状态。

通过这种方式，我们可以轻松地根据具体情况创建处于特定状态的 `Promise` 对象，而无需每次都编写完整的异步逻辑。这种实现不仅简化了某些场景下的代码编写，也帮助我们更好地理解 `Promise` 的工作原理。

## `Promise.race` 与 `Promise.any` 方法

`Promise.race` 是一个静态方法，它接收一个可迭代对象（如数组）作为参数，这个可迭代对象包含了一个或多个 `Promise` 实例。`Promise.race` 方法会返回一个新的 `Promise`，这个新 `Promise` 的状态将由最先完成的 `Promise` 决定（无论是被解决还是被拒绝）。这意味着，只要有一个 `Promise` 被解决或被拒绝，`Promise.race` 返回的 `Promise` 就会立即采用该状态和值。

`Promise.any` 同样是一个静态方法，它也接收一个可迭代对象作为参数。不同的是，`Promise.any` 返回的 `Promise` 只会在所有传入的 `Promise` 都被拒绝后才会被拒绝，并且只有当至少有一个 `Promise` 成功解决时，它才会被解决。如果没有任何 `Promise` 成功解决，则返回一个 `AggregateError` 错误。

### 手写实现

```javascript
class SimplePromise {
  constructor(executor) {
    // 省略了构造函数的详细实现...
  }

  then(onFulfilled, onRejected) {
    // 简化版本的then方法实现...
  }

  static race(promises) {
    return new SimplePromise((resolve, reject) => {
      promises.forEach((promise) => {
        promise.then(resolve, reject);
      });
    });
  }
  static any(promises) {
    return new SimplePromise((resolve, reject) => {
      let errors = [];
      let resolvedCount = 0;

      if (promises.length === 0) {
        reject(new AggregateError("All promises were rejected"));
      } else {
        promises.forEach((promise, index) => {
          promise.then(
            (value) => resolve(value),
            (error) => {
              errors[index] = error;
              resolvedCount++;
              if (resolvedCount === promises.length) {
                reject(new AggregateError(errors));
              }
            }
          );
        });
      }
    });
  }
}
```

## `Promise.all` 与 `Promise.allSettled` 方法

#### `Promise.all`

`Promise.all` 是一个静态方法，它接收一个可迭代对象（如数组）作为参数，这个可迭代对象包含了一个或多个 `Promise` 实例。`Promise.all` 方法会返回一个新的 `Promise`，这个新 `Promise` 只有在所有传入的 `Promise` 都成功解决时才会被解决，并且会将所有结果作为一个数组传递给回调函数。如果任何一个 `Promise` 被拒绝，则整个 `Promise.all` 返回的 `Promise` 也会立即被拒绝。

#### `Promise.allSettled`

`Promise.allSettled` 同样是一个静态方法，它接收一个可迭代对象作为参数。与 `Promise.all` 不同的是，`Promise.allSettled` 返回的 `Promise` 总是会被解决，无论其中的 `Promise` 是否成功解决还是被拒绝。它返回的结果是一个对象数组，每个对象描述了对应的 `Promise` 的状态（fulfilled 或 rejected）及其值或错误原因。

### 手写实现

```javascript
class SimplePromise {
  /* ... */
  then(onFulfilled, onRejected) {
    // 简化版本的then方法实现...
  }

  static all(promises) {
    return new SimplePromise((resolve, reject) => {
      let results = [];
      let resolvedCount = 0;

      if (promises.length === 0) {
        resolve(results);
        return;
      }

      promises.forEach((promise, index) => {
        promise.then(
          (value) => {
            resolvedCount++;
            results[index] = value;
            if (resolvedCount === promises.length) {
              resolve(results);
            }
          },
          (error) => reject(error)
        );
      });
    });
  }
  static allSettled(promises) {
    return new SimplePromise((resolve) => {
      let results = [];
      let settledCount = 0;

      if (promises.length === 0) {
        resolve(results);
        return;
      }

      promises.forEach((promise, index) => {
        promise.then(
          (value) => {
            results[index] = { status: "fulfilled", value };
            settledCount++;
            if (settledCount === promises.length) {
              resolve(results);
            }
          },
          (error) => {
            results[index] = { status: "rejected", reason: error };
            settledCount++;
            if (settledCount === promises.length) {
              resolve(results);
            }
          }
        );
      });
    });
  }
}
```

### 关键点说明

- **`Promise.all`**：通过遍历所有的 `Promise` 并监听它们的成功和失败情况来收集结果。一旦所有 `Promise` 都成功解决，就会调用 `resolve` 并传递结果数组；如果有任何 `Promise` 失败，则立即调用 `reject` 并传递错误信息。
- **`Promise.allSettled`**：无论每个 `Promise` 的结果如何，都会记录其状态和结果或错误原因。当所有 `Promise` 都完成（无论是成功解决还是被拒绝），则调用 `resolve` 并传递包含所有 `Promise` 结果的对象数组。
