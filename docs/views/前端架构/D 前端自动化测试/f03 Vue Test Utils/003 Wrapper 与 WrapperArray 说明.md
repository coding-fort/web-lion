# Wrapper 与 WrapperArray 详细说明（Vue Test Utils 核心概念）

在 Vue Test Utils（Vue 官方组件测试工具库）中，`Wrapper` 和 `WrapperArray` 是操作、断言 Vue 组件/DOM 的核心载体。两者本质是“包装器”，封装了真实的 DOM 元素或 Vue 组件实例，提供安全、便捷的操作 API，避免直接操作原生 DOM 导致的测试不稳定。

## 一、核心定义与区别

| 类型             | 本质                           | 生成方式                          | 核心用途                       |
| ---------------- | ------------------------------ | --------------------------------- | ------------------------------ |
| **Wrapper**      | 单个 DOM 元素/Vue 组件的包装器 | `wrapper.find()`、`wrapper.get()` | 操作/断言**单个**元素/组件     |
| **WrapperArray** | 多个 Wrapper 的集合（类数组）  | `wrapper.findAll()`               | 批量操作/断言**多个**元素/组件 |

简单说：`Wrapper` 对应“单个目标”，`WrapperArray` 对应“多个目标”，后者是前者的集合容器，且自带批量处理方法。

## 二、Wrapper 详解（单个元素/组件的操作核心）

`Wrapper` 是 Vue Test Utils 中最基础、最常用的类型，几乎所有组件测试都离不开它。它不仅封装了目标本身，还提供了访问组件实例、触发事件、获取属性等核心能力。

### 1. 如何生成 Wrapper？

通过 Vue Test Utils 提供的查询方法，从已挂载的组件（根 Wrapper）中查找目标：

```javascript
import { mount } from "@vue/test-utils";
import MyComponent from "./MyComponent.vue";

// 1. 根 Wrapper：挂载组件后直接返回的就是 Wrapper（对应整个组件）
const rootWrapper = mount(MyComponent);

// 2. 查找单个 DOM 元素（返回 Wrapper）
const buttonWrapper = rootWrapper.find("button"); // 按标签名
const inputWrapper = rootWrapper.find(".el-input"); // 按类名
const formWrapper = rootWrapper.find('[name="loginForm"]'); // 按属性

// 3. 查找单个子组件（返回 Wrapper）
const childWrapper = rootWrapper.findComponent(MyChildComponent); // 按组件对象
const elInputWrapper = rootWrapper.findComponent({ name: "ElInput" }); // 按组件名
```

> 补充：`find()` 未找到目标时，返回“空 Wrapper”（`exists()` 为 `false`）；`get()` 未找到时直接抛出错误，适合确定目标一定存在的场景。

### 2. Wrapper 核心 API（高频使用）

按功能分类，覆盖“查询、操作、断言、访问实例”四大核心场景：

#### （1）断言相关（验证目标状态）

- `exists()`：判断目标是否存在（最常用）
  ```javascript
  expect(buttonWrapper.exists()).toBeTruthy(); // 断言按钮存在
  ```
- `isVisible()`：判断目标是否可见（需 Vue 2.6+，考虑 `v-if`/`v-show`）
  ```javascript
  expect(inputWrapper.isVisible()).toBe(false); // 断言输入框隐藏
  ```
- `text()`：获取目标的文本内容（DOM 元素）
  ```javascript
  expect(buttonWrapper.text()).toBe("提交"); // 断言按钮文本
  ```
- `html()`：获取目标的 HTML 结构
  ```javascript
  expect(formWrapper.html()).toContain('<input type="text">'); // 断言 HTML 包含指定内容
  ```
- `attributes(key?)`：获取目标的 DOM 属性（无 key 时返回所有属性对象）
  ```javascript
  expect(inputWrapper.attributes("placeholder")).toBe("请输入用户名"); // 单个属性
  expect(buttonWrapper.attributes()).toEqual({
    type: "button",
    class: "submit-btn",
  }); // 所有属性
  ```
