### 测试 HelloWorld 组件（HelloWorld.vue）

```vue
<!-- src/components/HelloWorld.vue -->
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="increaseCount">点击计数</button>
    <p>当前计数: {{ count }}</p>
  </div>
</template>

<script>
  export default {
    name: "HelloWorld",
    props: {
      msg: {
        type: String,
        default: "Hello World",
      },
    },
    data() {
      return {
        count: 0,
      };
    },
    methods: {
      increaseCount() {
        this.count += 1;
        this.$emit("count-changed", this.count); // 触发自定义事件
      },
    },
  };
</script>
```

### HelloWorld 组件测试（HelloWorld.spec.js）

```js
// src/components/__tests__/HelloWorld.spec.js
import { shallowMount } from "@vue/test-utils";
import HelloWorld from "../JestTest/HelloWorld.vue";

// 测试套件：针对 HelloWorld 组件
describe("HelloWorld.vue", () => {
  // 测试用例 1：检查初始渲染
  it("renders default message correctly", () => {
    // 渲染组件
    const wrapper = shallowMount(HelloWorld);

    // 断言：默认文本是否正确渲染
    expect(wrapper.find("h1").text()).toBe("Hello World");
  });

  // 测试用例 2：通过 props 自定义消息
  it("renders custom message when props are passed", () => {
    const customMsg = "Hello Vue Test";
    const wrapper = shallowMount(HelloWorld, {
      propsData: {
        msg: customMsg,
      },
    });

    // 断言：自定义文本是否正确渲染
    expect(wrapper.find("h1").text()).toBe(customMsg);
  });

  // 测试用例 3：点击按钮计数增加
  it("increases count when button is clicked", async () => {
    const wrapper = shallowMount(HelloWorld);

    // 初始计数应该是 0
    expect(wrapper.vm.count).toBe(0);

    // 找到按钮并点击
    const button = wrapper.find("button");
    await button.trigger("click"); // 注意：异步操作需要 await

    // 点击后计数应该是 1
    expect(wrapper.vm.count).toBe(1);
    expect(wrapper.find("p").text()).toBe("当前计数: 1");
  });

  // 测试用例 4：点击按钮触发自定义事件
  it("emits count-changed event when count increases", async () => {
    const wrapper = shallowMount(HelloWorld);

    // 点击按钮
    await wrapper.find("button").trigger("click");

    // 断言：是否触发了事件，且事件参数正确
    expect(wrapper.emitted("count-changed")).toBeTruthy(); // 事件是否存在
    expect(wrapper.emitted("count-changed")[0]).toEqual([1]); // 事件参数是否正确
  });
});
```
