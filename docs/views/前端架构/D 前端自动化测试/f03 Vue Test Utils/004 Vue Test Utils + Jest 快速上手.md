# Vue Test Utils 实用指南（Vue 2 适配版）

本文整理了 Vue Test Utils（v1 版本，适配 Vue 2）的核心用法，涵盖组件注册、模拟、测试钩子、常用操作及断言，方便直接用于组件测试实战。

## 一、组件注册（测试环境准备）

被测试组件依赖的全局/局部组件，需在测试环境中显式注册，避免渲染报错。

### 1. 全局组件注册

```js
import MyInput from "@/components/MyInput.vue";
import Vue from "vue";

// 注册自定义全局组件
Vue.component("MyInput", MyInput);

// 注册第三方组件库（如 Element UI）
import ElementUI from "element-ui";
Vue.use(ElementUI); // 一次性注册 Element UI 所有组件
```

### 2. 局部组件注册

若组件仅在测试目标中局部使用，可在 `mount`/`shallowMount` 时通过 `components` 配置注册：

```js
import MyInput from "@/components/MyInput.vue";
import TargetComponent from "@/components/TargetComponent.vue";
import { mount } from "@vue/test-utils";

const wrapper = mount(TargetComponent, {
  components: { MyInput }, // 局部注册依赖组件
});
```

## 二、组件模拟（复杂组件替代）

对于不可直接渲染、逻辑复杂或依赖浏览器 API 的组件（如弹窗、预览组件），需用 Jest 模拟替代，简化测试环境。

### 1. 基础模拟（简单组件替代）

```js
// 模拟 Element UI 的 ImageViewer 组件
jest.mock("element-ui/packages/image/src/image-viewer", () => ({
  name: "ImageViewer", // 保持组件名与原组件一致
  render: (h) => h("div", "Mock ImageViewer"), // 用简单 DOM 替代真实组件
}));

// 模拟自定义组件
jest.mock("@/components/ComplexComponent", () => ({
  name: "ComplexComponent",
  render: (h) => h("div", "Mock Complex Component"),
}));
```

### 2. 带属性/方法的组件模拟

若需验证组件的属性传递或方法调用，可在模拟中声明 `props` 和 `mock 方法`：

```js
jest.mock("@/components/MyComponent", () => ({
  name: "MyComponent",
  props: {
    prop1: { type: String, default: "默认值" },
    prop2: { type: Number, required: true },
  },
  methods: {
    myMethod: jest.fn(), // 模拟方法，方便跟踪调用
  },
  render: (h) => h("div", "Mock MyComponent"),
}));
```

## 三、Jest 全局钩子（测试生命周期管理）

利用 Jest 钩子函数，统一处理测试用例的初始化（如组件挂载、数据准备）和清理（如销毁组件），减少重复代码。

### 1. 常用钩子函数

| 钩子函数     | 作用           | 执行时机                    |
| ------------ | -------------- | --------------------------- |
| `beforeAll`  | 初始化全局资源 | 所有测试用例执行前运行 1 次 |
| `afterAll`   | 释放全局资源   | 所有测试用例执行后运行 1 次 |
| `beforeEach` | 重置测试状态   | 每个测试用例执行前运行 1 次 |
| `afterEach`  | 清理测试环境   | 每个测试用例执行后运行 1 次 |

### 2. 钩子函数示例

```js
import Vue from "vue";
import Vuex from "vuex";
import VueRouter from "vue-router";
import { mount } from "@vue/test-utils";
import InsurePop from "@/components/InsurePop.vue";

Vue.use(Vuex);
Vue.use(VueRouter);
const router = new VueRouter();

let wrapper, store, loginDispatch;

// 所有用例执行前：初始化登录状态
beforeAll(async () => {
  const mockLogin = () => ({ token: "test-token", user: {} }); // 模拟登录接口
  const { token, user } = await mockLogin();
  store = new Vuex.Store({
    state: { token, user }, // 注入登录状态
  });
});

// 每个用例执行前：重新挂载组件
beforeEach(() => {
  // 模拟 Vuex Action
  const actions = { Login: jest.fn() };
  store = new Vuex.Store({ actions });
  loginDispatch = actions.Login;

  // 挂载组件
  wrapper = mount(InsurePop, {
    Vue,
    store,
    router,
    mocks: { $route: { path: "/pop" } }, // 模拟路由
  });
});

// 每个用例执行后：销毁组件
afterEach(() => {
  wrapper.destroy(); // 避免内存泄漏
});
```

