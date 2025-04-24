# nvm

`nvm`（Node Version Manager）是一个用于管理多个 Node.js 版本的工具，允许用户轻松安装、切换和卸载不同版本的 Node.js。以下是 `nvm` 的常用命令速查表，帮助你快速掌握如何使用 `nvm` 来管理 Node.js 环境。

## 安装与配置

### 安装 nvm

- **macOS/Linux**：

  - 使用官方安装脚本：
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    ```
  - 或者：
    ```bash
    wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
    ```

- **Windows**：可以使用 [nvm-windows](https://github.com/coreybutler/nvm-windows)。

### 加载 nvm

安装完成后，你需要重新加载 shell 配置文件（如 `.bashrc`, `.zshrc`），或者直接在当前终端会话中运行：

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

## 基本命令

### 查看可用命令

```bash
nvm help
```

### 列出所有可安装的 Node.js 版本

```bash
nvm ls-remote
```

### 列出已安装的 Node.js 版本

```bash
nvm ls
```

### 安装特定版本的 Node.js

```bash
nvm install <version>
```

例如，安装最新 LTS 版本：

```bash
nvm install --lts
```

### 切换 Node.js 版本

```bash
nvm use <version>
```

例如，切换到 v14.17.0：

```bash
nvm use 14.17.0
```

### 设置默认 Node.js 版本

```bash
nvm alias default <version>
```

例如，设置默认版本为 v16.13.0：

```bash
nvm alias default 16.13.0
```

### 卸载特定版本的 Node.js

```bash
nvm uninstall <version>
```

例如，卸载 v12.22.0：

```bash
nvm uninstall 12.22.0
```

## 进阶命令

### 查看当前使用的 Node.js 版本

```bash
nvm current
```

### 检查是否有新版本的 nvm 可用

```bash
nvm check-latest-nvm
```

### 更新 nvm

```bash
nvm install-latest-npm
```

注意：这实际上更新的是 npm 而不是 nvm。要更新 nvm 本身，通常需要重新运行安装脚本。

### 安装并使用最新的稳定版 Node.js

```bash
nvm install node --reinstall-packages-from=node
```

这条命令不仅会安装最新的稳定版 Node.js，还会从当前版本复制全局安装的包。

### 创建别名

你可以为常用的 Node.js 版本创建别名，方便快速切换：

```bash
nvm alias <alias-name> <version>
```

例如，创建一个名为 `stable` 的别名指向最新的稳定版：

```bash
nvm alias stable node
```

然后可以通过以下命令使用该别名：

```bash
nvm use stable
```

### 删除别名

```bash
nvm unalias <alias-name>
```

例如，删除名为 `stable` 的别名：

```bash
nvm unalias stable
```

## 版本管理策略

### 自动切换 Node.js 版本

如果你希望在进入某个项目目录时自动切换到该项目所需的 Node.js 版本，可以在项目根目录下创建一个 `.nvmrc` 文件，并指定版本号：

```plaintext
# .nvmrc
14.17.0
```

然后，在进入项目目录时运行：

```bash
nvm use
```

这将根据 `.nvmrc` 文件中的版本号自动切换 Node.js 版本。

## 总结

`nvm` 是一个非常实用的工具，它简化了 Node.js 版本的管理和切换过程。通过上述命令，你可以轻松地安装、切换和管理多个 Node.js 版本，确保开发环境的一致性和灵活性。如果你还有更多关于 `nvm` 的具体问题或需要进一步的帮助，请随时告诉我！
