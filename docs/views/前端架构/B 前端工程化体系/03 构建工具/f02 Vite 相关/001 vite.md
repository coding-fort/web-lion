# vite

Vite 是新一代前端构建工具，由 Vue.js 作者尤雨溪于 2021 年推出，旨在解决传统构建工具（如 Webpack）在大型项目中启动慢、热更新卡顿的问题。以下从核心概念、配置、生态到优化策略，系统梳理 Vite 的核心知识点：

## 一、核心概念（理解 Vite 的基础）

### 1. **开发环境：基于原生 ESM**

- **传统构建工具痛点**：Webpack 等工具在开发环境需要 **预打包所有模块**（即使未修改的模块也需重新构建），导致启动慢、热更新延迟高。
- **Vite 解决方案**：
  - **无需预打包**：利用浏览器原生支持的 ES 模块（ESM），直接让浏览器解析模块依赖。
  - **按需编译**：仅在浏览器请求某个模块时才进行编译（如 TS→JS、JSX→JS），且通过 `esbuild`（Go 语言编写，速度极快）完成转译。
  - **热更新极速**：基于原生 ESM 的 **模块热替换（HMR）**，仅更新修改的模块，无需重新加载整个应用。

### 2. **生产环境：基于 Rollup 打包**

- **为什么用 Rollup？**  
  Rollup 专注于 ES 模块打包，输出代码更简洁（无冗余运行时），Tree-shaking 能力更强，适合生产环境优化。
- **Vite 优化**：
  - 内置 **代码分割**（基于动态导入 `import()`）、**CSS 分割**、**资源内联** 等优化。
  - 支持 **预加载策略**（通过 `<link rel="modulepreload">` 加速资源加载）。

### 3. **插件系统**

- **兼容 Rollup 插件**：Vite 基于 Rollup 插件体系，多数 Rollup 插件可直接在 Vite 中使用（需通过 `vite-plugin-rollup` 包装）。
- **Vite 专属插件**：针对开发环境优化（如 HMR 增强、虚拟模块），例如：
  - `@vitejs/plugin-react`：支持 React 开发（含 HMR）。
  - `@vitejs/plugin-vue`：支持 Vue 3 开发。
  - `vite-plugin-pwa`：支持渐进式 Web 应用（PWA）。

## 二、核心配置与功能

