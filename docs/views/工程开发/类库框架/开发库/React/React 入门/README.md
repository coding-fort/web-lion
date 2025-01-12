### 入门阶段

#### 目标：

理解 React 的基本概念和语法，能够创建简单的 React 组件和应用程序。

#### 内容：

1. **React 基础**

   - JSX 语法
   - 组件和 Props
   - State 管理
   - 生命周期方法（在 React 16.3+ 中，推荐使用 Hooks 替代类组件的生命周期方法）
   - 事件处理
   - 列表和键（Keys）
   - 表单
   - 条件渲染
   - 路由

2. **React 工具链**

   - 创建 React 应用（Create React App）

```bash
# 方式一：安装 Create React App
npm install create-react-app -g
create-react-app my-app
# 方式二：创建一个新的 React 应用
npx create-react-app my-app
#
cd my-app
#
npm start
```

- Babel 和 Webpack（可选深入理解）
- ESLint 和 Prettier

3. **实战练习**

   - 构建简单的计数器应用
   - 制作待办事项列表
   - 搭建一个天气查询应用

#### 额外资源：

- [React 官方文档](https://reactjs.org/docs/getting-started.html)
- [React 入门教程](https://zh-hans.reactjs.org/tutorial/tutorial.html)

### 从零搭建 React 项目

1. 创建项目文件夹

```bash
mkdir react-project
cd react-project
```

2. 初始化项目

```bash
npm init -y
```

3. 安装 vite

```bash
npm install vite -D
# 安装vite插件
npm install @vitejs/plugin-react -D
```

4. 创建 vite.config.js 文件

```javascript
import { defineConfig } from "vite";
import { resolve } from "path";
import React from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [React()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: resolve(__dirname, "src"),
      },
    ],
  },
});
```

5. 创建 src 文件夹，并在其中创建 main.jsx 文件

```jsx
import React from "react";
import { createRoot } from "react-dom/client";

const App = () => {
  return <h1>Hello, React!</h1>;
};

createRoot(document.getElementById("root")).render(<App />);
```

6. 安装 react 相关

```bash
npm install react react-dom react-router react-router-dom axios express
```

7. 根目录下创建 index.html 文件

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React Project</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./src/main.jsx"></script>
  </body>
</html>
```

9. 在浏览器中打开 index.html 文件，查看效果。

#### 额外资源：

- [React 官方文档](https://reactjs.org/docs/getting-started.html)
