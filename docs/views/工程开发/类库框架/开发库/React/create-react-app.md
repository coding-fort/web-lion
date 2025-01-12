# React

### React-cli 安装

React CLI 是一个用于创建 React 应用的命令行工具。要安装它，你需要先安装 Node.js 和 npm（Node 包管理器）。然后运行以下命令：

```sh
npm install -g create-react-app
```

这条命令会全局安装 create-react-app 工具，使你能够通过它快速创建新的 React 应用。

### 创建 React 应用

```sh
# 创建js 应用
create-react-app my-app
# 创建ts 应用
npx create-react-app project-name --template typescript

```

### 启动

```sh
cd my-app

npm start
```


### 安装ui 组件库

```sh
npm install antd --save
```

### 配置路由

```sh
npm install react-router-dom --save
```

### 配置代理

```sh
npm install http-proxy-middleware --save
```

### 配置打包

```sh
npm install --save-dev babel-preset-react-app
```

### 配置打包

```sh
    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    }

```