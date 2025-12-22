# 从零搭建二次封装 Element UI 的 npm 库（Vue 2.6）

以下是完整的搭建方案，包含基础库结构、VitePress 文档、npm 发布配置，满足全量/按需下载需求。

## 一、项目初始化与基础结构

### 1. 创建项目目录

```bash
mkdir my-element-ui && cd my-element-ui
npm init -y
```

### 2. 安装核心依赖

```bash
# 生产依赖（Vue 2.6 + Element UI）
npm i vue@2.6.14 element-ui@2.15.13

# 开发依赖（构建工具 + 文档工具）
npm i -D webpack@^4.47.0 webpack-cli@^3.3.12 vue-loader@^15.11.1 vue-template-compiler@^2.6.14
npm i -D babel-loader@^8.4.1 @babel/core@^7.28.5 @babel/preset-env@^7.28.5 css-loader@^5.2.7 style-loader@^1.3.0
npm install vuepress@1.9.9 -D # 安装 VuePress 1.x（适配 Vue 2）
  # 文档工具（兼容 Vue 2 示例）
npm i -D rimraf cross-env  # 辅助工具
# 代码复制插件
npm i -D vuepress-plugin-code-copy@1.0.6
# 代码折叠叠插件（适配 VuePress 1.x）
npm i -D vuepress-plugin-collapse-code@1.0.0
```

## 二、基础库结构设计

```
my-element-ui/
├── src/                      # 核心源码
│   ├── components/           # 二次封装组件
│   │   ├── MyButton/         # 示例组件（封装 el-button）
│   │   │   ├── index.vue     # 组件实现
│   │   │   └── index.js      # 组件导出
│   │   └── index.js          # 组件总入口
│   ├── utils/                # 工具函数
│   └── index.js              # 库总出口（全量导出）
├── docs/                     # VitePress 文档
│   ├── .vuepress/            # 替换 .vitepress 为 .vuepress
│   │   ├── config.js         # 配置文件
│   │   ├── enhanceApp.js    # 文档增强（可选）
|   |   ├—— components/       # 组件文档（保持不变）
│   │   └── dist/             # 构建输出（自动生成）
│   └── guide/                # 指南文档（保持不变）
│       └── index.md
└── README.md                 # 首页（原 index.md 改名为 README.md）
├── dist/                     # 构建产物（基础库）
├── package.json              # 项目配置
├── webpack.config.js         # 基础库构建配置
└── .npmignore                # 控制 npm 发布内容
```

## 三、核心配置文件

### 1. webpack.config.js（基础库构建）

```javascript
const path = require("path");
const VueLoaderPlugin = require("vue-loader/lib/plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "my-element-ui.js",
    library: "MyElementUI", // 全局变量名
    libraryTarget: "umd", // 支持多种引入方式
    umdNamedDefine: true,
  },
  module: {
    rules: [
      { test: /\.vue$/, loader: "vue-loader" },
      { test: /\.js$/, loader: "babel-loader", exclude: /node_modules/ },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
    ],
  },
  plugins: [new VueLoaderPlugin()],
  externals: {
    // 排除 Vue 和 Element UI（避免打包重复依赖）
    vue: { root: "Vue", commonjs: "vue", commonjs2: "vue", amd: "vue" },
    "element-ui": {
      root: "ELEMENT",
      commonjs: "element-ui",
      commonjs2: "element-ui",
      amd: "element-ui",
    },
  },
};
```

### 2. package.json 核心配置

```json
{
  "name": "my-element-ui",
  "version": "0.1.0",
  "main": "dist/my-element-ui.js", // 基础库入口
  "files": ["dist", "src"], // 全量发布包含的文件
  "scripts": {
    "build:lib": "webpack --mode production", // 构建基础库
    "docs:dev": "vitepress dev docs", // 开发文档
    "docs:build": "vitepress build docs", // 构建文档
    "prepublishOnly": "npm run build:lib" // 发布前自动构建
  },
  "peerDependencies": {
    // 声明宿主环境需依赖的版本
    "vue": "^2.6.0",
    "element-ui": "^2.15.0"
  }
}
```