## 四、核心操作方法（组件交互）

通过 Vue Test Utils 提供的方法，模拟用户操作（如点击、输入）或获取组件状态，是测试的核心步骤。

### 1. 组件挂载

| 方法           | 作用                             | 示例                                     |
| -------------- | -------------------------------- | ---------------------------------------- |
| `mount`        | 完整渲染组件（包含子组件）       | `mount(TargetComponent, options)`        |
| `shallowMount` | 浅渲染（不渲染子组件，提升效率） | `shallowMount(TargetComponent, options)` |

### 2. 元素/组件查找

| 方法                     | 作用                            | 示例                                    |
| ------------------------ | ------------------------------- | --------------------------------------- |
| `find(selector)`         | 查找单个 DOM 元素（CSS 选择器） | `wrapper.find(".btn-submit")`           |
| `findComponent(comp)`    | 查找单个子组件（组件对象/名称） | `wrapper.findComponent(MyComponent)`    |
| `findAll(selector)`      | 查找所有匹配 DOM 元素           | `wrapper.findAll(".list-item")`         |
| `findAllComponent(comp)` | 查找所有匹配子组件              | `wrapper.findAllComponent(MyComponent)` |

### 3. 事件触发（模拟用户交互）

```js
const button = wrapper.find(".btn-submit");
const input = wrapper.find("input");

// 1. 基础事件
await button.trigger("click"); // 点击事件
await input.trigger("focus"); // 聚焦事件
await input.trigger("blur"); // 失焦事件

// 2. 带参数的事件
await input.trigger("input", { target: { value: "测试输入" } }); // 输入事件
await input.trigger("keydown", { key: "Enter" }); // 键盘事件
await wrapper.find("select").trigger("change", { target: { value: "1" } }); // 变更事件
```

### 4. 数据设置（修改组件状态）

```js
// 1. 设置输入框值（简化 input 事件）
const input = wrapper.find("input");
await input.setValue("测试内容");

// 2. 设置组件 props
await wrapper.setProps({ disabled: true }); // 根组件
await wrapper.findComponent(MyComponent).setProps({ prop1: "新值" }); // 子组件

// 3. 修改组件 data
wrapper.setData({ count: 10, form: { name: "测试" } });
```

### 5. 状态获取（读取组件信息）

```js
// 1. 获取 DOM 相关
const button = wrapper.find(".btn-submit");
button.text(); // 获取文本内容（如 "提交"）
button.html(); // 获取 HTML 结构（如 "<button class='btn-submit'>提交</button>"）
button.attributes("type"); // 获取 DOM 属性（如 "button"）
button.classes(); // 获取类名数组（如 ["btn-submit", "active"]）

// 2. 获取组件相关
wrapper.vm; // 访问组件实例（可调用方法/读取 data）
wrapper.vm.handleSubmit(); // 调用组件方法
wrapper.vm.form.name; // 读取组件 data
wrapper.props("disabled"); // 获取根组件 props
wrapper.findComponent(MyComponent).props("prop1"); // 获取子组件 props

// 3. 获取自定义事件
wrapper.emitted("submit"); // 获取组件触发的 "submit" 事件（返回参数数组）
```

## 五、断言方法（验证结果）

结合 Jest 的 `expect` 和匹配器，验证组件行为是否符合预期，是测试的最终目的。

### 1. 基础断言（存在/状态验证）

