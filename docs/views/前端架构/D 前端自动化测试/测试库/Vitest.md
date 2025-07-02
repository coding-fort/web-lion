# Vitest

[参考：Vitest 中文文档](https://cn.vitest.dev/)<br/>
[参考：Vue 官方测试工具库-Vue Test Utils](https://test-utils.vuejs.org/)<br/>

## Vitest 是什么

Vitest 是由 Vite 驱动的下一代测试框架。

## 快速开始

```sh
npm install -D vitest
```

> <warn>TIP: Vitest 1.0 需要 Vite >=v5.0.0 和 Node >=v18.0.0</warn>

## 配置 Vitest

[参考：单元测试之 Vitest 进行组件测试](https://www.jianshu.com/p/11993ba56016)<br/>
[参考：Vitest 单元测试详解](https://blog.csdn.net/OKCRoss/article/details/135911707)<br/>

<suc>Vitest</suc> 的主要优势之一是它与 Vite 的统一配置。如果存在，vitest 将读取你的根目录 vite.config.ts 以匹配插件并设置为你的 Vite 应用程序。例如，你的 Vite 有 <err>resolve.alias</err> 和 <err>plugins</err> 的配置将会在 Vitest 中开箱即用。

#### 集成配置（<suc>vite.config.ts</suc>）

<suc>Vitest</suc> 提供 <err>environment</err> 选项以在特定环境中运行代码，可以使用 <err>environmentOptions</err> 选项修改环境的行为方式。默认情况下，可以使用这些环境：

- <err>node</err> 为默认环境
- <err>jsdom</err> 通过提供 Browser API 模拟浏览器环境，使用 jsdom 包
- <err>happy-dom</err> 通过提供 Browser API 模拟浏览器环境，被认为比 jsdom 更快，但缺少一些 API，使用 happy-dom 包

```js
// vite.config.ts
/// <reference types="vitest" />
export default defineConfig({
  test: {
    globals: true, // 是否全局引入
    environment: "happy-dom", // 环境选择 jsdom
    // include: ['test/**/*.test.ts'],
    // deps: {
    //   inline: ['@vue', '@vueuse', 'element-plus', 'vue-i18n'],
    // },
  },
});
```

#### 独立配置（<suc>vitest.config.ts</suc>）

> <err>提示：使用独立配置需要 Node >= v18.0.0</err>

- 创建 <err>vitest.config.ts</err>，优先级将会最高。
- 将 <err>--config</err> 选项传递给 CLI，例如 <err>vitest --config ./path/to/vitest.config.ts</err>。
- 在 <err>defineConfig</err> 上使用 <err>process.env.VITEST</err> 或 <err>mode</err> 属性（如果没有被覆盖，将设置为 test）有条件地在 <err>vite.config.ts</err> 中应用不同的配置。

```ts
// vitest.config.ts
import { fileURLToPath } from "node:url";
import { mergeConfig, defineConfig, configDefaults } from "vitest/config";
import viteConfig from "./vite.config";
export default mergeConfig(
  viteConfig,
  defineConfig({
    define: {
      "import.meta.vitest": "undefined", // 源码内联测试配置
    },
    test: {
      // 启用基准测试模式
      mode: "benchmark", // globals: true, // 全局引入vitest 位置一
      environment: "jsdom",
      exclude: [...configDefaults.exclude, "e2e/*"],
      includeSource: ["src/**/*.{js,ts}"],
      root: fileURLToPath(new URL("./", import.meta.url)),
      coverage: {
        provider: "istanbul", // or 'v8'  默认使用v8
        reporter: ["text", "html", "json"], // reporters: ['verbose'],
        reporters: ["html"], // reportsDirectory: './tests/unit/coverage', // 修改输出报告位置
        exclude: ["src/**/icons"], //不需要单元测试覆盖的地方
      }, // browser: { //   enabled: true, //   name: 'chrome', // browser name is required // },
    },
  })
);
```

## 组件测试

### 测试依赖项

有时我们需要个根元素， 类似<err>#app</err>一样的挂载点，我们需要访问 <suc>[Vue Test Utils](https://test-utils.vuejs.org/)</suc> 的 <err>mount</err> 方法，这是 Vue.js 的官方测试工具库。

```sh
# vue2
npm install @vue/test-utils@1 --save-dev
# vue3
npm install @vue/test-utils --save-dev
```

> <errb>Tip</errb>
>
> 测试二次封装<pri>element-plus</pri>时，报错：<warn>[Vue warn]: Failed to resolve component: el-input</warn>
>
> 原因：Vue Test Utils 未引入<pri>element-plus</pri> 组件引起；
>
> 解决：
>
> ```js
> import { mount } from "@vue/test-utils";
> import ElementPlus from "element-plus";
> import YourComponent from "@/components/YourComponent.vue";
>
> describe("YourComponent.vue", () => {
>   it("should render correctly", () => {
>     const wrapper = mount(YourComponent, {
>       global: {
>         plugins: [ElementPlus],
>       },
>     });
>     expect(wrapper.element).toMatchSnapshot();
>   });
> });
> ```

### 常见的 Vitest 方法

- <sucb>describe</sucb>：这个函数接受一个名字和一个函数，用于将相关的测试组合在一起。当你为一个有多个测试点（如逻辑和外观）的组件编写测试时，它就会很方便。

- <sucb>test/it</sucb>：这个函数代表被测试的实际代码块。它接受一个字符串，通常是测试案例的名称或描述（例如，渲染成功的正确样式）和另一个函数，所有的检查和测试在这里进行。

- <sucb>expect</sucb>： 这个函数用于测试值或创建断言。它接受一个预期为实际值（字符串、数字、对象等）的参数 x，并使用任何支持的方法对其进行评估（例如 <err>toEqual(y)</err>，检查 x 是否与 y 相同）。

- <sucb>toContain</sucb>：toContain 断言实际值是否在数组中。toContain 还可以检查一个字符串是否是另一个字符串的子串。自 <suc>Vitest 1.0</suc> 起，如果我们需要在类似浏览器的环境中运行测试，此断言还可以检查类是否包含在 classList 中，或一个元素是否包含在另一个元素中。

```js
// 测试button 组件 button.test.ts
import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import button from "../button.vue";
// The component to test
describe("test Button", () => {
  it("should render slot", () => {
    const wrapper = mount(button, {
      slots: {
        default: "Hello world",
      },
    });

    // Assert the rendered text of the component
    expect(wrapper.text()).toContain("Hello world");
  });
  it("should have class", () => {
    const wrapper = mount(button, {
      props: {
        type: "primary",
      },
    });
    expect(wrapper.classes()).toContain("k-button--primary");
  });
});
```

#### 运行测试

```sh
npm run test
```

<style>
suc, sucb {
    color: #42b883;
}
err, errb {
    color: #F56C6C;
}
warn, warnb {
    color: #e6a23c;
}
pri, prib {
    color: #409EFF;
}
sucb,errb,warnb,prib{
    font-weight: bold;
}
</style>
