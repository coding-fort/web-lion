# ES Module（ESM）

## 0.关键词

- 官方标准
- 使用新语法实现
- 所有环境均支持
- 同时支持静态依赖和动态依赖
  - 静态依赖：在编译时确定依赖关系
  - 动态依赖：在运行时确定依赖关系
- 动态依赖是异步的
- 符号绑定

<bwe>符号绑定</bwe>

```js
// a.js
export let count = 0;
export function increase() {
  count++;
}
// index.js
import { count as c, increase } from "./a.js";
console.log(c);
increase();
console.log(c);
// 最后输出结果？
```

**ES Modules (ESM)** 是 JavaScript 的官方模块系统，作为 ECMAScript 标准的一部分引入。它提供了一种标准化的方式来组织代码，使得开发者可以轻松地创建、导入和导出模块。与之前的 CommonJS 和 AMD 规范不同，ES Modules 旨在同时适用于浏览器端和服务器端环境，并且得到了所有主流 JavaScript 引擎的支持。

## 1.ES Modules 的核心特性

### 1.1.静态导入/导出语法

ES Modules 使用 `import` 和 `export` 关键字来进行模块的导入和导出操作。这种静态结构使得构建工具能够更好地优化代码（如 Tree Shaking），并且在编译时就能确定模块之间的依赖关系。

- **导出**：

  - **基本（命名）导出**：可以导出多个变量、函数或类。

  <bwp>类似 CommonJS 的`exports` 导出</bwp>

  ```javascript
  // 声明式
  export function add(a, b) {
    return a + b;
  }
  // 具名符号
  export {
    age: 18
  }
  ```

  - **默认导出**：每个模块只能有一个默认导出，默认导出可以是任何类型的值（函数、类、对象等）。

    <bwp>类似 CommonJS 的`module.exports` 导出</bwp>

    ```javascript
    // user.js
    export default class User {
      constructor(name) {
        this.name = name;
      }
    }
    ```

- **导入**：

  <bwe>
  <li>由于使用**依赖预加载**，因此，导入任何其他模块，导入代码必须放置到所有代码前面。</li>
  <li>导入绑定的变量为常量，不可修改。</li>
  <li>导入时，可以通过关键字 '<prib>as</prib>' 对导入的符号进行重命名。</li>
  <li>可以使用 '<prib>\*</prib>' 导入所有的基本导出，形成一个对象，但必须进行重命名才能使用。</li>
  </bwe>

  - **命名导入**：根据名称导入特定的导出项。
    ```javascript
    // main.js
    import { add, subtract as sub } from "./math";
    console.log(add(2, 3)); // 输出: 5
    console.log(sub(5, 2)); // 输出: 3
    ```
  - **默认导入**：导入默认导出的内容。
    ```javascript
    // main.js
    import User from "./user";
    // 同时存在具名导出，和默认导出
    import * as temp from "../index.js";
    // 或，tmp 为默认导出；a、b 为具名导出
    import tmp, { a, b } from "../index.js";
    ```

- <bqe>**细节**</bqe>
  - 尽量导出不可变值
  - 可以使用无绑定的导入用于执行一些初始化代码
    ```javascript
    import "./init.js";
    ```
  - 可以使用绑定再导出，来重新导出来自另一个模块的内容
    ```javascript
    import { a } from "./a.js";
    export { a as b };
    // 或
    export { a } from "./a.js";
    ```

### 1.2.异步加载和动态导入

ES Modules 支持使用 `import()` 函数进行动态导入，允许按需加载模块。这对于实现懒加载和代码分割非常有用，从而提高应用性能。

```javascript
// 动态导入模块
button.addEventListener("click", () => {
  import("./module").then((module) => {
    module.someFunction();
  });
});
```

### 1.3.顶层 `await`

从 ES2022 开始，ES Modules 支持顶层 `await`，这意味着你可以在模块的顶层代码中直接使用 `await`，而不需要将其包裹在一个异步函数内。这简化了异步代码的编写，尤其是在处理资源初始化或配置时。

```javascript
// module.mjs
const data = await fetchData();
console.log(data);
```

### 1.4.模块作用域

每个 ES Module 都有自己的私有作用域，这意味着模块内部声明的变量不会污染全局命名空间。这有助于减少命名冲突并增强代码的安全性。

### 1.5.原生支持

<bwe>该部份不属于模块化标准。</bwe>

