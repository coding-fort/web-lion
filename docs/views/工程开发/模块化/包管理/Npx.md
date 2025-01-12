# Npx

`npx` 是 Node.js 环境中一个非常有用的命令行工具，它与 `npm`（Node Package Manager）紧密集成。`npx` 的主要功能是执行 npm 包（`node_modules 目录`）中的二进制文件，而无需事先全局安装这些包。这使得开发者可以方便地运行一次性命令或测试工具，而不必担心污染全局环境或管理多个版本的工具。

## 1.npx 的核心特性

### 1.1. **临时执行命令**

`npx` 允许你直接从 npm 注册表下载并执行某个包中的命令，而不需要提前安装该包。这对于偶尔使用的工具特别有用，比如构建工具、格式化工具等。

```bash
npx create-react-app my-app
```

这条命令会自动查找并运行 `create-react-app` 脚手架工具来创建一个新的 React 项目，而你不需要事先全局安装 `create-react-app`。

### 1.2. **本地优先**

如果你已经在项目中通过 `npm install` 安装了某个包，那么 `npx` 会优先使用本地版本，而不是从远程仓库下载。这保证了使用的是项目特定版本的工具，避免了由于全局安装不同版本导致的问题。

```bash
npx eslint .
```

假设你的项目已经安装了 ESLint，上述命令将使用本地版本的 ESLint 来检查当前目录下的代码。

### 1.3. **自动安装缺失依赖**

当 `npx` 发现所需的命令不存在时，它会自动为你安装必要的依赖项，并在完成后立即执行命令。这一行为简化了工作流程，尤其是在团队协作或 CI/CD 管道中。

```bash
npx @vue/cli create vue-project
# vue 命令在@vue/cli包中，所以通过-p 指定包名，再执行命令
npx -p @vue/cli vue create vue-project
```

如果 `@vue/cli` 没有被安装，`npx` 会先安装它再执行创建项目的命令。

### 1.4. **显示可用命令**

`npx` 还提供了一个选项来列出已安装包中的所有可执行命令，帮助你发现和探索新的工具。

```bash
npx --list-available
```

### 1.5. **指定版本**

你可以明确指定要使用的包版本，确保使用特定版本的工具进行开发或调试。

```bash
npx eslint@6.8.0 .
```

这行命令将使用 ESLint 的 6.8.0 版本来检查代码。

## 2.使用场景

- **脚手架工具**：如 `create-react-app`, `vue-cli` 等用于初始化新项目的工具。
- **构建工具**：例如 `webpack`, `parcel` 等构建和打包工具。
- **格式化和 lint 工具**：如 `prettier`, `eslint` 等用于代码风格检查和自动修复的工具。
- **测试框架**：像 `jest`, `mocha` 等用于编写和运行单元测试的工具。
- **CLI 应用程序**：任何提供命令行接口的应用程序都可以通过 `npx` 快速启动。

## 3.配合 npm scripts 使用

除了直接在终端中使用 `npx` 外，你还可以将其集成到 `package.json` 文件中的 `scripts` 字段里。这样做可以让团队成员更容易共享和复用常用命令。

```json
{
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "npx jest"
  }
}
```

在这个例子中，`npm test` 实际上会调用 `npx jest` 来运行测试套件。

<bwe>`scripts` 命令中，`npx` 可以省略。</bwe>

## 4.总结

`npx` 是一个强大且灵活的工具，极大地简化了 JavaScript 生态系统中的命令行操作。通过减少对全局安装包的需求，`npx` 提高了开发效率，降低了环境配置的复杂度，并促进了更加一致的工作流。无论是快速尝试新工具还是确保生产环境中的一致性，`npx` 都是一个不可或缺的好帮手。
