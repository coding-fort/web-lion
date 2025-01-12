# GIT\_规范

## Git commit 规范

- 统一格式

```shell
<type>(<scope>): <subject>
// 注意冒号 : 后有空格
// 如 feat(user): 增加用户中心的 xx 功能
```

- scope 表示 commit 的作用范围，如用户中心、购物车中心，也可以是目录名称，一般可以限定几种；
- subject 用于对 commit 进行简短的描述；
- type 必填，表示提交类型，值一般有以下几种：

  - feat：新功能 feature
  - bug：测试反馈 bug 列表中的 bug 号
  - fix： 修复 bug
  - ui：更新 UI；
  - docs： 文档注释变更
  - style： 代码格式(不影响代码运行的变动)；
  - refactor： 重构、优化(既不增加新功能，也不是修复 bug)；
  - perf： 性能优化；
  - release：发布；
  - deploy：部署；
  - test： 增加测试
  - chore： 构建过程或辅助工具的变动
  - revert： 回退
  - build： 打包

  > ### 结合工具强制使用 Git Commit 规范：
  >
  > - 使用 commitlint 、commitizen 和 husky 来进行提交检查；
  > - 使用 commitlint-config-cz 规范命令行提示消息（可选）；
  > - 使用 conventional-changelog 提交日志；

<suc>CommitLint</suc> 和 <suc>Husky</suc> 是两个在现代软件开发流程中广泛使用的工具，它们分别在代码提交规范和 Git 工作流自动化方面发挥着重要作用。

### CommitLint

<sucb>CommitLint</sucb> 是一个用于规范 Git 提交信息的工具。它的核心目的是<err>确保每一次代码提交都遵循一致的格式</err>，这有助于保持提交历史的清晰度和可读性，对于团队协作尤为重要。通过设置一套提交信息的规则（如 Angular、Conventional Commits 规范），CommitLint 能够在提交前检查提交信息是否符合这些规则。如果提交信息不合规，CommitLint 可以阻止提交或仅发出警告。这有助于维护良好的提交信息标准，使得通过提交历史快速理解项目变更变得更加容易。CommitLint 通常需要配置文件（如 <sucb>commitlint.config.js</sucb>）来定义规则。

#### commitlint.config.js 配置示例

```js
// commitlint.config.js
module.exports = {
  // 遵循的是Angular团队推荐的提交信息规范（Conventional Commits），它定义了一套标准的提交类型、描述格式等，比如使用feat表示新功能，fix表示修复bug等
  extends: ["@commitlint/config-conventional"],
  // 这部分是自定义或覆盖继承规则集中的具体规则，每个规则由三个元素组成：错误级别、应用时机和规则细节。
  rules: {
    // 这个规则指定了提交类型（type字段）必须是列表中所列的之一，比如feat（新功能）、fix（修复）、docs（文档更改）等。错误级别为2意味着如果提交类型不在列表中，将视为错误。"always"表明这条规则始终适用。
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "revert",
        "build",
      ],
    ],
    "type-case": [0], // 不检查提交类型的大小写
    "type-empty": [0], // 允许提交类型为空
    "scope-empty": [0], // 允许提交作用域（scope）为空
    "scope-case": [0], // 不检查作用域的大小写
    "subject-full-stop": [0, "never"], // 不要求提交信息的描述部分以句号结束
    "subject-case": [0, "never"], // 不检查提交信息描述部分的大小写
    "header-max-length": [0, "always", 72], // 不检查提交信息头部（包括type、scope和描述）的最大长度，尽管这里设置了一个最大长度为72，但由于错误级别为0，该规则实际上不起作用
  },
};
```

### Husky

