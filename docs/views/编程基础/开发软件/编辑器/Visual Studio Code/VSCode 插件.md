# VSCode 插件

# 代码格式化

## Prettier

<sucb>Prettier</sucb> 是一个非常受欢迎的代码格式化工具，它支持多种语言，包括 JavaScript、TypeScript、HTML、CSS、SCSS、Less、Vue、React 等。Prettier 可以自动格式化你的代码，确保团队间代码风格的一致性。

### 安装方法

- 打开 VSCode
- 点击侧边栏的扩展图标（或按 Ctrl+Shift+X 快捷键）
- 搜索“Prettier”
- 点击“Install”安装 Prettier

### 插件配置

<sucb>Prettier</sucb> 通常会自动读取项目根目录下的<err>.prettierrc</err> 或<err>.prettierrc.json</err> 配置文件。你也可以在 VSCode 的设置中进行个性化配置。打开设置 (File > Preferences > Settings 或 Ctrl+,)，搜索 prettier，然后在 Prettier 的配置项中根据需要调整。

### VS Code 格式化快捷键配置

对于 Prettier 来说，VS Code 默认的格式化快捷键是 <prib>Ctrl+Shift+P</prib>，然后输入“format document”。

### 配置 Prettier 忽略文件

如果你想要忽略某些文件或文件夹，可以在项目的根目录下创建一个名为<err>.prettierignore</err> 的文件，并在其中列出要忽略的文件或文件夹的名称。

### 配置 Prettier 自动修复

如果你想要在保存文件时自动修复格式问题，可以在 VS Code 的设置中启用“<err>editor.formatOnSave</err>”选项。

### 配置 Prettier 自动格式化

如果你想要在每次运行 Prettier 命令时自动格式化代码，可以在 VS Code 的设置中启用“<err>editor.formatOnSave</err>”选项。

### 配置文件

常见的配置文件有：<suc>.prettierrc</suc>、<suc>.prettierrc.json</suc>、<suc>.prettierrc.js</suc>。这三个文件都是 Prettier 代码格式化工具用于配置的文件，它们之间的主要区别在于文件格式和配置的灵活性。

1. <sucb>.prettierrc</sucb>

- **格式**：这个文件可以是 JSON 格式，也可以是 YAML 格式。如果没有文件扩展名，Prettier 会尝试按这两种格式解析文件。通常，人们会选择 JSON 格式编写，但如果偏好更简洁的语法，可以选择 YAML。
- **优点**：简洁易读，适合简单的配置需求。
- **缺点**：不支持编程逻辑，不能进行条件判断或使用函数等复杂配置。

2. <sucb>.prettierrc.js</sucb>

- **格式**：这是一个 JavaScript 文件，可以包含执行 JavaScript 代码来生成配置对象。
- **优点**：高度灵活，可以利用 JavaScript 的全部能力进行动态配置，比如基于环境变量动态调整配置，或者运行函数来计算配置值。
- **缺点**：相比 JSON 或 YAML 格式，文件内容稍微复杂，对于只需要简单配置的项目可能显得冗余。

3. <sucb>.prettierrc.json</sucb>

- **格式**：这是纯 JSON 格式的配置文件，与.prettierrc 文件类似，但明确指定为 JSON 格式。
- **优点**：JSON 格式是标准的数据交换格式，易于阅读和编辑，且被各种工具广泛支持。
- **缺点**：与.prettierrc 相同，不支持编程逻辑。

选择哪个文件取决于你的具体需求：

- 如果你的项目需要简单的**静态配置**，使用.prettierrc（JSON 或 YAML）或直接.prettierrc.json 可能更合适。
- 如果你需要更复杂的配置逻辑，比如根据不同环境或条件**动态调整配置**，.prettierrc.js 是更好的选择。

> Prettier 会按照一定的优先级查找配置文件，如果存在多个格式的配置文件，它会<err>优先考虑.js 文件</err>，然后是<err>.json 或.yml/yaml 文件</err>，最后是<err>没有扩展名的文件</err>。因此，如果你同时拥有.prettierrc.js 和.prettierrc，Prettier 会使用.prettierrc.js 中的配置。

### 通用配置（参考）

<errb>.prettierrc.js</errb>

```js
module.exports = {
  // 一行最多多少个字符
  printWidth: 150,
  // 指定每个缩进级别的空格数
  tabWidth: 2,
  // 使用制表符而不是空格缩进行
  useTabs: true,
  // 在语句末尾打印分号
  semi: true,
  // 使用单引号而不是双引号
  singleQuote: true,
  // 更改引用对象属性的时间 可选值"<as-needed|consistent|preserve>"
  quoteProps: "as-needed",
  // 在JSX中使用单引号而不是双引号
  jsxSingleQuote: false,
  // 多行时尽可能打印尾随逗号。（例如，单行数组永远不会出现逗号结尾。） 可选值"<none|es5|all>"，默认none
  trailingComma: "es5",
  // 在对象文字中的括号之间打印空格
  bracketSpacing: true,
  // jsx 标签的反尖括号需要换行
  jsxBracketSameLine: false,
  // 在单独的箭头函数参数周围包括括号 always：(x) => x \ avoid：x => x
  arrowParens: "always",
  // 这两个选项可用于格式化以给定字符偏移量（分别包括和不包括）开始和结束的代码
  rangeStart: 0,
  rangeEnd: Infinity,
  // 指定要使用的解析器，不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // 使用默认的折行标准 always\never\preserve
  proseWrap: "preserve",
  // 指定HTML文件的全局空格敏感度 css\strict\ignore
  htmlWhitespaceSensitivity: "css",
  // Vue文件脚本和样式标签缩进
  vueIndentScriptAndStyle: false,
  // 换行符使用 lf 结尾是 可选值"<auto|lf|crlf|cr>"
  endOfLine: "lf",
};
```

