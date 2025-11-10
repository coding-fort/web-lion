# Jest + vue-jest 项目单元测试解决方案（Vue2.6 项目）

## 一、方案概述

`Jest + vue-jest` 是 Vue 2.6 项目最稳定的单元测试组合，尤其适合无法升级到 Vue 2.7+ 的旧项目。该方案通过 `Jest` 提供测试运行、断言和 Mock 能力，搭配 `vue-jest` 解析 Vue 2.6 单文件组件（`.vue`），同时兼容项目中可能存在的 ESM（`import`/`export`）和 CJS（`require`/`module.exports`）混合语法场景。

### 核心工具链

| 工具                          | 版本   | 作用                                                                    |
| ----------------------------- | ------ | ----------------------------------------------------------------------- |
| **Jest**                      | 26.6.3 | 测试框架，支持 ESM/CJS 混合语法，提供断言、Mock、覆盖率统计。           |
| **Jsdom**                     | 27.x   | 测试环境模拟 DOM，与 Jest 集成，支持 Vue 组件渲染测试。                 |
| **@vue/cli-plugin-unit-jest** | 4.5.15 | Vue CLI 插件，集成 Jest 测试环境，自动配置 Babel 转译。                 |
| **vue-jest**                  | 3.0.7  | Jest 插件，专为 Vue 2 设计，解析 `.vue` 组件的模板、脚本和样式。        |
| **@vue/test-utils**           | 1.3.6  | Vue 2 组件测试工具库，提供 `mount`/`shallowMount` 等组件操作 API。      |
| **flush-promises**            | 1.0.2  | 用于 Vue 组件异步操作的 Promise 刷新工具，确保测试中 Promise 状态更新。 |
| **sass**                      | 1.56.1 | 处理 Vue 组件中的 SCSS 样式，确保测试环境中样式解析正常。               |

## 二、环境搭建（兼容 ESM/CJS 混合语法）

### 1. 前提条件

- Vue 2.6 项目（`vue@2.6.x`），允许使用 ESM（`import`）和 CJS（`require`）混合语法。
- Node.js ≥ 12.0.0（Jest 27.x 最低要求）。
- 已安装 Vue 项目核心依赖（`vue@2.6.12`、`vue-loader` 等）。

### 2. 安装依赖

#### 步骤 1：安装核心测试依赖

```bash
# 测试框架与 Vue 2.6 适配工具
npm install jest@26 vue-jest@3.0.7 @vue/test-utils@1 --save-dev

# 测试环境模拟 DOM（与 Jest 集成）
npm install jsdom@27 @vue/cli-plugin-unit-jest@4.5.15 flush-promises@1.0.2 --save-dev

# 语法编译工具（处理 ESM 和 ES6+ 语法）
npm install babel-jest@27 @babel/preset-env babel-core@7.0.0-bridge.0 --save-dev

# 模板编译器（必须与 vue 版本完全一致！）
npm install vue-template-compiler@2.6.12 --save-dev
```

#### 步骤 2：版本一致性检查

确保 `package.json` 中关键依赖版本匹配：

```json
{
  "dependencies": {
    "vue": "2.6.12" // 项目 Vue 版本
  },
  "devDependencies": {
    "vue-template-compiler": "2.6.12", // 与 vue 版本完全一致
    "vue-jest": "3.0.7",
    "@vue/test-utils": "1.3.6",
    "jest": "26.6.3",
    "babel-jest": "26.6.3"
  }
}
```

### 3. 核心配置

#### 3.1 Jest 配置（`jest.config.js`）

```javascript
// jest.config.js
module.exports = {
  // 测试环境（模拟浏览器 DOM）
  testEnvironment: "jsdom",
  // 忽略 node_modules 中的文件（无需测试第三方依赖）
  transformIgnorePatterns: ["/node_modules/"],
  // 使用 Vue CLI 插件的 Jest 配置（自动处理 Babel 转译）
  preset: "@vue/cli-plugin-unit-jest",
  // 测试文件匹配规则（支持 .test.js 和 .spec.js）
  testMatch: ["**/__tests__/**/*.js", "**/?(*.)+(spec|test).js"],

  // 支持的文件扩展名（包含 .vue 和 .js）
  moduleFileExtensions: ["js", "vue", "scss"],

  // 转换规则：用 vue-jest 解析 .vue，babel-jest 处理 JS
  transform: {
    "^.+\\.vue$": "vue-jest",
    "^.+\\.js$": "babel-jest",
    // 处理 SCSS 样式（:export 对象）
    "^.+\\.scss$":
      "<rootDir>/src/components/JestTest/public/jest-transform-scss.js",
  },

  // 路径别名（同步 Vue 项目的 @ 指向 src）
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
```

