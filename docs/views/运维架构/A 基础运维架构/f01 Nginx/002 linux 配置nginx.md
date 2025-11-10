在 Linux 系统中配置 Nginx 主要涉及安装、基础配置、虚拟主机、反向代理、负载均衡等操作。以下是详细的步骤指南：

## **一、安装 Nginx**

以 **Ubuntu/Debian** 和 **CentOS/RHEL** 为例，其他 Linux 发行版可参考官方文档。

### 1. Ubuntu/Debian 系统

```bash
# 更新包索引
sudo apt update

# 安装 Nginx
sudo apt install nginx

# 启动 Nginx 并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx

# 验证状态（显示 active (running) 即为成功）
sudo systemctl status nginx
```

### 2. CentOS/RHEL 系统

```bash
# 安装 EPEL 源（CentOS 默认不含 Nginx）
sudo yum install epel-release

# 安装 Nginx
sudo yum install nginx

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx

# 验证状态
sudo systemctl status nginx
```

### 3. 防火墙设置（可选）

若需通过公网访问，需开放 80（HTTP）和 443（HTTPS）端口：

```bash
# Ubuntu/Debian（使用 ufw）
sudo ufw allow 'Nginx Full'  # 允许 80 和 443 端口
sudo ufw reload

# CentOS/RHEL（使用 firewalld）
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

## **二、Nginx 核心目录与配置文件**

安装完成后，核心文件和目录路径如下（以 Ubuntu 为例，CentOS 路径类似，主要差异在 `/etc/nginx` 和 `/usr/share/nginx`）：

| 路径                          | 作用                                                    |
| ----------------------------- | ------------------------------------------------------- |
| `/etc/nginx/nginx.conf`       | 主配置文件                                              |
| `/etc/nginx/sites-available/` | 存放虚拟主机配置（默认不启用）                          |
| `/etc/nginx/sites-enabled/`   | 启用的虚拟主机配置（通过软链接指向 `sites-available`）  |
| `/etc/nginx/conf.d/`          | 额外配置片段（主配置会自动引入）                        |
| `/usr/share/nginx/html/`      | 默认静态文件目录（存放欢迎页）                          |
| `/var/log/nginx/`             | 日志目录（`access.log` 访问日志，`error.log` 错误日志） |

## **三、基础配置：静态网站托管**

以托管一个静态 HTML 网站为例，步骤如下：

### 1. 创建网站目录和测试文件

```bash
# 创建网站根目录（建议放在 /var/www/ 下）
sudo mkdir -p /var/www/mywebsite

# 创建测试页面
sudo echo "<h1>Hello, Nginx!</h1>" > /var/www/mywebsite/index.html

# 设置权限（避免 Nginx 无权限访问）
sudo chown -R www-data:www-data /var/www/mywebsite  # www-data 是 Nginx 默认运行用户
```

### 2. 创建虚拟主机配置文件

在 `sites-available` 目录下新建配置文件：

```bash
sudo nano /etc/nginx/sites-available/mywebsite
```

添加以下内容（根据实际需求修改）：

```nginx
server {
    listen 80;                  # 监听 80 端口（HTTP）
    server_name example.com;    # 绑定的域名（本地测试可写 localhost 或服务器 IP）

    root /var/www/mywebsite;    # 网站根目录
    index index.html index.htm; # 默认首页文件

    # 访问日志（可选）
    access_log /var/log/nginx/mywebsite_access.log;
    error_log /var/log/nginx/mywebsite_error.log;

    # 处理静态文件请求（默认规则）
    location / {
        try_files $uri $uri/ =404;  # 尝试访问文件，不存在则返回 404
    }
}
```

### 3. 启用配置并验证

```bash
# 创建软链接到 sites-enabled（启用配置）
sudo ln -s /etc/nginx/sites-available/mywebsite /etc/nginx/sites-enabled/

# 检查配置文件语法是否正确（关键步骤，避免配置错误导致 Nginx 启动失败）
sudo nginx -t

# 重载 Nginx 使配置生效（热更新，不中断服务）
sudo systemctl reload nginx
```

### 4. 测试访问

在浏览器中输入服务器 IP 或绑定的域名（如 `http://example.com` 或 `http://你的服务器IP`），应显示 `Hello, Nginx!`。

## **四、进阶配置：反向代理**

反向代理可将请求转发到后端应用服务器（如 Node.js、Python、Java 服务）。例如，将 `http://example.com/api` 转发到本地运行在 `3000` 端口的 Node.js 服务：

### 1. 修改虚拟主机配置

```bash
sudo nano /etc/nginx/sites-available/mywebsite
```

添加反向代理规则：

```nginx
server {
    listen 80;
    server_name example.com;

    # 静态文件仍由 Nginx 处理（如前端页面）
    root /var/www/mywebsite;
    index index.html;

    # 反向代理到后端 API 服务
    location /api {
        proxy_pass http://127.0.0.1:3000;  # 后端服务地址
        proxy_set_header Host $host;       # 传递原始域名
        proxy_set_header X-Real-IP $remote_addr;  # 传递客户端真实 IP
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 2. 重载配置

```bash
sudo nginx -t
sudo systemctl reload nginx
```

此时访问 `http://example.com/api` 会自动转发到 `127.0.0.1:3000`。

## **五、进阶配置：负载均衡**

当后端有多个相同服务（如 3 台 Node.js 服务器），可通过 Nginx 实现负载均衡，分发请求减轻单点压力。

### 1. 在 `nginx.conf` 或单独配置文件中定义后端服务组

```bash
sudo nano /etc/nginx/conf.d/loadbalance.conf
```

添加以下内容：

```nginx
# 定义后端服务器组（名称自定义，如 myapp）
upstream myapp {
    server 127.0.0.1:3000;  # 后端服务器 1
    server 127.0.0.1:3001;  # 后端服务器 2
    server 192.168.1.10:3000;  # 局域网内其他服务器
    # 可选策略：默认轮询，可添加 weight=2 调整权重（如 server 127.0.0.1:3000 weight=2;）
}

# 虚拟主机配置，转发请求到 myapp 组
server {
    listen 80;
    server_name example.com;

    location / {
        proxy_pass http://myapp;  # 转发到 upstream 定义的服务组
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 2. 重载配置

```bash
sudo nginx -t
sudo systemctl reload nginx
```

此时请求会按默认的「轮询」策略分发到后端服务器，也可通过 `ip_hash`（按客户端 IP 固定分发）、`weight`（权重）等调整策略。

## **六、常用 Nginx 命令**

```bash
# 启动
sudo systemctl start nginx

# 停止
sudo systemctl stop nginx

# 重启（会中断服务，建议用 reload）
sudo systemctl restart nginx

# 重载配置（热更新）
sudo systemctl reload nginx 或 sudo nginx -s reload

# 检查配置语法
sudo nginx -t

# 查看 Nginx 版本
nginx -v

# 查看运行状态
sudo systemctl status nginx
```

## **七、注意事项**

1. **配置语法**：Nginx 配置文件对语法严格（如分号结尾、括号匹配），修改后务必用 `nginx -t` 检查。
2. **权限问题**：确保 Nginx 运行用户（如 `www-data`）对网站目录和文件有读取权限。
3. **日志排查**：若出现 403、502 等错误，可查看 `/var/log/nginx/error.log` 定位问题。
4. **HTTPS 配置**：如需启用 HTTPS，需申请 SSL 证书（如 Let's Encrypt），并在配置中添加 `listen 443 ssl;` 及证书路径（参考官方文档）。

通过以上步骤，可完成 Nginx 从基础到进阶的配置，满足静态托管、反向代理、负载均衡等常见需求。
