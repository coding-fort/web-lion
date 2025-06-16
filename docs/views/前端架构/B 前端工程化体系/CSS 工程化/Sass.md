# Sass

Sass（Syntactically Awesome Style Sheets）是另一种 CSS 预处理器，它提供了许多高级功能，使编写样式表更加高效和有组织。Sass 有两种语法：

1. **SCSS (Sassy CSS)**：这是 Sass 的最新版本，也是主要推荐使用的语法。它的语法与 CSS 非常相似，但是增加了更多功能。例如，变量以`$`开头，而不是 Less 中的`@`符号。

2. **Sass**：原始的缩进语法，不使用大括号或分号，而是依赖于缩进来定义代码块。这种语法更简洁，但不如 SCSS 流行。

### Sass 的主要特性

- **变量**：可以存储重复使用的值，如颜色、字体等。

  ```scss
  $font-stack: Helvetica, sans-serif;
  $primary-color: #333;

  body {
    font: 100% $font-stack;
    color: $primary-color;
  }
  ```

- **嵌套**：允许在一个选择器中嵌套其他选择器，使得代码结构更清晰。

  ```scss
  nav {
    ul {
      margin: 0;
      padding: 0;
    }

    li {
      display: inline-block;
    }

    a {
      text-decoration: none;
      &:hover {
        color: $primary-color;
      }
    }
  }
  ```

- **混合（Mixins）**：类似于函数，用于复用一组 CSS 声明。

  ```scss
  @mixin border-radius($radius) {
    -webkit-border-radius: $radius;
    -moz-border-radius: $radius;
    border-radius: $radius;
  }

  .box {
    @include border-radius(10px);
  }
  ```

- **继承（Extend/Inheritance）**：允许一个选择器继承另一个选择器的所有样式，从而减少重复。

  ```scss
  .message {
    border: 1px solid #ccc;
    padding: 10px;
    color: #333;
  }

  .success {
    @extend .message;
    border-color: green;
  }
  ```

- **运算**：支持数学运算，可以在样式中进行简单的计算。

  ```scss
  $base-font-size: 16px;
  $base-line-height: 24px;
  body {
    font-size: $base-font-size;
    line-height: ($base-line-height / $base-font-size);
  }
  ```

- **导入（Import）**：可以将多个文件合并为一个文件，有助于模块化开发。

  ```scss
  @import "variables";
  @import "mixins";
  @import "base";
  ```

- **控制指令**：如`@if`, `@else`, `@for`, `@each`, 和 `@while`，这些可以用来根据条件生成 CSS。

### 使用 Sass

要开始使用 Sass，你需要安装 Sass 编译器。如果你使用的是 Node.js 环境，可以通过 npm 来安装：

```bash
npm install -g sass
```

然后你可以使用命令行工具来编译`.scss`文件到 CSS 文件：

```bash
sass input.scss output.css
```

对于大型项目，通常会结合构建工具如 Webpack、Gulp 或 Grunt 来自动处理 Sass 文件的编译，并且可以配置实时重新加载等功能。

此外，许多现代编辑器和 IDE 也提供插件来支持 Sass 的实时编译和错误检测，这可以大大提高开发效率。
