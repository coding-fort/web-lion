# Vue 数据劫持

### Vue2 数据劫持

Options API 中的 data 中的数据，在 Vue 实例创建时，会进行数据劫持，在数据发生变化时，会触发相应的监听函数。

Vue2 数据劫持是通过 Object.defineProperty() 来实现数据劫持的。

```js
function defineReactive(data, key, val) {
  Object.defineProperty(data, key, {
    enumerable: true, // 可枚举
    configurable: false, // 不能再define
    get() {
      console.log("get", val);
      return val;
    },
    set(newVal) {
      console.log("set", newVal);
      if (newVal === val) return;
      val = newVal;
    },
  });
}

const data = {
  name: "张三",
  age: 20,
};

defineReactive(data, "name", data.name);
defineReactive(data, "age", data.age);

console.log(data.name); // get 张三
data.name = "李四"; // set 李四
console.log(data.name); // get 李四
```
