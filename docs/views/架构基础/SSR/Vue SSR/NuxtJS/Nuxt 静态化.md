# Nuxt 静态化

Nuxt.js 提供了强大的静态站点生成（Static Site Generation, SSG）功能，允许你将应用编译成静态 HTML 文件。这种方式非常适合内容型网站或需要预渲染的页面，因为它不仅提高了首次加载速度，还有利于 SEO。下面详细介绍如何在 Nuxt.js 中实现静态化。

## 启用静态站点生成

要启用静态站点生成，首先确保你的 `nuxt.config.js` 配置正确。默认情况下，Nuxt.js 项目已经配置为支持静态生成，但你可以根据需要进行自定义设置。

### 基本配置

确保你的 `nuxt.config.js` 中包含以下配置来启用静态生成：

```javascript
export default {
  target: "static", // 设置目标为静态站点
  // 其他配置...
};
```

设置 `target: 'static'` 指示 Nuxt.js 为静态站点生成模式准备输出。

## 构建和导出静态文件

完成上述配置后，你可以通过运行以下命令来构建并导出静态文件：

```bash
npm run generate
```

或者使用 Yarn:

```bash
yarn generate
```

这个命令会遍历 `pages` 目录下的所有路由，并为每个路由生成对应的静态 HTML 文件。生成的文件将位于 `dist` 目录下。

## 动态路由处理

对于动态路由（例如博客文章列表），你需要告诉 Nuxt.js 如何生成这些页面。可以通过在 `nuxt.config.js` 中指定 `generate.routes` 来定义动态路由：

```javascript
export default {
  target: "static",
  generate: {
    routes() {
      return axios.get("https://api.example.com/posts").then((res) => {
        return res.data.map((post) => {
          return `/posts/${post.id}`;
        });
      });
    },
  },
  // 其他配置...
};
```

在这个例子中，我们使用了一个外部 API 来获取博客文章列表，并基于这些数据生成相应的静态页面。

## 使用中间件控制哪些页面被静态化

有时，你可能不想对某些页面进行静态化处理。这时可以利用 Nuxt.js 的中间件功能，在 `generate` 过程中排除特定页面。可以在页面组件中添加 `generate: { exclude: true }` 或者创建一个全局中间件来决定是否生成该页面。

例如，在某个页面组件中：

```javascript
export default {
  generate: {
    exclude: [/admin/],
  },
};
```

这将阻止 Nuxt.js 为任何匹配 `/admin` 路径的页面生成静态文件。

## 部署静态文件

生成的静态文件可以直接部署到任何静态文件服务器上，如 GitHub Pages、Netlify、Vercel 等。只需将 `dist` 目录中的内容上传至服务器即可。

- **GitHub Pages**: 可以使用 GitHub Actions 自动部署。
- **Netlify / Vercel**: 支持直接从 Git 仓库自动部署，只需简单配置即可。

## 总结

通过 Nuxt.js 的静态站点生成功能，你可以轻松地将 Vue.js 应用转换为性能优越且对 SEO 友好的静态网站。无论是个人博客还是企业官网，静态化都是提高用户体验和搜索引擎排名的有效方式。理解如何配置和使用静态生成选项，能够帮助你更好地优化和管理你的 Nuxt.js 项目。
