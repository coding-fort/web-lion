要将 Nginx 安装到指定目录 `/opt/nginx`，需要通过**源码编译**的方式安装（默认包管理器安装路径固定，无法自定义）。以下是详细步骤：

## **准备工作：安装依赖**

编译 Nginx 需要依赖一些工具和库，先通过包管理器安装：

### **Ubuntu/Debian 系统**

```bash
sudo apt update
sudo apt install -y build-essential libpcre3 libpcre3-dev zlib1g zlib1g-dev openssl libssl-dev
```

### **CentOS/RHEL 系统**

```bash
sudo yum install -y gcc gcc-c++ make pcre pcre-devel zlib zlib-devel openssl openssl-devel
```

## **步骤 1：下载 Nginx 源码**

1. 进入临时目录（如 `/tmp`）下载源码：

   ```bash
   cd /tmp
   # 从官网下载最新稳定版（以 1.25.3 为例，可替换为最新版本）
   wget http://nginx.org/download/nginx-1.25.3.tar.gz
   ```

2. 解压源码包：
   ```bash
   tar -zxvf nginx-1.25.3.tar.gz
   cd nginx-1.25.3  # 进入解压后的目录
   ```

## **步骤 2：配置编译参数（指定安装目录）**

使用 `./configure` 命令指定安装路径和启用必要模块（核心是 `--prefix` 参数）：

```bash
./configure \
  --prefix=/opt/nginx \  # 指定安装目录为 /opt/nginx
  --with-http_ssl_module \  # 启用 HTTPS 支持（可选，建议开启）
  --with-http_stub_status_module \  # 启用状态监控模块（可选）
  --with-pcre  # 启用 PCRE 正则支持（处理 URL 重写等）
```

- 若需精简模块，可去掉不需要的 `--with-xxx` 选项。
- 配置成功后，终端会显示总结信息（如安装路径、模块等）。
- 注意清除以上命令的注释和`\`后的空格。

## **步骤 3：编译并安装**

```bash
# 编译（-j 后面的数字为 CPU 核心数，加速编译，如 4 核则用 -j4）
make -j4

# 安装（将编译好的文件复制到 /opt/nginx 目录）
sudo make install
```

安装完成后，`/opt/nginx` 目录下会生成以下子目录：

- `sbin/`：存放 Nginx 主程序（`nginx` 可执行文件）
- `conf/`：配置文件目录（`nginx.conf` 主配置）
- `html/`：默认静态文件目录
- `logs/`：日志文件目录

## **步骤 4：验证安装**

```bash
# 查看安装目录结构
ls /opt/nginx

# 检查 Nginx 版本（确认安装路径正确）
/opt/nginx/sbin/nginx -v
```

输出类似 `nginx version: nginx/1.25.3` 即为成功。

## **步骤 5：启动与管理 Nginx**

### **启动 Nginx**

```bash
sudo /opt/nginx/sbin/nginx
```

### **验证启动**

- 查看进程：`ps -ef | grep nginx`
- 访问默认页面：浏览器输入服务器 IP，应显示 “Welcome to nginx!”（默认静态文件在 `/opt/nginx/html/index.html`）。

### **常用命令**

```bash
# 停止 Nginx
sudo /opt/nginx/sbin/nginx -s stop

# 优雅停止（处理完当前请求后停止）
sudo /opt/nginx/sbin/nginx -s quit

# 重新加载配置（热更新）
sudo /opt/nginx/sbin/nginx -s reload

# 检查配置文件语法
sudo /opt/nginx/sbin/nginx -t
```

## **步骤 6：设置系统服务（可选，方便管理）**

为了通过 `systemctl` 命令管理 Nginx（如开机自启），可创建系统服务文件：

1. 创建服务文件：

   ```bash
   sudo nano /etc/systemd/system/nginx.service
   ```

2. 写入以下内容（注意路径匹配 `/opt/nginx`）：

   ```ini
   [Unit]
   Description=Nginx server (installed in /opt/nginx)
   After=network.target

   [Service]
   Type=forking
   ExecStart=/opt/nginx/sbin/nginx
   ExecReload=/opt/nginx/sbin/nginx -s reload
   ExecStop=/opt/nginx/sbin/nginx -s quit
   PrivateTmp=true

   [Install]
   WantedBy=multi-user.target
   ```

3. 生效并设置开机自启：

   ```bash
   sudo systemctl daemon-reload  # 重载服务配置
   sudo systemctl enable nginx   # 开机自启
   sudo systemctl start nginx    # 启动服务
   ```

4. 验证服务状态：
   ```bash
   sudo systemctl status nginx
   ```

## **总结**

通过源码编译并指定 `--prefix=/opt/nginx`，即可将 Nginx 安装到目标目录。后续配置文件在 `/opt/nginx/conf/nginx.conf`，可参考之前的配置指南进行静态托管、反向代理等设置。若需升级 Nginx，只需重复上述步骤（下载新版本源码，重新编译安装到同一目录即可覆盖）。