- `props(key?)`：获取子组件的 props（仅组件 Wrapper 可用）
  ```javascript
  expect(elInputWrapper.props("disabled")).toBe(false); // 单个 prop
  expect(childWrapper.props()).toEqual({ id: 1, name: "测试" }); // 所有 props
  ```

#### （2）操作相关（触发目标行为）

- `trigger(event, options?)`：触发目标的 DOM 事件（如点击、输入）
  ```javascript
  await buttonWrapper.trigger("click"); // 触发点击事件
  await inputWrapper.trigger("input", { target: { value: "123" } }); // 触发输入事件（传参）
  ```
- `setValue(value)`：给表单元素设值（输入框、选择器等，简化 `trigger('input')`）
  ```javascript
  await inputWrapper.setValue("admin"); // 给输入框设值为 'admin'
  ```
- `setProps(props)`：给子组件动态设置 props（仅组件 Wrapper 可用）
  ```javascript
  await childWrapper.setProps({ disabled: true }); // 给子组件设 disabled 为 true
  ```
- `find()`/`findComponent()`：从当前 Wrapper 中继续查找子目标（链式查询）
  ```javascript
  const submitBtn = rootWrapper.find(".form-container").find("button"); // 先找容器再找按钮
  ```

#### （3）访问组件实例（深入组件内部）

- `vm`：获取包装的 Vue 组件实例（核心！可访问 `data`/`methods`/`computed`）
  ```javascript
  // 访问组件 data
  expect(rootWrapper.vm.form.name).toBe("");
  // 调用组件方法
  rootWrapper.vm.handleSubmit();
  // 访问计算属性
  expect(rootWrapper.vm.fullName).toBe("张三");
  ```
  > 注意：`vm` 仅组件 Wrapper 可用（DOM 元素 Wrapper 的 `vm` 为 `undefined`）。

#### （4）其他常用 API

- `classes()`：获取目标的所有类名（返回数组）
  ```javascript
  expect(buttonWrapper.classes()).toContain("active"); // 断言按钮有 'active' 类
  ```
- `emitted()`：获取组件触发的自定义事件（根 Wrapper 常用）
  ```javascript
  await buttonWrapper.trigger("click");
  expect(rootWrapper.emitted("submit")[0]).toEqual([{ name: "admin" }]); // 断言事件触发并传参
  ```

### 3. Wrapper 使用注意事项

- 异步操作需加 `await`：`trigger()`、`setValue()`、`setProps()` 等会触发组件更新的操作，必须加 `await` 等待 DOM 渲染完成，否则断言可能失败。
- 区分“DOM Wrapper”和“组件 Wrapper”：DOM 元素的 Wrapper 无 `props()`、`vm` 等方法，组件 Wrapper 无 `text()`、`attributes()` 等 DOM 相关方法，误用会报错。
- 避免直接操作原生 DOM：Wrapper 提供的 API 已兼容 Vue 渲染机制，禁止通过 `wrapper.element` 直接修改 DOM（如 `wrapper.element.value = '123'`），可能导致测试不稳定。

## 三、WrapperArray 详解（多个元素/组件的批量处理）

当需要操作组件中“多个相同类型的目标”（如列表项、表单输入框、子组件列表）时，`WrapperArray` 是高效工具。它是 `Wrapper` 的集合，支持批量查询、操作、断言，无需手动循环数组。

### 1. 如何生成 WrapperArray？

通过 `wrapper.findAll()` 方法，查找所有匹配的目标，返回 `WrapperArray`：

```javascript
const rootWrapper = mount(MyComponent);

// 1. 查找多个 DOM 元素（返回 WrapperArray）
const listItemWrappers = rootWrapper.findAll(".list-item"); // 所有列表项
const buttonWrappers = rootWrapper.findAll("button"); // 所有按钮

// 2. 查找多个子组件（返回 WrapperArray）
const childWrappers = rootWrapper.findAllComponent(MyChildComponent); // 所有子组件
const elInputWrappers = rootWrapper.findAllComponent({ name: "ElInput" }); // 所有 ElInput 组件
```

