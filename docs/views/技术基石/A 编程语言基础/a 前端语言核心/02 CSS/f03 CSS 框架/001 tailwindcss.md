# 一、零基础入门：认识并上手 Tailwind CSS

## 1. 什么是 [Tailwind CSS](https://tailwindcss.com/)？

Tailwind CSS 是一款**实用优先（Utility-First）** 的原子化 CSS 框架，和 Bootstrap、Element UI 这类「组件式框架」不同：

- 组件式框架：提供现成的 `btn`、`card` 等封装好的组件类，直接用但灵活性低；
- Tailwind：提供最细粒度的「原子类」（比如 `bg-red-500` 对应背景色、`p-4` 对应内边距），你可以像「搭积木」一样在 HTML 中组合这些类，完全自定义样式，无需写大量传统 CSS。

## 2. 快速安装（新手友好）

### 方式 1：CDN 引入（快速尝鲜，不推荐生产环境）

直接在 HTML 中引入 CDN，无需配置，开箱即用（缺点：无法自定义配置、体积大）：

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <title>Tailwind 快速尝鲜</title>
    <!-- 引入 Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <!-- 测试：用原子类写一个按钮 -->
    <button class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
      测试按钮
    </button>
  </body>
</html>
```

### 方式 2：NPM 安装（推荐生产环境）

适合前端工程化项目（Vue/React/纯 HTML 项目均可），步骤如下：

```bash
# 1. 初始化项目（无 package.json 时执行）
npm init -y

# 2. 安装依赖
npm install -D tailwindcss postcss autoprefixer

# 3. 生成配置文件（tailwind.config.js + postcss.config.js）
npx tailwindcss init -p
```

### 4. 配置 Tailwind

修改 `tailwind.config.js`，指定需要编译的文件路径（确保 Tailwind 能扫描到 HTML/JSX 中的类）：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // 要扫描的文件（根据自己的项目路径调整）
  content: ["./src/**/*.{html,js,vue,jsx}"],
  theme: {
    extend: {}, // 扩展默认配置（进阶用）
  },
  plugins: [],
};
```

### 5. 创建 CSS 入口文件

在 `src/style.css` 中写入 Tailwind 核心指令（会被编译成最终的 CSS）：

```css
/* src/style.css */
@tailwind base; /* 基础样式重置（比如默认的 margin/padding） */
@tailwind components; /* 组件类（可自定义） */
@tailwind utilities; /* 核心原子类（比如 p-4、bg-red-500） */
```

### 6. 引入并构建

- 在 HTML 中引入编译后的 CSS：
  ```html
  <link href="./dist/output.css" rel="stylesheet" />
  ```
- 启动编译命令（开发环境实时更新）：

  ```bash
  # 开发环境：实时监听文件变化并编译
  npx tailwindcss -i ./src/style.css -o ./dist/output.css --watch

  # 生产环境：压缩 CSS 体积
  npx tailwindcss -i ./src/style.css -o ./dist/output.css --minify
  ```

## 3. 基础使用：核心原子类

Tailwind 的核心是「原子类」，每个类对应一个 CSS 属性，常用分类如下：

| 类别 | 示例类名                    | 对应 CSS 效果                                     |
| ---- | --------------------------- | ------------------------------------------------- |
| 间距 | `p-4`、`m-2`、`mt-6`        | padding: 1rem、margin: 0.5rem、margin-top: 1.5rem |
| 颜色 | `bg-blue-500`、`text-white` | background: #3b82f6、color: #fff                  |
| 排版 | `text-xl`、`font-bold`      | font-size: 1.25rem、font-weight: 700              |
| 布局 | `flex`、`grid`、`block`     | display: flex、display: grid、display: block      |
| 圆角 | `rounded`、`rounded-lg`     | border-radius: 0.25rem、0.5rem                    |
| 阴影 | `shadow`、`shadow-lg`       | box-shadow: 基础阴影、大阴影                      |

**示例：用 Tailwind 写一个卡片**

```html
<div class="w-80 bg-white rounded-lg shadow p-6 mx-auto mt-10">
  <h3 class="text-xl font-bold text-gray-800 mb-2">Tailwind 卡片</h3>
  <p class="text-gray-600">这是用原子类组合的卡片样式，无需写任何 CSS！</p>
  <button
    class="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
  >
    点击按钮
  </button>
</div>
```

---

# 二、进阶使用：解锁 Tailwind 核心能力

## 1. 自定义配置（个性化主题）

