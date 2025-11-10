# **Jest + Vue Test Utils 常用 API 对照表**，

按`「归属库」`、`「API 名称」`、`「核心用途」`、`「示例代码」`分类，清晰区分两者职责，方便日常查阅：

| 归属库             | API 名称            | 核心用途                                       | 示例代码                                                                                           |
| ------------------ | ------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Jest**           | `describe`          | 分组测试用例（划分模块）                       | `describe('ElInput 组件测试', () => { /* 测试用例 */ })`                                           |
| **Jest**           | `test`/`it`         | 定义单个测试用例                               | `test('输入值变化时触发事件', () => { /* 断言逻辑 */ })`                                           |
| **Jest**           | `expect`            | 启动断言（包裹待验证值）                       | `expect(wrapper.emitted('input')).toBeTruthy()`                                                    |
| **Jest**           | `toBe`              | 严格相等校验（===）                            | `expect(wrapper.vm.value).toBe('123')`                                                             |
| **Jest**           | `toEqual`           | 深相等校验（对象/数组适用）                    | `expect(wrapper.vm.form).toEqual({ name: '', age: 0 })`                                            |
| **Jest**           | `toBeTruthy`        | 真值校验（非 null/undefined/0/'' 等）          | `expect(wrapper.find('.el-button').exists()).toBeTruthy()`                                         |
| **Jest**           | `toBeFalsy`         | 假值校验                                       | `expect(wrapper.find('.hidden').exists()).toBeFalsy()`                                             |
| **Jest**           | `toContain`         | 数组/字符串包含校验                            | `expect(wrapper.text()).toContain('提交成功')`                                                     |
| **Jest**           | `mockResolvedValue` | 模拟异步函数成功返回                           | `api.fetchData.mockResolvedValue({ code: 200 })`                                                   |
| **Jest**           | `mockRejectedValue` | 模拟异步函数失败返回                           | `api.fetchData.mockRejectedValue(new Error('请求失败'))`                                           |
| **Jest**           | `beforeEach`        | 每个测试用例执行前初始化（如挂载组件）         | `beforeEach(() => { wrapper = mount(MyComponent) })`                                               |
| **Jest**           | `afterEach`         | 每个测试用例执行后清理（如销毁组件）           | `afterEach(() => { wrapper.unmount() })`                                                           |
| **Vue Test Utils** | `mount`             | 完整挂载组件（渲染所有子组件）                 | `import { mount } from '@vue/test-utils'; const wrapper = mount(MyComponent)`                      |
| **Vue Test Utils** | `shallowMount`      | 浅挂载组件（不渲染子组件，提升效率）           | `const wrapper = shallowMount(MyComponent)`                                                        |
| **Vue Test Utils** | `wrapper.find`      | 查找组件内 DOM/子组件（返回 Wrapper）          | `const input = wrapper.find('input')` / `const btn = wrapper.findComponent(ElButton)`              |
| **Vue Test Utils** | `wrapper.findAll`   | 查找多个匹配的 DOM/子组件（返回 WrapperArray） | `const items = wrapper.findAll('.list-item')`                                                      |
| **Vue Test Utils** | `exists()`          | 判断查找的元素/组件是否存在                    | `expect(wrapper.find('.el-input').exists()).toBe(true)`                                            |
| **Vue Test Utils** | `trigger`           | 触发 DOM/组件事件（如点击、输入）              | `wrapper.find('button').trigger('click')` / `input.trigger('input', { target: { value: '123' } })` |
| **Vue Test Utils** | `setValue`          | 给表单元素设置值（输入框、选择器等）           | `wrapper.find('input').setValue('测试内容')`                                                       |
| **Vue Test Utils** | `text()`            | 获取元素文本内容                               | `expect(wrapper.find('.title').text()).toBe('标题')`                                               |
| **Vue Test Utils** | `html()`            | 获取元素 HTML 结构                             | `expect(wrapper.find('.content').html()).toContain('<span>内容</span>')`                           |
| **Vue Test Utils** | `vm`                | 访问组件实例（可获取 props/data/methods）      | `expect(wrapper.vm.form.name).toBe('')` / `wrapper.vm.handleSubmit()`                              |
| **Vue Test Utils** | `emitted()`         | 获取组件触发的自定义事件                       | `expect(wrapper.emitted('submit')[0]).toEqual([{ name: '测试' }])`                                 |
| **Vue Test Utils** | `setProps`          | 动态设置组件 props                             | `await wrapper.setProps({ disabled: true })`                                                       |
| **Vue Test Utils** | `unmount`           | 销毁挂载的组件（清理测试环境）                 | `wrapper.unmount()`                                                                                |

### 核心区分原则

- **Jest**：负责「测试框架能力」（用例分组、断言匹配、异步模拟、生命周期钩子），是通用测试工具，不绑定 Vue。
- **Vue Test Utils**：负责「Vue 组件专属操作」（挂载、DOM 查询、事件触发、组件实例访问），是 Vue 生态专用测试库，需依赖 Jest 等框架运行。

要不要我帮你整理一份**Vue 组件测试通用模板**，整合上述 API 实现常见场景（表单校验、事件触发、异步请求）的测试用例？