> 补充：`findAll()` 未找到目标时，返回空的 `WrapperArray`（`length` 为 `0`），不会报错。

### 2. WrapperArray 核心 API（高频使用）

`WrapperArray` 的 API 主要围绕“批量处理”和“单个提取”设计，部分 API 与 `Wrapper` 同名，但作用于所有子 Wrapper：

#### （1）基础属性与单个提取

- `length`：获取集合中 Wrapper 的数量（最常用，断言渲染数量）
  ```javascript
  expect(listItemWrappers.length).toBe(3); // 断言列表渲染 3 项
  ```
- `at(index)`：根据索引获取单个 Wrapper（索引从 0 开始，核心提取方法）
  ```javascript
  const secondItem = listItemWrappers.at(1); // 获取第 2 个列表项
  expect(secondItem.text()).toBe("第二项");
  ```

#### （2）批量断言与操作

- `exists()`：判断集合中是否至少有一个 Wrapper 存在（等价于 `length > 0`）
  ```javascript
  expect(buttonWrappers.exists()).toBeTruthy(); // 断言至少有一个按钮
  ```
- `forEach(callback)`：遍历所有 Wrapper，执行回调（批量断言/操作）

  ```javascript
  // 批量断言所有列表项文本非空
  listItemWrappers.forEach(item => {
    expect(item.text()).not.toBe('');
  });

  // 批量触发所有输入框的失焦事件
  elInputWrappers.forEach(input => {
    await input.trigger('blur');
  });
  ```

- `map(callback)`：遍历所有 Wrapper，映射为新数组（批量提取数据）

  ```javascript
  // 提取所有列表项的文本，生成数组
  const itemTexts = listItemWrappers.map((item) => item.text());
  expect(itemTexts).toEqual(["第一项", "第二项", "第三项"]);

  // 提取所有子组件的 id prop
  const childIds = childWrappers.map((child) => child.props("id"));
  expect(childIds).toEqual([1, 2, 3]);
  ```

- `trigger(event, options?)`：给集合中所有 Wrapper 触发同一事件（Vue Test Utils 3+ 支持）
  ```javascript
  await buttonWrappers.trigger("click"); // 批量触发所有按钮的点击事件
  ```
- `isVisible()`：判断集合中所有 Wrapper 是否都可见（严格匹配，所有都满足才返回 `true`）
  ```javascript
  expect(elInputWrappers.isVisible()).toBe(true); // 断言所有输入框都可见
  ```

#### （3）链式查询

`WrapperArray` 也支持继续查找子目标，返回新的 `WrapperArray`（批量下钻）：

```javascript
// 查找所有列表项中的按钮（返回包含所有按钮的 WrapperArray）
const itemButtonWrappers = listItemWrappers.findAll("button");
expect(itemButtonWrappers.length).toBe(3); // 每个列表项一个按钮
```

### 3. WrapperArray 使用注意事项

- 批量异步操作需加 `await`：`trigger()`、`setValue()` 等批量操作会触发组件更新，需加 `await` 确保同步。
- 优先使用 `at(index)` 而非数组索引：`WrapperArray` 是“类数组”，虽支持 `[index]` 访问，但 `at(index)` 是官方推荐方法，兼容性更好，且语义更清晰。
- 避免过度批量操作：若只需操作集合中的部分元素（如第一个、最后一个），直接用 `at(index)` 提取单个 Wrapper 操作，效率更高。

## 四、Wrapper 与 WrapperArray 实战对比

通过两个典型场景，看两者如何配合使用：

### 场景 1：测试列表渲染

组件模板：