通过 `tailwind.config.js` 扩展/覆盖默认主题（颜色、字体、间距等），满足业务定制需求：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    // extend：在默认配置上追加（推荐）；直接写会覆盖默认配置
    extend: {
      // 自定义颜色
      colors: {
        primary: "#165DFF", // 业务主色
        secondary: "#FF7D00", // 辅助色
      },
      // 自定义间距
      spacing: {
        128: "32rem", // 新增 w-128 类，对应 width: 32rem
      },
      // 自定义字体
      fontFamily: {
        sans: ["Inter", "微软雅黑", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

配置后即可使用 `bg-primary`、`w-128`、`font-sans` 等自定义类。

## 2. 响应式设计（适配多端）

Tailwind 内置移动端优先的断点，通过「断点前缀:类名」实现响应式：
| 断点前缀 | 屏幕宽度 | 说明 |
|----------|----------|------------|
| 无 | <640px | 移动端默认 |
| sm | ≥640px | 小屏手机 |
| md | ≥768px | 平板 |
| lg | ≥1024px | 笔记本 |
| xl | ≥1280px | 大屏显示器 |

**示例：响应式布局**

```html
<!-- 移动端：垂直排列；平板及以上：水平排列 -->
<div class="flex flex-col md:flex-row gap-4 p-4">
  <div class="bg-primary text-white p-4 rounded md:w-1/2">左侧区域</div>
  <div class="bg-secondary text-white p-4 rounded md:w-1/2">右侧区域</div>
</div>
```

## 3. 伪类/伪元素（hover/focus 等）

通过「伪类前缀:类名」实现交互效果，常用前缀：

- `hover:`：鼠标悬浮
- `focus:`：元素聚焦
- `active:`：元素激活
- `first-child:`：第一个子元素
- `before/after:`：伪元素

**示例：交互按钮 + 聚焦输入框**

```html
<!-- 悬浮变色、点击加深的按钮 -->
<button
  class="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 active:bg-primary/80"
>
  交互按钮
</button>

<!-- 聚焦时有边框和阴影的输入框 -->
<input
  class="border border-gray-300 rounded px-3 py-2 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
  placeholder="请输入内容"
/>
```

## 4. @apply：抽离重复类组合

如果某组类重复使用（比如多个按钮样式一致），用 `@apply` 抽离成自定义类，兼顾原子化和可维护性：

```css
/* src/style.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 自定义按钮类 */
.btn-primary {
  @apply bg-primary text-white px-4 py-2 rounded hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20;
}

/* 自定义卡片类 */
.card {
  @apply bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow;
}
```

使用时直接写 `class="btn-primary"` 即可，无需重复写一堆原子类。

## 5. JIT 模式（即时编译，Tailwind 3+ 默认开启）

JIT（Just-in-Time）模式是 Tailwind 3 的核心优化：

- 按需编译：只编译你实际使用的类，CSS 体积大幅减小；
- 支持任意值：可以直接写 `w-[200px]`、`bg-[#123456]`、`text-[18px]` 这类自定义值，无需改配置。

**示例：任意值使用**

```html
<!-- 自定义宽度、背景色、字体大小 -->
<div class="w-[250px] bg-[#F5F7FA] text-[17px] p-[15px] rounded">
  任意值样式，无需配置！
</div>
```

## 6. 插件扩展（增强功能）

Tailwind 提供官方插件，快速扩展能力：

```bash
# 安装常用插件：表单美化 + 富文本排版
npm install -D @tailwindcss/forms @tailwindcss/typography
```

在 `tailwind.config.js` 中注册：

```js
module.exports = {
  // ...其他配置
  plugins: [
    require("@tailwindcss/forms"), // 美化原生表单
    require("@tailwindcss/typography"), // 富文本（文章）排版
  ],
};
```

使用示例（富文本排版）：

```html
<article class="prose max-w-none mx-auto p-4">
  <h1>Tailwind 富文本排版</h1>
  <p>这是一段富文本内容，prose 类会自动美化标题、段落、列表等样式。</p>
  <ul>
    <li>列表项 1</li>
    <li>列表项 2</li>
  </ul>
</article>
```

---

# 三、最佳实践（避坑+提效）

1. **编辑器插件**：安装 VSCode 的「Tailwind CSS IntelliSense」，提供类名自动补全、实时预览、错误提示，大幅提升开发效率；
2. **避免过度原子化**：重复使用的样式用 `@apply` 抽离，不要让 HTML 里的 class 堆成一串（比如 20+ 个类），影响可读性；
3. **生产环境优化**：执行 `--minify` 命令压缩 CSS，Tailwind 会自动剔除未使用的类，最终 CSS 体积通常只有几 KB；
4. **语义化平衡**：不要完全抛弃语义化，比如用 `class="btn-primary"` 比 `class="bg-blue-500 px-4..."` 更易维护，尤其是团队协作时。

---

## 总结

1. Tailwind 核心是**原子化实用类**，通过「搭积木」的方式在 HTML 中实现样式，无需编写大量自定义 CSS，灵活性远超传统组件框架；
2. 进阶核心是**自定义配置 + 响应式 + 伪类 + JIT 模式**，`@apply` 可抽离重复类组合，插件能快速扩展功能；
3. 最佳实践是**开启 JIT + 安装编辑器插件 + 生产环境压缩**，平衡原子化的灵活性和代码的可维护性。

从 CDN 尝鲜到 NPM 工程化配置，再到自定义主题和插件扩展，按这个路径练习，就能快速从入门到精通 Tailwind CSS。
