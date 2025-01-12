# ESLint

**ESLint** 是一个开源的 JavaScript 代码检查工具，用于识别和报告代码中的问题，帮助开发者编写更高质量、更一致的代码。它不仅能够捕捉潜在的错误，还可以强制执行编码风格规则，确保团队成员之间的代码风格统一。随着 JavaScript 生态系统的不断发展，ESLint 已经成为现代前端开发中不可或缺的一部分。

## 1.ESLint 的核心功能

### 1.1. **静态分析**

- **语法检查**：检测不符合 ECMAScript 规范的语法错误。
- **潜在错误**：发现可能导致运行时错误的问题，如未定义变量、冗余语句等。
- **最佳实践**：建议遵循的最佳编程习惯，提高代码质量和可维护性。
- **安全性**：识别可能的安全漏洞，例如跨站脚本攻击（XSS）或命令注入。

### 1.2. **编码风格**

- **格式化**：通过配置文件来规定缩进、空格、分号等细节，保证代码风格的一致性。
- **命名约定**：规范变量名、函数名、类名等标识符的命名方式。
- **注释**：鼓励使用有意义的注释，解释复杂逻辑或特殊用法。

### 1.3. **插件系统**

ESLint 支持丰富的插件生态，允许扩展其内置规则集，以适应特定框架、库或技术栈的需求。例如：

- **React 插件**：为 React 组件提供额外的规则，如禁止直接操作 DOM、确保 JSX 语法正确等。
- **Vue 插件**：针对 Vue.js 项目定制规则，涵盖单文件组件（SFC）、模板语法等方面。
- **Prettier 集成**：与 Prettier 结合使用，自动修复代码格式问题，减少手动调整的工作量。

### 1.4. **自定义配置**

ESLint 提供了多种方式来自定义规则集，包括但不限于：

- **`.eslintrc` 文件**：在项目根目录下创建配置文件，指定要启用或禁用哪些规则。
- **`package.json` 中的 `eslintConfig` 字段**：将配置信息嵌入到 `package.json` 文件中。
- **命令行参数**：通过 CLI 命令动态传递配置选项。
- **环境变量**：利用环境变量控制某些行为，如忽略特定文件夹或覆盖默认设置。

## 2.安装与使用

### 2.1.安装 ESLint

你可以通过 npm 或 yarn 来安装 ESLint：

```bash
npm install eslint --save-dev
# 或者
yarn add eslint --dev
```

### 2.2.初始化配置

安装完成后，可以运行以下命令来生成初始配置文件：

```bash
npx eslint --init
```

这个命令会引导你选择一系列预设选项，如目标环境、支持的语言特性、是否集成其他工具等，从而快速搭建适合项目的 ESLint 环境。

### 2.3.运行 ESLint

一旦配置完成，就可以使用以下命令来检查代码：

```bash
npx eslint yourfile.js
# 或者检查整个目录
npx eslint .
```

如果希望 ESLint 自动修复一些简单的问题，可以在命令后加上 `--fix` 参数：

```bash
npx eslint . --fix
```

### 2.4.配合构建工具

为了使 ESLint 成为开发流程的一部分，通常会将其集成到构建工具（如 Webpack, Gulp, Grunt）或任务管理器（如 npm scripts）中。例如，在 `package.json` 中添加如下脚本：

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

这样可以通过 `npm run lint` 或 `npm run lint:fix` 来方便地运行 ESLint。

## 3.配置文件

常见的配置文件有：<suc>.eslintrc</suc>、<suc>.eslintrc.json</suc>、<suc>.eslintrc.js</suc>。这三个文件都是 ESLint 配置文件的可能形式，它们用于存放 ESLint 在分析代码时遵循的规则及其配置。
主要区别在于它们的格式和解析方式：

1. <sucb>.eslintrc.js</sucb>

- **类型**: 这是一个 JavaScript 文件。
- **特点**: 因为是 JS 文件，所以除了可以直接写入 JSON 兼容的对象配置外，还可以包含执行 JavaScript 代码来动态生成配置。这对于需要条件逻辑来决定某些规则是否启用的场景非常有用。
- **优点**: 最大的灵活性，可以利用 JavaScript 的全部能力来构建配置。
- **缺点**: 相对于静态的 JSON 格式，维护和阅读可能稍微复杂一些。

