# Stylus

Stylus 是一种功能强大的 CSS 预处理器，它提供了简洁且灵活的语法，旨在简化和增强 CSS 编写体验。与 Less 和 Sass 相比，Stylus 的语法更加自由，允许开发者省略括号、分号甚至花括号，这使得代码看起来更简洁。

### Stylus 主要特性

1. **变量**：使用 `$` 或者不使用任何前缀来定义变量（取决于配置）。

   ```stylus
   primary-color = #4D926F

   body
     color primary-color
   ```

2. **嵌套**：支持 CSS 选择器的嵌套，以创建更具层次感的样式规则。

   ```stylus
   nav
     ul
       margin 0
       padding 0
     li
       display inline-block
     a
       text-decoration none
       &:hover
         color primary-color
   ```

3. **混合（Mixins）**：类似于函数的概念，可以复用样式块。

   ```stylus
   border-radius($radius)
     -webkit-border-radius $radius
     -moz-border-radius $radius
     border-radius $radius

   .box
     border-radius 10px
   ```

4. **运算**：可以在样式中进行数学运算。

   ```stylus
   base-font-size = 16px
   base-line-height = 24px

   body
     font-size base-font-size
     line-height (base-line-height / base-font-size)
   ```

5. **函数**：内置了多种函数，如颜色操作、数学计算等，并支持自定义函数。

   ```stylus
   lighten(color, percentage)
     hsl(hue(color), saturation(color) + percentage, lightness(color))

   .text-box
     color lighten(primary-color, 20%)
   ```

6. **导入（Import）**：可以将多个文件合并为一个文件，有助于模块化开发。

   ```stylus
   @import 'variables'
   @import 'mixins'
   @import 'base'
   ```

7. **条件语句和循环**：支持 `if/else`, `for`, `each`, `while` 等控制指令。

   ```stylus
   for i in 1..4
     .item-{i}
       width (i * 25)%
   ```

8. **插值**：在选择器或属性中插入变量值。

   ```stylus
   @media screen and (max-width: {screen-small}px)
     // 样式规则
   ```

9. **内联 JavaScript**：可以直接嵌入 JavaScript 表达式，提供极大的灵活性。
   ```stylus
   colors = ['red', 'blue', 'green']
   for color in colors
     .color-{color}
       background-color color
   ```

### 使用 Stylus

要开始使用 Stylus，你需要安装它的编译器。如果你使用的是 Node.js 环境，可以通过 npm 来安装：

```bash
npm install stylus -g
```

然后你可以使用命令行工具来编译 `.styl` 文件到 CSS 文件：

```bash
stylus input.styl -o output.css
```

对于大型项目，通常会结合构建工具如 Webpack、Gulp 或 Grunt 来自动处理 Stylus 文件的编译，并且可以配置实时重新加载等功能。

此外，许多现代编辑器和 IDE 也提供插件来支持 Stylus 的实时编译和错误检测，这可以大大提高开发效率。

### 比较与选择

Stylus 提供了一种非常自由和灵活的语法，适合那些喜欢极简主义风格的开发者。然而，由于其语法的宽松性，初学者可能会觉得难以理解和上手。相比之下，Sass 和 Less 的语法更为严格和直观，可能更适合大多数开发者，尤其是那些已经熟悉传统 CSS 语法的人。选择哪种预处理器主要取决于个人或团队的偏好以及项目的具体需求。
