# 创建一个 VitePress 插件

创建一个 VitePress 插件可以让你扩展 VitePress 的功能，比如添加自定义的行为、组件或中间件。下面是一个简单的指南，帮助你创建一个基本的 VitePress 插件。这个例子将展示如何创建一个插件来在每个页面加载时打印一条消息到控制台。

## 1. 初始化项目

首先，确保你已经安装了 Node.js 和 npm。然后，在你的工作目录下初始化一个新的 npm 项目：

```bash
mkdir my-vitepress-plugin
cd my-vitepress-plugin
npm init -y
```

## 2. 安装依赖

虽然对于一个非常基础的插件来说可能不需要额外的依赖，但通常你可能会需要一些工具库。在这个例子中，我们只需要 vitepress 作为开发依赖：

```bash
npm install vitepress --save-dev
```

## 3. 创建插件文件

在项目的根目录下创建一个名为 `index.js` 或者你喜欢的其他名字的文件，例如 `myPlugin.js`。这是你的插件的主要文件。

```javascript
// myPlugin.js
module.exports = (options = {}, ctx) => {
  return {
    name: "my-vitepress-plugin", // 插件名称

    // enhanceAppFiles 可以用来向 Vue 应用添加额外的配置
    enhanceAppFiles: [
      {
        name: "my-custom-enhance",
        content: `
          export default ({ app, router, siteData }) => {
            console.log('This is my custom plugin enhancing the app!');
            
            // 你可以在这里添加全局组件、指令等
          }
        `,
      },
    ],

    // 这里可以定义其他的钩子函数，如 ready, generate 等
    ready() {
      console.log("My VitePress Plugin is ready!");
    },
  };
};
```

## 4. 在 VitePress 配置中使用插件

接下来，在你的 VitePress 项目中引用这个插件。编辑 `.vitepress/config.js` 文件，加入对新插件的引用：

```javascript
import myPlugin from "./path/to/myPlugin";

export default {
  title: "My VitePress Site",
  description: "Just playing around.",

  plugins: [
    myPlugin({
      // 插件选项（如果有的话）
    }),
  ],
};
```

确保路径正确指向你创建的插件文件位置。

## 5. 测试插件

现在，当你运行 VitePress 开发服务器 (`vitepress dev`) 并访问任意页面时，你应该能在浏览器的开发者工具控制台看到插件打印的消息：“This is my custom plugin enhancing the app!” 和 “My VitePress Plugin is ready!”。

## 扩展插件功能

根据你的需求，你可以进一步扩展这个插件的功能，比如：

- 添加全局组件。
- 修改路由行为。
- 根据环境变量动态调整配置。
- 实现更复杂的逻辑，如权限检查、内容加密解密等。

通过这种方式，你可以创建强大的自定义插件来增强 VitePress 的功能，满足特定的需求。
