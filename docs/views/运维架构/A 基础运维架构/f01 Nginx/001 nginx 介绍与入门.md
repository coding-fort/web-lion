Nginx（发音为“engine-x”）是一款高性能的**HTTP 服务器、反向代理服务器**，同时也支持邮件代理、负载均衡等功能。它由俄罗斯程序员 Igor Sysoev 开发，2004 年首次公开，以**轻量级、高并发、低内存占用**著称，目前被广泛用于互联网服务（如大型网站、API 网关、负载均衡节点等）。

## **一、Nginx 的核心特点**

1. **高性能**

   - 采用**异步非阻塞 I/O 模型**（epoll/kqueue），能高效处理数万甚至数十万并发连接，远超传统的 Apache（同步多进程模型）。
   - 内存占用极低，在高并发下仍能保持稳定。

2. **功能丰富**

   - 作为 HTTP 服务器：支持静态资源（HTML、CSS、图片等）托管、虚拟主机、URL 重写、Gzip 压缩等。
   - 作为反向代理：可转发请求到后端应用服务器（如 Java、Python、Node.js 服务），隐藏后端服务细节，提高安全性。
   - 负载均衡：将请求分发到多个后端服务器，避免单点压力过大，提高服务可用性。
   - 其他：支持 SSL/TLS 加密（HTTPS）、缓存、访问控制、日志记录等。

3. **高可靠性**

   - 采用多进程模型（master+worker），单个 worker 进程崩溃不影响整体服务，master 进程会自动重启新的 worker。
   - 配置支持热加载（`nginx -s reload`），无需停止服务即可更新配置。

4. **跨平台**
   - 支持 Linux、Windows、macOS 等主流操作系统，但生产环境中多部署在 Linux 上（Windows 版本功能有限）。

## **二、Nginx 的应用场景**

- **静态资源服务器**：直接托管网站的静态文件（如前端项目），效率远高于应用服务器。
- **反向代理**：例如，用户请求先到 Nginx，再由 Nginx 转发到后端的 Tomcat、Django 等服务，实现“前端 Nginx+后端应用”的架构。
- **负载均衡**：当后端有多个相同服务（如 3 台 Tomcat），Nginx 可按策略（轮询、权重、IP 哈希等）分配请求，实现负载分担。
- **API 网关**：统一接收客户端请求，进行鉴权、限流、日志记录后，再转发到对应微服务。
- **HTTPS 终结**：Nginx 处理 SSL/TLS 加密解密，减轻后端服务的计算压力。

## **三、Nginx 入门：安装与基本使用**

### **1. 安装 Nginx**

- **Linux（以 Ubuntu 为例）**：

  ```bash
  sudo apt update
  sudo apt install nginx  # 安装完成后自动启动
  ```

- **macOS（使用 Homebrew）**：

  ```bash
  brew install nginx
  ```

- **Windows**：  
  从 [Nginx 官网](http://nginx.org/) 下载压缩包，解压后即可使用（目录结构与 Linux 类似）。

### **2. 验证安装**

- 启动 Nginx（部分系统安装后默认启动）：

  ```bash
  # Linux/macOS
  sudo nginx  # 启动
  # Windows：在解压目录下执行 nginx.exe
  ```

- 访问默认页面：打开浏览器，输入 `http://localhost` 或服务器 IP，若看到 “Welcome to nginx!” 页面，说明安装成功。

### **3. 核心目录与配置文件**

Nginx 的核心配置文件是 `nginx.conf`，不同系统的路径略有差异：

- Linux：`/etc/nginx/nginx.conf`
- macOS（Homebrew）：`/usr/local/etc/nginx/nginx.conf`
- Windows：解压目录下的 `conf/nginx.conf`

**目录结构（以 Linux 为例）**：

```
/etc/nginx/
├── nginx.conf          # 主配置文件
├── sites-available/    # 存放虚拟主机配置（默认不启用）
├── sites-enabled/      # 启用的虚拟主机配置（通过软链接指向sites-available）
├── conf.d/             # 额外配置片段（主配置文件会引入这里的文件）
└── html/               # 默认静态文件目录（存放Welcome页面）
```

### **4. 基本配置解析（nginx.conf）**

主配置文件大致分为以下几部分（简化版）：

```nginx
# 全局配置（影响整个Nginx服务）
user www-data;  # 运行Nginx的用户
worker_processes auto;  # worker进程数（建议设为CPU核心数）
error_log /var/log/nginx/error.log;  # 错误日志路径

# 事件模块（影响网络连接）
events {
    worker_connections 1024;  # 单个worker最大并发连接数
}

# HTTP模块（核心，处理HTTP请求）
http {
    include /etc/nginx/mime.types;  # 支持的文件类型
    default_type application/octet-stream;

    # 日志格式定义
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';
    access_log /var/log/nginx/access.log main;  # 访问日志路径

    sendfile on;  # 启用高效文件传输模式
    keepalive_timeout 65;  # 长连接超时时间

    # 虚拟主机配置（可多个）
    server {
        listen 80;  # 监听端口
        server_name localhost;  # 域名（多个用空格分隔）
        root /var/www/html;  # 静态文件根目录
        index index.html index.htm;  # 默认首页

        # 访问根路径时的处理
        location / {
            try_files $uri $uri/ =404;  # 尝试访问文件，不存在则返回404
        }
    }

    # 其他配置（如反向代理、负载均衡等）
}
```

### **5. 常用命令**

```bash
nginx -s stop        # 强制停止
nginx -s quit        # 优雅停止（处理完当前请求后停止）
nginx -s reload      # 重新加载配置（热更新）
nginx -t             # 检查配置文件语法是否正确
nginx -v             # 查看版本
```

## **四、入门示例：实现两个基础功能**

### **示例 1：托管静态网站**

1. 创建静态文件目录并添加页面：

   ```bash
   mkdir -p /var/www/my site
   echo "<h1>My First Nginx Site</h1>" > /var/www/my site/index.html
   ```

2. 修改配置（在 `http` 块中添加一个 `server`）：

   ```nginx
   server {
       listen 8080;  # 监听8080端口
       server_name localhost;
       root /var/www/my site;  # 指向静态文件目录
       index index.html;
   }
   ```

3. 检查配置并生效：

   ```bash
   sudo nginx -t  # 检查语法
   sudo nginx -s reload  # 重载配置
   ```

4. 访问验证：浏览器输入 `http://localhost:8080`，应显示 “My First Nginx Site”。

### **示例 2：反向代理到后端服务**

假设本地有一个运行在 `127.0.0.1:3000` 的 Node.js 服务，通过 Nginx 转发请求：

1. 在 `http` 块中添加配置：

   ```nginx
   server {
       listen 80;
       server_name api.example.com;  # 假设的域名（本地可修改hosts模拟）

       location / {
           proxy_pass http://127.0.0.1:3000;  # 转发到后端服务
           proxy_set_header Host $host;  # 传递原始Host头
           proxy_set_header X-Real-IP $remote_addr;  # 传递客户端真实IP
       }
   }
   ```

2. 重载配置后，访问 `http://api.example.com` 会自动转发到 `127.0.0.1:3000`。

## **五、学习资源**

- **官方文档**：[nginx.org/en/docs/](http://nginx.org/en/docs/)（最权威的配置参考）
- **实战场景**：深入学习负载均衡（`upstream` 模块）、HTTPS 配置（`ssl` 模块）、缓存策略等。

Nginx 的入门门槛较低，核心是理解配置文件的结构和常用指令，通过实际场景练习（如部署前端项目、代理后端服务）能快速掌握其用法。
