# JavaScript Promise 从入门到精通：全面掌握异步编程核心

## 一、Promise 基础概念与核心机制

### 1.1 为什么需要 Promise？

在 JavaScript 中，由于其单线程特性，当执行耗时操作（如网络请求、文件读取等）时会导致页面阻塞，影响用户体验。为了解决这个问题，异步编程被提出，但传统的回调函数方式容易导致 "回调地狱"，使代码难以维护。

回调地狱的问题：

```javascript
doSomething(function (result) {
  doSomethingElse(
    result,
    function (newResult) {
      doThirdThing(
        newResult,
        function (finalResult) {
          console.log("Got the final result: " + finalResult);
        },
        failureCallback
      );
    },
    failureCallback
  );
}, failureCallback);
```

回调嵌套过深导致的问题：

- 代码臃肿，可读性差
- 代码复用性差
- 耦合度高，维护困难
- 异常处理只能在回调中进行

Promise 的出现正是为了解决这些问题，它提供了一种更优雅的异步编程解决方案，使代码更加清晰和易于维护。

### 1.2 Promise 基本概念与状态变化

#### 1.2.1 Promise 的定义与基本特性

Promise 是 ES6 引入的异步编程解决方案，它是一个构造函数，自身有 all、reject、resolve 等方法，原型上有 then、catch 等方法。

简单来说，Promise 是一个容器，里面保存着某个未来才会结束的异步操作的结果。它有以下几个关键特性：

- 状态不受外界影响：Promise 对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和 rejected（已失败）。只有异步操作的结果才能决定当前状态，其他任何操作都无法改变。
- 状态一旦改变就不会再变：Promise 状态的改变只有两种可能：从 pending 变为 fulfilled 或从 pending 变为 rejected。一旦状态改变，就凝固了，不会再变。这也被称为 "已定型"（resolved）。
- 结果获取机制：如果状态改变已经发生，再对 Promise 对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是如果你错过了它，再去监听是得不到结果的。

#### 1.2.2 Promise 的三种状态详解

Promise 有三种状态，这三种状态构成了 Promise 的核心机制：

- pending（进行中）：初始状态，既不是成功也不是失败状态。在这个阶段，Promise 的结果还未确定。
- fulfilled（已成功）：表示异步操作成功完成，并且有了一个返回结果。此时 Promise 会调用 then 方法中定义的成功回调函数。
- rejected（已失败）：表示异步操作失败，此时 Promise 会调用 then 方法中定义的失败回调函数或 catch 方法中的回调函数。

状态转换的规则：

- 只能从 pending 转换为 fulfilled 或 rejected
- 一旦转换完成，状态就不能再改变
- 转换过程不可逆

状态变化的示例：

```javascript
const promise = new Promise((resolve, reject) => {
  // 异步操作
  if (/* 操作成功 */) {
    resolve(value); // 成功，传递结果，状态变为fulfilled
  } else {
    reject(error); // 失败，传递错误，状态变为rejected
  }
});
```

### 1.3 Promise 的基本使用方法

#### 1.3.1 创建 Promise 对象

创建 Promise 对象的基本语法：

```javascript
const promise = new Promise((resolve, reject) => {
  // 执行异步操作
  // 如果成功，调用resolve(value)
  // 如果失败，调用reject(error)
});
```

Promise 构造函数的执行时机：
当创建 Promise 实例时，传入的函数会立即执行。这意味着以下代码的执行顺序是确定的：

```javascript
console.log("开始");

const promise = new Promise((resolve, reject) => {
  console.log("Promise构造函数执行");
  resolve();
});

console.log("结束");

promise.then(() => {
  console.log("resolved回调执行");
});

// 输出顺序：
// 开始
// Promise构造函数执行
// 结束
// resolved回调执行
```

这表明 Promise 构造函数内部的代码是同步执行的，而 then 方法中的回调函数是异步执行的，会在当前脚本所有同步任务执行完毕后才执行。

#### 1.3.2 基本 API 与使用模式

Promise 提供了几个关键的实例方法和静态方法：

实例方法：

- then(onFulfilled, onRejected)：添加成功和失败的回调函数。返回一个新的 Promise 对象，可以链式调用。
- catch(onRejected)：添加失败的回调函数，相当于 then(null, onRejected)。
- finally(onFinally)：添加一个无论 Promise 成功或失败都会执行的回调函数。

静态方法：

- Promise.resolve(value)：返回一个状态为 fulfilled 的 Promise 对象。
- Promise.reject(reason)：返回一个状态为 rejected 的 Promise 对象。
- Promise.all(iterable)：接收一个 Promise 数组，返回一个新的 Promise，只有当所有 Promise 都成功时才成功；如果有任何一个 Promise 失败，新 Promise 就会失败。
- Promise.race(iterable)：接收一个 Promise 数组，返回一个新的 Promise，哪个 Promise 先完成就返回哪个 Promise 的结果。

基本使用模式：

```javascript
// 创建Promise对象
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    if (Math.random() > 0.5) {
      resolve("成功");
    } else {
      reject("失败");
    }
  }, 1000);
});

// 使用then和catch处理结果
promise
  .then((result) => {
    console.log(result); // 成功时执行
  })
  .catch((error) => {
    console.log(error); // 失败时执行
  })
  .finally(() => {
    console.log("无论成功失败都会执行"); // 无论成功失败都会执行
  });
```

### 1.4 Promise 执行顺序与事件循环

理解 Promise 的执行顺序对于掌握其工作机制至关重要。Promise 的回调函数属于微任务（Microtask），会在当前宏任务（Macrotask）执行完毕后，下一个宏任务开始前执行。

Promise 与事件循环的关系：

- JavaScript 执行环境是单线程的，所有任务分为同步任务和异步任务。
- 同步任务直接在调用栈中执行。
- 异步任务分为宏任务（如 setTimeout、setInterval、I/O 操作）和微任务（如 Promise 回调、process.nextTick）。
- 事件循环的基本流程是：执行同步任务 → 执行所有微任务 → 执行下一个宏任务。

执行顺序示例：

```javascript
console.log("同步代码1");

setTimeout(() => {
  console.log("宏任务回调");
}, 0);

Promise.resolve()
  .then(() => {
    console.log("微任务回调1");
    return Promise.resolve("微任务回调2");
  })
  .then((result) => {
    console.log(result);
  });

console.log("同步代码2");

// 输出顺序：
// 同步代码1
// 同步代码2
// 微任务回调1
// 微任务回调2
// 宏任务回调
```

执行过程解析：

1. 执行同步代码 console.log('同步代码 1')和 console.log('同步代码 2')。
2. 遇到 setTimeout，将其回调函数放入宏任务队列。
3. 遇到 Promise，立即执行其构造函数（同步执行），然后将 then 回调放入微任务队列。
4. 当前同步代码执行完毕，检查微任务队列，执行所有微任务（两个 then 回调）。
5. 微任务执行完毕后，执行下一个宏任务（setTimeout 回调）。

