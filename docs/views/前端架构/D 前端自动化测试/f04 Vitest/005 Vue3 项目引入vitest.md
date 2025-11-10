# Vue 项目引入 Vitest 单元测试

## 一、环境准备

### 1. 前提条件

- 已创建 Vue 项目（推荐使用 Vite 初始化，如 `npm create vite@latest my-vue-project -- --template vue`）
- Node.js 版本 ≥ 14.18.0（Vitest 要求）

## 二、安装依赖

进入项目根目录，安装 Vitest 及相关工具：

```bash
# 核心依赖：Vitest 测试框架、Vue 组件测试工具、浏览器环境模拟
npm install vitest @vue/test-utils jsdom --save-dev

# 可选依赖：覆盖率报告工具（如需生成测试覆盖率）
npm install @vitest/coverage-v8 --save-dev
```

- `vitest`：测试运行器和断言库
- `@vue/test-utils`：Vue 组件测试工具库
- `jsdom`：模拟浏览器 DOM 环境（避免依赖真实浏览器）
- `@vitest/coverage-v8`：生成测试覆盖率报告（可选）

## 三、配置 Vitest

### 1. 创建配置文件

在项目根目录创建 `vitest.config.js`，配置测试环境和 Vue 支持：

```javascript
import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue"; // 复用 Vite 的 Vue 插件
import path from "path";

export default defineConfig({
  plugins: [vue()], // 支持 Vue 组件解析
  test: {
    environment: "jsdom", // 使用 jsdom 模拟浏览器环境
    globals: true, // 启用全局测试函数（如 describe、it，无需手动导入）
    setupFiles: "./setupTests.js", // 测试初始化文件（可选）
    alias: {
      // 同步 Vite 的路径别名（如项目中用 @ 指代 src）
      "@": path.resolve(__dirname, "./src"),
    },
    coverage: {
      // 覆盖率报告配置（可选）
      reporter: ["text", "json", "html"], // 输出格式
      include: ["src/**/*.{js,ts,vue}"], // 需要统计的文件
      exclude: ["src/main.js", "src/router/**", "**/*.d.ts"], // 排除的文件
    },
  },
});
```

### 2. 配置测试脚本

在 `package.json` 中添加测试命令：

```json
{
  "scripts": {
    "test": "vitest", // 运行所有测试
    "test:watch": "vitest watch", // 监听文件变化，自动重跑测试
    "test:run": "vitest run", // 一次性运行所有测试（适合 CI/CD）
    "test:coverage": "vitest run --coverage" // 生成覆盖率报告
  }
}
```

## 四、编写第一个测试

### 1. 测试工具函数（单元测试）

#### 步骤 1：创建工具函数

在 `src/utils/format.js` 中创建一个简单的格式化函数：

```javascript
// 格式化金额为两位小数
export const formatMoney = (num) => {
  return Number(num).toFixed(2);
};
```

#### 步骤 2：编写测试用例

在 `src/utils/__tests__/format.test.js` 中创建测试文件（约定测试文件放在 `__tests__` 目录或命名为 `xxx.test.js`）：

```javascript
// 测试工具函数 formatMoney
import { formatMoney } from "../format";
import { expect, test } from "vitest"; // 导入 Vitest 断言和测试函数

// 测试套件（一组相关测试）
test("formatMoney 工具函数", () => {
  // 单个测试用例：正常数字
  test("应将数字格式化为两位小数", () => {
    expect(formatMoney(100)).toBe("100.00");
    expect(formatMoney(123.456)).toBe("123.46"); // 四舍五入
  });

  // 边界情况：非数字输入
  test("非数字输入应返回 0.00", () => {
    expect(formatMoney("abc")).toBe("0.00");
    expect(formatMoney(undefined)).toBe("0.00");
  });
});
```

### 2. 测试 Vue 组件（组件测试）

#### 步骤 1：创建组件

在 `src/components/Counter.vue` 中创建一个计数器组件：

