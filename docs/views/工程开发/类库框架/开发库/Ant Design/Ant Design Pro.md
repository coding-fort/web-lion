# Ant Design Pro

Ant Design Pro 是基于 Ant Design 而开发的，具有强大功能的 React UI 库，适用于开发中后台产品。
<br/> [官网：ant design pro](https://pro.ant.design/zh-CN/)

## 安装

```bash
$ yarn create umi myapp
$ cd myapp
$ yarn
```

## 目录结构

```bash
├── config                   # umi 配置，包含路由、构建等配置
├── mock                     # 本地模拟数据
├── public                   # 静态资源
├── src                      # 源码目录
│   ├── assets               # 本地静态资源│   ├── components           # 业务通用组件
│   ├── e2e                  # 集成测试用例
│   ├── layouts              # 通用布局
│   ├── models               # 全局数据模型
│   ├── pages                # 页面
│   ├── services             # 后台接口服务
│   ├── utils                # 工具库
│   ├── locales              # 国际化资源
│   ├── global.less          # 全局样式文件
│   └── global.js            # 全局 JS
├── tests                    # 测试工具├── README.md                # 项目说明
└── package.json
```

## 路由

路由配置在 `config/router.config.js` 中，可以配置路由的路径、标题、图标、是否隐藏、是否需要权限等。

## 页面

页面在 `src/pages` 目录下，每个页面是一个文件夹，文件夹中包含 `index.js` 和 `index.less` 文件，分别对应页面的内容和样式。

## 组件

组件在 `src/components` 目录下，可以复用。

## 数据模型

数据模型在 `src/models` 目录下，可以定义全局的数据模型。

## 工具库

工具库在 `src/utils` 目录下，可以定义全局的工具函数。

## 国际化

国际化资源在 `src/locales` 目录下，可以定义多语言资源。

## 样式

样式在 `src/global.less` 中定义，可以定义全局的样式。

## 构建和部署

构建和部署在 `config` 目录下的 `config.js` 中配置。

## 测试

测试在 `tests` 目录下，可以使用 Jest 进行测试。

## 其他

其他配置在 `config` 目录下的 `config.js` 中配置。
