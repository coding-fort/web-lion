# VuePress-Vue 驱动的静态网站生成器

[参考：官方文档](https://www.vuepress.cn/)

## VuePress 配置文件<errb>（./vuepress/config.js）</errb>

### 1. 站点配置项

**head**

[VuePress 站点配置 head](http://www.fenovice.com/doc/vuepress-next/reference/config.html#head)

```js
module.exports = {
  head: [
    ["link", { rel: "icon", href: "/static/images/logo.png" }],
    // 添加全局样式
    ["link", { rel: "stylesheet", href: "./styles/index.styl" }],
  ],
};
/*
    渲染为：
    <head>
        <link rel="icon" href="/static/images/logo.png" />
    </head>
*/
```

### 2. 通用配置项

```js
module.exports = {
  dest: "./dist",
};
```

### 3. Dev 配置项

```js
module.exports = {
  port: 8080,
};
```

## 组件效果预览配置

[vuepress 搭建 UI 组件库文档踩坑篇](https://www.shuzhiduo.com/A/MAzA4ngnd9/)

**安装插件**

```bash
npm i -D vuepress-plugin-demo-container
```

**配置插件**
在 config.js 文件夹里（.vupress 目录下）配置插件

```js
module.exports = {
  plugins: ["demo-container"],
};
```

**新建 md 文件，用于展示组件**

**在 md 文件里使用语法 ::: demo [some comments] :::**

````bash
::: demo
```html
<wb-button icon="download"></wb-button>
````

:::

````

**新建 enhanceApp.js(.vupress 目录下)用于全局注册你的 UI 组件**

```js
import wbButton from "../../src/wb-button";
export default ({ Vue }) => {
  Vue.mixin({
    mounted() {
      Vue.component(wbButton.name, wbButton);
    },
  });
};
````

## 添加侧边栏

在对应文件夹的<span style="color: #ff502c;">nav.json</span> 添加<span style="color: #ff502c;">sidebar</span>，通过**children** 添加对应的 md 文档；

```json
"sidebar": {
  // 一级侧栏菜单：该级菜单为目录（若存在下级目录，则不需添加README.md）
    "/views/类库框架/开发库": [
      {
        "title": "开发库",
        "collapsable": true,
        "children": [
          // 二级侧栏菜单：该级菜单为目录（需添加README.md）
          {
            "title": "Vue",
            "path": "/views/类库框架/开发库/Vue",
            "collapsable": true,
            "children": [
              // 三级侧栏菜单：该级菜单为文档
              {
                "title": "Vue",
                "path": "/views/类库框架/开发库/Vue/Vue"
              },
              {
                "title": "Element UI",
                "path": "/views/类库框架/开发库/Vue/Element UI"
              }
            ]
          },
          // 二级侧栏菜单
          {
            "title": "React",
            "path": "/views/类库框架/开发库/React/Ant design",
            "collapsable": true,
            "children": [
              // 三级侧栏菜单
              {
                "title": "Ant design",
                "path": "/views/类库框架/开发库/React/Ant design"
              }
            ]
          }
        ]
      }
    ]
  }
```

## 备注

1. 解决 vuepress 报 Error: Cannot find module ‘core-js/library/fn/object/assign 问题

- 原因：core-js 版本原因
- 解决方案：在 config 文件（路径 docs.vuepress\config.js）中加上以下代码

```js
modules.exports = {
  chainWebpack(config) {
    config.resolve.alias.set("core-js/library/fn", "core-js/features");
  },
};
```

## [dumi 与 vuepress 对比](./Dumi-组件文档研发工具.html#dumi-与-vuepress-对比)