这种执行顺序确保了 Promise 的回调函数能够在当前代码块的所有同步操作完成后立即执行，同时不会阻塞后续的异步操作。

## 二、Promise 进阶应用与高级技巧

### 2.1 链式调用与错误处理

#### 2.1.1 链式调用的原理与优势

Promise 的最大优势之一是其链式调用机制，这使得异步代码可以像同步代码一样线性书写，避免了回调地狱。

链式调用的原理：
then 方法返回一个新的 Promise 对象，这使得我们可以在一个调用链中处理多个异步操作。每个 then 方法中可以返回一个值或另一个 Promise，后续的 then 方法将处理这个结果。

链式调用的基本模式：

```javascript
promise
  .then((result1) => {
    // 处理result1，返回一个值或新的Promise
    return result1 + 1;
  })
  .then((result2) => {
    // 处理result2
    console.log(result2);
  })
  .catch((error) => {
    // 处理错误
    console.error(error);
  });
```

链式调用的优势：

- 代码更清晰，可读性更高
- 错误处理更统一
- 更容易实现复杂的异步流程控制
- 代码复用性更好

#### 2.1.2 错误处理机制与最佳实践

在 Promise 中，错误处理是一个关键点。Promise 提供了几种错误处理方式：

基本错误处理方法：

- 使用 catch 方法捕获错误：

```javascript
promise
  .then((result) => {
    // 处理结果
  })
  .catch((error) => {
    // 处理错误
  });
```

- 在 then 方法中提供第二个参数（失败回调）：

```javascript
promise.then(
  (result) => {
    /* 成功回调 */
  },
  (error) => {
    /* 失败回调 */
  }
);
```

- 使用 finally 方法执行最终清理操作：

```javascript
promise
  .then((result) => {
    /* 成功回调 */
  })
  .catch((error) => {
    /* 失败回调 */
  })
  .finally(() => {
    /* 无论成功失败都会执行 */
  });
```

错误冒泡机制：
Promise 链中的错误会自动向上冒泡，直到被捕获。如果一个 Promise 链中没有任何 catch 方法，错误会一直向上传播，最终可能导致应用崩溃。

错误处理最佳实践：

- 在 Promise 链的末尾添加 catch 方法，确保所有潜在错误都能被捕获。
- 使用 try...catch 结合 async/await 来同步处理异步错误。
- 对于可能失败的 Promise 操作，优先使用 catch 方法而不是在 then 中提供第二个参数。
- 在 finally 中执行必要的清理操作，如关闭资源、取消订阅等。

错误处理示例：

```javascript
// 错误冒泡示例
function asyncTask() {
  return new Promise((resolve, reject) => {
    throw new Error("任务失败");
  });
}

asyncTask()
  .then((result) => {
    console.log("成功:", result);
  })
  .catch((error) => {
    console.error("错误:", error); // 会捕获到错误
  });

// 自动向上冒泡示例
function step1() {
  return new Promise((resolve, reject) => {
    reject("Step1失败");
  });
}

function step2() {
  return new Promise((resolve, reject) => {
    resolve("Step2成功");
  });
}

step1()
  .then((result) => step2())
  .catch((error) => {
    console.error("捕获到错误:", error); // 会捕获到Step1的错误
  });
```

### 2.2 并发控制与任务管理

#### 2.2.1 Promise.all 与 Promise.race 的应用

Promise 提供了两个静态方法来处理多个 Promise 的并发执行：Promise.all 和 Promise.race。

Promise.all 的应用场景：
Promise.all 接收一个 Promise 数组，返回一个新的 Promise，只有当所有输入的 Promise 都成功时才会成功，返回一个包含所有结果的数组。如果有任何一个 Promise 失败，整个 Promise.all 就会立即失败。

应用场景示例：

```javascript
// 同时发起多个请求并等待所有结果
const promises = [
  fetch("/api/data1"),
  fetch("/api/data2"),
  fetch("/api/data3"),
];

Promise.all(promises)
  .then((responses) => {
    // 处理所有响应
    return Promise.all(responses.map((res) => res.json()));
  })
  .then((data) => {
    console.log("所有数据:", data);
  })
  .catch((error) => {
    console.error("请求失败:", error);
  });
```

Promise.race 的应用场景：
Promise.race 同样接收一个 Promise 数组，但只要有一个 Promise 完成（无论成功或失败），它就会立即返回该结果，其他 Promise 的结果将被忽略。

应用场景示例：

```javascript
// 设置请求超时
function fetchWithTimeout(url, timeout) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("请求超时")), timeout);
  });

  return Promise.race([fetch(url), timeoutPromise]);
}

fetchWithTimeout("/api/data", 5000)
  .then((response) => response.json())
  .then((data) => console.log("数据:", data))
  .catch((error) => console.error("错误:", error));
```

#### 2.2.2 高级并发控制技巧

在实际开发中，我们常常需要更精细的并发控制，例如限制最大并发数、管理动态任务队列等。

限制最大并发数：
当有大量异步任务需要执行时，直接使用 Promise.all 可能会导致性能问题或资源耗尽。此时可以通过自定义函数来限制最大并发数。

实现思路：

- 使用一个数组来保存当前正在执行的任务。
- 当执行的任务数量达到限制时，等待其中一个任务完成后再继续执行下一个任务。
- 使用 async/await 和 Promise.race 来实现阻塞和任务管理。

实现代码：

```javascript
async function asyncPool(limit, tasks) {
  const results = [];
  const executing = [];

  for (const task of tasks) {
    const p = task(); // 执行任务函数，得到Promise
    results.push(p); // 将Promise存入结果数组

    // 如果并发数设置为0或大于任务数，直接执行所有任务
    if (limit <= 0 || limit >= tasks.length) continue;

    // 当正在执行的任务数达到限制时，等待其中一个完成
    if (executing.length >= limit) {
      await Promise.race(executing);
    }

    // 将当前任务加入执行队列
    executing.push(p);

    // 任务完成后从执行队列中移除
    p.then(() => executing.splice(executing.indexOf(p), 1));
  }

  return Promise.all(results);
}

// 使用示例
const tasks = [
  () =>
    new Promise((resolve) =>
      setTimeout(() => {
        console.log("任务1完成");
        resolve(1);
      }, 1000)
    ),
  () =>
    new Promise((resolve) =>
      setTimeout(() => {
        console.log("任务2完成");
        resolve(2);
      }, 2000)
    ),
  () =>
    new Promise((resolve) =>
      setTimeout(() => {
        console.log("任务3完成");
        resolve(3);
      }, 1500)
    ),
];

asyncPool(2, tasks).then((results) => console.log("所有任务结果:", results));
```