2. <sucb>.eslintrc</sucb>

- **类型**: 这个文件可以是 JSON 格式也可以是 YAML 格式（取决于文件内容）。
- **特点**: 如果内容以 JSON 格式编写，则与.eslintrc.json 相同；如果是 YAML 格式，则提供了比 JSON 更友好的书写格式，比如支持缩进和注释。
- **优点**: YAML 格式更为简洁易读，特别适合包含大量注释或层级结构较深的配置。
- **缺点**: 需要确保编辑器或 IDE 正确识别文件格式，否则可能导致解析错误。

3. <sucb>.eslintrc.json</sucb>

- **类型**: JSON 文件。
- **特点**: 包含纯数据的配置，没有编程逻辑。是最基础且广泛接受的配置格式，易于阅读和编辑，且所有编辑器都能很好地支持。
- **优点**: 简单、明了，易于理解与分享，且不会因为 JavaScript 语法错误导致配置无法加载。
- **缺点**: 不支持动态配置或条件语句，所有规则必须静态定义。ESLint 会按照一定的优先级顺序查找这些配置文件，并使用找到的第一个有效文件。

如果没有明确指定配置文件，ESLint 会从当前目录开始向上查找，直到找到一个为止，或者到达系统根目录。优先级上，ESLint 倾向于使用<errb>.eslintrc.js</errb>，因为它的灵活性最高，但如果存在多个同级格式的配置文件（例如同时有<err>.eslintrc</err> 和<err>.eslintrc.json</err>），这可能会导致不确定的行为，因此推荐在一个项目中只使用一种格式的配置文件。

4. <sucb>.eslintignore</sucb>

<suc>.eslintignore 文件</suc>是 ESLint 配置的一部分，用于指定 ESLint 应该忽略哪些文件或目录。这个文件遵循标准的 <err>.gitignore</err> 格式，意味着你可以使用通配符来匹配文件路径模式。当你不希望 ESLint 对某些文件或目录执行代码检查时，将它们列在这个文件中非常有用，比如第三方库、构建产物或者日志文件等。

创建和维护 <suc>.eslintignore 文件</suc>有助于确保 ESLint 只关注于你的源代码质量，而不会被无关的文件干扰，从而提升开发效率和代码检查的准确性。

```sh
# 忽略 node_modules 目录下的所有文件
node_modules/

# 忽略构建输出目录，例如 dist 或 build，这些目录通常包含经过打包或编译的文件。
dist/

# 如果你有代码覆盖率报告，通常存储在这样的目录下，可以将其忽略。
coverage/

# 忽略 vendor 目录下的所有 .js 文件，适用于存放第三方库脚本的情况。
vendor/*.js

# 忽略 .gitignore 文件
.gitignore

# 忽略 package.json 文件
package.json

#  其他
*.sh
lib
*.md
*.scss
*.woff
*.ttf
.vscode
.idea
mock
public
bin
build
config
index.html
src/assets
```

## 4.通用配置（示例）

<sucb>.eslintrc.js</sucb>

- **`env`** 指定了目标环境（浏览器、ES2021、Node.js）。
- **`extends`** 引用了多个预定义规则集，如 ESLint 推荐规则、React 插件推荐规则以及 TypeScript ESLint 插件推荐规则。
- **`parser`** 和 **`parserOptions`** 设置了解析器及其选项，以便处理不同类型的代码（如 JSX 和 TypeScript）。
- **`plugins`** 列出了使用的插件。
- **`rules`** 定义了一些具体的规则及其严格程度。

