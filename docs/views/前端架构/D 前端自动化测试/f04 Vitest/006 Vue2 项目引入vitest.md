# Vue 2 项目引入 Vitest 单元测试（指定版本：vitest@0.29.8）

本文档针对 Vue 2 项目，基于 `vitest@0.29.8` 及配套依赖（`jsdom@19.0.0` 等），从零开始实现单元测试环境搭建，包含完整配置、测试示例及常见问题解决。

## 一、环境准备

### 1. 前提条件

- 已创建 Vue 2 项目（推荐通过 `vue-cli` 初始化：`vue create my-vue2-project`）
- Node.js 版本 ≥ 14.18.0（`vitest@0.29.8` 最低要求）
- 项目使用 CommonJS (CJS) 模块规范（默认不添加 `package.json` 的 `"type": "module"`）

## 二、安装依赖

执行以下命令安装指定版本的核心依赖：

```bash
# 核心测试框架：vitest@0.29.8（兼容 CJS 环境）
npm install vitest@0.29.8 --save-dev

# Vue 2 组件测试工具（适配 Vue 2）
npm install @vue/test-utils@1 --save-dev

# 浏览器环境模拟（指定兼容版本，避免 ESM 冲突）
npm install jsdom@19.0.0 whatwg-url@11.0.0 webidl-conversions@7.0.0 --save-dev
```

依赖说明：

- `vitest@0.29.8`：测试运行器，支持 CJS 环境，内置覆盖率功能
- `@vue/test-utils@1`：Vue 2 专属组件测试工具
- `jsdom@19.0.0` 及配套依赖：模拟浏览器 DOM 环境，兼容 CJS

## 三、配置 Vitest

### 1. 创建配置文件

在项目根目录创建 `vitest.config.js`（使用 CJS 语法）：

```javascript
// vitest.config.js
const { defineConfig } = require("vitest/config");
const path = require("path");

module.exports = defineConfig({
  test: {
    environment: "jsdom", // 启用浏览器环境模拟
    globals: true, // 关键：启用全局测试函数（describe、test、expect 等）
    esbuild: {
      format: "cjs", // 强制将代码转换为 CJS 格式，兼容项目模块规范
    },
    alias: {
      // 同步项目中的路径别名（如 Vue CLI 默认的 @ 指向 src）
      "@": path.resolve(__dirname, "./src"),
    },
    // 测试文件匹配规则（默认即可，可按需调整）
    include: ["**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
  },
});
```

### 2. 配置 package.json 脚本

在 `package.json` 中添加测试命令：

```json
{
  "scripts": {
    "test": "vitest", // 运行测试（监听模式，文件变化自动重跑）
    "test:run": "vitest run", // 一次性运行所有测试（适合 CI/CD）
    "test:coverage": "vitest run --coverage" // 生成测试覆盖率报告
  }
}
```

## 四、编写测试用例

### 1. 测试工具函数（单元测试）

#### 步骤 1：创建工具函数

在 `src/utils/format.js` 中创建日期格式化函数（CJS 导出）：

```javascript
// src/utils/format.js
function formatDate(date) {
  // 处理非日期类型输入
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  // 验证日期有效性
  if (isNaN(date.getTime())) {
    return ""; // 非法日期返回空字符串
  }
  // 格式化逻辑
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// CJS 导出语法
module.exports = { formatDate };
```

#### 步骤 2：编写工具函数测试

在 `src/utils/__tests__/format.test.js` 中创建测试文件：

```javascript
// src/utils/__tests__/format.test.js
// 无需导入 describe/test/expect（已通过 globals: true 全局注入）
const { formatDate } = require("../format"); // CJS 导入

// 测试套件（用 describe 分组）
describe("formatDate 工具函数测试", () => {
  // 测试用例 1：正常日期格式化
  test("应将 Date 对象格式化为 YYYY-MM-DD", () => {
    const date = new Date("2025-10-26");
    expect(formatDate(date)).toBe("2025-10-26");
  });

  // 测试用例 2：时间戳解析与格式化
  test("应将时间戳解析为 YYYY-MM-DD", () => {
    const timestamp = 1761504000000; // 对应 2025-10-26
    expect(formatDate(timestamp)).toBe("2025-10-26");
  });

  // 测试用例 3：非法输入返回空字符串
  test('非法输入（如字符串 "invalid"）应返回空字符串', () => {
    expect(formatDate("invalid-date")).toBe("");
  });
});
```

### 2. 测试 Vue 2 组件（组件测试）

#### 步骤 1：创建 Vue 2 组件（Options API）

在 `src/components/Counter.vue` 中创建计数器组件：

```vue
<template>
  <div class="counter">
    <p>当前计数: {{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        count: 0,
      };
    },
    methods: {
      increment() {
        this.count++;
      },
      decrement() {
        this.count--;
      },
    },
  };
</script>
```

