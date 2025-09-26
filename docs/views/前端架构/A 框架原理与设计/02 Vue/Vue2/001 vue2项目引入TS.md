# vue2 项目引入 TS

为 Vue 2 项目单独引入 TypeScript（不升级到 Vue 3），只需安装必要依赖并配置类型检查，以下是具体步骤：

## **一、安装核心依赖**

在项目根目录执行命令，安装 TypeScript 及 Vue 2 类型支持：

```bash
# 1. 安装 TypeScript 核心包
npm install typescript --save-dev

# 2. Vue 2 类组件支持（用于在 TS 中编写 Vue 组件）
npm install vue-class-component vue-property-decorator --save-dev

# 3. 类型声明文件（Vue 2 及常用库的类型定义）
npm install @types/vue @types/vue-router @types/vuex @types/node --save-dev

# 4. Webpack 编译工具（处理 .ts 和 .vue 文件）
npm install ts-loader fork-ts-checker-webpack-plugin --save-dev
```

- **核心作用**：
  - `vue-class-component`：允许用类语法编写 Vue 组件（适配 Vue 2）；
  - `vue-property-decorator`：提供 `@Prop`、`@Watch` 等装饰器，简化组件写法；
  - `ts-loader`：将 TypeScript 编译为 JavaScript；
  - 类型声明文件（`@types/*`）：为 Vue 2、路由、Vuex 提供类型检查支持。

## **二、创建 TypeScript 配置文件**

在项目根目录新建 `tsconfig.json`，配置编译规则（适配 Vue 2）：

```json
{
  "compilerOptions": {
    "target": "es5", // 编译为 ES5（兼容 Vue 2 运行时）
    "module": "esnext",
    "strict": true, // 开启严格类型检查（关键）
    "jsx": "preserve",
    "importHelpers": true,
    "moduleResolution": "node",
    "experimentalDecorators": true, // 启用装饰器（必须，支持 @Component 等）
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "sourceMap": true,
    "baseUrl": ".",
    "types": [
      "vue", // Vue 2 类型
      "vue-router",
      "vuex",
      "node"
    ],
    "paths": {
      "@/*": ["src/*"] // 匹配 Vue 项目常用的 @ 别名
    },
    "lib": ["esnext", "dom", "dom.iterable"]
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.tsx",
    "src/**/*.vue", // 包含 .vue 文件
    "tests/**/*"
  ],
  "exclude": ["node_modules"]
}
```

## **三、声明 Vue 模块类型**

新建 `src/shims-vue.d.ts`，告诉 TypeScript 如何识别 `.vue` 文件：

```typescript
// 声明 .vue 文件模块
declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

// 可选：声明其他静态资源类型（如图片、样式）
declare module "*.png";
declare module "*.jpg";
declare module "*.css";
declare module "*.scss";
```

## **四、修改 Webpack 配置（非 Vue CLI 项目）**

如果项目是手动配置的 Webpack，需在 `webpack.config.js` 中添加 TS 支持：

```javascript
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

module.exports = {
  resolve: {
    // 增加 .ts 扩展名解析
    extensions: [".ts", ".js", ".vue", ".json"],
  },
  module: {
    rules: [
      // 处理 TypeScript 文件
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/], // 允许 .vue 文件中使用 TS
          transpileOnly: true, // 仅转译，类型检查交给插件
        },
      },
      // 确保已配置 vue-loader 处理 .vue 文件
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
    ],
  },
  plugins: [
    // 启用 TypeScript 类型检查（独立进程，不阻塞编译）
    new ForkTsCheckerWebpackPlugin(),
  ],
};
```

**如果是 Vue CLI 项目**：  
无需手动配置 Webpack，执行以下命令一键集成（会自动处理配置）：

```bash
vue add typescript
```

（过程中会提示是否使用 `class-style component syntax`，选择 `Yes` 即可）

## **五、修改入口文件**

将 `src/main.js` 重命名为 `src/main.ts`（内容不变，TypeScript 兼容 JS 语法）：

```typescript
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
```

## **六、编写第一个 TypeScript 组件**

创建 `src/components/HelloTs.vue`，使用 TS 类式语法写法：

```vue
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="increment">计数: {{ count }}</button>
  </div>
</template>

<script lang="ts">
  import Vue from "vue";
  import { Component, Prop } from "vue-property-decorator";

  // 用 @Component 标记为 Vue 组件
  @Component
  export default class HelloTs extends Vue {
    // 定义 Prop（通过装饰器指定类型和约束）
    @Prop({ type: String, required: true })
    msg!: string; // `!` 表示非空断言（告诉 TS 该值会被传入）

    // 定义数据（直接作为类属性）
    count: number = 0;

    // 定义方法（作为类方法）
    increment(): void {
      this.count++;
    }

    // 生命周期钩子（直接作为类方法）
    mounted(): void {
      console.log("组件挂载完成");
    }
  }
</script>
```

## **七、运行项目**

执行启动命令，TypeScript 会自动动编译并检查类型：

```bash
npm run serve
```

若有类型错误（如变量类型不匹配、未定义变量），终端会显示具体错误位置，修复后即可正常运行。

## **关键说明**

1. **完全兼容 Vue 2**：所有改动均基于 Vue 2 生态，无需升级到 Vue 3；
2. **逐步迁移**：无需一次性将所有 `.js` 文件改为 `.ts`，可新组件用 TS，旧组件保持 JS 逐步迁移；
3. **Vuex 集成**：若使用 Vuex，推荐安装 `vuex-module-decorators` 简化 TS 写法：
   ```bash
   npm install vuex-module-decorators --save-dev
   ```

通过以上步骤，即可在 Vue 2 项目中引入 TypeScript，享受静态类型检查带来的代码健壮性提升，同时保持对 Vue 2 生态的完全兼容。
