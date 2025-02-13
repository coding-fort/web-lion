# cnpm

`cnpm` 是一个针对中国大陆用户的 npm 镜像，它由淘宝团队维护。由于中国网络环境的特殊性（如国际网络连接速度较慢或不稳定），`cnpm` 提供了更快、更稳定的包下载体验。此外，`cnpm` 还集成了 `npm` 的所有功能，并在此基础上添加了一些额外的功能和优化。

## cnpm 的主要特点

### 1. **快速稳定的下载速度**

- **镜像加速**：`cnpm` 使用的是位于中国的服务器，因此可以显著提高包的下载速度。
- **CDN 支持**：通过 CDN 分发，进一步提升资源加载效率。

### 2. **兼容 npm**

- **命令行接口一致**：`cnpm` 的命令行接口与 `npm` 完全兼容，用户可以直接将 `npm` 命令替换为 `cnpm` 来使用。
- **支持所有 npm 功能**：包括安装、更新、发布等操作，确保开发者可以获得与官方 npm 相同的功能体验。

### 3. **额外特性**

- **自动解析 GitHub 地址**：对于依赖于 GitHub 上的包，`cnpm` 会尝试从国内镜像源获取资源，避免因访问国外站点而产生的问题。
- **内置淘宝 NPM 源**：默认配置为使用淘宝提供的 NPM 源，但用户也可以手动切换到其他源。
- **支持私有库**：除了公共仓库外，`cnpm` 还支持私有库的管理，方便企业级应用。

## 安装 cnpm

### 使用 npm 全局安装

最简单的方法是通过 npm 安装 `cnpm`：

```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
```

> 注意：上面的命令指定了 `--registry` 参数指向了 `https://registry.npmmirror.com`，这是另一个流行的中国镜像源。你可以根据需要选择不同的镜像源。

### 验证安装

安装完成后，可以通过以下命令验证是否安装成功：

```bash
cnpm -v
```

这将显示 `cnpm` 的版本号，确认安装无误。

## 使用 cnpm

一旦安装完成，你可以直接用 `cnpm` 替代 `npm` 来执行各种命令。例如：

```bash
# 初始化项目
cnpm init

# 安装依赖
cnpm install <package-name>

# 安装开发依赖
cnpm install <package-name> --save-dev

# 运行脚本
cnpm run <script-name>
```

## 配置 cnpm

如果你已经安装了 `cnpm` 并希望更改默认的注册表或其他配置项，可以通过以下命令进行设置：

```bash
# 设置默认注册表为淘宝 NPM 源
cnpm config set registry https://registry.npmmirror.com

# 查看当前配置
cnpm config list
```

## cnpm vs npm: 关键差异

| 特性         | npm              | cnpm                               |
| ------------ | ---------------- | ---------------------------------- |
| **下载速度** | 国际网络可能较慢 | 国内网络速度快且稳定               |
| **镜像源**   | 官方 npm 源      | 淘宝镜像源                         |
| **额外功能** | 无特别优化       | 自动解析 GitHub 地址、支持私有库等 |
| **安装方式** | 默认安装         | 需要额外安装                       |

## 总结

`cnpm` 是为中国开发者量身定制的一个 npm 镜像解决方案，它不仅提供了更快的包下载速度，还增加了一些实用的功能来适应本地化需求。对于在中国大陆工作的开发者来说，使用 `cnpm` 可以大大简化日常开发中的依赖管理任务，并提高工作效率。如果你还有更多关于 `cnpm` 的具体问题或需要进一步的帮助，请随时告诉我！
