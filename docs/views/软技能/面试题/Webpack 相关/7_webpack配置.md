# 7_webpack.config.js 配置

[返回Webpack 页](../../../工程开发/构建工具/Webpack.md#_1-2-创建配置文件)

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin"); // 自动引入资源插件  npm install --save-dev html-webpack-plugin
const MiniCssExtracPlugin = require("mini-css-extrac-plugin"); // css抽离
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin"); //css压缩 npm install css-minimizer-webpack-plugin  --save-dev
const TerserPlugin = require("terser-webpack-plugin"); // js压缩  npm install --save-dev terser-webpack-plugin
//加载toml、yarm、json5数据资源 npm install toml yarm json5 -D
const toml = require("toml");
const yarm = require("yarm");
const json5 = require("json5");

module.exports = (env) => {
  return {
    // 手动分离公共文件，通过配置成对象的方式实现多入口代码分割
    // entry: {
    //  index:{
    //    import:"./src/index.js",
    //    dependOn: "shared"  // 抽离公共文件
    //  },
    //  shared: "lodash"      // 公共的js文件
    // },
    // 多入口
    // entry: {
    //      pageOne: './src/pageOne/index.js',
    //      pageTwo: './src/pageTwo/index.js',
    //      pageThree: './src/pageThree/index.js',
    // },
    // 单入口
    entry: {
      index: "./src/index.js",
    },
    output: {
      filename: "scripts/[name].[contenthash].js", // 将所有的js放入同一个文件夹，并且根据文件名自动命名
      path: path.resolve(__dirname, "./dist"),
      clean: true, // 清除上一次的垃圾文件
      assetModuleFilename: "images/[contenthash][ext]", // 在images目录下，根据文件内容自动生成hash文件名
      publicPath: "https://*****.com/", // 公共路径（cdn域名或者本地localhost）
    },
    mode: env.prodection ? "prodection" : "development", // 生产环境或者开发环境 package.json 启动命令：npx webpack --env prodection
    devtool: "cheap-module-source-map", // 真实报错文件指向,生产环境一般不开启sourcemap
    // 插件（非必要的，缺少也不影响项目打包）
    plugins: [
      new HtmlWebpackPlugin({
        template: "./index.html", // 模板
        filename: "app.html",
        inject: "body", // script 存在的位置
        hash: true, // 解决缓存
        minify: {
          removeAttributeQuotes: true, // 压缩，去掉引号
        },
      }),
      new MiniCssExtracPlugin({
        filename: "style/[contenthash].css",
      }),
    ],
    devServer: {
      static: "./dist", // 监听根目录文件变化，自动刷新页面插件 npm install --save-dev webpack-dev-server
      //反向代理
      proxy: {
        "/ajax": {
          target: "https:**********",
          ws: true,
          changeOrigin: true,
        },
      },
    },
    // 模块（必要的，缺少影响项目打包）
    module: {
      rules: [
        //资源模块类型我们称之为Asset Modules Type，总共有四种，来代替loader，分别是：
        // asset/resource：发送一个单独的文件并导出URL，替代file-loader
        // asset/inline：导出一个资源的data URI(base64)，替代url-loader
        // asset/source：导出资源的源代码，之前通过使用raw-loader实现
        // asset：介于asset/resource和asset/inline之间， 之前通过url-loader+limit属性实现。
        {
          test: /\.(png|gif|jp?g|svg|webp|ico)$/, // 正则图片文件
          type: "asset",
          generator: {
            filename: "images/[contenthash][ext]", // 优先级高于 assetModuleFilename
          },
        },
        {
          // 支持less
          // npm install style-loader css-loader less-loader less --save-dev
          // 抽离 npm install mini-css-extrac-plugin  --save-dev   webpack5环境下构建的插件
          test: /\.(le|c)ss$/, // .less and .css
          use: [
            MiniCssExtracPlugin.loader,
            /* "style-loader", */ "css-loader",
            "less-loader",
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|oft)$/, // 正则字体文件
          type: "asset/resource",
        },
        //加载csv、xml数据资源 npm install csv-loader xml-loader -D
        {
          test: /\.(csv|tsv)$/,
          use: "csv-loader",
        },
        {
          test: /\.xml$/,
          use: "xml-loader",
        },
        //加载toml、yarm、json5数据资源
        {
          test: /\.toml$/,
          type: "json",
          parser: {
            parse: toml.parse,
          },
        },
        {
          test: /\.yarm$/,
          type: "json",
          parser: {
            parse: yarm.parse,
          },
        },
        {
          test: /\.json5$/,
          type: "json",
          parser: {
            parse: json5.parse,
          },
        },
        // loader工具 支持数组方式链式调用，数组靠后的元素先执行
        {
          // 压缩图片
          //图片小于一定大小使用base64 否则使用file-loader产生真实图片 npm install url-loader --save-dev
          test: /\.(png|gif|jp?g|svg|webp|ico)$/, // 正则
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 5000, //小于限定使用base64
                name: "home/images/[name].[hash:8].[ext]",
                publicPath: `../../`,
                esModule: false,
              },
            },
          ],
        },
        // 使用babel-loader npm install -D babel-loader @babel/core @babel/preset-env
        // regeneratorRuntime是webpack打包生成的全局辅助函数，由babel生成，用于兼容 async/await 的语法
        // npm install --save @babel/runtime
        // npm install --save-dev @babel/plugin-transform-runtime
        {
          test: /\.js$/,
          exclude: /node_modules/, // *业务代码里面可能会引入node_modules外部js，这些js不需要babel-loader编译，因此需要排除掉
          use: {
            loader: "babel-loader", // *引入babel-loader
            options: {
              presets: ["@babel/preset-env"], // *引入预设
              plugins: [
                [
                  "@babel/plugin-transform-runtime", // *配置插件信息
                ],
              ],
            },
          },
        },
      ],
    },
    optimization: {
      minimizer: [new CssMinimizerPlugin(), new TerserPlugin()], //代码压缩 mode改为 production
      splitChunks: {
        // 缓存
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all", // 自动重复代码抽离
          },
        },
      },
    },
  };
};
```