```js
module.exports = {
  /**
   * 环境定义了预定义的全局变量。
   * 这里启用了浏览器环境和ES2021的特性。
   */
  env: {
    browser: true,
    es2021: true,
  },

  /**
   * "extends" 属性允许你继承一组已存在的配置。
   * "eslint:recommended" 是ESLint官方推荐的基本规则集。
   */
  extends: ["eslint:recommended"],

  /**
   * 解析器选项，用于指定ECMAScript版本和源码类型。
   */
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },

  /**
   * 自定义规则覆盖或新增。
   * 每个规则都是一个键值对，键是规则名称，值是该规则的错误级别和/或选项。
   * "off" 或 0 - 关闭规则
   * "warn" 或 1 - 开启规则，违规时给出警告
   * "error" 或 2 - 开启规则，违规时给出错误
   */
  rules: {
    // 代码缩进使用2个空格
    indent: ["error", 2],

    // 字符串使用双引号
    quotes: ["error", "double"],

    // 语句结尾必须有分号
    semi: ["error", "always"],

    // 禁止使用var，鼓励使用let和const
    "no-var": "error",

    // 强制箭头函数的箭头前后使用一致的空格
    "arrow-spacing": ["error", { before: true, after: true }],
  },

  /**
   * "plugins" 数组指定了要加载的ESLint插件。
   * 这里没有列出具体插件，但在需要使用第三方规则时会用到。
   */
  plugins: [],

  /**
   * "globals" 可以定义全局变量，避免未定义变量的警告。
   */
  globals: {
    jQuery: "readonly",
    $: "readonly",
  },
};
```

## 5.Vue3 + Typescript 通用配置（示例）

