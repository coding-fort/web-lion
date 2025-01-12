# Yarn

Yarn 是一个快速、可靠且安全的依赖管理工具，最初由 Facebook 开发并开源。它旨在解决 npm 在性能和一致性方面的一些局限性，提供更快的安装速度、更可靠的依赖解析以及更好的安全性。以下是关于如何使用 Yarn 管理器来管理和优化前端项目的详细指南。

## 1. **安装 Yarn**

### 使用 npm 安装

如果你已经安装了 Node.js 和 npm，可以通过以下命令全局安装 Yarn：

```bash
npm install --global yarn
```

### 使用官方安装脚本（推荐）

对于 macOS 和 Linux 用户，可以使用官方提供的安装脚本来安装最新版本的 Yarn：

```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

对于 Windows 用户，可以从 [Yarn 官方网站](https://classic.yarnpkg.com/en/docs/install#windows-stable) 下载安装程序。

## 2. **初始化项目**

在项目根目录下运行 `yarn init` 来创建一个新的 `package.json` 文件。这将引导你完成一系列问题，以定义项目的初始配置。

```bash
yarn init
```

## 3. **添加依赖**

### 安装生产依赖

```bash
yarn add <package-name>
```

例如：

```bash
yarn add react react-dom
```

### 安装开发依赖

```bash
yarn add <package-name> --dev
```

例如：

```bash
yarn add eslint --dev
```

### 安装特定版本

如果你想安装某个特定版本的包，可以在包名后面指定版本号：

```bash
yarn add lodash@4.17.21
```

### 安装全局包

虽然 Yarn 主要用于本地项目依赖管理，但也可以用来安装全局包：

```bash
yarn global add <package-name>
```

例如：

```bash
yarn global add create-react-app
```

## 4. **安装所有依赖**

当你克隆了一个现有的项目或修改了 `package.json` 文件后，可以使用 `yarn` 命令来安装所有列出的依赖项：

```bash
yarn
```

这相当于 `npm install`，但它通常更快，并且会生成一个 `yarn.lock` 文件来锁定确切的依赖版本。

## 5. **移除依赖**

要移除不再需要的包，可以使用 `remove` 命令：

```bash
yarn remove <package-name>
```

例如：

```bash
yarn remove lodash
```

## 6. **更新依赖**

Yarn 提供了多种方式来更新依赖项：

- **升级到最新的次要或补丁版本**：使用 `yarn upgrade` 命令。

  ```bash
  yarn upgrade
  ```

- **升级到最新的稳定版本**：使用 `yarn upgrade-interactive` 可以交互式地选择要升级的包及其版本。

- **升级单个包**：可以直接指定包名来更新。

  ```bash
  yarn upgrade <package-name>
  ```

## 7. **Yarn 锁定文件 (`yarn.lock`)**

`yarn.lock` 文件记录了每个依赖的确切版本，确保所有开发者在不同环境中使用相同的依赖版本。这是 Yarn 的一个重要特性，有助于避免因不同版本导致的问题。

- **不要手动编辑** `yarn.lock` 文件；它应该由 Yarn 自动生成和维护。
- **提交到版本控制系统**：确保将 `yarn.lock` 文件包含在你的 Git 或其他 VCS 中，以便团队成员共享一致的依赖环境。

## 8. **工作区支持**

对于大型项目或 monorepos（多包仓库），Yarn 支持工作区功能，允许在一个命令中同时管理多个包。通过在 `package.json` 中定义 `workspaces` 字段，你可以轻松处理多个子项目。

```json
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

然后可以使用类似 `yarn workspaces run build` 的命令来对所有工作区执行构建任务。

## 9. **插件与扩展**

Yarn 拥有一个活跃的社区，提供了丰富的插件和扩展，可以进一步增强其功能。例如，`yarn-plugin-version` 可以简化版本管理流程。

## 10. **常见命令速查表**

| 命令                                            | 描述                                              |
| ----------------------------------------------- | ------------------------------------------------- | --- |
| 初始化                                          |                                                   |
| `yarn init [--yes/-y] [--exact/-E]`             | 初始化新项目                                      |
| 安装                                            |                                                   |
| `yarn`                                          | 安装所有依赖（yarn.lock 文件）                    |
| `yarn install [--production/--prod]`            | 安装所有依赖（package.json 文件）                 |
| `yarn global add <pkg>`                         | 全局安装依赖                                      |
| `yarn add [--dev/-D] [--peer/-P] [--global/-G]` | 添加依赖                                          |
| `yarn [global] add <pkg> [--dev/-D]`            | 添加依赖，global 为全局，--dev 为开发依赖         |     |
| 查询                                            |                                                   |
| `yarn info <pkg> [<field>]`                     | 查询包信息，field 查询字段，version-查询所有版本  |
| `yarn list [--depth=<n>] [--pattern=<pattern>]` | 查看所有依赖版本                                  |
| `yarn [global] bin`                             | 查看 yarn bin 目录                                |
| 更新                                            |                                                   |
| `yarn outdated`                                 | 查询哪些包需要更新                                |
| `yarn [global] upgrade`                         | 升级所有依赖                                      |
| `yarn [global] upgrade <pkg>`                   | 升级指定依赖                                      |
| 卸载                                            |                                                   |
| `yarn remove <pkg>`                             | 移除依赖                                          |
| 运行                                            |                                                   |
| `yarn run <script>`                             | 执行脚本，start、stop、test 可以省略 run          |
| `yarn workspace <workspace-name> <command>`     | 在特定工作区中运行命令                            |
| `yarn check`                                    | 验证 package.json 的依赖记录和 yarn.lock 是否一致 |
| `yarn audit`                                    | 检查安装的包有哪些已知漏洞                        |
| `yarn why <pkg>`                                | 检查包在哪个依赖树中被引用                        |
| `yarn create <pkg>`                             | 创建一个新项目                                    |

<bwe>`yarn audit`漏洞级别<br/>
<infob>INFO-信息级别</infob>， <sucb>LOW-低级别</sucb>，<prib>MODERATE-中级别</prib>，<warnb>HIGH-高级别</warnb>，<errb>CRITICAL-严重级别</errb>
</bwe>

<bwe>`yarn create`</bwe>

```bash
yarn create react-app my-app
# 等价于
yarn global add create-react-app
create-react-app my-app
```

## 总结

Yarn 是一个强大且灵活的依赖管理工具，它不仅提升了 npm 的性能和可靠性，还引入了许多有用的功能，如锁定文件、工作区支持等。通过采用 Yarn，开发者可以更加高效地管理项目依赖，确保团队协作时的一致性和稳定性。如果你有更多关于 Yarn 的具体问题或需要进一步的帮助，请随时告诉我！
