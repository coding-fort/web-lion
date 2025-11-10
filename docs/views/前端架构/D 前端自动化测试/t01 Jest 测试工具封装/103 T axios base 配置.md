### axios base 配置

```js
/**
 * jest.env.js
 * 必须与request.js 中baseURL 同名
 */
process.env.VUE_APP_BASE_API = "https://baidu.com/sub"; // 开发环境接口地址
```

- 需要在`jest.config.js` 中配置环境变量

```js
module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.env.js"],
};
```
