# Vite 优化

Vite 的优化策略需从 **开发体验** 和 **生产性能** 两个维度展开，以下是具体优化方案：

## 一、开发环境优化（加速启动与热更新）

### 1. **依赖预构建优化**

- **强制预构建特定依赖**：

  ```javascript
  // vite.config.js
  export default defineConfig({
    optimizeDeps: {
      include: ["lodash-es", "dayjs"], // 预构建体积大或依赖深的模块
      exclude: ["@loadable/component"], // 排除无需预构建的模块
    },
  });
  ```

- **自定义预构建行为**：
  ```javascript
  optimizeDeps: {
    esbuildOptions: {
      target: 'esnext', // 使用最新 ES 特性加速转译
      plugins: [
        // 自定义插件处理特殊模块
        {
          name: 'load-js-as-jsx',
          setup(build) {
            build.onLoad({ filter: /node_modules\/.*\.js$/ }, async (args) => {
              return { loader: 'jsx' };
            });
          }
        }
      ]
    }
  }
  ```

### 2. **禁用不必要的插件**

```javascript
// 开发环境跳过某些插件
export default defineConfig(({ command }) => {
  const plugins = [react()];
  if (command === "build") {
    plugins.push(compressionPlugin()); // 仅生产环境使用压缩插件
  }
  return { plugins };
});
```

### 3. **HMR 优化**

- **限制 HMR 范围**：

  ```javascript
  // 避免全局状态库触发全量更新
  if (import.meta.hot) {
    import.meta.hot.accept(() => {
      // 手动处理更新逻辑，避免刷新整个应用
    });
  }
  ```

- **使用 fast-refresh 插件**：

  ```bash
  # React
  npm install @vitejs/plugin-react -D

  # Vue
  npm install @vitejs/plugin-vue -D
  ```

## 二、生产环境优化（减小包体积、加速加载）

### 1. **代码分割与懒加载**

- **动态导入组件**：

  ```javascript
  // 路由懒加载
  const loadComponent = async () => {
    const { MyComponent } = await import("./MyComponent.js");
    return MyComponent;
  };
  ```

- **手动分割 vendor chunk**：
  ```javascript
  // vite.config.js
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'axios'], // 分离第三方库
          utils: ['lodash-es', 'dayjs'] // 分离工具函数
        }
      }
    }
  }
  ```

### 2. **Tree-shaking 增强**

- **确保使用 ESM 格式依赖**：  
  优先选择提供 ESM 版本的库（如 `lodash-es` 替代 `lodash`）。

- **移除未使用的 CSS**：

  ```javascript
  // 安装 purgecss 插件
  import purgecss from "vite-plugin-purgecss";

  export default defineConfig({
    plugins: [
      purgecss({
        content: ["src/**/*.html", "src/**/*.jsx", "src/**/*.tsx"],
      }),
    ],
  });
  ```

### 3. **资源优化**

- **图片压缩**：

  ```javascript
  import viteImagemin from "vite-plugin-imagemin";

  export default defineConfig({
    plugins: [
      viteImagemin({
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 80 },
        pngquant: { quality: [0.65, 0.9], speed: 4 },
        svgo: { plugins: [{ removeViewBox: false }, { cleanupIDs: false }] },
      }),
    ],
  });
  ```

- **字体优化**：
  ```javascript
  // 按需加载字体
  import("@fontsource/roboto/300.css");
  import("@fontsource/roboto/400.css");
  ```

### 4. **压缩与混淆**

- **使用 Terser 替代 esbuild**：

  ```javascript
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      mangle: {
        properties: {
          regex: /^_/ // 混淆以下划线开头的属性
        }
      }
    }
  }
  ```

- **CSS 压缩**：

  ```javascript
  import { defineConfig } from "vite";
  import cssnano from "cssnano";

  export default defineConfig({
    css: {
      postcss: {
        plugins: [cssnano({ preset: "default" })],
      },
    },
  });
  ```

## 三、构建性能优化

### 1. **多线程构建**

- **使用 esbuild 替代 Babel**：  
  Vite 默认使用 esbuild 转译 JS/TS，无需额外配置。

