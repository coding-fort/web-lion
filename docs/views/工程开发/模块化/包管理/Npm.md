# Npm

## 1.概述

### 1.1.什么是 cli ？

- `cli` 是 `command line interface` 的缩写，即命令行界面。
- `cli` 是指在命令行中输入命令，执行命令，得到命令执行结果。

### 1.2. 查看源

```bash
# 查看源
npm config get registry
```

### 1.3. 配置源

```bash
# 设置为官方源
npm config set registry https://registry.npmjs.org/
# 设置为淘宝源
npm config set registry https://registry.npm.taobao.org/
```

## 2.安装

### 2.1.本地安装

#### 特点：

- **安装位置**：默认情况下，npm 会将包安装到当前项目的 `node_modules` 文件夹中。
- **作用范围**：仅限于当前项目目录及其子目录内的文件可以访问这些包。
- **版本控制**：每个项目可以独立维护自己的依赖版本，确保不同项目之间的依赖不会相互影响。
- **配置文件**：所有本地安装的包都会记录在项目的 `package.json` 文件中的 `dependencies` 或 `devDependencies` 字段下。
- **命令格式**：`npm install <package-name>` 或简写为 `npm i <package-name>`

#### 使用场景：

- 当你需要特定版本的库用于开发、构建或运行应用程序时（如 React、Vue、Webpack 等）。
- 对于开发工具（如 ESLint、Prettier），如果只在特定项目中使用，则应作为本地依赖安装。
- 测试框架（如 Jest、Mocha）通常也是以本地依赖的形式存在，因为不同的项目可能需要不同版本的测试工具。

### 2.2.全局安装

#### 特点：

- **安装位置**：全局安装的包会被放置在一个系统级的目录中，通常是 `/usr/local/lib/node_modules`（取决于操作系统和 Node.js 的安装路径）。
- **作用范围**：任何地方都可以通过命令行直接调用这些包提供的 CLI 工具，而无需进入特定项目目录。
- **版本共享**：所有项目共享同一个全局安装的包版本，因此可能会引发版本冲突问题。
- **配置文件**：全局安装不会修改任何项目的 `package.json` 文件，而是由 npm 自己跟踪管理。
- **命令格式**：`npm install -g <package-name>`

#### 使用场景：

- CLI 工具（如 Create React App、Vue CLI、Angular CLI）常被全局安装，以便可以在任何地方创建新项目。
- 全局工具（如 npm、npx、yarn）本身也往往是全局安装的，方便随时调用。
- 如果你确定某个工具在整个机器上的所有项目中都使用相同的版本，并且不需要根据项目调整其版本，可以选择全局安装。

## 3.包配置

当前存在问题：

- 拷贝工程后，如何还原依赖？
- 如何区分开发依赖和生产依赖？
- 如果自身的项目也是一个包，如何描述包的信息？

为了解决存在的问题，需要一个<prib>配置文件</prib>，用来描述包的信息。

### 3.1.配置文件（package.json）