#### 3.2 SCSS 转换配置（`jest-transform-scss.js`）

```js
// jest-transform-scss.js
// 自定义转换器：处理 SCSS 中的 :export 对象，将其转换为 Jest 可识别的 JSON 字符串
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

#### 3.2 Babel 配置（`babel.config.js`）

确保 ESM 语法（`import`）能被转换为 Jest 可识别的 CJS 语法：

```javascript
// babel.config.js
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: { node: "current" }, // 适配当前 Node 版本
        modules: "commonjs", // 将 ESM 转换为 CJS，兼容 Jest
      },
    ],
  ],
};
```

#### 3.3 测试脚本配置（`package.json`）

```json
{
  "scripts": {
    "test": "jest --watch", // 监听模式：文件变化自动重跑
    "test:run": "jest", // 一次性运行所有测试
    "test:coverage": "jest --coverage" // 生成覆盖率报告
  }
}
```

## 三、测试用例编写指南（兼容 ESM/CJS）

Vue 2.6 项目可能存在 ESM 和 CJS 混合语法，测试用例需灵活适配两种风格。

### 1. 工具函数测试（支持 ESM/CJS 导出）

#### 场景 1：工具函数用 CJS 导出（`module.exports`）

```javascript
// src/utils/format.js（CJS 导出）
function formatDate(date) {
  // 日期格式化逻辑（同前文）
}
module.exports = { formatDate };
```

测试用例（可用 `require` 或 `import` 导入）：

```javascript
// src/utils/__tests__/format.test.js
// 方式 1：用 require 导入 CJS 模块
const { formatDate } = require("../format");

// 方式 2：用 import 导入（Babel 会自动转换为 CJS）
// import { formatDate } from "../format";

describe("formatDate 工具函数", () => {
  test("应格式化日期为 YYYY-MM-DD", () => {
    expect(formatDate(new Date("2025-10-26"))).toBe("2025-10-26");
  });
});
```

#### 场景 2：工具函数用 ESM 导出（`export`）

```javascript
// src/utils/validator.js（ESM 导出）
export function isEmail(str) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str);
}
```

测试用例（推荐用 `import` 导入）：

```javascript
// src/utils/__tests__/validator.test.js
import { isEmail } from "../validator";

test("isEmail 应正确验证邮箱格式", () => {
  expect(isEmail("test@example.com")).toBe(true);
  expect(isEmail("invalid-email")).toBe(false);
});
```

### 2. Vue 2.6 组件测试（关键！）

Vue 组件通常用 ESM 导出（`export default`），测试用例推荐用 `import` 导入（解决路径解析问题）。

#### 步骤 1：创建 Vue 2.6 组件（`src/components/Counter/index.vue`）

```vue
<template>
  <div class="counter">
    <!-- 必须有唯一根元素（Vue 2 限制） -->
    <p>当前计数: {{ count }}</p>
    <button @click="increment">+1</button>
    <button @click="decrement">-1</button>
  </div>
</template>

