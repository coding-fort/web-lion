# package.json

[参考：深入理解 package.json 文件与 package-lock.json 文件](https://blog.csdn.net/m0_73531461/article/details/136399322)

## 1.什么是 package.json

<prib>package.json</prib> 文件一般都在每个项目的根目录下面，定义了这个项目所需要的各种模块，以及项目的配置信息，包括名称、版本、许可证、依赖模块等元数据。格式是严格的 JSON 格式。

![package.json-01.png](/assets/images/package.json-01.png "package.json 内容组成")

## 2.什么是 package-lock.json

<prib>package-lock.json</prib> 文件会保存 `node_modules` 中所有包的信息，包括精确版本 `version` 和下载地址 `resolved` 以及依赖关系 `dependencies` 等，用以记录当前状态下实际安装的各个模块的具体来源和版本号。这样 `npm install` 时速度就会提升。

## 3.为什么有 package-lock.json，还需要 package-lock.json

当项目中已有 `package-lock.json` 文件，在安装项目依赖时，将以该文件为主进行解析安装指定版本依赖包，而不是使用 `package.json` 来解析和安装模块。因为 `package.json` 指定的版本不够具体，而 `package-lock.json` 为每个模块及其每个依赖项指定了版本，位置和完整性哈希，所以它每次的安装都是相同的。

<prib>package-lock.json</prib> 文件主要作用有以下两点：

- 当删除 `node_module` 目录时，想通过 `npm install` 恢复所有包时，提升下载速度。
- 锁定版本号，防止自动升级新版本。

正因为有了 `package-lock.json` 文件锁定版本号，所以当你执行 `npm install` 的时候，node 不会自动更新 `package.json` 文件中的模块，必须用 `npm install packagename（自动更新小版本号）`或者 `npm install packagename@x.x.x（指定版本号）`来进行安装才会更新，`package-lock.json` 文件中的版本号也会随着更新。

## 4.项目中如何生成 package.json 和 package-lock.json

```bash
# 生成 package.json
npm init -y

# 生成 package-lock.json
npm install --package-lock-only
```

<bwe>在首次安装依赖包时会创建 package-lock.json 文件。</bwe>

## 5.npm install 命令执行后发生什么

![package.json-02.png](/assets/images/package.json-02.png "npm install 命令执行后发生什么")

## 6.版本符号含义

[[语义版本]](/views/工程开发/模块化/包管理/Npm)

指定版本：比如 `1.2.0`，遵循“大版本.次要版本.小版本”的格式规定，安装时只安装指定版本。

- 插入号：比如 `ˆ1.2.2`，表示安装 `1.x.x` 的最新版本（不低于 1.2.2），但是不安装 `2.x.x`，安装时不改变大版本号。
- 波浪号：比如`~1.2.2`，表示安装 `1.2.x` 的最新版本（不低于 1.2.2），但是不安装 `1.3.x`，安装时不改变大版本号和次要版本号。
- `latest`：安装最新版本

<bwer>如果大版本号为 0，则插入号的行为与波浪号相同，因为此时处于开发阶段，即使是次要版本号变动，也可能带来程序的不兼容。所以建议使用 ~ 来标记版本号，这样可以保证项目不会出现大的问题，也能保证包中的小 bug 可以得到修复。
</bwer>

```json
// package.json 中的版本符号
{
  "react": "^18.2.0", //  插入符号 ^18.2.0 ：匹配 18.X.X 的最新版本。
  "react-dom": "~18.2.0", //  波浪符号 ~18.2.0 ：匹配 18.2.X 的最新版本。
  "react-refresh": "0.11.0" //  固定版本 0.11.0 ： 匹配 0.11.0， 不会更新版本。
}
```

<bws>`package.json` 定义的是锁住主版本。`package-lock.json` 定义的是锁住小版本</bws>

## 7.npm 脚本（npm scripts）

**npm 脚本（npm scripts）** 是 npm 提供的一个强大功能，允许开发者在 `package.json` 文件中定义和执行自定义命令。这些脚本可以用于自动化常见的开发任务，如启动服务器、构建项目、运行测试等。通过使用 npm 脚本，开发者可以简化工作流程，确保团队成员遵循一致的开发标准，并且轻松地将任务集成到 CI/CD 管道中。

### 7.1.定义 npm 脚本

在 `package.json` 文件中的 `scripts` 字段下定义脚本。每个脚本由一个名称和相应的命令组成。例如：

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js",
    "build": "webpack --config webpack.config.js",
    "test": "jest",
    "lint": "eslint ."
  }
}
```

在这个例子中，我们定义了四个脚本：

- `start`: 使用 Node.js 启动 `server.js` 文件。
- `build`: 使用 Webpack 构建项目。
- `test`: 运行 Jest 测试套件。
- `lint`: 使用 ESLint 检查代码风格。

### 7.2.执行 npm 脚本

要执行一个 npm 脚本，可以在命令行中使用 `npm run <script-name>`。例如：

```bash
npm run start
npm run build
npm run test
npm run lint
```

对于一些常用的脚本（如 `start`, `test`），可以直接使用 `npm start` 或 `npm test` 来代替 `npm run`，这是 npm 的内置别名。

### 7.3.特殊脚本钩子

npm 支持一些特殊的生命周期事件，可以在特定时间点自动触发相关脚本。这些事件包括：

- `preinstall` 和 `postinstall`: 在安装依赖之前或之后执行。
- `prepublishOnly` 和 `postpublish`: 在发布包之前或之后执行（仅适用于 npm v7 及以上版本）。
- `prepublish`, `prepare`, `prepack`, `postpack`: 发布前的不同阶段。
- `prepublish` 已被弃用，建议使用 `prepare` 或 `prepublishOnly`。

例如，如果你想在每次安装依赖后自动运行 ESLint 检查代码风格，可以在 `package.json` 中添加如下配置：

```json
{
  "scripts": {
    "postinstall": "npm run lint"
  }
}
```

### 7.4.组合多个命令

你可以通过在单个脚本中使用分号 `;` 或者并行执行工具（如 `concurrently`）来组合多个命令。例如：

```json
{
  "scripts": {
    "dev": "concurrently \"npm run watch:css\" \"npm run start\"",
    "watch:css": "sass --watch src/styles:dist/styles"
  }
}
```

在这个例子中，`dev` 脚本会同时启动 CSS 编译监视器和应用程序服务器。

### 7.5.使用环境变量

可以通过 `.env` 文件或直接在命令中设置环境变量，以便根据不同的环境调整行为。例如：

```json
{
  "scripts": {
    "start": "NODE_ENV=production node server.js"
  }
}
```

或者结合像 `dotenv` 这样的库来加载环境变量文件：

```json
{
  "scripts": {
    "start": "dotenv -e .env.production -- node server.js"
  }
}
```

### 7.6.访问全局和本地二进制文件

npm 脚本会自动将 `node_modules/.bin` 目录添加到 PATH 环境变量中，因此你可以直接调用通过 `devDependencies` 安装的工具而无需指定完整路径。例如，如果你安装了 `eslint` 作为开发依赖，可以直接在脚本中使用 `eslint` 命令：

```json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

### 7.7.错误处理

默认情况下，如果脚本中的任何一个命令失败，整个脚本将会停止执行。你可以使用 `||` 操作符来忽略错误继续执行后续命令，或者使用 `&&` 来确保只有当上一个命令成功时才执行下一个命令。例如：

```json
{
  "scripts": {
    "prepublish": "npm run lint && npm run build"
  }
}
```

在这个例子中，如果 `npm run lint` 失败，则不会执行 `npm run build`。