### 1. **基础配置文件（`vite.config.js`）**

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()], // 插件配置
  root: "./src", // 项目根目录（index.html 所在位置）
  base: "/", // 生产环境基础路径（如部署到 CDN 时修改）
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  build: {
    outDir: "../dist", // 打包输出目录
    minify: "terser", // 压缩工具（terser 体积更小，esbuild 速度更快）
    terserOptions: {
      compress: {
        drop_console: true, // 生产环境删除 console
      },
    },
  },
});
```

### 2. **静态资源处理**

- **导入方式**：
  ```javascript
  import imgUrl from "./assets/logo.png"; // 作为 URL 导入
  import txt from "./data.txt?raw"; // 作为文本导入（通过 ?raw 后缀）
  ```
- **资源内联**：
  ```javascript
  import smallImg from "./small.png?inline"; // 强制内联为 Base64
  ```
- **配置别名**：
  ```javascript
  export default defineConfig({
    resolve: {
      alias: {
        "@": "/src", // 配置 @ 指向 src 目录
      },
    },
  });
  ```

### 3. **环境变量与模式**

- **模式（Mode）**：
  - 默认支持 `development`（开发）、`production`（生产）、`test`（测试）三种模式。
  - 通过 `vite --mode staging` 命令指定模式。
- **环境变量文件**：
  - `.env`：所有环境共享。
  - `.env.development`：开发环境。
  - `.env.production`：生产环境。
- **使用方式**：

  ```javascript
  // .env.development
  VITE_API_URL = "http://dev-api.example.com";

  // 代码中访问
  console.log(import.meta.env.VITE_API_URL); // 输出: http://dev-api.example.com
  ```

## 三、高级特性

### 1. **模块热替换（HMR）**

- **自动支持**：Vite 内置 HMR，修改代码后仅更新变化的模块，保留应用状态。
- **框架集成**：
  - **React**：通过 `@vitejs/plugin-react` 支持 Fast Refresh。
  - **Vue**：通过 `@vitejs/plugin-vue` 支持单文件组件（SFC）的 HMR。
- **自定义 HMR 逻辑**：
  ```javascript
  if (import.meta.hot) {
    import.meta.hot.accept((newModule) => {
      // 自定义更新逻辑
    });
  }
  ```

### 2. **SSR（服务器端渲染）**

- **内置支持**：Vite 提供 `createServer` 和 `createRenderer` API，支持构建 SSR 应用。
- **框架集成**：
  - **Vue**：Vue 3 的官方 SSR 解决方案基于 Vite。
  - **React**：配合 `@vitejs/plugin-react` 和 Node.js 服务器实现 SSR。

### 3. **库模式（Library Mode）**

- **打包库文件**：
  ```javascript
  // vite.config.js
  export default defineConfig({
    build: {
      lib: {
        entry: "./src/index.js",
        name: "MyLibrary",
        fileName: (format) => `my-library.${format}.js`,
      },
    },
  });
  ```
- **自动生成类型声明**：配合 `tsconfig.json` 的 `declaration: true` 生成 .d.ts 文件。

## 四、性能优化策略

### 1. **开发环境优化**

- **预构建依赖**：  
  Vite 启动时会自动预构建第三方依赖（如 `react`、`vue`），生成 ESM 格式的缓存文件，加速后续启动。
  ```javascript
  // vite.config.js
  export default defineConfig({
    optimizeDeps: {
      include: ["lodash-es"], // 指定需要预构建的依赖
    },
  });
  ```
- **禁用预构建**：
  ```javascript
  optimizeDeps: {
    disabled: true; // 开发环境禁用依赖预构建（不推荐）
  }
  ```

### 2. **生产环境优化**

- **CSS 分割与压缩**：  
  Vite 自动分割 CSS（每个异步 chunk 对应一个 CSS 文件），并通过 `css-minimizer` 压缩。
- **图片优化**：  
  推荐使用第三方插件（如 `vite-plugin-imagemin`）压缩图片：

  ```javascript
  import { defineConfig } from "vite";
  import viteImagemin from "vite-plugin-imagemin";

  export default defineConfig({
    plugins: [
      viteImagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 80 },
      }),
    ],
  });
  ```

- **代码分割**：  
  使用动态导入（`import()`）实现按需加载：
  ```javascript
  // 懒加载组件
  const loadComponent = async () => {
    const { MyComponent } = await import("./MyComponent.js");
    return MyComponent;
  };
  ```

## 五、生态与常用插件

### 1. **官方插件**

- `@vitejs/plugin-react`：React 支持（含 Fast Refresh）。
- `@vitejs/plugin-vue`：Vue 3 支持。
- `@vitejs/plugin-vue-jsx`：Vue JSX 支持。
- `@vitejs/plugin-legacy`：旧浏览器兼容（生成传统浏览器 bundle）。

### 2. **社区热门插件**

- `vite-plugin-pwa`：支持 PWA（离线缓存、推送通知）。
- `vite-plugin-svg-icons`：SVG 图标合并为雪碧图。
- `vite-plugin-mock`：开发环境 API 模拟。
- `vite-plugin-compression`：生成压缩文件（如 .gz、.br）。
- `vite-tsconfig-paths`：支持 tsconfig.json 中的路径别名。

### 3. **集成框架**

- **React**：
  ```bash
  npm init vite@latest my-react-app -- --template react
  ```
- **Vue**：
  ```bash
  npm init vite@latest my-vue-app -- --template vue
  ```
- **其他框架**：Svelte、Preact、Lit 等均有官方模板。

## 六、常见问题与解决方案

1. **依赖预构建失败**：

   - 原因：某些依赖的 ESM 格式不规范。
   - 解决方案：
     ```javascript
     // vite.config.js
     optimizeDeps: {
       include: ["problematic-dep"]; // 强制预构建有问题的依赖
     }
     ```

2. **生产环境体积过大**：

   - 检查未使用的依赖（通过 `vite-plugin-inspect` 分析）。
   - 确保 Tree-shaking 生效（使用 ESM 语法，避免 CommonJS）。

3. **HMR 不生效**：

   - 确保使用官方推荐的框架插件（如 `@vitejs/plugin-react`）。
   - 检查是否有全局状态管理库（如 Redux）干扰 HMR。

4. **CSS 处理异常**：
   - 使用 `postcss` 插件处理 CSS（如 autoprefixer）：
     ```javascript
     // postcss.config.js
     module.exports = {
       plugins: {
         autoprefixer: {},
       },
     };
     ```

## 七、Vite vs Webpack

| 维度                 | Vite                                  | Webpack                        |
| -------------------- | ------------------------------------- | ------------------------------ |
| **开发环境启动速度** | 极快（毫秒级，无需预打包）            | 慢（需预打包所有模块）         |
| **热更新速度**       | 极速（仅更新修改的模块）              | 中等（需重新构建依赖链）       |
| **配置复杂度**       | 低（开箱即用，默认最佳实践）          | 高（需手动配置 Loader/Plugin） |
| **生态成熟度**       | 快速增长（兼容多数 Rollup 插件）      | 极其成熟（1000+ 插件）         |
| **适用场景**         | 现代前端项目（Vue/React）、中小型项目 | 复杂大型项目、需高度定制       |
| **浏览器兼容性**     | 现代浏览器优先（依赖 ESM）            | 全兼容（可通过 Babel 转译）    |

## 总结

Vite 通过 **原生 ESM + esbuild** 解决了传统构建工具的性能瓶颈，尤其适合现代前端项目（Vue/React/Svelte 等）。其核心优势在于 **开发体验极致流畅**、**配置简单**，同时生产环境性能不逊色于 Webpack。建议新项目优先考虑 Vite，旧项目迁移时需评估兼容性（如是否依赖 Webpack 专属插件）。
