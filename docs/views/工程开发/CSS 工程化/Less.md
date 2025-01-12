# Less

## 1.什么是 Less

Less [官网](https://lesscss.cn/#overview) 是 CSS 的预编译语言，可以简化 CSS 代码，提高代码的复用性。

Less 代码本身不可在浏览器中运行，需要编译后才能运行。因此需要借助工具将 Less 代码编译为 CSS 代码。

## 2.Less 的安装

`Less` 包提供了一个 `cli` 工具 <prib>lessc</prib> ，`lessc` 是一个命令行工具，可以将 Less 代码编译为 CSS 代码。

### 2.1.全局安装

这种方案可以在任何目录使用`lessc` 命令，但不利于版本控制，所以不推荐。

```bash
# 全局安装
npm install -g less
```

### 2.2.本地安装

这种方案只能在项目目录下使用`npx lessc` 命令，并且可以配合版本控制。

```bash
# 本地安装
npm install less -D
```

### 2.3 编译 Less 文件

```bash
# 编译less
lessc style.less style.css
```

<bww>[<prib>npx</prib>](../模块化/Npx.md) 是<prib>npm</prib> 提供的一个小工具，可以运行当前目录中安装到`node_modules` 目录的<sucb>cli</sucb> 命令。</bww>

## 3.Less 的语法

Less（Leaner Style Sheets）是一种 CSS 预处理器，它扩展了 CSS 语言，增加了变量、嵌套规则、混合（mixins）、函数等功能，使得样式表更加模块化和易于维护。Less 文件以`.less`为扩展名，需要编译成 CSS 文件才能被浏览器解析。

以下是 Less 的一些主要特性：

1.  [**变量**](https://lesscss.cn/#-variables)：可以定义颜色、字体等样式属性的值，方便统一修改。

    ```less
    @brand-color: #4d926f;

    #header {
      color: @brand-color;
    }
    ```

2.  [**混入**](https://lesscss.cn/#-mixins)：可以将一组 CSS 声明封装起来，在其他地方复用。

    ```less
    .rounded-corners(@radius: 5px) {
      border-radius: @radius;
      -webkit-border-radius: @radius;
      -moz-border-radius: @radius;
    }

    #header {
      .rounded-corners(10px);
    }
    ```

3.  [**嵌套**](https://lesscss.cn/#-nesting)：允许在父选择器中直接定义子元素的选择器，让代码结构更清晰。

    ```less
    #header {
      h1 {
        font-size: 26px;
        font-weight: bold;
      }
      p {
        font-size: 12px;
      }
    }
    ```

4.  [**操作符**](https://lesscss.cn/#-operations)：支持数学运算，可以在样式中进行简单的计算。

    ```less
    @base: 10px;
    @padding: @base * 2 + 2px;

    .box {
      padding: @padding;
    }
    ```

5.  [**函数**](https://lesscss.cn/#-functions)：提供了多种内置函数用于颜色、数值等的转换。

    ```less
    @color: #000;
    .text-box {
      color: lighten(@color, 20%);
    }
    ```

6.  [**命名空间和访问器**](https://lesscss.cn/#-namespaces-and-accessors)：为了提供一些封装，你可能希望对混入进行分组。

    ```less
    #bundle() {
      .button {
        display: block;
        border: 1px solid black;
        background-color: grey;
        &:hover {
          background-color: white;
        }
      }
    }

    #header a {
      color: orange;
      #bundle.button(); // can also be written as #bundle > .button
    }
    ```

7.  [**映射**](https://lesscss.cn/#-maps)：使用混入和规则集作为值映射。

    ```less
    #colors() {
      primary: blue;
      secondary: green;
    }

    .button {
      color: #colors[primary];
      border: 1px solid #colors[secondary];
    }
    /* 预期输出 */
    .button {
      color: blue;
      border: 1px solid green;
    }
    ```

8.  [**作用域**](https://lesscss.cn/#-scope)：Less 支持局部和全局作用域，变量的作用范围遵循就近原则。

    ```less
    @var: red;
    #page {
      @var: white;
      #header {
        color: @var; // white
      }
    }
    ```

    ```less
    @var: red;
    #page {
      #header {
        color: @var; // white
      }
      @var: white;
    }
    ```

9.  **导入**：可以导入其他的 Less 文件，有助于拆分和组织大型项目。

    ```less
    @import "variables.less";
    @import "mixins.less";
    ```

要开始使用 Less，您需要安装一个 Less 编译器，或者使用在线编译工具。现代开发环境中，通常会结合任务运行器如 Grunt、Gulp，或是构建工具如 Webpack，来自动处理 Less 到 CSS 的编译过程。