```vue
<ul class="todo-list">
  <li class="todo-item" v-for="(item, index) in todoList" :key="index">
    {{ item.name }}
    <button class="delete-btn">删除</button>
  </li>
</ul>
```

测试代码：

```javascript
test("todo 列表应正确渲染数据并支持删除按钮批量断言", async () => {
  const wrapper = mount(TodoList, {
    propsData: {
      todoList: [
        { name: "学习 Vue 测试" },
        { name: "掌握 Wrapper" },
        { name: "掌握 WrapperArray" },
      ],
    },
  });

  // 1. WrapperArray：断言列表项数量
  const todoItemWrappers = wrapper.findAll(".todo-item");
  expect(todoItemWrappers.length).toBe(3);

  // 2. WrapperArray.map：断言列表项文本
  const todoTexts = todoItemWrappers.map((item) => item.text().trim());
  expect(todoTexts).toEqual([
    "学习 Vue 测试",
    "掌握 Wrapper",
    "掌握 WrapperArray",
  ]);

  // 3. WrapperArray.forEach + Wrapper.find：批量断言删除按钮
  todoItemWrappers.forEach((item) => {
    const deleteBtn = item.find(".delete-btn");
    expect(deleteBtn.exists()).toBeTruthy(); // 每个列表项都有删除按钮
    expect(deleteBtn.text()).toBe("删除");
  });

  // 4. WrapperArray.at + Wrapper.trigger：操作单个列表项的按钮
  const firstDeleteBtn = todoItemWrappers.at(0).find(".delete-btn");
  await firstDeleteBtn.trigger("click");

  // 5. 重新查询，断言列表项数量减少
  expect(wrapper.findAll(".todo-item").length).toBe(2);
});
```

### 场景 2：测试表单多输入框校验

组件模板：

```vue
<el-form :model="form" :rules="rules">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="form.username" class="input-username"></el-input>
  </el-form-item>
  <el-form-item label="手机号" prop="phone">
    <el-input v-model="form.phone" class="input-phone"></el-input>
  </el-form-item>
</el-form>
```

测试代码：

```javascript
test("表单所有输入框失焦时应触发校验", async () => {
  const wrapper = mount(LoginForm);

  // 1. WrapperArray：获取所有输入框组件
  const inputWrappers = wrapper.findAllComponent(".el-input");
  expect(inputWrappers.length).toBe(2);

  // 2. WrapperArray.trigger：批量触发失焦事件
  await inputWrappers.trigger("blur");

  // 3. WrapperArray：断言校验错误提示
  const errorWrappers = wrapper.findAll(".el-form-item__error");
  expect(errorWrappers.length).toBe(2); // 两个输入框都触发错误
  expect(errorWrappers.at(0).text()).toBe("请输入用户名");
  expect(errorWrappers.at(1).text()).toBe("请输入手机号");

  // 4. Wrapper.setValue：给单个输入框设值，验证校验清除
  await inputWrappers.at(0).setValue("admin");
  await inputWrappers.at(0).trigger("blur");
  expect(wrapper.findAll(".el-form-item__error").length).toBe(1); // 仅手机号仍报错
});
```

## 五、核心总结

1. **定位差异**：`Wrapper` 管“单个”，`WrapperArray` 管“多个”，前者是基础，后者是集合扩展。
2. **使用逻辑**：先通过 `findAll()` 获取 `WrapperArray` 批量断言数量/状态，再通过 `at(index)` 提取单个 `Wrapper` 做精准操作/断言。
3. **关键原则**：
   - 异步操作必加 `await`（触发事件、设值、改 props）。
   - 优先用官方 API 而非原生 DOM 操作，保证测试稳定性。
   - 组件 Wrapper 用 `props()`/`vm`，DOM Wrapper 用 `text()`/`attributes()`，避免混用。

要不要我帮你整理一份**Wrapper + WrapperArray 常用 API 速查表**，按“断言、操作、提取”分类，方便测试时快速查阅？
