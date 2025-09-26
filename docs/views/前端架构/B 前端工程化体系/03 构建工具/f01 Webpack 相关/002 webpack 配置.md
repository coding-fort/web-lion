# webpack 配置

Webpack 的配置通过 `webpack.config.js` 文件完成，支持丰富的选项以满足不同场景需求。以下从基础配置到高级优化，系统梳理 Webpack 的核心配置项及最佳实践：


## 一、基础配置结构
```javascript
// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  // 模式：development 或 production
  mode: 'development',
  
  // 入口文件
  entry: './src/index.js',
  
  // 输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js', // 带哈希的文件名，用于缓存
    publicPath: '/' // 资源引用的公共路径
  },
  
  // 解析配置
  resolve: {
    // 自动解析扩展名
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    
    // 路径别名
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components')
    }
  },
  
  // 模块处理
  module: {
    rules: [
      // 处理 JS/JSX 文件
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      
      // 处理 CSS 文件
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader, // 提取 CSS 到单独文件
          'css-loader', // 解析 CSS 文件
          'postcss-loader' // 处理 CSS（如添加浏览器前缀）
        ]
      },
      
      // 处理图片
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              outputPath: 'assets/images'
            }
          }
        ]
      },
      
      // 处理字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader']
      }
    ]
  },
  
  // 插件配置
  plugins: [
    // 清理 dist 目录
    new CleanWebpackPlugin(),
    
    // 生成 HTML 文件并注入打包后的资源
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/favicon.ico'
    }),
    
    // 提取 CSS 到单独文件
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })
  ],
  
  // 开发服务器配置
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 3000,
    hot: true, // 启用热更新
    open: true, // 自动打开浏览器
    historyApiFallback: true // 支持单页应用路由
  },
  
  // 性能配置
  performance: {
    hints: false, // 关闭性能警告
    maxEntrypointSize: 512000, // 入口文件最大体积（字节）
    maxAssetSize: 512000 // 单个资源最大体积（字节）
  },
  
  // 开发工具
  devtool: 'inline-source-map' // 生成 source map 便于调试
};
```


## 二、高级配置选项


### 1. **多入口配置（适用于多页应用）**
```javascript
entry: {
  home: './src/pages/home/index.js',
  about: './src/pages/about/index.js',
  contact: './src/pages/contact/index.js'
},

output: {
  filename: '[name].[contenthash].js'
},

plugins: [
  new HtmlWebpackPlugin({
    template: './src/pages/home/index.html',
    filename: 'home.html',
    chunks: ['home'] // 指定引入的 chunk
  }),
  new HtmlWebpackPlugin({
    template: './src/pages/about/index.html',
    filename: 'about.html',
    chunks: ['about']
  }),
  new HtmlWebpackPlugin({
    template: './src/pages/contact/index.html',
    filename: 'contact.html',
    chunks: ['contact']
  })
]
```


### 2. **代码分割与懒加载**
```javascript
// 自动分割公共依赖
optimization: {
  splitChunks: {
    chunks: 'all', // 分割所有类型的 chunks（async、initial、all）
    minSize: 20000, // 生成 chunk 的最小体积（字节）
    minRemainingSize: 0,
    minChunks: 1, // 被多少模块引用才会分割
    maxAsyncRequests: 30, // 按需加载时的最大并行请求数
    maxInitialRequests: 30, // 入口点的最大并行请求数
    automaticNameDelimiter: '~', // 生成名称的分隔符
    cacheGroups: {
      // 自定义缓存组
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all'
      }
    }
  }
}
```


### 3. **生产环境优化**
```javascript
// 生产环境配置（webpack.prod.js）
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  
  optimization: {
    minimizer: [
      // 压缩 JS
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true, // 删除 console 语句
            drop_debugger: true // 删除 debugger 语句
          }
        }
      }),
      
      // 压缩 CSS
      new CssMinimizerPlugin()
    ],
    
    // 运行时代码分割
    runtimeChunk: 'single'
  },
  
  plugins: [
    // 定义环境变量
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
  ]
});
```


### 4. **开发环境优化**
```javascript
// 开发环境配置（webpack.dev.js）
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist')
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    
    // 代理配置
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true,
        secure: false
      }
    }
  },
  
  // 缓存配置，加速二次构建
  cache: {
    type: 'filesystem',
    cacheDirectory: path.resolve(__dirname, '.webpack_cache')
  }
});
```


### 5. **处理不同类型的资源**
```javascript
// 处理 TypeScript
{
  test: /\.tsx?$/,
  use: 'ts-loader',
  exclude: /node_modules/
}

// 处理 SCSS/SASS
{
  test: /\.s[ac]ss$/i,
  use: [
    MiniCssExtractPlugin.loader,
    'css-loader',
    'postcss-loader',
    'sass-loader'
  ]
}

// 处理 JSON
{
  test: /\.json$/,
  type: 'asset/resource',
  generator: {
    filename: 'assets/data/[name].[hash][ext]'
  }
}

// 处理视频/音频
{
  test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
  use: [
    {
      loader: 'file-loader',
      options: {
        name: '[name].[hash].[ext]',
        outputPath: 'assets/media'
      }
    }
  ]
}
```


