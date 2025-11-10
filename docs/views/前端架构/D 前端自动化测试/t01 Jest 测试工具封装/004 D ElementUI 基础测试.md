### ElementUI 基础测试组件（ElementTest.vue）

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

### ElementUI 基础测试（ElementTest.spec.js）

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
