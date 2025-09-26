# Vite 配置

Vite 的配置通过 `vite.config.js`（或 `.ts`）文件完成，支持丰富的选项以满足不同场景需求。以下从基础配置到高级优化，系统梳理 Vite 的核心配置项及最佳实践：

## 一、基础配置结构

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  // 项目根目录（index.html 所在位置）
  root: process.cwd(),

  // 生产环境基础路径
  base: "/", // 默认为 '/'，如部署到 CDN 可改为 'https://cdn.example.com/'

  // 模式配置
  mode: "development", // 或 'production'，也可通过命令行参数指定

  // 插件配置
  plugins: [react()],

  // 静态资源服务的文件夹
  publicDir: "public",

  // 解析配置
  resolve: {
    // 路径别名
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
    },

    // 导入时可以忽略的扩展名
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json", ".vue"],
  },

  // 开发服务器配置
  server: {
    port: 3000,
    host: "0.0.0.0", // 支持从外部访问
    open: true, // 自动打开浏览器
    https: false, // 是否启用 HTTPS

    // 代理配置
    proxy: {
      "/api": {
        target: "http://localhost:4000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  // 构建配置
  build: {
    outDir: "dist", // 输出目录
    assetsDir: "assets", // 静态资源目录
    sourcemap: false, // 是否生成 sourcemap

    // 打包大小警告限制（单位 kb）
    chunkSizeWarningLimit: 1000,

    // 生产环境移除 console/debugger
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },

    // 自定义底层的 Rollup 打包配置
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        nested: path.resolve(__dirname, "nested/index.html"), // 多入口配置
      },

      // 手动分割代码
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"], // 将 React 相关模块打包到单独的 vendor chunk
        },
      },
    },
  },

  // CSS 配置
  css: {
    // 配置 CSS modules 的类名生成规则
    modules: {
      localsConvention: "camelCaseOnly", // 类名转换为驼峰式
    },

    // 预处理器选项
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`, // 自动导入全局样式
      },
    },

    // 启用 CSS sourcemap
    devSourcemap: true,
  },

  // 依赖优化配置
  optimizeDeps: {
    include: ["lodash-es", "axios"], // 强制预构建的依赖
    exclude: ["@loadable/component"], // 排除在预构建之外的依赖
  },
});
```

## 二、高级配置选项

### 1. **环境变量与模式**

- **模式（Mode）**：  
  通过 `vite --mode staging` 命令指定模式，默认支持 `development`、`production`、`test`。

- **环境变量文件**：

  - `.env`：所有环境共享。
  - `.env.development`：开发环境。
  - `.env.production`：生产环境。
  - `.env.local`：本地私有环境变量（会被 git 忽略）。

- **变量前缀**：  
  只有以 `VITE_` 开头的变量才能通过 `import.meta.env.VITE_XXX` 访问。

- **自定义环境变量**：
  ```javascript
  // vite.config.js
  export default defineConfig(({ mode }) => {
    if (mode === "development") {
      return {
        define: {
          __APP_ENV__: JSON.stringify("development"),
        },
      };
    } else {
      return {
        define: {
          __APP_ENV__: JSON.stringify("production"),
        },
      };
    }
  });
  ```

### 2. **构建优化**

- **懒加载策略**：

  ```javascript
  build: {
    rollupOptions: {
      output: {
        // 自定义 chunk 文件名
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  }
  ```

- **拆分 vendor chunk**：

  ```javascript
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // 将所有 node_modules 模块打包到 vendor.js
          }
        }
      }
    }
  }
  ```

- **压缩策略**：
  ```javascript
  build: {
    minify: 'esbuild', // 速度快（默认）
    // 或
    minify: 'terser', // 体积小
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
  ```

### 3. **开发服务器配置**

- **HMR 配置**：

  ```javascript
  server: {
    hmr: {
      protocol: 'ws', // 使用 WebSocket 协议
      host: 'localhost',
      port: 3000,
      overlay: true // 编译错误时在浏览器显示遮罩层提示
    }
  }
  ```

- **CORS 配置**：

  ```javascript
  server: {
    cors: {
      origin: '*',
      methods: 'GET,POST,PUT,DELETE,OPTIONS'
    }
  }
  ```

- **HTTPS 配置**：
  ```javascript
  server: {
    https: {
      key: fs.readFileSync(path.join(__dirname, 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'cert.pem'))
    }
  }
  ```

### 4. **静态资源处理**

- **资源导入**：

  ```javascript
  // 导入图片作为 URL
  import imgUrl from "./assets/logo.png";

  // 导入为文本
  import txt from "./data.txt?raw";

  // 强制内联为 Base64
  import smallImg from "./small.png?inline";
  ```

- **资源优化**：
  ```javascript
  // vite.config.js
  build: {
    assetsInlineLimit: 4096, // 小于 4KB 的资源内联为 Base64
    brotliSize: true, // 显示 brotli 压缩后的大小
    emptyOutDir: true // 打包前清空输出目录
  }
  ```

### 5. **插件配置**

- **使用官方插件**：

  ```javascript
  import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";
  import vue from "@vitejs/plugin-vue";

  export default defineConfig({
    plugins: [
      react(), // React 支持
      vue(), // Vue 支持
    ],
  });
  ```

- **使用社区插件**：

  ```javascript
  import { defineConfig } from "vite";
  import eslintPlugin from "vite-plugin-eslint";
  import svgLoader from "vite-svg-loader";

  export default defineConfig({
    plugins: [
      eslintPlugin(), // ESLint 检查
      svgLoader(), // 支持导入 SVG 为组件
    ],
  });
  ```

### 6. **SSR 配置**

- **基础配置**：

  ```javascript
  // vite.config.js
  export default defineConfig({
    ssr: {
      // 外部化处理不应该被 SSR 打包的依赖
      external: ["axios"],

      // 提供自定义的 SSR 入口
      noExternal: ["@loadable/component"],
    },
  });
  ```

- **SSR 插件示例**：

  ```javascript
  import { defineConfig } from "vite";
  import ssr from "vite-plugin-ssr/plugin";

  export default defineConfig({
    plugins: [ssr()],
  });
  ```

## 三、条件配置与动态配置

- **根据模式动态配置**：

  ```javascript
  export default defineConfig(({ command, mode }) => {
    if (command === "serve") {
      return {
        // 开发环境配置
        define: {
          __API_BASE__: JSON.stringify("http://dev-api.example.com"),
        },
      };
    } else {
      return {
        // 生产环境配置
        define: {
          __API_BASE__: JSON.stringify("https://api.example.com"),
        },
      };
    }
  });
  ```

- **异步配置**：
  ```javascript
  export default defineConfig(async () => {
    const { default: somePlugin } = await import("some-plugin");
    return {
      plugins: [somePlugin()],
    };
  });
  ```

## 四、性能优化配置

- **依赖预构建**：

  ```javascript
  optimizeDeps: {
    // 强制预构建的依赖
    include: ['react', 'react-dom', 'lodash-es'],

    // 自定义预构建的 esbuild 选项
    esbuildOptions: {
      plugins: [
        // 例如，使用 esbuild 插件压缩依赖
        // 注意：可能会影响调试体验
        {
          name: 'compress-deps',
          setup(build) {
            build.onEnd(() => {
              console.log('依赖预构建完成');
            });
          }
        }
      ]
    }
  }
  ```

- **构建缓存**：
  ```javascript
  build: {
    // 启用缓存
    cache: true,

    // 自定义缓存目录
    cacheDir: 'node_modules/.vite'
  }
  ```

## 五、常见问题配置方案

1. **处理 CSS Modules 命名冲突**：

   ```javascript
   css: {
     modules: {
       generateScopedName: '[name]__[local]___[hash:base64:5]',
       hashPrefix: 'prefix'
     }
   }
   ```

2. **配置别名解析**：

   ```javascript
   resolve: {
     alias: [
       { find: "@", replacement: path.resolve(__dirname, "src") },
       {
         find: "components",
         replacement: path.resolve(__dirname, "src/components"),
       },
     ];
   }
   ```

3. **配置 TypeScript 路径映射**：

   ```javascript
   // vite.config.js
   import tsconfigPaths from 'vite-tsconfig-paths';

   export default defineConfig({
     plugins: [tsconfigPaths()]
   });

   // tsconfig.json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```

4. **配置代理处理跨域**：
   ```javascript
   server: {
     proxy: {
       // 简单代理
       '/api': 'http://localhost:4000',

       // 复杂代理
       '/socket.io': {
         target: 'ws://localhost:4000',
         ws: true,
         rewrite: (path) => path.replace(/^\/socket.io/, '')
       },

       // 使用正则表达式的代理
       '^/fallback/.*': {
         target: 'http://localhost:4000',
         changeOrigin: true,
         rewrite: (path) => path.replace(/^\/fallback/, '')
       }
     }
   }
   ```

## 六、最佳实践总结

1. **使用 `defineConfig` 辅助函数**：  
   提供类型提示，避免拼写错误。

2. **保持配置简洁**：  
   Vite 默认配置已针对多数场景优化，避免过度配置。

3. **利用插件生态**：  
   优先使用官方插件，社区插件按需引入，避免插件冲突。

4. **区分环境配置**：  
   通过 `.env` 文件和 `mode` 区分开发/生产环境，避免硬编码环境变量。

5. **性能敏感场景优化**：

   - 开发环境：启用依赖预构建、HMR。
   - 生产环境：启用代码分割、压缩、懒加载。

6. **调试技巧**：  
   使用 `vite-plugin-inspect` 分析构建过程，检查模块依赖和资源处理情况。

通过合理配置，Vite 能在保持开发体验流畅的同时，生成高性能的生产包，是现代前端项目的理想选择。