动态任务队列管理：
在某些场景下，任务不是预先确定的，而是动态生成的。这时可以使用生成器函数或队列来管理任务。

实现思路：

- 使用一个生成器函数来动态生成任务。
- 使用 for await...of 循环来逐个执行任务。
- 结合并发控制逻辑，限制同时执行的任务数量。

实现代码：

```javascript
async function* taskGenerator(tasks) {
  for (const task of tasks) {
    yield task();
  }
}

async function runTasks(tasks, limit) {
  const results = [];
  let pool = [];

  for await (const result of taskGenerator(tasks)) {
    pool.push(result);
    results.push(result);

    if (pool.length >= limit) {
      await Promise.race(pool);
      pool = pool.filter((p) => !p.isFulfilled && !p.isRejected);
    }
  }

  return Promise.all(results);
}

// 使用示例
const tasks = [
  () => new Promise((resolve) => setTimeout(() => resolve(1), 1000)),
  () => new Promise((resolve) => setTimeout(() => resolve(2), 2000)),
  () => new Promise((resolve) => setTimeout(() => resolve(3), 1500)),
];

runTasks(tasks, 2).then((results) => console.log("所有任务结果:", results));
```

### 2.3 超时处理与取消机制

#### 2.3.1 实现超时处理的多种方法

在异步编程中，设置超时是一个常见需求。以下是几种实现 Promise 超时处理的方法：

方法一：使用 Promise.race 和 setTimeout
这是最基本的超时处理方法，利用 Promise.race 的特性，哪个 Promise 先完成就返回哪个结果。

```javascript
function withTimeout(promise, timeout) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("操作超时")), timeout);
    }),
  ]);
}

// 使用示例
const fetchData = () => fetch("/api/data");

withTimeout(fetchData(), 5000)
  .then((response) => response.json())
  .then((data) => console.log("数据:", data))
  .catch((error) => console.error("错误:", error));
```

方法二：使用 AbortController（现代浏览器支持）
AbortController 提供了更优雅的方式来取消 Promise，特别是对于可取消的操作（如 fetch 请求）。

```javascript
function fetchWithAbort(url, timeout) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const fetchPromise = fetch(url, { signal: controller.signal }).then(
    (response) => {
      clearTimeout(timeoutId);
      return response.json();
    }
  );

  return { fetchPromise, controller };
}

// 使用示例
const { fetchPromise, controller } = fetchWithAbort("/api/data", 5000);

fetchPromise
  .then((data) => console.log("数据:", data))
  .catch((error) => {
    if (error.name === "AbortError") {
      console.error("请求已取消");
    } else {
      console.error("错误:", error);
    }
  });

// 如果需要手动取消请求，可以调用controller.abort()
// 在组件卸载时非常有用，防止内存泄漏
```

方法三：自定义超时处理函数
可以创建一个更通用的超时处理函数，支持更复杂的场景。

```javascript
function timeout(ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("操作超时"));
    }, ms);
  });
}

function withTimeout(promise, timeout) {
  return Promise.all([promise, timeout(timeout)]).then((results) => results[0]);
}

// 使用示例
withTimeout(fetchData(), 5000)
  .then((data) => console.log("数据:", data))
  .catch((error) => console.error("错误:", error));
```

#### 2.3.2 取消 Promise 的高级技巧

在某些情况下，我们需要能够取消正在执行的 Promise，而不仅仅是设置超时。以下是几种实现取消的方法：

方法一：使用 AbortController（推荐）
AbortController 是现代浏览器提供的 API，用于取消基于 Promise 的异步操作，特别是网络请求。

```javascript
function fetchWithCancel(url) {
  const controller = new AbortController();
  const signal = controller.signal;

  const fetchPromise = fetch(url, { signal })
    .then((response) => response.json())
    .catch((error) => {
      if (error.name === "AbortError") {
        console.log("请求已取消");
      } else {
        console.error("请求失败:", error);
      }
    });

  return { fetchPromise, controller };
}

// 使用示例
const { fetchPromise, controller } = fetchWithCancel("/api/data");

// 在需要取消请求时调用
// controller.abort();

// 处理结果
fetchPromise.then((data) => console.log("数据:", data));
```

方法二：使用可取消的 Promise 包装器
可以创建一个通用的可取消 Promise 包装器，适用于各种异步操作。

```javascript
function cancellable(promise) {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (value) =>
        isCanceled ? reject(new Error("Promise已取消")) : resolve(value),
      (error) =>
        isCanceled ? reject(new Error("Promise已取消")) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCanceled = true;
    },
  };
}

// 使用示例
const { promise, cancel } = cancellable(fetchData());

// 在需要取消时调用cancel()
// cancel();

promise
  .then((data) => console.log("数据:", data))
  .catch((error) => console.error("错误:", error));
```

方法三：使用 Promise.try（ES2025 新特性）
ES2025 引入了 Promise.try 方法，它提供了一种更优雅的方式来处理可能失败的同步或异步操作。

```javascript
// 假设Promise.try已经可用
Promise.try(() => {
  // 可能抛出错误的同步或异步操作
})
  .then((result) => {
    // 处理成功结果
  })
  .catch((error) => {
    // 处理错误
  });
```

## 三、Promise 在主流框架中的应用

### 3.1 React 中的 Promise 应用

#### 3.1.1 数据获取与状态管理

在 React 中，Promise 广泛用于数据获取和状态管理。以下是几种常见的应用场景：

使用 useEffect 获取数据：

```javascript
import { useEffect, useState } from "react";

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("用户未找到");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <p>加载中...</p>;
  if (error) return <p>错误: {error}</p>;
  return <div>{/* 显示用户信息 */}</div>;
}
```

使用 async/await 处理多个请求：

```javascript
function fetchUserData(userId) {
  return Promise.all([
    fetch(`/api/users/${userId}`),
    fetch(`/api/posts?userId=${userId}`),
  ])
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then(([user, posts]) => ({ user, posts }));
}

// 在组件中使用
const [userData, setUserData] = useState(null);

useEffect(() => {
  fetchUserData(1)
    .then((data) => setUserData(data))
    .catch((error) => console.error(error));
}, []);
```

使用 React-Async 库简化异步操作：
React-Async 是一个专门用于处理 React 中异步操作的库，提供了更简洁的 API。

```javascript
import { useAsync } from "react-async";

function UserProfile({ userId }) {
  const { data, error, isLoading } = useAsync({
    promiseFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
    immediate: true,
  });

  if (isLoading) return <p>加载中...</p>;
  if (error) return <p>错误: {error.message}</p>;
  return <div>{/* 显示用户信息 */}</div>;
}
```

#### 3.1.2 处理组件卸载时的竞态条件

在 React 中，组件卸载时可能会有未完成的异步操作，这可能导致状态更新错误。可以通过以下方法处理：

