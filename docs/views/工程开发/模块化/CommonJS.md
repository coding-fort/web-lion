# CommonJS（CJS）

## 0.关键词

- 社区标准
- 使用函数实现
- 仅 node 环境支持
- 动态依赖（需要代码运行后才能确定依赖）
- 动态依赖需要同步执行

**CommonJS** 是一种用于 JavaScript 的模块化规范，最初是为了在服务器端（如 Node.js 环境）实现模块化而设计的。它定义了一套标准来组织代码，使得开发者可以将代码分割成独立的模块，并通过 `require` 和 `module.exports` 来导入和导出这些模块。尽管 CommonJS 最初是为服务器端开发设计的，但它的一些概念也被应用到了前端开发中。

## 1.CommonJS 规范

CommonJS 使用 `exports` 导出模块，`require` 导入模块。

- 如果一个 JS 文件中存在`exports` 或 `require`，则该文件就是一个模块。
- 模块内的所有代码均为隐藏代码，包括全局变量、全局函数，这些全局的内容均不会对全局变量造成污染。
- 如果一个模块需要提供一些公共接口，可以通过 `module.exports` 对外提供接口，或者通过 `exports` 对外提供接口。
- 当一个模块需要用到其他模块时，可以通过 `require()` 来引入其他模块，返回被引入模块的 `module.exports` 对象。

## 2.CommonJS 模块化规范的核心特性

### 2.1.模块定义

每个文件被视为一个独立的模块。每个模块都有自己的作用域，不会污染全局命名空间。这意味着在一个模块中定义的变量、函数等默认情况下是私有的，除非明确导出。

### 2.2.导出模块

使用 `module.exports` 或者 `exports` 对象来暴露模块中的函数、对象或原始值。

- **`module.exports`**：这是最直接的方式，它可以完全替换当前模块的导出内容。

  ```javascript
  // math.js
  function add(a, b) {
    return a + b;
  }

  module.exports = {
    add,
  };
  ```

- **`exports`**：它是 `module.exports` 的引用，允许你向现有对象添加属性或方法。

  ```javascript
  // math.js
  exports.add = function (a, b) {
    return a + b;
  };

  exports.subtract = function (a, b) {
    return a - b;
  };
  ```

需要注意的是，如果直接给 `exports` 赋值，那么 `exports` 将不再指向 `module.exports`，因此在这种情况下应该只使用 `module.exports`。

### 2.3.导入模块

使用 `require()` 函数来加载其他模块。`require()` 返回的是被加载模块的 `module.exports`。

```javascript
// main.js
const math = require("./math");
console.log(math.add(2, 3)); // 输出: 5
```

### 2.4.私有作用域

每个模块都有自己的作用域，这意味着你在模块内部定义的所有变量和函数都不会自动成为全局变量，除非你显式地通过 `module.exports` 导出它们。这有助于避免命名冲突并提高代码的安全性。

### 2.5.同步加载

CommonJS 规范采用同步加载方式，这对于服务器端环境来说是非常合适的，因为文件系统访问通常是同步的。然而，在浏览器环境中，这种方式可能会导致阻塞问题，因此现代前端开发更倾向于使用异步加载方案，如 ES6 模块（ESM）或者 AMD（Asynchronous Module Definition）。

## 3.NodeJS 对 CommonJS 的支持

- 为了保证高效的执行，仅加载必要的模块。nodejs 只有执行到`require` 函数时才会加载并执行模块。
- 为了隐藏模块中的代码，nodejs 执行模块时，会将模块中的所有代码放到一个立即执行函数中运行，以保证不污染全局变量。
- 为了保证顺利的导出模块内容，nodejs 做了以下处理：

  - 在模块开始执行前，初始化一个值 `module.exports = {}`
  - `module.exports` 即模块的导出值
  - 为了方便开发者便捷的导出，nodejs 在初始化`module.exports` 后，又声明了一个变量`exports = module.exports`

```js
(function(module) => {
    module.export = {};
    var exports = module.exports;
    // 模块代码
    return module.exports;
})()
```

- 为了避免反复加载同一个模块，nodejs 默认开启了模块缓存，如果加载的模块已经被加载过了，则会自动使用之前的导出结果。