- **并行处理 loader**：
  ```javascript
  // 对于复杂项目，可尝试 thread-loader（需安装）
  {
    test: /\.js$/,
    use: [
      'thread-loader',
      'babel-loader'
    ]
  }
  ```

### 2. **缓存策略**

- **构建缓存**：

  ```javascript
  build: {
    cache: true; // 启用 Vite 内置构建缓存
  }
  ```

- **依赖缓存**：  
  通过 `package-lock.json` 或 `yarn.lock` 锁定依赖版本，避免重复安装。

## 四、高级优化技巧

### 1. **CDN 加载外部资源**

- **生产环境使用 CDN**：

  ```javascript
  // vite.config.js
  export default defineConfig({
    build: {
      rollupOptions: {
        external: ["react", "react-dom"], // 排除这些包不打包
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
        },
      },
    },
  });
  ```

- **在 HTML 中引入 CDN 资源**：
  ```html
  <!-- index.html -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
  ```

### 2. **预加载策略**

- **使用 Preload 插件**：

  ```javascript
  import preload from "vite-plugin-preload";

  export default defineConfig({
    plugins: [preload()],
  });
  ```

### 3. **PWA 支持**

- **离线缓存**：

  ```javascript
  import { VitePWA } from "vite-plugin-pwa";

  export default defineConfig({
    plugins: [
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "apple-touch-icon.png"],
        manifest: {
          name: "My App",
          short_name: "My App",
          description: "My Awesome App",
          theme_color: "#ffffff",
          icons: [
            {
              src: "pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
  });
  ```

## 五、监控与分析工具

### 1. **可视化分析构建结果**

- **使用 BundleAnalyzer**：

  ```javascript
  import { visualizer } from "rollup-plugin-visualizer";

  export default defineConfig({
    plugins: [
      visualizer({
        open: true, // 构建完成后自动打开浏览器查看
        gzipSize: true, // 显示 gzip 压缩后的大小
        brotliSize: true, // 显示 brotli 压缩后的大小
      }),
    ],
  });
  ```

### 2. **性能监控**

- **使用 Lighthouse 测试**：  
  通过 Chrome DevTools 或 CI 集成 Lighthouse，评估性能指标（FCP、LCP、TTI 等）。

## 六、常见问题解决方案

1. **依赖预构建失败**：

   ```javascript
   optimizeDeps: {
     include: ['problematic-dep'], // 强制预构建有问题的依赖
     esbuildOptions: {
       plugins: [
         // 添加自定义插件处理特殊情况
       ]
     }
   }
   ```

2. **CSS 体积过大**：

   - 使用 `purgecss` 移除未使用的 CSS。
   - 避免全局 CSS，使用 CSS Modules 或 CSS-in-JS。

3. **首屏加载慢**：

   - 分析最大的 JS/CSS 块，考虑进一步分割。
   - 使用 `vite-plugin-prefetch` 预加载关键资源。

4. **HMR 失效**：
   - 确保使用官方推荐的框架插件（如 `@vitejs/plugin-react`）。
   - 检查是否有全局状态管理库（如 Redux）干扰 HMR。

## 七、优化策略总结

| 场景         | 优化方法                                                                                |
| ------------ | --------------------------------------------------------------------------------------- |
| **开发环境** | 1. 预构建关键依赖<br>2. 禁用非必要插件<br>3. 使用 fast-refresh 插件<br>4. 限制 HMR 范围 |
| **生产环境** | 1. 代码分割与懒加载<br>2. Tree-shaking 优化<br>3. 图片/字体压缩<br>4. CDN 加载外部资源  |
| **构建性能** | 1. 使用 esbuild 替代 Babel<br>2. 启用构建缓存<br>3. 并行处理 loader                     |
| **监控分析** | 1. 使用 BundleAnalyzer 可视化分析<br>2. 集成 Lighthouse 测试性能指标                    |

通过以上策略，Vite 项目可实现 **开发体验流畅** 和 **生产包体积极致优化** 的双重目标。
