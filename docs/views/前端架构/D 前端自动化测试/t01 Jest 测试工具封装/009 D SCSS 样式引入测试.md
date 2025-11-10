### SCSS 变量引入测试组件（ImportCssTest.vue）

```scss
$font-size: 15px;
$base-color: #faa;

:export {
  color: $base-color;
  fontSize: $font-size;
}
```

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
  import variables from "@/components/JestTest/public/var.scss";
  export default {
    name: "ImportCssTest",
    computed: {
      variables() {
        return variables;
      },
    },
  };
</script>

<style scoped>
  @import "@/components/JestTest/public/var.css";

  .import-css-test {
    padding: 20px;
  }

  .test-box {
    border: 1px solid #ccc;
    padding: 20px;
  }

  .test-item {
    margin-bottom: 10px;
  }

  .test-title {
    font-size: 16px;
    font-weight: bold;
  }

  .test-content {
    font-size: 14px;
  }
</style>
```

### SCSS 样式引入测试（ImportCssTest.spec.js）

- 需要在`jest.config.js`中配置 SCSS 转换工具

```js
// src/components/__tests__/ImportCssTest.spec.js
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
