# 5_Webpack 如何配置压缩代码？压缩了什么？

```md
- 在 optimization 配置项中来配置该插件作为压缩器进行压缩。
- 在 plugins 里使用该插件进行压缩
- js 压缩:利用 terser-webpack-plugin
- css 压缩:利用了 optimize-css-assets-webpack-plugin 插件
- 删除了 console、注释、空格、换行、没有使用的 css 代码等
```
