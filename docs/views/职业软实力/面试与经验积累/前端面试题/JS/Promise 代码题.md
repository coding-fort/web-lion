# Promise 代码题

## 1. 下面代码的输出结果是什么

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  resolve();
  console.log(2);
});

promise.then(() => {
  console.log(3);
});

console.log(4);
```

<ans>1 2 4 3</ans>

## 2. 下面代码的输出结果是什么

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log(2);
    resolve();
    console.log(3);
  });
});

promise.then(() => {
  console.log(4);
});

console.log(5);
```

<ans>1 5 2 3 4</ans>

## 3. 下面代码的输出结果是什么

```js
const promise1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve();
  }, 1000);
});
const promise2 = promise1.catch(() => {
  return 2;
});

console.log("promise1", promise1);
console.log("promise2", promise2);

setTimeout(() => {
  console.log("promise1", promise1);
  console.log("promise2", promise2);
}, 2000);
```

<ans><br/>
promise1 Promise { &lt;pending> }<br/>
promise2 Promise { &lt;pending> }<br/>
2 秒后<br/>
promise1 Promise { &lt;fulfilled> undefined }<br/>
promise2 Promise { &lt;fulfilled> undefined }
</ans>

## 4. 下面代码的输出结果是什么

```js
async function m() {
  console.log(0);
  const n = await 1;
  console.log(n);
}

m();
console.log(2);
```

<ans>0 2 1</ans>
<ans>执行到“await 1”会进入微队列，函数执行结束</ans>

## 5. 下面代码的输出结果是什么

```js
async function m() {
  console.log(0);
  const n = await 1;
  console.log(n);
}

(async () => {
  await m();
  console.log(2);
})();

console.log(3);
```

<ans>0 3 1 2</ans>

## 6. 下面代码的输出结果是什么

```js
async function m1() {
  return 1;
}

async function m2() {
  const n = await m1();
  console.log(n);
  return 2;
}

async function m3() {
  const n = m2();
  console.log(n);
  return 3;
}

m3().then((n) => {
  console.log(n);
});

m3();

console.log(4);
```

<ans><br/>
Promise { &lt;pending> }<br/>
Promise { &lt;pending> }<br/>
4<br/>
1<br/>
3<br/>
1
</ans>

## 7. 下面代码的输出结果是什么

```js
Promise.resolve(1).then(2).then(Promise.resolve(3)).then(console.log);
```

<ans>1</ans>
<ans>then 中必须传入一个回调函数，否则可以忽略</ans>

## 8. 下面代码的输出结果是什么

```js
var a;
var b = new Promise((resolve, reject) => {
  console.log("promise1");
  setTimeout(() => {
    resolve();
  }, 1000);
})
  .then(() => {
    console.log("promise2");
  })
  .then(() => {
    console.log("promise3");
  })
  .then(() => {
    console.log("promise4");
  });

a = new Promise(async (resolve, reject) => {
  console.log(a);
  await b;
  console.log(a);
  console.log("after1");
  await a;
  resolve(true);
  console.log("after2");
});

console.log("end");
```

<ans><br/>
promise1 <br/>
undefined <br/>
end <br/>
promise2 <br/>
promise3 <br/>
promise4 <br/>
Promise{ &lt;pending> } <br/>
after1 <br/>
</ans>

## 9. 下面代码的输出结果是什么

```js
async function async1() {
  console.log("async1 start");
  await async2();
  console.log("async1 end");
}
async function async2() {
  console.log("async2");
}

console.log("script start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);

async1();

new Promise(function (resolve) {
  console.log("promise1");
  resolve();
}).then(function () {
  console.log("promise2");
});
console.log("script end");
```

<ans><br/>
script start <br/>
async1 start <br/>
async2 <br/>
promise1 <br/>
script end <br/>
async1 end <br/>
promise2 <br/>
setTimeout
</ans>
