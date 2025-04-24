# constructor、\_\_proto\_\_、prototype

在 JavaScript 中，`__proto__`、`prototype` 和 `constructor` 是与对象和构造函数相关的三个重要概念。理解它们之间的关系对于掌握 JavaScript 的原型链和继承机制至关重要。下面是对这三个概念的详细解释：

### 1. `__proto__`

- **定义**：`__proto__` 是一个非标准属性（虽然在现代浏览器中广泛支持），它指向一个对象的原型对象（即该对象的 `[[Prototype]]`）。
- **用途**：通过 `__proto__` 可以访问对象的原型，从而访问原型上的方法和属性。
- **示例**：

  ```javascript
  function Person(name) {
    this.name = name;
  }

  const alice = new Person("Alice");

  console.log(alice.__proto__); // 输出: Person { ... }
  console.log(alice.__proto__ === Person.prototype); // true
  ```

### 2. `prototype`

- **定义**：每个函数都有一个 `prototype` 属性，这是一个对象，包含可以被所有实例共享的方法和属性。
- **用途**：通过 `prototype` 可以在构造函数的原型上添加方法和属性，这些方法和属性会被所有实例共享。
- **示例**：

  ```javascript
  function Person(name) {
    this.name = name;
  }

  Person.prototype.greet = function () {
    console.log("Hello, I'm " + this.name);
  };

  const alice = new Person("Alice");
  alice.greet(); // 输出: Hello, I'm Alice
  ```

### 3. `constructor`

- **定义**：`constructor` 是 `prototype` 对象的一个属性，它指向创建该原型对象的构造函数。
- **用途**：通过 `constructor` 可以知道某个对象是由哪个构造函数创建的。
- **示例**：

  ```javascript
  function Person(name) {
    this.name = name;
  }

  const alice = new Person("Alice");

  console.log(alice.constructor); // 输出: [Function: Person]
  console.log(Person.prototype.constructor === Person); // true
  ```

### 它们之间的关系

1. **`__proto__` 与 `prototype`**：

   - 当你使用 `new` 关键字创建一个对象时，这个新对象的 `__proto__` 会指向构造函数的 `prototype`。
   - 例如：

     ```javascript
     function Person(name) {
       this.name = name;
     }

     const alice = new Person("Alice");

     console.log(alice.__proto__ === Person.prototype); // true
     ```

2. **`constructor` 与 `prototype`**：

   - 每个函数的 `prototype` 对象都有一个默认的 `constructor` 属性，指向该函数本身。
   - 例如：

     ```javascript
     function Person(name) {
       this.name = name;
     }

     console.log(Person.prototype.constructor === Person); // true
     ```

3. **`__proto__` 与 `constructor`**：

   - 通过 `__proto__` 可以间接访问到 `constructor`，因为 `__proto__` 指向的是构造函数的 `prototype`，而 `prototype` 上有 `constructor` 属性。
   - 例如：

     ```javascript
     function Person(name) {
       this.name = name;
     }

     const alice = new Person("Alice");

     console.log(alice.__proto__.constructor === Person); // true
     ```

### 原型链

JavaScript 通过原型链实现了继承。每个对象都有一个内部属性 `[[Prototype]]`（可以通过 `__proto__` 访问），指向其构造函数的 `prototype` 对象。当尝试访问对象的属性或方法时，如果对象自身没有该属性或方法，JavaScript 引擎会沿着原型链向上查找，直到找到该属性或方法，或者到达原型链的末端（即 `null`）。

### 示例

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function () {
  console.log("Hello, I'm " + this.name);
};

const alice = new Person("Alice");

// 查看原型链
console.log(alice.__proto__ === Person.prototype); // true
console.log(Person.prototype.constructor === Person); // true
console.log(alice.constructor === Person); // true

// 调用原型上的方法
alice.greet(); // 输出: Hello, I'm Alice
```

### 总结

- **`__proto__`**：指向对象的原型对象，用于访问原型上的方法和属性。
- **`prototype`**：是构造函数的一个属性，包含可以被所有实例共享的方法和属性。
- **`constructor`**：是 `prototype` 对象的一个属性，指向创建该原型对象的构造函数。

理解这三者之间的关系有助于更好地掌握 JavaScript 的原型链和继承机制。如果你有更多关于这些概念的具体问题或需要进一步的例子，请告诉我！
