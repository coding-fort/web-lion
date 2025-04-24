# JS 概述

## 1. 数据类型

- 原始数据类型：number、boolean、string、null、undefined、symbol、bigint
- 引用数据类型

## 2. 数据运算

- 算术运算：+、-、\*、/、%
- 比较运算：==、===、!=、!==、>、<、>=、<=
- 逻辑运算：|、||、&、&&、!，（`false`、`null`、`undefined`、`NaN`、`0`、`''`，隐式转换成 `false`）
  - ||、&&：短路判断，返回最后一次判断的数据；
- 三目运算：?

## [3. 隐式转换](./隐式转换.md)

## 4. 流程切割（函数）

- 如何理解函数的参数、返回值、函数体？
  - 参数：表示完成流程所需的必要信息
  - 返回值：表示完成流程后产生的结果
  - 函数体：表示具体的流程
  - 函数的参数、返回值只取决于函数的作用，与函数体无关；
- 为什么有了函数后，程序反而变得更复杂？
  - 函数的作用，是为了让某段复杂的流程变得简单；

## 5. 核心概念-数据的存储和传递

- 值和引用

## 6. 核心概念-作用域

- 全局作用域
- 函数作用域
- 块级作用域（let/const）
- 闭包（内部作用域访问外部变量）

## 7. 全局对象

- 浏览器环境：window
- node 环境：global

## 8. 构造函数

## 9. 原型

- 实例
- prototype：原型对象，
  构造函数的 prototype 指向原型
- **proto**：隐式原型
  实例的**proto**指向原型
  当访问实例成员时，当在自身找不到时，会从隐式原型中寻找，这样一来可以将公共属性放到原型中，所有实例都可以共用，节约内存空间。
- 遍历实例对象属性，不包含隐式原型属性
  boolean obj.hasOwnProperty(key)
  （boolean key in obj：包含原型属性）

## 10. this 关键字

- 在全局代码中，this 指全局对象
- 在函数中，this 指向完全取决于函数是如何被调用，函数中 this 在声明时，不能确定其具体指向。
  - new 创建（new User()），实例对象
  - 直接调用（User），全局对象
  - 对象调用（object.method()），前面的对象
  - call 第一个参数（obj.call(o,p1)）
  - apply 第一个参数（obj.apply(o,[p1]）

## 11. 原型链

当读取对象成员时，会先看对象自身是否有该成员，，如果没有，就依次在其原型链上查找。

![](/assets/images/js/原型链.png)

Object.prototype.**proto**=null
Object.**proto**=Function.prototype
Function.**proto**=Object.prototype
Function.prototype=Function.**proto**

- 利用原型链判断对象属性
  - A instanceof B：判断 A 的原型链中是否存在原型 B
  - Object.getProtertyOf（A)：获取 A 的隐式原型，不常用
- 创建空原型对象：节约内存空间

```js
  // 方式一，不推荐
  var obj={
  a:1,
  b:2
  }
  obj.**proto**=null

// 方式二，入参为隐式原型
var obj=Object.create(null)

// 方式三，第二个参数为隐式原型


var obj = {
  a: 1,
  b: 2,
};
Object.setPropertyOf(obj, null);
```

## 12. 继承

    子类自动拥有父类的所有成员。具有两个特性：单根性，传递性。

## 13. [面试题] e.target、e.currentTarget、e.relatedTarget 区别

- e.target，事件目标元素，实际触发元素
- e.currentTarget，事件监听器绑定元素
- e.relatedTarget，与当前事件相关的元素

## 14. [面试题] e.code 与 e.key 区别

- e.code，按键的物理位置，与键盘布局无关
- e.key，按键实际值，根据输入法和修饰键决定

## 15. [面试题] e.stopPropagation()，e.stopImmediatePropagation() 区别

- 事件传递过程：目标阶段（B）、捕获阶段（A->B）、冒泡阶段（B->A）
- e.stopPropagation()，阻止事件传播到其他节点（捕获阶段、冒泡阶段），不会阻止同目标同事件
- e.stopImmediatePropagation()，阻止事件传播并阻止当前节点其他监听器执行，阻止同目标同事件

## 16. [面试题] addEventListener() 方法的参数使用

- 第一个参数，事件类型，部份事件支持 on+事件写法，如 onclick；部份事件不支持 on 写法，如 DOMContentLoaded 事件；
- 第二个参数，回调函数/对象（需含 handleEvent 方法）；
- 第三个参数 - 布尔值，false，默认，冒泡阶段；true，捕获阶段，等价与{ capture: true } - 对象
  ■ capture: boolean，等价与布尔值方式
  ■ once: boolean，只触发一次
  ■ passive: boolean，处理程序将是否能调用 preventDefault() 方法，e.cancelable = !passive - 优化滚动性能
  ■ signal: 支持移除监听器
  ```js
  const obj = {
    handleEvent(e) {
      this[e.type] && this[e.type]();
    },
    mouseover() {
      console.log("mouseover");
    },
    click() {
      console.log("click");
    },
  };
  document.addEventListener("click", obj);
  document.addEventListener("mouseover", obj);
  const controller = new AbortController();
  // 添加事件
  div2.addEventListener(
    "click",
    () => {
      console.log("click");
    },
    {
      signal: controller.signal,
    }
  );
  //
  setTimeout(() => {
    // 移除事件监听
    controller.abort();
  }, 3000);
  ```