<script>
  // ESM 导出（Vue 2.6 支持）
  export default {
    name: "Counter",
    data() {
      return { count: 0 };
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

#### 步骤 2：编写组件测试用例（`src/components/__tests__/Counter.test.js`）

```javascript
// 推荐用 import 导入组件（解决路径解析问题）
import { mount } from "@vue/test-utils";
import Counter from "../Counter/index.vue"; // 导入 Vue 组件

describe("Counter 组件", () => {
  // 测试初始渲染
  test("初始计数应为 0", () => {
    const wrapper = mount(Counter); // 挂载组件
    expect(wrapper.vm.count).toBe(0); // 访问组件实例数据
    expect(wrapper.find("p").text()).toContain("当前计数: 0"); // 验证 DOM
  });

  // 测试点击事件（异步操作需用 async/await）
  test("点击 +1 按钮计数应增加 1", async () => {
    const wrapper = mount(Counter);
    const incrementBtn = wrapper.find("button:first-of-type"); // 查找按钮

    await incrementBtn.trigger("click"); // 触发点击（等待 DOM 更新）
    expect(wrapper.vm.count).toBe(1);
  });
});
```

### 3. 常见场景： 测试 ElementUI 组件

##### 步骤 1. 测试 ElementUI 按钮和输入框(`ElementTest.vue`)

```vue
<!-- src/components/ElementTest.vue -->
<template>
  <div class="element-test">
    <!-- Element 按钮 -->
    <el-button type="primary" @click="handleClick" :disabled="isDisabled">
      点击我（已点击 {{ clickCount }} 次）
    </el-button>

    <!-- Element 输入框 -->
    <el-input
      v-model="inputValue"
      placeholder="请输入内容"
      style="margin-top: 10px"
    ></el-input>
  </div>
</template>

<script>
  export default {
    name: "ElementTest", // 组件名称，测试时可能需要
    data() {
      return {
        clickCount: 0, // 按钮点击计数
        isDisabled: false, // 按钮是否禁用
        inputValue: "", // 输入框绑定值
      };
    },
    methods: {
      // 按钮点击事件
      handleClick() {
        this.clickCount += 1;
        // 点击 3 次后禁用按钮
        if (this.clickCount >= 3) {
          this.isDisabled = true;
        }
        // 触发自定义事件，传递当前计数
        this.$emit("button-clicked", this.clickCount);
      },
    },
  };
</script>
```

##### 步骤 2. 测试 ElementUI 组件（`ElementTest.spec.js`）

```js
// src/components/__tests__/ElementTest.spec.js
import { mount } from "@vue/test-utils";
import ElementTest from "../JestTest/ElementTest.vue";
import Vue from "vue";
import ElementUI from "element-ui";

// 全局注册Element-UI组件（解决Unknown custom element警告）
Vue.use(ElementUI);

describe("ElementTest.vue", () => {
  // 测试组件能否正常渲染
  it("renders element components correctly", () => {
    const wrapper = mount(ElementTest);

    // 检查按钮和输入框是否存在
    expect(wrapper.find(".el-button").exists()).toBe(true);
    expect(wrapper.find(".el-input").exists()).toBe(true);
    // 检查按钮初始文本
    expect(wrapper.find(".el-button").text()).toContain("已点击 0 次");
  });

  // 测试按钮点击事件
  it("increments count when button is clicked", async () => {
    const wrapper = mount(ElementTest);
    const button = wrapper.find(".el-button");

    // 第一次点击
    await button.trigger("click");
    expect(wrapper.vm.clickCount).toBe(1);
    expect(button.text()).toContain("已点击 1 次");

    // 第二次点击
    await button.trigger("click");
    expect(wrapper.vm.clickCount).toBe(2);
  });

  // 测试按钮点击 3 次后是否禁用
  it("disables button after 3 clicks", async () => {
    const wrapper = mount(ElementTest);
    const button = wrapper.find(".el-button");

    // 连续点击 3 次
    for (let i = 0; i < 3; i++) {
      await button.trigger("click");
    }

    // 检查按钮是否禁用
    expect(wrapper.vm.isDisabled).toBe(true);
    expect(button.attributes("disabled")).toBe("disabled");
  });

  // 测试输入框双向绑定
  it("updates input value correctly", async () => {
    const wrapper = mount(ElementTest);
    const input = wrapper.find(".el-input input");

    // 模拟输入内容
    await input.setValue("测试 Element 输入框");

    // 检查绑定值是否更新
    expect(wrapper.vm.inputValue).toBe("测试 Element 输入框");
  });

  // 测试自定义事件是否触发
  it('emits "button-clicked" event on click', async () => {
    const wrapper = mount(ElementTest);
    await wrapper.find(".el-button").trigger("click");

    // 检查事件是否触发及参数是否正确
    expect(wrapper.emitted("button-clicked")).toBeTruthy();
    expect(wrapper.emitted("button-clicked")[0]).toEqual([1]);
  });
});
```

#### 步骤 3. 运行测试

```bash
# 运行 ElementTest 测试
npm test ElementTest.spec.js

# 运行结果
PASS  src/components/__tests__/ElementTest.spec.js
ElementTest.vue
  ✓ renders element components correctly (21 ms)
  ✓ increments count when button is clicked (10 ms)
  ✓ disables button after 3 clicks (8 ms)
  ✓ updates input value correctly (6 ms)
  ✓ emits "button-clicked" event on click (4 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.862 s, estimated 1 s
Ran all test suites.

```

### 4. 常见场景： 测试 ElementUI 按钮组件

#### 步骤 1. 测试 ElementUI 按钮组件（`ElementButton.spec.js`）

```js
import { mount } from "@vue/test-utils";
import { Button } from "element-ui";
import Vue from "vue";
import ElementUI from "element-ui";
// 全局注册Element-UI组件（解决Unknown custom element警告）
Vue.use(ElementUI);

describe("Element-UI Button组件基础测试", () => {
  // 测试用例1：基础渲染测试
  test("Button组件能够正常渲染", () => {
    const wrapper = mount(Button);
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.isVisible()).toBe(true);
  });

  // 测试用例2：Props传递测试
  test("Button组件正确接收type属性", () => {
    const type = "primary";
    const wrapper = mount(Button, {
      propsData: { type },
    });
    expect(wrapper.classes()).toContain("el-button--primary");
  });

  // 测试用例3：点击事件测试
  test("Button组件点击事件正常触发", () => {
    const handleClick = jest.fn();
    const wrapper = mount(Button, {
      listeners: {
        click: handleClick,
      },
    });

    wrapper.trigger("click");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 测试用例4：插槽内容测试
  test("Button组件正确渲染插槽内容", () => {
    const slotContent = "点击我";
    const wrapper = mount(Button, {
      slots: {
        default: slotContent,
      },
    });

    expect(wrapper.text()).toContain(slotContent);
  });

  // 测试用例5：禁用状态测试
  test("Button组件禁用状态正常工作", () => {
    const wrapper = mount(Button, {
      propsData: {
        disabled: true,
      },
    });

    expect(wrapper.attributes("disabled")).toBe("disabled");
    expect(wrapper.classes()).toContain("is-disabled");
  });
});
```

#### 步骤 2. 运行测试

```bash
PASS  src/components/__tests__/ElementBtnTest.spec.js
Element-UI Button组件基础测试
  ✓ Button组件能够正常渲染 (12 ms)
  ✓ Button组件正确接收type属性 (6 ms)
  ✓ Button组件点击事件正常触发 (4 ms)
  ✓ Button组件正确渲染插槽内容 (9 ms)
  ✓ Button组件禁用状态正常工作 (4 ms)

Test Suites: 1 passed, 1 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.79 s, estimated 1 s
Ran all test suites.
```

### 5. 常见场景： 测试模拟接口调用

#### 步骤 1. 测试模拟接口调用（`FetchMockTest.vue`）

```vue
<template>
  <button @click="fetchResults">{{ value }}</button>
</template>

<script>
  import axios from "axios";
  //
  export default {
    data() {
      return {
        value: null,
      };
    },

    methods: {
      async fetchResults() {
        const response = await axios.get("/custom");
        this.value = response.data;
      },
    },
  };
</script>
```

#### 步骤 2. 测试模拟接口调用（`FetchMockTest.spec.js`）

```js
import { shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import axios from "axios";
import FetchMockTest from "../JestTest/FetchMockTest.vue";

jest.mock("axios");

describe("FetchMockTest", () => {
  // 按 URL 区分不同 get 请求
  axios.get.mockImplementation((url) => {
    switch (url) {
      case "/custom":
        return Promise.resolve({ data: "按钮文本" }); // 按钮接口数据
      case "/api/user":
        return Promise.resolve({ data: { name: "张三" } }); // 用户接口数据
      case "/api/list":
        return Promise.resolve({ data: [1, 2, 3] }); // 列表接口数据
      default:
        return Promise.resolve({ data: null }); // 默认数据
    }
  });
  /**
   * 测试异步数据获取：点击按钮后获取数据并渲染
   */
  it("异步数据获取：点击按钮后获取数据并渲染", async () => {
    const wrapper = shallowMount(FetchMockTest);
    await wrapper.find("button").trigger("click");
    await flushPromises();
    expect(wrapper.text()).toBe("按钮文本");
  });
});
```

### 6. 常见场景： 测试实时接口调用

#### 步骤 1. 测试实时接口调用（`RemoteApiTest.vue`）

```vue
<template>
  <button @click="fetchResults">{{ value }}</button>
</template>
<script>
  /*
  // @/api/index.js
  import getCustomerInfoMock from "@/components/__tests__/mock/getCustomerInfo.mock.js";
  export async function getBtnText() {
    return getCustomerInfoMock.getBtnText();
  }
  // mock/getCustomerInfo.mock.js
  export default {
    getBtnText: jest.fn().mockResolvedValue({
      msg: "操作成功",
      code: 200,
      data: "更新后按钮文本",
    }),
  };
 */
  import { getBtnText } from "@/api/index.js"; //
  export default {
    data() {
      return {
        value: "点击",
      };
    },

    methods: {
      async fetchResults() {
        const response = await getBtnText();
        this.value = response.data;
      },
    },
  };
</script>
```

#### 步骤 2. 测试实时接口调用（`RemoteApiTest.spec.js`）

```js
import { shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";
import RemoteApiTest from "../JestTest/RemoteApiTest.vue";
/**
 * 测试组件 RemoteApiTest 中的真实接口请求
 */
describe("RemoteApiTest", () => {
  /**
   * 真实接口请求：点击按钮后获取数据并渲染
   */
  it("真实接口请求：点击按钮后获取数据并渲染", async () => {
    // 1. 挂载组件
    const wrapper = shallowMount(RemoteApiTest);
    // 2. 记录初始文本（确保初始状态正确）
    const initialText = wrapper.text();
    expect(initialText).toBe("点击"); // 假设初始文本为空

    // 3. 点击按钮触发真实接口请求
    await wrapper.find("button").trigger("click");

    // 4. 等待真实接口响应（关键：根据接口延迟调整等待逻辑）
    // 循环等待，直到数据渲染或超时（最多等10秒）
    let waitTime = 0;
    while (wrapper.text() === initialText && waitTime < 100) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // 每100ms检查一次
      waitTime++;
    }
    // 4. 也可以使用 flushPromises 确保所有 Promise 都已 resolve
    // await flushPromises();

    // 5. 断言接口返回的数据已渲染（根据真实接口返回值调整）
    expect(wrapper.text()).toContain("更新后按钮文本"); // 用 toContain 兼容可能的其他文本
  });
});
```

#### 步骤 3. 运行测试

```bash
PASS  src/components/__tests__/RemoteApiTest.spec.js
RemoteApiTest
  ✓ 真实接口请求：点击按钮后获取数据并渲染 (112 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.43 s, estimated 1 s
Ran all test suites related to changed files.
```

### 7. 常见场景： 引入 Scss 样式

#### 步骤 1. 测试引入 Scss 样式（`ImportCssTest.vue`）

```vue
<template>
  <div class="import-css-test">
    <div class="test-box">
      <div class="test-item">
        <div
          class="test-title"
          :style="{ color: variables.color, fontSize: variables.fontSize }"
        >
          测试标题
        </div>
        <div class="test-content">测试内容</div>
      </div>
    </div>
  </div>
</template> 

<script>
  /**
    // ./var.scss
    $font-size: 15px;
    $base-color: #faa;

    :export {
      color: $base-color;
      fontSize: $font-size;
    }
   */
  import variables from "./var.scss";
  export default {
    name: "ImportCssTest",
    computed: {
      variables() {
        return variables;
      },
    },
  };
</script>
```

#### 步骤 2. 测试引入 Scss 样式（`ImportCssTest.spec.js`）

```js
import { mount } from "@vue/test-utils";
import ImportCssTest from "../JestTest/ImportCssTest.vue";

describe("ImportCssTest", () => {
  /**
   * 测试引入scss变量
   */
  it("测试引入scss变量", async () => {
    const wrapper = mount(ImportCssTest);
    const variables = wrapper.vm.variables;
    console.log("variables:", variables);
    const elem = wrapper.find(".test-title");
    // 测试样式是否正确应用
    expect(window.getComputedStyle(elem.element).fontSize).toBe(
      variables.fontSize
    );
    console.log(
      "getComputedStyle:",
      window.getComputedStyle(elem.element).fontSize
    );
    expect(wrapper.find(".test-title").text()).toBe("测试标题");
  });
});
```

#### 步骤 3. 运行测试

```bash
PASS  src/components/__tests__/ImportCssTest.spec.js
  ImportCssTest
    ✓ 测试引入scss变量 (15 ms)

  console.log
    variables: { color: '#faa', fontSize: '15px' }

      at Object.<anonymous> (src/components/__tests__/ImportCssTest.spec.js:11:1)

  console.log
    getComputedStyle: 15px

      at Object.<anonymous> (src/components/__tests__/ImportCssTest.spec.js:14:11)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        0.328 s, estimated 1 s
Ran all test suites related to changed files.
```

<bqe>
注意：对于样式校验，仅能校验行内样式；或者通过校验是否包含某个类名校验对应样式；
</bqe>

### 8. 常见场景： 测试图片

#### 步骤 1：测试图片（`ImageTest.vue`）

```vue
<template>
  <div class="image-test">
    <!-- 静态引入的本地图片 -->
    <img
      ref="staticImg"
      :src="require('@/assets/logo/logo.png')"
      alt="静态 logo"
    />

    <!-- 动态绑定的图片路径 -->
    <img ref="dynamicImg" :src="dynamicImgSrc" alt="动态图片" />

    <!-- 条件渲染的图片 -->
    <img
      v-if="showConditionImg"
      ref="conditionImg"
      :src="require('@/assets/images/hot.png')"
      alt="条件图片"
    />
  </div>
</template>

<script>
  export default {
    name: "ImageTest",
    data() {
      return {
        // 动态图片路径（可能来自接口或 props）
        dynamicImgSrc: require("@/assets/icons/svg/404.svg"),
        showConditionImg: true,
      };
    },
  };
</script>
```

#### 步骤 2：测试图片（`ImageTest.spec.js`）

```js
import { mount } from "@vue/test-utils";
import ImageTest from "../JestTest/ImageTest.vue";

// Jest 无法直接处理图片文件，需要 mock 图片模块
jest.mock("@/assets/logo/logo.png", () => "/mock-logo.png");
jest.mock("@/assets/icons/svg/404.svg", () => "/mock-bg.png");
jest.mock("@/assets/images/hot.png", () => "/mock-icon.png");

describe("图片引入测试", () => {
  const wrapper = mount(ImageTest);

  test("静态引入的图片 src 正确", () => {
    // 获取静态图片元素
    const staticImg = wrapper.findComponent({ ref: "staticImg" });
    // 验证图片是否存在
    expect(staticImg.exists()).toBe(true);
    // 验证 src 是否被正确解析（匹配 mock 的路径）
    expect(staticImg.attributes("src")).toBe("/mock-logo.png");
  });

  test("动态绑定的图片 src 正确", () => {
    const dynamicImg = wrapper.findComponent({ ref: "dynamicImg" });
    expect(dynamicImg.exists()).toBe(true);
    // 动态引入使用 require，验证是否匹配 mock 路径
    expect(dynamicImg.attributes("src")).toBe("/mock-bg.png");
  });

  test("条件渲染的图片在显示状态下 src 正确", () => {
    const conditionImg = wrapper.findComponent({ ref: "conditionImg" });
    // 验证条件为 true 时图片存在
    expect(conditionImg.exists()).toBe(true);
    expect(conditionImg.attributes("src")).toBe("/mock-icon.png");
  });

  test("条件渲染的图片在隐藏状态下不显示", async () => {
    // 修改条件为 false，隐藏图片
    await wrapper.setData({ showConditionImg: false });
    const conditionImg = wrapper.findComponent({ ref: "conditionImg" });
    // 验证图片不存在
    expect(conditionImg.exists()).toBe(false);
  });
});
```

#### 步骤 3. 运行测试

```bash
PASS  src/components/__tests__/ImageTest.spec.js
图片引入测试
  ✓ 静态引入的图片 src 正确 (1 ms)
  ✓ 动态绑定的图片 src 正确
  ✓ 条件渲染的图片在显示状态下 src 正确 (1 ms)
  ✓ 条件渲染的图片在隐藏状态下不显示 (1 ms)

Test Suites: 1 passed, 1 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        0.189 s, estimated 1 s
```

### 9. 其他场景

#### 场景 1：Mock Vuex 3 状态管理

```javascript
import { mount } from "@vue/test-utils";
import Vuex from "vuex";
import UserInfo from "../UserInfo/index.vue"; // 依赖 Vuex 的组件

// 创建 Mock Store
const store = new Vuex.Store({
  state: { user: { name: "测试用户" } },
  getters: { userName: (state) => state.user.name },
});

test("组件应渲染 Vuex 中的用户名", () => {
  const wrapper = mount(UserInfo, {
    store, // 注入 Mock Store
  });
  expect(wrapper.find(".user-name").text()).toBe("测试用户");
});
```

#### 场景 2：Mock Vue Router 3 路由

```javascript
import { mount } from "@vue/test-utils";
import NavBar from "../NavBar/index.vue"; // 包含路由跳转的组件

test("点击导航应触发路由跳转", async () => {
  // Mock $router.push 方法
  const mockPush = jest.fn();
  const wrapper = mount(NavBar, {
    mocks: {
      // 注入 Mock 路由
      $router: { push: mockPush },
    },
  });

  await wrapper.find(".about-link").trigger("click");
  expect(mockPush).toHaveBeenCalledWith("/about"); // 验证路由调用
});
```

#### 场景 3：Mock Axios 异步请求

```javascript
import { mount } from "@vue/test-utils";
import axios from "axios";
import DataList from "../DataList/index.vue"; // 包含异步请求的组件

// Mock Axios
jest.mock("axios");
axios.get.mockResolvedValue({
  data: [{ id: 1, name: "数据1" }], // 模拟接口返回
});

test("组件应加载并渲染异步数据", async () => {
  const wrapper = mount(DataList);
  await wrapper.vm.$nextTick(); // 等待异步请求完成

  expect(wrapper.findAll(".list-item").length).toBe(1);
});
```

## 四、常见问题及解决方案

### 1. 错误：`Failed to mount component: template or render function not defined`

- **原因**：`vue-jest` 未正确解析组件模板，可能是组件路径错误、多根元素或编译器版本不匹配。
- **解决**：
  - 确保组件路径正确（用 `import` 导入时，`index.vue` 可省略文件名）。
  - 组件模板必须有唯一根元素（Vue 2 不支持多根节点）。
  - 验证 `vue` 与 `vue-template-compiler` 版本完全一致（均为 `2.6.12`）。

### 2. 错误：`Vue packages version mismatch`

- **原因**：`vue` 与 `vue-template-compiler` 版本不一致。
- **解决**：强制安装匹配版本：
  ```bash
  npm install vue@2.6.12 vue-template-compiler@2.6.12 --save
  ```

### 3. 错误：`SyntaxError: Cannot use import statement outside a module`

- **原因**：Jest 未正确转换 ESM 语法（`import`）。
- **解决**：确保 `babel.config.js` 中 `modules: "commonjs"` 配置正确，且已安装 `@babel/preset-env`。

### 4. 异步测试失败（数据未更新）

- **原因**：未等待异步操作（如事件触发、接口请求）完成。
- **解决**：用 `async/await` 等待异步操作：
  ```javascript
  test("异步测试示例", async () => {
    const wrapper = mount(Component);
    await wrapper.trigger("click"); // 等待事件处理完成
    await wrapper.vm.$nextTick(); // 等待 DOM 更新
  });
  ```

## 五、总结

`Jest + vue-jest` 是 Vue 2.6 项目的最优测试方案，其核心优势在于：

1. **版本兼容性**：通过严格匹配 `vue` 与 `vue-template-compiler` 版本，避免模板解析错误。
2. **语法灵活性**：支持 ESM（`import`）和 CJS（`require`）混合语法，适配旧项目实际场景。
3. **功能完整性**：覆盖工具函数、组件、Vuex、Router、异步请求等全场景测试需求。

按照本文档配置后，可稳定运行测试用例，有效保障 Vue 2.6 项目的代码质量。