### 6. **自定义解析规则**
```javascript
resolve: {
  // 解析模块时的搜索目录
  modules: [path.resolve(__dirname, 'src'), 'node_modules'],
  
  // 强制使用模块的某种版本（如优先使用 ESM 版本）
  mainFields: ['module', 'main'],
  
  // 限制解析的文件类型
  extensions: ['.js', '.json'],
  
  // 别名配置（支持对象或数组形式）
  alias: {
    'react': path.resolve(__dirname, 'node_modules/react'),
    'utils': path.resolve(__dirname, 'src/utils')
  }
}
```


## 三、常用插件配置


### 1. **环境变量注入**
```javascript
const webpack = require('webpack');

plugins: [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      API_URL: JSON.stringify('https://api.example.com')
    }
  })
]
```


### 2. **复制静态资源**
```javascript
const CopyWebpackPlugin = require('copy-webpack-plugin');

plugins: [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: path.resolve(__dirname, 'public'),
        to: path.resolve(__dirname, 'dist'),
        globOptions: {
          ignore: ['**/index.html'] // 排除 index.html，因为已有 HtmlWebpackPlugin 处理
        }
      }
    ]
  })
]
```


### 3. **分析打包结果**
```javascript
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

plugins: [
  new BundleAnalyzerPlugin({
    analyzerMode: 'static', // 生成静态 HTML 文件
    openAnalyzer: true // 自动打开浏览器
  })
]
```


### 4. **PWA 支持**
```javascript
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

plugins: [
  new WorkboxWebpackPlugin.GenerateSW({
    clientsClaim: true,
    skipWaiting: true,
    exclude: [/\.map$/, /asset-manifest\.json$/],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com/,
        handler: 'StaleWhileRevalidate'
      },
      {
        urlPattern: /^https:\/\/api\.example\.com/,
        handler: 'NetworkFirst'
      }
    ]
  })
]
```


## 四、性能优化策略


### 1. **并行处理**
```javascript
// 使用 thread-loader 并行处理
{
  test: /\.js$/,
  include: path.resolve('src'),
  use: [
    'thread-loader', // 必须放在其他 loader 之前
    'babel-loader'
  ]
}
```


### 2. **缩小构建范围**
```javascript
// 排除不必要的文件
module: {
  noParse: /jquery|lodash/, // 不解析这些模块
  
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/, // 排除 node_modules
      use: 'babel-loader'
    }
  ]
}
```


### 3. **缓存构建结果**
```javascript
// 开发环境缓存
cache: {
  type: 'filesystem',
  buildDependencies: {
    config: [__filename] // 当配置文件变化时，缓存失效
  }
}

// Babel 缓存
{
  test: /\.js$/,
  use: {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true // 启用 Babel 缓存
    }
  }
}
```


### 4. **CDN 加载外部资源**
```javascript
// 配置 externals
externals: {
  react: 'React',
  'react-dom': 'ReactDOM',
  'axios': 'axios'
}

// 在 HTML 中引入 CDN 资源
<script src="https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js"></script>
```


## 五、常见问题解决方案


### 1. **处理 CSS Modules**
```javascript
{
  test: /\.module\.css$/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: '[name]__[local]--[hash:base64:5]' // 自定义类名格式
        }
      }
    },
    'postcss-loader'
  ]
}
```


### 2. **处理图片资源**
```javascript
// Webpack 5 内置资源模块
{
  test: /\.(png|jpg|gif)$/i,
  type: 'asset', // 自动选择导出文件或内联为 base64
  parser: {
    dataUrlCondition: {
      maxSize: 8 * 1024 // 小于 8KB 的图片内联
    }
  },
  generator: {
    filename: 'assets/images/[name].[hash][ext]'
  }
}
```


### 3. **处理动态导入**
```javascript
// 无需额外配置，Webpack 5 原生支持
// 动态导入组件
const loadComponent = async () => {
  const { MyComponent } = await import('./MyComponent');
  return MyComponent;
};
```


### 4. **处理 TypeScript**
```javascript
// 安装依赖
npm install typescript ts-loader @types/react @types/react-dom --save-dev

// 配置 ts-loader
{
  test: /\.tsx?$/,
  use: 'ts-loader',
  exclude: /node_modules/
}

// 配置 tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "lib": ["DOM", "ESNext"],
    "jsx": "react-jsx",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```


## 六、最佳实践总结


### 1. **配置分离**
- `webpack.common.js`：公共配置
- `webpack.dev.js`：开发环境配置
- `webpack.prod.js`：生产环境配置
- 使用 `webpack-merge` 合并配置

### 2. **使用最新特性**
- Webpack 5 内置的资源模块（asset modules）替代 file-loader/url-loader
- 持久化缓存（persistent caching）加速二次构建
- 改进的 Tree-shaking 算法

### 3. **按需加载插件**
- 开发环境禁用生产环境专用插件（如压缩插件）
- 使用 `DefinePlugin` 区分环境变量

### 4. **监控与分析**
- 使用 `webpack-bundle-analyzer` 分析包体积
- 使用 `speed-measure-webpack-plugin` 测量各 loader/plugin 的执行时间

### 5. **渐进式优化**
- 从基础配置开始，逐步添加功能
- 针对特定问题引入优化措施，避免过度配置

通过合理配置，Webpack 能在保持灵活性的同时，为项目提供高性能的构建能力，适用于从简单单页应用到复杂企业级项目的各种场景。