# CSS Module

CSS Modules 是一种将 CSS 与组件关联的技术，它使得每个组件的样式作用域仅限于该组件本身，从而避免了全局样式的冲突。这对于大型项目或团队协作尤为重要，因为它可以确保样式不会意外地影响其他部分，并且更容易理解和维护。

### CSS Modules 的工作原理

CSS Modules 的核心思想是通过编译器将类名转换为局部作用域内的唯一标识符。在使用时，你通过一个 JavaScript 对象来引用这些类名，而不是直接在 HTML 或 JSX 中硬编码它们。这不仅实现了样式的作用域隔离，还提高了代码的可读性和可维护性。

### 如何使用 CSS Modules

1. **命名约定**：文件名通常以 `.module.css` 结尾，表明这是一个 CSS Modules 文件。
2. **引入模块**：在 JavaScript 或 JSX 文件中，你可以像导入普通模块一样导入 CSS Modules 文件。

   ```javascript
   import styles from "./Button.module.css";
   ```

3. **应用样式**：使用对象的属性来访问类名，然后将其应用于元素。

   ```jsx
   <button className={styles.primary}>Click me</button>
   ```

4. **组合类名**：如果需要组合多个类名，可以通过模板字符串或者使用 `classnames` 库等方法来实现。

   ```jsx
   <button className={`${styles.primary} ${styles.large}`}>Click me</button>
   ```

5. **嵌套和组合**：CSS Modules 支持一些特殊的语法来处理嵌套选择器和组合类名。

   ```css
   .primary {
     composes: base;
     background-color: blue;
   }
   ```

6. **组合其他模块**：可以跨文件复用样式。

   ```css
   @value buttonStyles from './Button.module.css';

   .secondary {
     composes: primary from buttonStyles;
     background-color: green;
   }
   ```

7. **配置 Webpack**：为了使 Webpack 支持 CSS Modules，你需要配置适当的加载器（如 `css-loader`）。
   ```javascript
   module.exports = {
     module: {
       rules: [
         {
           test: /\.module\.css$/,
           use: [
             "style-loader",
             {
               loader: "css-loader",
               options: {
                 modules: true,
                 importLoaders: 1,
                 localIdentName: "[name]__[local]___[hash:base64:5]",
               },
             },
           ],
         },
         {
           test: /\.css$/,
           exclude: /\.module\.css$/,
           use: ["style-loader", "css-loader"],
         },
       ],
     },
   };
   ```

### CSS Modules 的优势

- **作用域隔离**：默认情况下，所有类名和动画名称都是局部作用域的，除非显式声明为全局。
- **自动前缀化**：支持通过 PostCSS 等工具自动添加浏览器前缀。
- **易于调试**：生成的类名包含原始类名的一部分，便于追踪来源。
- **组合功能**：允许轻松地组合多个类名，甚至是从其他模块中导入的类名。
- **提高性能**：由于减少了不必要的全局样式覆盖，有助于提升渲染性能。

### 实际应用中的注意事项

尽管 CSS Modules 提供了许多好处，但在实际开发中也有一些需要注意的地方：

- **兼容性**：不是所有的构建工具都默认支持 CSS Modules，可能需要额外配置。
- **学习曲线**：对于习惯了传统 CSS 开发方式的开发者来说，可能会有一个适应过程。
- **工具链集成**：确保你的开发环境（例如 Webpack、Parcel 等）正确配置以支持 CSS Modules。

总的来说，CSS Modules 是一种强大的工具，可以帮助前端开发者更好地管理和组织样式，尤其是在大型项目中。通过合理运用它可以显著改善项目的可维护性和扩展性。
