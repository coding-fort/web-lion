# Git

## github api

[https://developer.github.com/v3/](https://developer.github.com/v3/)

## 为什么要 Git 规范？

在实际开发中，无论是 Git 版本的规范，还是 Git Commit 的规范，都是一环较重要的部分，因为他们绝对是大有裨益的；

- 方便跟踪工程历史；
- 方便快速回溯代码；
- 方便 Code Review；
- 方便生成 CHANGELOG；
- 提高项目的整体质量，提高个人工程素质；

## 如何去做 Git 规范？

版本规范其实有许多种工作流形式，有 Git flow，有集中式工作流，有功能分支工作流；
这里主要说一下较为常用的 功能分支流；
功能分支工作流是以集中式工作流为基础的。它提倡为各个新功能分配一个专门的分支来开发， 当功能分支稳定，或者说经过完备的测试之后才合并到 master 分支。

[Git 版本规范](../../编程基础/前端规范/GIT_规范.md)

## Git Flow

[Git Flow 的正确使用姿势](https://www.jianshu.com/p/41910dc6ef29)

<!-- ![git_规范_01.png](/assets/images/git-01.jpg#pic_center") -->

<img id="pic" src="/assets/images/git-01.jpg"/>

<p style="text-align: center;">git_规范_01.png</p>

<style>
    img#pic {
        width: 400px;
        display: block;
        margin: 0 auto;
    }
</style>

## Git 分支管理

### 1. 规范参考（一）

- master：主分支，用于发布到生产环境
- dev：开发分支，用于开发新功能
- feature：新功能分支，用于开发新功能，开发完成后合并到 dev 分支
- release：预发布分支，用于测试，测试完成后合并到 master 分支
- hotfix：紧急修复分支，用于紧急修复 bug，修复完成后合并到 master 和 dev 分支

> 命名规范：
>
> - 分支名使用小写，多个单词使用下划线连接；
> - 分支名尽量简短，不要超过 20 个字符；
> - 分支名尽量使用英文，不要使用拼音；
> - 分支名尽量使用名词，不要使用动词；

### 2. 规范参考（二）

- <span style="font-weight: bold;">master</span> 分支，是主分支，
  - （远程）所有迭代版本的开发均在此分支下进行；
  - 所有个人开发完成后，需要将本地<span style="color: #ff502c;">**个人（develop）分支**</span>推送到远程仓库，并提交代码合并申请（Merge Request），将代码合并到 <span style="color: #ff502c;">**master 分支**</span>；
- <span style="font-weight: bold;">develop-XXX_X.0</span> 分支，是个人开发分支，X.0 为当前迭代版本号，
  - 所有迭代版本的开发均在此分支下进行；
  - 一般由开发人员从 <span style="color: #ff502c;">**master 分支**</span>拉取代码，并创建新的个人（develop）分支，并在该个人（develop）分支下进行开发；
  - 在进行当前分支开发前，需要先从 <span style="color: #ff502c;">**master 分支**</span>更新代码后再进行；
  - 开发颗粒度以**禅道任务**为单位，每个任务完成后，使用**Git Commit**添加备注，提交代码；
  ```shell
  git commit -m "feat: [task_id] task_description"
  ```
- <span style="font-weight: bold;">release_X.0</span> 分支，为生产分支，X.0 为当前迭代版本号；一般在两种场景下新建：

  - 项目即将发布，需要对 master 分支进行**封板**，此时新建 release-X.0 分支，并从 master 分支拉取代码，后续修复 bug 均从该分支下新建<span style="color: #ff502c;">**临时分支**</span>（_可不与远程同步，但修复 bug 后需要将修复合并到当前 release 分支_）进行 bug 修复；
  - **下一迭代版本即将进入开发阶段**，且此时当前迭代版本尚未进行封板，此时提前新建 release-X.0 分支，并从 master 分支拉取代码，当前迭代版本测试、bug 修复均在此分支进行；而下一迭代版本的开发，则继续在<span style="color: #ff502c;">**master 分支**</span>进行；
  - 各个迭代版本发布的生产分支，不可删除；

- <span style="font-weight: bold;">hotfix_X.0</span> 分支，为 bug 修复分支；

  - 所有当前迭代版本的 bug 修复均在此分支下进行；
  - 一般由开发人员从 <span style="color: #ff502c;">**master 分支**</span>或指定 <span style="color: #ff502c;">**release_X.0 分支**</span>拉取代码，并创建分支进行 bug 修复；
  - bug 修复完成后，将代码推送到远程仓库；
  - 代码合并前，先拉取 <span style="color: #ff502c;">**master 分支**</span>或指定 <span style="color: #ff502c;">**release_X.0 分支**</span>最新代码，并将代码合并到当前 <span style="color: #ff502c;">**hotfix_X.0 分支**</span>，更新代码及解决冲突；
  - 代码更新后，使用**Git Commit**添加备注，提交代码并推送到远程仓库；

  ```shell
  git commit -m "fix: [bug_id] bug_description"
  ```

  - GitLab 页面新建合并申请（Merge Request），将代码合并到 <span style="color: #ff502c;">**master 分支**</span>或指定 <span style="color: #ff502c;">**release_X.0 分支**</span>；

- <span style="font-weight: bold;">refactor_X.0</span> 分支，为重构、优化分支；
  - 所有当前迭代版本的重构、优化均在此分支下进行；
  - 操作与 bug 修复分支类似；
  - 代码重构、优化后，使用**Git Commit**添加备注，提交代码并推送到远程仓库；
  ```shell
  git commit -m "refactor: [task_id] refactor_description"
  ```

## Git 基本操作

### 用户信息配置

```shell
# 设置用户名/邮箱
git config --global user.name 'user.name'
git config --global user.email 'user.email'
# 查看用户名/邮箱
git config user.name
git config user.email

# 查看 git 配置
git config --global -l

# 查看 git 设置列表信息
git config --list
```

### 操作远程仓库

```sh
## 查看远程仓库地址
git remote -v
# origin  http://192.168.1.69:8000/lianghaishun/pay2china.git (fetch)
# origin  http://192.168.1.69:8000/lianghaishun/pay2china.git (push)

## 切换远程仓库地址
# -直接切换
git remote set-url origin url
# - 先删除后添加
git remote rm origin
git remote add origin url


## 添加一个远程仓库
# [URL: https://www.jianshu.com/p/2952650fe0c2]
git remote add <name> <url>
# git remote add local http://192.168.1.69:8000/lianghaishun/pay2china.git

## 拉取远程代码
# 默认master 主分支
git clone git@192.168.100.7:payoff-platform/code/ecsp-pay-parent-ui.git

# 指定分支
git clone -b dev git@192.168.100.7:payoff-platform/code/ecsp-pay-parent-ui.git
```

### 代码提交

```sh
## 查看文件状态，红色-未提交到本地，绿色-已提交到本地
git status

## 将文件添加到暂存区
git add .
git add 文件.js

## 将暂存区文件提交到本地仓库
git commit -m '描述信息'

## 将本地仓库代码推送到远程仓库（主分支/其他分支）
git push
git push -u origin dev
```

### 分支操作

```sh
## 分支操作
git branch     # 列出本地分支，（*）表示当前分支
git branch -a  # 列出所有分支，包括远程分支
git branch -v  # 列出本地分支的最后一次提交信息
git branch -vv # 列出本地分支及对应的远程分支

## 创建分支
git branch new_branch_name      # 创建新分支
git checkout new_branch_name    # 切换到分支上
git checkout -b new_branch_name # 创建并切换到分支上，等同于上两步
git push --set-upstream origin new_branch_name  # 将新分支推送到远程仓库

## 删除分支
git push origin --delete branch_name  # 删除远程分支
git branch -d branch_name  # 删除本地分支，需先切换到其他分支
git branch -D branch_name  # 强制删除本地分支

## 修改查看
git log     # 查看当前分支的提交记录
git blame   # 查看文件每一行最后修改的版本和作者
git diff    # 查看当前工作目录修改的内容
git status  # 查看当前分支的状态

## 暂存区操作
git stash   # 把当前修改压入栈中，执行前最好先执行git add . 到储藏区，使之能被git进行追踪
git stash -m ”stashMessage“ # 标记此次储藏，以便后期查看
git stash list  # 显示栈中的list
git stash pop   # 恢复栈中的状态
git stash clear # 清除所有stash
git stash apply [index]  # 取出[index]缓存，且缓存堆栈中的对应stash不会删除，中括号不需要
git stash pop [index]    # 取出[index]缓存，将缓存堆栈中的对应stash删除，中括号不需要
git stash drop [index]   # 丢弃[index]存储，从列表中删除这个存储，中括号不需要
git stash [-u|--include-untracked] # 对未追踪文件也进行储藏
git stash [-S|--staged]            # 只对暂存区文件进行储藏
git stash [-a|--all]               # 对所有文件进行储藏

## 提交变更
git add .         # 把工作区的修改提交到暂存区
git commit -m     # 把暂存区的修改提交到本地仓库
git commit -a     # 上面两步的一次操作，即把工作区的修改提交到本地仓库
git commit -a --amend          # 在上一次提交的基础上，补充提交信息，不产生新的提交
git commit -m 'xxx' --no-verif # 提交代码时绕过 Git 钩子（hook）的校验
git pull               # 将远程仓库的修改更新到本地
git push origin master # 将本地仓库同步到远程仓库
git remote prune origin --dry-run # 查看哪些远程分支需要清理
git remote prune origin           # 清理失效的远程分支

## 回退
git reset HEAD^             # 回退到上个版本，commit 信息回退，修改还在
git reset --hard HEAD^      # 彻底回退到上个版本，commit 信息和修改都回退
git reset --hard commit_id  # 彻底回退到指定版本

## 标签操作
git tag                # 列出当前分支的标签
git tag                # 新建标签
git tag                # 删除标签
git show               # 查看标签对应的提交信息
git push origin        # 将tag同步到远程仓库
git push origin --tags # 将本地所有tag都同步到远程仓库

## 合并分支
# 将dev分支合并到master分支
git checkout master     # 首先切换到master分支上
git pull origin master  # 把远程master上的代码pull下来
git merge dev           # 把dev分支的代码合并到master上
git push                # 将修改推送到远程仓库
```

## 一套代码同时提交到 GitHub 和 Gitee

将同一套代码同时提交到 GitHub 和 Gitee 是一个常见的需求，尤其是在希望代码能够在中国境内外都能高效访问的情况下。下面是如何实现这一目标的步骤。

### 步骤 1: 初始化本地仓库

1. 打开终端或命令行工具。
2. 切换到你的项目目录：

```bash
cd /path/to/your/project
```

3. 初始化 Git 仓库：

```bash
git init
```

### 步骤 2: 添加远程仓库

1. 获取 GitHub 仓库的 URL：
   - 登录 GitHub，创建一个新的仓库。
   - 复制仓库的 HTTPS 或 SSH URL。
2. 获取 Gitee 仓库的 URL：
   - 登录 Gitee，创建一个新的仓库。
   - 复制仓库的 HTTPS 或 SSH URL。
3. 添加 GitHub 远程仓库：

```bash
git remote add github https://github.com/用户名/项目名.git
```

4. 添加 Gitee 远程仓库：

```bash
git remote add gitee https://gitee.com/用户名/项目名.git
```

### 步骤 3: 配置多个远程仓库

1. 检查远程仓库配置：

```bash
git remote -v
```

输出应显示两个远程仓库的 URL。

2. 如果需要修改配置，可以编辑 `.git/config` 文件：

```ini
[remote "github"]
    url = https://github.com/用户名/项目名.git
    fetch = +refs/heads/*:refs/remotes/github/*
[remote "gitee"]
    url = https://gitee.com/用户名/项目名.git
    fetch = +refs/heads/*:refs/remotes/gitee/*
```

### 步骤 4: 提交代码

1. 将所有文件添加到暂存区：

```bash
git add .
```

2. 提交代码：

```bash
git commit -m "初始提交"
```

### 步骤 5: 推送到远程仓库

1. 推送到 GitHub：

```bash
git push github master
```

2. 推送到 Gitee：

```bash
git push gitee master
```

### 注意事项

- **分支名称**：如果使用的是其他分支（例如 `main`），请将 `master` 替换为相应的分支名称。
- **同步检查**：定期检查 GitHub 和 Gitee 上的代码是否一致，确保没有遗漏的提交。
- **权限管理**：确保你有权限访问和推送代码到这两个仓库。
- **错误处理**：如果遇到推送失败，请检查网络连接和远程仓库的 URL 是否正确。

## [error] remote gitee already exists.

<bqe>

当你遇到 `error: remote gitee already exists.` 这个错误信息时，通常是因为你尝试添加一个已经存在的远程仓库名称。以下是一些解决这个问题的方法：

- **检查当前的远程仓库**：

```bash
  git remote -v
```

这条命令会列出所有已配置的远程仓库及其 URL。

- **重命名现有的远程仓库**：
  如果你想要更改现有远程仓库的名称，可以使用：

```bash
  git remote rename gitee new_name
```

- **删除并重新添加远程仓库**：
  如果你需要完全移除然后重新添加这个远程仓库，可以先删除：

```bash
  git remote remove gitee
```

然后再次添加：

```bash
  git remote add gitee <repository-url>
```

- **直接设置远程仓库 URL**：
  如果只是需要更新远程仓库的 URL 而不是名称，可以直接设置：

```bash
git remote set-url gitee <new-repository-url>
```

</bqe>

## [error] src refspec master does not match any

<bqe>

当你遇到 `error: src refspec master does not match any` 错误时，通常是因为本地仓库中还没有 `master` 分支，或者你尝试推送的分支不存在。以下是一些解决方法：

### 解决方法

#### 方法 1: 创建并切换到 `master` 分支

1. **创建并切换到 `master` 分支**：

```bash
   git checkout -b master
```

**再次尝试推送**：

```bash
   git push origin master
   git push gitee master
```

#### 方法 2: 使用默认分支（例如 `main`）

1. **检查当前分支**：

```bash
   git branch
```

**如果当前分支是 `main`，则推送 `main` 分支**：

```bash
   git push origin main
   git push gitee main
```

#### 方法 3: 重命名当前分支为 `master`

1. **重命名当前分支为 `master`**：

```bash
   git branch -M master
```

**再次尝试推送**：

```bash
   git push origin master
   git push gitee master
```

### 具体步骤

假设你当前在 `main` 分支上，以下是详细的步骤：

1. **初始化本地仓库**：

```bash
   git init
```

**添加远程仓库**：

```bash
   git remote add origin https://github.com/用户名/项目名.git
   git remote add gitee https://gitee.com/用户名/项目名.git
```

3. **检查当前分支**：

```bash
   git branch
```

**如果当前分支是 `main`，重命名分支为 `master`**：

```bash
   git branch -M master
```

**将所有文件添加到暂存区并提交**：

```bash
   git add .
   git commit -m "初始提交"
```

6. **推送到远程仓库**：

```bash
   git push origin master
   git push gitee master
```

## 注意事项

- **分支名称**：确保你使用的分支名称与远程仓库的默认分支名称一致。GitHub 和 Gitee 的默认分支可能是 `main` 或 `master`。
- **远程仓库配置**：确保远程仓库的 URL 是正确的，并且你有权限推送代码。
- **错误处理**：如果仍然遇到问题，请检查是否有其他错误信息，并根据提示进行调整。

</bqe>

以上步骤详细介绍了如何将一套代码同时提交到 GitHub 和 Gitee，希望对你有所帮助。如果有任何问题，欢迎随时提问。
