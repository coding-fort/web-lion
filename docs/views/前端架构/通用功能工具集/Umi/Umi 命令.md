# Umi 命令

`Umi.js` 提供了一套命令行工具，用于简化项目的创建、开发、构建和部署流程。这些命令通过 `umi` 或 `umi3`（取决于你安装的版本）来执行。以下是常用的 `Umi.js` 命令及其功能介绍。

## 安装 Umi

首先确保你已经全局安装了 `Umi`：

```bash
npm install -g umi
# 或者使用 yarn
yarn global add umi
```

如果你使用的是 `Umi 3.x` 版本，推荐使用 `@umijs/create-umi` 来创建新项目：

```bash
npx @umijs/create-umi my-app
cd my-app
```

## 常用命令

### 1. 创建新项目

使用 `@umijs/create-umi` 创建新的 Umi 项目：

```bash
npx @umijs/create-umi my-app
```

这将引导你完成一系列问题以初始化一个新的 Umi 项目。

### 2. 启动开发服务器

启动本地开发服务器，自动打开浏览器并监听文件变化：

```bash
umi dev
```

或在项目根目录下运行：

```bash
npm start
# 或者
yarn start
```

### 3. 构建生产环境代码

构建优化后的生产环境代码到 `dist` 目录：

```bash
umi build
```

或在项目根目录下运行：

```bash
npm run build
# 或者
yarn build
```

### 4. 预览构建结果

构建后可以在本地预览生成的静态文件：

```bash
umi preview
```

### 5. 测试

运行单元测试或集成测试（如果配置了相应的测试框架如 Jest）：

```bash
umi test
```

或在项目根目录下运行：

```bash
npm test
# 或者
yarn test
```

### 6. 插件管理

添加插件到你的 Umi 项目中：

```bash
umi plugin install <plugin-name>
```

卸载插件：

```bash
umi plugin uninstall <plugin-name>
```

列出已安装的插件：

```bash
umi plugin list
```

### 7. 生成器

使用内置或自定义的生成器快速创建组件、页面等：

```bash
umi g [component|page|model|layout] <name>
```

例如，生成一个名为 `User` 的页面：

```bash
umi g page User
```

### 8. 分析打包体积

分析打包后的文件大小，帮助优化应用性能：

```bash
umi analyze
```

### 9. 更新依赖

更新 Umi 及其相关依赖到最新版本：

```bash
umi update
```

### 10. 打包前清理

在构建之前清理旧的构建输出：

```bash
umi clean
```

## 其他命令

- **`umi help`**：显示所有可用命令的帮助信息。
- **`umi version`**：查看当前使用的 Umi 版本。

## 总结

`Umi.js` 的命令行工具提供了丰富的命令来支持从项目创建到部署的整个开发周期。熟练掌握这些命令可以帮助你更高效地管理和维护项目。
