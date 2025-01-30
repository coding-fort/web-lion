# Node 进程管理工具安装说明

在使用 Node.js 开发或部署应用时，进程管理工具可以帮助你更好地管理应用程序的生命周期、日志记录、自动重启等功能。`PM2`是目前最流行的 Node.js 进程管理器之一。以下是关于如何安装和使用 PM2 来管理你的 Node.js 应用的详细说明。

## PM2 安装

## 前提条件

确保你已经在系统上安装了 Node.js 和 npm。如果尚未安装，请参照之前的指南进行安装。

## 安装 PM2

你可以通过 npm 全局安装 PM2：

```bash
sudo npm install -g pm2
```

安装完成后，可以通过以下命令检查是否安装成功以及查看 PM2 版本号：

```bash
pm2 -v
```

## 使用 PM2 管理 Node.js 应用

## 启动应用

假设你有一个简单的 Node.js 应用位于`app.js`文件中，可以使用以下命令启动它：

```bash
pm2 start app.js
```

这将启动你的 Node.js 应用，并由 PM2 进行管理。

## 查看应用状态

要查看所有由 PM2 管理的应用程序的状态，可以使用：

```bash
pm2 list
```

或者更详细的视图：

```bash
pm2 status
```

## 监控应用

PM2 提供了一个实时监控面板，可以用来观察 CPU 和内存使用情况等信息：

```bash
pm2 monit
```

## 日志管理

PM2 会自动生成并管理每个应用的日志文件。你可以使用以下命令查看特定应用的日志：

```bash
pm2 logs <app_name_or_id>
```

不加参数则显示所有应用的日志：

```bash
pm2 logs
```

## 自动重启与守护进程

PM2 可以在应用崩溃时自动重启它们，并且支持零停机时间更新（即在不中断服务的情况下重新部署应用）。使用如下命令可以让 PM2 在后台运行，并设置为开机自启：

```bash
pm2 startup
pm2 save
```

首先执行`pm2 startup`，根据提示操作完成系统级别的开机自启动配置；然后执行`pm2 save`以保存当前的进程列表，这样即使服务器重启后也能恢复所有的 PM2 托管进程。

## 部署应用

PM2 还支持简化部署流程的功能，允许你定义不同的环境（如开发、测试、生产）和远程服务器上的部署步骤。你需要创建一个`ecosystem.config.js`文件来配置这些设置，然后使用以下命令进行部署：

```bash
pm2 deploy ecosystem.config.js <environment> <command>
```

例如，部署到生产环境：

```bash
pm2 deploy ecosystem.config.js production deploy
```

以上就是使用 PM2 来管理和部署 Node.js 应用的基本指南。PM2 提供了丰富的功能，能够极大地简化 Node.js 应用的运维工作。根据你的具体需求，你可以探索更多高级特性，如负载均衡、集群模式等。
