# vue-cli 搭建项目

vue-cli 工作原理：一个下载器，将 github 上的 webpack 模板项目下载到本地；实际是 webpack

## vue/cli3 构建

```json
// 安装脚手架：
npm install -g @vue/cli

// 构建项目：
vue create project-name

// 启动命令：
npm run serve

"scripts": {
  "serve": "vue-cli-service serve"
}
```

- 多环境文件配置：

```json
// 开发：./.env.development
NODE_ENV=development
VUE_APP_BASE_APIURL=http://www.******.com:8080/devp

// 生产：./.env.production
NODE_ENV=production
VUE_APP_BASE_APIURL=http://www.******.com:8080/prod

//测试：./.env.test
NODE_ENV=test
VUE_APP_BASE_APIURL=http://www.******.com:8080/test
```

- 按环境打包：
  [vue/cli3 多环境打包配置](https://www.cnblogs.com/listen9436/p/12526400.html)

```json
// 打包命令（./package.json）
开发环境 - "build:dev": "vue-cli-service build --mode development",
生产环境 - "build:prod": "vue-cli-service build --mode production",
测试环境 - "build:test": "vue-cli-service build --mode test",
发布环境 - "build:rel": "vue-cli-service build --mode release"
```

- 获取环境文件配置：

```js
// 接口请求地址获取
const url = process.env.VUE_APP_BASEURL;

// 文件导出路径（vue.config.js）（建议）
const env = process.env.NODE_ENV;
module.exports = {
  outputDir: `../PACKAGE FILES/${env}/ECSP`,
};
```

## vue/cli2 构建

```json
// 安装脚手架：
npm install -g @vue/cli-init

// 构建项目：
vue init webpack project-name

//启动命令：
npm run dev

"scripts": {
  "dev": "webpack-dev-server --inline --progress --config build/webpack.dev.conf.js"
}
```

- 环境文件配置：

```js
//开发：./config/dev.env.js
"use strict";
const merge = require("webpack-merge");
const prodEnv = require("./prod.env");

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  VUE_APP_BASE_APIURL: '"http://www.baidu.com:8080/developmentdd"',
});

// 生产：./config/prod.env.js
("use strict");
module.exports = {
  NODE_ENV: '"production"',
  VUE_APP_BASE_APIURL: '"http://www.baidu.com:8080/production/"',
};

// 测试：./config/test.env.js
("use strict");
module.exports = {
  NODE_ENV: '"test"',
  VUE_APP_BASE_APIURL: '"http://www.baidu.com:8080/test/"',
};
```
