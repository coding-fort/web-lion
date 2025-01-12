# Rollup

ESM 打包器

## 安装

```bash
npm install rollup --save-dev
```

## 使用

```bash
npx rollup -c
```

```bash
npx rollup -c --watch
```

## 配置文件

```js
export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
};
```

## 插件

### rollup-

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "rollup-plugin-babel";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: "node_modules/**",
    }),
  ],
};
```

### 加载 CommonJS 模块

```js
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [resolve(), commonjs()],
};
```

### 加载 ESM 模块

```js
import resolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "cjs",
  },
  plugins: [resolve()],
};
```

## 代码拆分

通过动态打包实现

```js
export default {
  input: "src/index.js",
  output: {
    dir: "dist",
    format: "cjs",
  },
};
```

## 多入口打包


