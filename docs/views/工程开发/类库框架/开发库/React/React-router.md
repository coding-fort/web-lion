# React-router.md

### 安装

```sh
# 注意：我用的是6.x的版本
npm install react-router-dom
```

### 路由模式

1. HashRouter
   HashRouter 使用 URL 的哈希部分（即#后面的部分）来匹配路由，它不会向服务器发送请求。例如，URL 可以是 Example Domain。HashRouter 兼容性比较好，哪怕浏览器不支持 HTML5 History API 也可以正常使用。

2. BrowserRouter
   BrowserRouter 使用 HTML5 History API 来匹配路由，使用 HTML5 的 pushState 和 replaceState API 来实现路由的切换。它可以隐藏 URL 中的#符号，使 URL 更加友好。例如，URL 可以是http://example.com/about

3. MemoryRouter
   MemoryRouter 是一个不依赖于浏览器历史记录的路由器。它将 URL 存储在内存中，而不是浏览器历史记录中，适用于测试或在不支持 HTML5 History API 的环境中使用

4. StaticRouter
   StaticRouter 是一个用于服务器端渲染的路由器。它将请求的 URL 作为参数传递给组件，并将组件的输出发送回客户端。这样就可以在服务器端生成动态 HTML，然后将其发送到浏览器。

5. NativeRouter
   NativeRouter 是用于 React Native 应用的路由器，它使用 Native 导航而不是 HTML 导航来匹配路由

### 参考

[React 之 react-router-dom](https://blog.csdn.net/m0_65121454/article/details/132383402)

[react-router-dom4.0 基本介绍](https://juejin.cn/post/6844903905730510855)
