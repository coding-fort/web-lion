# Dumi-组件/文档研发工具

dumi 为组件研发而生的静态站点框架。

- [dumi 官方文档](https://d.umijs.org/)
- [dumi GitHub](https://github.com/umijs/dumi)

## 特性

- 📦 开箱即用，内置路由、Webpack、Babel、PostCSS 等开发所需工具
- 📝 专为组件开发设计，内置组件文档方案
- 🌈 支持主题定制，内置默认主题和暗黑主题
- 🌟 开发者友好，支持 TypeScript、Markdown 中的 Vue、React 组件示例
- 🛡️ 支持 PWA，可作为静态站点部署
- 🔗 支持静态站点部署，如 Vercel、Netlify、GitHub Pages 等

## 安装

```bash
npm install -g dumi
```

## 使用

```bash
dumi dev
```

```bash
dumi build
```

## dumi 与 vuepress 对比

<bqw>

Dumi 和 VuePress 都是非常受欢迎的文档生成工具，它们各有优势和适用场景。下面是两者之间的一些比较：

### Dumi (React)

- **技术栈**：Dumi 是基于 React 和 Umi.js 的，这意味着它是完全基于 JavaScript 和 React 生态系统的。
- **组件开发**：Dumi 特别适合开发 React 组件库，并且提供了很好的组件演示和 API 文档生成功能。
- **文档结构**：Dumi 的文档结构非常灵活，可以很好地与现有项目集成。
- **主题系统**：Dumi 提供了高度可定制的主题系统，允许开发者根据需要调整样式。
- **API 文档**：Dumi 能够基于 TypeScript 类型定义自动生成组件 API 文档。
- **集成工具**：Dumi 与 Father 构建工具紧密集成，方便进行组件库的构建和打包。
- **生态系统**：Dumi 是 Umi.js 生态系统的一部分，可以利用这个生态系统的资源和支持。

### VuePress (Vue.js)

- **技术栈**：VuePress 是基于 Vue.js 的，它专注于使用 Vue.js 生态系统的开发者。
- **文档生成**：VuePress 主要用于生成静态文档网站，支持 Markdown 和 Vue.js 单文件组件。
- **主题系统**：VuePress 也有一个强大的主题系统，可以使用官方主题或自定义主题。
- **插件系统**：VuePress 提供了一个插件系统，允许开发者扩展功能，如添加评论系统、搜索等。
- **社区支持**：VuePress 有一个活跃的社区，提供了许多插件和主题选择。
- **文档结构**：VuePress 的文档结构相对固定，但可以通过自定义配置来适应不同的需求。
- **SEO**：VuePress 生成的静态站点对搜索引擎友好。

### 比较总结

- **适用场景**：

  - 如果你的项目主要使用 React，或者你需要一个工具来帮助你开发 React 组件库并为其编写文档，那么 Dumi 是一个非常好的选择。
  - 如果你的项目使用 Vue.js，或者你只需要一个简单的文档生成工具来创建静态文档站点，那么 VuePress 将会更加合适。

- **灵活性**：

  - Dumi 在组件开发方面更为灵活，特别是对于 React 开发者来说。
  - VuePress 更侧重于文档生成，虽然也可以用来展示组件，但在组件开发和演示方面可能不如 Dumi 方便。

- **学习曲线**：

  - 如果你熟悉 React，那么 Dumi 的学习曲线可能会较低。
  - 如果你熟悉 Vue.js，则 VuePress 学习起来也会比较容易。

- **社区和插件**：
  - 两个工具都有活跃的社区和丰富的插件生态系统，但各自的插件和主题可能会有所不同。

总的来说，选择哪一个取决于你的项目需求和技术栈偏好。如果你需要一个专注于 React 组件开发的工具，那么 Dumi 会更适合；如果你正在寻找一个易于使用的文档生成工具，并且你的项目使用的是 Vue.js，那么 VuePress 会是更好的选择。

</bqw>