```js
// 1. 元素/组件存在性
expect(wrapper.find(".btn-submit").exists()).toBe(true); // 元素存在
expect(wrapper.findComponent(MyComponent).exists()).toBe(false); // 组件不存在

// 2. 文本/属性验证
expect(wrapper.find(".title").text()).toBe("测试标题"); // 文本匹配
expect(wrapper.find("input").attributes("placeholder")).toBe("请输入"); // 属性匹配
expect(wrapper.find(".btn").classes()).toContain("active"); // 包含指定类名

// 3. 组件状态验证
expect(wrapper.vm.count).toBe(10); // data 值匹配
expect(wrapper.props("disabled")).toBeFalsy(); // props 状态为假
expect(wrapper.vm.form).toEqual({ name: "测试", age: 0 }); // 对象深匹配
```

### 2. 方法/事件断言

```js
// 1. 模拟方法调用验证
const myComponent = wrapper.findComponent(MyComponent);
await myComponent.vm.myMethod();
expect(myComponent.vm.myMethod).toHaveBeenCalled(); // 方法被调用
expect(myComponent.vm.myMethod).toHaveBeenCalledTimes(1); // 调用 1 次
expect(myComponent.vm.myMethod).toHaveBeenCalledWith("参数1"); // 传入指定参数

// 2. 自定义事件触发验证
await wrapper.find(".btn-submit").trigger("click");
expect(wrapper.emitted("submit")).toHaveLength(1); // 事件触发 1 次
expect(wrapper.emitted("submit")[0]).toEqual([{ id: 1 }]); // 事件参数匹配
```

### 3. 其他常用断言

```js
// 数组/字符串包含
expect([1, 2, 3]).toContain(2);
expect("hello world").toMatch(/world/);

// 真值/假值
expect(1).toBeTruthy();
expect(0).toBeFalsy();

// 快照匹配（验证渲染结果不变）
expect(wrapper.html()).toMatchSnapshot();
```

## 六、组件测试用例模板（ComponentName.spec.js）

以下是一个通用的 Vue 组件测试用例模板（基于 Vue 2 + Vue Test Utils v1 + Jest），整合了组件注册、挂载、交互、断言等核心步骤，可直接复用并根据具体组件逻辑修改细节。