方法一：使用 AbortController 取消请求

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("用户未找到");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      controller.abort(); // 组件卸载时取消请求
    };
  }, [userId]);

  // 渲染逻辑
}
```

方法二：使用 isMounted 标志

```javascript
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  let isMounted = true;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) throw new Error("用户未找到");
        const data = await response.json();
        if (isMounted) {
          setUser(data);
        }
      } catch (error) {
        if (isMounted) {
          setError(error.message);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // 渲染逻辑
}
```

#### 3.1.3 高级模式：状态共享与并行加载

在复杂应用中，可能需要共享数据状态或并行加载多个资源。

共享数据状态：
使用 React Context 或状态管理库（如 Redux、Recoil）来共享异步数据。

```javascript
// 使用Context
import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user");
        if (!response.ok) throw new Error("用户未找到");
        const data = await response.json();
        setUser(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error }}>
      {children}
    </UserContext.Provider>
  );
}

function useUser() {
  return useContext(UserContext);
}

// 在子组件中使用
function Profile() {
  const { user, loading, error } = useUser();
  // 渲染逻辑
}
```

并行加载多个资源：

```javascript
function useMultipleResources() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const [user, posts, comments] = await Promise.all([
          fetch("/api/user"),
          fetch("/api/posts"),
          fetch("/api/comments"),
        ]);

        const [userData, postsData, commentsData] = await Promise.all([
          user.json(),
          posts.json(),
          comments.json(),
        ]);

        setData({ user: userData, posts: postsData, comments: commentsData });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  return { data, loading, error };
}

// 使用示例
function Dashboard() {
  const { data, loading, error } = useMultipleResources();
  // 渲染逻辑
}
```

### 3.2 Vue 中的 Promise 应用

#### 3.2.1 数据获取与组件生命周期

在 Vue 中，Promise 主要用于异步数据获取和组件生命周期管理。

在组件中使用 async/await 获取数据：

```vue
<template>
  <div>
    <h1>{{ user.name }}</h1>
    <p v-if="loading">加载中...</p>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";

  const user = ref(null);
  const loading = ref(true);
  const error = ref(null);

  onMounted(async () => {
    try {
      const response = await fetch("/api/user");
      if (!response.ok) throw new Error("用户未找到");
      const data = await response.json();
      user.value = data;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });
</script>
```

使用 watch 监听依赖变化并重新获取数据：

```vue
<template>
  <div>
    <input v-model="userId" type="number" placeholder="用户ID" />
    <div v-if="loading">加载中...</div>
    <div v-if="user">{{ user.name }}</div>
    <div v-if="error">{{ error }}</div>
  </div>
</template>

<script setup>
  import { ref, watch } from "vue";

  const userId = ref(1);
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);

  watch(
    userId,
    async (newId) => {
      try {
        loading.value = true;
        const response = await fetch(`/api/users/${newId}`);
        if (!response.ok) throw new Error("用户未找到");
        const data = await response.json();
        user.value = data;
        error.value = null;
      } catch (err) {
        error.value = err.message;
        user.value = null;
      } finally {
        loading.value = false;
      }
    },
    { immediate: true }
  );
</script>
```

#### 3.2.2 自定义指令与 Promise

在 Vue 中，可以将 Promise 与自定义指令结合，实现更复杂的功能。

自定义指令实现图片预加载：

```vue
<template>
  <div v-preload-image="imageUrl">
    <img :src="imageUrl" alt="预加载图片" />
  </div>
</template>

<script setup>
  import { defineDirective } from "vue";

  const preloadImage = defineDirective((el, binding) => {
    const img = new Image();
    img.onload = () => {
      // 图片加载完成后执行的操作
    };
    img.onerror = () => {
      // 图片加载失败后执行的操作
    };
    img.src = binding.value;
  });
</script>
```

使用 Promise 封装自定义指令：

```vue
<template>
  <div>
    <button @click="loadData">加载数据</button>
    <div v-loading="isLoading">数据内容</div>
  </div>
</template>

<script setup>
  import { ref } from "vue";

  const isLoading = ref(false);

  function loadData() {
    isLoading.value = true;
    fetch("/api/data")
      .then((response) => response.json())
      .then((data) => {
        // 处理数据
      })
      .catch((error) => {
        // 处理错误
      })
      .finally(() => {
        isLoading.value = false;
      });
  }
