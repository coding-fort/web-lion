# Ant design

antd
是蚂蚁金服开发的一款基于 React 的 UI 组件库，主要用于开发企业级后台产品。
<br/> [官网：ant design](https://ant-design.antgroup.com/index-cn)
<br/> [官网：ant design 移动端](https://ant-design-mobile.antgroup.com/zh)

## 1. 特性

- 🌈 提供丰富的组件，覆盖了大部分业务场景。
- 📦 基于 npm + webpack 开发，支持 ES6。
- 🛡 使用 TypeScript 开发，提供类型定义文件。
- 🚀 开箱即用，提供大量的常用组件。
- 🌍 支持国际化，方便拓展。
- 🎨 使用 less 作为样式语言，方便定制主题。

## 1. 安装

```bash
npm install antd --save
```

## 2. 引入样式

```js
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
```

## 3. 引入组件

```js
import { Button } from "antd";
ReactDOM.render(<Button>antd button</Button>, mountNode);
```

## 4. 按需加载

```bash
npm install babel-plugin-import --save-dev
```

```js
// .babelrc or babel.config.js
{
  "plugins": [

]
    ["import", { "libraryName": "antd", "style": "css" }]
  ]
}
```

## 5. 按需加载样式

```js
// .babelrc or babel.config.js
{
  "plugins": [
    ["import", { "libraryName": "antd", "style": true }]
  ]
}
```

## 6. 按需加载样式（less）

```bash
npm install less less-loader --save-dev
```

```js
// .babelrc or babel.config.js
{
  "plugins": [
    ["import", { "libraryName": "antd", "style": true }]
  ]
}
```

```js
// webpack.config.js
module: {
  rules: [
    // ... other rules
    {
      test: /\.less$/,
      use: [
        // ... other loaders
        {
          loader: "less-loader",
          options: {
            lessOptions: {
              modifyVars: { "@primary-color": "#1DA57A" },
              javascriptEnabled: true,
            },
          },
        },
      ],
    },
  ];
}
```