```js
module.exports = {
  // 设置为true表示此配置文件为根配置文件，子目录中的配置文件将不会被继承或合并。
  root: true,

  // 定义脚本运行的环境，以便ESLint知道如何解析代码中的全局变量。
  env: {
    browser: true, // 启用浏览器环境的全局变量，如window、document等。
    es2021: true, // 支持ES2021的语法特性。
    node: true, // 启用Node.js的全局变量和Node.js范围内的ESLint规则。
  },

  // 指定解析器，这里使用vue-eslint-parser解析Vue文件。
  parser: "vue-eslint-parser",

  // 解析器选项，进一步配置解析器。
  parserOptions: {
    ecmaVersion: 12, // 允许使用的ECMAScript版本，这里是ES2021。
    parser: "@typescript-eslint/parser", // 对TypeScript进行解析。
    sourceType: "module", // 表明代码是ES模块。
  },

  // 扩展自多个预设规则集，包括Vue 3的推荐规则、Vue的基本规则以及ESLint的推荐规则。
  extends: [
    "plugin:vue/vue3-essential", // Vue 3的必要规则。
    "plugin:vue/essential", // Vue的基本规则，注意这可能是Vue 2的规则集，需确认版本。
    "eslint:recommended", // ESLint官方推荐的基本规则。
  ],

  // 加载的插件列表，用于扩展ESLint的功能。
  plugins: ["vue", "@typescript-eslint"],

  // 配置覆盖，对特定文件或目录应用特殊的规则。
  overrides: [
    {
      files: ["*.ts", "*.tsx", "*.vue"], // 匹配.ts、.tsx和.vue文件。
      rules: {
        "no-undef": "off", // 关闭“未定义变量”的检查，因为TypeScript有自己的检查机制。
      },
    },
  ],

  // 自定义规则配置，覆盖或补充上面扩展的规则。
  rules: {
    // 关闭或开启各类规则，具体规则根据其名称和设定的等级生效。
    // 例如关闭一些针对TypeScript的不必要的警告，以及Vue特定规则的调整。
    // 这里列出了一些规则的示例，每个规则前面的前缀指示了规则来源，如@typescript-eslint/表示TypeScript相关的规则，vue/表示Vue相关的规则。
    // 'off'或0表示关闭规则，'warn'或1表示警告，'error'或2表示错误。
    // Typescript 规则
    "@typescript-eslint/ban-ts-ignore": "off", // 允许使用// @ts-ignore注释来忽略TypeScript错误。
    "@typescript-eslint/explicit-function-return-type": "off", // 不强制要求函数明确声明返回类型。
    "@typescript-eslint/no-explicit-any": "off", // 允许使用any类型，不视为错误。
    "@typescript-eslint/no-var-requires": "off", // 允许在导入模块时使用require语句和var声明。
    "@typescript-eslint/no-empty-function": "off", // 允许定义空函数，不报错。
    "@typescript-eslint/no-use-before-define": "off", // 允许变量或函数在定义之前使用。
    "@typescript-eslint/ban-ts-comment": "off", // 不禁用使用@ts-...注释。
    "@typescript-eslint/ban-types": "off", // 不禁用使用某些类型如Object作为类型注解
    "@typescript-eslint/no-non-null-assertion": "off", // 允许使用非空断言操作符（!）。
    "@typescript-eslint/explicit-module-boundary-types": "off", // 不强制导出的函数和类的公共方法有明确的返回类型注解。
    "@typescript-eslint/no-redeclare": "error", // 错误级别开启，禁止变量或函数在同一作用域内被重复声明。
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off", // 允许在可选链中使用非空断言。
    "@typescript-eslint/no-unused-vars": "error", // 设置为错误级别（2相当于error），报告未使用的变量。
    // Vue 规则
    "vue/custom-event-name-casing": "off", // 关闭Vue自定义事件名称大小写的检查，允许驼峰式或短横线分隔的命名方式。
    "vue/attributes-order": "off", // 关闭组件属性的排序规则，允许自由排序。
    "vue/one-component-per-file": "off", // 允许一个文件中定义多个Vue组件，而不是每个组件一个文件。
    "vue/html-closing-bracket-newline": "off", // 关闭HTML标签闭合括号换行规则，不强制要求闭合标签换行。
    "vue/max-attributes-per-line": "off", // 不强制限制一行内属性的数量，允许多行或单行自由安排。
    "vue/multiline-html-element-content-newline": "off", // 不强制多行HTML元素内容（如文本）换行。
    "vue/singleline-html-element-content-newline": "off", // 不强制单行HTML元素内容换行。
    "vue/attribute-hyphenation": "off", // 关闭HTML属性必须使用短横线命名的规则，允许不加短横线。
    "vue/html-self-closing": "off", // 关闭HTML自闭合标签的强制规则，允许自定义选择。
    "vue/no-multiple-template-root": "off", // 允许Vue单文件组件有多个根节点。
    "vue/require-default-prop": "off", // 不强制要求组件的prop提供默认值。
    "vue/no-v-model-argument": "off", // 允许在自定义组件上使用v-model时带有参数。
    "vue/no-arrow-functions-in-watch": "off", // 允许在watcher中使用箭头函数。
    "vue/no-template-key": "off", // 允许在v-for时不使用key。
    "vue/no-v-html": "off", // 允许使用v-html指令。
    "vue/comment-directive": "off", // 关闭对Vue特殊注释指令的检查。
    "vue/no-mutating-props": "off", // 允许组件内部修改props。
    "vue/no-parsing-error": "off", // 忽略Vue解析错误的检查。
    "vue/no-deprecated-v-on-native-modifier": "off", // 允许使用已废弃的.v-on事件修饰符。
    "vue/multi-word-component-names": "off", // 允许单单词的组件名称。
    // Javascript 规则
    "no-useless-escape": "off", // 允许使用不必要的转义字符。
    "no-sparse-arrays": "off", // 允许稀疏数组（即数组中包含空位）。
    "no-prototype-builtins": "off", // 允许使用Object.prototype方法的非传统用法。
    "no-constant-condition": "off", // 允许在条件语句中使用常量表达式。
    "no-use-before-define": "off", // 允许变量、函数或类在定义之前使用。
    "no-restricted-globals": "off", // 不禁止使用某些可能引起混淆的全局变量。
    "no-restricted-syntax": "off", // 不禁止特定的语法结构。
    "generator-star-spacing": "off", // 关闭生成器函数星号周围空格的规则。
    "no-unreachable": "off", // 允许不可达代码。
    "no-unused-vars": "error", // 错误级别的检查，报告未使用的变量定义，与Vue规则中的重复。
    "no-case-declarations": "off", // 允许在case语句中声明变量。
    "no-console": "off", // 允许使用console.log等console方法。
    "no-redeclare": "off", // 允许变量的重复声明
    "no-mixed-spaces-and-tabs": "off", // 允许代码中同时使用空格和制表符进行缩进
  },
};
```

## 6.继承现有规则

继承现有规则，可以减少重复的规则配置，提高代码的复用性。例如，使用 airbnb 规则集，可以减少很多重复的规则配置。

```bash
# 安装airbnb 规则
npm i -D eslint-config-aribnb
```

```js
// .eslintrc.js
module.exports = {
  extends: "airbnb",
};
```

## 7.总结

ESLint 是一个强大且灵活的工具，它不仅有助于捕捉代码中的错误，还能促进团队内部的编码一致性。通过合理的配置和适当的插件选择，你可以根据项目的具体需求定制出理想的代码检查方案。无论是个人项目还是大型企业应用，ESLint 都能显著提升代码质量，减少维护成本，并增强协作效率。