### 3. .npmignore（控制 npm 发布内容）

```
# 排除文档源码（仅当用户下载全量时通过 git 获取）
/docs
# 排除开发配置
webpack.config.js
.vitepress
# 排除 node_modules 和构建缓存
node_modules
dist/*.map
```

## 四、开发第一个封装组件

### 1. src/components/MyButton/index.vue

```vue
<template>
  <el-button :type="type" :size="size" @click="$emit('click', $event)">
    <slot></slot>
  </el-button>
</template>

<script>
  export default {
    name: "MyButton",
    props: {
      type: { type: String, default: "primary" },
      size: { type: String, default: "medium" },
    },
  };
</script>
```

### 2. src/components/MyButton/index.js

```javascript
import MyButton from "./index.vue";
export default MyButton;
```

### 3. src/components/index.js（组件总入口）

```javascript
import MyButton from "./MyButton";

// 按需导出
export { MyButton };

// 批量注册方法（类似 Element UI）
const components = [MyButton];
const install = (Vue) => {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

export default { install };
```

### 4. src/index.js（库总出口）

```javascript
import components from "./components";
export * from "./components"; // 支持按需导入
export default components; // 支持全量导入
```

## 五、VitePress 文档搭建

### 1. docs/.vitepress/config.js

```javascript
export default {
  title: "MyElementUI",
  description: "二次封装 Element UI 组件库",
  themeConfig: {
    nav: [{ text: "指南", link: "/guide/" }],
    sidebar: { "/guide/": [{ text: "快速开始", link: "/guide/" }] },
  },
};
```

### 2. docs/guide/index.md（使用指南）

````markdown
# 快速开始

## 安装

```bash
npm i my-element-ui element-ui vue@2.6 -S
```
````

## 全量引入

```javascript
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import MyElementUI from "my-element-ui";
import App from "./App.vue";

Vue.use(ElementUI);
Vue.use(MyElementUI);

new Vue({ el: "#app", render: (h) => h(App) });
```

## 按需引入

```javascript
import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import { MyButton } from "my-element-ui";
import App from "./App.vue";

Vue.use(ElementUI);
Vue.component(MyButton.name, MyButton);

new Vue({ el: "#app", render: (h) => h(App) });
```

````

### 3. docs/index.md（文档首页）
```markdown
# MyElementUI

基于 Element UI 二次封装的组件库，适用于 Vue 2.6。

[开始使用 →](./guide/)
````

## 六、npm 发布与下载控制

### 1. 发布到 npm

```bash
# 登录 npm（需先注册 npm 账号）
npm login

# 发布（自动执行 prepublishOnly 脚本构建基础库）
npm publish
```

### 2. 下载方式控制

- **基础库（仅组件）**：  
  用户直接通过 npm 安装：`npm i my-element-ui`，只会下载 `dist` 和 `src` 目录。

- **全量（含文档）**：  
  引导用户从 GitHub 克隆：`git clone <你的仓库地址>`，包含所有源码和文档。

## 七、开发与调试流程

1. 开发组件：`src/components/` 中编写组件，通过 `npm run build:lib` 构建测试。
2. 开发文档：`npm run docs:dev` 启动文档服务（http://localhost:5173），实时预览。
3. 发布更新：修改版本号 `package.json` → `npm publish`。

## 总结

通过以上配置，你已完成：

- 基于 Vue 2.6 + Element UI 的二次封装库结构
- VitePress 文档站（类似 Element UI 官网）
- 支持 npm 发布基础库，全量代码通过 Git 管理
- 兼容全量/按需引入方式

后续可扩展更多组件，在 `src/components` 中按相同结构添加即可。
