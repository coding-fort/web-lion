# Nginx 安装及配置

在基于 Debian/Ubuntu 的 Linux 发行版上安装 Nginx 非常直接。以下是具体步骤：

## 1. 更新软件包列表

首先，确保你的软件包数据库是最新的：

```bash
sudo apt update
```

## 2. 安装 Nginx

执行以下命令来安装 Nginx：

```bash
sudo apt install nginx
```

## 3. 启动并启用 Nginx 服务

安装完成后，启动 Nginx 服务，并设置为开机自启：

```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 4. 检查 Nginx 状态

你可以使用下面的命令来检查 Nginx 是否正常运行：

```bash
sudo systemctl status nginx
```

如果一切正常，你应该能看到 Nginx 正在运行的状态。

## 5. 配置防火墙以允许 Nginx 流量

在配置防火墙之前，请确认你的服务器已经安装了`ufw`（Uncomplicated Firewall）。如果没有安装，可以通过以下命令进行安装：

```bash
sudo apt install ufw
```

接下来，根据你的需求配置防火墙以允许 Nginx 流量。Nginx 安装后会注册一些 UFW 应用程序配置文件，包括：

- **Nginx Full**: 开放端口 80（HTTP）和 443（HTTPS）。
- **Nginx HTTP**: 只开放端口 80（HTTP）。
- **Nginx HTTPS**: 只开放端口 443（HTTPS）。

### 允许“Nginx Full”配置文件

如果你想同时支持 HTTP 和 HTTPS 流量，可以允许“Nginx Full”配置文件：

```bash
sudo ufw allow 'Nginx Full'
```

### 如果只想要允许 HTTP 或 HTTPS

- 只允许 HTTP：
  ```bash
  sudo ufw allow 'Nginx HTTP'
  ```
- 只允许 HTTPS：
  ```bash
  sudo ufw allow 'Nginx HTTPS'
  ```

## 6. 检查防火墙状态

最后，检查防火墙状态以确保规则已正确应用：

```bash
sudo ufw status
```

这将显示当前防火墙的所有规则。你应该能看到你刚刚添加的 Nginx 规则列在那里。

通过以上步骤，你就完成了 Nginx 的安装以及基本的防火墙配置，使得 Nginx 能够处理来自外部世界的请求。记得根据自己的实际需要调整防火墙设置，比如限制特定 IP 地址访问等高级功能。
