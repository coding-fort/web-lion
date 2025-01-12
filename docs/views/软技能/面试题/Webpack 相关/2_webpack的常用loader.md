# 2_webpack 的常用 loader

```md
`babel-loader`：用于将 ES6+的 JavaScript 代码转换为 ES5 代码，以便在旧版本浏览器中运行。

`css-loader`：用于解析 CSS 文件，并处理其中的 import 和 url()等语法。

`style-loader`：将解析后的 CSS 代码以<style>标签的形式插入到 HTML 文件中。

`file-loader`：用于处理文件资源（如图片、字体等），并将其复制到输出目录中。

`url-loader`：类似于 file-loader，但可以根据文件大小将文件转换为 DataURL，以减少 HTTP 请求。

`sass-loader`：用于将 Sass/SCSS 代码转换为 CSS 代码。

`less-loader`：用于将 Less 代码转换为 CSS 代码。

`postcss-loader`：用于对 CSS 代码进行后处理，如自动添加浏览器前缀等。

`vue-loader`：用于解析和转换 Vue 单文件组件。

`ts-loader`：用于将 TypeScript 代码转换为 JavaScript 代码。
```
