# Gzip 压缩

Gzip 是一种文件压缩算法，广泛应用于减少网络传输的数据量，从而加快网页加载速度。在 Webpack 项目中，可以通过插件来启用 Gzip 压缩，以便对生成的资源文件进行压缩处理。以下是实现 Gzip 压缩的具体步骤和相关配置：

## 使用 `compression-webpack-plugin`

1. **安装插件**

   首先需要安装 `compression-webpack-plugin` 插件。可以通过 npm 或 yarn 来安装：

   ```bash
   npm install compression-webpack-plugin --save-dev
   ```

   或者

   ```bash
   yarn add compression-webpack-plugin --dev
   ```

2. **配置 Webpack**

   在 Webpack 配置文件（通常是 `webpack.config.js`）中引入并配置 `CompressionWebpackPlugin`。

   ```javascript
   const CompressionWebpackPlugin = require("compression-webpack-plugin");

   module.exports = {
     // 其他配置...
     plugins: [
       new CompressionWebpackPlugin({
         filename: "[path].gz[query]", // 目标文件名，默认为 '[path].gz[query]'
         algorithm: "gzip", // 使用的压缩算法
         test: new RegExp("\\.(js|css)$"), // 哪些文件需要被压缩，这里是对 js 和 css 文件进行压缩
         threshold: 10240, // 只有大小大于该值的资源会被处理。单位是字节，这里设置为10KB
         minRatio: 0.8, // 压缩率小于这个值的资源会被处理
         deleteOriginalAssets: false, // 是否删除原文件，默认为 false
       }),
     ],
   };
   ```

## 注意事项

- **服务器支持**：确保你的服务器配置正确以提供 Gzip 压缩的内容。大多数现代 Web 服务器（如 Nginx、Apache）都支持 Gzip 压缩，但需要正确配置。

  - 对于 Nginx，你可以在配置文件中添加或检查如下配置：

    ```nginx
    gzip on;
    gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_min_length 1k;
    gzip_comp_level 9;
    gzip_buffers 16 8k;
    ```

  - 对于 Apache，确保 `mod_deflate` 模块已启用，并在 `.htaccess` 文件中添加相应的规则。

- **性能影响**：虽然 Gzip 压缩可以显著减少传输数据量，但是它会增加服务器的 CPU 使用率。因此，在高并发场景下，可能需要评估是否开启以及如何平衡压缩级别与性能之间的关系。

通过以上配置，你可以有效地利用 Gzip 压缩技术减少网站静态资源的大小，进而提升页面加载速度和用户体验。