- 该文件可以手动创建，而更多的时候是通过`npm init` 初始化项目时创建。
- 配置文件中有哪些内容？[[package.json 配置信息]](/views/工程开发/模块化/包管理/package_json#\_1-什么是-package-json)
- 记录当前工程的依赖关系。

### 3.2.package-lock.json

<prib>package-lock.json</prib> 文件会保存 `node_modules` 中所有包的信息，包括精确版本 `version` 和下载地址 `resolved` 以及依赖关系 `dependencies` 等，用以记录当前状态下实际安装的各个模块的具体来源和版本号。这样 `npm install` 时速度就会提升。

## 4.包的使用

- 当使用 nodejs 导入模块时，如果路径不是以`./` 或`../`开头，则默认从 **`node_modules`** 中寻找。
- 如果当前目录下 **`node_modules`** 中找不到，则依次从上级目录的 **`node_modules`** ，直到全局目录的 **`node_modules`** 中寻找。
- `var path = require('./path');`，
  - 首先查找当前目录下是否有 **path.js** 文件；
  - 如果没有，则把 **path** 作为目录，查找该目录下是否有 **package.json** 文件，从而通过 **main** 找到程序入口；
  - 如果没有，查找该目录下是否有 **index.js** 文件；

## 5.npm.init 初始化项目

```bash
# 生成 package.json
npm init -y

# 生成 package-lock.json
npm install --package-lock-only

```

<bwe>充当`npx` 的作用</bwe>

```bash
npm init 包名 # 等效于 npx create-包名
npm init @命名空间 # 等效于 npx @命名空间/create
npm init @命名空间/包名 # 等效于 npx @命名空间/create-包名
```

## 6.语义版本

**语义版本 (Semantic Versioning, SemVer)** 是一种用于指定软件版本号的规范，旨在提供一种清晰且一致的方式来表达软件的演进和变更。npm（Node Package Manager）广泛采用了语义版本控制来管理包的版本依赖关系，确保开发者可以精确地指定所需的库版本，并且在升级时能够预见到可能的变化。

### 6.1.语义版本格式

语义版本由三个数字组成，中间用点号分隔，形式为 `MAJOR.MINOR.PATCH`，每个部分都有特定的意义：

- **MAJOR**：主版本号。当做了不兼容的 API 修改时增加。
- **MINOR**：次版本号。当增加了向后兼容的功能时增加。
- **PATCH**：修订号。当进行了向后兼容的问题修复时增加。

例如，版本 `1.2.3` 表示：

- 主版本号为 `1`，意味着这是一个相对稳定的版本系列。
- 次版本号为 `2`，表明已经添加了一些新功能但保持了与之前版本的兼容性。
- 修订号为 `3`，说明进行了三次小的修正或改进。

### 6.2.版本范围与通配符

为了更灵活地管理依赖项，npm 支持使用版本范围和通配符来定义依赖版本。这允许开发者指定一个版本区间，而不是固定到某个具体的版本。常见的版本范围包括：

- **波浪号 (~) 和插入符号 (^)**：

  - `~1.2.3`：匹配最接近的修补版本，即 `>=1.2.3 <1.3.0`。
  - `^1.2.3`：匹配最接近的次要版本，即 `>=1.2.3 <2.0.0`。这是 npm 默认的行为，适用于大多数场景。

- **大于等于 (>、>=)** 和 **小于 (<、<=)**：

  - `>=1.2.3`：匹配所有不低于 `1.2.3` 的版本。
  - `<2.0.0`：匹配所有低于 `2.0.0` 的版本。

- **具体版本**：

  - `1.2.3`：只匹配该特定版本。

- **X 或 \* 作为通配符**：

  - `1.x` 或 `1.*`：匹配所有 `1.x.x` 系列的版本。
  - `*`：匹配任何版本（最新版本）。

- **版本区间**：
  - `>=1.2.3 <2.0.0 || >=3.0.0`：复杂版本区间的组合，表示可以接受 `1.2.3` 到 `2.0.0` 之间的版本或者 `3.0.0` 及以上版本。
  - `1.2.1 - 2.0.0`：表示 `1.2.1` 到 `2.0.0` 之间的版本。

### 6.3.实践中的应用

假设你正在开发一个项目，并希望确保所使用的第三方库不会引入破坏性的更改，你可以这样配置 `package.json` 文件中的依赖项：

```json
{
  "dependencies": {
    "lodash": "^4.17.21", // 接受所有 4.x.x 版本，但不包括 5.0.0 及以上版本
    "axios": "~0.21.1" // 接受所有 0.21.x 版本，但不包括 0.22.0 及以上版本
  }
}
```

这样做可以让你的项目既享受到库更新带来的好处（如性能优化、安全补丁），又避免因重大改动而导致的潜在问题。

### 6.4.版本发布策略

对于维护者来说，遵循语义版本规则发布新版本非常重要：

- **修复 bug**：只需增加 PATCH 版本号，例如从 `1.0.0` 升级到 `1.0.1`。
- **新增功能**：如果这些功能是向后兼容的，则增加 MINOR 版本号，例如从 `1.0.0` 升级到 `1.1.0`。
- **API 更改**：如果有任何不兼容的变化，必须增加 MAJOR 版本号，例如从 `1.0.0` 升级到 `2.0.0`。

通过这种方式，用户可以根据自己的需求选择合适的版本范围，而开发者也可以更好地传达每次发布的意图。

## 7.发布包

### 7.1.准备工作

- 移除淘宝镜像源；
- 创建一个 npm 账号，并登录。
- 本地使用 **npm cli** 进行登录
  - `npm login`：登录
  - `npm adduser`：添加用户
  - `npm whoami`：查看是否登录成功
  - `npm logout`：退出登录
- 创建工程根目录；
- 初始化工程`npm init`；
  - [可选] 添加协议文件：LICENSE

### 7.2.发布

- 开发项目
- 添加依赖包：`npm install --save-dev <package>`
- 修改 package.json 文件中版本号
  - 每次发布都需要修改版本号
- 发布：`npm publish`
  - 如果发布失败，请检查 package.json 中的版本号是否正确，并确保 npm 账号有权限发布该包。

### 7.3.验证

- 登录 npmjs.org 网站，查看是否发布成功
- 或使用 `npm view <package>`
  - 如果返回的版本号与 package.json 中的版本号一致，则表示包发布成功。

### 7.4.私有包

- 创建私有包：`npm init --scope=<scope>`
- 发布私有包：`npm publish --access=public`
- 私有包访问权限：`npm config set registry https://registry.npmjs.org`

## 8.运行环境配置

在前端项目中，`process.env` 是一个非常有用的工具，它允许开发者通过环境变量来配置应用程序的行为，而无需更改源代码。这特别适用于区分开发、测试和生产环境的设置。以下是关于如何在前端项目中配置和使用 `process.env` 的详细指南。

### 8.1. **引入 `dotenv`**

为了在开发环境中轻松管理环境变量，通常会使用 `dotenv` 包来加载 `.env` 文件中的变量到 `process.env` 中。

#### 安装 `dotenv`

```bash
npm install dotenv --save-dev
```

#### 创建 `.env` 文件

在项目的根目录下创建一个或多个 `.env` 文件，用于定义不同环境下的环境变量。常见的文件名包括：

- `.env`: 默认环境
- `.env.development`: 开发环境
- `.env.test`: 测试环境
- `.env.production`: 生产环境

例如，在 `.env.development` 文件中可以这样定义变量：

```plaintext
REACT_APP_API_URL=http://localhost:3000/api
NODE_ENV=development
```

> 注意：以 `REACT_APP_` 开头的变量是 React 应用程序能够访问的唯一环境变量。这是 React 的约定，确保这些变量不会被意外暴露给客户端代码。

### 8.2. **加载 `.env` 文件**

为了让 `dotenv` 在构建过程中读取并应用 `.env` 文件中的变量，你需要在项目的入口文件（如 `index.js` 或 `app.js`）或者构建脚本之前引入 `dotenv`。

```javascript
require("dotenv").config({ path: ".env.development" });
```

对于 Create React App (CRA) 项目，不需要显式地引入 `dotenv`，因为 CRA 已经内置了对 `.env` 文件的支持。

### 8.3. **使用 `process.env`**

一旦设置了环境变量，你就可以在整个应用程序中通过 `process.env.VARIABLE_NAME` 来访问它们。例如：

```javascript
const apiUrl = process.env.REACT_APP_API_URL;
console.log(`API URL is ${apiUrl}`);
```

### 8.4. **配置 Webpack 或其他构建工具**

如果你不是使用 CRA，而是直接配置 Webpack 或其他构建工具，那么你可以使用 `DefinePlugin` 或类似插件将环境变量注入到打包后的代码中。

#### 使用 Webpack `DefinePlugin`

```javascript
const webpack = require("webpack");

module.exports = {
  // ... 其他配置 ...
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(process.env),
    }),
  ],
};
```

### 8.5. **CI/CD 环境配置**

在持续集成/持续部署 (CI/CD) 管道中，通常会在运行时设置环境变量。大多数 CI/CD 平台（如 GitHub Actions, Travis CI, CircleCI 等）都支持通过界面或配置文件设置环境变量。

例如，在 GitHub Actions 中可以通过工作流文件设置环境变量：

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      REACT_APP_API_URL: ${{ secrets.PROD_API_URL }}
      NODE_ENV: production
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
```

### 8.6. **安全注意事项**

- **不要在版本控制系统中提交敏感信息**：确保 `.env` 文件包含在 `.gitignore` 中，以防止敏感数据泄露。
- **使用加密存储**：对于生产环境中的敏感信息（如 API 密钥），考虑使用 CI/CD 平台提供的加密秘密功能。

- **限制暴露的变量**：仅将必要的环境变量暴露给客户端代码。例如，在 React 应用中，只允许 `REACT_APP_*` 前缀的变量被访问。

### 8.7. **调试与验证**

- **检查环境变量是否正确加载**：可以在应用程序启动时打印出所有环境变量，确保它们按预期加载。
- **使用条件逻辑**：根据不同的环境变量值，动态调整应用程序的行为。例如，基于 `NODE_ENV` 来启用或禁用某些功能。

```javascript
if (process.env.NODE_ENV === "production") {
  console.log("Running in production mode");
} else {
  console.log("Running in development mode");
}
```

## 9.命令速查

### 9.1.npm 安装依赖版本

- <err>@next</err>，一般表示下一个发布的版本，只要项目开发者上传的时候没有加 next 标签，那么 next 对应的版本也不会更新；
- <err>@latest</err>，一般表示最新版本，会自动更新；
- <err>@1.0.0</err>，表示安装 1.0.0 版本，不会自动更新；
- <err>@^1.0.0</err>，表示安装 1.0.0 版本，并且安装 1.x.x 的最新版本；
- <err>@~1.0.0</err>，表示安装 1.0.0 版本，并且安装 1.0.x 的最新版本；
- <err>@>1.0.0</err>，表示安装 1.0.0 版本，并且安装 1.x.x 的最新版本；

### 9.2.npm 命令

```bash
#
# 配置相关 #
# 查询目前生效的配置，标识符 -l 表示显示所有配置
npm config ls [-l] [-json]
# 查看源
npm config get registry
# 设置为官方源
npm config set registry https://registry.npmjs.org/
# 设置为淘宝源
npm config set registry https://registry.npm.taobao.org/
# 移除配置
npm config delete registry
# 设置 npm 安装依赖时，将依赖添加到 devDependencies
npm config set save-prefix '~'
# 设置 npm 安装依赖时，将依赖添加到 dependencies
npm config set save-prefix '=='
#
# 安装相关 #
# 安装依赖，本地安装，安装到当前命令行所在目录的 `node_modules` 目录下；
# npm install 可简写npm i
# 安装所有依赖（开发+生产）；
npm install
# 安装生产环境依赖
npm install --production
# 安装指定依赖
npm install [包名]
# 全局安装依赖，标识符：-g 或--global
npm install -g [包名]
# 安装开发依赖，标识符：-D 或--save-dev
npm install -D [包名]
# 安装生产依赖，标识符：-S 或--save
npm install -S [包名]
# 安装精确版本，标识符：-E 或--save-exact
npm install -E [包名]
#
# 卸载相关 #
# 卸载依赖；uninstall 别名：remove、rm、r、un、unlink；
npm uninstall
# 全局卸载依赖；
npm uninstall -g
# 卸载并从 devDependencies 中删除依赖；
npm uninstall -D
# 卸载并从 dependencies 中删除依赖；
npm uninstall -S
#
# 更新相关 #
# 查询哪些包需要更新
npm outdated
# 更新依赖；update 别名：upgrade、up
npm update [-g] [包名]
#
# 查看相关 #
# 查看全局安装目录
npm config get prefix
# 查看所有依赖版本；list 别名：ls；
npm list
# 查看指定依赖版本；
npm list [包名]
# 查询包安装路径，标识符：-g，全局；不填查询当前目录；--depth 查询深度=0：1级目录
npm root [-g][--depth: 查询深度]
# 查询包信息，view 别名：v；field 查询字段，version-查询所有版本；
npm view [包名] [field]
#
# 缓存相关 #
# 清除缓存
npm cache clean --force # -f 强制清除
# 显示缓存目录
npm config get cache
# 设置缓存位置
npm config set cache "新的缓存路径"
```