现代浏览器（如 Chrome, Firefox, Safari, Edge 等）和 Node.js (版本 >= 12) 原生支持 ES Modules，无需额外的构建工具或转换步骤。然而，在使用 ESM 时需要注意一些细节：

- 在浏览器中，需要确保 `<script>` 标签包含 `type="module"` 属性。
  ```html
  <script type="module" src="./main.js"></script>
  ```
- 在 Node.js 中，可以通过设置 `package.json` 文件中的 `"type": "module"` 字段来启用 ESM 模式，或者为文件使用 `.mjs` 扩展名。

## 2.ES Modules vs CommonJS

| 特性         | ES Modules           | CommonJS                      |
| ------------ | -------------------- | ----------------------------- |
| **加载方式** | 异步加载             | 同步加载                      |
| **语法**     | `import` 和 `export` | `require` 和 `module.exports` |
| **作用域**   | 私有作用域           | 全局作用域                    |
| **支持环境** | 浏览器和 Node.js     | 主要用于 Node.js              |
| **动态导入** | 支持 `import()`      | 不支持                        |

## 3.实际应用

假设你正在开发一个 Web 应用程序，并希望利用 ES Modules 来组织代码。以下是一个简单的例子：

1. **创建模块文件**：

   - `math.js`:

     ```javascript
     export function add(a, b) {
       return a + b;
     }

     export function subtract(a, b) {
       return a - b;
     }
     ```

   - `user.js`:
     ```javascript
     export default class User {
       constructor(name) {
         this.name = name;
       }
     }
     ```

2. **在主文件中导入模块**：

   - `main.js`:

     ```javascript
     import { add, subtract } from "./math";
     import User from "./user";

     console.log(add(2, 3)); // 输出: 5
     console.log(subtract(5, 2)); // 输出: 3

     const user = new User("Alice");
     console.log(user.name); // 输出: Alice
     ```

3. **HTML 文件中引用模块**：

   - `index.html`:
     ```html
     <!DOCTYPE html>
     <html>
       <head>
         <title>ES Modules Example</title>
       </head>
       <body>
         <script type="module" src="./main.js"></script>
       </body>
     </html>
     ```

通过这种方式，你可以充分利用 ES Modules 提供的各种特性和优势，创建结构清晰、易于维护的前端应用程序。随着 Web 技术的发展，ES Modules 已经成为现代 JavaScript 开发不可或缺的一部分。

## 4.备注

ESM 的主要优点包括：

1. 更好的模块化：ESM 支持模块化，使得代码更加 modular，更易于维护和重用。
2. 更好的性能：ESM 使用静态分析，可以更快地加载和执行模块，从而提高性能。
3. 更好的兼容性：ESM 在 Node.js、浏览器和许多其他环境都被支持，因此可以确保代码在多种环境中运行。

### 如何导出

```js
// 常用，具名
export const a = 1;
// 常用，具名
export function foo() {}
// 常用，具名
export const c = () => {};
// 具名
const d = 2;
export { d };
const k = 10;
export { k as kk };
// 常用，默认
export default 3;
export default function(){};
const e = 4;
export { e as default };
```

<bqe>
注意：导出代码必须为顶级代码，即不可放到代码块中。
</bqe>

### 如何导入

```js
/**
 * 静态导入
 */
// 仅运行一次该模块，不导入任何内容
import "模块路径";
// 常用，导入属性a、b 赋值到变量a、b 中
import { a, b } from "模块路径";
// 常用，导入属性default 赋值到变量c
import c from "模块路径";
// 常用，default->c，a->a，b->b
import c, { a, b } from "模块路径";
// 常用，将模块对象赋值到变量m中
import * as m from "模块路径";
//
// 导入属性a、b，赋值到变量tmp1、tmp2 中
import { a as tmp1, b as tmp2 } from "模块路径";
// 导入default，赋值到变量tmp 中，default 为关键字，不可作为变量名
import { default as tmp } from "模块路径";
// 导入属性default、b，赋值到a、b 中
import { default as a, b } from "模块路径";
/**
 * 动态导入
 */
// 动态导入，返回一个Promise，完成时的数据为模块对象
import("模块路径");
```

<bqe>
注意：静态导入代码必须为顶级代码，即不可放到代码块中。<br/>
<li>静态导入绑定的变量为常量，不可修改。</li>
<li>导入时，可以通过关键字 '<prib>as</prib>' 对导入的符号进行重命名。</li>
<li>可以使用 '<prib>*</prib>' 导入所有的基本导出，形成一个对象，但必须进行重命名才能使用。</li>
</bqe>