<sucb>Husky</sucb> 是一个 Git 钩子管理工具。Git 钩子是在 Git 仓库中特定事件（如提交、推送、合并等）发生前或发生后执行的脚本。Husky 允许开发者以更便捷的方式配置这些钩子，而无需直接在 <err>.git/hooks</err> 目录下手动管理脚本文件。通过在项目中安装 Husky 并在配置文件中定义钩子脚本，可以自动化执行诸如**代码格式化**、**代码质量检查**、**CommitLint 检查**等任务。这意味着开发者在执行 Git 操作时，比如 git commit，可以自动触发一系列预设的检查，从而保障代码质量和团队编码规范的统一。

### 协同作战

<sucb>CommitLint</sucb> 和 <sucb>Husky</sucb> 经常协同工作，以增强 Git 工作流的自动化和规范化。例如，通过在 Husky 的配置中集成 CommitLint，可以在每次 <errb>git commit</errb> 前自动运行 CommitLint，检查提交信息是否符合团队的规范。如果提交信息不符合规则，Husky 可以阻止此次提交，直到开发者修正信息。这种组合不仅提高了代码质量，还促进了团队成员间的沟通和编码习惯的一致性。

### Commitizen

<sucb>Commitizen</sucb> 则是一个致力于使提交信息遵循特定格式的工具，它通过提供一个交互式的命令行界面（CLI），引导开发者按照一定的模板填写提交信息。Commitizen 的目标是使得提交信息更加结构化和标准化，它通常与像 Angular、Conventional Commits 这样的提交规范相结合。当运行 cz 或 git cz 命令时，开发者会被询问一系列问题，然后根据答案生成符合规范的提交消息。Commitizen 也能与 CommitLint 配合使用，以确保生成的提交信息在提交前通过格式验证。

#### 安装 Commitizen

首先，你需要在你的项目中安装 Commitizen 和一个适配器，通常是 cz-conventional-changelog，它遵循 Angular 风格的提交信息规范。打开终端，进入你的项目目录，然后运行以下命令：

```sh
npm install --save-dev commitizen cz-conventional-changelog
```

#### 初始化 Commitizen

安装完成后，你需要初始化 Commitizen 并设置 cz-conventional-changelog 作为默认适配器。在项目根目录下运行：

```sh
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

这会在你的项目中创建一个 <err>.czrc</err> 配置文件，指向 cz-conventional-changelog 作为默认的 commit 规范。

#### 使用 Commitizen 提交

从现在起，当你想要提交代码时，不再直接使用 git commit，而是使用 git cz 命令。这个命令会启动一个交互式提示，引导你完成提交信息的编写，通常会要求你输入以下内容：

1. **类型（Type）**：比如 feat 表示新功能，fix 表示修复错误，docs 表示文档更新等。
2. **短描述（Subject）**：一个简洁的描述，概述了这次提交做了什么。
3. **长描述（Body，可选）**：更详细的描述，如果有必要的话。
4. **影响范围（Scope，可选）**：受影响的模块或功能区域。5. 关闭的 issue（Footer，可选）：如 Fixes #123，用于自动关闭相关的 issue。

#### 配置与自定义

Commitizen 支持自定义配置，可以通过修改 .czrc 文件或项目的 package.json 中的 "config" 字段来调整。例如，你可以自定义提示的问题，或者添加新的提交类型。

### husky 提交规范检查

1. 在根目录新增目录<span style="color: #ff502c;">.husky</span>
2. 目录结构

   > |-.husky <br/>
   > |--\_ <br/>
   > |---.gitignore <br/>
   > |---husky.sh <br/>
   > |--commit-msg <br/>
   > |--pre-commit <br/>

3. husky.sh

```shell
#!/bin/sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }
  readonly hook_name="$(basename "$0")"
  debug "starting $hook_name..."
  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi
  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi
  export readonly husky_skip_init=1
  sh -e "$0" "$@"
  exitCode="$?"
  if [ $exitCode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitCode (error)"
  fi
  exit $exitCode
fi
```

4. commit-msg

```shell
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no-install commitlint --edit $1
# npm commitlint


```

5. pre-commit

```shell
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# npx lint-staged
npx eslint --fix --ext .js,.ts,.vue ./src


```
