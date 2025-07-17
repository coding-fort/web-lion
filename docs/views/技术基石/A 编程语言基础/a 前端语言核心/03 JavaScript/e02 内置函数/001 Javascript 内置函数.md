# 001 Javascript 内置函数

JavaScript 拥有众多内置函数，这些函数在不同场景下发挥着关键作用，大致可分为以下几类：

## 1. 全局数据转换函数

- **parseInt()**：将字符串转换为整数。它会从字符串的开头开始解析，直到遇到非数字字符为止。

```javascript
let num1 = parseInt("123"); // 123
let num2 = parseInt("123abc"); // 123
let num3 = parseInt("abc123"); // NaN
```

- **parseFloat()**：把字符串转换为浮点数。与`parseInt()`类似，从字符串开头解析，遇到无效字符则停止。

```javascript
let float1 = parseFloat("3.14"); // 3.14
let float2 = parseFloat("3.14abc"); // 3.14
```

- **Number()**：用于将各种类型的值转换为数字。如果转换失败，返回`NaN`。

```javascript
let numFromStr = Number("123"); // 123
let numFromBool = Number(true); // 1
let numFromNull = Number(null); // 0
```

- **String()**：将其他类型的值转换为字符串。

```javascript
let strFromNum = String(123); // '123'
let strFromBool = String(false); // 'false'
```

- **Boolean()**：将给定的值转换为布尔值。在 JavaScript 中，`false`、`0`、`null`、`undefined`、`NaN` 和空字符串 `''` 会被转换为 `false`，其他值通常转换为 `true`。

```javascript
let boolFromNum = Boolean(0); // false
let boolFromStr = Boolean("abc"); // true
```

## 2. 数学相关函数

- **Math.abs()**：返回一个数的绝对值。

```javascript
let absValue = Math.abs(-5); // 5
```

- **Math.ceil()**：向上取整，返回大于或等于给定数字的最小整数。

```javascript
let ceiling = Math.ceil(4.1); // 5
```

- **Math.floor()**：向下取整，返回小于或等于给定数字的最大整数。

```javascript
let floorValue = Math.floor(4.9); // 4
```

- **Math.round()**：四舍五入到最接近的整数。

```javascript
let rounded = Math.round(4.5); // 5
```

- **Math.random()**：返回一个介于 `0`（包括）和 `1`（不包括）之间的随机小数。若要生成指定范围内的随机整数，可以结合其他函数实现。

```javascript
// 生成0（包括）到10（不包括）之间的随机整数
let randomInt = Math.floor(Math.random() * 10);
```

- **Math.max()** 和 **Math.min()**：`Math.max()`返回一组数中的最大值，`Math.min()`返回一组数中的最小值。

```javascript
let maxValue = Math.max(1, 5, 3); // 5
let minValue = Math.min(1, 5, 3); // 1
```

## 3. 日期和时间函数（在`Date`对象中）

- **Date.now()**：返回自 1970 年 1 月 1 日 00:00:00 UTC 以来的毫秒数。常用于计算代码执行时间等场景。

```javascript
let startTime = Date.now();
// 执行一些操作
let endTime = Date.now();
let executionTime = endTime - startTime;
```

- **new Date()**：创建一个`Date`对象实例。可以传入不同参数来表示特定日期和时间，若不传入参数，则表示当前日期和时间。

```javascript
let now = new Date();
let specificDate = new Date("2024-10-01");
```

## 4. 数组相关函数（数组的原型方法，可用于所有数组实例）

- **Array.isArray()**：判断一个值是否为数组。

```javascript
let arr = [1, 2, 3];
let notArr = "abc";
let isArr1 = Array.isArray(arr); // true
let isArr2 = Array.isArray(notArr); // false
```

- **Array.from()**：将类数组对象或可迭代对象转换为真正的数组。

```javascript
let str = "abc";
let arrFromStr = Array.from(str); // ['a', 'b', 'c']

let set = new Set([1, 2, 2]);
let arrFromSet = Array.from(set); // [1, 2]
```

- **Array.of()**：创建一个包含指定元素的新数组。与数组字面量不同的是，`Array.of()` 可以避免 `new Array()` 在特定参数下的歧义。

```javascript
let arr1 = Array.of(1, 2, 3); // [1, 2, 3]
let arr2 = new Array(3); // [undefined, undefined, undefined]
```

## 5. 字符串相关函数（字符串的原型方法，可用于所有字符串实例）

- **String.prototype.charAt()**：返回指定位置的字符。

```javascript
let str = "hello";
let char = str.charAt(1); // 'e'
```

- **String.prototype.slice()**：提取字符串的一部分，并返回一个新字符串，不会改变原字符串。

```javascript
let str = "javascript";
let sliced = str.slice(4, 8); // 'scri'
```

- **String.prototype.split()**：将字符串分割成子字符串数组。

```javascript
let str = "apple,banana,orange";
let arr = str.split(","); // ['apple', 'banana', 'orange']
```

- **String.prototype.indexOf()**：返回指定字符串在原字符串中第一次出现的位置，如果没有找到则返回 `-1`。

```javascript
let str = "javascript is fun";
let index = str.indexOf("is"); // 11
```

- **String.prototype.includes()**：判断一个字符串是否包含在另一个字符串中，返回布尔值。

```javascript
let str = "javascript";
let hasSubStr = str.includes("script"); // true
```
