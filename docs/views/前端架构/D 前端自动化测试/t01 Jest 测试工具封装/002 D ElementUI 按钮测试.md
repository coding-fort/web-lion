### ElementUI 按钮测试（ElementUIButton.spec.js）

```js
// src/components/__tests__/ElementUIButton.spec.js
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
