# SeaJS（CMD）

**SeaJS** 是一个实现了 **CMD (Common Module Definition)** 规范的 JavaScript 模块加载器，主要用于浏览器端。它与 **RequireJS** 和 AMD 规范不同，采用了同步式的依赖定义方式，并且在模块定义和加载上有其独特的特性。SeaJS 的设计目标是提供更符合直觉的 API，简化模块化开发流程，并且更好地适应中国的网络环境。

### CMD (Common Module Definition)

CMD 是一种模块定义规范，由 SeaJS 提出并实现。它强调按需加载、惰性执行，即只在需要的时候才去加载和执行模块。这种模式有助于优化资源加载顺序，减少不必要的请求，从而提升页面性能。

#### 定义模块

在 CMD 中，模块通过 `define` 函数来定义。这个函数接收三个参数：

1. **模块标识（可选）**：通常是一个字符串，用来命名模块。如果省略，则根据文件路径自动生成唯一的 ID。
2. **依赖数组（可选）**：列出当前模块所依赖的其他模块或资源。
3. **工厂函数**：当所有依赖项都加载完成后调用此函数来初始化模块。该函数可以返回一个对象作为模块的导出内容。

```javascript
// 定义一个简单的模块
define(function (require, exports, module) {
  // 加载依赖
  var dep1 = require("./dependency1");
  var dep2 = require("./dependency2");

  // 模块逻辑
  function someMethod() {
    console.log("Module loaded with dependencies:", dep1, dep2);
  }

  // 导出接口
  exports.someMethod = someMethod;
});
```

#### 加载模块

使用 `seajs.use` 或者 `require` 来加载模块并在它们准备就绪后执行回调函数。`seajs.use` 用于加载主模块并启动应用，而 `require` 则用于在模块内部加载其他依赖。

```javascript
// 使用 seajs.use 加载主模块
seajs.use(["module1", "module2"], function (mod1, mod2) {
  // 在这里可以安全地使用 mod1 和 mod2
  mod1.someMethod();
  mod2.someMethod();
});

// 或者在一个模块内使用 require 加载依赖
define(function (require, exports, module) {
  var mod1 = require("module1");
  mod1.someMethod();
});
```

### SeaJS 特点

- **同步式依赖定义**：CMD 规范允许在模块内部按需加载依赖，而不是在模块定义时就声明所有的依赖。这种方式更符合直觉，也更容易理解和维护。
- **惰性执行**：只有当模块真正被使用时才会去加载和执行它，这有助于提高页面加载速度。
- **简单易用的 API**：SeaJS 提供了非常简洁的 API，如 `define`, `require`, 和 `seajs.use`，使得开发者可以快速上手。
- **良好的调试支持**：SeaJS 支持源映射(Source Map)，便于调试打包后的代码。
- **兼容 AMD**：虽然 SeaJS 主要遵循 CMD 规范，但它也能很好地兼容 AMD 模块，允许在同一项目中混合使用两种类型的模块。
- **丰富的插件生态**：SeaJS 拥有一个活跃的社区和丰富的插件库，可以帮助你解决各种开发中的问题。

### 使用 SeaJS

#### 安装 SeaJS

你可以通过 CDN 引入 SeaJS，或者下载到本地服务器：

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/seajs/3.0.0/sea.js"></script>
```

#### 配置 SeaJS

在项目的根目录下创建一个配置文件（例如 `config.js`），并在其中进行必要的设置：

```javascript
seajs.config({
  base: "./js/", // 设置基础路径
  alias: {
    jquery: "lib/jquery.min",
    underscore: "lib/underscore-min",
  },
  map: [
    ["^http:", "https:"], // 将 HTTP 请求映射为 HTTPS
  ],
});

// 使用 seajs.use 加载主模块
seajs.use("main");
```

#### 创建模块

接下来，在 `js` 文件夹内创建所需的模块文件。每个模块应该遵循 CMD 格式，使用 `define` 来声明自己的依赖和接口。

```javascript
// js/main.js
define(function (require, exports, module) {
  var $ = require("jquery");
  var _ = require("underscore");

  // 初始化应用
  $(function () {
    console.log("Application initialized.");
  });
});
```

### CMD vs AMD

- **加载方式**：CMD 更倾向于同步式依赖定义和惰性加载，而 AMD 强调异步加载和提前解析依赖关系。
- **语法差异**：CMD 的 `define` 函数参数包含 `require`, `exports`, 和 `module`，而 AMD 的 `define` 函数主要关注依赖数组和工厂函数。
- **适用场景**：CMD 更适合中国网络环境下的前端开发，因为它能更好地处理复杂的依赖关系并且优化资源加载；AMD 则广泛应用于需要高度灵活性和异步加载能力的场景中。

总之，SeaJS 和 CMD 提供了一种强大的机制来组织和管理前端 JavaScript 代码，特别是在大型项目中。尽管现代浏览器已经开始支持 ES Modules，但 SeaJS 和 CMD 仍然在很多遗留系统中扮演着重要角色。对于那些希望采用更加直观和高效的模块化开发方式的人来说，SeaJS 及其 CMD 规范仍然是一个不错的选择。