</script>
```

#### 3.2.3 Vue 中的并发控制与错误处理

在 Vue 中，可以使用 Promise.all、Promise.race 等方法处理多个异步操作。

并行加载多个资源：

```vue
<template>
  <div>
    <h1>用户信息</h1>
    <div v-if="loading">加载中...</div>
    <div v-if="error">{{ error }}</div>
    <div v-else>
      <h2>{{ user.name }}</h2>
      <p>帖子数量: {{ posts.length }}</p>
      <p>评论数量: {{ comments.length }}</p>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";

  const user = ref(null);
  const posts = ref([]);
  const comments = ref([]);
  const loading = ref(true);
  const error = ref(null);

  onMounted(async () => {
    try {
      const [userRes, postsRes, commentsRes] = await Promise.all([
        fetch("/api/user"),
        fetch("/api/posts"),
        fetch("/api/comments"),
      ]);

      const [userData, postsData, commentsData] = await Promise.all([
        userRes.json(),
        postsRes.json(),
        commentsRes.json(),
      ]);

      user.value = userData;
      posts.value = postsData;
      comments.value = commentsData;
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  });
</script>
```

使用 Promise.allSettled 处理部分失败的情况：

```vue
<template>
  <div>
    <h1>资源加载结果</h1>
    <div v-for="(result, index) in results" :key="index">
      <div v-if="result.status === 'fulfilled'">
        资源{{ index + 1 }}加载成功: {{ result.value }}
      </div>
      <div v-else>资源{{ index + 1 }}加载失败: {{ result.reason }}</div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";

  const results = ref([]);

  onMounted(async () => {
    const promises = [
      fetch("/api/resource1"),
      fetch("/api/resource2"),
      fetch("/api/resource3"),
    ];

    results.value = await Promise.allSettled(promises);
  });
</script>
```

### 3.3 Angular 中的 Promise 应用

#### 3.3.1 使用 HttpClient 进行异步请求

在 Angular 中，HttpClient 返回的是 Observable，但可以通过 toPromise()方法将其转换为 Promise。

基本数据获取示例：

```typescript
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-user-profile",
  template: `
    <div *ngIf="user">
      <h1>{{ user.name }}</h1>
      <p>Email: {{ user.email }}</p>
    </div>
    <div *ngIf="loading">加载中...</div>
    <div *ngIf="error">{{ error }}</div>
  `,
})
export class UserProfileComponent implements OnInit {
  user: any;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    this.http
      .get("/api/user")
      .toPromise()
      .then((data: any) => {
        this.user = data;
      })
      .catch((error: any) => {
        this.error = error.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
```

处理多个并行请求：

```typescript
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-dashboard",
  template: `
    <div *ngIf="data">
      <h1>{{ data.user.name }}</h1>
      <p>帖子数量: {{ data.posts.length }}</p>
      <p>评论数量: {{ data.comments.length }}</p>
    </div>
    <div *ngIf="loading">加载中...</div>
    <div *ngIf="error">{{ error }}</div>
  `,
})
export class DashboardComponent implements OnInit {
  data: any;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    Promise.all([
      this.http.get("/api/user").toPromise(),
      this.http.get("/api/posts").toPromise(),
      this.http.get("/api/comments").toPromise(),
    ])
      .then(([user, posts, comments]) => {
        this.data = { user, posts, comments };
      })
      .catch((error: any) => {
        this.error = error.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
```

#### 3.3.2 使用 async/await 与 Angular 服务

在 Angular 中，可以在服务中使用 async/await 来封装异步操作。

创建数据服务：

```typescript
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class DataService {
  constructor(private http: HttpClient) {}

  async getUser() {
    return this.http.get("/api/user").toPromise();
  }

  async getPosts() {
    return this.http.get("/api/posts").toPromise();
  }

  async getComments() {
    return this.http.get("/api/comments").toPromise();
  }
}
```

在组件中使用服务：

```typescript
import { Component, OnInit } from "@angular/core";
import { DataService } from "./data.service";

@Component({
  selector: "app-dashboard",
  template: `
    <div *ngIf="data">
      <h1>{{ data.user.name }}</h1>
      <p>帖子数量: {{ data.posts.length }}</p>
      <p>评论数量: {{ data.comments.length }}</p>
    </div>
    <div *ngIf="loading">加载中...</div>
    <div *ngIf="error">{{ error }}</div>
  `,
})
export class DashboardComponent implements OnInit {
  data: any;
  loading = false;
  error: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loading = true;
    this.fetchData();
  }

  async fetchData() {
    try {
      const [user, posts, comments] = await Promise.all([
        this.dataService.getUser(),
        this.dataService.getPosts(),
        this.dataService.getComments(),
      ]);
      this.data = { user, posts, comments };
    } catch (error) {
      this.error = error.message;
    } finally {
      this.loading = false;
    }
  }
}
```

#### 3.3.3 Angular 中的超时处理与取消机制

在 Angular 中，可以使用 AbortController 或 timeout 操作符来处理超时和取消请求。

使用 AbortController 取消请求：

```typescript
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-user-profile",
  template: `
    <button (click)="fetchUser()">加载用户</button>
    <button (click)="abortRequest()">取消请求</button>
    <div *ngIf="user">用户信息: {{ user.name }}</div>
    <div *ngIf="loading">加载中...</div>
    <div *ngIf="error">{{ error }}</div>
  `,
})
export class UserProfileComponent implements OnInit {
  user: any;
  loading = false;
  error: string | null = null;
  private controller: AbortController | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  fetchUser() {
    if (this.controller) {
      this.controller.abort();
    }
    this.controller = new AbortController();
    const signal = this.controller.signal;

    this.loading = true;
    this.http
      .get("/api/user", { signal })
      .toPromise()
      .then((data: any) => {
        this.user = data;
      })
      .catch((error: any) => {
        if (error.name === "AbortError") {
          this.error = "请求已取消";
        } else {
          this.error = error.message;
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  abortRequest() {
    if (this.controller) {
      this.controller.abort();
    }
  }
}
```

使用 RxJS 的 timeout 操作符：

```typescript
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { timeout } from "rxjs/operators";

@Component({
  selector: "app-user-profile",
  template: `
    <div *ngIf="user">用户信息: {{ user.name }}</div>
    <div *ngIf="loading">加载中...</div>
    <div *ngIf="error">{{ error }}</div>
  `,
})
export class UserProfileComponent implements OnInit {
  user: any;
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loading = true;
    this.http
      .get("/api/user")
      .pipe(timeout(5000)) // 设置5秒超时
      .toPromise()
      .then((data: any) => {
        this.user = data;
      })
      .catch((error: any) => {
        this.error = error.message;
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
```

## 四、Promise 最佳实践与性能优化

### 4.1 Promise 错误处理最佳实践

#### 4.1.1 全局错误处理策略

在 JavaScript 中，可以设置全局的 Promise 拒绝处理函数，捕获所有未被处理的 Promise 错误。

Node.js 环境：

```javascript
process.on("unhandledRejection", (reason, promise) => {
  console.error("未捕获的Promise拒绝:", reason);
  // 可以选择在此处处理错误或记录日志
});
```

浏览器环境：

```javascript
window.addEventListener("unhandledrejection", (event) => {
  console.error("未捕获的Promise拒绝:", event.reason);
  event.preventDefault(); // 防止默认的控制台输出
});
```

使用 try...catch 包装 async 函数：

```javascript
async function main() {
  try {
    await someAsyncFunction();
  } catch (error) {
    console.error("全局错误处理:", error);
  }
}

main();
```

#### 4.1.2 局部错误处理策略

在 Promise 链中，错误处理应遵循以下原则：

原则一：在合适的层级捕获错误

```javascript
promise
  .then((result) => {
    // 处理result
  })
  .catch((error) => {
    // 处理错误，应尽可能接近错误发生的位置
  });
```

原则二：避免遗漏错误处理

```javascript
// 错误：没有错误处理，可能导致应用崩溃
fetchData().then((data) => processData(data));

// 正确：添加catch方法
fetchData()
  .then((data) => processData(data))
  .catch((error) => handleError(error));
```

原则三：在 finally 中执行清理操作

```javascript
function fetchData() {
  let isLoading = true;
  return fetch("/api/data")
    .then((response) => response.json())
    .finally(() => {
      isLoading = false;
    });
}
```

原则四：使用 Promise.allSettled 而不是 Promise.all 处理可能失败的并行任务

```javascript
// 当其中一个Promise失败时，Promise.all会立即失败
Promise.all([promise1, promise2, promise3])
  .then((results) => {
    /* 处理结果 */
  })
  .catch((error) => {
    /* 处理错误 */
  });

// 使用Promise.allSettled可以获取所有任务的结果，无论成功与否
Promise.allSettled([promise1, promise2, promise3]).then((results) => {
  results.forEach((result) => {
    if (result.status === "fulfilled") {
      // 处理成功结果
    } else {
      // 处理失败结果
    }
  });
});
```

### 4.2 Promise 性能优化策略

#### 4.2.1 避免 Promise 构造函数反模式

Promise 构造函数反模式是指在不需要使用 Promise 的地方滥用 Promise 构造函数，导致性能下降和代码可读性降低。

反模式示例：

```javascript
// 反模式：将同步操作包装在Promise中
function add(a, b) {
  return new Promise((resolve) => {
    resolve(a + b);
  });
}

// 正确做法：直接返回结果
function add(a, b) {
  return a + b;
}

// 当确实需要异步操作时才使用Promise
function asyncAdd(a, b) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(a + b);
    }, 1000);
  });
}
```

避免不必要的 Promise 创建：

```javascript
// 反模式：在then中创建新的Promise
promise.then((result) => {
  return new Promise((resolve) => {
    resolve(result * 2);
  });
});

// 正确做法：直接返回值
promise.then((result) => result * 2);
```

#### 4.2.2 合理使用微任务与宏任务

由于 Promise 回调属于微任务，会在当前宏任务执行完毕后立即执行，因此过度使用可能会阻塞事件循环。

避免在微任务中执行大量计算：

```javascript
// 反模式：在微任务中执行大量计算
Promise.resolve().then(() => {
  for (let i = 0; i < 1000000000; i++) {
    // 大量计算，阻塞事件循环
  }
});

// 正确做法：使用宏任务或Web Worker
setTimeout(() => {
  for (let i = 0; i < 1000000000; i++) {
    // 计算在宏任务中执行，不会阻塞UI
  }
}, 0);
```

分批处理大量任务：
当需要处理大量异步任务时，应分批处理，避免一次性启动所有任务。

```javascript
function processItems(items) {
  return new Promise((resolve) => {
    let index = 0;
    const processNext = () => {
      if (index >= items.length) {
        resolve();
        return;
      }
      const item = items[index++];
      // 处理item
      // 处理完成后调用processNext，但使用setTimeout确保分批处理
      setTimeout(processNext, 0);
    };
    processNext();
  });
}

// 使用示例
processItems(largeArray).then(() => console.log("所有项目处理完成"));
```

#### 4.2.3 优化 Promise 链

过长的 Promise 链可能会影响性能，应尽量优化。

合并连续的 then 调用：

```javascript
// 反模式：多个then调用
promise
  .then((result) => result * 2)
  .then((result) => result + 1)
  .then((result) => result / 3);

// 正确做法：合并为一个then调用
promise.then((result) => {
  result = result * 2;
  result = result + 1;
  result = result / 3;
  return result;
});
```

避免不必要的链式调用：

```javascript
// 反模式：不必要的链式调用
const p1 = Promise.resolve(1);
const p2 = p1.then((result) => result * 2);
const p3 = p2.then((result) => result + 1);
const p4 = p3.then((result) => result / 3);

// 正确做法：直接在一个链中处理
const p = Promise.resolve(1)
  .then((result) => result * 2)
  .then((result) => result + 1)
  .then((result) => result / 3);
```

使用 async/await 优化代码结构：

```javascript
// 使用Promise链
fetchData()
  .then((data) => processData(data))
  .then((result) => saveResult(result))
  .catch((error) => handleError(error));

// 使用async/await
async function processData() {
  try {
    const data = await fetchData();
    const result = await processData(data);
    await saveResult(result);
  } catch (error) {
    handleError(error);
  }
}
```

### 4.3 与 async/await 结合的最佳实践

#### 4.3.1 async/await 基础与优势

async/await 是 ES2017 引入的异步编程语法糖，基于 Promise 实现，提供了更简洁、直观的异步代码编写方式。

基本语法：

```javascript
async function asyncFunction() {
  try {
    const result = await promise;
    // 处理结果
  } catch (error) {
    // 处理错误
  }
}
```

async/await 的优势：

- 代码结构更接近同步代码，可读性更高
- 错误处理更简单，使用传统的 try...catch
- 避免了 Promise 链的嵌套
- 更容易实现复杂的异步流程控制

#### 4.3.2 错误处理与资源清理

在使用 async/await 时，错误处理和资源清理是关键点。

错误处理最佳实践：

```javascript
// 使用try...catch捕获错误
async function fetchData() {
  try {
    const response = await fetch("/api/data");
    if (!response.ok) throw new Error("请求失败");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("错误:", error);
    throw error; // 可以选择重新抛出错误
  }
}

// 使用try...catch处理多个await
async function processData() {
  try {
    const data1 = await fetchData1();
    const data2 = await fetchData2();
    // 处理数据
  } catch (error) {
    // 处理错误
  }
}
```

资源清理：

```javascript
async function fetchDataWithAbort() {
  const controller = new AbortController();
  const signal = controller.signal;

  try {
    const response = await fetch("/api/data", { signal });
    const data = await response.json();
    return data;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log("请求已取消");
    } else {
      console.error("错误:", error);
    }
  } finally {
    // 无论成功与否，都可以在这里执行清理操作
    // 例如关闭文件、取消订阅等
  }
}
```

#### 4.3.3 处理多个异步操作

async/await 与 Promise.all 结合可以更方便地处理多个异步操作。

并行执行多个异步操作：

```javascript
async function loadData() {
  const [user, posts, comments] = await Promise.all([
    fetch("/api/user"),
    fetch("/api/posts"),
    fetch("/api/comments"),
  ]);

  const [userData, postsData, commentsData] = await Promise.all([
    user.json(),
    posts.json(),
    comments.json(),
  ]);

  return { user: userData, posts: postsData, comments: commentsData };
}
```

顺序执行多个异步操作：

```javascript
async function sequentialLoad() {
  const user = await fetch("/api/user").then((res) => res.json());
  const posts = await fetch(`/api/posts?userId=${user.id}`).then((res) =>
    res.json()
  );
  const comments = await fetch(`/api/comments?postId=${posts[0].id}`).then(
    (res) => res.json()
  );
  return { user, posts, comments };
}
```

条件执行异步操作：

```javascript
async function conditionalLoad() {
  const user = await fetch("/api/user").then((res) => res.json());
  let posts;
  if (user.isAdmin) {
    posts = await fetch("/api/admin/posts").then((res) => res.json());
  } else {
    posts = await fetch("/api/public/posts").then((res) => res.json());
  }
  return { user, posts };
}
```

## 五、高级主题与未来趋势

### 5.1 自定义 Promise 实现

#### 5.1.1 Promise/A + 规范与实现原理

Promise/A + 是一个社区规范，定义了 Promise 的行为和接口。理解其规范有助于更好地掌握 Promise 的工作原理。

Promise/A + 规范关键点：

- Promise 有三种状态：pending、fulfilled、rejected
- 状态只能由 pending 转换为 fulfilled 或 rejected，且只能转换一次
- then 方法接受两个回调函数，分别处理成功和失败情况
- then 方法返回一个新的 Promise，可以实现链式调用

简单的 Promise 实现：

```javascript
class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach((fn) => fn());
      }
    };

    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((fn) => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.state === "fulfilled") {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.state === "rejected") {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (error) {
            reject(error);
          }
        });
      }

      if (this.state === "pending") {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason);
              resolvePromise(promise2, x, resolve, reject);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });

    return promise2;
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  static resolve(value) {
    return new MyPromise((resolve) => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }

  static all(promises) {
    return new MyPromise((resolve, reject) => {
      const result = [];
      let count = 0;

      const processData = (index, data) => {
        result[index] = data;
        if (++count === promises.length) {
          resolve(result);
        }
      };

      for (let i = 0; i < promises.length; i++) {
        promises[i].then((data) => processData(i, data), reject);
      }
    });
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        promises[i].then(resolve, reject);
      }
    });
  }
}

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError("Chaining cycle detected for promise"));
  }

  let called = false;

  if (x !== null && (typeof x === "object" || typeof x === "function")) {
    try {
      const then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (err) => {
            if (called) return;
            called = true;
            reject(err);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}
```

#### 5.1.2 扩展 Promise 功能

可以通过继承和原型扩展来增强 Promise 的功能。

添加超时功能：

```javascript
class TimeoutPromise extends MyPromise {
  constructor(executor, timeout) {
    super(executor);
    this.timeout = timeout;
    this.timer = null;

    this._initTimeout();
  }

  _initTimeout() {
    this.timer = setTimeout(() => {
      this.reject(new Error("操作超时"));
    }, this.timeout);
  }

  then(onFulfilled, onRejected) {
    const promise = super.then(onFulfilled, onRejected);
    promise.finally(() => {
      clearTimeout(this.timer);
    });
    return promise;
  }

  // 其他方法...
}

// 使用示例
const promise = new TimeoutPromise((resolve) => {
  setTimeout(resolve, 2000, "成功");
}, 3000);

promise
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

添加取消功能：

```javascript
class CancelablePromise extends MyPromise {
  constructor(executor) {
    super(executor);
    this.isCanceled = false;
  }

  cancel() {
    this.isCanceled = true;
    // 可以在这里执行取消操作
  }

  then(onFulfilled, onRejected) {
    const wrappedOnFulfilled = (value) => {
      return this.isCanceled
        ? Promise.reject(new Error("Promise已取消"))
        : onFulfilled(value);
    };

    const wrappedOnRejected = (reason) => {
      return this.isCanceled
        ? Promise.reject(new Error("Promise已取消"))
        : onRejected(reason);
    };

    return super.then(wrappedOnFulfilled, wrappedOnRejected);
  }

  // 其他方法...
}

// 使用示例
const promise = new CancelablePromise((resolve) => {
  setTimeout(() => {
    if (!promise.isCanceled) {
      resolve("成功");
    }
  }, 2000);
});

// 在需要取消时调用
// promise.cancel();

promise
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```

### 5.2 高级并发控制模式

#### 5.2.1 任务优先级管理

在实际应用中，不同的异步任务可能有不同的优先级，需要优先处理高优先级任务。

基于优先级的任务执行器：

```javascript
class PriorityTaskQueue {
  constructor(maxConcurrency) {
    this.maxConcurrency = maxConcurrency;
    this.tasks = [];
    this.running = [];
  }

  addTask(task, priority) {
    this.tasks.push({ task, priority });
    this.tasks.sort((a, b) => b.priority - a.priority); // 按优先级降序排序
    this.processNext();
  }

  processNext() {
    while (this.running.length < this.maxConcurrency && this.tasks.length > 0) {
      const { task } = this.tasks.shift();
      const promise = task();
      this.running.push(promise);
      promise.finally(() => {
        this.running.splice(this.running.indexOf(promise), 1);
        this.processNext();
      });
    }
  }
}

// 使用示例
const queue = new PriorityTaskQueue(2);

queue.addTask(
  () =>
    new Promise((resolve) =>
      setTimeout(() => {
        console.log("任务1完成");
        resolve(1);
      }, 2000)
    ),
  2
);
queue.addTask(
  () =>
    new Promise((resolve) =>
      setTimeout(() => {
        console.log("任务2完成");
        resolve(2);
      }, 1000)
    ),
  3
);
queue.addTask(
  () =>
    new Promise((resolve) =>
      setTimeout(() => {
        console.log("任务3完成");
        resolve(3);
      }, 1500)
    ),
  1
);
```

#### 5.2.2 动态任务调度

动态任务调度允许在运行时动态添加任务，并根据当前状态调整执行策略。

动态任务调度器：

```javascript
class DynamicTaskScheduler {
  constructor(maxConcurrency) {
    this.maxConcurrency = maxConcurrency;
    this.queue = [];
    this.running = [];
  }

  addTask(task) {
    this.queue.push(task);
    this.processNext();
  }

  processNext() {
    while (this.running.length < this.maxConcurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      const promise = task();
      this.running.push(promise);
      promise.finally(() => {
        this.running.splice(this.running.indexOf(promise), 1);
        this.processNext();
      });
    }
  }

  // 可以添加暂停、恢复、取消等方法
}

// 使用示例
const scheduler = new DynamicTaskScheduler(2);

// 动态添加任务
scheduler.addTask(
  () =>
    new Promise((resolve) =>
      setTimeout(() => {
        console.log("任务1完成");
        resolve(1);
      }, 2000)
    )
);
scheduler.addTask(
  () =>
    new Promise((resolve) =>
      setTimeout(() => {
        console.log("任务2完成");
        resolve(2);
      }, 1000)
    )
);
setTimeout(() => {
  scheduler.addTask(
    () =>
      new Promise((resolve) =>
        setTimeout(() => {
          console.log("任务3完成");
          resolve(3);
        }, 1500)
      )
  );
}, 1500);
```

#### 5.2.3 重试机制与指数退避

在处理可能失败的异步操作时，重试机制和指数退避可以提高系统的稳定性。

带重试和指数退避的 Promise 封装：

```javascript
function retryWithBackoff(fn, maxRetries, initialDelay) {
  return new Promise(async (resolve, reject) => {
    let retries = 0;
    let delay = initialDelay || 1000;

    const attempt = async () => {
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        retries++;
        if (retries > maxRetries) {
          reject(error);
          return;
        }
        console.log(`重试 ${retries} 次，等待 ${delay} 毫秒`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 2; // 指数退避
        await attempt();
      }
    };

    await attempt();
  });
}

// 使用示例
const fetchWithRetry = retryWithBackoff(
  () => fetch("/api/data").then((res) => res.json()),
  3,
  1000
);

fetchWithRetry
  .then((data) => console.log("数据:", data))
  .catch((error) => console.error("最终失败:", error));
```

### 5.3 ES2025 中的 Promise 新特性

#### 5.3.1 Promise.try 的引入与应用

ES2025 引入了 Promise.try 方法，它提供了一种更简洁的方式来处理可能失败的同步或异步操作。

Promise.try 的基本用法：

```javascript
Promise.try(() => {
  // 可能抛出错误的同步或异步操作
  return someFunction();
})
  .then((result) => {
    // 处理成功结果
  })
  .catch((error) => {
    // 处理错误
  });
```

与传统方法的对比：

```javascript
// 传统方法
try {
  const result = syncFunction();
  return Promise.resolve(result);
} catch (error) {
  return Promise.reject(error);
}

// 使用Promise.try
Promise.try(() => syncFunction());
```

优势：

- 简化了同步和异步操作的统一处理
- 减少了样板代码
- 更清晰地表达意图

#### 5.3.2 性能优化与自动取消机制

ES2025 中的 Promise 新特性还包括性能优化和自动取消机制。

性能提升：
Promise.try 对于同步操作不会推入微任务队列，直接执行，这使得同步操作的性能提升约 10 倍。

自动取消机制：
未来的 Promise 可能会提供更原生的取消机制，类似于 AbortController，但更集成到 Promise API 中。

```javascript
// 假设的未来API
const promise = new Promise((resolve, reject) => {
  // 异步操作
  const cancel = () => {
    // 取消操作
    reject(new Error("操作已取消"));
  };
  // 返回取消函数
  return cancel;
});

// 取消Promise
const cancel = promise.cancel();
cancel();
```

#### 5.3.3 与其他 ES 特性的结合

未来的 Promise 可能会与其他 ES 特性更紧密地结合，如 Top-level await、模块加载等。

Top-level await：
允许在模块顶层使用 await，这使得模块可以异步加载。

```javascript
// 模块A
export const data = await fetch("/api/data").then((res) => res.json());

// 模块B
import { data } from "./moduleA.js";
console.log(data);
```

与信号（Signals）的结合：
信号（Signals）是一种新的响应式编程模型，可能与 Promise 结合，提供更强大的异步状态管理。

```javascript
import { signal } from "signals";

const data = signal(null);
const error = signal(null);
const loading = signal(true);

Promise.try(() => fetch("/api/data"))
  .then((response) => response.json())
  .then((result) => (data.value = result))
  .catch((err) => (error.value = err))
  .finally(() => (loading.value = false));
```

## 六、总结与实践建议

### 6.1 Promise 核心知识点回顾

在本文中，我们全面探讨了 JavaScript Promise 的核心概念、高级应用以及在主流框架中的使用。以下是关键知识点回顾：

基础概念：

- Promise 是 ES6 引入的异步编程解决方案，用于替代回调函数，解决回调地狱问题。
- Promise 有三种状态：pending、fulfilled、rejected，状态一旦改变就不会再变。
- Promise 构造函数接收一个执行器函数，包含 resolve 和 reject 两个参数。
- Promise 通过 then、catch、finally 方法处理结果和错误。

核心机制：

- Promise 的回调函数属于微任务，会在当前宏任务执行完毕后立即执行。
- 链式调用是 Promise 的核心特性，每个 then 方法返回一个新的 Promise。
- 错误会在 Promise 链中自动冒泡，直到被 catch 方法捕获。

高级应用：

- Promise.all 用于并行执行多个 Promise，所有都成功才成功。
- Promise.race 用于并行执行多个 Promise，哪个先完成就返回哪个结果。
- 并发控制可以通过自定义函数或第三方库（如 p-limit）实现。
- 超时处理可以使用 Promise.race 结合 setTimeout 或 AbortController。

框架集成：

- 在 React 中，Promise 用于数据获取、状态管理和组件卸载时的竞态条件处理。
- 在 Vue 中，Promise 与生命周期钩子和自定义指令结合，实现异步数据加载。
- 在 Angular 中，HttpClient 返回的 Observable 可以通过 toPromise()转换为 Promise。

最佳实践：

- 使用 try...catch 结合 async/await 处理错误。
- 在 finally 中执行清理操作，确保资源正确释放。
- 避免 Promise 构造函数反模式，不必要地包装同步操作。
- 合理使用微任务和宏任务，避免阻塞事件循环。

### 6.2 不同场景下的选择策略

根据不同的应用场景，应选择合适的异步编程方法：

简单异步操作：

- 当只需要处理一个简单的异步操作时，直接使用 Promise 即可。
- 推荐使用 async/await 语法，提高代码可读性。

复杂异步流程：

- 当需要处理多个异步操作，且存在依赖关系时，使用 Promise 链或 async/await。
- 对于并行操作，使用 Promise.all 或 Promise.allSettled。
- 对于需要优先级管理或动态调度的任务，考虑自定义并发控制机制。

框架特定场景：

- React：使用 useEffect 和 async/await 处理数据获取，使用 AbortController 取消请求。
- Vue：在 onMounted 钩子中使用 async/await，结合 watch 处理依赖变化。
- Angular：在服务中封装异步操作，使用 HttpClient 和 toPromise()方法。

性能敏感场景：

- 避免在微任务中执行大量计算，使用宏任务或 Web Worker。
- 限制最大并发数，避免同时发起过多请求。
- 使用 Promise.try 优化同步操作的性能。

### 6.3 未来学习路径与资源推荐

要进一步深入掌握 Promise 和异步编程，可以从以下几个方向继续学习：

深入学习路径：

- Promise/A + 规范：阅读官方规范，理解 Promise 的底层实现原理。
- 自定义 Promise 实现：尝试实现一个符合 Promise/A + 规范的 Promise，加深理解。
- 异步框架源码分析：学习 React、Vue 等框架的异步机制实现。
- 并发控制算法：研究更复杂的并发控制算法和策略。
- ES 新特性追踪：关注 ES2025 及后续版本中与异步编程相关的新特性。

推荐资源：

- MDN 文档：Promise
- Promise/A + 规范：Promises/A+
- 书籍：《JavaScript 高级程序设计》（第 4 版）中的异步编程章节

优秀文章：

- JavaScript Promise 迷你书
- 深入理解 JavaScript Promise

框架文档：

- React 中的异步操作
- Vue 中的异步操作
- Angular 中的 HTTP 请求

实践建议：

- 小型项目实践：创建一个简单的应用，使用 Promise 处理所有异步操作。
- 错误处理练习：编写代码模拟各种错误情况，练习全面的错误处理。
- 并发控制实现：尝试实现一个自定义的并发控制函数，支持最大并发数限制。
- 框架集成实践：在 React、Vue 或 Angular 项目中使用 Promise 完成复杂的数据加载流程。
- 性能优化挑战：寻找现有代码中的 Promise 性能瓶颈，尝试优化。

通过系统学习和实践，你将能够全面掌握 JavaScript Promise 的核心概念和高级应用，为成为前端架构师奠定坚实的基础。Promise 作为现代异步编程的核心工具，不仅在日常开发中广泛应用，也是理解和使用各种前端框架的关键。
