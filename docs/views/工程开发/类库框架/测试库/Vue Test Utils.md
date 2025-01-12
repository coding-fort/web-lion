# Vue Test Utils

### 首先，确认你的组件在测试环境中被正确挂载。使用 mount 而非 shallowMount 可以确保整个组件树被渲染，这对于测试依赖于子组件或有复杂渲染逻辑的组件尤为重要。

### vitest 测试封装 element-plus 嵌套组件

```js
// 挂载父组件
const wrapper = mount(ParentComponent);
// 定位到子组件MyInput
const myInputWrapper = wrapper.findComponent(MyInput);
// 确保子组件存在
expect(myInputWrapper.exists()).toBe(true);
```

### vitest 测试封装 element-plus 组件获取输入框的值

```js
// 挂载组件
const wrapper = mount(MyInput);

// 获取ElInput实例
const inputElement = wrapper.findComponent({ name: "ElInput" });

// 确保元素存在
expect(inputElement.exists()).toBe(true);

// 设置输入框的值，这里直接通过Vue的ref来模拟
await wrapper.vm.$nextTick(); // 等待Vue完成更新
wrapper.vm.inputValue = "Test Value"; // inputValue 对于v-model
await wrapper.vm.$nextTick(); // 等待Vue响应式更新完成
// 获取输入框的值

const inputValue = wrapper.vm.inputValue;

// 验证值是否正确设置
expect(inputValue).toBe("Test Value");
```

### vitest 异步加载组件怎么判断是否存在

在 Vitest 中，你需要等待异步组件加载完成后再进行查询和断言。可以使用 waitFor 或 waitForSuspense（如果 Vitest 支持）来确保异步组件已经被加载。

```js
import { mount, waitFor } from "@vue/test-utils";
import YourComponent from "@/components/YourComponent.vue"; // 假设这是包含异步组件的父组件

describe("YourComponent", () => {
  it("loads async component correctly", async () => {
    // 挂载包含异步组件的父组件
    const wrapper = mount(YourComponent);

    // 等待异步组件加载完成
    await waitFor(() =>
      wrapper.findComponent({ name: "AsyncComponent" }).exists()
    );
    // 模块“"@vue/test-utils"”没有导出的成员“waitFor”。
    // 假设异步组件在挂载后会立即开始加载，这里模拟异步加载完成
    // await new Promise((resolve) => setTimeout(resolve, 500)); // 实际中你可能需要替换为更精确的等待条件


    // 现在可以安全地查询和断言异步组件的存在和内容
    expect(wrapper.findComponent({ name: "AsyncComponent" }).exists()).toBe(
      true
    );
    // 如果需要，还可以进一步检查组件内的元素或属性
    expect(wrapper.text()).toContain("我是异步加载的组件");
  });
});
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
