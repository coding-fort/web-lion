# Node 安装

为了帮助你顺利安装 Node.js，以下是一个详细的指南。我们将介绍如何在基于 Debian/Ubuntu 的 Linux 系统上安装 Node.js。这个过程包括使用 NodeSource 仓库来获取最新的稳定版本。

## 使用 NodeSource 二进制分发库安装 Node.js

1. **更新软件包列表**：首先确保你的软件包数据库是最新的。

   ```bash
   sudo apt update
   ```

2. **安装依赖工具**：为了添加 NodeSource 仓库，你需要一些额外的软件包，如`curl`和`software-properties-common`。

   ```bash
   sudo apt install curl software-properties-common
   ```

3. **添加 NodeSource 仓库**：

   - 选择适合你需要的 Node.js 版本。这里以 Node.js 14.x 为例。你可以根据需要替换为其他版本（例如`setup_16.x`代表 Node.js 16.x）。
   - 执行以下命令来添加 NodeSource 仓库并安装 Node.js：
     ```bash
     curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
     ```
   - 这个命令会自动设置好一切，以便可以从 NodeSource 仓库安装指定版本的 Node.js。

4. **安装 Node.js**：现在可以使用`apt`命令来安装 Node.js 了。

   ```bash
   sudo apt install nodejs
   ```

5. **验证安装**：安装完成后，可以通过下面的命令检查 Node.js 和 npm（Node.js 的包管理器）是否正确安装。
   ```bash
   node -v
   npm -v
   ```
   这两条命令将分别显示已安装的 Node.js 和 npm 的版本号。

## 其他安装方法

- **通过官方仓库安装**：Ubuntu 官方仓库也提供了 Node.js，但是可能不是最新版本。如果你不特别需要最新的特性，也可以直接从官方仓库安装：

  ```bash
  sudo apt install nodejs npm
  ```

  注意，这种方法安装的版本可能较旧，并且不一定包含所有新功能或安全更新。

- **使用 nvm（Node Version Manager）**：nvm 允许你在同一台机器上轻松安装和切换多个 Node.js 版本。这对于开发者来说非常有用，特别是当你需要针对不同项目使用不同版本的 Node.js 时。
  1. 首先安装 nvm：
     ```bash
     curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
     ```
     安装完成后，重新加载你的 shell 环境，或者重新打开终端窗口。
  2. 使用 nvm 安装 Node.js：
     ```bash
     nvm install node # 安装最新版
     # 或者指定版本安装
     nvm install 14.17.0
     ```

通过以上步骤，你应该能够成功地在 Linux 系统上安装 Node.js。记得根据自己的需求选择合适的安装方法。无论是开发还是生产环境，选择最适合你的方案都是非常重要的。
