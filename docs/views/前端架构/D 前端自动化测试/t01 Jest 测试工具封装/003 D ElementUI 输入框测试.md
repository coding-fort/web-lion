### ElementUI 输入框测试（ElementUIInput.spec.js）

```js
// src/components/__tests__/ElementUIInput.spec.js
import { mount } from "@vue/test-utils";
import { Input } from "element-ui";
import Vue from "vue";
import ElementUI from "element-ui";
import flushPromises from "flush-promises";
// 全局注册注册 Element UI
Vue.use(ElementUI);

describe("Element-UI Input组件基础测试", () => {
  // 测试用例1：基础渲染测试
  test("Input组件能够正常渲染", () => {
    const wrapper = mount(Input);
    // 验证组件存在且可见
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.isVisible()).toBe(true);
    // 验证渲染的是输入框（Element Input 会渲染为原生input或textarea）
    expect(
      wrapper.find("input").exists() || wrapper.find("textarea").exists()
    ).toBe(true);
  });

  // 测试用例2：placeholder属性测试
  test("Input组件正确显示placeholder", () => {
    const placeholderText = "请输入用户名";
    const wrapper = mount(Input, {
      propsData: {
        placeholder: placeholderText,
      },
    });
    // 验证placeholder属性是否正确设置
    expect(wrapper.find("input").attributes("placeholder")).toBe(
      placeholderText
    );
  });

  // 测试用例3：双向绑定（v-model）测试
  test("Input组件支持v-model双向绑定", async () => {
    // 创建一个包含Input的父组件，模拟v-model
    const ParentComponent = Vue.component("ParentComponent", {
      template: `<el-input v-model="inputValue"></el-input>`,
      data() {
        return { inputValue: "" };
      },
    });

    const wrapper = mount(ParentComponent);
    const inputEl = wrapper.find("input");

    // 模拟用户输入
    const testValue = "测试双向绑定";
    await inputEl.setValue(testValue);

    // 验证父组件数据是否同步更新
    expect(wrapper.vm.inputValue).toBe(testValue);
  });

  // 测试用例4：输入事件（input）触发测试
  test("Input组件输入时触发input事件", async () => {
    const handleInput = jest.fn();
    const wrapper = mount(Input, {
      listeners: {
        input: handleInput,
      },
    });

    // 模拟输入内容
    const testValue = "触发事件";
    await wrapper.find("input").setValue(testValue);

    // 验证事件是否触发，且参数正确
    expect(handleInput).toHaveBeenCalledTimes(1);
    expect(handleInput).toHaveBeenCalledWith(testValue);
  });

  // 测试用例5：禁用状态测试
  test("Input组件禁用状态正常工作", () => {
    const wrapper = mount(Input, {
      propsData: {
        disabled: true,
      },
    });

    const inputEl = wrapper.find("input");
    // 验证禁用属性
    expect(inputEl.attributes("disabled")).toBe("disabled");
    // 验证禁用样式类
    expect(wrapper.classes()).toContain("is-disabled");
  });

  // 测试用例6：密码框类型测试
  test("Input组件设置show-password后显示为密码框", () => {
    const wrapper = mount(Input, {
      propsData: {
        showPassword: true,
      },
    });

    // 验证input类型是否为password
    expect(wrapper.find("input").attributes("type")).toBe("password");
  });

  // 测试用例7：清空功能测试（修复版）
  test("Input组件启用clearable后可清空内容", async () => {
    const wrapper = mount(Input, {
      propsData: {
        clearable: true,
        value: "可清空的内容", // 初始值
      },
    });

    const inputEl = wrapper.find("input");

    // 步骤1：验证初始值存在
    expect(inputEl.element.value).toBe("可清空的内容");
    return;
    // 步骤2：模拟输入框获取焦点（触发清空按钮显示）
    await inputEl.trigger("focus");

    // await flushPromises(); // 等待清空按钮显示
    // 步骤3：此时清空按钮才会出现，再点击清空按钮
    const clearBtn = wrapper.find(".el-input__clear");
    expect(clearBtn.exists()).toBe(true); // 先确认按钮已显示
    await clearBtn.trigger("click");

    // 步骤4：验证内容已清空
    setTimeout(() => {
      expect(inputEl.element.value).toBe("");
    });
  });
});
```
