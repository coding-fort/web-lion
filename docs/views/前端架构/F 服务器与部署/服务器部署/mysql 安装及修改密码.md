# mysql 安装及修改密码

在基于 Debian/Ubuntu 的 Linux 系统上安装 MySQL 并修改默认密码的过程如下：

## MySQL 安装

1. **更新软件包列表**：

   ```bash
   sudo apt update
   ```

2. **安装 MySQL 服务器**：

   ```bash
   sudo apt install mysql-server
   ```

   在安装过程中，可能会提示你设置 root 用户的密码。如果没有提示，可以在安装完成后手动进行安全配置。

3. **启动并启用 MySQL 服务**：
   MySQL 服务通常会在安装后自动启动。为了确保它正在运行，并设置为随系统启动而自动启动，可以使用以下命令：

   ```bash
   sudo systemctl start mysql
   sudo systemctl enable mysql
   ```

4. **运行 MySQL 安全脚本**：
   为了提高安全性，建议运行 MySQL 自带的安全脚本`mysql_secure_installation`。这将引导你完成一系列选项设置，如设置 root 密码、移除匿名用户、禁止 root 远程登录等。
   ```bash
   sudo mysql_secure_installation
   ```

## 修改 MySQL root 用户密码

如果你已经通过`mysql_secure_installation`设置了 root 密码，那么无需再次修改。如果没有设置或者需要更改现有密码，可以按照以下步骤操作：

### 方法一：通过 MySQL 命令行工具

1. **以 root 身份登录 MySQL**：
   如果你之前没有设置过密码或知道当前密码，可以使用如下命令登录 MySQL（如果设置了密码，则需要用`-p`参数并输入密码）：

   ```bash
   sudo mysql -u root -p
   ```

2. **修改 root 用户密码**：
   登录到 MySQL 后，执行以下 SQL 语句来更改 root 用户的密码：

   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
   FLUSH PRIVILEGES;
   ```

   注意替换`新密码`为你想要设置的新密码。

3. **退出 MySQL**：
   执行以下命令退出 MySQL 命令行界面：
   ```sql
   exit;
   ```

### 方法二：忘记 root 密码时重置

如果你忘记了 root 密码并且无法登录，可以按照以下步骤重置密码：

1. **停止 MySQL 服务**：

   ```bash
   sudo systemctl stop mysql
   ```

2. **跳过权限表启动 MySQL**：
   使用`--skip-grant-tables`选项启动 MySQL，这样可以不需要密码直接访问数据库：

   ```bash
   sudo mysqld_safe --skip-grant-tables &
   ```

3. **登录 MySQL 并重置密码**：
   现在可以直接登录 MySQL（无需密码），然后重置 root 用户的密码：

   ```bash
   sudo mysql -u root
   ```

   在 MySQL 命令行中执行：

   ```sql
   USE mysql;
   UPDATE user SET authentication_string=PASSWORD('新密码') WHERE User='root';
   FLUSH PRIVILEGES;
   exit;
   ```

   注意：对于 MySQL 5.7 及以上版本，请使用`ALTER USER`语法而不是直接更新`authentication_string`字段。

4. **正常重启 MySQL 服务**：
   关闭之前用`--skip-grant-tables`启动的 MySQL 实例，并正常重启 MySQL 服务：
   ```bash
   sudo pkill mysqld
   sudo systemctl start mysql
   ```

现在，你应该能够使用新的密码登录 MySQL 了。记得选择一个强密码，并妥善保管好它。