#### 步骤 2：编写组件测试

在 `src/components/__tests__/Counter.test.js` 中创建测试文件：

```javascript
// src/components/__tests__/Counter.test.js
const { mount } = require("@vue/test-utils"); // 导入 Vue 2 测试工具
const Counter = require("../Counter.vue"); // 导入组件（CJS 语法）

describe("Counter 组件测试", () => {
  // 测试组件初始渲染
  test("初始渲染时计数应为 0", () => {
    const wrapper = mount(Counter);
    // 验证文本内容
    expect(wrapper.find("p").text()).toContain("当前计数: 0");
    // 直接访问组件实例的 data（Vue 2 特性）
    expect(wrapper.vm.count).toBe(0);
  });

  // 测试 +1 按钮点击
  test("点击 +1 按钮后计数应增加 1", async () => {
    const wrapper = mount(Counter);
    const incrementBtn = wrapper.find("button:nth-child(2)"); // 获取第二个按钮

    await incrementBtn.trigger("click"); // 触发点击事件（需用 await 处理异步）
    expect(wrapper.vm.count).toBe(1);
    expect(wrapper.find("p").text()).toContain("当前计数: 1");
  });

  // 测试 -1 按钮点击
  test("点击 -1 按钮后计数应减少 1", async () => {
    const wrapper = mount(Counter);
    const decrementBtn = wrapper.find("button:nth-child(3)"); // 获取第三个按钮

    await decrementBtn.trigger("click");
    expect(wrapper.vm.count).toBe(-1);
    expect(wrapper.find("p").text()).toContain("当前计数: -1");
  });
});
```

## 五、运行测试

### 1. 基本运行

```bash
# 启动测试（监听模式，修改文件后自动重跑）
npm run test
```

成功运行后输出：

```
 DEV  v0.29.8 /path/to/project

 ✓ src/utils/__tests__/format.test.js (3)
   ✓ formatDate 工具函数测试 (3)
     ✓ 应将 Date 对象格式化为 YYYY-MM-DD
     ✓ 应将时间戳解析为 YYYY-MM-DD
     ✓ 非法输入（如字符串 "invalid"）应返回空字符串
 ✓ src/components/__tests__/Counter.test.js (3)
   ✓ Counter 组件测试 (3)
     ✓ 初始渲染时计数应为 0
     ✓ 点击 +1 按钮后计数应增加 1
     ✓ 点击 -1 按钮后计数应减少 1

Test Files  2 passed (2)
     Tests  6 passed (6)
  Start at  10:00:00
  Duration  520ms
```

### 2. 生成覆盖率报告

```bash
# 运行测试并生成覆盖率报告
npm run test:coverage
```

运行后会在终端显示覆盖率统计（行覆盖率、分支覆盖率等），并在项目根目录生成 `coverage` 文件夹，打开 `coverage/index.html` 可查看详细报告。

## 六、常见问题解决

### 1. 错误：`describe is not a function` 或 `test is not a function`

- **原因**：未启用全局测试函数。
- **解决**：确保 `vitest.config.js` 中 `test.globals: true` 已配置，且测试文件中未重复导入 `describe`/`test`（全局已注入）。

### 2. 错误：`Cannot read properties of undefined (reading 'xxx')`（组件测试）

- **原因**：组件依赖的全局属性（如 `$store`、`$router`）未在测试中注入。
- **解决**：挂载组件时通过 `mocks` 注入依赖：
  ```javascript
  const wrapper = mount(MyComponent, {
    mocks: {
      $store: { getters: { userInfo: () => ({ name: "test" }) } }, // 模拟 Vuex
      $router: { push: vi.fn() }, // 模拟 Vue Router
    },
  });
  ```

### 3. 测试文件未被识别（`no tests`）

- **原因**：测试文件命名不符合规范。
- **解决**：确保测试文件满足以下任一条件：
  - 文件名以 `.test.js` 结尾（如 `format.test.js`）
  - 文件名以 `.spec.js` 结尾（如 `Counter.spec.js`）
  - 放在 `__tests__` 目录下（如 `src/utils/__tests__/format.js`）

## 七、总结

本方案基于 `vitest@0.29.8` 及兼容 CJS 的依赖，实现了 Vue 2 项目的单元测试环境搭建，核心要点：

1. 依赖版本严格匹配（`vitest@0.29.8` + `jsdom@19.0.0`），避免 ESM/CJS 冲突；
2. 配置 `globals: true` 启用全局测试函数，简化测试代码；
3. 测试文件使用 CJS 语法（`require`/`module.exports`），与 Vue 2 项目规范一致；
4. 组件测试通过 `@vue/test-utils@1` 适配 Vue 2 的 Options API 特性。

按照本文档操作，可快速在 Vue 2 项目中落地单元测试，覆盖工具函数和组件的核心逻辑验证。
