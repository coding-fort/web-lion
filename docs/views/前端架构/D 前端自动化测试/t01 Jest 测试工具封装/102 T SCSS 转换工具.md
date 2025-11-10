### SCSS 转换工具（scss-transformer.js）

```js
// src/utils/scss-transformer.js
const sass = require("sass");
const path = require("path");

module.exports = {
  process(src, filename) {
    let result;
    // 兼容 sass 新旧版本 API
    if (sass.compile) {
      // 新版 API（sass v1.33.0+）
      result = sass.compile(filename, {
        sourceMap: false,
        style: "expanded",
      });
    } else {
      // 旧版 API（sass < v1.33.0）
      result = sass.renderSync({
        file: filename,
        sourceMap: false,
        outputStyle: "expanded",
      });
    }

    // 提取 CSS 内容（新版和旧版输出格式不同）
    const css = result.css.toString ? result.css.toString() : result.css;

    // 解析 :export 块
    const exportMatch = css.match(/:export\s*\{([\s\S]*?)\}/);
    const exports = {};
    if (exportMatch && exportMatch[1]) {
      exportMatch[1]
        .trim()
        .split(";")
        .forEach((line) => {
          const [key, value] = line
            .trim()
            .split(":")
            .map((item) => item.trim());
          if (key && value) {
            exports[key] = value.replace(/['"]/g, ""); // 移除引号
          }
        });
    }

    return `module.exports = ${JSON.stringify(exports)};`;
  },
};
```

- 需要在`jest.config.js`中配置 SCSS 转换工具

```js
module.exports = {
  testEnvironment: "jsdom",
  preset: "@vue/cli-plugin-unit-jest",
  transform: {
    // other transformers
    "^.+\\.scss$":
      "<rootDir>/src/components/JestTest/public/jest-transform-scss.js",
  },

  moduleFileExtensions: ["vue", "js", "json", "node", "scss"],
};
```