<errb>.prettierrc.json/.prettierrc</errb>

```json
{
  "printWidth": 150,
  "tabWidth": 2,
  "useTabs": true,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "always",
  "requirePragma": false,
  "insertPragma": false,
  "proseWrap": "preserve",
  "htmlWhitespaceSensitivity": "css",
  "vueIndentScriptAndStyle": false,
  "endOfLine": "lf"
}
```

## [ESLint](/views/工程开发/模块化/ESLint)

<sucb>ESLint</sucb> 是一个流行的 <err>JavaScript</err> 和 <pri>TypeScript</pri> 代码质量工具，用于检测代码中的潜在错误和不符合特定编码规则的情况。在 Visual Studio Code (VSCode) 中使用 ESLint 插件可以让开发过程更加高效，因为它直接集成到了编辑器中，提供了实时的<errb>错误检查、警告以及代码格式化</errb>的功能。

### 安装 ESLint 插件

1. 打开 VSCode。
2. 点击侧边栏的扩展图标（一个方形的图标，位于左侧活动栏的最下方）或者通过顶部菜单选择 查看 -> 扩展。
3. 在搜索框中输入“ESLint”。
4. 在搜索结果中找到名为 “ESLint” 的插件，它通常由 Dirk Baeumer 开发并有很高的下载量。
5. 点击插件旁边的“安装”按钮以安装该插件。
6. 安装完成后，插件会自动激活，无需重启 VSCode（除非提示需要）。

### 在 VSCode 中配置 ESLint 设置

虽然 ESLint 插件安装后基本可以开箱即用，但你可能需要调整一些设置来满足个人或团队的编码规范。可以通过以下步骤进行配置：

1. 打开 VSCode 设置：点击左上角的“文件”->“首选项”->“设置”，或直接使用快捷键 **Ctrl + ,**（在 Mac 上是 **Cmd + ,**）。
2. 在设置页面的搜索框中输入“<errb>eslint</errb>”以过滤相关设置。
3. 你可以在此处配置是否启用 ESLint、指定配置文件路径、自定义规则等。例如，确保 "<errb>eslint.enable</errb>" 设置为 true，并根据需要调整其他选项。

## EditorConfig

<sucb>EditorConfig</sucb> 是一个开源的文件格式和一系列编辑器插件的集合，设计用于帮助开发者在不同的文本编辑器和集成开发环境（IDE）之间维护一致的编码风格。它通过在项目根目录下放置一个名为 <err>.editorconfig</err> 的文件来实现这一点，这个文件定义了一系列编码约定，包括但不限于缩进风格、字符编码、行结束符、以及空格和制表符的使用等。

### 主要目的

- **一致性**：确保团队成员在使用不同编辑器或 IDE 时，代码风格保持统一，提高代码可读性和团队协作效率。
- **易于配置和共享**：通过简单的<err>.editorconfig</err> 文件，编码规范可以轻松地被定义和分享，避免了每个开发者都需要在自己的编辑器中手动配置编码风格的麻烦。
- **跨平台兼容**：解决了不同操作系统（如 Windows、Linux、macOS）对换行符等格式处理不一致的问题。

### 文件结构一个典型的

<err>.editorconfig</err> 文件可能包含以下内容：

```yaml
root = true # 表示当前文件是项目根目录下的配置文件

# 指定这些规则应用于项目中的所有文件
[*]
charset = utf-8 # 设置字符编码为UTF-8
indent_style = space # 指定使用空格进行缩进
indent_size = 2 # 设置缩进大小为2个空格
end_of_line = lf # 使用LF（换行符）作为行结束符，适用于Unix风格的系统
insert_final_newline = true # 确保文件末尾有一个空行
trim_trailing_whitespace = true # 自动移除行尾多余的空白字符

# 特定文件或文件类型的规则例外，可以针对不同类型的文件设置不同的格式规则
[*.md]
trim_trailing_whitespace = false

# 特定文件或文件类型的规则例外，可以针对不同类型的文件设置不同的格式规则
[Makefile]
indent_style = tab

```

### 支持的编辑器和 IDE

大多数现代的代码编辑器和 IDE，包括但不限于 Visual Studio Code, Sublime Text, Atom, IntelliJ IDEA, WebStorm, Visual Studio 等，都通过插件的形式支持 EditorConfig。安装对应的插件后，编辑器会自动读取项目中的 <err>.editorconfig</err> 文件并应用相应的编码风格。
