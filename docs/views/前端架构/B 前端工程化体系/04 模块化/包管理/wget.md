# wget

`wget` 是一个非交互式的网络下载工具，支持 HTTP、HTTPS 和 FTP 协议。它可以在命令行中运行，并且非常适合脚本和自动化任务。`wget` 的主要特点是能够稳定可靠地下载文件，即使在网络条件不佳的情况下也能通过断点续传来完成下载。

## wget 的主要特点

- **非交互式**：无需用户干预即可完成下载任务。
- **支持多种协议**：包括 HTTP、HTTPS、FTP 等。
- **断点续传**：如果下载中断，可以从中断的地方继续下载。
- **递归下载**：可以下载整个网站或目录结构。
- **后台下载**：允许将下载任务放到后台执行。
- **代理支持**：可以通过配置使用代理服务器进行下载。
- **输出控制**：可以指定日志文件，静默模式等。
- **镜像站点**：创建完整的离线副本。

## 基本用法

### 下载单个文件

```bash
wget http://example.com/file.zip
```

这会从指定 URL 下载文件并保存为 `file.zip`。

### 下载文件并重命名

```bash
wget -O newname.zip http://example.com/file.zip
```

此命令会下载文件并将其保存为 `newname.zip`。

### 断点续传

```bash
wget -c http://example.com/largefile.iso
```

如果之前的下载被中断，可以使用 `-c` 选项从中断处继续下载。

### 后台下载

```bash
wget -b http://example.com/file.zip
```

这会将下载任务放到后台执行，并在当前终端显示 PID（进程 ID）以便监控。

### 查看下载进度

当使用 `-b` 选项时，可以通过查看日志文件来跟踪下载进度：

```bash
wget -bqc http://example.com/file.zip
tail -f wget-log
```

### 设置最大重试次数

有时下载可能会因为网络问题而失败，可以设置最大重试次数：

```bash
wget --tries=10 http://example.com/file.zip
```

### 限制下载速度

为了不影响其他网络活动，可以限制 `wget` 的下载速度：

```bash
wget --limit-rate=200k http://example.com/file.zip
```

这会将下载速度限制为每秒 200KB。

## 高级用法

### 递归下载整个网站

```bash
wget --mirror --convert-links --adjust-extension --page-requisites --no-parent http://example.com/
```

- `--mirror`：启用镜像模式，等同于 `-r -N -l inf --no-remove-listing`。
- `--convert-links`：转换链接为相对路径，以便离线浏览。
- `--adjust-extension`：根据内容类型添加适当的文件扩展名。
- `--page-requisites`：下载所有必要的文件（如图片、CSS）以正确显示网页。
- `--no-parent`：不递归到父目录。

### 使用代理服务器

```bash
wget --proxy=on --proxy-user=user --proxy-password=pass -e use_proxy=yes -e http_proxy=http://proxy.example.com:8080 http://example.com/file.zip
```

### 下载多个文件

可以将多个 URL 放入一个文本文件中，然后使用 `-i` 选项批量下载：

```bash
wget -i url-list.txt
```

其中 `url-list.txt` 文件的内容可能是这样的：

```
http://example.com/file1.zip
http://example.com/file2.zip
http://example.com/file3.zip
```

### 发送自定义请求头

```bash
wget --header="User-Agent: MyCustomUA" --header="Referer: http://example.com/" http://example.com/file.zip
```

### POST 请求

```bash
wget --post-data 'param1=value1&param2=value2' http://example.com/script.cgi
```

或者发送数据来自文件：

```bash
wget --post-file=data.txt http://example.com/script.cgi
```

## 实际应用示例

假设你需要定期备份某个在线资源库中的文件，可以编写一个简单的 Bash 脚本来完成这项工作：

```bash
#!/bin/bash

# 定义要下载的URL列表文件和目标目录
URL_LIST="urls-to-backup.txt"
TARGET_DIR="/path/to/backup"

# 创建目标目录（如果不存在）
mkdir -p "$TARGET_DIR"

# 进入目标目录
cd "$TARGET_DIR"

# 使用wget批量下载文件
wget -i "$URL_LIST" -c --timestamping
```

在这个例子中，我们使用了 `-c` 选项来支持断点续传，并且使用了 `--timestamping` 来确保只有更新过的文件会被重新下载。这只是一个简单的示例，实际应用中可以根据需求进一步扩展和优化。

## 总结

`wget` 是一个强大且灵活的命令行下载工具，适用于各种网络编程和系统管理任务。它的简单易用性和广泛的协议支持使其成为开发者工具箱中的必备工具之一。如果你还有更多关于 `wget` 的具体问题或需要进一步的帮助，请随时告诉我！