```js
// 1. 导入依赖
import Vue from "vue";
import { mount, shallowMount } from "@vue/test-utils";
import ComponentName from "@/components/ComponentName.vue"; // 待测试组件
import DependencyComponent from "@/components/DependencyComponent.vue"; // 依赖组件
import ElementUI from "element-ui"; // 若使用第三方组件库

// 2. 注册全局组件/插件（按需添加）
Vue.use(ElementUI); // 注册第三方组件库
Vue.component("DependencyComponent", DependencyComponent); // 注册全局依赖组件

// 3. 模拟复杂组件（按需添加）
jest.mock("element-ui/packages/dialog", () => ({
  name: "ElDialog",
  render: (h) => h("div", "Mock ElDialog"),
}));

// 4. 测试用例分组
describe("ComponentName 组件测试", () => {
  // 5. 声明全局变量（测试用例间共享）
  let wrapper; // 组件 Wrapper 实例
  const defaultProps = {
    // 组件默认 props（根据实际组件 props 定义）
    id: 1,
    name: "测试名称",
  };

  // 6. 测试前初始化（每个用例执行前）
  beforeEach(() => {
    // 挂载组件（根据需要选择 mount 或 shallowMount）
    wrapper = mount(ComponentName, {
      propsData: defaultProps, // 传递 props
      data() {
        return {
          // 覆盖组件 data（按需添加）
          form: {
            username: "",
            password: "",
          },
        };
      },
      mocks: {
        // 模拟全局对象（如 $route、$store、$message 等）
        $route: { path: "/test" },
        $message: { success: jest.fn(), error: jest.fn() },
      },
      stubs: {
        // 局部 stub 子组件（按需添加）
        // "ChildComponent": true
      },
    });
  });

  // 7. 测试后清理（每个用例执行后）
  afterEach(() => {
    wrapper.destroy(); // 销毁组件，避免内存泄漏
  });

  // 8. 基础渲染测试
  test("组件应正常渲染，DOM 结构符合预期", () => {
    // 断言组件存在
    expect(wrapper.exists()).toBe(true);

    // 断言根元素标签（如 div、div#app 等）
    expect(wrapper.element.tagName).toBe("DIV");

    // 断言关键文本渲染
    expect(wrapper.find(".component-title").text()).toContain("组件标题");

    // 断言初始 props 生效
    expect(wrapper.props("id")).toBe(defaultProps.id);
    expect(wrapper.props("name")).toBe(defaultProps.name);
  });

  // 9. 数据与状态测试
  test("组件初始 data 应符合预期，状态更新正常", () => {
    // 断言初始 data
    expect(wrapper.vm.form.username).toBe("");
    expect(wrapper.vm.form.password).toBe("");

    // 修改 data 并断言更新
    wrapper.setData({ form: { username: "test", password: "123" } });
    expect(wrapper.vm.form.username).toBe("test");
    expect(wrapper.vm.form.password).toBe("123");
  });

  // 10. 事件触发测试（用户交互）
  test("点击提交按钮应触发 submit 事件，并传递正确参数", async () => {
    // 1. 模拟输入
    const usernameInput = wrapper.find('input[name="username"]');
    const passwordInput = wrapper.find('input[name="password"]');
    await usernameInput.setValue("admin");
    await passwordInput.setValue("123456");

    // 2. 模拟点击提交按钮
    const submitBtn = wrapper.find(".submit-btn");
    await submitBtn.trigger("click");

    // 3. 断言事件触发
    expect(wrapper.emitted("submit")).toBeTruthy(); // 事件被触发
    expect(wrapper.emitted("submit").length).toBe(1); // 触发 1 次
    expect(wrapper.emitted("submit")[0]).toEqual([
      { username: "admin", password: "123456" }, // 事件参数正确
    ]);
  });

  // 11. 条件渲染测试（如 v-if / v-show）
  test("当 disabled 为 true 时，提交按钮应禁用", async () => {
    // 初始状态：disabled 为 false（默认 props）
    expect(wrapper.find(".submit-btn").attributes("disabled")).toBeUndefined();

    // 更新 props：设置 disabled 为 true
    await wrapper.setProps({ disabled: true });

    // 断言按钮禁用
    expect(wrapper.find(".submit-btn").attributes("disabled")).toBe("disabled");
  });

  // 12. 方法逻辑测试
  test("组件方法 handleReset 应清空表单数据", () => {
    // 先设置表单数据
    wrapper.setData({ form: { username: "admin", password: "123456" } });

    // 调用组件方法
    wrapper.vm.handleReset();

    // 断言表单被清空
    expect(wrapper.vm.form.username).toBe("");
    expect(wrapper.vm.form.password).toBe("");
  });

  // 13. 子组件交互测试（若有）
  test("子组件触发 change 事件时，父组件应接收并更新数据", async () => {
    // 找到子组件
    const childComponent = wrapper.findComponent(DependencyComponent);

    // 模拟子组件触发事件
    await childComponent.vm.$emit("change", "新值");

    // 断言父组件数据更新
    expect(wrapper.vm.childValue).toBe("新值");
  });
});
```

### 模板使用说明：

1. **替换占位符**：将 `ComponentName` 改为实际组件名，`defaultProps`、`data` 等按组件实际逻辑修改。
2. **按需增删**：
   - 若组件无第三方依赖，删除 `Vue.use(ElementUI)` 等注册代码。
   - 若无需模拟复杂组件，删除 `jest.mock` 部分。
   - 根据组件功能增删测试用例（如无表单可删除输入相关测试）。
3. **异步处理**：涉及 `trigger`、`setValue`、`setProps` 等操作时，需加 `await` 确保 DOM 更新完成。
4. **断言灵活调整**：根据组件实际输出（文本、属性、事件等）修改 `expect` 断言逻辑。

该模板覆盖了组件测试的常见场景，可作为编写测试用例的基础框架，减少重复搭建工作。
