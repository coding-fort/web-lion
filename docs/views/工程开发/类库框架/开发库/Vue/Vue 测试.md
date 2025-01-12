# Vue 测试

[参考：Vue 测试说明](https://cn.vuejs.org/guide/scaling-up/testing.html)<br/>
[参考：Vue 官方测试工具库：Vue Test Utils](https://test-utils.vuejs.org/)<br/>

## 何时测试

越早越好！我们建议你尽快开始编写测试。拖得越久，应用就会有越多的依赖和复杂性，想要开始添加测试也就越困难。

## 测试的类型

当设计你的 Vue 应用的测试策略时，你应该利用以下几种测试类型：

- **单元测试**：检查给定函数、类或组合式函数的输入是否产生预期的输出或副作用。
- **组件测试**：检查你的组件是否正常挂载和渲染、是否可以与之互动，以及表现是否符合预期。这些测试比单元测试导入了更多的代码，更复杂，需要更多时间来执行。
- **端到端测试**：检查跨越多个页面的功能，并对生产构建的 Vue 应用进行实际的网络请求。这些测试通常涉及到建立一个数据库或其他后端。

每种测试类型在你的应用的测试策略中都发挥着作用，保护你免受不同类型的问题的影响。

## 单元测试

编写单元测试是为了验证小的、独立的代码单元是否按预期工作。一个单元测试通常覆盖一个单个函数、类、组合式函数或模块。单元测试侧重于逻辑上的正确性，只关注应用整体功能的一小部分。他们可能会模拟你的应用环境的很大一部分（如初始状态、复杂的类、第三方模块和网络请求）。

一般来说，单元测试将捕获函数的业务逻辑和逻辑正确性的问题。单元测试通常适用于独立的业务逻辑、组件、类、模块或函数，不涉及 UI 渲染、网络请求或其他环境问题。

有两种情况，你必须对 Vue 的特定功能进行单元测试：

- 组合式函数
- 组件

### 组合式函数

在 Vue 应用的概念中，“组合式函数”(Composables) 是一个利用 Vue 的组合式 API 来封装和复用有状态逻辑的函数。

#### 测试组合式函数

当涉及到测试组合式函数时，我们可以根据是否依赖宿主组件实例把它们分为两类。

当一个组合式函数使用以下 API 时，它依赖于一个宿主组件实例：

- 生命周期钩子
- 供给/注入

1. 如果一个组合式程序只使用响应式 API，那么它可以通过直接调用并断言其返回的状态或方法来进行测试。

```js
// counter.js
import { ref } from "vue";

export function useCounter() {
  const count = ref(0);
  const increment = () => count.value++;

  return {
    count,
    increment,
  };
}
```

```js
// counter.test.js
import { useCounter } from "./counter.js";

test("useCounter", () => {
  const { count, increment } = useCounter();
  expect(count.value).toBe(0);

  increment();
  expect(count.value).toBe(1);
});
```

2. 一个依赖生命周期钩子或供给/注入的组合式函数需要被包装在一个宿主组件中才可以测试。

```js
// test-utils.js
import { createApp } from "vue";

export function withSetup(composable) {
  let result;
  const app = createApp({
    setup() {
      result = composable();
      // 忽略模板警告
      return () => {};
    },
  });
  app.mount(document.createElement("div"));
  // 返回结果与应用实例
  // 用来测试供给和组件卸载
  return [result, app];
}
```

```js
import { withSetup } from './test-utils'
import { useFoo } from './foo'

test('useFoo', () => {
  const [result, app] = withSetup(() => useFoo(123))
  // 为注入的测试模拟一方供给
  app.provide(...)
  // 执行断言
  expect(result.foo.value).toBe(1)
  // 如果需要的话可以这样触发
  app.unmount()
})
```

对于更复杂的组合式函数，通过使用<span class="success">组件测试</span>编写针对这个包装器组件的测试，这会容易很多。

### 组件

#### 组件的单元测试

一个组件可以通过两种方式测试：

1. 白盒：单元测试

白盒测试知晓一个组件的实现细节和依赖关系。它们更专注于将组件进行更 独立 的测试。这些测试通常会涉及到模拟一些组件的部分子组件，以及设置插件的状态和依赖性（例如 Pinia）。

2. 黑盒：组件测试

黑盒测试不知晓一个组件的实现细节。这些测试尽可能少地模拟，以测试组件在整个系统中的集成情况。它们通常会渲染所有子组件，因而会被认为更像一种“集成测试”。

#### 常用方案

- **[Vitest](../../测试库/Vitest.md)**（推荐方案）

因为由 create-vue 创建的官方项目配置是基于 Vite 的，所以我们推荐你使用一个可以利用同一套 Vite 配置和转换管道的单元测试框架。Vitest 正是一个针对此目标设计的单元测试框架，它由 Vue / Vite 团队成员开发和维护。在 Vite 的项目集成它会非常简单，而且速度非常快。

- **Jest**

Jest 是一个广受欢迎的单元测试框架。不过，我们只推荐你在已有一套 Jest 测试配置、且需要迁移到基于 Vite 的项目时使用它，因为 Vitest 提供了更无缝的集成和更好的性能。

#### 组件测试

组件测试应该捕捉组件中的 prop、事件、提供的插槽、样式、CSS class 名、生命周期钩子，和其他相关的问题。

组件测试不应该模拟子组件，而应该像用户一样，通过与组件互动来测试组件和其子组件之间的交互。例如，组件测试应该像用户那样点击一个元素，而不是编程式地与组件进行交互。

组件测试主要需要关心组件的公开接口而不是内部实现细节。对于大部分的组件来说，公开接口包括触发的事件、prop 和插槽。当进行测试时，请记住，**测试这个组件做了什么，而不是测试它是怎么做到的**。

> **推荐的做法**
>
> - 对于 **视图** 的测试：根据输入 prop 和插槽断言渲染输出是否正确。
> - 对于 **交互** 的测试：断言渲染的更新是否正确或触发的事件是否正确地响应了用户输入事件。

> **应避免的做法**
>
> - 不要去断言一个组件实例的私有状态或测试一个组件的私有方法。测试实现细节会使测试代码太脆弱，因为当实现发生变化时，它们更有可能失败并需要更新重写。
>
> - 组件的最终工作是渲染正确的 DOM 输出，所以专注于 DOM 输出的测试提供了足够的正确性保证（如果你不需要更多其他方面测试的话），同时更加健壮、需要的改动更少。
>
> - 不要完全依赖快照测试。断言 HTML 字符串并不能完全说明正确性。应当编写有意图的测试。
>
> - 如果一个方法需要测试，把它提取到一个独立的实用函数中，并为它写一个专门的单元测试。如果它不能被直截了当地抽离出来，那么对它的调用应该作为交互测试的一部分。

#### 推荐方案 ​

- <suc>[Vitest](https://vitest.dev/)</suc> 对于组件和组合式函数都采用无头渲染的方式 (例如 VueUse 中的 useFavicon 函数)。组件和 DOM 都可以通过 @vue/test-utils 来测试。

- <suc>[Cypress 组件测试](https://docs.cypress.io/guides/component-testing/overview)</suc> 会预期其准确地渲染样式或者触发原生 DOM 事件。它可以搭配 @testing-library/cypress 这个库一同进行测试。

> <suc>Vitest</suc> 和基于浏览器的运行器之间的主要区别是速度和执行上下文。简而言之，基于浏览器的运行器，如 <suc>Cypress</suc>，可以捕捉到基于 Node 的运行器（如 Vitest）所不能捕捉的问题（比如样式问题、原生 DOM 事件、Cookies、本地存储和网络故障），但基于浏览器的运行器比 Vitest 慢几个数量级，因为它们要执行打开浏览器，编译样式表以及其他步骤。Cypress 是一个基于浏览器的运行器，支持组件测试。请阅读 [Vitest 文档的“比较”](https://cn.vitest.dev/guide/comparisons)这一章 了解 Vitest 和 Cypress 最新的比较信息。

#### 组件挂载库 ​

组件测试通常涉及到单独挂载被测试的组件，触发模拟的用户输入事件，并对渲染的 DOM 输出进行断言。有一些专门的工具库可以使这些任务变得更简单。

- <suc>@vue/test-utils</suc> 是官方的底层组件测试库，用来提供给用户访问 Vue 特有的 API。@testing-library/vue 也是基于此库构建的。

- <suc>@testing-library/vue</suc> 是一个专注于测试组件而不依赖于实现细节的 Vue 测试库。它的指导原则是：测试越是类似于软件的使用方式，它们就能提供越多的信心。

我们推荐在应用中使用 <suc>@vue/test-utils</suc> 测试组件。<suc>@testing-library/vue</suc> 在测试带有 Suspense 的异步组件时存在问题，在使用时需要谨慎。

#### 其他选择 ​

- <suc>Nightwatch</suc> 是一个端到端测试运行器，支持 Vue 的组件测试。(Nightwatch v2 版本的 示例项目)

- <suc>WebdriverIO</suc> 用于跨浏览器组件测试，该测试依赖于基于标准自动化的原生用户交互。它也可以与测试库一起使用。

## 端到端（E2E）测试

虽然单元测试为所写的代码提供了一定程度的验证，但单元测试和组件测试在部署到生产时，对应用整体覆盖的能力有限。因此，端到端测试针对的可以说是应用最重要的方面：当用户实际使用你的应用时发生了什么。

端到端测试的重点是多页面的应用表现，针对你的应用在生产环境下进行网络请求。他们通常需要建立一个数据库或其他形式的后端，甚至可能针对一个预备上线的环境运行。

端到端测试通常会捕捉到路由、状态管理库、顶级组件（常见为 App 或 Layout）、公共资源或任何请求处理方面的问题。如上所述，它们可以捕捉到单元测试或组件测试无法捕捉的关键问题。

端到端测试不导入任何 Vue 应用的代码，而是完全依靠在真实浏览器中浏览整个页面来测试你的应用。

端到端测试验证了你的应用中的许多层。可以在你的本地构建的应用中，甚至是一个预上线的环境中运行。针对预上线环境的测试不仅包括你的前端代码和静态服务器，还包括所有相关的后端服务和基础设施。

> 通过测试用户操作如何影响你的应用，端到端测试通常是提高应用能否正常运行的置信度的关键。

#### 跨浏览器测试 ​

端到端测试的一个主要优点是你可以了解你的应用在多个不同浏览器上运行的情况。

#### 更快的反馈 ​

端到端测试和相应开发过程的主要问题之一是，运行整个套件需要很长的时间。通常情况下，这只在持续集成和部署（CI/CD）管道中进行。

#### 第一优先级的调试体验 ​

传统上，开发者依靠扫描终端窗口中的日志来帮助确定测试中出现的问题，而现代端到端测试框架允许开发者利用他们已经熟悉的工具，例如浏览器开发工具。

#### 无头模式下的可见性 ​

当端到端测试在 CI/CD 管道中运行时，它们通常在无头浏览器（即不带界面的浏览器）中运行。因此，当错误发生时，现代端到端测试框架的一个关键特性是能够在不同的测试阶段查看应用的快照、视频，从而深入了解错误的原因。

#### 推荐方案 ​

<suc>Cypress</suc>

总的来说，我们认为 Cypress 提供了最完整的端到端解决方案，其具有信息丰富的图形界面、出色的调试性、内置断言和存根、抗剥落性、并行化和快照等诸多特性。而且如上所述，它还提供对 组件测试 的支持。不过，它只支持测试基于 Chromium 的浏览器和 Firefox。

#### 其他选项 ​

- <suc>Playwright</suc> 也是一个非常好的端到端测试解决方案，支持测试范围更广的浏览器品类（主要是 WebKit 型的）。查看这篇文章 《为什么选择 Playwright》 了解更多细节。

- <suc>Nightwatch</suc> 是一个基于 Selenium WebDriver 的端到端测试解决方案。它的浏览器品类支持范围是最广的。

- <suc>WebdriverIO</suc> 是一个基于 WebDriver 协议的网络和移动测试的自动化测试框架。

## 用例指南

#### 添加 Vitest 到项目中

1. 在一个基于 Vite 的 Vue 项目中，运行如下命令：

```sh
npm install -D vitest happy-dom @testing-library/vue
```

2. 接着，更新你的 Vite 配置，添加上 test 选项：

```js
// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  // ...
  test: {
    // 启用类似 jest 的全局测试 API
    globals: true,
    // 使用 happy-dom 模拟 DOM
    // 这需要你安装 happy-dom 作为对等依赖（peer dependency）
    environment: "happy-dom",
  },
});
```

> **TIP**
>
> 如果使用 TypeScript，请将 <suc>vitest/globals</suc> 添加到 <suc>tsconfig.json</suc> 的 types 字段当中。
>
> ```json
> // tsconfig.json
>
> {
>   "compilerOptions": {
>     "types": ["vitest/globals"]
>   }
> }
> ```

3. 接着，在你的项目中创建名字以 \*.test.js 结尾的文件。你可以把所有的测试文件放在项目根目录下的 test 目录中，或者放在源文件旁边的 test 目录中。Vitest 会使用命名规则自动搜索它们。

```js
// MyComponent.test.js
import { render } from "@testing-library/vue";
import MyComponent from "./MyComponent.vue";

test("it should work", () => {
  const { getByText } = render(MyComponent, {
    props: {
      /* ... */
    },
  });

  // 断言输出
  getByText("...");
});
```

4. 最后，在 package.json 之中添加测试命令，然后运行它：

```json
{
  // ...
  "scripts": {
    "test": "vitest"
  }
}
```

```sh
npm test
```

<style>
.success, suc {
    font-weight: 500;
    color: #42b883;
}



</style>