```vue
<template>
  <div class="counter">
    <p>当前计数: {{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>

<script setup>
  import { ref } from "vue";
  const count = ref(0);
  const increment = () => count.value++;
  const decrement = () => count.value--;
</script>
```

#### 步骤 2：编写组件测试

在 `src/components/__tests__/Counter.test.js` 中创建测试：

```javascript
import { mount } from "@vue/test-utils"; // 导入组件挂载工具
import Counter from "../Counter.vue";
import { expect, test } from "vitest";

test("Counter 组件测试", async () => {
  // 挂载组件
  const wrapper = mount(Counter);

  // 1. 测试初始渲染
  expect(wrapper.find("p").text()).toContain("当前计数: 0");

  // 2. 测试 +1 按钮点击
  const incrementBtn = wrapper.find("button:nth-child(2)");
  await incrementBtn.trigger("click"); // 触发点击事件（注意 await 处理异步）
  expect(wrapper.find("p").text()).toContain("当前计数: 1");

  // 3. 测试 -1 按钮点击
  const decrementBtn = wrapper.find("button:nth-child(3)");
  await decrementBtn.trigger("click");
  expect(wrapper.find("p").text()).toContain("当前计数: 0");
});
```

## 五、运行测试

### 1. 基本运行

```bash
# 运行所有测试（默认监听模式，文件变化自动重跑）
npm run test
```

运行后会看到测试结果：

```
 ✓ src/utils/__tests__/format.test.js (2 tests)
 ✓ src/components/__tests__/Counter.test.js (1 test)

Test Files  2 passed (2)
     Tests  3 passed (3)
  Start at  10:00:00
  Duration  1.23s
```

### 2. 生成覆盖率报告

```bash
npm run test:coverage
```

运行后会在项目根目录生成 `coverage` 文件夹，打开 `coverage/index.html` 可查看详细的覆盖率报告（哪些代码被测试覆盖，哪些未覆盖）。

## 六、常见配置与技巧

### 1. 全局变量与初始化

如果多个测试需要共享配置（如全局挂载组件、设置 Vue 插件），可创建 `setupTests.js`：

```javascript
// setupTests.js
import { config } from "@vue/test-utils";

// 全局配置：模拟 Vue 插件（如 Pinia、Vue Router）
config.global.plugins = [
  /* 插件列表 */
];
```

在 `vitest.config.js` 中通过 `setupFiles: './setupTests.js'` 引入。

### 2. 模拟接口请求

使用 Vitest 的 `vi.mock` 模拟 API 调用：

```javascript
// 模拟 @/api/user 模块
vi.mock("@/api/user", () => ({
  getUserInfo: vi.fn(() => Promise.resolve({ name: "测试用户" })),
}));

test("测试接口调用", async () => {
  const { getUserInfo } = await import("@/api/user");
  const result = await getUserInfo();
  expect(result.name).toBe("测试用户");
});
```

### 3. 快照测试

对组件渲染结果进行快照比对（适合 UI 稳定的组件）：

```javascript
test("Counter 组件快照", () => {
  const wrapper = mount(Counter);
  expect(wrapper.html()).toMatchSnapshot(); // 首次运行生成快照，后续比对
});
```

快照文件会保存在 `__snapshots__` 目录，UI 变更时需手动更新快照（运行 `npm run test -- -u`）。

## 七、总结

通过以上步骤，已完成 Vue 项目中 Vitest 的引入和基础测试编写：

1. 安装依赖 → 配置 Vitest → 编写测试（工具函数/组件）→ 运行测试；
2. 核心优势：Vitest 与 Vite 生态无缝衔接，启动速度快，支持热更新，语法与 Jest 兼容，学习成本低；
3. 后续可根据项目需求扩展测试场景（如 Vuex/Pinia 状态测试、路由测试等）。

如果是 Vue 2 项目，只需将 `@vue/test-utils` 版本改为 1.x，并调整组件测试语法（如使用 `createLocalVue`）即可。