## 4.CommonJS 的优势

- **易于理解和使用**：CommonJS 提供了一个简单直观的方式来组织代码，适合中小型项目。
- **广泛支持**：Node.js 生态系统全面支持 CommonJS，有大量的库和工具可以直接使用。
- **私有作用域**：每个模块都有自己独立的作用域，有助于减少命名冲突和提升代码质量。

## 5.CommonJS 的局限性

- **不适合浏览器环境**：由于其同步加载特性，CommonJS 在浏览器中可能不是最优选择。不过，借助 Webpack 等构建工具，可以通过打包等方式间接支持浏览器环境。
- **缺乏标准化的异步模块加载**：虽然有一些变通方法，但 CommonJS 本身并不提供对异步加载的良好支持，这在某些场景下可能会成为一个限制。

## 6.原理

```js
// require 函数伪代码
function require(path) {
  // 该模块有缓存吗
  if (cache[path]) {
    return cache[path];
  }
  //
  function _run(exports, require, module, __filename, __dirname) {
    var exports = module.exports;
    // 模块代码会放在这里
    // 模块代码-开始
    // 模块导出会存放到 module.exports 中
    module.exports = { a: 1 };
    // 模块代码-结束
  }
  //
  var module = {
    exports: {},
  };
  //
  _run.call(
    module.exports, // this
    module.exports,
    require,
    module,
    __filename, // 模块路径
    __dirname // 模块目录
  );
  // 把module.exports 缓存起来
  cache[path] = module.exports;
  // 返回module.exports
  return module.exports;
}
```

<bwe>在模块中，<errb>this</errb> == <errb>exports</errb> == <errb>module.exports</errb></bwe>

<bwe>面试题</bwe>

```js
exports.a = "a";
module.exports = "b";
this.c = "c";
module.exports = {
  d: "d",
};
// 最后导出什么？
```

## 7.总结

CommonJS 是一个非常重要的模块化规范，特别是在服务器端 JavaScript 开发中。它帮助开发者更好地组织和管理代码，同时也促进了模块复用和代码维护。随着 JavaScript 生态系统的不断发展，尽管出现了新的模块化解决方案（如 ES6 模块），CommonJS 仍然在 Node.js 环境中占据着核心地位。

<itv>
    <itq>在 CommonJS 模块化规范中，<warnb>exports</warnb> 和 <warnb>module.exports</warnb> 区别</itq>
    <ita>
        <ol>
            <li>直接赋值的影响：
                <ul>
                    <li>如果你直接给 <warnb>module.exports</warnb> 赋值，它会完全替换默认的对象，并且所有通过 require() 导入这个模块的地方都会得到新的值。</li>
                    <li>在 <warnb>exports</warnb> 上添加属性或方法，这些都会反映到 <warnb>module.exports</warnb> 上</li>
                    <li>如果直接给 <warnb>exports</warnb> 赋值则不会改变 <warnb>module.exports</warnb>，因为此时 <warnb>exports</warnb> 已经变成了一个局部变量，与 <warnb>module.exports</warnb> 没有关系了。</li>
                </ul>
            </li>
            <li>链式调用：
                <ul>
                    <li>使用 <warnb>exports</warnb> 可以方便地进行链式调用来设置多个属性，而不需要重复写 <warnb>module.exports</warnb>。</li>
                    <li>如果你需要返回一个非对象类型的值（如函数、字符串、数字等），或者要替换整个模块的导出内容，那么必须使用 <warnb>module.exports</warnb>。</li>
                </ul>
            </li>
            <li>最佳实践：
                <ul>
                    <li>在大多数情况下，推荐始终使用 <warnb>module.exports</warnb> 来确保代码的行为符合预期。即使是在添加属性时，也建议明确地使用 <warnb>module.exports</warnb>，这样可以避免因意外覆盖 <warnb>exports</warnb> 引起的问题。</li>
                    <li>如果确实需要在一个已经存在的对象上添加多个属性，可以继续使用 <warnb>exports</warnb>，但要注意不要对其进行重新赋值。</li>
                </ul>
            </li>
        </ol>
    </ita>
</itv>
